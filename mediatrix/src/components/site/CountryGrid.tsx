"use client";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
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

export function CountryGrid({
  cards,
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
  // A light travels around one card after another, like in the brand film.
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (cards.length < 2) return;
    const t = setInterval(() => setActive((a) => (a + 1) % cards.length), 2600);
    return () => clearInterval(t);
  }, [cards.length]);

  const cols =
    cards.length >= 5 ? "lg:grid-cols-5" : cards.length === 4 ? "lg:grid-cols-4" : cards.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2";

  return (
    <div
      className={`-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-6 pt-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 md:grid-cols-3 ${cols} [scrollbar-width:none]`}
    >
      {cards.map((c, i) => {
        const mine = visitorCountry && c.flag.toUpperCase() === visitorCountry.toUpperCase();
        return (
          <motion.article
            key={c.id}
            initial={{ opacity: 0, y: 40, rotateX: 12 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.9, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -8 }}
            className={`glass group relative w-[74%] shrink-0 snap-center rounded-[22px] p-2.5 sm:w-auto ${mine ? "ring-2 ring-gold/60" : ""}`}
            style={{ perspective: 800 }}
          >
            <span className="orbit-border" style={{ opacity: active === i ? 1 : undefined }} />
            <span className="orbit-border opacity-0 group-hover:!opacity-100" />

            <div className="relative aspect-[4/3] overflow-hidden rounded-[16px] bg-ice-200">
              <div className="h-full w-full transition-transform duration-[1.6s] ease-out group-hover:scale-[1.06]">
                {c.mediaUrl ? (
                  isVideo(c.mediaUrl) ? (
                    <video src={c.mediaUrl} className="h-full w-full object-cover" autoPlay muted loop playsInline preload="metadata" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.mediaUrl} alt={c.landmark} className="h-full w-full object-cover" loading="lazy" />
                  )
                ) : (
                  <LandmarkScene art={c.art} id={c.id} />
                )}
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/flags/${c.flag}.svg`} alt="" className="absolute end-2.5 top-2.5 h-[18px] w-auto rounded-[3px] shadow-[0_2px_6px_rgba(0,0,0,.25)] ring-1 ring-white/70" />
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
                  className="btn-gold mt-3 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold"
                >
                  {goLabel}
                  <svg viewBox="0 0 12 12" className="h-3 w-3 rtl:-scale-x-100" aria-hidden="true">
                    <path d="M3 9 L9 3 M4 3 H9 V8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </a>
              ) : (
                <span aria-disabled="true" className="btn-gold mt-3 flex items-center justify-center rounded-xl py-2.5 text-sm font-semibold">
                  {soonLabel}
                </span>
              )}
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
