import React from 'react';
import { AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame, Easing } from 'remotion';

export const C = {
  black: '#05010b',
  ink: '#0b0416',
  purple: '#7C3AED', // store --color-primary
  purpleDark: '#5614c7', // store --color-primary-dark
  purpleLight: '#a260ff', // store --color-primary-light
  neon: '#b57bff',
  gold: '#e7c27a',
  goldDeep: '#b8862f',
  white: '#ffffff',
};
export const AR_HEAD = "'IBM Plex Sans Arabic', 'Tajawal', sans-serif";
export const AR_BODY = "'Tajawal', 'IBM Plex Sans Arabic', sans-serif";
export const EN = "'Inter', sans-serif";

export const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
export const ease = Easing.bezier(0.22, 1, 0.36, 1); // expo-out-ish
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const lerp = (f: number, a: number, b: number, from: number, to: number, e = ease) =>
  interpolate(f, [a, b], [from, to], { ...clamp, easing: e });

/** Animated film grain (SVG turbulence, reseeded every 2 frames). */
export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.09 }) => {
  const f = useCurrentFrame();
  const seed = Math.floor(f / 2) % 50;
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

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.75 }) => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background: `radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 45%, rgba(3,0,8,${strength}) 100%)`,
    }}
  />
);

/** Dark luxury purple backdrop with slow-moving light pools + perspective grid. */
export const LuxBg: React.FC<{ hue?: number; grid?: boolean; intensity?: number }> = ({ hue = 0, grid = true, intensity = 1 }) => {
  const f = useCurrentFrame();
  const x1 = 30 + Math.sin(f / 70) * 18;
  const y1 = 25 + Math.cos(f / 90) * 10;
  const x2 = 70 + Math.cos(f / 60) * 15;
  const y2 = 75 + Math.sin(f / 80) * 8;
  return (
    <AbsoluteFill style={{ background: C.black, filter: `hue-rotate(${hue}deg)` }}>
      <AbsoluteFill
        style={{
          opacity: intensity,
          background: `radial-gradient(circle at ${x1}% ${y1}%, rgba(124,58,237,0.55), rgba(124,58,237,0) 42%),
                       radial-gradient(circle at ${x2}% ${y2}%, rgba(86,20,199,0.6), rgba(86,20,199,0) 45%),
                       radial-gradient(circle at 50% 110%, rgba(162,96,255,0.35), rgba(0,0,0,0) 55%)`,
        }}
      />
      {grid && (
        <AbsoluteFill style={{ perspective: 900, overflow: 'hidden', opacity: 0.35 * intensity }}>
          <div
            style={{
              position: 'absolute',
              left: '-50%',
              width: '200%',
              top: '58%',
              height: '120%',
              transform: 'rotateX(72deg)',
              transformOrigin: '50% 0%',
              backgroundImage:
                'linear-gradient(rgba(181,123,255,0.55) 2px, transparent 2px), linear-gradient(90deg, rgba(181,123,255,0.55) 2px, transparent 2px)',
              backgroundSize: '120px 120px',
              backgroundPosition: `0px ${(f * 3) % 120}px`,
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0) 70%)',
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0) 70%)',
            }}
          />
        </AbsoluteFill>
      )}
      <Bokeh count={22} />
    </AbsoluteFill>
  );
};

export const Bokeh: React.FC<{ count?: number; seed?: string }> = ({ count = 20, seed = 'b' }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {new Array(count).fill(0).map((_, i) => {
        const x = random(`${seed}x${i}`) * 1080;
        const y = ((random(`${seed}y${i}`) * 2100 - f * (0.4 + random(`${seed}s${i}`) * 1.2)) % 2100 + 2100) % 2100 - 90;
        const s = 6 + random(`${seed}r${i}`) * 26;
        const o = 0.12 + random(`${seed}o${i}`) * 0.35;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: s,
              height: s,
              borderRadius: '50%',
              background: i % 7 === 0 ? 'rgba(231,194,122,0.8)' : 'rgba(181,123,255,0.9)',
              opacity: o,
              filter: `blur(${s / 5}px)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Particle burst / convergence field. progress 0 = gathered at (cx,cy), 1 = fully exploded. */
export const Particles: React.FC<{ progress: number; count?: number; cx?: number; cy?: number; spread?: number; seed?: string; size?: number }> = ({
  progress,
  count = 160,
  cx = 540,
  cy = 960,
  spread = 1200,
  seed = 'p',
  size = 1,
}) => (
  <AbsoluteFill style={{ pointerEvents: 'none' }}>
    {new Array(count).fill(0).map((_, i) => {
      const a = random(`${seed}a${i}`) * Math.PI * 2;
      const d = (0.15 + random(`${seed}d${i}`) * 0.85) * spread * progress;
      const swirl = progress * 1.4 * (random(`${seed}w${i}`) - 0.5);
      const x = cx + Math.cos(a + swirl) * d;
      const y = cy + Math.sin(a + swirl) * d * 1.15;
      const s = (2 + random(`${seed}s${i}`) * 7) * size;
      const gold = i % 11 === 0;
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: x - s / 2,
            top: y - s / 2,
            width: s,
            height: s,
            borderRadius: random(`${seed}q${i}`) > 0.5 ? '50%' : 2,
            background: gold ? C.gold : i % 3 === 0 ? '#ffffff' : C.neon,
            boxShadow: `0 0 ${s * 2.5}px ${gold ? C.gold : C.purpleLight}`,
            opacity: Math.max(0, 1 - progress * 0.55) * (0.5 + random(`${seed}o${i}`) * 0.5),
            transform: `rotate(${progress * 400 * random(`${seed}r${i}`)}deg)`,
          }}
        />
      );
    })}
  </AbsoluteFill>
);

/** Horizontal anamorphic light streak. */
export const Streak: React.FC<{ y: number; opacity: number; width?: number; color?: string }> = ({ y, opacity, width = 1080, color = C.neon }) => (
  <div
    style={{
      position: 'absolute',
      left: 540 - width / 2,
      top: y - 3,
      width,
      height: 6,
      opacity,
      background: `linear-gradient(90deg, transparent, ${color}, #fff, ${color}, transparent)`,
      filter: 'blur(2px)',
      boxShadow: `0 0 40px 8px ${color}`,
    }}
  />
);

/** Big headline with neon glow; RTL Arabic. */
export const Headline: React.FC<{
  children: React.ReactNode;
  size?: number;
  color?: string;
  glow?: string;
  weight?: number;
  family?: string;
  style?: React.CSSProperties;
}> = ({ children, size = 96, color = '#fff', glow = C.purpleLight, weight = 700, family = AR_HEAD, style }) => (
  <div
    style={{
      fontFamily: family,
      fontWeight: weight,
      fontSize: size,
      lineHeight: 1.25,
      color,
      direction: 'rtl',
      textAlign: 'center',
      textShadow: `0 0 18px ${glow}aa, 0 0 48px ${glow}66, 0 4px 18px rgba(0,0,0,0.8)`,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Word-by-word reveal (RTL), each word rises + unblurs. */
export const WordReveal: React.FC<{ text: string; start: number; stagger?: number; size?: number; color?: string; weight?: number; family?: string; glow?: string }> = ({
  text,
  start,
  stagger = 4,
  size = 80,
  color = '#fff',
  weight = 700,
  family = AR_HEAD,
  glow = C.purpleLight,
}) => {
  const f = useCurrentFrame();
  const words = text.split(' ');
  return (
    <div style={{ direction: 'rtl', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: `0 ${size * 0.28}px`, padding: '0 60px' }}>
      {words.map((w, i) => {
        const s = start + i * stagger;
        const p = lerp(f, s, s + 14, 0, 1);
        return (
          <span
            key={i}
            style={{
              fontFamily: family,
              fontWeight: weight,
              fontSize: size,
              lineHeight: 1.3,
              color,
              opacity: p,
              filter: `blur(${(1 - p) * 12}px)`,
              transform: `translateY(${(1 - p) * 40}px)`,
              display: 'inline-block',
              textShadow: `0 0 16px ${glow}99, 0 0 40px ${glow}55, 0 4px 14px rgba(0,0,0,0.85)`,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** RGB-split glitch wrapper. amount 0..1 */
export const Glitch: React.FC<{ amount: number; children: React.ReactNode; seed?: number }> = ({ amount, children, seed = 0 }) => {
  const f = useCurrentFrame();
  if (amount <= 0.001) return <>{children}</>;
  const off = amount * 26;
  const slices = 7;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateX(${-off}px)`, mixBlendMode: 'screen', filter: 'url(#none)', opacity: 0.9 }}>
        <AbsoluteFill style={{ filter: 'sepia(1) saturate(8) hue-rotate(-50deg)' }}>{children}</AbsoluteFill>
      </AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateX(${off}px)`, mixBlendMode: 'screen', opacity: 0.9 }}>
        <AbsoluteFill style={{ filter: 'sepia(1) saturate(8) hue-rotate(170deg)' }}>{children}</AbsoluteFill>
      </AbsoluteFill>
      {new Array(slices).fill(0).map((_, i) => {
        const y0 = random(`gl${seed}${i}${Math.floor(f / 2)}`) * 100;
        const h = 2 + random(`gh${seed}${i}${Math.floor(f / 2)}`) * 9;
        const dx = (random(`gx${seed}${i}${Math.floor(f / 2)}`) - 0.5) * 160 * amount;
        return (
          <AbsoluteFill key={i} style={{ clipPath: `inset(${y0}% 0 ${Math.max(0, 100 - y0 - h)}% 0)`, transform: `translateX(${dx}px)` }}>
            {children}
          </AbsoluteFill>
        );
      })}
      <AbsoluteFill
        style={{
          background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.35) 0px, rgba(0,0,0,0.35) 2px, transparent 2px, transparent 5px)',
          opacity: amount,
        }}
      />
    </AbsoluteFill>
  );
};

/** Shatter: renders `children` cut into shards that fly outward. progress 0..1 */
export const Shatter: React.FC<{ progress: number; children: React.ReactNode; cols?: number; rows?: number }> = ({ progress, children, cols = 5, rows = 8 }) => {
  if (progress <= 0) return <AbsoluteFill>{children}</AbsoluteFill>;
  const W = 1080, H = 1920;
  const cw = W / cols, rh = H / rows;
  const shards: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // jittered quad + split into 2 triangles
      const j = (k: string, a: number) => (random(`sj${k}`) - 0.5) * a;
      const p = (cc: number, rr: number) => [cc * cw + (cc > 0 && cc < cols ? j(`${cc}x${rr}`, cw * 0.5) : 0), rr * rh + (rr > 0 && rr < rows ? j(`${cc}y${rr}`, rh * 0.5) : 0)];
      const [a, b, d, e] = [p(c, r), p(c + 1, r), p(c, r + 1), p(c + 1, r + 1)];
      [[a, b, e], [a, e, d]].forEach((tri, ti) => {
        const cx = (tri[0][0] + tri[1][0] + tri[2][0]) / 3;
        const cy = (tri[0][1] + tri[1][1] + tri[2][1]) / 3;
        const key = `${r}-${c}-${ti}`;
        const dx = (cx - W / 2) / (W / 2), dy = (cy - H / 2) / (H / 2);
        const delay = random(`sd${key}`) * 0.25;
        const pp = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
        const pe = pp * pp;
        const tx = dx * 900 * pe + (random(`sx${key}`) - 0.5) * 400 * pe;
        const ty = dy * 1100 * pe + (random(`sy${key}`) - 0.5) * 400 * pe + 300 * pe * pe;
        const rot = (random(`sr${key}`) - 0.5) * 720 * pe;
        const rx = (random(`srx${key}`) - 0.5) * 360 * pe;
        shards.push(
          <AbsoluteFill
            key={key}
            style={{
              clipPath: `polygon(${tri.map((q) => `${q[0]}px ${q[1]}px`).join(',')})`,
              transform: `translate3d(${tx}px, ${ty}px, ${pe * 500}px) rotateZ(${rot}deg) rotateX(${rx}deg)`,
              transformOrigin: `${cx}px ${cy}px`,
              opacity: 1 - Math.max(0, pp - 0.6) / 0.4,
            }}
          >
            {children}
          </AbsoluteFill>,
        );
      });
    }
  }
  return <AbsoluteFill style={{ perspective: 1200 }}>{shards}</AbsoluteFill>;
};

/** Shake transform for impacts. */
export const shake = (f: number, at: number, dur = 10, amp = 18) => {
  if (f < at || f > at + dur) return 'none';
  const k = 1 - (f - at) / dur;
  return `translate(${(random(`shx${f}`) - 0.5) * amp * k * 2}px, ${(random(`shy${f}`) - 0.5) * amp * k * 2}px)`;
};

export const LogoImg: React.FC<{ size: number; style?: React.CSSProperties }> = ({ size, style }) => (
  <Img src={staticFile('brand/lufy_logo.png')} style={{ width: size, height: size, borderRadius: '50%', ...style }} />
);
