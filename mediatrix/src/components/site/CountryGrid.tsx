"use client";
import { motion, type Variants } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LandmarkScene } from "../art/Landmarks";
import type { LandmarkArt } from "@/lib/types";

export type CardData = {
  id: string;
  flag: string;
  name: string;
  landmark: string;
  art: LandmarkArt;
  mediaUrl?: string;
  hasStore: boolean;
};

const isVideo = (u: string) => /\.(mp4|webm|mov)(\?|$)/i.test(u);

// The whole row enters once, as a group: no card pops in while you swipe.
const row: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
};

const TZ: Record<string, string> = {
  "Asia/Riyadh": "SA",
  "Asia/Dubai": "AE",
  "Asia/Kuwait": "KW",
  "Asia/Qatar": "QA",
  "Asia/Bahrain": "BH",
  "Asia/Muscat": "OM",
  "Europe/London": "GB",
  "Europe/Berlin": "DE",
  "Europe/Busingen": "DE",
};
function tzToCountry(tz: string): string | undefined {
  if (TZ[tz]) return TZ[tz];
  if (/^America\/(New_York|Chicago|Denver|Los_Angeles|Phoenix|Anchorage|Detroit|Indiana|Kentucky|Boise|Juneau|Sitka|Nome|Adak|Menominee|North_Dakota)/.test(tz) || tz === "Pacific/Honolulu") return "US";
  return undefined;
}

export function CountryGrid({
  cards: initialCards,
  goLabel,
  soonLabel,
  yourCountryLabel,
  visitorCountry,
}: {
  cards: CardData[];
  goLabel: string;
  soonLabel: string;
  yourCountryLabel: string;
  visitorCountry?: string;
}) {
  // Visitor's country goes first, the rest keep the dashboard order.
  // Server render uses the network (IP) country; the device time zone then refines it,
  // which stays correct behind VPNs / iCloud Private Relay.
  const [tzCountry, setTzCountry] = useState<string | undefined>();
  useEffect(() => {
    try {
      const cc = tzToCountry(Intl.DateTimeFormat().resolvedOptions().timeZone);
      if (cc && initialCards.some((c) => c.flag.toUpperCase() === cc)) setTzCountry(cc);
    } catch {}
  }, [initialCards]);
  const homeCountry = (tzCountry || visitorCountry || "").toUpperCase() || undefined;
  const cards = useMemo(() => {
    const list = [...initialCards];
    const i = list.findIndex((c) => c.flag.toUpperCase() === homeCountry);
    if (i > 0) list.unshift(...list.splice(i, 1));
    return list;
  }, [initialCards, homeCountry]);

  const scroller = useRef<HTMLDivElement>(null);
  const cardEls = useRef<(HTMLElement | null)[]>([]);
  const [current, setCurrent] = useState(0); // card centred in the carousel
  const [orbit, setOrbit] = useState(0); // card with the travelling light (desktop grid)
  // One swipeable row on every screen size (no wrapping grid), so the row can glide.
  const isGrid = false;

  // Auto-glide: one card at a time toward the end of the row, then back toward the start
  // (ping-pong). Pauses while the visitor touches, scrolls or hovers, resumes after a few seconds.
  const pausedUntil = useRef(0);
  useEffect(() => {
    const root = scroller.current;
    if (!root || cards.length < 2) return;
    const rtl = getComputedStyle(root).direction === "rtl";
    let dir = 1; // 1 = toward the end of the row (reading direction)
    const hold = (ms: number) => () => (pausedUntil.current = Date.now() + ms);
    const onTouch = hold(6000);
    const onHover = hold(60_000);
    const onLeave = () => (pausedUntil.current = Date.now() + 2500);
    root.addEventListener("pointerdown", onTouch);
    root.addEventListener("touchstart", onTouch, { passive: true });
    root.addEventListener("wheel", onTouch, { passive: true });
    root.addEventListener("mouseenter", onHover);
    root.addEventListener("mouseleave", onLeave);
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.3 });
    io.observe(root);
    const t = setInterval(() => {
      if (!visible || document.hidden || Date.now() < pausedUntil.current) return;
      const pos = Math.abs(root.scrollLeft);
      const max = root.scrollWidth - root.clientWidth;
      if (max < 4) return;
      if (dir === 1 && pos >= max - 4) dir = -1;
      else if (dir === -1 && pos <= 4) dir = 1;
      const card = cardEls.current[0];
      const step = card ? card.getBoundingClientRect().width + 16 : root.clientWidth * 0.8;
      root.scrollBy({ left: dir * step * (rtl ? -1 : 1), behavior: "smooth" });
    }, 2800);
    return () => {
      clearInterval(t);
      io.disconnect();
      root.removeEventListener("pointerdown", onTouch);
      root.removeEventListener("touchstart", onTouch);
      root.removeEventListener("wheel", onTouch);
      root.removeEventListener("mouseenter", onHover);
      root.removeEventListener("mouseleave", onLeave);
    };
  }, [cards.length]);

  // Desktop: the light travels from card to card, like in the brand film.
  useEffect(() => {
    if (!isGrid || cards.length < 2) return;
    const t = setInterval(() => setOrbit((a) => (a + 1) % cards.length), 2600);
    return () => clearInterval(t);
  }, [isGrid, cards.length]);

  // Carousel: the card closest to the centre is the current one (drives dots + highlight).
  useEffect(() => {
    const root = scroller.current;
    if (!root || isGrid) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = root.getBoundingClientRect();
      const mid = r.left + r.width / 2;
      let best = 0;
      let dist = Infinity;
      cardEls.current.forEach((el, i) => {
        if (!el) return;
        const b = el.getBoundingClientRect();
        const d = Math.abs(b.left + b.width / 2 - mid);
        if (d < dist) {
          dist = d;
          best = i;
        }
      });
      // at the very ends the first / last card can't be centred: pick them explicitly
      const pos = Math.abs(root.scrollLeft);
      if (pos < 4) best = 0;
      else if (pos + root.clientWidth >= root.scrollWidth - 4) best = cardEls.current.length - 1;
      setCurrent(best);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    root.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      root.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isGrid, cards.length]);

  // Pause animated scenes / videos that are off-screen (saves battery & keeps scrolling smooth).
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = e.target as HTMLElement;
          el.querySelectorAll("svg").forEach((s) => (e.isIntersecting ? s.unpauseAnimations() : s.pauseAnimations()));
          el.querySelectorAll("video").forEach((v) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()));
        }
      },
      { rootMargin: "80px" },
    );
    cardEls.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [cards.length]);

  const goTo = useCallback((i: number) => {
    const el = cardEls.current[Math.max(0, Math.min(i, cardEls.current.length - 1))];
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, []);


  return (
    <div className="relative">
      <motion.div
        ref={scroller}
        variants={row}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className={`carousel -mx-5 flex snap-x snap-mandatory gap-3.5 overflow-x-auto scroll-smooth px-5 pb-4 pt-2 sm:gap-4 md:-mx-8 md:px-8 lg:mx-0 lg:px-1 lg:pt-3 lg:[mask-image:linear-gradient(90deg,transparent,#000_3%,#000_97%,transparent)]`}
        aria-roledescription="carousel"
      >
        {cards.map((c, i) => {
          const mine = homeCountry && c.flag.toUpperCase() === homeCountry.toUpperCase();
          const lit = isGrid ? orbit === i : current === i;
          return (
            <motion.article
              key={c.id}
              ref={(el) => {
                cardEls.current[i] = el;
              }}
              variants={item}
              aria-label={c.name}
              className={`country-card glass group relative w-[78%] shrink-0 snap-center snap-always rounded-[22px] p-2.5 transition-[transform,box-shadow] duration-500 active:scale-[0.985] sm:w-[46%] md:w-[31%] lg:w-[calc((100%-4rem)/5)] lg:snap-start lg:hover:-translate-y-2 lg:active:scale-100 ${
                mine ? "ring-2 ring-gold/60" : ""
              }`}
            >
              <span className="orbit-border" data-lit={lit ? "" : undefined} />
              <span className="orbit-border orbit-hover hidden lg:block" />

              <div className="relative aspect-[4/3] overflow-hidden rounded-[16px] bg-ice-200">
                <div className="h-full w-full transition-transform duration-[1.6s] ease-out lg:group-hover:scale-[1.06]">
                  {c.mediaUrl ? (
                    isVideo(c.mediaUrl) ? (
                      <video src={c.mediaUrl} className="h-full w-full object-cover" autoPlay muted loop playsInline preload="metadata" />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.mediaUrl} alt={c.landmark} className="h-full w-full object-cover" loading="lazy" draggable={false} />
                    )
                  ) : (
                    <LandmarkScene art={c.art} id={c.id} />
                  )}
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/flags/${c.flag}.svg`}
                  alt=""
                  draggable={false}
                  className="absolute end-2.5 top-2.5 h-[18px] w-auto rounded-[3px] shadow-[0_2px_6px_rgba(0,0,0,.25)] ring-1 ring-white/70"
                />
                {mine && (
                  <span className="btn-gold absolute start-2.5 top-2.5 rounded-full px-2.5 py-0.5 text-[0.65rem] font-semibold">{yourCountryLabel}</span>
                )}
                <span className="pointer-events-none absolute inset-0 rounded-[16px] ring-1 ring-inset ring-white/50" />
              </div>

              <div className="px-1.5 pb-1 pt-3 text-center">
                <h3 className="font-heading text-xl font-semibold text-navy">{c.name}</h3>
                <p className="mt-0.5 min-h-[2.4em] text-xs leading-snug text-mist">{c.landmark}</p>
                {c.hasStore ? (
                  <a
                    href={`/go/${c.id}`}
                    target="_blank"
                    rel="noopener"
                    className="btn-gold mt-3 flex items-center justify-center gap-1.5 rounded-xl py-3 text-sm font-semibold lg:py-2.5"
                  >
                    {goLabel}
                    <svg viewBox="0 0 12 12" className="h-3 w-3 rtl:-scale-x-100" aria-hidden="true">
                      <path d="M3 9 L9 3 M4 3 H9 V8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </a>
                ) : (
                  <span aria-disabled="true" className="btn-gold mt-3 flex items-center justify-center rounded-xl py-3 text-sm font-semibold lg:py-2.5">
                    {soonLabel}
                  </span>
                )}
              </div>
            </motion.article>
          );
        })}
      </motion.div>

      {/* Carousel controls (phones & tablets) */}
      {!isGrid && cards.length > 1 && (
        <div className="mt-2 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => goTo(current - 1)}
            disabled={current === 0}
            aria-label="previous"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-gold/30 bg-white/70 text-gold-deep transition hover:bg-white disabled:opacity-30 sm:flex"
          >
            <svg viewBox="0 0 12 12" className="h-3.5 w-3.5 rtl:-scale-x-100" aria-hidden="true">
              <path d="M7.5 2 L3.5 6 L7.5 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="flex items-center gap-2" role="tablist">
            {cards.map((c, i) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={current === i}
                aria-label={c.name}
                onClick={() => goTo(i)}
                className="flex h-6 items-center justify-center px-0.5"
              >
                <span className={`block h-1.5 rounded-full transition-all duration-500 ${current === i ? "w-6 bg-gold" : "w-1.5 bg-gold/30"}`} />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => goTo(current + 1)}
            disabled={current === cards.length - 1}
            aria-label="next"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-gold/30 bg-white/70 text-gold-deep transition hover:bg-white disabled:opacity-30 sm:flex"
          >
            <svg viewBox="0 0 12 12" className="h-3.5 w-3.5 rtl:-scale-x-100" aria-hidden="true">
              <path d="M4.5 2 L8.5 6 L4.5 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
