import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { deleteMessage, getStats, setMessageRead } from "@/lib/store";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json((await getStats()).messages);
}

export async function PATCH(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id, read, remove } = await req.json().catch(() => ({}));
  if (typeof id !== "string") return NextResponse.json({ error: "bad id" }, { status: 400 });
  if (remove) await deleteMessage(id);
  else await setMessageRead(id, !!read);
  return NextResponse.json((await getStats()).messages);
}
