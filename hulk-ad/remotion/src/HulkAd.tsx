import React from 'react';
import { AbsoluteFill, Img, Sequence, interpolate, random, staticFile, useCurrentFrame } from 'remotion';
import '@fontsource/ibm-plex-sans-arabic/500.css';
import '@fontsource/ibm-plex-sans-arabic/700.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import './fonts';
import { AR_HEAD, C, EN, Grain, Headline, LuxBg, Particles, Shatter, Vignette, clamp, ease, easeInOut, lerp, shake } from './fx';
import { Phone } from './devices';
import { HULK, ONE_YEAR_MONTHLY } from './data';

export const DURATION = 900; // 30 s @ 30 fps

/* ---------- small helpers ---------- */
const Flash: React.FC<{ at: number; dur?: number; color?: string; max?: number }> = ({ at, dur = 6, color = '#fff', max = 0.8 }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: color, opacity: interpolate(f, [at, at + 1, at + dur], [0, max, 0], clamp), mixBlendMode: 'screen', pointerEvents: 'none' }} />;
};
const Fist: React.FC<{ size: number; glow?: number; style?: React.CSSProperties }> = ({ size, glow = 1, style }) => (
  <Img
    src={staticFile('brand/hulk_fist.png')}
    style={{ width: size, height: (size * 792) / 642, filter: `drop-shadow(0 0 ${30 * glow}px rgba(231,194,122,${0.7 * glow})) drop-shadow(0 0 ${70 * glow}px rgba(124,58,237,${0.8 * glow}))`, ...style }}
  />
);
/** Radial crack lines from an impact point. */
const Cracks: React.FC<{ p: number; cx?: number; cy?: number; seed?: string; color?: string }> = ({ p, cx = 540, cy = 960, seed = 'c', color = '#fff' }) => (
  <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
    {new Array(16).fill(0).map((_, i) => {
      const a = (i / 16) * Math.PI * 2 + random(`${seed}a${i}`) * 0.3;
      const len = (500 + random(`${seed}l${i}`) * 900) * p;
      let d = `M ${cx} ${cy}`;
      const steps = 5;
      for (let k = 1; k <= steps; k++) {
        const r = (len * k) / steps;
        const j = (random(`${seed}j${i}${k}`) - 0.5) * 0.35;
        d += ` L ${cx + Math.cos(a + j) * r} ${cy + Math.sin(a + j) * r}`;
      }
      return <path key={i} d={d} stroke={color} strokeWidth={2 + random(`${seed}w${i}`) * 3} fill="none" opacity={0.85} style={{ filter: `drop-shadow(0 0 6px ${C.neon})` }} />;
    })}
    <circle cx={cx} cy={cy} r={60 * p} fill="none" stroke={color} strokeWidth={4} opacity={0.6} />
  </svg>
);
const Shockwave: React.FC<{ at: number; cx?: number; cy?: number; color?: string }> = ({ at, cx = 540, cy = 960, color = C.gold }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 18], [0, 1], { ...clamp, easing: ease });
  if (f < at || f > at + 20) return null;
  return (
    <div style={{ position: 'absolute', left: cx - 900 * p, top: cy - 900 * p, width: 1800 * p, height: 1800 * p, borderRadius: '50%', border: `${14 * (1 - p) + 2}px solid ${color}`, opacity: 1 - p, boxShadow: `0 0 80px ${color}` }} />
  );
};
const riyal = (n: number | string, size: number, color = '#fff') => (
  <span style={{ direction: 'rtl', unicodeBidi: 'isolate', color }}>
    <span style={{ fontFamily: EN, fontWeight: 800, fontSize: size }}>{n}</span>
    <span style={{ fontFamily: AR_HEAD, fontWeight: 700, fontSize: size * 0.42 }}> ر.س</span>
  </span>
);
/** Pop-in sticker word */
const Sticker: React.FC<{ text: string; at: number; x: number; y: number; rot: number; color?: string; bg?: string; out?: number }> = ({ text, at, x, y, rot, color = '#fff', bg = C.purple, out }) => {
  const f = useCurrentFrame();
  if (f < at || (out && f > out + 6)) return null;
  const p = interpolate(f, [at, at + 5, at + 8], [0, 1.2, 1], clamp);
  const o = out ? interpolate(f, [out, out + 6], [1, 0], clamp) : 1;
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${p})`, opacity: o, fontFamily: AR_HEAD, fontWeight: 800, fontSize: 92, color, background: bg, padding: '10px 42px 18px', borderRadius: 26, boxShadow: `0 12px 0 rgba(0,0,0,0.35), 0 0 40px ${bg}`, direction: 'rtl', whiteSpace: 'nowrap' }}>
      {text}
    </div>
  );
};

/* ---------- A + B: the hook & the channel-surf problem (0–180) ---------- */
const channel = (i: number) => {
  const h = Math.floor(random(`ch${i}`) * 360);
  return `radial-gradient(circle at ${20 + random(`cx${i}`) * 60}% ${20 + random(`cy${i}`) * 60}%, hsla(${h},80%,60%,0.9), transparent 45%), linear-gradient(${Math.floor(random(`cg${i}`) * 360)}deg, hsl(${(h + 60) % 360},55%,22%), hsl(${(h + 200) % 360},60%,10%))`;
};
const SurfTV: React.FC<{ frozen: boolean; dead: number }> = ({ frozen, dead }) => {
  const f = useCurrentFrame();
  const speed = interpolate(f, [28, 120], [5, 2], clamp);
  const idx = frozen ? 999 : Math.floor(f / speed);
  const flick = !frozen && f % Math.max(2, Math.round(speed)) === 0;
  return (
    <div style={{ position: 'absolute', left: 70, top: 560, width: 940, height: 600, borderRadius: 30, border: '14px solid #0c0a12', boxShadow: `0 0 0 2px #2c2240, 0 0 90px rgba(124,58,237,0.45), 0 40px 80px rgba(0,0,0,0.8)`, overflow: 'hidden', background: '#000' }}>
      <AbsoluteFill style={{ background: channel(idx), filter: `grayscale(${dead}) brightness(${1 - dead * 0.55})` }} />
      {/* abstract "show" silhouettes */}
      {!frozen &&
        [0, 1, 2].map((k) => (
          <div key={k} style={{ position: 'absolute', left: `${15 + k * 28 + random(`sx${idx}${k}`) * 6}%`, bottom: '-8%', width: '22%', height: `${50 + random(`sh${idx}${k}`) * 30}%`, borderRadius: '45% 45% 0 0', background: 'rgba(0,0,0,0.35)' }} />
        ))}
      {/* static between channels */}
      <AbsoluteFill style={{ opacity: flick ? 0.55 : frozen ? 0.25 * dead : 0.08, backgroundImage: 'repeating-radial-gradient(circle at 17% 32%, #fff 0 1px, transparent 1px 3px), repeating-linear-gradient(0deg, rgba(255,255,255,0.15) 0 2px, transparent 2px 4px)', backgroundSize: '7px 9px, 100% 4px', mixBlendMode: 'screen' }} />
      <div style={{ position: 'absolute', right: 34, top: 26, fontFamily: EN, fontWeight: 800, fontSize: 46, color: '#7dff7a', textShadow: '0 0 10px #3f3' }}>{frozen ? '— —' : `CH ${String(((idx * 37) % 900) + 12).padStart(3, '0')}`}</div>
      <AbsoluteFill style={{ background: 'linear-gradient(125deg, rgba(255,255,255,0.12), rgba(255,255,255,0) 35%)' }} />
    </div>
  );
};
const HookAndSurf: React.FC = () => {
  const f = useCurrentFrame();
  const hit = 3;
  const stopP = interpolate(f, [hit, hit + 7], [2.4, 1], { ...clamp, easing: ease });
  const stopOut = interpolate(f, [24, 32], [1, 0], clamp);
  const surfIn = lerp(f, 24, 40, 0, 1);
  const frozen = f >= 154;
  const dead = interpolate(f, [150, 160], [0, 1], clamp);
  const clicks = Math.min(99, Math.floor(interpolate(f, [28, 150], [3, 58], clamp)));
  const zoomOut = interpolate(f, [154, 180], [1, 0.9], clamp);
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <LuxBg intensity={0.55 * (1 - dead * 0.7)} grid={false} />
      {/* channel surf */}
      <AbsoluteFill style={{ opacity: surfIn, transform: `scale(${zoomOut}) ${shake(f, 154, 8, 10)}`, filter: `saturate(${1 - dead})` }}>
        <SurfTV frozen={frozen} dead={dead} />
        {/* click counter */}
        <div style={{ position: 'absolute', top: 250, width: '100%', textAlign: 'center', direction: 'rtl', fontFamily: AR_HEAD, fontWeight: 700, fontSize: 64, color: '#fff' }}>
          قلّبت: <span style={{ fontFamily: EN, fontWeight: 800, fontSize: 110, color: frozen ? '#888' : C.gold, textShadow: frozen ? 'none' : `0 0 24px ${C.gold}` }}>{clicks}</span> مرة
        </div>
        {/* clock */}
        <div style={{ position: 'absolute', top: 1230, width: '100%', textAlign: 'center', fontFamily: EN, fontWeight: 700, fontSize: 54, color: '#cbb8ff', letterSpacing: 4 }}>
          {`01:${String(47 + Math.floor((f - 28) / 40)).padStart(2, '0')} AM`}
        </div>
        <Sticker text="مسلسل؟" at={71} x={300} y={500} rot={-8} out={150} />
        <Sticker text="فيلم؟" at={94} x={790} y={1280} rot={7} bg={C.purpleDark} out={150} />
        <Sticker text="مباراة؟" at={109} x={560} y={1450} rot={-4} bg="#2a1550" out={150} />
        {f >= 132 && f < 154 && (
          <div style={{ position: 'absolute', top: 1560, width: '100%', textAlign: 'center', opacity: lerp(f, 132, 140, 0, 1) }}>
            <Headline size={78} weight={700}>وبالأخير…</Headline>
          </div>
        )}
        {frozen && (
          <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ transform: `scale(${interpolate(f, [154, 160], [1.6, 1], clamp)})`, marginTop: -40 }}>
              <Headline size={170} color="#d9d9d9" glow="#555555">ولا شي!</Headline>
            </div>
          </AbsoluteFill>
        )}
      </AbsoluteFill>
      {/* the hook word */}
      {f < 34 && (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', opacity: stopOut, transform: shake(f, hit, 12, 30) }}>
          <Cracks p={interpolate(f, [hit, hit + 5], [0, 1], { ...clamp, easing: ease })} seed="hook" />
          <div style={{ transform: `scale(${stopP})`, filter: `blur(${Math.max(0, stopP - 1) * 10}px)` }}>
            <Headline size={300} weight={800} glow="#ff3d6e" style={{ letterSpacing: -4, WebkitTextStroke: '3px #ffffff' }}>وقّف!</Headline>
          </div>
        </AbsoluteFill>
      )}
      <Flash at={hit} dur={6} color="#ff4d8d" max={0.55} />
      <Flash at={154} dur={5} color="#ffffff" max={0.35} />
      <Vignette strength={0.85} />
      <Grain opacity={0.12} />
    </AbsoluteFill>
  );
};

/* ---------- C: HULK SMASH (180–240) ---------- */
const Smash: React.FC = () => {
  const f = useCurrentFrame();
  const g = f;
  const impact = 202;
  const windup = interpolate(g, [180, impact], [0, 1], clamp);
  const fistScale = g < impact ? interpolate(g, [180, 196, impact], [0.25, 0.45, 2.8], { ...clamp, easing: (t) => t * t }) : interpolate(g, [impact, impact + 10], [2.8, 1.15], { ...clamp, easing: ease });
  const shatterP = interpolate(g, [impact, impact + 22], [0, 1], { ...clamp, easing: ease });
  const mode = lerp(g, 212, 220, 0, 1);
  const deadScreen = (
    <AbsoluteFill style={{ background: '#0b0910' }}>
      <div style={{ position: 'absolute', left: 61, top: 529, width: 958, height: 576, borderRadius: 28, background: 'linear-gradient(140deg,#3a3a3a,#141414)', filter: 'grayscale(1)' }} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', marginTop: -40 }}>
        <Headline size={170} color="#d9d9d9" glow="#555555">ولا شي!</Headline>
      </AbsoluteFill>
    </AbsoluteFill>
  );
  return (
    <AbsoluteFill style={{ background: C.black }}>
      {g >= impact && <LuxBg intensity={interpolate(g, [impact, impact + 12], [0, 1], clamp)} />}
      {/* the dull screen shatters */}
      <AbsoluteFill style={{ transform: shake(g, impact, 16, 40) }}>
        <Shatter progress={shatterP}>{deadScreen}</Shatter>
      </AbsoluteFill>
      {g >= impact && <Particles progress={interpolate(g, [impact, impact + 30], [0.05, 1], { ...clamp, easing: ease })} count={170} seed="smash" spread={1300} />}
      <Shockwave at={impact} />
      <Shockwave at={impact + 4} color={C.neon} />
      {g >= impact && <Cracks p={interpolate(g, [impact, impact + 4], [0, 1], clamp)} seed="smash" color={C.gold} />}
      {/* the fist */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ transform: `scale(${fistScale}) rotate(${g < impact ? -12 + windup * 12 : 0}deg)`, opacity: interpolate(g, [180, 186], [0, 1], clamp), filter: g < impact ? `blur(${Math.max(0, fistScale - 1.2) * 4}px)` : undefined }}>
          <Fist size={420} glow={1 + Math.sin(g / 2) * 0.3 * (g < impact ? 1 : 0)} />
        </div>
      </AbsoluteFill>
      {/* "خلاص…" during wind-up */}
      {g < impact && (
        <AbsoluteFill style={{ alignItems: 'center', paddingTop: 300 }}>
          <Headline size={110} style={{ opacity: lerp(g, 182, 188, 0, 1) }}>خلاص…</Headline>
        </AbsoluteFill>
      )}
      {g >= impact && (
        <AbsoluteFill style={{ alignItems: 'center', paddingTop: 230 }}>
          <div style={{ transform: `scale(${interpolate(g, [impact, impact + 6], [1.5, 1], clamp)})` }}>
            <Headline size={124} weight={800} glow={C.gold}>حوّلها هولك!</Headline>
          </div>
        </AbsoluteFill>
      )}
      {/* HULK MODE switch */}
      {g >= 210 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 260 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 30, opacity: lerp(g, 210, 214, 0, 1) }}>
            <div style={{ fontFamily: EN, fontWeight: 800, fontSize: 62, color: '#fff', letterSpacing: 6 }}>HULK MODE</div>
            <div style={{ width: 170, height: 86, borderRadius: 43, background: mode > 0.5 ? `linear-gradient(90deg, ${C.goldDeep}, ${C.gold})` : '#333', position: 'relative', boxShadow: mode > 0.5 ? `0 0 40px ${C.gold}` : 'none' }}>
              <div style={{ position: 'absolute', top: 8, left: 8 + mode * 84, width: 70, height: 70, borderRadius: 35, background: '#fff' }} />
            </div>
            <div style={{ fontFamily: EN, fontWeight: 800, fontSize: 48, color: mode > 0.5 ? C.gold : '#777' }}>{mode > 0.5 ? 'ON' : 'OFF'}</div>
          </div>
        </AbsoluteFill>
      )}
      <Flash at={impact} dur={7} color={C.gold} max={0.85} />
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

/* ---------- D: offer — HULK from LUFY STORE + 3 durations (240–380) ---------- */
const PlanCard: React.FC<{ i: number; at: number; x: number; y: number; rot: number; w: number; dim?: number }> = ({ i, at, x, y, rot, w, dim = 0 }) => {
  const f = useCurrentFrame();
  const p = HULK[i];
  if (f < at) return null;
  const s = interpolate(f, [at, at + 6, at + 10], [2.2, 0.92, 1], clamp);
  const o = interpolate(f, [at, at + 3], [0, 1], clamp);
  return (
    <div style={{ position: 'absolute', left: x - w / 2, top: y, width: w, transform: `rotate(${rot}deg) scale(${s})`, opacity: o * (1 - dim * 0.6), filter: `blur(${dim * 3}px)` }}>
      <div style={{ borderRadius: w * 0.07, overflow: 'hidden', border: `3px solid ${i === 2 ? C.gold : C.neon}`, boxShadow: `0 0 ${i === 2 ? 60 : 30}px ${i === 2 ? 'rgba(231,194,122,0.6)' : 'rgba(124,58,237,0.6)'}, 0 30px 60px rgba(0,0,0,0.6)` }}>
        <Img src={staticFile(`store/${p.id}.jpg`)} style={{ width: '100%', display: 'block' }} />
      </div>
      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
        <div style={{ background: i === 2 ? `linear-gradient(180deg, #f8e3ad, ${C.gold} 50%, ${C.goldDeep})` : 'rgba(20,8,40,0.9)', border: i === 2 ? 'none' : `2px solid ${C.neon}`, borderRadius: 99, padding: '6px 34px 10px' }}>
          {riyal(p.price, w * 0.15, i === 2 ? '#2a1600' : '#fff')}
        </div>
      </div>
    </div>
  );
};
const Offer: React.FC = () => {
  const f = useCurrentFrame();
  const g = f;
  const lock = lerp(g, 241, 256, 0, 1);
  const lockOut = interpolate(g, [288, 297], [1, 0], clamp);
  return (
    <AbsoluteFill>
      <LuxBg />
      {/* lockup: اشتراك هولك — من لوفي ستور */}
      {g < 300 && (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', opacity: lockOut, transform: `scale(${0.9 + lock * 0.1 + (1 - lockOut) * 0.2})` }}>
          <Fist size={330} />
          <div style={{ marginTop: 20, opacity: lock }}>
            <Headline size={130} weight={800} glow={C.gold}>اشتراك هولك</Headline>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 26, opacity: lerp(g, 258, 270, 0, 1), direction: 'rtl' }}>
            <div style={{ fontFamily: AR_HEAD, fontWeight: 700, fontSize: 58, color: '#e8dcff' }}>من</div>
            <Img src={staticFile('brand/lufy_logo.png')} style={{ width: 150, height: 150, borderRadius: '50%', boxShadow: `0 0 30px ${C.purple}` }} />
            <div style={{ fontFamily: EN, fontWeight: 800, fontSize: 58, color: '#fff' }}>LUFY STORE</div>
          </div>
        </AbsoluteFill>
      )}
      {/* three durations slam in with the voice */}
      <PlanCard i={0} at={297} x={300} y={300} rot={-7} w={440} dim={interpolate(g, [349, 358], [0, 1], clamp)} />
      <PlanCard i={1} at={324} x={790} y={560} rot={6} w={440} dim={interpolate(g, [349, 358], [0, 1], clamp)} />
      <PlanCard i={2} at={349} x={540} y={900} rot={-2} w={560} />
      {[297, 324, 349].map((a) => <Flash key={a} at={a} dur={4} color={C.purpleLight} max={0.35} />)}
      {[297, 324, 349].map((a) => <Shockwave key={`s${a}`} at={a} color={C.neon} />)}
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

/* ---------- E: the year + the per-month math (380–555) ---------- */
const Value: React.FC = () => {
  const f = useCurrentFrame();
  const g = f;
  const cardIn = lerp(g, 380, 400, 0, 1);
  const count = Math.round(interpolate(g, [417, 474], [0, 196], { ...clamp, easing: Easing2 }));
  const slam = interpolate(g, [474, 480], [1.5, 1], clamp);
  const mathIn = g >= 489;
  const eq = lerp(g, 489, 500, 0, 1);
  const res = lerp(g, 512, 522, 0, 1);
  const big = interpolate(g, [528, 536], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <LuxBg hue={-8} />
      {!mathIn && (
        <>
          <AbsoluteFill style={{ alignItems: 'center', paddingTop: 170, opacity: cardIn }}>
            <Headline size={110} weight={800}>السنة كاملة</Headline>
            <div style={{ fontFamily: AR_HEAD, fontWeight: 700, fontSize: 48, color: C.gold, marginTop: 6, direction: 'rtl' }}>اشتراك هولك HULK – 12 شهر</div>
          </AbsoluteFill>
          <AbsoluteFill style={{ alignItems: 'center', paddingTop: 470, perspective: 1600 }}>
            <div style={{ transform: `rotateY(${(1 - cardIn) * 50 + Math.sin(g / 25) * 4}deg) scale(${0.8 + cardIn * 0.2})`, borderRadius: 40, overflow: 'hidden', border: `4px solid ${C.gold}`, boxShadow: '0 0 90px rgba(231,194,122,0.55)' }}>
              <Img src={staticFile('store/hulk_12.jpg')} style={{ width: 640, display: 'block' }} />
            </div>
          </AbsoluteFill>
          {g >= 417 && (
            <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 170 }}>
              <div style={{ transform: `scale(${g >= 474 ? slam : 1})`, padding: '10px 60px 22px', borderRadius: 40, background: g >= 474 ? `linear-gradient(180deg, #f8e3ad, ${C.gold} 50%, ${C.goldDeep})` : 'rgba(20,8,40,0.85)', boxShadow: g >= 474 ? `0 0 70px ${C.gold}` : 'none' }}>
                {riyal(count, 170, g >= 474 ? '#2a1600' : '#fff')}
              </div>
              {g >= 476 && <div style={{ marginTop: 18, fontFamily: AR_HEAD, fontWeight: 800, fontSize: 70, color: '#fff' }}>بس!</div>}
            </AbsoluteFill>
          )}
        </>
      )}
      {mathIn && (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ opacity: eq, transform: `translateY(${(1 - eq) * 40}px)`, display: 'flex', alignItems: 'center', gap: 40, direction: 'ltr', fontFamily: EN, fontWeight: 800, fontSize: 150, color: '#fff' }}>
            <span>196</span>
            <span style={{ color: C.neon }}>÷</span>
            <span>12</span>
          </div>
          <div style={{ opacity: res, fontFamily: EN, fontWeight: 800, fontSize: 120, color: C.neon, marginTop: 10 }}>= {ONE_YEAR_MONTHLY}</div>
          <div style={{ marginTop: 70, transform: `scale(${interpolate(big, [0, 1], [1.6, 1])})`, opacity: big, textAlign: 'center' }}>
            <Headline size={100} weight={800} glow={C.gold}>أقل من</Headline>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 18, direction: 'rtl' }}>
              {riyal(17, 230, C.gold)}
            </div>
            <Headline size={90} weight={800}>بالشهر!</Headline>
          </div>
        </AbsoluteFill>
      )}
      <Flash at={474} dur={6} color={C.gold} max={0.6} />
      <Flash at={528} dur={6} color={C.gold} max={0.5} />
      {g >= 528 && <Particles progress={interpolate(g, [528, 555], [0.05, 1], clamp)} count={90} seed="v" spread={1100} />}
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};
const Easing2 = (t: number) => 1 - Math.pow(1 - t, 3);

/* ---------- F: trust — real product page + support (555–705) ---------- */
const Trust: React.FC = () => {
  const f = useCurrentFrame();
  const g = f;
  const ph = lerp(g, 555, 580, 0, 1);
  const chip = (t: string, at: number, y: number, icon: React.ReactNode) => {
    const p = lerp(g, at, at + 10, 0, 1);
    return (
      <div style={{ position: 'absolute', right: 60, left: 60, top: y, display: 'flex', justifyContent: 'center', opacity: p, transform: `translateX(${(1 - p) * 120}px)` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, direction: 'rtl', background: 'rgba(14,6,28,0.9)', border: `2px solid ${C.neon}88`, borderRadius: 28, padding: '20px 34px', boxShadow: `0 0 40px rgba(124,58,237,0.45)` }}>
          {icon}
          <div style={{ fontFamily: AR_HEAD, fontWeight: 700, fontSize: 50, color: '#fff' }}>{t}</div>
        </div>
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <LuxBg />
      <AbsoluteFill style={{ perspective: 1600 }}>
        <div style={{ position: 'absolute', left: 540 - 240, top: 470, transform: `translateY(${(1 - ph) * 900}px) rotateY(${-8 + Math.sin(g / 30) * 3}deg) rotateX(3deg)` }}>
          {/* real recording: HULK 12-month product page -> details -> order area */}
          <Sequence from={555} layout="none"><Phone width={460} screen={{ kind: 'video', src: 'store/mobile_browse_hq.mp4', startFrom: Math.round(11.4 * 30), rate: 1.15 }} /></Sequence>
        </div>
      </AbsoluteFill>
      {chip('دعم مباشر عبر واتساب', 563, 170, <div style={{ width: 64, height: 64, borderRadius: 32, background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36 }}>💬</div>)}
      {chip('نتواصل معك بعد الطلب بتفاصيل التفعيل', 640, 320, <div style={{ width: 64, height: 64, borderRadius: 32, background: C.gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: EN, fontWeight: 800, fontSize: 40, color: '#2a1600' }}>✓</div>)}
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

/* ---------- G: push + CTA + end card (705–900) ---------- */
const CTA: React.FC = () => {
  const f = useCurrentFrame();
  const g = f;
  const think = g >= 710 && g < 744;
  const btnIn = lerp(g, 744, 752, 0, 1);
  const punch = 762;
  const press = g >= punch ? interpolate(g, [punch, punch + 3, punch + 9], [1, 0.86, 1], clamp) : 1;
  const fistP = interpolate(g, [750, punch], [0, 1], { ...clamp, easing: (t) => t * t * t });
  const end = g >= 804;
  const endP = lerp(g, 804, 822, 0, 1);
  return (
    <AbsoluteFill>
      <LuxBg intensity={end ? 0.8 : 1} />
      {think && (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', transform: shake(g, 710, 8, 16) }}>
          <div style={{ transform: `scale(${interpolate(g, [710, 716], [1.8, 1], clamp)}) rotate(-3deg)` }}>
            <Headline size={150} weight={800}>لا تفكّر</Headline>
            <Headline size={150} weight={800} glow={C.gold} color={C.gold}>كثير…</Headline>
          </div>
        </AbsoluteFill>
      )}
      {g >= 744 && !end && (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ marginBottom: 70, opacity: btnIn }}>
            <Headline size={86} weight={700}>اطلب هولك الحين</Headline>
          </div>
          <div style={{ transform: `scale(${(0.6 + btnIn * 0.4) * press})`, fontFamily: AR_HEAD, fontWeight: 800, fontSize: 92, color: '#241400', direction: 'rtl', padding: '34px 90px 44px', borderRadius: 99, background: `linear-gradient(180deg, #fbe9b8, ${C.gold} 45%, ${C.goldDeep})`, boxShadow: `0 0 ${g >= punch ? 110 : 50}px rgba(231,194,122,0.8), inset 0 3px 0 rgba(255,255,255,0.7), 0 22px 0 #7a5418` }}>
            اطلب الحين
          </div>
          <div style={{ marginTop: 60, fontFamily: EN, fontWeight: 800, fontSize: 70, color: '#fff', letterSpacing: 3, opacity: btnIn }}>lufy.store</div>
          {/* fist comes down and punches the button */}
          {g < punch + 8 && (
            <div style={{ position: 'absolute', left: 540 - 140, top: interpolate(fistP, [0, 1], [-600, 640]), transform: `scale(${1.4 - fistP * 0.6})`, opacity: interpolate(g, [750, 754, punch + 4, punch + 8], [0, 1, 1, 0], clamp) }}>
              <Fist size={280} />
            </div>
          )}
          <Shockwave at={punch} cy={1000} />
          {g >= punch && <Particles progress={interpolate(g, [punch, punch + 30], [0.05, 1], clamp)} count={100} cy={1000} seed="cta" spread={900} />}
        </AbsoluteFill>
      )}
      {end && (
        <AbsoluteFill style={{ alignItems: 'center', paddingTop: 300 }}>
          <div style={{ transform: `scale(${0.7 + endP * 0.3})`, opacity: endP, filter: `drop-shadow(0 0 ${50 * endP}px ${C.purple})` }}>
            <Img src={staticFile('brand/lufy_logo.png')} style={{ width: 560, height: 560, borderRadius: '50%' }} />
          </div>
          <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 24, opacity: lerp(g, 816, 828, 0, 1), direction: 'rtl' }}>
            <Fist size={90} glow={0.6} />
            <Headline size={84} weight={800} glow={C.gold}>اشتراك هولك</Headline>
          </div>
          <div style={{ marginTop: 34, display: 'flex', gap: 22, direction: 'rtl', opacity: lerp(g, 824, 836, 0, 1) }}>
            {HULK.map((p, i) => (
              <div key={p.id} style={{ textAlign: 'center', padding: '14px 26px 18px', borderRadius: 24, background: i === 2 ? `linear-gradient(180deg, #f8e3ad, ${C.gold} 50%, ${C.goldDeep})` : 'rgba(20,8,40,0.85)', border: i === 2 ? 'none' : `2px solid ${C.neon}88` }}>
                <div style={{ fontFamily: AR_HEAD, fontWeight: 700, fontSize: 40, color: i === 2 ? '#2a1600' : '#e8dcff' }}>{p.duration}</div>
                {riyal(p.price, 60, i === 2 ? '#2a1600' : '#fff')}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 54, fontFamily: EN, fontWeight: 800, fontSize: 76, letterSpacing: 4, color: '#fff', textShadow: `0 0 30px ${C.purple}`, opacity: lerp(g, 832, 844, 0, 1) }}>lufy.store</div>
        </AbsoluteFill>
      )}
      <Flash at={710} dur={5} color={C.purpleLight} max={0.4} />
      <Flash at={punch} dur={8} color={C.gold} max={0.8} />
      <Flash at={804} dur={8} color={C.purpleLight} max={0.5} />
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

/** Shows children only inside [from, from+dur) WITHOUT resetting the frame counter (all timings are absolute). */
const Range: React.FC<{ from: number; dur: number; children: React.ReactNode }> = ({ from, dur, children }) => {
  const f = useCurrentFrame();
  return f >= from && f < from + dur ? <>{children}</> : null;
};

export const HulkAd: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <Range from={0} dur={180}><HookAndSurf /></Range>
    <Range from={180} dur={60}><Smash /></Range>
    <Range from={240} dur={140}><Offer /></Range>
    <Range from={380} dur={175}><Value /></Range>
    <Range from={555} dur={150}><Trust /></Range>
    <Range from={705} dur={195}><CTA /></Range>
  </AbsoluteFill>
);
