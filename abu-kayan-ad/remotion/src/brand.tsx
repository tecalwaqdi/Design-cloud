// Abu Kayan brand system — taken from the logo: deep navy, brushed copper, warm cream,
// thin architectural arches and diagonal light planes. Type: DIN Next LT Arabic (+ IBM Plex Arabic for small text).
import React from 'react';
import { AbsoluteFill, Easing, continueRender, delayRender, interpolate, staticFile, useCurrentFrame } from 'remotion';
import '@fontsource/tajawal/500.css';
import '@fontsource/tajawal/700.css';

export const FPS = 30;
export const s = (sec: number) => Math.round(sec * FPS);
export const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
export const ease = Easing.bezier(0.22, 1, 0.36, 1);
export const easeIn = Easing.bezier(0.64, 0, 0.78, 0);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

export const B = {
  navy: '#12223C',
  navyDeep: '#0B1628',
  navyLight: '#1D3356',
  copper: '#C7926D',
  copperLight: '#E6BC97',
  copperDark: '#9E6B49',
  cream: '#F3ECE2',
  slate: '#8C9AB3',
};
export const COPPER_GRAD = `linear-gradient(100deg, ${B.copperDark} 0%, ${B.copper} 35%, ${B.copperLight} 55%, ${B.copper} 75%, ${B.copperDark} 100%)`;
export const DIN = "'DIN', 'Tajawal', sans-serif";
export const PLEX = "'Plex', 'DIN', 'Tajawal', sans-serif";

/* ---------- fonts ---------- */
const FONTS: [string, string, number][] = [
  ['DIN', 'DINNextLTArabic-Light.ttf', 300],
  ['DIN', 'DINNextLTArabic-Regular.ttf', 400],
  ['DIN', 'DINNextLTArabic-Medium.ttf', 500],
  ['DIN', 'DINNextLTArabic-Bold.ttf', 700],
  ['DIN', 'DINNextLTArabic-Black.ttf', 900],
  ['Plex', 'IBMPlexArabic-Text.ttf', 400],
];
if (typeof document !== 'undefined') {
  const h = delayRender('brand fonts', { timeoutInMilliseconds: 120000 });
  Promise.all(FONTS.map(([fam, file, w]) => new FontFace(fam, `url(${staticFile(`fonts/${file}`)})`, { weight: String(w) }).load().then((f) => document.fonts.add(f))))
    .then(() => continueRender(h))
    .catch((e) => {
      console.error(e);
      continueRender(h);
    });
}

/* ---------- the K-building mark (traced from the logo, viewBox 780x720) ---------- */
const MARK_PATHS = ['M85,690 L85,368 L264,288', 'M264,690 L264,180 L536,76 L536,690', 'M536,296 L698,368 L698,690', 'M264,528 L536,338', 'M322,498 L522,660'];
const FEET = ['M108,662 L136,690 L108,690 Z', 'M241,662 L212,690 L241,690 Z', 'M559,662 L588,690 L559,690 Z', 'M675,662 L647,690 L675,690 Z'];
export const Mark: React.FC<{ width: number; draw?: number; shine?: number; id?: string }> = ({ width, draw = 1, shine = -1, id = 'm' }) => {
  const h = (width * 720) / 780;
  const feet = interpolate(draw, [0.85, 1], [0, 1], clamp);
  return (
    <svg width={width} height={h} viewBox="0 0 780 720" style={{ overflow: 'visible', display: 'block' }}>
      <defs>
        <linearGradient id={`${id}cg`} gradientUnits="userSpaceOnUse" x1="60" y1="60" x2="720" y2="700">
          <stop offset="0" stopColor={B.copperLight} />
          <stop offset="0.5" stopColor={B.copper} />
          <stop offset="1" stopColor={B.copperDark} />
        </linearGradient>
        <linearGradient id={`${id}sh`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="780" y2="360">
          <stop offset={Math.max(0, shine - 0.12)} stopColor="#fff" stopOpacity="0" />
          <stop offset={Math.max(0, Math.min(1, shine))} stopColor="#fff" stopOpacity="0.85" />
          <stop offset={Math.min(1, shine + 0.12)} stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g fill="none" strokeWidth={46} strokeLinejoin="miter" strokeLinecap="butt">
        {MARK_PATHS.map((d, i) => {
          const local = interpolate(draw, [i * 0.12, i * 0.12 + 0.5], [0, 1], { ...clamp, easing: easeInOut });
          return <path key={i} d={d} stroke={`url(#${id}cg)`} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - local} />;
        })}
        {shine >= -0.2 && shine <= 1.2 && MARK_PATHS.map((d, i) => <path key={`s${i}`} d={d} stroke={`url(#${id}sh)`} style={{ mixBlendMode: 'screen' }} />)}
      </g>
      <g fill={`url(#${id}cg)`} opacity={feet}>
        {FEET.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </svg>
  );
};

/** Full lockup: mark + Arabic name + English line. p: 0..1 build-in. */
export const Lockup: React.FC<{ markW?: number; p?: number; shine?: number; nameSize?: number; id?: string }> = ({ markW = 340, p = 1, shine = -1, nameSize = 84, id = 'lk' }) => {
  const draw = interpolate(p, [0, 0.55], [0, 1], clamp);
  const name = interpolate(p, [0.45, 0.8], [0, 1], { ...clamp, easing: ease });
  const en = interpolate(p, [0.7, 1], [0, 1], { ...clamp, easing: ease });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Mark width={markW} draw={draw} shine={shine} id={id} />
      <div
        style={{
          marginTop: markW * 0.16,
          fontFamily: DIN,
          fontWeight: 700,
          fontSize: nameSize,
          color: B.cream,
          direction: 'rtl',
          whiteSpace: 'nowrap',
          lineHeight: 1.15,
          opacity: name,
          transform: `translateY(${(1 - name) * 24}px)`,
          clipPath: `inset(0 0 0 ${(1 - name) * 100}%)`,
        }}
      >
        أبو كيان للخدمات العقارية
      </div>
      <div
        style={{
          marginTop: nameSize * 0.32,
          fontFamily: DIN,
          fontWeight: 500,
          fontSize: nameSize * 0.36,
          letterSpacing: `${0.34 + (1 - en) * 0.3}em`,
          marginRight: '-0.34em',
          color: B.copper,
          opacity: en,
          whiteSpace: 'nowrap',
        }}
      >
        ABU KAYAN REAL ESTATE SERVICES
      </div>
    </div>
  );
};

/* ---------- background: navy + thin copper arches + diagonal light planes (from the logo artwork) ---------- */
export const BrandBg: React.FC<{ drift?: boolean; archOpacity?: number }> = ({ drift = true, archOpacity = 1 }) => {
  const f = useCurrentFrame();
  const d = drift ? Math.sin(f / 60) * 10 : 0;
  const glow = 0.55 + 0.15 * Math.sin(f / 40);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 55% at 50% 42%, ${B.navyLight} 0%, ${B.navy} 55%, ${B.navyDeep} 100%)` }}>
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, opacity: archOpacity }}>
        <defs>
          <linearGradient id="bgEdge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={B.copper} stopOpacity="0" />
            <stop offset="0.5" stopColor={B.copper} stopOpacity="0.55" />
            <stop offset="1" stopColor={B.copper} stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="plane" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#24395E" stopOpacity="0.85" />
            <stop offset="1" stopColor={B.navyDeep} stopOpacity="0.2" />
          </linearGradient>
          <radialGradient id="edgeGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={B.copper} stopOpacity="0.5" />
            <stop offset="1" stopColor={B.copper} stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* outer & inner arches */}
        <path d={`M 70 1920 L 70 ${640 + d} A 470 470 0 0 1 1010 ${640 + d} L 1010 1920`} fill="none" stroke="url(#bgEdge)" strokeWidth={1.6} />
        <path d={`M 150 1920 L 150 ${700 + d} A 390 390 0 0 1 930 ${700 + d} L 930 1920`} fill="none" stroke={B.copper} strokeOpacity={0.14} strokeWidth={1.2} />
        {/* diagonal planes, lower corners */}
        <path d="M 0 1330 L 300 1500 L 300 1920 L 0 1920 Z" fill="url(#plane)" />
        <path d="M 1080 1250 L 760 1440 L 760 1920 L 1080 1920 Z" fill="url(#plane)" />
        <line x1={300} y1={1500} x2={300} y2={1920} stroke={B.copper} strokeOpacity={0.5 * glow} strokeWidth={2} />
        <line x1={760} y1={1440} x2={760} y2={1920} stroke={B.copper} strokeOpacity={0.5 * glow} strokeWidth={2} />
        <ellipse cx={300} cy={1560} rx={60} ry={220} fill="url(#edgeGlow)" opacity={glow} />
        <ellipse cx={760} cy={1500} rx={60} ry={220} fill="url(#edgeGlow)" opacity={glow} />
        <line x1={0} y1={1330} x2={300} y2={1500} stroke={B.copper} strokeOpacity={0.25} strokeWidth={1.2} />
        <line x1={1080} y1={1250} x2={760} y2={1440} stroke={B.copper} strokeOpacity={0.25} strokeWidth={1.2} />
      </svg>
      <Grain />
    </AbsoluteFill>
  );
};

export const Grain: React.FC<{ amount?: number }> = ({ amount = 0.05 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity: amount, mixBlendMode: 'overlay' }}>
      <svg width="1080" height="1920">
        <filter id="gn">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={f % 24} />
        </filter>
        <rect width="1080" height="1920" filter="url(#gn)" />
      </svg>
    </AbsoluteFill>
  );
};

/** Arch-shaped navy panel that rises through the frame (a "doorway" transition). Cut the scene at frame `cut`. */
export const ArchWipe: React.FC<{ cut: number }> = ({ cut }) => {
  const f = useCurrentFrame();
  const start = cut - 13;
  const end = cut + 12;
  if (f < start || f > end) return null;
  const t = (f - start) / (end - start);
  const top = 1920 - t * 4920;
  const H = 3000;
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <defs>
        <linearGradient id="awg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={B.navyLight} />
          <stop offset="0.3" stopColor={B.navy} />
          <stop offset="1" stopColor={B.navyDeep} />
        </linearGradient>
      </defs>
      <path d={`M -10 ${top + H} L -10 ${top + 540} A 550 550 0 0 1 1090 ${top + 540} L 1090 ${top + H} Z`} fill="url(#awg)" />
      <path d={`M 20 ${top + 600} A 520 520 0 0 1 1060 ${top + 600}`} fill="none" stroke={B.copper} strokeWidth={3} />
      <path d={`M 60 ${top + 640} A 480 480 0 0 1 1020 ${top + 640}`} fill="none" stroke={B.copper} strokeOpacity={0.4} strokeWidth={1.5} />
    </svg>
  );
};

/** RTL line reveal (clip from the right). */
export const Reveal: React.FC<{ at: number; children: React.ReactNode; dur?: number; style?: React.CSSProperties; out?: number }> = ({ at, children, dur = 14, style, out }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = interpolate(f, [at, at + dur], [0, 1], { ...clamp, easing: ease });
  const o = out !== undefined ? interpolate(f, [out, out + 10], [1, 0], clamp) : 1;
  return (
    <div style={{ ...style, opacity: o, clipPath: `inset(-20% 0 -20% ${(1 - p) * 100}%)`, transform: `translateX(${(1 - p) * -30}px)` }}>
      {children}
    </div>
  );
};

/** Thin copper rule that draws from the right. */
export const Rule: React.FC<{ at: number; x: number; y: number; w: number; dur?: number; thick?: number }> = ({ at, x, y, w, dur = 16, thick = 3 }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + dur], [0, 1], { ...clamp, easing: easeInOut });
  return <div style={{ position: 'absolute', left: x + w * (1 - p), top: y, width: w * p, height: thick, background: COPPER_GRAD }} />;
};

/** Small copper sparkle (key glint). */
export const Glint: React.FC<{ at: number; x: number; y: number; size?: number }> = ({ at, x, y, size = 120 }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 6, at + 16], [0, 1, 0], clamp);
  if (p <= 0) return null;
  return (
    <svg width={size} height={size} viewBox="-50 -50 100 100" style={{ position: 'absolute', left: x - size / 2, top: y - size / 2, opacity: p, transform: `rotate(${(f - at) * 4}deg) scale(${0.6 + 0.4 * p})`, mixBlendMode: 'screen' }}>
      <path d="M0,-50 L5,-5 L50,0 L5,5 L0,50 L-5,5 L-50,0 L-5,-5 Z" fill="#FFF3E6" />
      <circle r={9} fill="#fff" />
    </svg>
  );
};
