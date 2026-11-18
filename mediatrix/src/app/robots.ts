import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  const base = process.env.SITE_URL || "";
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/go"] }], sitemap: base ? `${base}/sitemap.xml` : undefined };
}
