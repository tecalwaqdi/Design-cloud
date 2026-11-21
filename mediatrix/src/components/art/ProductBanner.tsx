// Hero banner illustration: silver silk band, flowing gold ribbon and a set of
// premium medical supplies (oxygen cylinder, antiseptic, nitrile gloves,
// glucose meter, blood-pressure monitor, pulse oximeter, vials, syringe).
// viewBox crops to 0 40 1200 290.

const brand = (x: number, y: number, size = 9, color = "#1c2a3f", sub?: string) => (
  <g textAnchor="middle" fontFamily="var(--font-logo), serif">
    <text x={x} y={y} fontSize={size} fontWeight="700" fill={color} letterSpacing="0.5">
      MEDIATRIX
    </text>
    {sub && (
      <text x={x} y={y + size * 1.2} fontSize={size * 0.55} fontFamily="var(--font-sans), sans-serif" fontWeight="600" fill={color} opacity="0.75" letterSpacing="1.2">
        {sub}
      </text>
    )}
  </g>
);

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

/** Two readings that cross-fade, like a device refreshing its display. */
function Reading({ x, y, a, b, size, color = "#8fe3f0", dur = 5, delay = 0 }: { x: number; y: number; a: string; b: string; size: number; color?: string; dur?: number; delay?: number }) {
  return (
    <g fontFamily="var(--font-sans), sans-serif" fontWeight="700" fontSize={size} fill={color} textAnchor="middle">
      <text x={x} y={y}>
        {a}
        <animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;0.45;0.5;0.95;1" dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
      </text>
      <text x={x} y={y} opacity="0">
        {b}
        <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.45;0.5;0.95;1" dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
      </text>
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
        <linearGradient id="pb-white" x1="0" x2="1">
          <stop offset="0" stopColor="#c7d1d7" />
          <stop offset="0.2" stopColor="#f7fafb" />
          <stop offset="0.6" stopColor="#ffffff" />
          <stop offset="0.85" stopColor="#e4ebee" />
          <stop offset="1" stopColor="#b7c3c9" />
        </linearGradient>
        <linearGradient id="pb-white-top" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e3eaee" />
        </linearGradient>
        <linearGradient id="pb-screen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a7f99" />
          <stop offset="1" stopColor="#185a70" />
        </linearGradient>
        <linearGradient id="pb-teal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bfe6ec" stopOpacity="0.55" />
          <stop offset="1" stopColor="#6fbfcc" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="pb-nitrile" x1="0" x2="1">
          <stop offset="0" stopColor="#5b8fd0" />
          <stop offset="0.45" stopColor="#a9cbf2" />
          <stop offset="1" stopColor="#4f7fbf" />
        </linearGradient>
        <linearGradient id="pb-cuff" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b9c8d2" />
          <stop offset="1" stopColor="#7f93a3" />
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
          <path d="M282 300 V168 a29 29 0 0 1 58 0 V300 Z" />
          <rect x="362" y="168" width="70" height="132" rx="14" />
          <rect x="452" y="220" width="140" height="80" rx="4" />
          <rect x="614" y="206" width="64" height="94" rx="16" />
          <rect x="692" y="222" width="126" height="78" rx="12" />
          <rect x="960" y="256" width="54" height="44" rx="14" />
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
      <Leaves x={1080} y={300} flip />

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
          <ellipse cx="650" cy="303" rx="420" ry="16" fill="url(#pb-shadow)" />

          {/* ── oxygen cylinder ── */}
          <path d="M282 300 V168 a29 29 0 0 1 58 0 V300 Z" fill="url(#pb-white)" />
          <rect x="282" y="196" width="58" height="14" fill="#6fbfcc" opacity="0.9" />
          <rect x="282" y="212" width="58" height="3" fill="url(#pb-gold)" />
          <text x="311" y="258" textAnchor="middle" fontFamily="var(--font-logo), serif" fontWeight="700" fontSize="26" fill="#1c2a3f">
            O<tspan fontSize="14" dy="6">2</tspan>
          </text>
          <text x="311" y="282" textAnchor="middle" fontFamily="var(--font-sans), sans-serif" fontWeight="600" fontSize="6" fill="#1c2a3f" opacity="0.7" letterSpacing="1.5">
            MEDICAL OXYGEN
          </text>
          <rect x="288" y="172" width="6" height="122" rx="3" fill="#fff" opacity="0.8" />
          <rect x="303" y="124" width="16" height="22" rx="2" fill="url(#pb-gold)" />
          <ellipse cx="311" cy="122" rx="17" ry="5" fill="url(#pb-gold)" />
          <rect x="318" y="130" width="14" height="5" fill="url(#pb-gold)" />
          <circle cx="340" cy="132" r="10" fill="#fff" stroke="url(#pb-gold)" strokeWidth="2.5" />
          <line x1="340" y1="132" x2="340" y2="125" stroke="#1c2a3f" strokeWidth="1.4" strokeLinecap="round">
            <animateTransform attributeName="transform" type="rotate" values="-50 340 132;40 340 132;20 340 132;40 340 132;-50 340 132" dur="7s" repeatCount="indefinite" />
          </line>

          {/* ── antiseptic pump bottle ── */}
          <rect x="362" y="168" width="70" height="132" rx="14" fill="url(#pb-glass)" stroke="#fff" strokeOpacity="0.85" />
          <rect x="366" y="196" width="62" height="100" rx="11" fill="url(#pb-teal)" />
          <rect x="384" y="150" width="26" height="20" rx="3" fill="url(#pb-white)" />
          <rect x="392" y="138" width="10" height="14" fill="url(#pb-gold)" />
          <rect x="380" y="126" width="36" height="13" rx="3" fill="url(#pb-gold)" />
          <rect x="410" y="130" width="28" height="5" rx="2.5" fill="url(#pb-gold)" />
          <rect x="370" y="232" width="54" height="44" rx="4" fill="#fff" opacity="0.8" />
          <path d="M397 238 v10 M392 243 h10" stroke="#6fbfcc" strokeWidth="2.4" strokeLinecap="round" />
          {brand(397, 260, 8.5, "#1c2a3f", "ANTISEPTIC")}
          <rect x="368" y="176" width="6" height="116" rx="3" fill="#fff" opacity="0.75" />
          {/* bubbles rising in the liquid */}
          {[376, 396, 414].map((cx, i) => (
            <circle key={cx} cx={cx} cy="290" r={1.6 + i * 0.4} fill="#fff" opacity="0.8">
              <animate attributeName="cy" values="292;205" dur={`${3 + i}s`} begin={`${i * 0.8}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0.9;0" dur={`${3 + i}s`} begin={`${i * 0.8}s`} repeatCount="indefinite" />
            </circle>
          ))}

          {/* ── box of nitrile gloves ── */}
          <polygon points="452,220 592,220 606,208 466,208" fill="url(#pb-white-top)" />
          <polygon points="592,220 606,208 606,288 592,300" fill="#c9d4da" />
          <rect x="452" y="220" width="140" height="80" rx="3" fill="url(#pb-white)" />
          <ellipse cx="529" cy="214" rx="36" ry="4.2" fill="#9fb0ba" />
          <path
            d="M505 214 C 502 198, 508 188, 513 184 L 514 168 C 514 163, 521 163, 521 168 L 522 181 L 524 162 C 524 157, 531 157, 531 162 L 531 181 L 533 165 C 533 160, 540 160, 540 165 L 539 183 L 543 172 C 545 167, 551 169, 549 174 L 545 192 C 553 198, 557 207, 553 214 Z"
            fill="url(#pb-nitrile)"
          >
            <animateTransform attributeName="transform" type="translate" values="0 2;0 -2;0 2" dur="4s" repeatCount="indefinite" />
          </path>
          <rect x="452" y="232" width="140" height="5" fill="#6fbfcc" opacity="0.85" />
          {brand(522, 258, 11, "#1c2a3f", "NITRILE EXAM GLOVES")}
          <rect x="452" y="284" width="140" height="3" fill="url(#pb-gold)" />
          <text x="580" y="279" textAnchor="end" fontFamily="var(--font-sans), sans-serif" fontWeight="700" fontSize="7" fill="#7d6238">
            100 PCS
          </text>

          {/* ── glucose meter ── */}
          <rect x="642" y="190" width="12" height="20" rx="1.5" fill="#fff" stroke="#c9d4da" />
          <rect x="645" y="192" width="6" height="4" fill="url(#pb-gold)" />
          <path d="M648 181 C 646 184, 645 186, 645 187.5 a3 3 0 0 0 6 0 C 651 186, 650 184, 648 181 Z" fill="#d64545">
            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.2;0.8;1" dur="5s" repeatCount="indefinite" />
          </path>
          <rect x="614" y="206" width="64" height="94" rx="16" fill="url(#pb-white)" />
          <rect x="622" y="216" width="48" height="36" rx="6" fill="url(#pb-screen)" />
          <Reading x={646} y={238} a="112" b="98" size={15} />
          <text x="646" y="248" textAnchor="middle" fontFamily="var(--font-sans), sans-serif" fontSize="5.5" fill="#8fe3f0" opacity="0.8">
            mg/dL
          </text>
          <circle cx="646" cy="272" r="9" fill="url(#pb-gold)" />
          <circle cx="646" cy="272" r="5" fill="#fff" opacity="0.35" />
          <text x="646" y="292" textAnchor="middle" fontFamily="var(--font-logo), serif" fontWeight="700" fontSize="6" fill="#1c2a3f">
            MEDIATRIX
          </text>

          {/* ── blood pressure monitor + cuff ── */}
          <path d="M818 256 C 860 244, 850 296, 888 286" fill="none" stroke="#9fb0ba" strokeWidth="3.2" strokeLinecap="round" />
          <rect x="868" y="278" width="88" height="24" rx="11" fill="url(#pb-cuff)" />
          <rect x="876" y="288" width="72" height="3" rx="1.5" fill="url(#pb-gold)" opacity="0.9" />
          <rect x="692" y="222" width="126" height="78" rx="12" fill="url(#pb-white)" />
          <rect x="700" y="230" width="80" height="54" rx="6" fill="url(#pb-screen)" />
          <g fontFamily="var(--font-sans), sans-serif" fontSize="5" fill="#8fe3f0" opacity="0.75">
            <text x="705" y="239">SYS</text>
            <text x="705" y="257">DIA</text>
            <text x="705" y="276">PUL</text>
          </g>
          <Reading x={752} y={246} a="120" b="118" size={14} dur={6} />
          <Reading x={752} y={264} a="80" b="78" size={12} dur={6} />
          <Reading x={752} y={280} a="72" b="75" size={8} dur={6} />
          <path d="M766 276 l3 -4 l3 4 l3 -6 l3 6" fill="none" stroke="#e5687a" strokeWidth="1.2" strokeLinejoin="round">
            <animate attributeName="opacity" values="1;0.2;1" dur="0.9s" repeatCount="indefinite" />
          </path>
          <circle cx="799" cy="252" r="10" fill="url(#pb-gold)" />
          <circle cx="799" cy="252" r="5.5" fill="#fff" opacity="0.35" />
          <text x="799" y="282" textAnchor="middle" fontFamily="var(--font-logo), serif" fontWeight="700" fontSize="6.5" fill="#1c2a3f">
            MEDIATRIX
          </text>

          {/* ── pulse oximeter ── */}
          <path d="M962 262 C 962 246, 1012 246, 1012 262 Z" fill="url(#pb-white-top)" />
          <rect x="960" y="256" width="54" height="44" rx="14" fill="url(#pb-white)" />
          <rect x="967" y="266" width="40" height="22" rx="4" fill="url(#pb-screen)" />
          <Reading x={981} y={281} a="98" b="97" size={10} dur={4} />
          <text x="995" y="275" fontFamily="var(--font-sans), sans-serif" fontSize="4" fill="#8fe3f0" opacity="0.8">
            SpO2
          </text>
          <rect x="994" y="279" width="9" height="5" rx="1" fill="none" stroke="#e5687a" strokeWidth="0.9">
            <animate attributeName="opacity" values="1;0.2;1" dur="0.9s" repeatCount="indefinite" />
          </rect>

          {/* ── medicine vials ── */}
          {[1034, 1056].map((x, i) => (
            <g key={x} transform={`translate(${x} ${i ? 6 : 0})`}>
              <rect x="-9" y="246" width="18" height="48" rx="4" fill="url(#pb-glass)" stroke="#fff" strokeOpacity="0.8" />
              <rect x="-7" y="262" width="14" height="30" rx="3" fill="url(#pb-teal)" />
              <rect x="-6" y="238" width="12" height="9" rx="1.5" fill={i ? "url(#pb-gold)" : "#6fbfcc"} />
              <rect x="-9" y="270" width="18" height="10" fill="#fff" opacity="0.7" />
            </g>
          ))}

          {/* ── syringe lying in front ── */}
          <g transform="translate(470 314) rotate(-2.5)">
            <line x1="-82" y1="0" x2="-14" y2="0" stroke="#aeb9c0" strokeWidth="1.6" strokeLinecap="round" />
            <rect x="-16" y="-4.5" width="16" height="9" rx="2" fill="url(#pb-gold)" />
            <rect x="0" y="-8" width="172" height="16" rx="4" fill="url(#pb-glass)" stroke="#c9d8df" />
            <rect x="2" y="-5.5" width="118" height="11" rx="2" fill="url(#pb-teal)" />
            {Array.from({ length: 15 }, (_, k) => (
              <line key={k} x1={10 + k * 10} y1="-8" x2={10 + k * 10} y2={k % 2 ? -4 : -2} stroke="#1c2a3f" strokeOpacity="0.45" strokeWidth="0.7" />
            ))}
            <rect x="120" y="-7" width="10" height="14" rx="2" fill="#7f93a3" />
            <rect x="130" y="-2.5" width="78" height="5" rx="1.5" fill="url(#pb-white)" />
            <rect x="170" y="-15" width="6" height="30" rx="2" fill="url(#pb-white)" />
            <rect x="206" y="-11" width="7" height="22" rx="2" fill="url(#pb-gold)" />
          </g>

          {/* light sweep across the glass and devices */}
          <g clipPath="url(#pb-products)" style={{ mixBlendMode: "screen" }}>
            <rect x="-120" y="80" width="70" height="240" fill="url(#pb-shine)" transform="skewX(-20)">
              <animate attributeName="x" values="200;1200;1200" keyTimes="0;0.55;1" dur="6.5s" repeatCount="indefinite" />
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
