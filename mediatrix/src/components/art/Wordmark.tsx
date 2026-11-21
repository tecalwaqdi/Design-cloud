// "Mediatrix" wordmark — Readex Pro, deep navy.
//  - each "i" is a premium IV glass bottle (navy glass, icy fluid, crimped gold cap, ECG label)
//    whose dot is a drop falling into it
//  - the "x" is a jewellery-style ribbon cross: a navy ribbon and gold ribbons in tall S-curves,
//    gold drops at the ends and pearls around (pearls hidden at small sizes)

const BOTTLE = "M11 34.5 h8 v2.2 c0 2.4 5.6 3.2 5.6 8 V93 a7 7 0 0 1 -7 7 h-5.2 a7 7 0 0 1 -7 -7 V44.7 c0 -4.8 5.6 -5.6 5.6 -8 z";

function BottleI({ u, delay = 0 }: { u: string; delay?: number }) {
  return (
    <svg viewBox="0 0 30 100" className="inline-block h-[0.73em] w-[0.27em] overflow-visible align-baseline" style={{ marginInline: "0.012em" }} aria-hidden="true">
      <defs>
        <linearGradient id={`${u}-gl`} x1="0" x2="1">
          <stop offset="0" stopColor="#c7dbe4" />
          <stop offset="0.22" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#e6f1f5" />
          <stop offset="0.85" stopColor="#cfe1e9" />
          <stop offset="1" stopColor="#b9ced8" />
        </linearGradient>
        <linearGradient id={`${u}-lq`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a8ecf7" />
          <stop offset="0.5" stopColor="#4fc3dc" />
          <stop offset="1" stopColor="#1f7f9c" />
        </linearGradient>
        <linearGradient id={`${u}-cap`} x1="0" x2="1">
          <stop offset="0" stopColor="#8a6c40" />
          <stop offset="0.35" stopColor="#f1dfb3" />
          <stop offset="0.55" stopColor="#d9bd86" />
          <stop offset="1" stopColor="#7d6238" />
        </linearGradient>
        <linearGradient id={`${u}-dr`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d8f5fb" />
          <stop offset="1" stopColor="#2a9db8" />
        </linearGradient>
        <clipPath id={`${u}-cl`}>
          <path d={BOTTLE} />
        </clipPath>
      </defs>
      {/* the dot: a drop that falls onto the cap and is absorbed */}
      <g>
        <animateTransform attributeName="transform" type="translate" values="0 0;0 0;0 11;0 11" keyTimes="0;0.62;0.8;1" dur="3.4s" begin={`${delay}s`} repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;1;0;0;1" keyTimes="0;0.62;0.8;0.92;1" dur="3.4s" begin={`${delay}s`} repeatCount="indefinite" />
        <path d="M15 1 C 11.4 7, 9.7 10, 9.7 12.6 a5.3 5.3 0 0 0 10.6 0 C 20.3 10, 18.6 7, 15 1 Z" fill={`url(#${u}-dr)`} />
        <ellipse cx="13" cy="11.5" rx="1.3" ry="2.2" fill="#fff" opacity="0.8" />
      </g>
      <path d={BOTTLE} fill={`url(#${u}-gl)`} />
      <g clipPath={`url(#${u}-cl)`}>
        <path fill={`url(#${u}-lq)`} opacity="0.95">
          <animate attributeName="d" dur="2.8s" repeatCount="indefinite" values="M4 60 Q 9.5 57.6 15 60 T 26 60 V101 H4 Z;M4 60 Q 9.5 62.4 15 60 T 26 60 V101 H4 Z;M4 60 Q 9.5 57.6 15 60 T 26 60 V101 H4 Z" />
        </path>
        <rect x="4" y="74" width="22" height="7" fill="#f6efe0" opacity="0.96" />
        <path d="M8 77.6 h3.2 l1.2 -2.2 l1.8 4.6 l1.4 -3.6 l.9 1.2 h5" fill="none" stroke="#a8875a" strokeWidth="0.9" strokeLinejoin="round" />
        <rect x="7.1" y="44" width="2.3" height="50" rx="1.15" fill="#fff" opacity="0.55" />
        <rect x="21.2" y="46" width="0.9" height="46" rx="0.45" fill="#9fd0e3" opacity="0.5" />
      </g>
      <path d={BOTTLE} fill="none" stroke="#6f8ea3" strokeOpacity="0.9" strokeWidth="1.6" />
      <rect x="9.4" y="25" width="11.2" height="10.2" rx="1.6" fill={`url(#${u}-cap)`} />
      <path d="M11.4 26.4v7.4M13.4 26.4v7.4M15.4 26.4v7.4M17.4 26.4v7.4M19.2 26.4v7.4" stroke="#7d6238" strokeOpacity="0.55" strokeWidth="0.6" />
      <rect x="9" y="23.4" width="12" height="2.6" rx="1.3" fill="#f1dfb3" />
    </svg>
  );
}

const X_NAVY = "M12.4 3.9 L11.6 6.4 L10.9 9.0 L10.5 11.4 L10.1 13.8 L9.9 16.2 L9.7 18.5 L9.7 20.8 L9.8 23.1 L10.1 25.3 L10.4 27.4 L10.9 29.5 L11.4 31.6 L12.0 33.6 L12.8 35.6 L13.6 37.5 L14.5 39.4 L15.5 41.2 L16.6 43.0 L17.7 44.7 L18.9 46.3 L20.2 47.9 L21.5 49.5 L22.8 51.0 L24.2 52.5 L25.7 53.9 L27.1 55.3 L28.6 56.7 L30.1 58.0 L31.6 59.3 L33.1 60.6 L34.6 61.9 L36.1 63.1 L37.6 64.3 L39.1 65.6 L40.6 66.8 L42.1 68.0 L43.6 69.2 L45.0 70.4 L46.5 71.6 L47.8 72.8 L49.2 74.0 L50.5 75.2 L51.8 76.5 L53.1 77.8 L54.3 79.1 L55.5 80.4 L56.7 81.7 L57.7 83.1 L58.8 84.5 L59.8 86.0 L60.7 87.5 L61.6 89.1 L62.4 90.7 L63.2 92.4 L63.9 94.1 L64.5 96.0 L65.1 97.9 L65.5 99.9 L65.9 102.0 L66.2 104.2 L66.4 106.5 L66.5 108.8 L66.5 111.3 L66.5 113.9 L67.5 114.1 L68.2 111.5 L68.7 109.0 L69.1 106.5 L69.3 104.1 L69.4 101.8 L69.5 99.5 L69.4 97.2 L69.2 95.0 L68.9 92.9 L68.5 90.7 L68.0 88.7 L67.4 86.6 L66.7 84.7 L65.9 82.7 L65.1 80.9 L64.2 79.0 L63.2 77.2 L62.1 75.5 L61.0 73.8 L59.8 72.1 L58.6 70.5 L57.3 69.0 L56.0 67.4 L54.6 65.9 L53.2 64.4 L51.8 63.0 L50.4 61.6 L49.0 60.2 L47.5 58.9 L46.0 57.5 L44.6 56.2 L43.1 54.9 L41.7 53.6 L40.2 52.3 L38.8 51.1 L37.4 49.8 L36.0 48.5 L34.6 47.3 L33.2 46.0 L31.9 44.8 L30.6 43.5 L29.3 42.3 L28.1 41.0 L26.9 39.8 L25.7 38.5 L24.6 37.2 L23.5 35.8 L22.4 34.5 L21.4 33.1 L20.5 31.7 L19.5 30.2 L18.7 28.7 L17.9 27.1 L17.1 25.5 L16.4 23.7 L15.8 21.9 L15.2 20.1 L14.7 18.1 L14.3 16.0 L14.0 13.9 L13.8 11.6 L13.7 9.2 L13.6 6.7 L13.6 4.1 Z";
const X_NAVY_HI = "M13.5 25.7 L14.2 28.0 L15.1 30.2 L16.0 32.3 L17.0 34.4 L18.2 36.4 L19.4 38.4 L20.7 40.2 L22.1 42.1 L23.6 43.8 L25.1 45.6 L26.7 47.3 L28.3 48.9 L30.0 50.5 L31.7 52.1 L33.5 53.7 L35.3 55.3 L37.1 56.8 L38.9 58.4 L40.7 59.9 L42.5 61.4 L44.3 63.0 L46.1 64.5 L47.8 66.1 L49.5 67.7 L51.2 69.4 L52.9 71.0 L54.5 72.7 L56.0 74.4 L57.5 76.2 L58.9 78.1";
const X_GOLD_THIN = "M25.6 11.9 L25.0 14.0 L24.5 16.1 L24.1 18.1 L23.8 20.0 L23.6 21.9 L23.5 23.8 L23.4 25.6 L23.5 27.4 L23.6 29.1 L23.7 30.8 L24.0 32.4 L24.3 34.0 L24.7 35.6 L25.1 37.2 L25.6 38.6 L26.1 40.1 L26.7 41.5 L27.4 42.9 L28.1 44.2 L28.8 45.6 L29.6 46.8 L30.4 48.1 L31.2 49.3 L32.1 50.5 L33.0 51.6 L33.9 52.8 L34.8 53.9 L35.7 55.0 L36.7 56.1 L37.6 57.1 L38.6 58.2 L39.5 59.2 L40.5 60.3 L41.4 61.3 L42.4 62.3 L43.3 63.3 L44.2 64.4 L45.1 65.4 L45.9 66.5 L46.8 67.5 L47.6 68.6 L48.4 69.7 L49.2 70.8 L49.9 71.9 L50.6 73.1 L51.3 74.3 L52.0 75.5 L52.6 76.7 L53.2 78.0 L53.7 79.3 L54.2 80.7 L54.6 82.1 L55.0 83.5 L55.3 85.1 L55.6 86.6 L55.8 88.3 L56.0 90.0 L56.1 91.7 L56.1 93.5 L56.1 95.4 L55.9 97.4 L55.7 99.5 L55.5 101.6 L55.1 103.8 L56.9 104.2 L57.5 102.0 L58.0 99.8 L58.4 97.7 L58.7 95.7 L58.9 93.7 L59.1 91.8 L59.2 89.9 L59.2 88.0 L59.1 86.3 L59.0 84.5 L58.8 82.8 L58.5 81.2 L58.2 79.6 L57.8 78.0 L57.3 76.5 L56.8 75.0 L56.2 73.5 L55.6 72.1 L55.0 70.7 L54.3 69.4 L53.5 68.1 L52.8 66.8 L52.0 65.5 L51.2 64.3 L50.3 63.1 L49.4 61.9 L48.5 60.8 L47.6 59.7 L46.7 58.5 L45.8 57.4 L44.9 56.4 L44.0 55.3 L43.0 54.2 L42.1 53.2 L41.2 52.1 L40.3 51.1 L39.4 50.0 L38.5 49.0 L37.6 47.9 L36.8 46.9 L35.9 45.8 L35.1 44.7 L34.3 43.6 L33.6 42.5 L32.8 41.4 L32.1 40.3 L31.4 39.1 L30.7 38.0 L30.1 36.7 L29.5 35.5 L29.0 34.2 L28.5 32.9 L28.0 31.5 L27.6 30.0 L27.2 28.6 L26.8 27.0 L26.6 25.4 L26.3 23.7 L26.2 22.0 L26.1 20.1 L26.1 18.2 L26.1 16.3 L26.3 14.2 L26.4 12.1 Z";
const X_GOLD_OUT = "M77.6 9.1 L77.9 11.6 L78.1 13.9 L78.2 16.2 L78.2 18.4 L78.1 20.5 L77.9 22.5 L77.7 24.5 L77.3 26.3 L76.8 28.1 L76.3 29.9 L75.7 31.5 L75.0 33.1 L74.2 34.7 L73.4 36.2 L72.6 37.7 L71.6 39.1 L70.7 40.5 L69.6 41.8 L68.5 43.1 L67.4 44.4 L66.2 45.7 L65.0 46.9 L63.8 48.2 L62.5 49.4 L61.2 50.6 L59.8 51.8 L58.5 52.9 L57.1 54.1 L55.7 55.2 L54.2 56.4 L52.8 57.5 L51.3 58.7 L49.9 59.8 L48.4 61.0 L46.9 62.1 L45.5 63.3 L44.1 64.5 L42.6 65.7 L41.2 66.8 L39.8 68.0 L38.5 69.3 L37.1 70.5 L35.8 71.8 L34.6 73.1 L33.4 74.4 L32.2 75.7 L31.1 77.1 L30.0 78.5 L29.0 79.9 L28.1 81.4 L27.3 82.9 L26.5 84.5 L25.8 86.0 L25.2 87.7 L24.6 89.3 L24.2 91.0 L23.9 92.8 L23.7 94.5 L23.5 96.4 L23.5 98.2 L23.6 100.1 L23.8 102.1 L24.1 104.0 L24.6 106.1 L25.4 105.9 L25.2 103.9 L25.2 102.0 L25.2 100.1 L25.3 98.3 L25.5 96.5 L25.8 94.9 L26.2 93.3 L26.7 91.7 L27.3 90.2 L27.9 88.8 L28.6 87.4 L29.4 86.0 L30.3 84.7 L31.2 83.4 L32.1 82.2 L33.2 81.0 L34.2 79.8 L35.4 78.6 L36.5 77.4 L37.7 76.3 L39.0 75.2 L40.3 74.0 L41.6 72.9 L43.0 71.8 L44.4 70.8 L45.8 69.7 L47.3 68.6 L48.7 67.5 L50.2 66.4 L51.7 65.3 L53.2 64.2 L54.7 63.1 L56.2 61.9 L57.7 60.8 L59.1 59.6 L60.6 58.4 L62.1 57.2 L63.5 56.0 L64.9 54.7 L66.3 53.4 L67.6 52.1 L68.9 50.7 L70.2 49.3 L71.4 47.8 L72.6 46.3 L73.7 44.8 L74.7 43.2 L75.7 41.6 L76.6 39.9 L77.4 38.2 L78.1 36.4 L78.8 34.6 L79.3 32.7 L79.8 30.8 L80.1 28.8 L80.4 26.8 L80.6 24.8 L80.6 22.7 L80.5 20.5 L80.4 18.3 L80.1 16.0 L79.6 13.7 L79.1 11.3 L78.4 8.9 Z";
const X_GOLD = "M66.4 4.1 L66.5 6.8 L66.6 9.2 L66.5 11.6 L66.4 13.9 L66.2 16.1 L65.8 18.2 L65.4 20.1 L64.9 22.0 L64.3 23.8 L63.7 25.6 L63.0 27.2 L62.2 28.8 L61.4 30.3 L60.5 31.8 L59.6 33.2 L58.6 34.6 L57.5 35.9 L56.5 37.3 L55.4 38.6 L54.2 39.8 L53.0 41.1 L51.8 42.4 L50.5 43.6 L49.2 44.8 L47.9 46.1 L46.5 47.3 L45.1 48.5 L43.7 49.8 L42.3 51.0 L40.8 52.2 L39.3 53.5 L37.8 54.8 L36.3 56.0 L34.9 57.3 L33.4 58.6 L31.9 59.9 L30.4 61.2 L28.9 62.6 L27.5 64.0 L26.0 65.4 L24.6 66.8 L23.3 68.3 L21.9 69.8 L20.6 71.4 L19.4 72.9 L18.2 74.6 L17.1 76.3 L16.0 78.0 L15.0 79.7 L14.1 81.6 L13.2 83.4 L12.4 85.3 L11.8 87.3 L11.2 89.3 L10.7 91.4 L10.3 93.5 L10.0 95.7 L9.9 97.9 L9.8 100.1 L9.9 102.5 L10.0 104.8 L10.3 107.3 L10.8 109.7 L11.3 112.3 L14.7 111.7 L14.5 109.3 L14.5 106.9 L14.5 104.7 L14.7 102.5 L14.9 100.5 L15.2 98.5 L15.7 96.6 L16.2 94.8 L16.7 93.1 L17.4 91.4 L18.1 89.8 L18.9 88.2 L19.8 86.7 L20.7 85.3 L21.6 83.8 L22.7 82.5 L23.7 81.1 L24.9 79.8 L26.0 78.5 L27.3 77.2 L28.5 76.0 L29.8 74.8 L31.2 73.5 L32.5 72.3 L34.0 71.1 L35.4 69.9 L36.9 68.8 L38.3 67.6 L39.8 66.4 L41.4 65.2 L42.9 64.0 L44.4 62.7 L45.9 61.5 L47.5 60.3 L49.0 59.0 L50.5 57.7 L52.0 56.4 L53.5 55.1 L55.0 53.7 L56.4 52.3 L57.8 50.8 L59.2 49.3 L60.5 47.7 L61.8 46.1 L63.0 44.5 L64.1 42.8 L65.2 41.0 L66.1 39.2 L67.0 37.4 L67.9 35.4 L68.6 33.5 L69.2 31.5 L69.7 29.4 L70.1 27.3 L70.4 25.2 L70.6 23.0 L70.7 20.7 L70.6 18.5 L70.4 16.1 L70.1 13.8 L69.7 11.4 L69.2 8.9 L68.5 6.4 L67.6 3.9 Z";
const X_GOLD_HI = "M67.9 21.9 L67.5 24.0 L67.0 26.1 L66.4 28.1 L65.7 30.0 L65.0 31.9 L64.1 33.8 L63.2 35.5 L62.1 37.2 L61.1 38.9 L59.9 40.5 L58.7 42.1 L57.4 43.7 L56.1 45.2 L54.7 46.7 L53.3 48.1 L51.8 49.5 L50.3 50.9 L48.7 52.3 L47.2 53.7 L45.6 55.0 L44.0 56.4 L42.4 57.7 L40.8 59.0 L39.2 60.3 L37.6 61.7 L36.0 63.0 L34.4 64.3 L32.8 65.7 L31.3 67.1 L29.7 68.4";
const PEARLS: [number, number, number][] = [[6,8,2.6],[12,18,1.9],[7,28,1.4],[22,30,1.2],[76,7,2.6],[82,18,1.8],[74,24,1.4],[5,92,1.6],[10,102,2.3],[3,110,1.4],[20,114,1.5],[80,100,2],[74,112,1.6],[84,116,2.4],[48,112,1.3]];
const DROPS: [number, number, number, number][] = [[13, 115, 1, 0], [56, 107, 0.85, 1.2]];

function RibbonX({ u, simple = false }: { u: string; simple?: boolean }) {
  return (
    <svg viewBox="-4 -4 90 130" className="inline-block h-[0.8em] w-[0.55em] overflow-visible align-baseline" style={{ marginInlineStart: "0.02em", marginBottom: "-0.06em" }} aria-hidden="true">
      <defs>
        <linearGradient id={`${u}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6e7c1" />
          <stop offset="0.4" stopColor="#d9bd86" />
          <stop offset="0.75" stopColor="#b08e58" />
          <stop offset="1" stopColor="#7d6238" />
        </linearGradient>
        <linearGradient id={`${u}-n`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#dfe7ed" />
          <stop offset="0.45" stopColor="#9fb2c1" />
          <stop offset="1" stopColor="#6a8196" />
        </linearGradient>
        <radialGradient id={`${u}-p`} cx="0.35" cy="0.35">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.6" stopColor="#f3ead6" />
          <stop offset="1" stopColor="#cdb98f" />
        </radialGradient>
        <linearGradient id={`${u}-sh`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.75" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${u}-c`}>
          <path d={X_GOLD} />
          <path d={X_GOLD_OUT} />
          <path d={X_GOLD_THIN} />
        </clipPath>
      </defs>
      <path d={X_NAVY} fill={`url(#${u}-n)`} />
      <path d={X_NAVY_HI} fill="none" stroke="#ffffff" strokeOpacity="0.8" strokeWidth="1.2" strokeLinecap="round" />
      <path d={X_GOLD_THIN} fill={`url(#${u}-g)`} />
      {!simple && <path d={X_GOLD_OUT} fill={`url(#${u}-g)`} />}
      <path d={X_GOLD} fill={`url(#${u}-g)`} />
      <path d={X_GOLD_HI} fill="none" stroke="#fff6dc" strokeOpacity="0.9" strokeWidth="1.3" strokeLinecap="round" />
      {/* light sweep across the gold */}
      <g clipPath={`url(#${u}-c)`}>
        <rect x="-60" y="-10" width="26" height="150" fill={`url(#${u}-sh)`} transform="skewX(-20)">
          <animate attributeName="x" values="-60;120;120" keyTimes="0;0.45;1" dur="5.5s" repeatCount="indefinite" />
        </rect>
      </g>
      {DROPS.map(([px, py, s, d], i) => (
        <path key={i} d={`M${px} ${py - 2} c-${3 * s} ${5 * s} -${4.8 * s} ${7.6 * s} -${4.8 * s} ${9.8 * s} a${4.8 * s} ${4.8 * s} 0 0 0 ${9.6 * s} 0 c0 -${2.2 * s} -${1.8 * s} -${4.8 * s} -${4.8 * s} -${9.8 * s} z`} fill={`url(#${u}-g)`}>
          <animateTransform attributeName="transform" type="translate" values="0 0;0 2.2;0 0" dur="2.6s" begin={`${d}s`} repeatCount="indefinite" />
        </path>
      ))}
      {!simple &&
        PEARLS.map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill={`url(#${u}-p)`} stroke="#b9a072" strokeWidth="0.5">
            <animate attributeName="opacity" values="0.65;1;0.65" dur={`${2.2 + (i % 4) * 0.4}s`} repeatCount="indefinite" />
          </circle>
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
