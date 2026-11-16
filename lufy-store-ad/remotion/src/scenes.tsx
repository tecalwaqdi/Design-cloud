import React from 'react';
import { AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, random, staticFile, useCurrentFrame } from 'remotion';
import {
  AR_BODY, AR_HEAD, Bokeh, C, EN, Glitch, Grain, Headline, LogoImg, LuxBg, Particles, Shatter, Streak, Vignette, WordReveal, clamp, ease, easeInOut, lerp, shake,
} from './fx';
import { Laptop, LuxTV, Phone, ProductCard } from './devices';
import { ALQADI, HULK, SNAP } from './data';

const FPS = 30;

/* ------------------------------------------------------------------ helpers */

/** 16:9 source shown full-bleed in 9:16 by cropping a moving window ("virtual camera"). */
const VCrop: React.FC<{ src: string; startFrom: number; center: (lf: number) => number; zoom?: (lf: number) => number; style?: React.CSSProperties; children?: React.ReactNode }> = ({
  src, startFrom, center, zoom = () => 1, style, children,
}) => {
  const lf = useCurrentFrame();
  const z = zoom(lf);
  const scale = (1920 / 1080) * z; // source px -> output px
  const cx = center(lf);
  const left = 540 - cx * scale;
  const top = 960 - 540 * scale;
  return (
    <AbsoluteFill style={{ overflow: 'hidden', ...style }}>
      <div style={{ position: 'absolute', left, top, width: 1920 * scale, height: 1080 * scale }}>
        <OffthreadVideo muted src={staticFile(src)} startFrom={startFrom} style={{ width: '100%', height: '100%' }} />
        {children}
      </div>
    </AbsoluteFill>
  );
};

const Flash: React.FC<{ at: number; dur?: number; color?: string; max?: number }> = ({ at, dur = 8, color = '#fff', max = 0.85 }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [at, at + 1, at + dur], [0, max, 0], clamp);
  return <AbsoluteFill style={{ background: color, opacity: o, mixBlendMode: 'screen', pointerEvents: 'none' }} />;
};

/** Cinematic purple grade on top of live-action. */
const Grade: React.FC<{ amount?: number }> = ({ amount = 1 }) => (
  <>
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(86,20,199,0.22), rgba(5,1,11,0.0) 40%, rgba(5,1,11,0.55))', mixBlendMode: 'multiply', opacity: amount }} />
    <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 40%, rgba(162,96,255,0.18), rgba(0,0,0,0) 60%)', mixBlendMode: 'screen', opacity: amount }} />
  </>
);

/* ------------------------------------------------------------------ S1: in the heat of the moment (0–150) */
const stadiumCenter = (t: number) => interpolate(t, [0, 1, 2, 3, 4, 5], [700, 820, 1050, 1300, 1500, 1580], clamp);

// Living room: locked-off shot (livingroom_clean.mp4 = AI broadcast graphics removed by scripts/clean_tv.py).
// The original TV picture is kept, so the match is always ON the TV, in front of the viewer.
const LivingRoomShot: React.FC = () => (
  <VCrop
    src="video/livingroom_clean.mp4"
    startFrom={0}
    center={(f) => interpolate(f, [0, 54], [985, 965], { ...clamp, easing: easeInOut })}
    zoom={(f) => interpolate(f, [0, 54], [1.0, 1.06], clamp)}
  />
);

export const S1Opening: React.FC = () => {
  const f = useCurrentFrame();
  const glitchAmt = interpolate(f, [136, 139, 143, 147], [0, 1, 0.8, 0], clamp);
  const freezeZoom = interpolate(f, [138, 147], [1.0, 1.08], clamp);
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <Sequence durationInFrames={54}><LivingRoomShot /></Sequence>
      <Sequence from={54} durationInFrames={42}>
        <VCrop src="video/stadium.mp4" startFrom={54} center={(lf) => stadiumCenter((54 + lf) / FPS)} zoom={(lf) => 1.05 + lf * 0.002} />
      </Sequence>
      <Sequence from={96} durationInFrames={24}>
        <VCrop src="video/remote_hand.mp4" startFrom={36} center={(lf) => 860 + lf * 2} zoom={(lf) => 1.18 + lf * 0.004} style={{ transform: shake(f, 100, 14, 10) }} />
      </Sequence>
      <Sequence from={120} durationInFrames={18}>
        <VCrop src="video/stadium.mp4" startFrom={102} center={(lf) => stadiumCenter((102 + lf) / FPS)} zoom={(lf) => 1.1 + lf * 0.01} />
      </Sequence>
      <Sequence from={138} durationInFrames={9}>
        <Glitch amount={glitchAmt} seed={1}>
          <AbsoluteFill style={{ overflow: 'hidden' }}>
            <Img src={staticFile('stills/stadium_freeze.jpg')} style={{ position: 'absolute', height: 1920 * freezeZoom * 1.1, left: 540 - stadiumCenter(4.0) * (1920 / 1080) * freezeZoom * 1.1, top: 960 - 960 * freezeZoom * 1.1, filter: 'saturate(0.6) contrast(1.15)' }} />
          </AbsoluteFill>
        </Glitch>
      </Sequence>
      {f < 138 && <Grade amount={0.9} />}
      <Flash at={54} dur={5} max={0.35} />
      <Flash at={96} dur={4} max={0.25} />
      <Flash at={120} dur={4} max={0.3} />
      <Flash at={138} dur={3} max={0.9} />
      {/* CRT collapse to a line then black */}
      {f >= 145 && <AbsoluteFill style={{ background: '#000' }}><Streak y={960} opacity={interpolate(f, [145, 150], [1, 0], clamp)} /></AbsoluteFill>}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ S2: the hook (150–270) */
export const S2Hook: React.FC = () => {
  const lf = useCurrentFrame(); // 0 = 5.0s
  const hit = 18; // 5.6s bass impact
  const shatterP = interpolate(lf, [86, 110], [0, 1], clamp);
  const line1 = lerp(lf, hit, hit + 10, 0, 1);
  const line2 = lerp(lf, 50, 60, 0, 1);
  const text2 = lerp(lf, 100, 110, 0, 1);
  const out2 = interpolate(lf, [128, 140], [1, 0], clamp);
  const zoom1 = interpolate(lf, [hit, 86], [1.12, 1.0], { ...clamp, easing: ease });
  const Layer1 = (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ transform: `scale(${zoom1})`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <Headline size={96} style={{ opacity: line1, filter: `blur(${(1 - line1) * 14}px)` }}>في عزّ الحماس…</Headline>
        <Headline
          size={98}
          weight={700}
          style={{
            opacity: line2,
            transform: `scale(${1.25 - line2 * 0.25})`,
            background: `linear-gradient(90deg, #ffffff, ${C.neon}, #ffffff)`,
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            padding: '0 30px',
          }}
        >
          وفجأة كل شي وقف؟!
        </Headline>
      </div>
    </AbsoluteFill>
  );
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {/* the viewer presses the remote in disbelief */}
      {lf >= hit && lf < 100 && (
        <AbsoluteFill style={{ opacity: interpolate(lf, [hit, hit + 8, 80, 96], [0, 0.42, 0.42, 0], clamp), filter: 'grayscale(0.6) brightness(0.8)' }}>
          <VCrop src="video/remote_hand.mp4" startFrom={70} center={(f) => 820 + f * 1.5} zoom={(f) => 1.25 + f * 0.002} />
          <AbsoluteFill style={{ background: 'rgba(60,15,120,0.45)', mixBlendMode: 'color' }} />
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ transform: shake(lf, hit, 12, 22) }}>
        {lf < 112 && <Shatter progress={shatterP}>{Layer1}</Shatter>}
      </AbsoluteFill>
      {lf >= 86 && <Particles progress={interpolate(lf, [86, 125], [0.05, 1], { ...clamp, easing: ease })} count={180} seed="s2" />}
      {lf >= 100 && (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', opacity: out2, transform: `${shake(lf, 100, 8, 12)} scale(${1.3 - text2 * 0.3})` }}>
          <div style={{ padding: '24px 46px', borderRadius: 28, background: 'rgba(124,58,237,0.18)', border: `2px solid ${C.neon}88`, boxShadow: `0 0 60px ${C.purple}88` }}>
            <Headline size={84} style={{ opacity: text2 }}>لا تخلّي اختيار</Headline>
            <Headline size={84} style={{ opacity: text2 }} color={C.gold} glow={C.gold}>اشتراكك عشوائي!</Headline>
          </div>
        </AbsoluteFill>
      )}
      <Flash at={hit} dur={6} color={C.purpleLight} max={0.6} />
      <Flash at={86} dur={6} max={0.5} />
      <Grain opacity={0.12} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ S3: enter LUFY STORE (270–450) */
export const S3Enter: React.FC = () => {
  const lf = useCurrentFrame(); // 0 = 9.0s
  const conv = interpolate(lf, [0, 30], [1, 0], { ...clamp, easing: ease });
  const ph = lerp(lf, 8, 52, 0, 1);
  const title = lerp(lf, 30, 50, 0, 1);
  return (
    <AbsoluteFill>
      <LuxBg intensity={interpolate(lf, [0, 30], [0, 1], clamp)} />
      {lf < 34 && <Particles progress={conv} count={180} cy={1130} seed="s2" />}
      <AbsoluteFill style={{ perspective: 1600 }}>
        <div
          style={{
            position: 'absolute',
            left: 540 - 280,
            top: 470,
            transform: `translateY(${(1 - ph) * 200}px) scale(${0.25 + ph * 0.75}) rotateY(${(1 - ph) * 40 - 4 + Math.sin(lf / 40) * 3}deg) rotateX(${(1 - ph) * 12 + 4}deg)`,
            transformOrigin: '50% 40%',
            opacity: interpolate(lf, [6, 20], [0, 1], clamp),
          }}
        >
          <Phone
            width={520}
            screen={{ kind: 'video', src: 'rec/mobile_browse_hq.mp4', startFrom: 0 }}
          />
        </div>
      </AbsoluteFill>
      {/* the real browsing recording plays inside the phone: home -> tap HULK category */}
      <AbsoluteFill style={{ alignItems: 'center', paddingTop: 150 }}>
        <div style={{ opacity: title, transform: `translateY(${(1 - title) * 40}px)`, textAlign: 'center' }}>
          <div style={{ fontFamily: EN, fontWeight: 800, fontSize: 104, letterSpacing: 6, lineHeight: 1, background: `linear-gradient(90deg, #fff 0%, #fff 45%, ${C.neon} 55%, ${C.purpleLight} 100%)`, WebkitBackgroundClip: 'text', color: 'transparent', filter: `drop-shadow(0 0 24px ${C.purple})` }}>
            LUFY STORE
          </div>
          <div style={{ marginTop: 18 }}>
            <WordReveal text="اشتراكات رقمية… وخيارات تناسبك" start={44} size={54} weight={500} family={AR_BODY} />
          </div>
        </div>
      </AbsoluteFill>
      {/* url pill */}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 70 }}>
        <div style={{ opacity: lerp(lf, 60, 75, 0, 1), fontFamily: EN, fontWeight: 600, fontSize: 40, color: '#fff', padding: '14px 40px', borderRadius: 99, background: 'rgba(124,58,237,0.25)', border: `2px solid ${C.neon}`, boxShadow: `0 0 30px ${C.purple}` }}>
          🔒 lufy.store
        </div>
      </AbsoluteFill>
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};
// phone content for S3 needs 2 cuts (skip the page-transition flash in the recording): handled in Ad.tsx via PhoneScreenSwitch

/* ------------------------------------------------------------------ S4: HULK (450–720) */
const Carousel: React.FC<{ items: typeof HULK; focus: number; enter: number[]; lf: number; cardW: number; y: number }> = ({ items, focus, enter, lf, cardW, y }) => (
  <AbsoluteFill style={{ perspective: 1800 }}>
    {items
      .map((p, i) => {
        const d = i - focus; // relative position
        const e = lerp(lf, enter[i], enter[i] + 22, 0, 1);
        const x = 540 + d * 300;
        const z = -Math.abs(d) * 380;
        const ry = -d * 28;
        const hl = Math.max(0, 1 - Math.abs(d) * 1.6);
        return { p, i, d, e, x, z, ry, hl };
      })
      .sort((a, b) => Math.abs(b.d) - Math.abs(a.d))
      .map(({ p, i, e, x, z, ry, hl }) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: x - cardW / 2,
            top: y,
            transform: `translate3d(${(1 - e) * 260}px, ${(1 - e) * 260}px, ${z - (1 - e) * 900}px) rotateY(${ry + (1 - e) * -70}deg) rotateZ(${(1 - e) * 12}deg)`,
            opacity: e,
          }}
        >
          <ProductCard p={p} width={cardW} highlight={hl} />
        </div>
      ))}
  </AbsoluteFill>
);

export const S4Hulk: React.FC = () => {
  const lf = useCurrentFrame(); // 0 = 15.0s
  const move = lerp(lf, 0, 60, 0, 1, easeInOut);
  const focus = interpolate(lf, [70, 120, 135, 175, 190, 240], [0, 0, 1, 1, 2, 2], { ...clamp, easing: easeInOut });
  const phoneOut = lerp(lf, 55, 80, 0, 1);
  const heading = lerp(lf, 10, 30, 0, 1);
  return (
    <AbsoluteFill>
      <LuxBg />
      {/* phone keeps playing the real HULK category page, then the cards come OUT of it */}
      <AbsoluteFill style={{ perspective: 1600 }}>
        <div
          style={{
            position: 'absolute',
            left: 540 - 280,
            top: 470,
            transform: `translate(${move * 0}px, ${move * 30}px) scale(${1 - move * 0.12 - phoneOut * 0.3}) rotateY(${-4 + move * -14}deg) rotateX(4deg)`,
            opacity: 1 - phoneOut * 0.85,
            filter: `blur(${phoneOut * 8}px)`,
          }}
        >
          <Phone width={520} screen={{ kind: 'video', src: 'rec/mobile_browse_hq.mp4', startFrom: Math.round(6.0 * FPS) }} />
        </div>
      </AbsoluteFill>
      {lf >= 40 && <Particles progress={lerp(lf, 40, 90, 0, 1)} count={70} cy={1100} seed="s4" spread={700} size={0.8} />}
      {lf >= 45 && <Carousel items={HULK} focus={focus} enter={[45, 60, 75]} lf={lf} cardW={500} y={640} />}
      <AbsoluteFill style={{ alignItems: 'center', paddingTop: 170 }}>
        <div style={{ opacity: heading, transform: `translateY(${(1 - heading) * 30}px)`, textAlign: 'center' }}>
          <div style={{ fontFamily: AR_HEAD, fontWeight: 700, fontSize: 82, color: '#fff', direction: 'rtl', textShadow: `0 0 30px ${C.purple}` }}>
            اشتراكات هولك <span style={{ fontFamily: EN, fontWeight: 800, color: C.neon }}>HULK</span>
          </div>
          <div style={{ marginTop: 14, fontFamily: AR_BODY, fontWeight: 500, fontSize: 46, color: '#e9dcff', direction: 'rtl' }}>
            3 أشهر · 6 أشهر · 12 شهر
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 150 }}>
        <div style={{ opacity: lerp(lf, 100, 116, 0, 1), fontFamily: AR_HEAD, fontWeight: 700, fontSize: 60, color: C.gold, direction: 'rtl', textShadow: '0 0 20px rgba(231,194,122,0.6)' }}>
          اختر المدة اللي تناسبك
        </div>
      </AbsoluteFill>
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ S5: ALQadi 4K (720–990) */
export const S5AlQadi: React.FC = () => {
  const lf = useCurrentFrame(); // 0 = 24.0s
  // match-cut: the focused HULK card flips into the first ALQadi card
  const flip = lerp(lf, 0, 22, 0, 1, easeInOut);
  const tvOn = interpolate(lf, [12, 18, 30], [0, 1, 1], clamp);
  const tvIn = lerp(lf, 8, 40, 0, 1);
  const focus = interpolate(lf, [60, 95, 110, 140, 155], [-1, 0, 1, 1, 2], { ...clamp, easing: easeInOut });
  const cardsOut = lerp(lf, 165, 190, 0, 1, easeInOut);
  const phoneIn = lerp(lf, 168, 200, 0, 1);
  return (
    <AbsoluteFill>
      <LuxBg hue={-12} />
      {/* luxury TV with a generic entertainment UI (ad-designed, no third-party content) */}
      <AbsoluteFill style={{ alignItems: 'center', paddingTop: 330, perspective: 1400 }}>
        <div style={{ transform: `translateY(${(1 - tvIn) * -80 - cardsOut * 160}px) scale(${0.9 + tvIn * 0.1}) rotateX(${(1 - tvIn) * 20}deg)`, opacity: tvIn * (1 - cardsOut * 0.7) }}>
          <div style={{ filter: `brightness(${tvOn})`, transform: `scaleY(${interpolate(lf, [12, 16], [0.02, 1], clamp)})` }}>
            <LuxTV width={960} />
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: 'center', paddingTop: 140 }}>
        <div style={{ opacity: lerp(lf, 30, 48, 0, 1), textAlign: 'center', transform: `translateY(${-cardsOut * 40}px)` }}>
          <div style={{ fontFamily: EN, fontWeight: 800, fontSize: 92, color: '#fff', letterSpacing: 2, textShadow: `0 0 30px ${C.purple}` }}>
            ALQadi <span style={{ color: C.gold }}>4K</span>
          </div>
        </div>
      </AbsoluteFill>
      {/* flipping card (match cut) */}
      {lf < 24 && (
        <AbsoluteFill style={{ perspective: 1800 }}>
          <div style={{ position: 'absolute', left: 290, top: 640, transform: `rotateY(${flip * 180}deg) scale(${1 - flip * 0.3})`, transformStyle: 'preserve-3d' }}>
            <div style={{ backfaceVisibility: 'hidden' }}>
              <ProductCard p={HULK[2]} width={500} highlight={1} />
            </div>
            <div style={{ position: 'absolute', top: 0, left: 0, transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
              <ProductCard p={ALQADI[0]} width={500} highlight={1} />
            </div>
          </div>
        </AbsoluteFill>
      )}
      {lf >= 22 && (
        <AbsoluteFill style={{ transform: `translateY(${cardsOut * -300}px) scale(${1 - cardsOut * 0.3})`, opacity: 1 - cardsOut }}>
          <Carousel items={ALQADI} focus={Math.max(0, focus)} enter={[22, 40, 58]} lf={lf} cardW={430} y={880} />
        </AbsoluteFill>
      )}
      {/* real ALQadi 15-month product page in a phone */}
      {lf >= 165 && (
        <AbsoluteFill style={{ perspective: 1600 }}>
          <div style={{ position: 'absolute', left: 540 - 265, top: 470, transform: `translateY(${(1 - phoneIn) * 1300}px) rotateX(${(1 - phoneIn) * 25 + 3}deg) rotateY(-5deg)` }}>
            <Phone width={500} screen={{ kind: 'scroll', src: 'store/products/alqadi_15_page.png', imgW: 1290, imgH: 6810, from: 300, to: 1250, at: [195, 265] }} />
          </div>
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 110 }}>
        <div style={{ opacity: lerp(lf, 70, 90, 0, 1) }}>
          <div style={{ fontFamily: AR_HEAD, fontWeight: 700, fontSize: 58, color: '#fff', direction: 'rtl', padding: '16px 40px', borderRadius: 24, background: 'rgba(10,4,20,0.65)', border: `2px solid ${C.neon}66`, textShadow: `0 0 20px ${C.purple}` }}>
            شوف المدة والتفاصيل واختر باقتك
          </div>
        </div>
      </AbsoluteFill>
      <Flash at={12} dur={5} color={C.purpleLight} max={0.4} />
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ S6: Snap Lufy Plus (990–1140) */
export const S6Snap: React.FC<{ pageH: number; scrollTo: number }> = ({ pageH, scrollTo }) => {
  const lf = useCurrentFrame(); // 0 = 33.0s
  const whip = interpolate(lf, [0, 8], [1, 0], { ...clamp, easing: ease });
  const t = lerp(lf, 14, 32, 0, 1);
  return (
    <AbsoluteFill>
      <LuxBg hue={8} />
      <AbsoluteFill style={{ transform: `translateX(${whip * 900}px)`, filter: `blur(${whip * 20}px)` }}>
        <AbsoluteFill style={{ perspective: 1600 }}>
          <div style={{ position: 'absolute', left: 540 - 245, top: 470, transform: `rotateY(${6 - lf * 0.06}deg) rotateX(3deg) scale(${0.94 + lerp(lf, 4, 40, 0, 1) * 0.06})` }}>
            <div style={{ position: 'relative', width: 490, height: 870, borderRadius: 34, overflow: 'hidden', border: `2px solid ${C.neon}aa`, boxShadow: `0 0 70px rgba(124,58,237,0.6), 0 40px 90px rgba(0,0,0,0.7)` }}>
              <Img src={staticFile('store/products/snap_plus.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <AbsoluteFill style={{ background: `linear-gradient(115deg, rgba(255,255,255,0.16), rgba(255,255,255,0) 35%)` }} />
              <div style={{ position: 'absolute', top: 0, bottom: 0, width: 120, left: `${-30 + lerp(lf, 30, 70, 0, 1) * 130}%`, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)', transform: 'skewX(-18deg)' }} />
            </div>
          </div>
        </AbsoluteFill>
        <AbsoluteFill style={{ alignItems: 'center', paddingTop: 150 }}>
          <div style={{ opacity: t, transform: `translateY(${(1 - t) * 30}px)`, textAlign: 'center', direction: 'rtl' }}>
            <div style={{ fontFamily: AR_HEAD, fontWeight: 700, fontSize: 84, color: '#fff', textShadow: `0 0 30px ${C.purple}` }}>سناب لوفي بلس — سنة</div>
            <div style={{ marginTop: 10, fontFamily: AR_BODY, fontWeight: 700, fontSize: 52, color: C.gold }}>
              <span style={{ fontFamily: EN, fontWeight: 800 }}>49</span> ر.س
            </div>
          </div>
        </AbsoluteFill>
        {/* eligibility condition — exactly as the store states it, always readable */}
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 120 }}>
          <div
            style={{
              opacity: lerp(lf, 22, 36, 0, 1),
              fontFamily: AR_HEAD,
              fontWeight: 700,
              fontSize: 50,
              color: '#fff',
              direction: 'rtl',
              padding: '20px 44px',
              borderRadius: 22,
              background: 'rgba(8,3,16,0.88)',
              border: `3px solid ${C.gold}`,
              boxShadow: '0 0 30px rgba(231,194,122,0.35)',
            }}
          >
            لأول اشتراك فقط — تُطبق شروط الأهلية
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ S7: real store browsing (1140–1380) */
export const S7Browse: React.FC = () => {
  const lf = useCurrentFrame(); // 0 = 38.0s
  const intro = lerp(lf, 0, 26, 0, 1);
  const orbit = interpolate(lf, [0, 240], [10, -6], clamp);
  const push = interpolate(lf, [190, 240], [0, 1], { ...clamp, easing: easeInOut });
  const steps = ['ادخل المتجر', 'شوف الباقات', 'قارن التفاصيل'];
  const stepAt = [46, 78, 111];
  const callout = lerp(lf, 196, 208, 0, 1);
  return (
    <AbsoluteFill>
      <LuxBg intensity={0.9} />
      <AbsoluteFill style={{ perspective: 1800 }}>
        <div style={{ position: 'absolute', inset: 0, transform: `rotateY(${orbit}deg) scale(${1 + push * 0.32}) translate(${-push * 150}px, ${-push * 330}px)`, transformStyle: 'preserve-3d' }}>
          {/* laptop: real desktop browsing (home -> ALQadi category -> 15-month product) */}
          <div style={{ position: 'absolute', left: 540 - 450, top: 230, transform: `translateZ(-200px) translateY(${(1 - intro) * -200}px)`, opacity: intro }}>
            <Laptop width={880} screen={{ kind: 'video', src: 'rec/desktop_browse.mp4', startFrom: 0, rate: 2.3 }} />
          </div>
          {/* phone: real mobile browsing (HULK category -> 12-month product -> details -> order button location) */}
          <div style={{ position: 'absolute', left: 520, top: 760, transform: `translateZ(120px) translateY(${(1 - intro) * 900}px) rotateY(-10deg)` }}>
            <Phone width={430} screen={{ kind: 'video', src: 'rec/mobile_browse_hq.mp4', startFrom: Math.round(8.0 * FPS), rate: 1.42 }}>
              {callout > 0 && (
                <div style={{ position: 'absolute', left: 6, right: 6, bottom: 8, height: 64, border: `4px solid ${C.gold}`, borderRadius: 20, opacity: callout, boxShadow: `0 0 30px ${C.gold}` }} />
              )}
            </Phone>
          </div>
        </div>
      </AbsoluteFill>
      {/* step chips */}
      <AbsoluteFill style={{ paddingTop: 900, paddingRight: 60, alignItems: 'flex-end', opacity: 1 - push }}>
        {steps.map((s, i) => {
          const p = lerp(lf, stepAt[i], stepAt[i] + 14, 0, 1);
          return (
            <div key={s} style={{ marginBottom: 26, opacity: p, transform: `translateX(${(1 - p) * -60}px)`, display: 'flex', direction: 'rtl', alignItems: 'center', gap: 18, position: 'absolute', left: 50, top: 930 + i * 150 }}>
              <div style={{ width: 74, height: 74, borderRadius: 37, background: `linear-gradient(135deg, ${C.purple}, ${C.purpleDark})`, color: '#fff', fontFamily: EN, fontWeight: 800, fontSize: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 24px ${C.purple}` }}>
                {i + 1}
              </div>
              <div style={{ fontFamily: AR_HEAD, fontWeight: 700, fontSize: 50, color: '#fff', textShadow: '0 2px 12px #000' }}>{s}</div>
            </div>
          );
        })}
      </AbsoluteFill>
      {callout > 0 && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 110 }}>
          <div style={{ opacity: callout, fontFamily: AR_HEAD, fontWeight: 700, fontSize: 52, color: '#1a0f00', direction: 'rtl', padding: '14px 40px', borderRadius: 99, background: `linear-gradient(90deg, ${C.gold}, #f6dea6, ${C.gold})` }}>
            وزر الطلب هنا… لما تقرر
          </div>
        </AbsoluteFill>
      )}
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ S8: montage (1380–1530) */
const MONTAGE: { src: string; kind: 'img' | 'page'; y?: number }[] = [
  { src: 'stills/stadium_freeze.jpg', kind: 'img' },
  { src: 'store/home_mobile_full.png', kind: 'page', y: 0 },
  { src: 'store/products/hulk_12.jpg', kind: 'img' },
  { src: 'store/products/alqadi_15.jpg', kind: 'img' },
  { src: 'store/products/snap_plus.jpg', kind: 'img' },
  { src: 'store/products/hulk_12_page.png', kind: 'page', y: 1650 },
  { src: 'store/products/alqadi_2dev.jpg', kind: 'img' },
  { src: 'store/hulk_mobile_full.png', kind: 'page', y: 250 },
];
export const S8Montage: React.FC = () => {
  const lf = useCurrentFrame(); // 0 = 46.0s
  const cut = 11;
  const idx = Math.min(MONTAGE.length - 1, Math.floor(lf / cut));
  const local = lf - idx * cut;
  const m = MONTAGE[idx];
  const punch = 1.15 - Math.min(1, local / cut) * 0.12;
  const finalP = lerp(lf, 88, 100, 0, 1);
  const words = [
    { t: 'تصفّح', a: 9, b: 41 },
    { t: 'قارن', a: 42, b: 68 },
    { t: 'اختر', a: 69, b: 90 },
  ];
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      <AbsoluteFill style={{ filter: `blur(${4 + finalP * 14}px) brightness(${0.55 - finalP * 0.2})`, transform: `scale(${punch}) rotate(${(random(`mr${idx}`) - 0.5) * 4}deg)` }}>
        {m.kind === 'img' ? (
          <Img src={staticFile(m.src)} style={{ position: 'absolute', height: 1920, left: '50%', transform: 'translateX(-50%)', objectFit: 'cover' }} />
        ) : (
          <Img src={staticFile(m.src)} style={{ position: 'absolute', width: 1080, top: -(m.y ?? 0) * (1080 / 1290) }} />
        )}
        <AbsoluteFill style={{ background: 'rgba(60,15,120,0.35)', mixBlendMode: 'multiply' }} />
      </AbsoluteFill>
      {new Array(MONTAGE.length).fill(0).map((_, i) => <Flash key={i} at={i * cut} dur={4} max={0.45} />)}
      {words.map((w) => {
        if (lf < w.a || lf > w.b) return null;
        const p = lerp(lf, w.a, w.a + 6, 0, 1);
        return (
          <AbsoluteFill key={w.t} style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Headline size={210} style={{ transform: `scale(${1.5 - p * 0.5})`, opacity: p, WebkitTextStroke: '2px rgba(255,255,255,0.4)' }}>{w.t}</Headline>
          </AbsoluteFill>
        );
      })}
      {lf >= 90 && (
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: '0 40px' }}>
          <WordReveal text="اشتراكك القادم يبدأ من" start={90} stagger={4} size={82} />
          <div style={{ height: 10 }} />
          <WordReveal text="لوفي ستور." start={106} stagger={5} size={118} glow={C.neon} />
        </AbsoluteFill>
      )}
      <Vignette strength={0.85} />
      <Grain opacity={0.12} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ S9: logo reveal + CTA (1530–1650) */
export const S9Outro: React.FC = () => {
  const lf = useCurrentFrame(); // 0 = 51.0s
  const lines = lerp(lf, 0, 20, 0, 1);
  const logo = lerp(lf, 14, 34, 0, 1);
  const sweep = interpolate(lf, [26, 50], [-1, 1.4], clamp);
  const tag = lerp(lf, 34, 48, 0, 1);
  const btn = lerp(lf, 52, 64, 0, 1);
  const url = lerp(lf, 66, 78, 0, 1);
  const btnPulse = 1 + Math.max(0, Math.sin((lf - 64) / 6)) * 0.03 * (lf > 64 ? 1 : 0);
  return (
    <AbsoluteFill style={{ background: C.black }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 38%, rgba(124,58,237,${0.55 * logo}), rgba(0,0,0,0) 55%)` }} />
      <Bokeh count={18} seed="o" />
      {/* converging light lines */}
      <svg width={1080} height={1920} style={{ position: 'absolute' }}>
        {new Array(14).fill(0).map((_, i) => {
          const a = (i / 14) * Math.PI * 2 + 0.3;
          const R0 = 1300, R1 = 330;
          const r = R0 + (R1 - R0) * lines;
          const len = 260 * (1 - lines * 0.6);
          const x1 = 540 + Math.cos(a) * r, y1 = 740 + Math.sin(a) * r;
          const x2 = 540 + Math.cos(a) * (r + len), y2 = 740 + Math.sin(a) * (r + len);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={i % 4 === 0 ? C.gold : C.neon} strokeWidth={5} strokeLinecap="round" opacity={(1 - logo) * 0.9} style={{ filter: `drop-shadow(0 0 10px ${C.neon})` }} />;
        })}
        <circle cx={540} cy={740} r={335} fill="none" stroke={C.neon} strokeWidth={4} strokeDasharray={2 * Math.PI * 335} strokeDashoffset={2 * Math.PI * 335 * (1 - lerp(lf, 6, 30, 0, 1))} style={{ filter: `drop-shadow(0 0 16px ${C.purpleLight})` }} />
      </svg>
      <AbsoluteFill style={{ alignItems: 'center', paddingTop: 740 - 320 }}>
        <div style={{ position: 'relative', transform: `scale(${0.7 + logo * 0.3})`, opacity: logo, filter: `drop-shadow(0 0 ${40 * logo}px ${C.purple})` }}>
          <LogoImg size={640} />
          {/* light sweep */}
          <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden', mixBlendMode: 'screen' }}>
            <div style={{ position: 'absolute', top: 0, bottom: 0, width: 160, left: `${50 + sweep * 50}%`, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)', transform: 'skewX(-20deg)' }} />
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: 'center', paddingTop: 1130 }}>
        <div style={{ opacity: tag, transform: `translateY(${(1 - tag) * 30}px)` }}>
          <Headline size={74}>لا تفوّت اللحظة… اختر اشتراكك!</Headline>
        </div>
        <div
          style={{
            marginTop: 54,
            opacity: btn,
            transform: `scale(${(0.6 + btn * 0.4) * btnPulse})`,
            fontFamily: AR_HEAD,
            fontWeight: 700,
            fontSize: 64,
            color: '#241400',
            direction: 'rtl',
            padding: '28px 76px',
            borderRadius: 99,
            background: `linear-gradient(180deg, #f8e3ad, ${C.gold} 45%, ${C.goldDeep})`,
            boxShadow: `0 0 50px rgba(231,194,122,0.55), inset 0 2px 0 rgba(255,255,255,0.7), 0 18px 40px rgba(0,0,0,0.6)`,
          }}
        >
          تصفح الاشتراكات الآن
        </div>
        <div style={{ marginTop: 56, opacity: url, fontFamily: EN, fontWeight: 700, fontSize: 64, letterSpacing: 3, color: '#fff', textShadow: `0 0 24px ${C.purple}` }}>lufy.store</div>
      </AbsoluteFill>
      <Flash at={18} dur={8} color={C.purpleLight} max={0.55} />
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};
