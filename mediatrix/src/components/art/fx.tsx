// Reusable animated SVG effects (pure SVG + SMIL, no JS needed at runtime).

export function Firework({
  x,
  y,
  r = 18,
  color = "#f3d48c",
  delay = 0,
  dur = 2.6,
  rays = 14,
}: {
  x: number;
  y: number;
  r?: number;
  color?: string;
  delay?: number;
  dur?: number;
  rays?: number;
}) {
  const lines = Array.from({ length: rays }, (_, i) => {
    const a = (i / rays) * Math.PI * 2;
    return {
      x1: Math.cos(a) * r * 0.35,
      y1: Math.sin(a) * r * 0.35,
      x2: Math.cos(a) * r,
      y2: Math.sin(a) * r,
    };
  });
  const begin = `${delay}s`;
  return (
    <g transform={`translate(${x} ${y})`}>
      <g opacity="0">
        <animate attributeName="opacity" values="0;1;0.85;0" keyTimes="0;0.1;0.6;1" dur={`${dur}s`} begin={begin} repeatCount="indefinite" />
        <animateTransform attributeName="transform" type="scale" values="0.15;1;1.08" keyTimes="0;0.55;1" dur={`${dur}s`} begin={begin} repeatCount="indefinite" />
        {lines.map((l, i) => (
          <g key={i}>
            <line {...l} stroke={color} strokeWidth="0.9" strokeLinecap="round" />
            <circle cx={l.x2} cy={l.y2} r="0.9" fill="#fff" />
          </g>
        ))}
        <circle r={r * 0.18} fill={color} opacity="0.6" />
      </g>
    </g>
  );
}

export function Stars({ count = 26, w = 200, h = 90, seed = 1 }: { count?: number; w?: number; h?: number; seed?: number }) {
  // deterministic pseudo-random so server and client render the same markup
  let s = seed * 9301 + 49297;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const cx = rnd() * w;
        const cy = rnd() * h;
        const r = 0.3 + rnd() * 0.7;
        const d = 1.5 + rnd() * 3;
        return (
          <circle key={i} cx={cx} cy={cy} r={r} fill="#fff">
            <animate attributeName="opacity" values="0.2;1;0.2" dur={`${d}s`} begin={`${rnd() * 3}s`} repeatCount="indefinite" />
          </circle>
        );
      })}
    </g>
  );
}

export function Cloud({ y, scale = 1, dur = 38, delay = 0, opacity = 0.95 }: { y: number; scale?: number; dur?: number; delay?: number; opacity?: number }) {
  return (
    <g opacity={opacity}>
      <animateTransform attributeName="transform" type="translate" from={`-70 ${y}`} to={`230 ${y}`} dur={`${dur}s`} begin={`-${delay}s`} repeatCount="indefinite" />
      <g transform={`scale(${scale})`} fill="#fff">
        <ellipse cx="20" cy="10" rx="18" ry="7" />
        <ellipse cx="34" cy="6" rx="12" ry="8" />
        <ellipse cx="10" cy="7" rx="9" ry="6" />
        <ellipse cx="44" cy="11" rx="11" ry="5" />
      </g>
    </g>
  );
}

export function Beam({ x, y, color = "#cfe6ff", dur = 7, from = -26, to = 26, delay = 0, id }: { x: number; y: number; color?: string; dur?: number; from?: number; to?: number; delay?: number; id: string }) {
  return (
    <g transform={`translate(${x} ${y})`} style={{ mixBlendMode: "screen" }}>
      <defs>
        <linearGradient id={id} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={color} stopOpacity="0.75" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <g>
        <animateTransform attributeName="transform" type="rotate" values={`${from};${to};${from}`} dur={`${dur}s`} begin={`-${delay}s`} repeatCount="indefinite" />
        <polygon points="-1.5,0 1.5,0 14,-150 -14,-150" fill={`url(#${id})`} />
      </g>
    </g>
  );
}

/** A diagonal light sweep clipped to a shape (pass the clipPath id). */
export function Shine({ clip, id, dur = 5, delay = 0 }: { clip: string; id: string; dur?: number; delay?: number }) {
  return (
    <g clipPath={`url(#${clip})`} style={{ mixBlendMode: "screen" }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="-40" y="-20" width="30" height="200" fill={`url(#${id})`} transform="skewX(-18)">
        <animate attributeName="x" values="-60;260;260" keyTimes="0;0.5;1" dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
      </rect>
    </g>
  );
}

export function Skyline({ x0, x1, base, seed = 3, color = "#1d2b44", lit = false, maxH = 34, minH = 8 }: { x0: number; x1: number; base: number; seed?: number; color?: string; lit?: boolean; maxH?: number; minH?: number }) {
  let s = seed * 7919;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const blocks: { x: number; w: number; h: number }[] = [];
  let x = x0;
  while (x < x1) {
    const w = 5 + rnd() * 9;
    blocks.push({ x, w, h: minH + rnd() * (maxH - minH) });
    x += w + rnd() * 1.5;
  }
  return (
    <g>
      {blocks.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={base - b.h} width={b.w} height={b.h} fill={color} />
          {lit &&
            Array.from({ length: Math.floor(b.h / 4) }, (_, r) =>
              Array.from({ length: Math.max(1, Math.floor(b.w / 3)) }, (_, c) =>
                rnd() > 0.55 ? (
                  <rect key={`${r}-${c}`} x={b.x + 1 + c * 3} y={base - b.h + 2 + r * 4} width="1.2" height="1.4" fill="#ffd98a" opacity={0.5 + rnd() * 0.5} />
                ) : null,
              ),
            )}
        </g>
      ))}
    </g>
  );
}
