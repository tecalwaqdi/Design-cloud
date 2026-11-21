// Extra hero slides, drawn in the same visual language as ProductBanner
// (viewBox 0 40 1200 290 so all slides scale identically).

function Snow({ count = 26, seed = 5 }: { count?: number; seed?: number }) {
  let s = seed * 7919;
  const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const x = 140 + r() * 920;
        const size = 1.4 + r() * 2.6;
        const dur = 6 + r() * 6;
        const delay = -r() * dur;
        const drift = (r() - 0.5) * 40;
        return (
          <g key={i} opacity={0.55 + r() * 0.45}>
            <animateTransform attributeName="transform" type="translate" from={`${x} 30`} to={`${x + drift} 330`} dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
            {i % 3 === 0 ? (
              <path d={`M0 ${-size * 2} V${size * 2} M${-size * 2} 0 H${size * 2} M${-size * 1.4} ${-size * 1.4} L${size * 1.4} ${size * 1.4} M${size * 1.4} ${-size * 1.4} L${-size * 1.4} ${size * 1.4}`} stroke="#ffffff" strokeWidth="0.9" strokeLinecap="round" />
            ) : (
              <circle r={size * 0.8} fill="#ffffff" />
            )}
          </g>
        );
      })}
    </g>
  );
}

export function ColdChainBanner() {
  return (
    <svg viewBox="0 40 1200 290" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <radialGradient id="cc-glow" cx="0.5" cy="0.55" r="0.6">
          <stop offset="0" stopColor="#d9f1fa" />
          <stop offset="1" stopColor="#d9f1fa" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cc-box" x1="0" x2="1">
          <stop offset="0" stopColor="#c5d6de" />
          <stop offset="0.2" stopColor="#f6fafb" />
          <stop offset="0.7" stopColor="#ffffff" />
          <stop offset="1" stopColor="#bccbd3" />
        </linearGradient>
        <linearGradient id="cc-lid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#d6e3e9" />
        </linearGradient>
        <linearGradient id="cc-navy" x1="0" x2="1">
          <stop offset="0" stopColor="#1c2a3f" />
          <stop offset="0.5" stopColor="#2f4a6b" />
          <stop offset="1" stopColor="#1c2a3f" />
        </linearGradient>
        <linearGradient id="cc-gold" x1="0" x2="1">
          <stop offset="0" stopColor="#7d6238" />
          <stop offset="0.5" stopColor="#f1dfb3" />
          <stop offset="1" stopColor="#8a6c40" />
        </linearGradient>
        <linearGradient id="cc-glass" x1="0" x2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="0.3" stopColor="#d4ecf5" stopOpacity="0.7" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="cc-fluid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bfe9f5" />
          <stop offset="1" stopColor="#4f9fc4" />
        </linearGradient>
        <linearGradient id="cc-mist" x1="0" x2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="cc-shadow">
          <stop offset="0" stopColor="#1c2a3f" stopOpacity="0.28" />
          <stop offset="1" stopColor="#1c2a3f" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="600" cy="200" rx="520" ry="150" fill="url(#cc-glow)" />
      {/* frost branches in the corners */}
      {[
        [170, 300, 1],
        [1030, 300, -1],
      ].map(([x, y, f], k) => (
        <g key={k} transform={`translate(${x} ${y}) scale(${f} 1)`} stroke="#9fd0e3" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.8">
          <path d="M0 0 L60 -110" />
          {[20, 40, 60, 80].map((t, i) => (
            <g key={i}>
              <path d={`M${t * 0.55} ${-t} l${-18 + i * 2} ${-14}`} />
              <path d={`M${t * 0.55} ${-t} l${18 - i * 2} ${-6}`} />
            </g>
          ))}
        </g>
      ))}

      <ellipse cx="640" cy="303" rx="380" ry="15" fill="url(#cc-shadow)" />

      {/* thermometer showing the 2–8 °C band */}
      <g transform="translate(380 0)">
        <rect x="-11" y="120" width="22" height="160" rx="11" fill="url(#cc-glass)" stroke="#9fc5d6" />
        <rect x="-11" y="196" width="22" height="46" fill="#8fe3f0" opacity="0.35" />
        <rect x="-4.5" y="150" width="9" height="128" rx="4.5" fill="#eef7fb" />
        <rect x="-4.5" y="214" width="9" height="64" rx="4.5" fill="url(#cc-fluid)">
          <animate attributeName="y" values="214;206;214" dur="4s" repeatCount="indefinite" />
          <animate attributeName="height" values="64;72;64" dur="4s" repeatCount="indefinite" />
        </rect>
        <circle cy="284" r="16" fill="url(#cc-fluid)" stroke="#9fc5d6" />
        {[150, 172, 196, 220, 242, 264].map((y) => (
          <line key={y} x1="11" x2="19" y1={y} y2={y} stroke="#4f7f99" strokeWidth="1.2" />
        ))}
        <text x="26" y="200" fontFamily="var(--font-sans), sans-serif" fontWeight="700" fontSize="11" fill="#2f6d92">8°C</text>
        <text x="26" y="245" fontFamily="var(--font-sans), sans-serif" fontWeight="700" fontSize="11" fill="#2f6d92">2°C</text>
      </g>

      {/* medical cooler box with lid open */}
      <g>
        <polygon points="520,190 790,190 812,128 498,140" fill="url(#cc-lid)" stroke="#c4d3da" />
        <rect x="508" y="132" width="296" height="10" rx="5" fill="url(#cc-navy)" opacity="0.85" transform="rotate(-2.3 656 137)" />
        {/* contents peeking out */}
        {[548, 578, 608, 638, 668, 698, 728, 758].map((x, i) => (
          <g key={x}>
            {i % 3 === 1 ? (
              <g>
                <rect x={x - 5} y={150} width="10" height="44" rx="5" fill="#ffffff" stroke="#b9cbd3" />
                <rect x={x - 5} y={150} width="10" height="10" rx="4" fill="url(#cc-gold)" />
                <rect x={x - 3} y={168} width="6" height="14" rx="2" fill="url(#cc-fluid)" />
              </g>
            ) : (
              <g>
                <rect x={x - 8} y={164} width="16" height="30" rx="3" fill="url(#cc-glass)" stroke="#9fc5d6" />
                <rect x={x - 6} y={158} width="12" height="8" rx="1.5" fill={i % 2 ? "#4f9fc4" : "#2f6d92"} />
                <rect x={x - 6} y={176} width="12" height="16" rx="2" fill="url(#cc-fluid)" opacity="0.85" />
              </g>
            )}
          </g>
        ))}
        <rect x="512" y="188" width="288" height="114" rx="14" fill="url(#cc-box)" stroke="#c4d3da" />
        <rect x="512" y="210" width="288" height="12" fill="url(#cc-navy)" />
        <rect x="530" y="196" width="10" height="100" rx="5" fill="#ffffff" opacity="0.85" />
        {/* digital display */}
        <rect x="604" y="236" width="104" height="44" rx="8" fill="#185a70" />
        <text x="656" y="266" textAnchor="middle" fontFamily="var(--font-sans), sans-serif" fontWeight="700" fontSize="22" fill="#8fe3f0">
          4.0°C
          <animate attributeName="opacity" values="1;0.75;1" dur="2.4s" repeatCount="indefinite" />
        </text>
        <path d="M618 244 l4 0 M618 248 l4 0" stroke="#8fe3f0" strokeWidth="1" />
        <text x="752" y="260" textAnchor="middle" fontFamily="var(--font-logo), serif" fontWeight="700" fontSize="11" fill="#1c2a3f">MEDIATRIX</text>
        <text x="752" y="273" textAnchor="middle" fontFamily="var(--font-sans), sans-serif" fontWeight="600" fontSize="6" letterSpacing="1.5" fill="#2f6d92">COLD CHAIN</text>
        <path d="M640 302 v8 h32 v-8" fill="none" stroke="url(#cc-gold)" strokeWidth="4" strokeLinecap="round" />
      </g>

      {/* vials standing on ice */}
      {[860, 890, 920].map((x, i) => (
        <g key={x} transform={`translate(${x} ${i === 1 ? -10 : 0})`}>
          <rect x="-11" y="232" width="22" height="66" rx="5" fill="url(#cc-glass)" stroke="#9fc5d6" />
          <rect x="-9" y="252" width="18" height="44" rx="4" fill="url(#cc-fluid)" opacity="0.85" />
          <rect x="-8" y="222" width="16" height="11" rx="2" fill={i === 1 ? "url(#cc-gold)" : "#2f6d92"} />
          <rect x="-11" y="262" width="22" height="12" fill="#ffffff" opacity="0.75" />
        </g>
      ))}
      <path d="M836 300 l18 -14 l14 10 l20 -16 l16 12 l22 -10 l10 18 Z" fill="#e8f6fb" stroke="#bfe0ee" />

      {/* cold mist drifting out of the box */}
      {[0, 1, 2].map((i) => (
        <ellipse key={i} cx="656" cy="150" rx="120" ry="14" fill="url(#cc-mist)" opacity="0">
          <animate attributeName="cy" values="160;110" dur="5s" begin={`${i * 1.7}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.7;0" dur="5s" begin={`${i * 1.7}s`} repeatCount="indefinite" />
          <animate attributeName="rx" values="90;170" dur="5s" begin={`${i * 1.7}s`} repeatCount="indefinite" />
        </ellipse>
      ))}

      <Snow />
    </svg>
  );
}

const NODES = [
  { k: "SA", x: 600, y: 222, label: "Riyadh" },
  { k: "KW", x: 590, y: 138, label: "Kuwait" },
  { k: "BH", x: 665, y: 176, label: "Manama" },
  { k: "QA", x: 700, y: 196, label: "Doha" },
  { k: "AE", x: 776, y: 214, label: "Dubai" },
  { k: "OM", x: 852, y: 258, label: "Muscat" },
];

export function NetworkBanner() {
  const hub = NODES[0];
  const arc = (x: number, y: number) => `M${hub.x} ${hub.y} Q ${(hub.x + x) / 2} ${Math.min(hub.y, y) - 70}, ${x} ${y}`;
  // dotted "map" field
  const dots: [number, number][] = [];
  for (let gx = 300; gx <= 960; gx += 14) {
    for (let gy = 110; gy <= 300; gy += 14) {
      const dx = (gx - 640) / 330;
      const dy = (gy - 205) / 100;
      if (dx * dx + dy * dy < 1 && Math.sin(gx * 0.05) + Math.cos(gy * 0.07) > -0.9) dots.push([gx, gy]);
    }
  }
  return (
    <svg viewBox="0 40 1200 290" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <radialGradient id="nw-glow" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0" stopColor="#f3e6c6" stopOpacity="0.9" />
          <stop offset="1" stopColor="#f3e6c6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="nw-gold" x1="0" x2="1">
          <stop offset="0" stopColor="#7d6238" />
          <stop offset="0.5" stopColor="#f1dfb3" />
          <stop offset="1" stopColor="#a8875a" />
        </linearGradient>
      </defs>
      <ellipse cx="640" cy="205" rx="430" ry="140" fill="url(#nw-glow)" />
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.6" fill="#a8b8c2" opacity="0.55" />
      ))}

      {/* long-haul routes to the rest of the world */}
      {[
        "M600 222 C 470 90, 320 70, 170 110",
        "M600 222 C 500 140, 380 160, 160 200",
        "M776 214 C 900 100, 1000 90, 1080 120",
      ].map((d, i) => (
        <g key={i}>
          <path d={d} fill="none" stroke="#c9a96e" strokeOpacity="0.45" strokeWidth="1.2" strokeDasharray="3 6" />
          <circle r="3" fill="#c9a96e">
            <animateMotion dur={`${5 + i}s`} begin={`${i * 1.3}s`} repeatCount="indefinite" path={d} />
            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur={`${5 + i}s`} begin={`${i * 1.3}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}

      {/* Gulf routes from the hub, with light travelling along them */}
      {NODES.slice(1).map((n, i) => {
        const d = arc(n.x, n.y);
        return (
          <g key={n.k}>
            <path d={d} fill="none" stroke="url(#nw-gold)" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
            <path d={d} fill="none" stroke="#fff6dc" strokeWidth="2.4" strokeLinecap="round" pathLength={1} strokeDasharray="0.12 1">
              <animate attributeName="stroke-dashoffset" values="0.12;-1" dur="2.6s" begin={`${i * 0.45}s`} repeatCount="indefinite" />
            </path>
          </g>
        );
      })}

      {/* city nodes */}
      {NODES.map((n, i) => (
        <g key={n.k} transform={`translate(${n.x} ${n.y})`}>
          <circle r="6" fill="none" stroke="#c9a96e" strokeWidth="1.5">
            <animate attributeName="r" values="6;20" dur="2.4s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0" dur="2.4s" begin={`${i * 0.4}s`} repeatCount="indefinite" />
          </circle>
          <circle r={i === 0 ? 8 : 5.5} fill="url(#nw-gold)" stroke="#fff" strokeWidth="1.5" />
          <text y={i === 0 ? 26 : -12} textAnchor="middle" fontFamily="var(--font-sans), sans-serif" fontWeight="600" fontSize="10.5" fill="#1c2a3f" opacity="0.85">
            {n.label}
          </text>
        </g>
      ))}

      {/* delivery boxes at the hub */}
      <g transform="translate(470 258)">
        {[
          [0, 0, 46, 34],
          [48, 6, 38, 28],
          [18, -30, 40, 30],
        ].map(([x, y, w, h], i) => (
          <g key={i}>
            <rect x={x} y={y} width={w} height={h} rx="3" fill="#e9dcc0" stroke="#c9b08a" />
            <rect x={x + w / 2 - 4} y={y} width="8" height={h} fill="#c9a96e" opacity="0.6" />
            <path d={`M${x + 6} ${y + h - 8} h10`} stroke="#7d6238" strokeWidth="1.4" />
          </g>
        ))}
      </g>
    </svg>
  );
}
