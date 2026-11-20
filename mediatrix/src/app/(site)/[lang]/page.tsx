import { headers } from "next/headers";
import { Hero } from "@/components/site/Hero";
import { RenderSection } from "@/components/site/Sections";
import { t, tr } from "@/lib/i18n";
import { getContent } from "@/lib/store";
import type { Lang } from "@/lib/types";

async function detectCountry(): Promise<string | undefined> {
  // 1) Cloudflare's own geolocation of the request
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const cc = (getCloudflareContext().cf as { country?: string } | undefined)?.country;
    if (cc && /^[A-Z]{2}$/i.test(cc) && cc.toUpperCase() !== "XX") return cc.toUpperCase();
  } catch {}
  // 2) Country headers from common CDNs / hosts
  const h = await headers();
  const v = h.get("cf-ipcountry") || h.get("x-vercel-ip-country") || h.get("x-country-code");
  return v && /^[A-Z]{2}$/i.test(v) && v.toUpperCase() !== "XX" ? v.toUpperCase() : undefined;
}

export default async function Home({ params, searchParams }: { params: Promise<{ lang: Lang }>; searchParams: Promise<{ country?: string }> }) {
  const { lang } = await params;
  const c = await getContent();
  // ?country=SA lets you preview the order a visitor from another country sees.
  const forced = (await searchParams).country;
  const visitorCountry = forced && /^[A-Za-z]{2}$/.test(forced) ? forced.toUpperCase() : await detectCountry();

  return (
    <>
      <Hero
        welcome={tr(c.hero.welcome, lang)}
        tagline={tr(c.identity.tagline, lang)}
        subtitle={tr(c.hero.subtitle, lang)}
        bannerUrl={c.hero.bannerUrl}
        scrollLabel={t("scroll", lang)}
        rtl={lang === "ar"}
        captions={c.hero.slides.slice(0, 2).map((s) => ({ title: tr(s.title, lang), sub: tr(s.sub, lang) }))}
      />
      {c.sections
        .filter((s) => s.visible)
        .map((s) => (
          <RenderSection key={s.key} k={s.key} c={c} lang={lang} visitorCountry={visitorCountry} />
        ))}
    </>
  );
}
