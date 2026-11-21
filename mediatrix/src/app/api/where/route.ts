import { NextResponse } from "next/server";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

// What the site sees about the visitor's location (no IP is returned).
export async function GET() {
  let cf: Record<string, unknown> = {};
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    cf = (getCloudflareContext().cf as Record<string, unknown>) || {};
  } catch {}
  const h = await headers();
  return NextResponse.json(
    { country: cf.country ?? h.get("cf-ipcountry") ?? null, city: cf.city ?? null, timezone: cf.timezone ?? null, network: cf.asOrganization ?? null, datacenter: cf.colo ?? null },
    { headers: { "cache-control": "no-store" } },
  );
}
