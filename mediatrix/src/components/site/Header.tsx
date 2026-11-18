"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Logo } from "../art/Logo";
import type { Lang } from "@/lib/types";

export function Header({
  lang,
  name,
  logoUrl,
  links,
}: {
  lang: Lang;
  name: string;
  logoUrl?: string;
  links: { href: string; label: string }[];
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const other: Lang = lang === "ar" ? "en" : "ar";
  const switchHref = pathname.replace(/^\/(ar|en)/, `/${other}`) || `/${other}`;

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "glass !border-x-0 !border-t-0 py-2" : "py-4"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 md:px-8">
        <Link href={`/${lang}`} aria-label={name} className="shrink-0">
          <Logo size="sm" name={name} logoUrl={logoUrl} />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="group relative text-[0.92rem] text-navy-soft transition-colors hover:text-navy">
              {l.label}
              <span className="absolute -bottom-1 start-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
          <Link
            href={switchHref}
            className="rounded-full border border-gold/40 px-3 py-1 text-xs font-semibold tracking-wider text-gold-deep transition hover:bg-gold hover:text-white"
          >
            {lang === "ar" ? "EN" : "عربي"}
          </Link>
        </nav>

        <button className="relative z-10 flex h-10 w-10 items-center justify-center md:hidden" aria-label="menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          <span className={`absolute h-px w-6 bg-navy transition ${open ? "rotate-45" : "-translate-y-1.5"}`} />
          <span className={`absolute h-px w-6 bg-navy transition ${open ? "opacity-0" : ""}`} />
          <span className={`absolute h-px w-6 bg-navy transition ${open ? "-rotate-45" : "translate-y-1.5"}`} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="glass mx-4 mt-3 flex flex-col rounded-2xl p-4 md:hidden"
          >
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="border-b border-ice-300/60 py-3 text-navy last:border-0">
                {l.label}
              </a>
            ))}
            <Link href={switchHref} className="btn-gold mt-3 rounded-full py-2 text-center text-sm">
              {lang === "ar" ? "English" : "العربية"}
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
