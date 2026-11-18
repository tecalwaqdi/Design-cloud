import { NextResponse } from "next/server";
import { checkPassword, loginAllowed, recordLogin } from "@/lib/auth";
import { createSession, SESSION_COOKIE, sessionCookieOptions } from "@/lib/session";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (!loginAllowed(ip)) return NextResponse.json({ error: "محاولات كثيرة، حاول بعد ١٥ دقيقة" }, { status: 429 });
  const { password } = await req.json().catch(() => ({ password: "" }));
  const ok = typeof password === "string" && password.length > 0 && (await checkPassword(password));
  recordLogin(ip, ok);
  if (!ok) return NextResponse.json({ error: "كلمة المرور غير صحيحة" }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, await createSession(), sessionCookieOptions);
  return res;
}
