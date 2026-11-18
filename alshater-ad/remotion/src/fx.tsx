import React from 'react';
import { AbsoluteFill, Easing, Img, interpolate, random, staticFile, useCurrentFrame } from 'remotion';

/* Brand palette — sampled from the profile PDF (vector fills) */
export const C = {
  navy: '#081854', // rgb(3.1%, 9.4%, 32.9%)
  navyDeep: '#040b2e',
  navyMid: '#0d2370',
  green: '#3BAD7F', // rgb(23.1%, 67.8%, 49.8%)
  mint: '#6fe3ae',
  teal: '#2aa6a0',
  white: '#ffffff',
  ink: '#0a1240',
};
export const AR = "'Almarai', sans-serif"; // profile body + headline font
export const KUFI = "'Noto Kufi Arabic', 'Almarai', sans-serif"; // wordmark (Droid Arabic Kufi successor)
export const EN = "'Noto Sans', sans-serif";

export const FPS = 30;
export const s2f = (s: number) => Math.round(s * FPS);
export const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
export const ease = Easing.bezier(0.22, 1, 0.36, 1);
export const easeIn = Easing.bezier(0.55, 0, 0.9, 0.4);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const back = Easing.bezier(0.34, 1.56, 0.64, 1);
export const lerp = (f: number, a: number, b: number, from: number, to: number, e = ease) => interpolate(f, [a, b], [from, to], { ...clamp, easing: e });

/** Film grain */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.07 }) => {
  const f = useCurrentFrame();
  const seed = Math.floor(f / 2) % 40;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'overlay', opacity }}>
      <svg width="100%" height="100%">
        <filter id={`g${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#g${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.7 }) => (
  <AbsoluteFill style={{ pointerEvents: 'none', background: `radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 50%, rgba(2,6,26,${strength}) 100%)` }} />
);

/** The brand background of the social posts: deep navy with drifting mint/teal light pools + lens flares. */
export const BrandBg: React.FC<{ intensity?: number; flares?: boolean; shards?: boolean }> = ({ intensity = 1, flares = true, shards = true }) => {
  const f = useCurrentFrame();
  const x1 = 18 + Math.sin(f / 80) * 14;
  const x2 = 85 + Math.cos(f / 95) * 10;
  const y3 = 88 + Math.sin(f / 70) * 5;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.navyDeep} 0%, ${C.navy} 45%, #0a2a66 100%)` }}>
      <AbsoluteFill
        style={{
          opacity: intensity,
          background: `radial-gradient(ellipse 60% 22% at ${x1}% 2%, rgba(150,240,200,0.55), rgba(150,240,200,0) 70%),
                       radial-gradient(ellipse 45% 18% at ${x2}% 4%, rgba(111,227,174,0.35), rgba(0,0,0,0) 70%),
                       radial-gradient(ellipse 70% 30% at 15% ${y3}%, rgba(42,166,160,0.55), rgba(0,0,0,0) 70%),
                       radial-gradient(ellipse 60% 25% at 90% 70%, rgba(42,120,200,0.35), rgba(0,0,0,0) 70%)`,
        }}
      />
      {shards && (
        <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, opacity: 0.09 * intensity }}>
          <polygon points="0,0 520,0 300,420 0,560" fill="#000" />
          <polygon points="1080,300 760,820 1080,1300" fill="#000" />
          <polygon points="0,1300 420,1550 0,1920" fill="#000" />
        </svg>
      )}
      {flares && <Flares />}
    </AbsoluteFill>
  );
};

/** Soft anamorphic lens flare dots like in the brand's story posts */
export const Flares: React.FC = () => {
  const f = useCurrentFrame();
  const drift = Math.sin(f / 60) * 20;
  const items = [
    { x: 940, y: 360, r: 120, o: 0.18 },
    { x: 860, y: 430, r: 40, o: 0.25 },
    { x: 810, y: 470, r: 22, o: 0.3 },
    { x: 60, y: 1180, r: 160, o: 0.1 },
    { x: 1040, y: 220, r: 70, o: 0.12 },
  ];
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {items.map((it, i) => (
        <div key={i} style={{ position: 'absolute', left: it.x - it.r + drift * (i % 2 ? 1 : -1), top: it.y - it.r, width: it.r * 2, height: it.r * 2, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.9), rgba(200,240,255,0.25) 45%, rgba(255,255,255,0) 70%)', opacity: it.o, filter: 'blur(4px)' }} />
      ))}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 120, height: 2, background: 'linear-gradient(90deg, transparent, rgba(160,255,215,0.25), transparent)', filter: 'blur(1px)' }} />
    </AbsoluteFill>
  );
};

export const Bokeh: React.FC<{ count?: number; seed?: string; opacity?: number }> = ({ count = 18, seed = 'b', opacity = 1 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', opacity }}>
      {new Array(count).fill(0).map((_, i) => {
        const x = random(`${seed}x${i}`) * 1080;
        const y = (((random(`${seed}y${i}`) * 2100 - f * (0.3 + random(`${seed}s${i}`) * 1)) % 2100) + 2100) % 2100 - 90;
        const s = 6 + random(`${seed}r${i}`) * 22;
        return <div key={i} style={{ position: 'absolute', left: x, top: y, width: s, height: s, borderRadius: '50%', background: i % 4 === 0 ? '#ffffff' : C.mint, opacity: 0.1 + random(`${seed}o${i}`) * 0.3, filter: `blur(${s / 5}px)` }} />;
      })}
    </AbsoluteFill>
  );
};

/** Particle burst. progress 0 = at center, 1 = spread */
export const Particles: React.FC<{ progress: number; count?: number; cx?: number; cy?: number; spread?: number; seed?: string }> = ({ progress, count = 120, cx = 540, cy = 960, spread = 1100, seed = 'p' }) => (
  <AbsoluteFill style={{ pointerEvents: 'none' }}>
    {new Array(count).fill(0).map((_, i) => {
      const a = random(`${seed}a${i}`) * Math.PI * 2;
      const d = (0.15 + random(`${seed}d${i}`) * 0.85) * spread * progress;
      const x = cx + Math.cos(a) * d;
      const y = cy + Math.sin(a) * d * 1.1;
      const s = 3 + random(`${seed}s${i}`) * 9;
      const white = i % 3 === 0;
      return (
        <div
          key={i}
          style={{
            position: 'absolute', left: x - s / 2, top: y - s / 2, width: s, height: s,
            clipPath: i % 2 ? 'polygon(50% 0, 100% 100%, 0 100%)' : undefined, borderRadius: i % 2 ? 0 : '50%',
            background: white ? '#fff' : C.mint, boxShadow: `0 0 ${s * 2}px ${C.green}`,
            opacity: Math.max(0, 1 - progress * 0.8) * (0.5 + random(`${seed}o${i}`) * 0.5),
            transform: `rotate(${progress * 360 * random(`${seed}r${i}`)}deg)`,
          }}
        />
      );
    })}
  </AbsoluteFill>
);

export const shake = (f: number, at: number, dur = 10, amp = 16) => {
  if (f < at || f > at + dur) return 'translate(0px,0px)';
  const k = 1 - (f - at) / dur;
  return `translate(${(random(`shx${f}`) - 0.5) * amp * k * 2}px, ${(random(`shy${f}`) - 0.5) * amp * k * 2}px)`;
};

export const Flash: React.FC<{ at: number; dur?: number; color?: string; max?: number }> = ({ at, dur = 6, color = '#fff', max = 0.7 }) => {
  const f = useCurrentFrame();
  if (f < at || f > at + dur + 1) return null;
  return <AbsoluteFill style={{ background: color, opacity: interpolate(f, [at, at + 1, at + dur], [0, max, 0], clamp), mixBlendMode: 'screen', pointerEvents: 'none' }} />;
};

export const Shockwave: React.FC<{ at: number; cx?: number; cy?: number; color?: string; size?: number }> = ({ at, cx = 540, cy = 960, color = C.mint, size = 900 }) => {
  const f = useCurrentFrame();
  if (f < at || f > at + 22) return null;
  const p = interpolate(f, [at, at + 20], [0, 1], { ...clamp, easing: ease });
  return <div style={{ position: 'absolute', left: cx - size * p, top: cy - size * p, width: 2 * size * p, height: 2 * size * p, borderRadius: '50%', border: `${12 * (1 - p) + 2}px solid ${color}`, opacity: 1 - p, boxShadow: `0 0 70px ${color}` }} />;
};

/** Ken-burns photo with navy brand grade. */
export const Photo: React.FC<{ src: string; from: number; dur: number; zoom?: [number, number]; pan?: [number, number]; panY?: [number, number]; grade?: number; blur?: number; pos?: string }> = ({ src, from, dur, zoom = [1.08, 1.22], pan = [0, 0], panY = [0, 0], grade = 0.62, blur = 0, pos = 'center' }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [from, from + dur], [0, 1], clamp);
  const z = zoom[0] + (zoom[1] - zoom[0]) * p;
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, transform: `scale(${z}) translate(${pan[0] + (pan[1] - pan[0]) * p}px, ${panY[0] + (panY[1] - panY[0]) * p}px)`, filter: `saturate(0.85) blur(${blur}px)` }} />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(4,11,46,${grade + 0.15}) 0%, rgba(8,24,84,${grade}) 45%, rgba(4,11,46,${Math.min(1, grade + 0.3)}) 100%)` }} />
      <AbsoluteFill style={{ background: 'rgba(8,24,84,0.35)', mixBlendMode: 'color' }} />
    </AbsoluteFill>
  );
};

/** Headline text */
export const H: React.FC<{ children: React.ReactNode; size?: number; color?: string; weight?: number; family?: string; glow?: string; style?: React.CSSProperties }> = ({ children, size = 96, color = '#fff', weight = 800, family = AR, glow = 'rgba(0,0,0,0)', style }) => (
  <div style={{ fontFamily: family, fontWeight: weight, fontSize: size, lineHeight: 1.3, color, direction: 'rtl', textAlign: 'center', textShadow: `0 0 30px ${glow}, 0 6px 24px rgba(0,0,10,0.55)`, ...style }}>{children}</div>
);

/** Word-by-word rise reveal (RTL) */
export const Words: React.FC<{ text: string; at: number; stagger?: number; size?: number; color?: string; weight?: number; highlight?: string[]; hl?: string }> = ({ text, at, stagger = 4, size = 84, color = '#fff', weight = 800, highlight = [], hl = C.mint }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ direction: 'rtl', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: `0 ${size * 0.26}px`, padding: '0 70px' }}>
      {text.split(' ').map((w, i) => {
        const p = lerp(f, at + i * stagger, at + i * stagger + 12, 0, 1);
        return (
          <span key={i} style={{ display: 'inline-block', fontFamily: AR, fontWeight: weight, fontSize: size, lineHeight: 1.35, color: highlight.includes(w) ? hl : color, opacity: p, transform: `translateY(${(1 - p) * 50}px)`, filter: `blur(${(1 - p) * 10}px)`, textShadow: '0 6px 24px rgba(0,0,10,0.55)' }}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** Show children only inside [from, from+dur) without resetting the frame counter. */
export const Range: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => {
  const f = useCurrentFrame();
  return f >= from && f < to ? <>{children}</> : null;
};
