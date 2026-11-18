import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getStats, updateStats } from "@/lib/store";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json((await getStats()).messages);
}

export async function PATCH(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id, read, remove } = await req.json().catch(() => ({}));
  await updateStats((s) => {
    if (remove) s.messages = s.messages.filter((m) => m.id !== id);
    else s.messages = s.messages.map((m) => (m.id === id ? { ...m, read: !!read } : m));
  });
  return NextResponse.json((await getStats()).messages);
}
