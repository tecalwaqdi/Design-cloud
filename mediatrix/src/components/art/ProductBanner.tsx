// Hero banner illustration: silver silk band, flowing gold ribbon and a
// luxury skincare set (glass + gold). viewBox 1200 x 340.

const label = (x: number, y: number, size = 9, color = "#1c2a3f", sub?: string) => (
  <g textAnchor="middle" fontFamily="var(--font-logo), serif">
    <text x={x} y={y} fontSize={size} fontWeight="700" fill={color} letterSpacing="0.5">
      MEDIATRIX
    </text>
    {sub && (
      <text x={x} y={y + size * 1.15} fontSize={size * 0.55} fill={color} opacity="0.7" letterSpacing="1.5">
        {sub}
      </text>
    )}
  </g>
);

// shapes reused by the shine clip-path
const shapes = {
  dropperBody: { x: 293, y: 196, w: 72, h: 104, r: 13 },
  serum: { x: 414, y: 148, w: 46, h: 152, r: 9 },
  jarLid: { x: 496, y: 206, w: 128, h: 34, r: 6 },
  jarBody: { x: 500, y: 238, w: 120, h: 62, r: 11 },
  goldLid: { x: 640, y: 194, w: 116, h: 42, r: 6 },
  goldBody: { x: 644, y: 234, w: 108, h: 66, r: 11 },
  pump: { x: 870, y: 138, w: 74, h: 162, r: 14 },
  small: { x: 966, y: 214, w: 42, h: 86, r: 8 },
};

function R({ s, fill, ...rest }: { s: { x: number; y: number; w: number; h: number; r: number }; fill: string } & React.SVGProps<SVGRectElement>) {
  return <rect x={s.x} y={s.y} width={s.w} height={s.h} rx={s.r} fill={fill} {...rest} />;
}

function Leaves({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) {
  const leaves = [
    [18, -30, -40],
    [30, -52, 30],
    [44, -70, -35],
    [56, -92, 35],
    [68, -108, -30],
    [10, -14, 40],
  ];
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`} fill="none" stroke="url(#pb-gold-v)" strokeWidth="1.6">
      <path d="M0 0 C 20 -40, 50 -80, 80 -120" />
      {leaves.map(([lx, ly, rot], i) => (
        <ellipse key={i} cx={lx} cy={ly} rx="11" ry="4.2" transform={`rotate(${rot} ${lx} ${ly})`} fill="url(#pb-gold-v)" fillOpacity="0.35">
          <animateTransform attributeName="transform" type="rotate" values={`${rot} ${lx} ${ly};${rot + 6} ${lx} ${ly};${rot} ${lx} ${ly}`} dur={`${4 + i * 0.4}s`} repeatCount="indefinite" />
        </ellipse>
      ))}
    </g>
  );
}

export function ProductBanner({ showProducts = true }: { showProducts?: boolean }) {
  return (
    <svg viewBox="0 40 1200 290" className="h-full w-full" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <linearGradient id="pb-silk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.35" stopColor="#e3eaee" />
          <stop offset="0.7" stopColor="#b8c5cc" />
          <stop offset="1" stopColor="#eef3f5" />
        </linearGradient>
        <linearGradient id="pb-silk-h" x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="pb-gold" x1="0" x2="1">
          <stop offset="0" stopColor="#7d6238" />
          <stop offset="0.28" stopColor="#d9bd86" />
          <stop offset="0.5" stopColor="#fff1c9" />
          <stop offset="0.72" stopColor="#c9a96e" />
          <stop offset="1" stopColor="#7d6238" />
        </linearGradient>
        <linearGradient id="pb-gold-v" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e9d3a0" />
          <stop offset="1" stopColor="#a8875a" />
        </linearGradient>
        <linearGradient id="pb-glass" x1="0" x2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="0.18" stopColor="#dce8ed" stopOpacity="0.75" />
          <stop offset="0.5" stopColor="#f6fafb" stopOpacity="0.55" />
          <stop offset="0.85" stopColor="#c9d8df" stopOpacity="0.8" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="pb-frost" x1="0" x2="1">
          <stop offset="0" stopColor="#b9c5cc" />
          <stop offset="0.25" stopColor="#f3f7f8" />
          <stop offset="0.55" stopColor="#d4dde2" />
          <stop offset="0.8" stopColor="#ffffff" />
          <stop offset="1" stopColor="#aeb9c0" />
        </linearGradient>
        <linearGradient id="pb-amber" x1="0" x2="1">
          <stop offset="0" stopColor="#9c6418" />
          <stop offset="0.4" stopColor="#f2c66b" />
          <stop offset="0.6" stopColor="#ffe3a3" />
          <stop offset="1" stopColor="#a36a1c" />
        </linearGradient>
        <linearGradient id="pb-liquid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6e2bf" stopOpacity="0.55" />
          <stop offset="1" stopColor="#e7c58c" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="pb-blush" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbe9e6" stopOpacity="0.4" />
          <stop offset="1" stopColor="#f0cfc8" stopOpacity="0.85" />
        </linearGradient>
        <radialGradient id="pb-shadow">
          <stop offset="0" stopColor="#1c2a3f" stopOpacity="0.28" />
          <stop offset="1" stopColor="#1c2a3f" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pb-shine" x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.8" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id="pb-products">
          {Object.values(shapes).map((s, i) => (
            <rect key={i} x={s.x} y={s.y} width={s.w} height={s.h} rx={s.r} />
          ))}
          <rect x="312" y="158" width="34" height="24" rx="3" />
          <rect x="420" y="116" width="34" height="34" rx="4" />
          <rect x="896" y="96" width="48" height="14" rx="3" />
        </clipPath>
      </defs>

      {/* silver silk band */}
      <path fill="url(#pb-silk)" opacity="0.95">
        <animate
          attributeName="d"
          dur="9s"
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.45 0 0.55 1;0.45 0 0.55 1"
          values="M-10 150 C 260 96, 560 214, 1210 136 L1210 222 C 620 290, 300 176, -10 236 Z;
                  M-10 140 C 280 116, 600 200, 1210 148 L1210 230 C 600 276, 280 194, -10 226 Z;
                  M-10 150 C 260 96, 560 214, 1210 136 L1210 222 C 620 290, 300 176, -10 236 Z"
        />
      </path>
      <path fill="none" stroke="url(#pb-silk-h)" strokeWidth="5" opacity="0.9">
        <animate
          attributeName="d"
          dur="9s"
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.45 0 0.55 1;0.45 0 0.55 1"
          values="M-10 168 C 260 116, 560 232, 1210 156;M-10 158 C 280 136, 600 218, 1210 168;M-10 168 C 260 116, 560 232, 1210 156"
        />
      </path>

      <Leaves x={170} y={300} />
      <Leaves x={1040} y={300} flip />

      {/* flowing gold ribbon (behind) */}
      <path fill="none" stroke="url(#pb-gold)" strokeWidth="9" strokeLinecap="round" opacity="0.9">
        <animate
          attributeName="d"
          dur="7s"
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.45 0 0.55 1;0.45 0 0.55 1"
          values="M-30 110 C 220 30, 420 250, 640 150 S 1000 40, 1230 190;
                  M-30 140 C 240 60, 440 210, 660 120 S 980 90, 1230 150;
                  M-30 110 C 220 30, 420 250, 640 150 S 1000 40, 1230 190"
        />
      </path>

      {showProducts && (
        <g>
          <ellipse cx="640" cy="302" rx="430" ry="16" fill="url(#pb-shadow)" />

          {/* dropper bottle */}
          <R s={shapes.dropperBody} fill="url(#pb-glass)" stroke="#fff" strokeOpacity="0.8" />
          <rect x="298" y="226" width="62" height="70" rx="10" fill="url(#pb-liquid)" />
          <rect x="316" y="180" width="26" height="18" rx="3" fill="url(#pb-glass)" />
          <rect x="312" y="158" width="34" height="24" rx="3" fill="url(#pb-gold)" />
          <rect x="319" y="114" width="20" height="46" rx="10" fill="#f1ebe0" />
          <rect x="322" y="118" width="4" height="36" rx="2" fill="#fff" opacity="0.8" />
          <line x1="329" y1="182" x2="329" y2="270" stroke="#cfdde4" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
          <rect x="300" y="203" width="6" height="88" rx="3" fill="#fff" opacity="0.75" />
          <rect x="303" y="238" width="52" height="34" rx="3" fill="#fff" opacity="0.55" />
          {label(329, 253, 8, "#1c2a3f", "SERUM")}

          {/* tall serum */}
          <R s={shapes.serum} fill="url(#pb-glass)" stroke="#fff" strokeOpacity="0.8" />
          <rect x="418" y="190" width="38" height="106" rx="7" fill="url(#pb-blush)" />
          <rect x="420" y="116" width="34" height="34" rx="4" fill="url(#pb-gold)" />
          <rect x="419" y="156" width="5" height="136" rx="2.5" fill="#fff" opacity="0.7" />
          <g transform="rotate(-90 437 240)">{label(437, 243, 9, "#7d6238")}</g>

          {/* silver jar */}
          <R s={shapes.jarBody} fill="url(#pb-frost)" />
          <R s={shapes.jarLid} fill="url(#pb-frost)" />
          <rect x="496" y="234" width="128" height="6" fill="#9fadb5" opacity="0.6" />
          <rect x="504" y="212" width="10" height="24" rx="3" fill="#fff" opacity="0.8" />
          {label(560, 268, 11, "#1c2a3f", "RENEWAL CREAM")}

          {/* gold jar */}
          <R s={shapes.goldBody} fill="url(#pb-frost)" />
          <rect x="644" y="276" width="108" height="6" fill="url(#pb-gold)" />
          <R s={shapes.goldLid} fill="url(#pb-gold)" />
          <rect x="648" y="200" width="10" height="30" rx="3" fill="#fff" opacity="0.6" />
          {label(698, 220, 10, "#5c4626", "GOLD")}
          {label(698, 260, 10, "#7d6238")}

          {/* ampoules */}
          {[780, 806, 832].map((x, i) => (
            <g key={x} transform={`translate(${x} ${i === 1 ? -14 : 0})`}>
              <rect x="-8" y="222" width="16" height="78" rx="6" fill="url(#pb-amber)" />
              <path d="M-5 223 C -5 214, -2 212, -2 206 L 2 206 C 2 212, 5 214, 5 223 Z" fill="url(#pb-amber)" />
              <ellipse cx="0" cy="200" rx="4" ry="7" fill="url(#pb-amber)" />
              <rect x="-8" y="250" width="16" height="16" fill="#fff" opacity="0.65" />
              <rect x="-5" y="228" width="2.5" height="66" rx="1.2" fill="#fff" opacity="0.6" />
            </g>
          ))}

          {/* pump bottle */}
          <R s={shapes.pump} fill="url(#pb-glass)" stroke="#fff" strokeOpacity="0.8" />
          <rect x="874" y="176" width="66" height="120" rx="12" fill="url(#pb-blush)" />
          <rect x="896" y="120" width="22" height="20" rx="3" fill="url(#pb-gold)" />
          <rect x="902" y="108" width="10" height="14" fill="url(#pb-gold)" />
          <rect x="896" y="96" width="48" height="14" rx="3" fill="url(#pb-gold)" />
          <rect x="936" y="100" width="24" height="5" rx="2.5" fill="url(#pb-gold)" />
          <rect x="878" y="146" width="7" height="146" rx="3.5" fill="#fff" opacity="0.7" />
          {label(907, 236, 11, "#1c2a3f", "HYDRA LOTION")}

          {/* small bottle */}
          <R s={shapes.small} fill="url(#pb-glass)" stroke="#fff" strokeOpacity="0.8" />
          <rect x="969" y="240" width="36" height="56" rx="6" fill="url(#pb-liquid)" />
          <rect x="972" y="188" width="30" height="28" rx="4" fill="url(#pb-gold)" />
          {label(987, 266, 6.5, "#1c2a3f")}

          {/* water splash near the dropper */}
          <g fill="url(#pb-glass)" stroke="#fff" strokeWidth="0.8">
            <path d="M262 286 C 250 250, 270 230, 282 214 C 278 240, 292 262, 288 290 Z" opacity="0.7" />
            <path d="M372 288 C 386 260, 378 236, 392 218 C 400 242, 392 268, 384 292 Z" opacity="0.6" />
          </g>
          {[
            [258, 206, 4],
            [276, 190, 2.5],
            [396, 204, 3],
            [404, 186, 2],
            [248, 232, 2],
          ].map(([cx, cy, r], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill="url(#pb-glass)" stroke="#fff" strokeWidth="0.8">
              <animate attributeName="cy" values={`${cy};${cy - 6};${cy}`} dur={`${2.6 + i * 0.3}s`} repeatCount="indefinite" />
            </circle>
          ))}

          {/* light sweep across the glass */}
          <g clipPath="url(#pb-products)" style={{ mixBlendMode: "screen" }}>
            <rect x="-120" y="80" width="70" height="240" fill="url(#pb-shine)" transform="skewX(-20)">
              <animate attributeName="x" values="160;1180;1180" keyTimes="0;0.55;1" dur="6.5s" repeatCount="indefinite" />
            </rect>
          </g>
        </g>
      )}

      {/* thin gold ribbon (in front) */}
      <path fill="none" stroke="url(#pb-gold)" strokeWidth="2.6" strokeLinecap="round" opacity="0.95">
        <animate
          attributeName="d"
          dur="8s"
          repeatCount="indefinite"
          calcMode="spline"
          keySplines="0.45 0 0.55 1;0.45 0 0.55 1"
          values="M-30 250 C 200 330, 380 170, 560 300 S 900 330, 1230 230;
                  M-30 270 C 220 300, 400 200, 580 290 S 920 300, 1230 250;
                  M-30 250 C 200 330, 380 170, 560 300 S 900 330, 1230 230"
        />
      </path>
    </svg>
  );
}
