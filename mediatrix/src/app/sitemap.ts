import type { MetadataRoute } from "next";
import { getContent } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  const c = await getContent();
  const lastModified = c.updatedAt && !c.updatedAt.startsWith("1970") ? new Date(c.updatedAt) : new Date();
  const page = (path: string, priority: number, changeFrequency: "weekly" | "yearly") =>
    (["ar", "en"] as const).map((l) => ({
      url: `${base}/${l}${path}`,
      lastModified,
      changeFrequency,
      priority,
      alternates: { languages: { ar: `${base}/ar${path}`, en: `${base}/en${path}`, "x-default": `${base}/ar${path}` } },
    }));
  return [...page("", 1, "weekly"), ...page("/privacy", 0.3, "yearly")];
}
