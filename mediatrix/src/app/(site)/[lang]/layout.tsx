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
  return {
    metadataBase: base ? new URL(base) : undefined,
    title: tr(c.seo.title, lang),
    description: tr(c.seo.description, lang),
    keywords: c.seo.keywords,
    alternates: { languages: { ar: "/ar", en: "/en" } },
    openGraph: {
      title: tr(c.seo.title, lang),
      description: tr(c.seo.description, lang),
      siteName: c.identity.name,
      locale: lang === "ar" ? "ar_SA" : "en_US",
      images: c.seo.ogImage ? [c.seo.ogImage] : undefined,
      type: "website",
    },
    icons: { icon: "/icon.svg" },
  };
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
