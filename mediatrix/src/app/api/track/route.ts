import { NextResponse } from "next/server";
import { addVisit } from "@/lib/store";

export async function POST(req: Request) {
  const ua = req.headers.get("user-agent") || "";
  if (!/bot|crawl|spider|preview/i.test(ua)) await addVisit();
  return NextResponse.json({ ok: true });
}
