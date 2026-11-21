// Shared hero-banner motion: silver silk band + flowing gold ribbons (+ optional gold leaves).
// Used by every slide so all banners share the same moving language.

function Leaves({ u, x, y, flip = false }: { u: string; x: number; y: number; flip?: boolean }) {
  const leaves = [
    [18, -30, -40],
    [30, -52, 30],
    [44, -70, -35],
    [56, -92, 35],
    [68, -108, -30],
    [10, -14, 40],
  ];
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`} fill="none" stroke={`url(#${u}-gold-v)`} strokeWidth="1.6">
      <path d="M0 0 C 20 -40, 50 -80, 80 -120" />
      {leaves.map(([lx, ly, rot], i) => (
        <ellipse key={i} cx={lx} cy={ly} rx="11" ry="4.2" transform={`rotate(${rot} ${lx} ${ly})`} fill={`url(#${u}-gold-v)`} fillOpacity="0.35">
          <animateTransform attributeName="transform" type="rotate" values={`${rot} ${lx} ${ly};${rot + 6} ${lx} ${ly};${rot} ${lx} ${ly}`} dur={`${4 + i * 0.4}s`} repeatCount="indefinite" />
        </ellipse>
      ))}
    </g>
  );
}

export function RibbonDefs({ u, icy = false }: { u: string; icy?: boolean }) {
  return (
    <defs>
      <linearGradient id={`${u}-silk`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="0.35" stopColor={icy ? "#dceff6" : "#e3eaee"} />
        <stop offset="0.7" stopColor={icy ? "#a9cbdb" : "#b8c5cc"} />
        <stop offset="1" stopColor={icy ? "#eaf6fa" : "#eef3f5"} />
      </linearGradient>
      <linearGradient id={`${u}-silk-h`} x1="0" x2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0" />
        <stop offset="0.5" stopColor="#fff" stopOpacity="0.9" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <linearGradient id={`${u}-gold`} x1="0" x2="1">
        <stop offset="0" stopColor="#7d6238" />
        <stop offset="0.28" stopColor="#d9bd86" />
        <stop offset="0.5" stopColor="#fff1c9" />
        <stop offset="0.72" stopColor="#c9a96e" />
        <stop offset="1" stopColor="#7d6238" />
      </linearGradient>
      <linearGradient id={`${u}-gold-v`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#e9d3a0" />
        <stop offset="1" stopColor="#a8875a" />
      </linearGradient>
    </defs>
  );
}

const spline = { calcMode: "spline" as const, keySplines: "0.45 0 0.55 1;0.45 0 0.55 1", repeatCount: "indefinite" as const };

/** Silk band, optional leaves and the thick gold ribbon — drawn behind the products. */
export function RibbonsBack({ u, leaves = true }: { u: string; leaves?: boolean }) {
  return (
    <g>
      <path fill={`url(#${u}-silk)`} opacity="0.95">
        <animate
          attributeName="d"
          dur="9s"
          {...spline}
          values="M-10 150 C 260 96, 560 214, 1210 136 L1210 222 C 620 290, 300 176, -10 236 Z;M-10 140 C 280 116, 600 200, 1210 148 L1210 230 C 600 276, 280 194, -10 226 Z;M-10 150 C 260 96, 560 214, 1210 136 L1210 222 C 620 290, 300 176, -10 236 Z"
        />
      </path>
      <path fill="none" stroke={`url(#${u}-silk-h)`} strokeWidth="5" opacity="0.9">
        <animate attributeName="d" dur="9s" {...spline} values="M-10 168 C 260 116, 560 232, 1210 156;M-10 158 C 280 136, 600 218, 1210 168;M-10 168 C 260 116, 560 232, 1210 156" />
      </path>
      {leaves && (
        <>
          <Leaves u={u} x={170} y={300} />
          <Leaves u={u} x={1080} y={300} flip />
        </>
      )}
      <path fill="none" stroke={`url(#${u}-gold)`} strokeWidth="9" strokeLinecap="round" opacity="0.9">
        <animate
          attributeName="d"
          dur="7s"
          {...spline}
          values="M-30 110 C 220 30, 420 250, 640 150 S 1000 40, 1230 190;M-30 140 C 240 60, 440 210, 660 120 S 980 90, 1230 150;M-30 110 C 220 30, 420 250, 640 150 S 1000 40, 1230 190"
        />
      </path>
    </g>
  );
}

/** Thin gold ribbon drawn in front of the products. */
export function RibbonFront({ u }: { u: string }) {
  return (
    <path fill="none" stroke={`url(#${u}-gold)`} strokeWidth="2.6" strokeLinecap="round" opacity="0.95">
      <animate
        attributeName="d"
        dur="8s"
        {...spline}
        values="M-30 250 C 200 330, 380 170, 560 300 S 900 330, 1230 230;M-30 270 C 220 300, 400 200, 580 290 S 920 300, 1230 250;M-30 250 C 200 330, 380 170, 560 300 S 900 330, 1230 230"
      />
    </path>
  );
}
