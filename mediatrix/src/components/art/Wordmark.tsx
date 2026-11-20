// "Mediatrix" wordmark for the hero:
//  - letters in an icy / frosted gradient with a travelling frost glint (cold-chain feel)
//  - each "i" is an IV drip bottle, its dot a drop that falls into it
//  - the "x" is two intertwined ribbons, gold and silver, with small pearls

function IceDefs({ u }: { u: string }) {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <defs>
        <linearGradient id={`${u}-ice`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e9f7fc" />
          <stop offset="0.35" stopColor="#8cc6de" />
          <stop offset="0.65" stopColor="#3f7fa3" />
          <stop offset="1" stopColor="#1f4f6e" />
        </linearGradient>
        <linearGradient id={`${u}-glass`} x1="0" x2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="0.3" stopColor="#d4ecf5" stopOpacity="0.7" />
          <stop offset="0.7" stopColor="#bfe0ee" stopOpacity="0.75" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id={`${u}-fluid`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bfe9f5" />
          <stop offset="1" stopColor="#4f9fc4" />
        </linearGradient>
        <linearGradient id={`${u}-gold`} x1="0" x2="1">
          <stop offset="0" stopColor="#7d6238" />
          <stop offset="0.35" stopColor="#e6cc93" />
          <stop offset="0.5" stopColor="#fff2cc" />
          <stop offset="0.7" stopColor="#c9a96e" />
          <stop offset="1" stopColor="#7d6238" />
        </linearGradient>
        <linearGradient id={`${u}-silver`} x1="0" x2="1">
          <stop offset="0" stopColor="#7f8e99" />
          <stop offset="0.4" stopColor="#e9f0f4" />
          <stop offset="0.55" stopColor="#ffffff" />
          <stop offset="1" stopColor="#8796a1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** IV drip bottle shaped like an "i" (viewBox 0 0 40 100; baseline at y=96, x-height ≈ y=52). */
function IvI({ u, delay = 0 }: { u: string; delay?: number }) {
  return (
    <svg viewBox="0 0 40 100" className="inline-block h-[0.98em] w-[0.34em] align-baseline" aria-hidden="true" style={{ marginBottom: "-0.012em" }}>
      {/* drop = the dot of the i, falling into the bottle */}
      <g transform="translate(0 4)">
      <path d="M20 14 C 16.8 19.5, 15 22.5, 15 25.2 a5 5 0 0 0 10 0 C 25 22.5, 23.2 19.5, 20 14 Z" fill={`url(#${u}-fluid)`} stroke="#e9f7fc" strokeWidth="0.8">
        <animateTransform attributeName="transform" type="translate" values="0 0;0 0;0 24;0 24" keyTimes="0;0.6;0.8;1" dur="3.2s" begin={`${delay}s`} repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;0.6;0.8;0.9;1" dur="3.2s" begin={`${delay}s`} repeatCount="indefinite" />
      </path>
      </g>
      <g transform="translate(0 9.5)">
      {/* cap */}
      <rect x="13" y="44" width="14" height="5" rx="1.5" fill={`url(#${u}-gold)`} />
      {/* bottle body = stem of the i (x-height) */}
      <path d="M10 52 Q10 49 13 49 H27 Q30 49 30 52 V85 Q30 90.5 24.5 90.5 H15.5 Q10 90.5 10 85 Z" fill={`url(#${u}-glass)`} stroke="#7fb3cc" strokeWidth="1.3" />
      <path fill={`url(#${u}-fluid)`} opacity="0.92">
        <animate
          attributeName="d"
          dur="2.6s"
          repeatCount="indefinite"
          values="M11.5 64 Q15.5 62 20 64 T28.5 64 V85 Q28.5 89 24.5 89 H15.5 Q11.5 89 11.5 85 Z;
                  M11.5 64 Q15.5 66 20 64 T28.5 64 V85 Q28.5 89 24.5 89 H15.5 Q11.5 89 11.5 85 Z;
                  M11.5 64 Q15.5 62 20 64 T28.5 64 V85 Q28.5 89 24.5 89 H15.5 Q11.5 89 11.5 85 Z"
        />
      </path>
      {[56, 62, 68, 74, 80].map((y) => (
        <line key={y} x1="23" x2="28" y1={y} y2={y} stroke="#3f6f88" strokeOpacity="0.55" strokeWidth="0.9" />
      ))}
      <rect x="12.4" y="52" width="2.6" height="33" rx="1.3" fill="#fff" opacity="0.9" />
      </g>
    </svg>
  );
}

/** Two intertwined ribbons (gold + silver) forming an "x" with pearls and gold drops. */
function RibbonX({ u }: { u: string }) {
  const silver = "M62 10 C 42 26, 46 42, 35 52 S 18 80, 8 94";
  const gold = "M8 8 C 28 24, 24 42, 35 52 S 52 80, 62 94";
  return (
    <svg viewBox="0 0 70 100" className="inline-block h-[0.8em] w-[0.6em] align-baseline" aria-hidden="true" style={{ marginInlineStart: "0.03em" }}>
      <path d={silver} fill="none" stroke="#5f7380" strokeOpacity="0.35" strokeWidth="13" strokeLinecap="round" transform="translate(1.5 2)" />
      <path d={silver} fill="none" stroke={`url(#${u}-silver)`} strokeWidth="11.5" strokeLinecap="round" />
      <path d={silver} fill="none" stroke="#fff" strokeOpacity="0.8" strokeWidth="2" strokeLinecap="round" />
      <path d={gold} fill="none" stroke="#5c4626" strokeOpacity="0.3" strokeWidth="13" strokeLinecap="round" transform="translate(1.5 2)" />
      <path d={gold} fill="none" stroke={`url(#${u}-gold)`} strokeWidth="11.5" strokeLinecap="round" />
      <path d={gold} fill="none" stroke="#fff6dc" strokeOpacity="0.85" strokeWidth="2" strokeLinecap="round" />
      {[
        [50, 20, 2.8],
        [21, 76, 2.6],
        [55, 86, 2.2],
        [44, 33, 1.8],
      ].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="#ffffff" stroke="#c9d6dd" strokeWidth="0.6">
          <animate attributeName="opacity" values="0.65;1;0.65" dur={`${2 + i * 0.4}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {/* gold drops hanging from the ribbons */}
      {[
        [35, 56, 0],
        [15, 90, 0.8],
      ].map(([x, y, d], i) => (
        <path key={i} d={`M${x} ${y} c-1.8 3.4 -2.8 5.2 -2.8 6.8 a2.8 2.8 0 0 0 5.6 0 c0 -1.6 -1 -3.4 -2.8 -6.8 z`} fill={`url(#${u}-gold)`}>
          <animateTransform attributeName="transform" type="translate" values="0 0;0 1.5;0 0" dur="2.4s" begin={`${d}s`} repeatCount="indefinite" />
        </path>
      ))}
    </svg>
  );
}

export function Wordmark({ className = "", uid = "wm" }: { className?: string; uid?: string }) {
  const u = uid;
  const ice = "wm-ice-text";
  return (
    <span className={`relative inline-flex items-baseline ${className}`} dir="ltr" aria-label="Mediatrix">
      <IceDefs u={u} />
      <span className={ice} aria-hidden="true">Med</span>
      <IvI u={u} />
      <span className={ice} aria-hidden="true">atr</span>
      <IvI u={u} delay={1.4} />
      <RibbonX u={u} />
      {/* frost sparkles */}
      {[
        ["8%", "-6%", 0],
        ["46%", "-10%", 1.2],
        ["78%", "4%", 2.1],
        ["24%", "88%", 0.6],
      ].map(([l, t, d], i) => (
        <svg key={i} viewBox="0 0 20 20" className="pointer-events-none absolute h-[0.16em] w-[0.16em]" style={{ left: l as string, top: t as string, animation: `twinkle 3.2s ease-in-out ${d}s infinite`, opacity: 0 }} aria-hidden="true">
          <path d="M10 0 V20 M0 10 H20 M3 3 L17 17 M17 3 L3 17" stroke="#bfe6f3" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      ))}
    </span>
  );
}
