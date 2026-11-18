"use client";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ProductBanner } from "../art/ProductBanner";
import { Sparkles } from "./Sparkles";

export function Hero({
  welcome,
  name,
  subtitle,
  tagline,
  bannerUrl,
  scrollLabel,
}: {
  welcome: string;
  name: string;
  subtitle: string;
  tagline: string;
  bannerUrl?: string;
  scrollLabel: string;
}) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const bx = useTransform(sx, (v) => v * 14);
  const by = useTransform(sy, (v) => v * 8);
  const tx = useTransform(sx, (v) => v * -6);

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section
      className="relative overflow-hidden pt-20 md:pt-20"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
    >
      {/* fine gold line-art accents */}
      <svg className="pointer-events-none absolute -start-10 top-40 hidden h-72 w-72 opacity-40 md:block" viewBox="0 0 200 200" aria-hidden="true">
        <path d="M10 190 C 60 120, 120 80, 190 10" fill="none" stroke="#c9a96e" strokeWidth="0.8" />
        <path d="M30 190 C 80 130, 140 100, 190 40" fill="none" stroke="#c9a96e" strokeWidth="0.5" />
      </svg>
      <svg className="pointer-events-none absolute -end-6 top-56 hidden h-80 w-80 opacity-30 md:block" viewBox="0 0 200 200" aria-hidden="true">
        <circle cx="100" cy="100" r="90" fill="none" stroke="#c9a96e" strokeWidth="0.6" strokeDasharray="2 6" />
        <circle cx="100" cy="100" r="70" fill="none" stroke="#c9a96e" strokeWidth="0.4" />
      </svg>

      <Sparkles count={22} bubbles={12} />

      <motion.div
        style={{ x: bx, y: by }}
        initial={{ opacity: 0, scale: 0.96, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.4, ease, delay: 0.2 }}
        className="relative mx-auto h-[150px] max-w-6xl px-2 [mask-image:linear-gradient(90deg,transparent,#000_9%,#000_91%,transparent)] sm:h-[220px] md:h-[270px] lg:h-[300px]"
      >
        {bannerUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={bannerUrl} alt="" className="h-full w-full object-contain drop-shadow-[0_20px_30px_rgba(28,42,63,0.18)]" />
        ) : (
          <ProductBanner />
        )}
      </motion.div>

      <motion.div style={{ x: tx }} className="relative mx-auto max-w-5xl px-5 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 24, letterSpacing: "0.25em" }}
          animate={{ opacity: 1, y: 0, letterSpacing: "0em" }}
          transition={{ duration: 1.3, ease, delay: 0.5 }}
          className="font-heading leading-[1.05]"
        >
          <span className="text-gold-grad block text-2xl font-semibold uppercase tracking-[0.12em] rtl:tracking-normal sm:inline sm:text-4xl md:text-5xl">{welcome}</span>{" "}
          <span className="font-display text-5xl font-semibold italic text-navy sm:text-6xl md:text-7xl" dir="ltr">
            {name}
          </span>
        </motion.h1>
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, ease, delay: 1 }} className="gold-hairline mx-auto mt-5 w-48" />
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.2 }} className="mt-4 text-sm text-mist md:text-base">
          {tagline}
        </motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.4 }} className="mt-1 text-xs text-mist/80 md:text-sm">
          {subtitle}
        </motion.p>
        <a href="#countries" className="mt-4 inline-flex flex-col items-center gap-1 text-[0.7rem] uppercase tracking-[0.3em] text-gold-deep rtl:tracking-normal rtl:text-xs" aria-label={scrollLabel}>
          {scrollLabel}
          <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity }} className="block h-6 w-px bg-gradient-to-b from-gold to-transparent" />
        </a>
      </motion.div>
    </section>
  );
}
