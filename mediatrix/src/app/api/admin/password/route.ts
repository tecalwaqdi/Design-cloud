import { NextResponse } from "next/server";
import { changePassword, checkPassword, isAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { current, next } = await req.json().catch(() => ({}));
  if (typeof next !== "string" || next.length < 8) return NextResponse.json({ error: "كلمة المرور الجديدة يجب أن تكون ٨ أحرف على الأقل" }, { status: 400 });
  if (!(await checkPassword(String(current || "")))) return NextResponse.json({ error: "كلمة المرور الحالية غير صحيحة" }, { status: 400 });
  await changePassword(next);
  return NextResponse.json({ ok: true });
}
