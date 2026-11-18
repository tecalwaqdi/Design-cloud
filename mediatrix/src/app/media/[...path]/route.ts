import { getUpload } from "@/lib/store";

export async function GET(req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const key = (await params).path.join("/");
  if (key.includes("..")) return new Response("forbidden", { status: 403 });

  // Range support so uploaded videos can stream / seek (Safari requires it).
  const m = /bytes=(\d*)-(\d*)/.exec(req.headers.get("range") || "");
  const range = m && m[1] ? { start: parseInt(m[1], 10), end: m[2] ? parseInt(m[2], 10) : undefined } : undefined;
  const obj = await getUpload(key, range);
  if (!obj) return new Response("not found", { status: 404 });

  const headers: Record<string, string> = {
    "content-type": obj.contentType,
    "cache-control": "public, max-age=31536000, immutable",
    "accept-ranges": "bytes",
    "x-content-type-options": "nosniff",
  };
  if (obj.contentType === "image/svg+xml") headers["content-security-policy"] = "script-src 'none'";
  if (obj.range) {
    headers["content-range"] = `bytes ${obj.range.start}-${obj.range.end}/${obj.size}`;
    headers["content-length"] = String(obj.range.end - obj.range.start + 1);
    return new Response(obj.body as BodyInit, { status: 206, headers });
  }
  headers["content-length"] = String(obj.size);
  return new Response(obj.body as BodyInit, { headers });
}
