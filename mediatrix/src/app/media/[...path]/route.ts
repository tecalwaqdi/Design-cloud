import { promises as fs } from "fs";
import path from "path";
import { UPLOAD_DIR } from "@/lib/store";

const TYPES: Record<string, string> = {
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp",
  ".gif": "image/gif", ".svg": "image/svg+xml", ".avif": "image/avif",
  ".mp4": "video/mp4", ".webm": "video/webm", ".mov": "video/quicktime",
};

export async function GET(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const rel = (await params).path.join("/");
  const file = path.resolve(UPLOAD_DIR, rel);
  if (!file.startsWith(UPLOAD_DIR + path.sep)) return new Response("forbidden", { status: 403 });
  let stat;
  try {
    stat = await fs.stat(file);
  } catch {
    return new Response("not found", { status: 404 });
  }
  const type = TYPES[path.extname(file).toLowerCase()] || "application/octet-stream";
  const headers: Record<string, string> = {
    "content-type": type,
    "cache-control": "public, max-age=31536000, immutable",
    "accept-ranges": "bytes",
    "x-content-type-options": "nosniff",
  };
  if (type === "image/svg+xml") headers["content-security-policy"] = "script-src 'none'";

  // Range support so uploaded videos can stream / seek (Safari requires it).
  const range = req.headers.get("range");
  const buf = await fs.readFile(file);
  if (range) {
    const m = /bytes=(\d*)-(\d*)/.exec(range);
    const start = m && m[1] ? parseInt(m[1], 10) : 0;
    const end = m && m[2] ? Math.min(parseInt(m[2], 10), stat.size - 1) : stat.size - 1;
    return new Response(buf.subarray(start, end + 1), {
      status: 206,
      headers: { ...headers, "content-range": `bytes ${start}-${end}/${stat.size}`, "content-length": String(end - start + 1) },
    });
  }
  return new Response(buf, { headers: { ...headers, "content-length": String(stat.size) } });
}
