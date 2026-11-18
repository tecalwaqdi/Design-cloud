import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { defaultContent, emptyStats } from "./defaults";
import type { Content, Stats } from "./types";

export const DATA_DIR = path.resolve(process.env.DATA_DIR || "./data");
export const UPLOAD_DIR = path.join(DATA_DIR, "uploads");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");
const STATS_FILE = path.join(DATA_DIR, "stats.json");
const AUTH_FILE = path.join(DATA_DIR, "auth.json");

// Serialise all writes so concurrent requests never interleave on disk.
let queue: Promise<unknown> = Promise.resolve();
function serial<T>(fn: () => Promise<T>): Promise<T> {
  const next = queue.then(fn, fn);
  queue = next.catch(() => undefined);
  return next;
}

async function readJson<T>(file: string): Promise<T | null> {
  try {
    return JSON.parse(await fs.readFile(file, "utf8")) as T;
  } catch {
    return null;
  }
}

async function writeJson(file: string, data: unknown) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tmp, file);
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

// Fill in keys added to the defaults after the content file was first saved.
function mergeDefaults<T>(base: T, saved: unknown): T {
  if (!isPlainObject(base) || !isPlainObject(saved)) return (saved ?? base) as T;
  const out: Record<string, unknown> = { ...base };
  for (const [k, v] of Object.entries(saved)) {
    out[k] = k in base ? mergeDefaults((base as Record<string, unknown>)[k], v) : v;
  }
  return out as T;
}

export async function getContent(): Promise<Content> {
  const saved = await readJson<Content>(CONTENT_FILE);
  const content = saved ? mergeDefaults(defaultContent, saved) : structuredClone(defaultContent);
  // Make sure every known section exists exactly once (new sections get appended).
  const keys = new Set(content.sections.map((s) => s.key));
  for (const s of defaultContent.sections) if (!keys.has(s.key)) content.sections.push({ ...s });
  return content;
}

export async function saveContent(content: Content): Promise<Content> {
  return serial(async () => {
    const next = { ...content, updatedAt: new Date().toISOString() };
    await writeJson(CONTENT_FILE, next);
    return next;
  });
}

export async function getStats(): Promise<Stats> {
  return { ...emptyStats, ...((await readJson<Stats>(STATS_FILE)) ?? {}) };
}

export async function updateStats(fn: (s: Stats) => void): Promise<void> {
  await serial(async () => {
    const s = await getStats();
    fn(s);
    await writeJson(STATS_FILE, s);
  });
}

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function getAuth(): Promise<{ passwordHash?: string }> {
  return (await readJson<{ passwordHash?: string }>(AUTH_FILE)) ?? {};
}

export async function setAuth(data: { passwordHash: string }) {
  await serial(() => writeJson(AUTH_FILE, data));
}
