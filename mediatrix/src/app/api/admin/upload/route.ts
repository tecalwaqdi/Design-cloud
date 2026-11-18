import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { isAdmin } from "@/lib/auth";
import { UPLOAD_DIR } from "@/lib/store";

const IMG = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".avif"];
const VID = [".mp4", ".webm", ".mov"];

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "no file" }, { status: 400 });
  const ext = path.extname(file.name).toLowerCase();
  const isImg = IMG.includes(ext);
  const isVid = VID.includes(ext);
  if (!isImg && !isVid) return NextResponse.json({ error: "نوع الملف غير مدعوم" }, { status: 400 });
  const max = (isVid ? 80 : 12) * 1024 * 1024;
  if (file.size > max) return NextResponse.json({ error: `الحد الأقصى ${max / 1024 / 1024}MB` }, { status: 400 });

  const month = new Date().toISOString().slice(0, 7);
  const name = `${crypto.randomUUID().slice(0, 12)}${ext}`;
  const dir = path.join(UPLOAD_DIR, month);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ url: `/media/${month}/${name}`, type: isVid ? "video" : "image" });
}
