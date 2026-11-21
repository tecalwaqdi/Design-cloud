// "Mediatrix" wordmark — Readex Pro, deep navy.
//  - each "i" is a tidy IV bottle drawn on the letter grid (navy outline, aqua fluid, gold cap)
//    with a falling drop as its dot
//  - the "x" is two crossing ribbons (gold over silver) with pearls and gold drops,
//    or a single gold ribbon when `simpleX` is set (small sizes)

function BottleI({ u, delay = 0 }: { u: string; delay?: number }) {
  // viewBox: 0..100 tall = cap-height (0.73em); baseline at y=100, x-height at y≈28
  return (
    <svg viewBox="0 0 30 100" className="inline-block h-[0.73em] w-[0.27em] align-baseline" style={{ marginInline: "0.012em" }} aria-hidden="true">
      <defs>
        <linearGradient id={`${u}-f`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fd8ea" />
          <stop offset="1" stopColor="#2a9db8" />
        </linearGradient>
        <linearGradient id={`${u}-c`} x1="0" x2="1">
          <stop offset="0" stopColor="#9a7a4b" />
          <stop offset="0.5" stopColor="#f1dfb3" />
          <stop offset="1" stopColor="#a8875a" />
        </linearGradient>
      </defs>
      {/* the dot: a drop falling into the bottle */}
      <path d="M15 1.5 C 11.6 7.2, 10 10, 10 12.4 a5 5 0 0 0 10 0 C 20 10, 18.4 7.2, 15 1.5 Z" fill={`url(#${u}-f)`}>
        <animateTransform attributeName="transform" type="translate" values="0 0;0 0;0 15;0 15" keyTimes="0;0.62;0.82;1" dur="3.4s" begin={`${delay}s`} repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;0.62;0.82;0.92;1" dur="3.4s" begin={`${delay}s`} repeatCount="indefinite" />
      </path>
      {/* cap */}
      <rect x="9" y="25" width="12" height="6" rx="1.6" fill={`url(#${u}-c)`} />
      {/* bottle = the stem of the i, standing on the baseline */}
      <rect x="6.2" y="31.8" width="17.6" height="65.9" rx="6" fill="#ffffff" stroke="#1c2a3f" strokeWidth="4.6" />
      <path fill={`url(#${u}-f)`}>
        <animate
          attributeName="d"
          dur="2.8s"
          repeatCount="indefinite"
          values="M8.5 56 Q12 54 15 56 T21.5 56 V91 Q21.5 95.4 17.5 95.4 H12.5 Q8.5 95.4 8.5 91 Z;
                  M8.5 56 Q12 58 15 56 T21.5 56 V91 Q21.5 95.4 17.5 95.4 H12.5 Q8.5 95.4 8.5 91 Z;
                  M8.5 56 Q12 54 15 56 T21.5 56 V91 Q21.5 95.4 17.5 95.4 H12.5 Q8.5 95.4 8.5 91 Z"
        />
      </path>
      <g stroke="#1c2a3f" strokeOpacity="0.45" strokeWidth="1.4" strokeLinecap="round">
        <path d="M16 44h4M16 52h4M16 60h4M16 68h4" />
      </g>
      <rect x="9.5" y="36" width="2.4" height="52" rx="1.2" fill="#ffffff" opacity="0.9" />
    </svg>
  );
}

/** The "x": two gold ribbon strokes with a gentle S-curve crossing at the centre, a drop at each lower end. */
function RibbonX({ u }: { u: string; simple?: boolean }) {
  const a = "M16 8 C 42 20, 58 80, 84 92";
  const b = "M84 8 C 58 20, 42 80, 16 92";
  return (
    <svg viewBox="0 0 100 100" className="inline-block h-[0.6em] w-[0.58em] overflow-visible align-baseline" style={{ marginInlineStart: "0.03em" }} aria-hidden="true">
      <defs>
        <linearGradient id={`${u}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f1dfb3" />
          <stop offset="0.5" stopColor="#c9a96e" />
          <stop offset="1" stopColor="#8f6f3e" />
        </linearGradient>
        <linearGradient id={`${u}-g2`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e6cc93" />
          <stop offset="0.5" stopColor="#b8955f" />
          <stop offset="1" stopColor="#7d6238" />
        </linearGradient>
      </defs>
      <path d={b} fill="none" stroke={`url(#${u}-g2)`} strokeWidth="14" strokeLinecap="round" />
      <path d={a} fill="none" stroke={`url(#${u}-g)`} strokeWidth="14" strokeLinecap="round" />
      <path d="M22 12 C 36 19, 44 34, 48 44" fill="none" stroke="#fff6dc" strokeOpacity="0.85" strokeWidth="2.4" strokeLinecap="round" />
      {[
        [16, 0],
        [84, 1.2],
      ].map(([x, d], i) => (
        <path key={i} d={`M${x} 96 c-2.6 4.4 -4 6.6 -4 8.4 a4 4 0 0 0 8 0 c0 -1.8 -1.4 -4 -4 -8.4 z`} fill={`url(#${u}-g)`}>
          <animateTransform attributeName="transform" type="translate" values="0 0;0 2.2;0 0" dur="2.6s" begin={`${d}s`} repeatCount="indefinite" />
        </path>
      ))}
    </svg>
  );
}

export function Wordmark({ className = "", uid = "wm", simpleX = false }: { className?: string; uid?: string; simpleX?: boolean }) {
  return (
    <span className={`font-brand inline-flex items-baseline font-semibold leading-none tracking-[-0.015em] text-navy ${className}`} dir="ltr" aria-label="Mediatrix" role="img">
      <span aria-hidden="true">Med</span>
      <BottleI u={`${uid}-i1`} />
      <span aria-hidden="true">atr</span>
      <BottleI u={`${uid}-i2`} delay={1.5} />
      <RibbonX u={`${uid}-x`} simple={simpleX} />
    </span>
  );
}
