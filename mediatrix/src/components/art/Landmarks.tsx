import type { LandmarkArt } from "@/lib/types";
import { Beam, Cloud, Firework, Shine, Skyline, Stars } from "./fx";

// Animated landmark scenes for the country cards. viewBox 200 x 150.
// Each scene gets a unique prefix so gradient / clip ids never collide.

type P = { id: string };

function Frame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <svg viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice" className="h-full w-full" role="img" aria-label={label}>
      {children}
    </svg>
  );
}

function Liberty({ id }: P) {
  return (
    <Frame label="Statue of Liberty">
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6fa8db" />
          <stop offset="0.65" stopColor="#bfdcf3" />
          <stop offset="1" stopColor="#eef6fb" />
        </linearGradient>
        <linearGradient id={`${id}-sea`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5d8fb8" />
          <stop offset="1" stopColor="#2f5f88" />
        </linearGradient>
        <linearGradient id={`${id}-cu`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4f8a7d" />
          <stop offset="0.45" stopColor="#8cc3b4" />
          <stop offset="1" stopColor="#3f7468" />
        </linearGradient>
        <radialGradient id={`${id}-flame`}>
          <stop offset="0" stopColor="#fff6d6" />
          <stop offset="0.5" stopColor="#f2c66b" />
          <stop offset="1" stopColor="#f2c66b" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${id}-statue`}>
          <path d="M62 99 C63 86 61 73 64 63 L70 57 L76 61 C79 73 78 87 79 99 Z" />
          <path d="M56 123 L84 123 L82 99 L58 99 Z" />
        </clipPath>
      </defs>
      <rect width="200" height="150" fill={`url(#${id}-sky)`} />
      <Cloud y={14} scale={0.9} dur={46} delay={8} />
      <Cloud y={34} scale={0.6} dur={34} delay={22} opacity={0.8} />
      <Cloud y={6} scale={0.5} dur={28} delay={2} opacity={0.7} />
      {/* Manhattan skyline */}
      <Skyline x0={104} x1={200} base={126} seed={5} color="#7f98b3" maxH={46} />
      <rect x="150" y="66" width="7" height="60" fill="#6f88a3" />
      <polygon points="150,66 153.5,52 157,66" fill="#6f88a3" />
      <Skyline x0={110} x1={200} base={126} seed={11} color="#5f7893" maxH={28} />
      {/* sea */}
      <rect y="124" width="200" height="26" fill={`url(#${id}-sea)`} />
      {[130, 136, 142].map((y, i) => (
        <line key={y} x1="0" x2="200" y1={y} y2={y} stroke="#cfe3f2" strokeOpacity="0.35" strokeWidth="0.6" strokeDasharray="6 9">
          <animate attributeName="stroke-dashoffset" from="0" to={i % 2 ? 30 : -30} dur="4s" repeatCount="indefinite" />
        </line>
      ))}
      {/* island + star fort */}
      <ellipse cx="70" cy="128" rx="42" ry="5" fill="#40614f" />
      <polygon points="38,128 102,128 95,121 45,121" fill="#b9a789" />
      {/* pedestal */}
      <path d="M56 123 L84 123 L82 99 L58 99 Z" fill="#cdb894" />
      <rect x="55" y="96" width="30" height="4" fill="#bca783" />
      <rect x="64" y="104" width="12" height="10" fill="#b8a37f" opacity="0.6" />
      {/* figure */}
      <path d="M62 99 C63 86 61 73 64 63 L70 57 L76 61 C79 73 78 87 79 99 Z" fill={`url(#${id}-cu)`} />
      <path d="M60 66 l6 -2 l2 10 l-6 2 z" fill="#5d9789" />
      <circle cx="70" cy="53" r="3.8" fill="#6fa597" />
      {Array.from({ length: 7 }, (_, i) => {
        const a = (-160 + i * 23.3) * (Math.PI / 180);
        return <line key={i} x1={70 + Math.cos(a) * 4} y1={53 + Math.sin(a) * 4} x2={70 + Math.cos(a) * 8} y2={53 + Math.sin(a) * 8} stroke="#6fa597" strokeWidth="1.2" strokeLinecap="round" />;
      })}
      <path d="M74.5 60 L79 31" stroke="#6fa597" strokeWidth="3.2" strokeLinecap="round" />
      <rect x="77.3" y="26" width="3.6" height="6" fill="#c9a96e" />
      <circle cx="79.1" cy="22.5" r="7" fill={`url(#${id}-flame)`}>
        <animate attributeName="r" values="6;8;6" dur="1.6s" repeatCount="indefinite" />
      </circle>
      <path d="M79.1 18 C81.5 21 81 24 79.1 25 C77.2 24 76.7 21 79.1 18 Z" fill="#f6d27e" />
      <Shine clip={`${id}-statue`} id={`${id}-sh`} dur={6} delay={1} />
    </Frame>
  );
}

function Brandenburg({ id }: P) {
  const cols = [42, 65, 88, 111, 134, 157];
  return (
    <Frame label="Brandenburg Gate">
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7eb2df" />
          <stop offset="0.7" stopColor="#d6e7f3" />
          <stop offset="1" stopColor="#f6efe2" />
        </linearGradient>
        <linearGradient id={`${id}-stone`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ead7b5" />
          <stop offset="1" stopColor="#c7ad86" />
        </linearGradient>
        <linearGradient id={`${id}-col`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#bda27a" />
          <stop offset="0.5" stopColor="#f0e0c2" />
          <stop offset="1" stopColor="#b39871" />
        </linearGradient>
        <clipPath id={`${id}-gate`}>
          <rect x="34" y="56" width="132" height="72" />
        </clipPath>
      </defs>
      <rect width="200" height="150" fill={`url(#${id}-sky)`} />
      <Cloud y={10} scale={0.8} dur={50} delay={14} />
      <Cloud y={28} scale={0.55} dur={36} delay={4} opacity={0.75} />
      {/* trees */}
      {[[8, 120, 14], [24, 116, 12], [182, 118, 14], [196, 122, 10]].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={i % 2 ? "#6f9a6a" : "#5d8a5b"} />
      ))}
      {/* wings */}
      <rect x="18" y="92" width="18" height="38" fill={`url(#${id}-stone)`} />
      <rect x="164" y="92" width="18" height="38" fill={`url(#${id}-stone)`} />
      {/* quadriga */}
      <g fill="#4f7a6c">
        <path d="M88 56 L88 50 C89 46 92 44 94 46 L96 42 L98 46 L100 40 L102 46 L104 42 L106 46 C108 44 111 46 112 50 L112 56 Z" />
        <rect x="98.8" y="30" width="2.4" height="12" />
        <circle cx="100" cy="29" r="2.4" />
      </g>
      {/* attic */}
      <path d="M62 68 L62 58 L80 58 L80 55 L120 55 L120 58 L138 58 L138 68 Z" fill={`url(#${id}-stone)`} />
      {/* entablature */}
      <rect x="34" y="68" width="132" height="11" fill={`url(#${id}-stone)`} />
      <rect x="34" y="72" width="132" height="1.4" fill="#b39871" />
      {/* columns */}
      {cols.map((x) => (
        <g key={x}>
          <rect x={x - 3.5} y="79" width="7" height="49" fill={`url(#${id}-col)`} />
          <rect x={x - 4.5} y="79" width="9" height="2" fill="#d8c29d" />
        </g>
      ))}
      <rect x="30" y="127" width="140" height="5" fill="#bfa47c" />
      <Shine clip={`${id}-gate`} id={`${id}-sh`} dur={6} delay={0.5} />
      <rect y="132" width="200" height="18" fill="#cbb995" />
      <rect y="132" width="200" height="1" fill="#e9dcc1" />
    </Frame>
  );
}

function BigBen({ id }: P) {
  return (
    <Frame label="Big Ben">
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2c3b6b" />
          <stop offset="0.55" stopColor="#7a6f9e" />
          <stop offset="0.85" stopColor="#e7a98d" />
          <stop offset="1" stopColor="#f5d3a7" />
        </linearGradient>
        <linearGradient id={`${id}-st`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8f7650" />
          <stop offset="0.5" stopColor="#e2c58f" />
          <stop offset="1" stopColor="#7f6745" />
        </linearGradient>
        <radialGradient id={`${id}-clock`}>
          <stop offset="0" stopColor="#fff7dc" />
          <stop offset="0.7" stopColor="#f3dc9e" />
          <stop offset="1" stopColor="#c9a96e" />
        </radialGradient>
        <clipPath id={`${id}-tw`}>
          <path d="M71 140 L71 62 L69 62 L69 38 L71 38 L71 27 L80 5 L89 27 L89 38 L91 38 L91 62 L89 62 L89 140 Z" />
        </clipPath>
      </defs>
      <rect width="200" height="150" fill={`url(#${id}-sky)`} />
      <Stars count={18} h={55} seed={4} />
      <Firework x={148} y={34} r={20} delay={0.2} color="#f3d48c" />
      <Firework x={30} y={30} r={14} delay={1.3} color="#f5a8c4" />
      <Firework x={176} y={60} r={12} delay={2.1} color="#bfe0ff" />
      <Firework x={118} y={18} r={11} delay={1.7} color="#f3d48c" />
      {/* parliament */}
      <g fill="#3a3352">
        <rect x="90" y="106" width="110" height="34" />
        {Array.from({ length: 14 }, (_, i) => (
          <polygon key={i} points={`${93 + i * 8},106 ${95 + i * 8},98 ${97 + i * 8},106`} />
        ))}
        <rect x="174" y="76" width="18" height="64" />
        <polygon points="174,76 183,68 192,76" />
        <rect x="0" y="114" width="72" height="26" />
        {Array.from({ length: 9 }, (_, i) => (
          <polygon key={i} points={`${2 + i * 8},114 ${4 + i * 8},107 ${6 + i * 8},114`} />
        ))}
      </g>
      {Array.from({ length: 26 }, (_, i) => (
        <rect key={i} x={95 + (i % 13) * 8} y={112 + Math.floor(i / 13) * 9} width="2" height="3" fill="#ffd98a" opacity={0.75} />
      ))}
      {/* tower */}
      <path d="M71 140 L71 62 L69 62 L69 38 L71 38 L71 27 L80 5 L89 27 L89 38 L91 38 L91 62 L89 62 L89 140 Z" fill={`url(#${id}-st)`} />
      {[70, 82, 94, 106, 118, 130].map((y) => (
        <line key={y} x1="72" x2="88" y1={y} y2={y} stroke="#6f5a3c" strokeOpacity="0.45" strokeWidth="0.6" />
      ))}
      <line x1="80" x2="80" y1="64" y2="140" stroke="#6f5a3c" strokeOpacity="0.35" strokeWidth="0.6" />
      <circle cx="80" cy="50" r="8.4" fill={`url(#${id}-clock)`} stroke="#7d6238" strokeWidth="0.8" />
      <circle cx="80" cy="50" r="12" fill="#ffe7a8" opacity="0.18">
        <animate attributeName="opacity" values="0.1;0.3;0.1" dur="3s" repeatCount="indefinite" />
      </circle>
      <g stroke="#2a2a2a" strokeLinecap="round">
        <line x1="80" y1="50" x2="80" y2="44" strokeWidth="0.9">
          <animateTransform attributeName="transform" type="rotate" from="0 80 50" to="360 80 50" dur="60s" repeatCount="indefinite" />
        </line>
        <line x1="80" y1="50" x2="84" y2="50" strokeWidth="1.1">
          <animateTransform attributeName="transform" type="rotate" from="0 80 50" to="360 80 50" dur="720s" repeatCount="indefinite" />
        </line>
      </g>
      <Shine clip={`${id}-tw`} id={`${id}-sh`} dur={5.5} delay={1.2} />
      {/* river */}
      <rect y="140" width="200" height="10" fill="#3b3f63" />
      <rect y="140" width="200" height="10" fill="#f0b98f" opacity="0.18" />
    </Frame>
  );
}

function Burj({ id }: P) {
  const pts =
    "88,140 88,110 91,110 91,86 93,86 93,63 95,63 95,43 97,43 97,27 98.6,27 99.6,6 100.4,6 101.4,27 103,27 103,43 105,43 105,63 107,63 107,86 109,86 109,110 112,110 112,140";
  return (
    <Frame label="Burj Khalifa">
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b1530" />
          <stop offset="0.7" stopColor="#1d2f57" />
          <stop offset="1" stopColor="#3a4f7c" />
        </linearGradient>
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5b7298" />
          <stop offset="0.5" stopColor="#d9e6f7" />
          <stop offset="1" stopColor="#4b5f84" />
        </linearGradient>
        <clipPath id={`${id}-tw`}>
          <polygon points={pts} />
        </clipPath>
      </defs>
      <rect width="200" height="150" fill={`url(#${id}-sky)`} />
      <Stars count={30} h={80} seed={7} />
      <Firework x={58} y={36} r={22} delay={0} color="#f3d48c" />
      <Firework x={150} y={30} r={18} delay={0.9} color="#f3d48c" />
      <Firework x={30} y={70} r={13} delay={1.8} color="#f5b4c8" />
      <Firework x={172} y={66} r={14} delay={2.4} color="#bfe0ff" />
      <Firework x={128} y={58} r={10} delay={1.4} color="#fff2c9" />
      <Skyline x0={0} x1={84} base={140} seed={9} color="#16223d" lit maxH={40} />
      <Skyline x0={116} x1={200} base={140} seed={13} color="#16223d" lit maxH={44} />
      <polygon points={pts} fill={`url(#${id}-glass)`} />
      {Array.from({ length: 30 }, (_, i) => (
        <circle key={i} cx={99 + ((i * 7) % 3) - 1} cy={20 + i * 4} r="0.55" fill="#fff4cf">
          <animate attributeName="opacity" values="0.2;1;0.2" dur="1.8s" begin={`${(i % 6) * 0.3}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <circle cx="100" cy="6" r="1.4" fill="#ff6b6b">
        <animate attributeName="opacity" values="1;0.2;1" dur="1.2s" repeatCount="indefinite" />
      </circle>
      <Shine clip={`${id}-tw`} id={`${id}-sh`} dur={4.5} />
      <rect y="140" width="200" height="10" fill="#0e1830" />
    </Frame>
  );
}

function Kingdom({ id }: P) {
  const tower = "M84 140 L86 72 C87 42 90 22 91.5 9 L94.5 9 C95.5 30 104.5 30 105.5 9 L108.5 9 C110 22 113 42 114 72 L116 140 Z";
  return (
    <Frame label="Kingdom Centre">
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#081227" />
          <stop offset="0.75" stopColor="#1a2b52" />
          <stop offset="1" stopColor="#2c4677" />
        </linearGradient>
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3f5f93" />
          <stop offset="0.5" stopColor="#bcd7f6" />
          <stop offset="1" stopColor="#36507d" />
        </linearGradient>
        <clipPath id={`${id}-tw`}>
          <path d={tower} />
        </clipPath>
      </defs>
      <rect width="200" height="150" fill={`url(#${id}-sky)`} />
      <Stars count={34} h={90} seed={12} />
      <Beam id={`${id}-b1`} x={60} y={142} dur={8} from={-30} to={18} color="#bfe0ff" />
      <Beam id={`${id}-b2`} x={140} y={142} dur={9} from={30} to={-18} delay={2} color="#bfe0ff" />
      <Beam id={`${id}-b3`} x={100} y={142} dur={6} from={-12} to={12} delay={1} color="#f3e3b8" />
      <Skyline x0={0} x1={80} base={140} seed={21} color="#121d36" lit maxH={26} />
      <Skyline x0={120} x1={200} base={140} seed={23} color="#121d36" lit maxH={30} />
      <path d={tower} fill={`url(#${id}-glass)`} />
      {/* LED gradient on the arch (cycles colours like the real tower) */}
      <path d="M94.5 9 C95.5 30 104.5 30 105.5 9" fill="none" stroke="#7fd0ff" strokeWidth="1.2">
        <animate attributeName="stroke" values="#7fd0ff;#f3d48c;#c79bff;#7fd0ff" dur="6s" repeatCount="indefinite" />
      </path>
      <rect x="93.6" y="17" width="12.8" height="2.4" rx="0.6" fill="#e9f3ff" />
      {Array.from({ length: 22 }, (_, i) => (
        <line key={i} x1="87" x2="113" y1={36 + i * 4.6} y2={36 + i * 4.6} stroke="#0f1b33" strokeOpacity="0.25" strokeWidth="0.5" />
      ))}
      <Shine clip={`${id}-tw`} id={`${id}-sh`} dur={5} delay={0.8} />
      <rect y="140" width="200" height="10" fill="#0b1427" />
    </Frame>
  );
}

function Kuwait({ id }: P) {
  return (
    <Frame label="Kuwait Towers">
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5b7fb4" />
          <stop offset="0.6" stopColor="#e8b996" />
          <stop offset="1" stopColor="#f7e2c4" />
        </linearGradient>
        <radialGradient id={`${id}-ball`} cx="0.35" cy="0.35">
          <stop offset="0" stopColor="#e1f1f2" />
          <stop offset="0.6" stopColor="#4e8d9b" />
          <stop offset="1" stopColor="#24505e" />
        </radialGradient>
        <clipPath id={`${id}-tw`}>
          <circle cx="92" cy="62" r="17" />
          <circle cx="124" cy="80" r="12" />
          <circle cx="92" cy="34" r="7" />
        </clipPath>
      </defs>
      <rect width="200" height="150" fill={`url(#${id}-sky)`} />
      <circle cx="160" cy="98" r="16" fill="#ffe3b0" opacity="0.8" />
      <Cloud y={18} scale={0.7} dur={44} delay={10} opacity={0.6} />
      <g stroke="#d8dee3" strokeLinecap="round">
        <line x1="92" y1="140" x2="92" y2="6" strokeWidth="3" />
        <line x1="124" y1="140" x2="124" y2="44" strokeWidth="2.6" />
        <line x1="64" y1="140" x2="64" y2="52" strokeWidth="1.8" />
      </g>
      <circle cx="92" cy="62" r="17" fill={`url(#${id}-ball)`} />
      <circle cx="92" cy="34" r="7" fill={`url(#${id}-ball)`} />
      <circle cx="124" cy="80" r="12" fill={`url(#${id}-ball)`} />
      {[62, 80].map((cy, i) => (
        <circle key={cy} cx={i ? 124 : 92} cy={cy} r={i ? 10 : 14} fill="none" stroke="#9fd0d6" strokeOpacity="0.55" strokeWidth="1" strokeDasharray="1 2" />
      ))}
      <Shine clip={`${id}-tw`} id={`${id}-sh`} dur={5} />
      <rect y="132" width="200" height="18" fill="#3f6e8f" />
      <rect y="132" width="200" height="18" fill="#f7c99b" opacity="0.25" />
    </Frame>
  );
}

function Generic({ id }: P) {
  return (
    <Frame label="Globe">
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#eaf3f5" />
          <stop offset="1" stopColor="#d5e3e7" />
        </linearGradient>
      </defs>
      <rect width="200" height="150" fill={`url(#${id}-sky)`} />
      <g transform="translate(100 75)" fill="none" stroke="#b8955f" strokeWidth="1.1">
        <circle r="42" />
        <ellipse rx="42" ry="14" />
        <line x1="-42" x2="42" />
        <ellipse rx="16" ry="42">
          <animate attributeName="rx" values="2;42;2" dur="8s" repeatCount="indefinite" />
        </ellipse>
        <ellipse rx="30" ry="42">
          <animate attributeName="rx" values="42;2;42" dur="8s" repeatCount="indefinite" />
        </ellipse>
      </g>
    </Frame>
  );
}

export function LandmarkScene({ art, id }: { art: LandmarkArt; id: string }) {
  const pid = `lm-${id.replace(/[^a-z0-9]/gi, "")}`;
  switch (art) {
    case "liberty":
      return <Liberty id={pid} />;
    case "brandenburg":
      return <Brandenburg id={pid} />;
    case "bigben":
      return <BigBen id={pid} />;
    case "burj":
      return <Burj id={pid} />;
    case "kingdom":
      return <Kingdom id={pid} />;
    case "kuwait":
      return <Kuwait id={pid} />;
    default:
      return <Generic id={pid} />;
  }
}

export const landmarkOptions: { value: LandmarkArt; label: string }[] = [
  { value: "liberty", label: "تمثال الحرية – Statue of Liberty" },
  { value: "brandenburg", label: "بوابة براندنبورغ – Brandenburg Gate" },
  { value: "bigben", label: "بيغ بن – Big Ben" },
  { value: "burj", label: "برج خليفة – Burj Khalifa" },
  { value: "kingdom", label: "برج المملكة – Kingdom Centre" },
  { value: "kuwait", label: "أبراج الكويت – Kuwait Towers" },
  { value: "generic", label: "كرة أرضية – Globe" },
];
