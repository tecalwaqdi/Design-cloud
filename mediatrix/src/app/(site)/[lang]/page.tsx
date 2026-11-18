import { headers } from "next/headers";
import { Hero } from "@/components/site/Hero";
import { RenderSection } from "@/components/site/Sections";
import { t, tr } from "@/lib/i18n";
import { getContent } from "@/lib/store";
import type { Lang } from "@/lib/types";

export default async function Home({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const c = await getContent();
  const h = await headers();
  // Country hint from common CDNs / hosts (Vercel, Cloudflare, generic proxies).
  const visitorCountry = h.get("x-vercel-ip-country") || h.get("cf-ipcountry") || h.get("x-country-code") || undefined;

  return (
    <>
      <Hero
        welcome={tr(c.hero.welcome, lang)}
        name={c.identity.name}
        tagline={tr(c.identity.tagline, lang)}
        subtitle={tr(c.hero.subtitle, lang)}
        bannerUrl={c.hero.bannerUrl}
        scrollLabel={t("scroll", lang)}
      />
      {c.sections
        .filter((s) => s.visible)
        .map((s) => (
          <RenderSection key={s.key} k={s.key} c={c} lang={lang} visitorCountry={visitorCountry} />
        ))}
    </>
  );
}
