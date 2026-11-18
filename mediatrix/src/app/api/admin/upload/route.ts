import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { MIME, putUpload } from "@/lib/store";

const VID = [".mp4", ".webm", ".mov"];

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "no file" }, { status: 400 });
  const ext = (file.name.match(/\.[a-z0-9]+$/i)?.[0] || "").toLowerCase();
  const type = MIME[ext];
  if (!type) return NextResponse.json({ error: "نوع الملف غير مدعوم" }, { status: 400 });
  const isVid = VID.includes(ext);
  const max = (isVid ? 25 : 12) * 1024 * 1024;
  if (file.size > max) return NextResponse.json({ error: `الحد الأقصى ${max / 1024 / 1024}MB` }, { status: 400 });

  const key = `${new Date().toISOString().slice(0, 7)}/${crypto.randomUUID().slice(0, 12)}${ext}`;
  await putUpload(key, await file.arrayBuffer(), type);
  return NextResponse.json({ url: `/media/${key}`, type: isVid ? "video" : "image" });
}
