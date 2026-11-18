import "server-only";
import { defaultContent, emptyStats } from "./defaults";
import type { ContactMessage, Content, Stats } from "./types";

/*
 * Storage with two backends:
 *  - Cloudflare (production): D1 for content / stats / messages, R2 for uploads.
 *  - Node filesystem (fallback for `next start` / Docker): JSON files + uploads/ in DATA_DIR.
 * The backend is picked per request: if the Cloudflare bindings exist we use them.
 */

/* ---------------------------------------------------------------- types */

type UploadObject = { body: ReadableStream | Uint8Array; size: number; contentType: string; range?: { start: number; end: number } };

interface Backend {
  getKV(key: string): Promise<string | null>;
  setKV(key: string, value: string): Promise<void>;
  addVisit(day: string): Promise<void>;
  addClick(country: string, day: string): Promise<void>;
  getStats(): Promise<Stats>;
  addMessage(m: ContactMessage): Promise<void>;
  setMessageRead(id: string, read: boolean): Promise<void>;
  deleteMessage(id: string): Promise<void>;
  putUpload(key: string, data: ArrayBuffer, contentType: string): Promise<void>;
  getUpload(key: string, range?: { start: number; end?: number }): Promise<UploadObject | null>;
}

/* ----------------------------------------------------- Cloudflare backend */

// Minimal shapes of the Cloudflare bindings we use (avoids pulling the global
// workers-types, which conflict with the DOM lib used by the client code).
interface D1Result { results: unknown[] }
interface D1Statement {
  bind(...v: unknown[]): D1Statement;
  first<T>(): Promise<T | null>;
  run(): Promise<unknown>;
}
interface D1Database {
  prepare(sql: string): D1Statement;
  batch(s: D1Statement[]): Promise<D1Result[]>;
}
interface R2Object { body: ReadableStream }
interface R2Head { size: number; httpMetadata?: { contentType?: string } }
interface R2Bucket {
  put(key: string, data: ArrayBuffer, opts?: { httpMetadata?: { contentType?: string } }): Promise<unknown>;
  head(key: string): Promise<R2Head | null>;
  get(key: string, opts?: { range?: { offset: number; length: number } }): Promise<R2Object | null>;
}
type CFEnv = { DB?: D1Database; MEDIA?: R2Bucket };

let schemaReady: Promise<unknown> | null = null;
function ensureSchema(db: D1Database) {
  schemaReady ??= db
    .batch([
      db.prepare("CREATE TABLE IF NOT EXISTS kv (k TEXT PRIMARY KEY, v TEXT NOT NULL)"),
      db.prepare("CREATE TABLE IF NOT EXISTS visits (day TEXT PRIMARY KEY, n INTEGER NOT NULL DEFAULT 0)"),
      db.prepare("CREATE TABLE IF NOT EXISTS clicks (country TEXT NOT NULL, day TEXT NOT NULL, n INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (country, day))"),
      db.prepare(
        "CREATE TABLE IF NOT EXISTS messages (id TEXT PRIMARY KEY, name TEXT, email TEXT, phone TEXT, message TEXT, at TEXT, read INTEGER NOT NULL DEFAULT 0)",
      ),
    ])
    .catch((e) => {
      schemaReady = null;
      throw e;
    });
  return schemaReady;
}

function cloudflareBackend(db: D1Database, bucket?: R2Bucket): Backend {
  const q = async () => {
    await ensureSchema(db);
    return db;
  };
  return {
    async getKV(key) {
      const row = await (await q()).prepare("SELECT v FROM kv WHERE k = ?").bind(key).first<{ v: string }>();
      return row?.v ?? null;
    },
    async setKV(key, value) {
      await (await q()).prepare("INSERT INTO kv (k, v) VALUES (?, ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v").bind(key, value).run();
    },
    async addVisit(day) {
      await (await q()).prepare("INSERT INTO visits (day, n) VALUES (?, 1) ON CONFLICT(day) DO UPDATE SET n = n + 1").bind(day).run();
    },
    async addClick(country, day) {
      await (await q())
        .prepare("INSERT INTO clicks (country, day, n) VALUES (?, ?, 1) ON CONFLICT(country, day) DO UPDATE SET n = n + 1")
        .bind(country, day)
        .run();
    },
    async getStats() {
      const d = await q();
      const [v, c, m] = await d.batch([
        d.prepare("SELECT day, n FROM visits ORDER BY day DESC LIMIT 400"),
        d.prepare("SELECT country, day, n FROM clicks"),
        d.prepare("SELECT * FROM messages ORDER BY at DESC LIMIT 1000"),
      ]);
      const stats: Stats = { visits: {}, clicks: {}, messages: [] };
      for (const r of v.results as { day: string; n: number }[]) stats.visits[r.day] = r.n;
      for (const r of c.results as { country: string; day: string; n: number }[]) {
        (stats.clicks[r.country] ??= {})[r.day] = r.n;
      }
      stats.messages = (m.results as (Omit<ContactMessage, "read"> & { read: number })[]).map((r) => ({ ...r, read: !!r.read }));
      return stats;
    },
    async addMessage(msg) {
      await (await q())
        .prepare("INSERT INTO messages (id, name, email, phone, message, at, read) VALUES (?, ?, ?, ?, ?, ?, 0)")
        .bind(msg.id, msg.name, msg.email, msg.phone, msg.message, msg.at)
        .run();
    },
    async setMessageRead(id, read) {
      await (await q()).prepare("UPDATE messages SET read = ? WHERE id = ?").bind(read ? 1 : 0, id).run();
    },
    async deleteMessage(id) {
      await (await q()).prepare("DELETE FROM messages WHERE id = ?").bind(id).run();
    },
    async putUpload(key, data, contentType) {
      if (!bucket) throw new Error("R2 bucket binding MEDIA is missing");
      await bucket.put(key, data, { httpMetadata: { contentType } });
    },
    async getUpload(key, range) {
      if (!bucket) return null;
      const head = await bucket.head(key);
      if (!head) return null;
      const size = head.size;
      const contentType = head.httpMetadata?.contentType || "application/octet-stream";
      if (range) {
        const end = Math.min(range.end ?? size - 1, size - 1);
        const obj = await bucket.get(key, { range: { offset: range.start, length: end - range.start + 1 } });
        if (!obj) return null;
        return { body: obj.body, size, contentType, range: { start: range.start, end } };
      }
      const obj = await bucket.get(key);
      return obj ? { body: obj.body, size, contentType } : null;
    },
  };
}

/* ----------------------------------------------------- filesystem backend */

function fsBackend(): Backend {
  const dataDir = () => process.env.DATA_DIR || "./data";
  const mod = async () => {
    const [fs, path] = await Promise.all([import("fs/promises"), import("path")]);
    const root = path.resolve(dataDir());
    return { fs, path, root };
  };
  let queue: Promise<unknown> = Promise.resolve();
  const serial = <T,>(fn: () => Promise<T>): Promise<T> => {
    const next = queue.then(fn, fn);
    queue = next.catch(() => undefined);
    return next;
  };
  const read = async <T,>(name: string): Promise<T | null> => {
    const { fs, path, root } = await mod();
    try {
      return JSON.parse(await fs.readFile(path.join(root, name), "utf8")) as T;
    } catch {
      return null;
    }
  };
  const write = async (name: string, data: unknown) => {
    const { fs, path, root } = await mod();
    await fs.mkdir(root, { recursive: true });
    const file = path.join(root, name);
    const tmp = `${file}.${Date.now()}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
    await fs.rename(tmp, file);
  };
  const stats = async () => ({ ...emptyStats, ...((await read<Stats>("stats.json")) ?? {}) });
  const mutate = (fn: (s: Stats) => void) =>
    serial(async () => {
      const s = await stats();
      fn(s);
      await write("stats.json", s);
    });
  const uploadPath = async (key: string) => {
    const { path, root } = await mod();
    const dir = path.join(root, "uploads");
    const file = path.resolve(dir, key);
    if (!file.startsWith(dir + path.sep)) throw new Error("bad path");
    return file;
  };

  return {
    async getKV(key) {
      const all = (await read<Record<string, string>>("kv.json")) ?? {};
      return all[key] ?? null;
    },
    setKV: (key, value) =>
      serial(async () => {
        const all = (await read<Record<string, string>>("kv.json")) ?? {};
        all[key] = value;
        await write("kv.json", all);
      }),
    addVisit: (day) => mutate((s) => void (s.visits[day] = (s.visits[day] || 0) + 1)),
    addClick: (country, day) =>
      mutate((s) => {
        const c = (s.clicks[country] ??= {});
        c[day] = (c[day] || 0) + 1;
      }),
    getStats: stats,
    addMessage: (m) => mutate((s) => void (s.messages = [m, ...s.messages].slice(0, 1000))),
    setMessageRead: (id, read) => mutate((s) => void (s.messages = s.messages.map((m) => (m.id === id ? { ...m, read } : m)))),
    deleteMessage: (id) => mutate((s) => void (s.messages = s.messages.filter((m) => m.id !== id))),
    async putUpload(key, data) {
      const { fs, path } = await mod();
      const file = await uploadPath(key);
      await fs.mkdir(path.dirname(file), { recursive: true });
      await fs.writeFile(file, new Uint8Array(data));
    },
    async getUpload(key, range) {
      const { fs, path } = await mod();
      let file: string;
      try {
        file = await uploadPath(key);
      } catch {
        return null;
      }
      const buf = await fs.readFile(file).catch(() => null);
      if (!buf) return null;
      const contentType = MIME[path.extname(file).toLowerCase()] || "application/octet-stream";
      if (range) {
        const end = Math.min(range.end ?? buf.length - 1, buf.length - 1);
        return { body: new Uint8Array(buf.subarray(range.start, end + 1)), size: buf.length, contentType, range: { start: range.start, end } };
      }
      return { body: new Uint8Array(buf), size: buf.length, contentType };
    },
  };
}

export const MIME: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
};

/* ------------------------------------------------------------- selection */

async function backend(): Promise<Backend> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { env } = await getCloudflareContext({ async: true });
    const cf = env as unknown as CFEnv;
    if (cf.DB) return cloudflareBackend(cf.DB, cf.MEDIA);
  } catch {
    // not running on Cloudflare (or dev without bindings) -> filesystem
  }
  return fsBackend();
}

/* ------------------------------------------------------------ public API */

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

// Fill in keys added to the defaults after the content was first saved.
function mergeDefaults<T>(base: T, saved: unknown): T {
  if (!isPlainObject(base) || !isPlainObject(saved)) return (saved ?? base) as T;
  const out: Record<string, unknown> = { ...base };
  for (const [k, v] of Object.entries(saved)) {
    out[k] = k in base ? mergeDefaults((base as Record<string, unknown>)[k], v) : v;
  }
  return out as T;
}

export async function getContent(): Promise<Content> {
  const raw = await (await backend()).getKV("content");
  const content = raw ? mergeDefaults(defaultContent, JSON.parse(raw)) : structuredClone(defaultContent);
  const keys = new Set(content.sections.map((s) => s.key));
  for (const s of defaultContent.sections) if (!keys.has(s.key)) content.sections.push({ ...s });
  return content;
}

export async function saveContent(content: Content): Promise<Content> {
  const next = { ...content, updatedAt: new Date().toISOString() };
  await (await backend()).setKV("content", JSON.stringify(next));
  return next;
}

export async function getAuth(): Promise<{ passwordHash?: string }> {
  const raw = await (await backend()).getKV("auth");
  return raw ? JSON.parse(raw) : {};
}

export async function setAuth(data: { passwordHash: string }) {
  await (await backend()).setKV("auth", JSON.stringify(data));
}

export const today = () => new Date().toISOString().slice(0, 10);

export const getStats = async () => (await backend()).getStats();
export const addVisit = async () => (await backend()).addVisit(today());
export const addClick = async (country: string) => (await backend()).addClick(country, today());
export const addMessage = async (m: ContactMessage) => (await backend()).addMessage(m);
export const setMessageRead = async (id: string, read: boolean) => (await backend()).setMessageRead(id, read);
export const deleteMessage = async (id: string) => (await backend()).deleteMessage(id);
export const putUpload = async (key: string, data: ArrayBuffer, contentType: string) => (await backend()).putUpload(key, data, contentType);
export const getUpload = async (key: string, range?: { start: number; end?: number }) => (await backend()).getUpload(key, range);
