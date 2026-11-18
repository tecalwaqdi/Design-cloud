import { NextResponse } from "next/server";
import { getContent, today, updateStats } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const content = await getContent();
  const country = content.countries.find((c) => c.id === id && c.enabled);
  const back = new URL(req.headers.get("referer") || "/", req.url);
  if (!country || !/^https?:\/\//i.test(country.storeUrl)) return NextResponse.redirect(back);

  await updateStats((s) => {
    const day = today();
    s.clicks[id] = s.clicks[id] || {};
    s.clicks[id][day] = (s.clicks[id][day] || 0) + 1;
  });

  const target = new URL(country.storeUrl);
  if (!target.searchParams.has("utm_source")) {
    target.searchParams.set("utm_source", "mediatrix");
    target.searchParams.set("utm_medium", "portal");
    target.searchParams.set("utm_campaign", id);
  }
  return NextResponse.redirect(target, 302);
}
