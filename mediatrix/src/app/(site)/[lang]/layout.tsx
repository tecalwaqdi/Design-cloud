import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../../globals.css";
import { fontVars } from "@/lib/fonts";
import { dirOf, isLang, t, tr } from "@/lib/i18n";
import { getContent } from "@/lib/store";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Intro } from "@/components/site/Intro";
import { VisitTracker } from "@/components/site/VisitTracker";
import { WhatsApp } from "@/components/site/WhatsApp";
import type { Lang } from "@/lib/types";

export const dynamic = "force-dynamic";

export const viewport: Viewport = { themeColor: "#eef4f5" };

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const c = await getContent();
  const base = process.env.SITE_URL;
  const title = tr(c.seo.title, lang);
  const description = tr(c.seo.description, lang);
  const ogImage = c.seo.ogImage || `/og-${lang}.png`;
  return {
    metadataBase: base ? new URL(base) : undefined,
    title,
    description,
    keywords: c.seo.keywords,
    applicationName: c.identity.name,
    alternates: { canonical: `/${lang}`, languages: { ar: "/ar", en: "/en", "x-default": "/ar" } },
    openGraph: {
      title,
      description,
      url: `/${lang}`,
      siteName: c.identity.name,
      locale: lang === "ar" ? "ar_SA" : "en_US",
      alternateLocale: lang === "ar" ? ["en_US"] : ["ar_SA"],
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
    icons: { icon: "/icon.svg", apple: "/apple-touch-icon.png" },
    formatDetection: { telephone: false },
  };
}

function jsonLd(c: Awaited<ReturnType<typeof getContent>>, lang: Lang) {
  const base = (process.env.SITE_URL || "").replace(/\/$/, "");
  const sameAs = Object.values(c.contact.social).filter(Boolean);
  const org = {
    "@type": "Organization",
    "@id": `${base}/#organization`,
    name: c.identity.name,
    alternateName: "ميدياتركس",
    url: `${base}/${lang}`,
    logo: `${base}/logo.png`,
    image: `${base}/og-${lang}.png`,
    description: tr(c.seo.description, lang),
    slogan: tr(c.identity.tagline, lang),
    email: c.contact.email || undefined,
    telephone: c.contact.phone || undefined,
    sameAs: sameAs.length ? sameAs : undefined,
    areaServed: c.countries.filter((x) => x.enabled).map((x) => ({ "@type": "Country", name: x.name.en })),
    knowsAbout: ["Medical supplies", "Medical devices", "Syringes", "Medical gloves", "Disinfectants", "Glucose meters", "Blood pressure monitors", "Oxygen equipment"],
    contactPoint: c.contact.email || c.contact.phone ? [{ "@type": "ContactPoint", contactType: "customer service", email: c.contact.email || undefined, telephone: c.contact.phone || undefined, availableLanguage: ["Arabic", "English"] }] : undefined,
  };
  const site = {
    "@type": "WebSite",
    "@id": `${base}/#website`,
    url: `${base}/${lang}`,
    name: c.identity.name,
    inLanguage: lang === "ar" ? "ar" : "en",
    publisher: { "@id": `${base}/#organization` },
  };
  return JSON.stringify({ "@context": "https://schema.org", "@graph": [org, site] }).replace(/</g, "\\u003c");
}

export default async function SiteLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  if (!isLang(raw)) notFound();
  const lang = raw as Lang;
  const c = await getContent();
  const visible = new Set(c.sections.filter((s) => s.visible).map((s) => s.key));
  const links = [
    visible.has("about") && { href: `/${lang}#about`, label: t("nav_about", lang) },
    visible.has("about") && { href: `/${lang}#story`, label: t("nav_story", lang) },
    visible.has("services") && { href: `/${lang}#services`, label: t("nav_services", lang) },
    visible.has("countries") && { href: `/${lang}#countries`, label: t("nav_network", lang) },
    visible.has("contact") && { href: `/${lang}#contact`, label: t("nav_contact", lang) },
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <html suppressHydrationWarning lang={lang} dir={dirOf(lang)} className={fontVars} style={{ ["--gold" as string]: c.identity.gold, ["--navy" as string]: c.identity.navy }}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(c, lang) }} />
        {c.seo.gaId ? (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(c.seo.gaId)}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config',${JSON.stringify(c.seo.gaId)});`,
              }}
            />
          </>
        ) : null}
      </head>
      <body className="bg-ice min-h-screen">
        <Intro name={c.identity.name} />
        <Header lang={lang} name={c.identity.name} logoUrl={c.identity.logoUrl} links={links} />
        <main>{children}</main>
        <Footer c={c} lang={lang} />
        <WhatsApp number={c.contact.whatsapp} label={t("whatsapp", lang)} />
        <VisitTracker />
      </body>
    </html>
  );
}
