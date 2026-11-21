import { Wordmark } from "./Wordmark";

/*
 * Mediatrix identity — "Pulse of Care"
 *  - Logomark: an M drawn as a single heartbeat trace on a deep-navy tile,
 *    with an ice drop (cold chain / IV fluids) in the corner.
 *  - Wordmark: Readex Pro, navy; the i-dots are ice drops, the x is aqua.
 *  - Motion: the trace draws itself, then a light pulse travels along it.
 */

export const M_PATH = "M8 41 H15 L22 19 L32 37 L42 19 L49 41 H56";
export const PULSE_PATH = "M2 30 H58 L66 34 L76 4 L88 52 L98 22 L104 30 H158";

export function Logomark({ animated = true, className = "", id = "lm" }: { animated?: boolean; className?: string; id?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-tile`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2b3d57" />
          <stop offset="0.55" stopColor="#1c2a3f" />
          <stop offset="1" stopColor="#121c2c" />
        </linearGradient>
        <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.28" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f1dfb3" />
          <stop offset="0.5" stopColor="#d9bd86" />
          <stop offset="1" stopColor="#a8875a" />
        </linearGradient>
        <linearGradient id={`${id}-drop`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e6f7fb" />
          <stop offset="1" stopColor="#3fb3cf" />
        </linearGradient>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.4" stopColor="#f6e3b4" />
          <stop offset="1" stopColor="#e6c98e" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="17" fill={`url(#${id}-tile)`} />
      <rect x="2" y="2" width="60" height="60" rx="17" fill={`url(#${id}-shine)`} />
      <rect x="2.6" y="2.6" width="58.8" height="58.8" rx="16.4" fill="none" stroke="#d9bd86" strokeOpacity="0.55" strokeWidth="1.2" />
      <path
        d={M_PATH}
        fill="none"
        stroke={`url(#${id}-gold)`}
        strokeWidth="4.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={animated ? 1 : undefined}
        strokeDashoffset={animated ? 1 : undefined}
      >
        {animated && <animate attributeName="stroke-dashoffset" from="1" to="0" dur="1.4s" fill="freeze" calcMode="spline" keySplines="0.45 0 0.2 1" keyTimes="0;1" />}
      </path>
      {animated && (
        <circle r="5.5" fill={`url(#${id}-glow)`}>
          <animateMotion dur="2.6s" begin="1.4s" repeatCount="indefinite" path={M_PATH} />
        </circle>
      )}
      {/* ice drop */}
      <path d="M50 8.5 C 47.6 12.6, 46.4 14.8, 46.4 16.6 a3.6 3.6 0 0 0 7.2 0 C 53.6 14.8, 52.4 12.6, 50 8.5 Z" fill={`url(#${id}-drop)`}>
        {animated && <animateTransform attributeName="transform" type="translate" values="0 0;0 1.2;0 0" dur="2.8s" repeatCount="indefinite" />}
      </path>
    </svg>
  );
}

/** Thin heartbeat divider used in section headings and panels. */
export function Pulse({ animated = true, className = "", id = "pulse" }: { animated?: boolean; className?: string; id?: string }) {
  return (
    <svg viewBox="0 0 160 56" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-g`} x1="0" x2="1">
          <stop offset="0" stopColor="#1c2a3f" stopOpacity="0.15" />
          <stop offset="0.3" stopColor="#1c2a3f" />
          <stop offset="0.7" stopColor="#1c2a3f" />
          <stop offset="1" stopColor="#1c2a3f" stopOpacity="0.15" />
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
        <Logomark animated={animated} className="h-10 w-10 drop-shadow-[0_6px_10px_rgba(28,42,63,.25)]" id="lm-sm" />
        {text ? <span className="font-logo text-2xl font-semibold text-navy">{text}</span> : <Wordmark className="text-[1.6rem]" uid="wm-sm" />}
      </span>
    );
  }
  const big = size === "lg";
  return (
    <span className="inline-flex flex-col items-center gap-3" dir="ltr">
      <Logomark animated={animated} className={`${big ? "h-24 w-24" : "h-14 w-14"} drop-shadow-[0_10px_18px_rgba(28,42,63,.28)]`} id={`lm-${size}`} />
      {text ? <span className={`font-logo font-semibold text-navy ${big ? "text-6xl" : "text-3xl"}`}>{text}</span> : <Wordmark className={big ? "text-6xl md:text-7xl" : "text-[2rem]"} uid={`wm-${size}`} />}
    </span>
  );
}
