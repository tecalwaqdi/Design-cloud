import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/auth";
import { getContent, saveContent } from "@/lib/store";
import type { Content } from "@/lib/types";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json(await getContent());
}

const safeUrl = (u: unknown) => (typeof u === "string" && (u === "" || /^(https?:\/\/|\/media\/|\/)/i.test(u)) ? u : "");

export async function PUT(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = (await req.json().catch(() => null)) as Content | null;
  if (!body || !Array.isArray(body.countries) || !body.identity || !Array.isArray(body.sections)) {
    return NextResponse.json({ error: "invalid content" }, { status: 400 });
  }
  // Never store javascript: or other odd URL schemes in links.
  body.countries = body.countries.map((c) => ({
    ...c,
    id: String(c.id).toLowerCase().replace(/[^a-z0-9-]/g, "") || crypto.randomUUID().slice(0, 6),
    flag: String(c.flag || "").toUpperCase().slice(0, 2),
    storeUrl: /^https?:\/\//i.test(c.storeUrl || "") ? c.storeUrl.trim() : "",
    mediaUrl: safeUrl(c.mediaUrl) || undefined,
  }));
  body.branches = (body.branches || []).map((b) => ({ ...b, mapUrl: safeUrl(b.mapUrl) }));
  body.partners = (body.partners || []).map((p) => ({ ...p, url: safeUrl(p.url), logoUrl: safeUrl(p.logoUrl) || undefined }));
  for (const k of Object.keys(body.contact.social) as (keyof Content["contact"]["social"])[]) {
    body.contact.social[k] = safeUrl(body.contact.social[k]);
  }
  body.seo.gaId = String(body.seo.gaId || "").replace(/[^A-Za-z0-9-]/g, "");
  if (body.assistant && !["claude-opus-5-5", "claude-sonnet-5-5", "claude-haiku-5-5"].includes(body.assistant.model)) {
    body.assistant.model = "claude-opus-5-5";
  }
  if (body.assistant && !["free", "gemini", "claude"].includes(body.assistant.provider)) body.assistant.provider = "free";
  const saved = await saveContent(body);
  revalidatePath("/", "layout");
  return NextResponse.json(saved);
}
