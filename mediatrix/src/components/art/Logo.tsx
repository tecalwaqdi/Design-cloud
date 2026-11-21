import { Wordmark } from "./Wordmark";

/*
 * Mediatrix identity — "Pulse of Care"
 *  - Logomark: a free-standing gold ECG heartbeat trace,
 *    with an ice drop (cold chain / IV fluids) in the corner.
 *  - Wordmark: Readex Pro, navy; the i-dots are ice drops, the x is aqua.
 *  - Motion: the trace draws itself, then a light pulse travels along it.
 */

// ECG trace (P wave, sharp QRS spike, T wave) — the brand's heartbeat
export const M_PATH = "M7 35 H15 Q18 29 21 35 H25 L28 39 L32 13 L36 47 L39 32 L41 35 H44 Q48.5 27 53 35 H57";
export const PULSE_PATH = "M2 30 H58 L66 34 L76 4 L88 52 L98 22 L104 30 H158";

export function Logomark({ animated = true, className = "", id = "lm" }: { animated?: boolean; className?: string; id?: string }) {
  // A free-standing gold heartbeat (no tile): soft glow, the trace draws itself, a light pulse runs along it.
  return (
    <svg viewBox="3 8 58 46" className={className} overflow="visible" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#d9bd86" stopOpacity="0.35" />
          <stop offset="0.25" stopColor="#c9a96e" />
          <stop offset="0.55" stopColor="#a8875a" />
          <stop offset="0.8" stopColor="#c9a96e" />
          <stop offset="1" stopColor="#d9bd86" stopOpacity="0.35" />
        </linearGradient>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.4" stopColor="#bfe9f4" />
          <stop offset="1" stopColor="#8fd3e2" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-soft`} x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
      </defs>
      <path d={M_PATH} fill="none" stroke="#e6c98e" strokeOpacity="0.55" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" filter={`url(#${id}-soft)`} />
      <path
        d={M_PATH}
        fill="none"
        stroke={`url(#${id}-gold)`}
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={animated ? 1 : undefined}
        strokeDashoffset={animated ? 1 : undefined}
      >
        {animated && <animate attributeName="stroke-dashoffset" from="1" to="0" dur="1.4s" fill="freeze" calcMode="spline" keySplines="0.45 0 0.2 1" keyTimes="0;1" />}
      </path>
      {animated && (
        <circle r="4.5" fill={`url(#${id}-glow)`}>
          <animateMotion dur="2.6s" begin="1.4s" repeatCount="indefinite" path={M_PATH} />
        </circle>
      )}
    </svg>
  );
}

/** Thin heartbeat divider used in section headings and panels. */
export function Pulse({ animated = true, className = "", id = "pulse" }: { animated?: boolean; className?: string; id?: string }) {
  return (
    <svg viewBox="0 0 160 56" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-g`} x1="0" x2="1">
          <stop offset="0" stopColor="#5fa8cc" stopOpacity="0.15" />
          <stop offset="0.3" stopColor="#3d86ad" />
          <stop offset="0.7" stopColor="#3d86ad" />
          <stop offset="1" stopColor="#5fa8cc" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <path d={PULSE_PATH} fill="none" stroke={`url(#${id}-g)`} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      {animated && (
        <path d={PULSE_PATH} fill="none" stroke="#d9bd86" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="0.12 1">
          <animate attributeName="stroke-dashoffset" values="0.12;-1" dur="2.4s" repeatCount="indefinite" />
        </path>
      )}
    </svg>
  );
}

/** Brand lockup. sm = horizontal (header); md / lg = stacked (footer, splash, login). */
export function Logo({
  animated = true,
  logoUrl,
  name = "Mediatrix",
  size = "md",
}: {
  animated?: boolean;
  logoUrl?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
}) {
  if (logoUrl) {
    const h = size === "lg" ? "h-24" : size === "sm" ? "h-10" : "h-14";
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={logoUrl} alt={name} className={`${h} w-auto`} />;
  }
  const text = name.toLowerCase() === "mediatrix" ? null : name;
  if (size === "sm") {
    return (
      <span className="inline-flex items-center gap-2.5" dir="ltr">
        <Logomark animated={animated} className="h-9 w-12" id="lm-sm" />
        {text ? <span className="font-logo text-2xl font-semibold text-navy">{text}</span> : <Wordmark className="text-[1.6rem]" uid="wm-sm" simpleX />}
      </span>
    );
  }
  const big = size === "lg";
  return (
    <span className="inline-flex flex-col items-center gap-3" dir="ltr">
      <Logomark animated={animated} className={big ? "h-20 w-28" : "h-12 w-16"} id={`lm-${size}`} />
      {text ? <span className={`font-logo font-semibold text-navy ${big ? "text-6xl" : "text-3xl"}`}>{text}</span> : <Wordmark className={big ? "text-6xl md:text-7xl" : "text-[2rem]"} uid={`wm-${size}`} />}
    </span>
  );
}
