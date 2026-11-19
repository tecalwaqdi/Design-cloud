import Link from "next/link";
import { SectionHeading } from "@/components/site/Sections";
import { t, tr } from "@/lib/i18n";
import { getContent } from "@/lib/store";
import type { Lang } from "@/lib/types";

export default async function Privacy({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const c = await getContent();
  return (
    <section className="mx-auto max-w-3xl px-5 pb-16 pt-36">
      <SectionHeading title={t("privacy", lang)} />
      <div className="glass whitespace-pre-line rounded-[24px] p-8 leading-8 text-navy-soft md:p-10">{tr(c.privacy, lang)}</div>
      <p className="mt-8 text-center">
        <Link href={`/${lang}`} className="text-sm text-gold-deep hover:underline">
          {t("back_home", lang)}
        </Link>
      </p>
    </section>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  return {
    title: lang === "ar" ? "سياسة الخصوصية | ميدياتركس" : "Privacy Policy | Mediatrix",
    alternates: { canonical: `/${lang}/privacy`, languages: { ar: "/ar/privacy", en: "/en/privacy", "x-default": "/ar/privacy" } },
  };
}
