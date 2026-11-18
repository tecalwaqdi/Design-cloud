import Link from "next/link";
import { Logo } from "../art/Logo";
import { Social } from "./Icons";
import { t, tr } from "@/lib/i18n";
import type { Content, Lang } from "@/lib/types";

export function Footer({ c, lang }: { c: Content; lang: Lang }) {
  const socials = Object.entries(c.contact.social).filter(([, v]) => v);
  return (
    <footer className="relative mt-10 border-t border-white/80 bg-gradient-to-b from-transparent to-ice-200/70 pb-10 pt-14">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-5 text-center md:px-8">
        <Logo animated={false} size="md" name={c.identity.name} logoUrl={c.identity.logoUrl} />
        <p className="max-w-md text-sm text-mist">{tr(c.identity.tagline, lang)}</p>
        {socials.length > 0 && (
          <div className="flex gap-3">
            {socials.map(([k, v]) => (
              <a key={k} href={v} target="_blank" rel="noopener" aria-label={k} className="flex h-9 w-9 items-center justify-center rounded-full text-gold-deep ring-1 ring-gold/30 transition hover:bg-gold hover:text-white">
                <Social name={k} className="h-4 w-4" />
              </a>
            ))}
          </div>
        )}
        <div className="gold-hairline w-full max-w-lg" />
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-mist">
          <span>
            © {new Date().getFullYear()} {c.identity.name}. {t("rights", lang)}
          </span>
          <Link href={`/${lang}/privacy`} className="hover:text-gold-deep">
            {t("privacy", lang)}
          </Link>
        </div>
      </div>
    </footer>
  );
}
