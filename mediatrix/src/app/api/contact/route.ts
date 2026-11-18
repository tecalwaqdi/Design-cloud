import { NextResponse } from "next/server";
import { clientIp } from "@/lib/auth";
import { addMessage } from "@/lib/store";

const recent = new Map<string, number>();

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (Date.now() - (recent.get(ip) || 0) < 20_000) return NextResponse.json({ error: "slow down" }, { status: 429 });

  const body = await req.json().catch(() => null);
  const clip = (v: unknown, n: number) => (typeof v === "string" ? v.trim().slice(0, n) : "");
  const msg = {
    name: clip(body?.name, 120),
    email: clip(body?.email, 160),
    phone: clip(body?.phone, 40),
    message: clip(body?.message, 4000),
  };
  if (body?.website) return NextResponse.json({ ok: true }); // honeypot
  if (!msg.name || !msg.message || (!msg.email && !msg.phone)) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }
  recent.set(ip, Date.now());
  await addMessage({ id: crypto.randomUUID(), ...msg, at: new Date().toISOString(), read: false });
  return NextResponse.json({ ok: true });
}
