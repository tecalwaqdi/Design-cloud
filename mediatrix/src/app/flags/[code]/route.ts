import * as flags from "country-flag-icons/string/3x2";

export async function GET(_: Request, { params }: { params: Promise<{ code: string }> }) {
  const code = (await params).code.replace(/\.svg$/, "").toUpperCase();
  const svg = (flags as Record<string, string>)[code];
  if (!svg) return new Response("not found", { status: 404 });
  return new Response(svg, {
    headers: { "content-type": "image/svg+xml", "cache-control": "public, max-age=31536000, immutable" },
  });
}
