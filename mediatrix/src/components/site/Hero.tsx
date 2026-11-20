"use client";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { ProductBanner } from "../art/ProductBanner";
import { ColdChainBanner, NetworkBanner } from "../art/Slides";
import { Wordmark } from "../art/Wordmark";
import { Sparkles } from "./Sparkles";

const SLIDE_MS = 6500;

export function Hero({
  welcome,
  subtitle,
  tagline,
  bannerUrl,
  scrollLabel,
  captions,
  rtl,
}: {
  welcome: string;
  subtitle: string;
  tagline: string;
  bannerUrl?: string;
  scrollLabel: string;
  captions: { title: string; sub: string }[];
  rtl: boolean;
}) {
  const mx = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const bx = useTransform(sx, (v) => v * 12);
  const ease = [0.22, 1, 0.36, 1] as const;

  const slides = [
    bannerUrl ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img key="b" src={bannerUrl} alt="" className="h-full w-full object-contain drop-shadow-[0_20px_30px_rgba(28,42,63,0.18)]" />
    ) : (
      <ProductBanner key="p" />
    ),
    <ColdChainBanner key="c" />,
    <NetworkBanner key="n" />,
  ];
  const [[index, dir], setState] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);
  const go = useCallback((d: number) => setState(([i]) => [(i + d + slides.length) % slides.length, d]), [slides.length]);
  const jump = (i: number) => setState(([cur]) => [i, i > cur ? 1 : -1]);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => go(1), SLIDE_MS);
    return () => clearTimeout(t);
  }, [index, paused, go]);

  // "next" travels toward the reading direction (left in Arabic, right in English)
  const sign = rtl ? -1 : 1;
  const variants = {
    enter: (d: number) => ({ x: `${d * sign * 18}%`, opacity: 0, scale: 1.05, filter: "blur(6px)" }),
    center: { x: "0%", opacity: 1, scale: 1, filter: "blur(0px)" },
    exit: (d: number) => ({ x: `${-d * sign * 18}%`, opacity: 0, scale: 0.97, filter: "blur(6px)" }),
  };
  const cap = captions[index] || captions[0];

  return (
    <section
      className="relative overflow-hidden pt-[72px] md:pt-20"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
      }}
    >
      {/* fine gold line-art accents */}
      <svg className="pointer-events-none absolute -start-10 top-32 hidden h-64 w-64 opacity-40 lg:block" viewBox="0 0 200 200" aria-hidden="true">
        <path d="M10 190 C 60 120, 120 80, 190 10" fill="none" stroke="#c9a96e" strokeWidth="0.8" />
        <path d="M30 190 C 80 130, 140 100, 190 40" fill="none" stroke="#c9a96e" strokeWidth="0.5" />
      </svg>
      <svg className="pointer-events-none absolute -end-6 top-40 hidden h-72 w-72 opacity-30 lg:block" viewBox="0 0 200 200" aria-hidden="true">
        <circle cx="100" cy="100" r="90" fill="none" stroke="#c9a96e" strokeWidth="0.6" strokeDasharray="2 6" />
        <circle cx="100" cy="100" r="70" fill="none" stroke="#c9a96e" strokeWidth="0.4" />
      </svg>

      <Sparkles count={18} bubbles={8} />

      {/* ── slider ── */}
      <motion.div
        style={{ x: bx }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease, delay: 0.2 }}
        className="relative mx-auto max-w-6xl px-2"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        aria-roledescription="carousel"
      >
        <div className="relative h-[150px] overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] sm:h-[200px] md:h-[220px] lg:h-[205px] xl:h-[235px]">
          <AnimatePresence initial={false} custom={dir} mode="popLayout">
            <motion.div
              key={index}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 1.1, ease }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.25}
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 50) go(info.offset.x * sign < 0 ? 1 : -1);
              }}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
            >
              {/* slow Ken-Burns drift while the slide is on screen */}
              <motion.div className="h-full w-full" initial={{ scale: 1 }} animate={{ scale: 1.035 }} transition={{ duration: SLIDE_MS / 1000 + 1, ease: "linear" }}>
                {slides[index]}
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* arrows (desktop) */}
          {[-1, 1].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => go(d)}
              aria-label={d > 0 ? "next" : "previous"}
              className={`absolute top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gold/30 bg-white/70 text-gold-deep backdrop-blur transition hover:bg-white lg:flex ${
                d > 0 ? "end-6" : "start-6"
              }`}
            >
              <svg viewBox="0 0 12 12" className={`h-3.5 w-3.5 ${d > 0 ? "" : "rotate-180"} rtl:-scale-x-100`} aria-hidden="true">
                <path d="M4.5 2 L8.5 6 L4.5 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ))}
        </div>

        {/* caption + progress dots */}
        <div className="relative mt-1 flex flex-col items-center gap-2">
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.5 }}
              className="text-center text-xs font-semibold tracking-wide text-gold-deep md:text-sm"
            >
              {cap.title}
              {cap.sub && <span className="hidden font-normal text-mist sm:inline"> · {cap.sub}</span>}
            </motion.p>
          </AnimatePresence>
          <div className="flex items-center gap-2" role="tablist">
            {slides.map((_, i) => (
              <button key={i} type="button" role="tab" aria-selected={i === index} aria-label={`${i + 1}`} onClick={() => jump(i)} className="flex h-5 items-center">
                <span className="relative block h-1 w-7 overflow-hidden rounded-full bg-gold/25">
                  {i === index && (
                    <motion.span
                      key={`${index}-${paused}`}
                      className="absolute inset-y-0 start-0 bg-gold"
                      initial={{ width: "0%" }}
                      animate={{ width: paused ? "100%" : "100%" }}
                      transition={{ duration: paused ? 0.3 : SLIDE_MS / 1000, ease: "linear" }}
                    />
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── title ── */}
      <div className="relative mx-auto mt-3 max-w-5xl px-5 text-center lg:mt-2">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease, delay: 0.45 }}
          className="font-heading flex flex-col items-center justify-center gap-x-4 leading-none sm:flex-row sm:flex-wrap"
        >
          <span className="text-gold-grad text-xl font-bold uppercase tracking-[0.14em] rtl:text-3xl rtl:tracking-normal sm:text-3xl lg:text-[2rem] rtl:lg:text-[2.4rem]">{welcome}</span>
          <Wordmark className="mt-1 text-[3.4rem] sm:mt-0 sm:text-6xl lg:text-[4.1rem]" />
        </motion.h1>
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, ease, delay: 0.9 }} className="gold-hairline mx-auto mt-3 w-40" />
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.1 }} className="mt-2 text-sm text-mist md:text-[0.95rem]">
          {tagline}
          <span className="hidden text-mist/80 lg:inline"> · {subtitle}</span>
        </motion.p>
        <p className="mt-1 text-xs text-mist/80 lg:hidden">{subtitle}</p>
        <a href="#countries" className="mt-3 inline-flex flex-col items-center gap-1 text-[0.7rem] uppercase tracking-[0.3em] text-gold-deep rtl:tracking-normal rtl:text-xs lg:hidden" aria-label={scrollLabel}>
          {scrollLabel}
          <motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity }} className="block h-5 w-px bg-gradient-to-b from-gold to-transparent" />
        </a>
      </div>
    </section>
  );
}
