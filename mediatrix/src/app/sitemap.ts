import type { MetadataRoute } from "next";
export const dynamic = "force-dynamic";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.SITE_URL || "http://localhost:3000";
  return ["ar", "en"].flatMap((l) => [
    { url: `${base}/${l}`, changeFrequency: "weekly" as const, priority: 1 },
    { url: `${base}/${l}/privacy`, changeFrequency: "yearly" as const, priority: 0.3 },
  ]);
}
