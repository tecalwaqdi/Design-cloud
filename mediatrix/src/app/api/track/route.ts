import { NextResponse } from "next/server";
import { today, updateStats } from "@/lib/store";

export async function POST(req: Request) {
  const ua = req.headers.get("user-agent") || "";
  if (!/bot|crawl|spider|preview/i.test(ua)) {
    await updateStats((s) => {
      const d = today();
      s.visits[d] = (s.visits[d] || 0) + 1;
    });
  }
  return NextResponse.json({ ok: true });
}
