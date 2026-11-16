import React from 'react';
import { AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame } from 'remotion';
import { AR_BODY, AR_HEAD, C, EN } from './fx';
import type { Product } from './data';

/** Screen content: either a real recording (video) or a real full-page screenshot scrolled. */
export type ScreenSrc =
  | { kind: 'video'; src: string; startFrom: number; rate?: number }
  | { kind: 'scroll'; src: string; imgW: number; imgH: number; from: number; to: number; at: [number, number] };

const ScreenContent: React.FC<{ s: ScreenSrc; w: number; h: number }> = ({ s, w, h }) => {
  const f = useCurrentFrame();
  if (s.kind === 'video') {
    return (
      <OffthreadVideo
        muted
        src={staticFile(s.src)}
        startFrom={s.startFrom}
        playbackRate={s.rate ?? 1}
        style={{ width: w, height: h, objectFit: 'cover', objectPosition: 'top' }}
      />
    );
  }
  const scale = w / s.imgW;
  const t = Math.max(0, Math.min(1, (f - s.at[0]) / Math.max(1, s.at[1] - s.at[0])));
  const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const y = s.from + (s.to - s.from) * e;
  return <Img src={staticFile(s.src)} style={{ width: w, height: s.imgH * scale, transform: `translateY(${-y * scale}px)` }} />;
};

/** Premium phone (generic design, no third-party branding). Screen 430x932 pt = 48 pt status bar + 430x884 page area (= HQ recording viewport). */
export const Phone: React.FC<{ width: number; screen: ScreenSrc; glow?: number; children?: React.ReactNode; style?: React.CSSProperties }> = ({
  width,
  screen,
  glow = 1,
  children,
  style,
}) => {
  const sw = width;
  const sh = (sw * 932) / 430;
  const bezel = sw * 0.035;
  const R = sw * 0.14;
  const statusH = (sw * 48) / 430;
  return (
    <div
      style={{
        position: 'relative',
        width: sw + bezel * 2,
        height: sh + bezel * 2,
        borderRadius: R + bezel,
        padding: bezel,
        background: 'linear-gradient(145deg, #3a2f4f 0%, #121018 30%, #0a080f 60%, #2e2340 100%)',
        boxShadow: `0 0 0 2px #4b3d66, 0 0 ${60 * glow}px ${10 * glow}px rgba(124,58,237,${0.45 * glow}), 0 50px 120px rgba(0,0,0,0.75), inset 0 0 0 1px rgba(255,255,255,0.08)`,
        ...style,
      }}
    >
      <div style={{ position: 'relative', width: sw, height: sh, borderRadius: R, overflow: 'hidden', background: '#000' }}>
        {/* status bar (48 of 932 pt) + page area at the recording's exact aspect (430x884) -> no side cropping */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: sw, height: statusH, background: '#1b1b1d', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: `0 ${sw * 0.085}px ${statusH * 0.12}px`, boxSizing: 'border-box', fontFamily: EN, fontWeight: 700, fontSize: statusH * 0.36, color: '#fff' }}>
          <span>9:41</span>
          <span style={{ display: 'flex', gap: sw * 0.012, alignItems: 'center' }}>
            <span style={{ letterSpacing: -1 }}>▂▄▆█</span>
            <span style={{ display: 'inline-block', width: statusH * 0.55, height: statusH * 0.26, border: '2px solid #fff', borderRadius: 4, position: 'relative' }}>
              <span style={{ position: 'absolute', inset: 2, background: '#fff', borderRadius: 2 }} />
            </span>
          </span>
        </div>
        <div style={{ position: 'absolute', top: statusH, left: 0, width: sw, height: sh - statusH, overflow: 'hidden' }}>
          <ScreenContent s={screen} w={sw} h={sh - statusH} />
        </div>
        {/* dynamic-island style pill */}
        <div style={{ position: 'absolute', top: sw * 0.025, left: '50%', width: sw * 0.28, height: sw * 0.075, marginLeft: -sw * 0.14, borderRadius: 99, background: '#000' }} />
        {/* glass reflection */}
        <AbsoluteFill style={{ background: 'linear-gradient(115deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 28%, rgba(255,255,255,0) 70%, rgba(181,123,255,0.07) 100%)', pointerEvents: 'none' }} />
        {children}
      </div>
    </div>
  );
};

/** Generic premium laptop (no third-party branding). Screen ratio 16:10 = desktop recording 1440x900. */
export const Laptop: React.FC<{ width: number; screen: ScreenSrc; style?: React.CSSProperties }> = ({ width, screen, style }) => {
  const sw = width;
  const sh = sw * (900 / 1440);
  const bz = sw * 0.022;
  return (
    <div style={{ position: 'relative', width: sw + bz * 2, ...style }}>
      <div
        style={{
          width: sw + bz * 2,
          height: sh + bz * 2.6,
          padding: `${bz * 1.6}px ${bz}px ${bz}px`,
          borderRadius: sw * 0.03,
          background: 'linear-gradient(160deg, #2b2338, #0b0910 55%, #241b33)',
          boxShadow: '0 0 0 2px #3d3150, 0 0 70px 6px rgba(124,58,237,0.35), 0 40px 100px rgba(0,0,0,0.7)',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ position: 'relative', width: sw, height: sh, borderRadius: 6, overflow: 'hidden', background: '#000' }}>
          <ScreenContent s={screen} w={sw} h={sh} />
          <AbsoluteFill style={{ background: 'linear-gradient(120deg, rgba(255,255,255,0.08), rgba(255,255,255,0) 35%)' }} />
        </div>
      </div>
      <div
        style={{
          width: (sw + bz * 2) * 1.12,
          marginLeft: -(sw + bz * 2) * 0.06,
          height: sw * 0.035,
          borderRadius: `0 0 ${sw * 0.04}px ${sw * 0.04}px`,
          background: 'linear-gradient(180deg, #4a3e5e, #1a1522 60%, #0c0a10)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
        }}
      />
    </div>
  );
};

const riyal = (n: number) => (
  <span style={{ direction: 'rtl', unicodeBidi: 'isolate' }}>
    <span style={{ fontFamily: EN, fontWeight: 800 }}>{n}</span> <span style={{ fontFamily: AR_BODY, fontWeight: 700, fontSize: '0.62em' }}>ر.س</span>
  </span>
);

/** Glass product card built around the ORIGINAL store product image. */
export const ProductCard: React.FC<{ p: Product; width: number; highlight?: number; showPrice?: boolean; style?: React.CSSProperties }> = ({
  p,
  width,
  highlight = 0,
  showPrice = true,
  style,
}) => {
  const pad = width * 0.045;
  return (
    <div
      style={{
        width,
        borderRadius: width * 0.07,
        padding: pad,
        boxSizing: 'border-box',
        background: 'linear-gradient(160deg, rgba(45,22,85,0.92), rgba(14,6,28,0.95))',
        border: `2px solid rgba(181,123,255,${0.35 + highlight * 0.6})`,
        boxShadow: `0 0 ${30 + highlight * 60}px rgba(124,58,237,${0.35 + highlight * 0.5}), 0 30px 70px rgba(0,0,0,0.6)`,
        direction: 'rtl',
        ...style,
      }}
    >
      <div style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', borderRadius: width * 0.05, overflow: 'hidden' }}>
        <Img src={staticFile(p.image)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <AbsoluteFill style={{ background: 'linear-gradient(120deg, rgba(255,255,255,0.18), rgba(255,255,255,0) 40%)' }} />
      </div>
      <div style={{ fontFamily: AR_HEAD, fontWeight: 700, fontSize: width * 0.062, color: '#fff', marginTop: pad * 0.9, lineHeight: 1.35, minHeight: width * 0.17 }}>{p.name}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: pad * 0.6, gap: 10 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <span
            style={{
              fontFamily: AR_HEAD,
              fontWeight: 700,
              fontSize: width * 0.06,
              color: '#fff',
              padding: `${width * 0.012}px ${width * 0.04}px`,
              borderRadius: 99,
              background: `linear-gradient(90deg, ${C.purpleDark}, ${C.purple})`,
            }}
          >
            {p.duration}
          </span>
          {p.devices && (
            <span
              style={{
                fontFamily: AR_HEAD,
                fontWeight: 700,
                fontSize: width * 0.06,
                color: C.gold,
                padding: `${width * 0.012}px ${width * 0.04}px`,
                borderRadius: 99,
                border: `2px solid ${C.gold}`,
              }}
            >
              {p.devices}
            </span>
          )}
        </div>
        {showPrice && <span style={{ fontSize: width * 0.085, color: '#fff' }}>{riyal(p.price)}</span>}
      </div>
    </div>
  );
};

/** Luxury TV with a GENERIC entertainment UI designed for the ad (no third-party logos/titles). */
export const LuxTV: React.FC<{ width: number; style?: React.CSSProperties }> = ({ width, style }) => {
  const f = useCurrentFrame();
  const h = (width * 9) / 16;
  const tiles = (row: number) =>
    new Array(6).fill(0).map((_, i) => {
      const hue = 255 + ((i * 37 + row * 61) % 70) - 35;
      const x = ((i * 0.22 - (f * 0.0016 * (row + 1)) % 0.22) * width);
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: x + width * 0.04,
            width: width * 0.19,
            height: h * 0.2,
            borderRadius: width * 0.012,
            background: `linear-gradient(${140 + i * 25}deg, hsl(${hue},70%,${28 + (i % 3) * 8}%), hsl(${hue + 30},80%,12%))`,
            boxShadow: i === 2 && row === 0 ? `0 0 0 3px #fff, 0 0 30px ${C.neon}` : undefined,
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', right: '12%', top: '22%', width: '42%', height: '56%', borderRadius: '50%', background: `radial-gradient(circle at 40% 40%, hsla(${hue + 60},90%,70%,0.55), transparent 70%)` }} />
        </div>
      );
    });
  return (
    <div style={{ width, ...style }}>
      <div
        style={{
          position: 'relative',
          width,
          height: h,
          borderRadius: 14,
          border: '10px solid #0d0b12',
          boxShadow: `0 0 0 2px #2c2240, 0 0 120px 20px rgba(124,58,237,0.45), 0 40px 90px rgba(0,0,0,0.8)`,
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #120724, #05020a)',
        }}
      >
        {/* hero banner */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: h * 0.5, background: 'radial-gradient(circle at 70% 45%, rgba(162,96,255,0.85), rgba(86,20,199,0.35) 35%, rgba(5,2,10,0) 70%)' }} />
        <div style={{ position: 'absolute', left: width * 0.05, top: h * 0.12, width: width * 0.3, height: h * 0.05, borderRadius: 8, background: 'rgba(255,255,255,0.85)' }} />
        <div style={{ position: 'absolute', left: width * 0.05, top: h * 0.2, width: width * 0.22, height: h * 0.03, borderRadius: 8, background: 'rgba(255,255,255,0.35)' }} />
        <div style={{ position: 'absolute', left: width * 0.05, top: h * 0.29, padding: `${h * 0.012}px ${width * 0.025}px`, borderRadius: 8, background: '#fff', color: '#1a0b33', fontFamily: EN, fontWeight: 800, fontSize: h * 0.045 }}>
          ▶&nbsp; 4K
        </div>
        <div style={{ position: 'absolute', top: h * 0.53, width: '100%', height: h * 0.2 }}>{tiles(0)}</div>
        <div style={{ position: 'absolute', top: h * 0.77, width: '100%', height: h * 0.2 }}>{tiles(1)}</div>
        <AbsoluteFill style={{ background: 'linear-gradient(120deg, rgba(255,255,255,0.07), rgba(255,255,255,0) 30%)' }} />
      </div>
      <div style={{ width: width * 0.3, height: 14, margin: '0 auto', background: 'linear-gradient(#2a2238, #0b0910)', borderRadius: '0 0 10px 10px' }} />
    </div>
  );
};
