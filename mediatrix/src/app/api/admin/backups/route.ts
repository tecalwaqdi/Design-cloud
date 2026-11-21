import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/auth";
import { listBackups, restoreBackup } from "@/lib/store";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json(await listBackups());
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await req.json().catch(() => ({}));
  if (typeof id !== "string" || !/^[\w-]+$/.test(id)) return NextResponse.json({ error: "bad id" }, { status: 400 });
  const restored = await restoreBackup(id);
  if (!restored) return NextResponse.json({ error: "not found" }, { status: 404 });
  revalidatePath("/", "layout");
  return NextResponse.json(restored);
}
