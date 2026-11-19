import React from 'react';
import { AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, random, staticFile, useCurrentFrame } from 'remotion';
import '@fontsource/ibm-plex-sans-arabic/500.css';
import '@fontsource/ibm-plex-sans-arabic/700.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import './fonts';
import { AR_HEAD, C, EN, Grain, Headline, Particles, Vignette, clamp, ease, easeInOut, lerp, shake } from './fx';

export const DURATION = 540; // 18 s @ 30 fps
const PURPLE = '#7C3AED';
const PRICE = 69;
const DISCOUNTED = (PRICE * 0.9).toFixed(2); // 62.10 — LUFY10 = 10% (verified active in the store)

// Phone screen inside hand.jpg (detected on the 2x image, mapped to 1080x1920)
const SCR = { x: 159, y: 135, w: 762, h: 1561, r: 58 };

const Flash: React.FC<{ at: number; dur?: number; color?: string; max?: number }> = ({ at, dur = 6, color = '#fff', max = 0.7 }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: color, opacity: interpolate(f, [at, at + 1, at + dur], [0, max, 0], clamp), mixBlendMode: 'screen', pointerEvents: 'none' }} />;
};

/** Content shown on the hand-held phone's screen. */
const ScreenContent: React.FC = () => {
  const f = useCurrentFrame();
  const wake = interpolate(f, [30, 42], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {/* S1: black -> purple #7C3AED, sleepy hook */}
      {f < 105 && (
        <AbsoluteFill style={{ background: PURPLE, opacity: wake, justifyContent: 'center', alignItems: 'center' }}>
          <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 35%, rgba(255,255,255,0.25), rgba(0,0,0,0) 55%)' }} />
          <div style={{ fontSize: 210, transform: `translateY(${Math.sin(f / 9) * 10}px) rotate(${Math.sin(f / 14) * 6}deg)` }}>😴</div>
          {['Z', 'z', 'z'].map((z, i) => {
            const t = ((f - 34 - i * 10) % 50) / 50;
            if (f < 34 + i * 10) return null;
            return (
              <div key={i} style={{ position: 'absolute', left: 470 + t * 120, top: 470 - t * 260, fontFamily: EN, fontWeight: 800, fontSize: 70 - i * 12, color: '#fff', opacity: 1 - t }}>
                {z}
              </div>
            );
          })}
          <div style={{ position: 'absolute', bottom: 330, width: '100%', opacity: lerp(f, 38, 50, 0, 1), transform: `translateY(${(1 - lerp(f, 38, 50, 0, 1)) * 30}px)` }}>
            <Headline size={84} weight={800} glow="#2a0b5e">ويكند بدون</Headline>
            <Headline size={84} weight={800} glow="#2a0b5e">اشتراك؟</Headline>
          </div>
        </AbsoluteFill>
      )}
      {/* S2: real browsing — home -> ALQadi -> 6 months (69 SAR) -> add to cart (rec 0–6.43 s @1.17x, pre-cut) */}
      <Sequence from={105} durationInFrames={165} layout="none">
        <OffthreadVideo muted src={staticFile('rec/seg_browse.mp4')} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
      </Sequence>
      {/* S3: real 'added to cart' sheet -> cart page (69 SAR) (rec 6.43 s–end @0.894x, pre-cut) */}
      <Sequence from={270} durationInFrames={166} layout="none">
        <OffthreadVideo muted src={staticFile('rec/seg_cart.mp4')} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
      </Sequence>
      {/* glass reflection */}
      <AbsoluteFill style={{ background: 'linear-gradient(120deg, rgba(255,255,255,0.10), rgba(255,255,255,0) 32%)' }} />
    </AbsoluteFill>
  );
};

const HandPhone: React.FC = () => {
  const f = useCurrentFrame();
  // camera: slow push in S1, pull back for headline room in S2/S3, dive into the screen at the end
  const s = f < 105 ? interpolate(f, [0, 105], [1.06, 1.0], clamp) : f < 420 ? interpolate(f, [105, 125], [1.0, 0.8], { ...clamp, easing: ease }) : interpolate(f, [420, 436], [0.8, 3.2], { ...clamp, easing: (t) => t * t });
  const ty = f < 105 ? 0 : f < 420 ? interpolate(f, [105, 125], [0, 150], { ...clamp, easing: ease }) : interpolate(f, [420, 436], [150, 0], clamp);
  return (
    <AbsoluteFill style={{ transform: `${shake(f, 105, 8, 12)} translateY(${ty}px) scale(${s})`, transformOrigin: '50% 50%' }}>
      <Img src={staticFile('img/hand.jpg')} style={{ width: 1080, height: 1920 }} />
      <div style={{ position: 'absolute', left: SCR.x, top: SCR.y, width: SCR.w, height: SCR.h, borderRadius: SCR.r, overflow: 'hidden' }}>
        <ScreenContent />
      </div>
    </AbsoluteFill>
  );
};

/** Coupon motion graphic (not a screen recording): types LUFY10 and shows the 10% maths. */
const CouponCard: React.FC = () => {
  const f = useCurrentFrame();
  const inP = lerp(f, 276, 290, 0, 1);
  const code = 'LUFY10';
  const typed = code.slice(0, Math.max(0, Math.min(code.length, Math.floor((f - 292) / 4))));
  const applied = f >= 320;
  const res = lerp(f, 326, 336, 0, 1);
  const btnPress = f >= 316 && f < 322 ? 0.92 : 1;
  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 150 }}>
      <div style={{ width: 900, transform: `translateY(${(1 - inP) * 500}px)`, opacity: inP, borderRadius: 40, padding: '30px 40px 34px', background: 'rgba(16,6,32,0.92)', border: `2px solid ${C.neon}`, boxShadow: `0 0 60px rgba(124,58,237,0.6), 0 30px 70px rgba(0,0,0,0.6)`, direction: 'rtl' }}>
        <div style={{ fontFamily: AR_HEAD, fontWeight: 700, fontSize: 44, color: '#d9c8ff', marginBottom: 18 }}>🎁 كود الخصم</div>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          <div style={{ flex: 1, height: 110, borderRadius: 24, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', direction: 'ltr', padding: '0 30px', fontFamily: EN, fontWeight: 800, fontSize: 64, color: '#1b0b36', letterSpacing: 6, boxShadow: applied ? `0 0 0 5px ${C.gold}` : 'none' }}>
            {typed}
            {!applied && <span style={{ opacity: Math.floor(f / 8) % 2 ? 1 : 0, color: PURPLE }}>|</span>}
          </div>
          <div style={{ transform: `scale(${btnPress})`, height: 110, padding: '0 40px', borderRadius: 24, background: applied ? C.gold : PURPLE, display: 'flex', alignItems: 'center', fontFamily: AR_HEAD, fontWeight: 800, fontSize: 50, color: applied ? '#2a1600' : '#fff' }}>
            {applied ? '✓ تم' : 'تطبيق'}
          </div>
        </div>
        {applied && (
          <div style={{ marginTop: 26, display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: res, transform: `translateY(${(1 - res) * 20}px)` }}>
            <div style={{ fontFamily: AR_HEAD, fontWeight: 800, fontSize: 54, color: C.gold }}>خصم 10%</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 22, direction: 'rtl' }}>
              <span style={{ fontFamily: EN, fontWeight: 700, fontSize: 52, color: '#9b8cc0', textDecoration: 'line-through' }}>{PRICE}</span>
              <span style={{ fontFamily: EN, fontWeight: 800, fontSize: 84, color: '#fff' }}>{DISCOUNTED}</span>
              <span style={{ fontFamily: AR_HEAD, fontWeight: 700, fontSize: 40, color: '#fff' }}>ر.س</span>
            </div>
          </div>
        )}
        <div style={{ marginTop: 16, fontFamily: AR_HEAD, fontWeight: 500, fontSize: 30, color: '#b9a8e6' }}>يُدخل الكود في صفحة إتمام الطلب</div>
      </div>
    </AbsoluteFill>
  );
};

const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  const p = lerp(f, 432, 450, 0, 1);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 38%, #9b5cff 0%, ${PURPLE} 35%, #2a0b5e 80%)`, alignItems: 'center', paddingTop: 280 }}>
      <Particles progress={interpolate(f, [432, 540], [0.1, 1], clamp)} count={70} seed="end" spread={1100} cy={700} />
      <div style={{ transform: `scale(${0.7 + p * 0.3})`, opacity: p, filter: 'drop-shadow(0 0 50px rgba(0,0,0,0.45))' }}>
        <Img src={staticFile('brand/lufy_logo.png')} style={{ width: 520, height: 520, borderRadius: '50%' }} />
      </div>
      <div style={{ marginTop: 46, opacity: lerp(f, 444, 456, 0, 1), transform: `translateY(${(1 - lerp(f, 444, 456, 0, 1)) * 30}px)` }}>
        <Headline size={76} weight={800} glow="#1a0640">التفعيل سريع + دعم واتساب</Headline>
      </div>
      <div style={{ marginTop: 40, opacity: lerp(f, 462, 474, 0, 1), transform: `scale(${interpolate(f, [462, 468, 474], [0.6, 1.08, 1], clamp)})`, display: 'flex', alignItems: 'center', gap: 20, direction: 'rtl', padding: '20px 50px 26px', borderRadius: 99, background: `linear-gradient(180deg, #fbe9b8, ${C.gold} 45%, ${C.goldDeep})`, boxShadow: `0 0 50px rgba(231,194,122,0.7), 0 16px 0 #7a5418` }}>
        <span style={{ fontFamily: AR_HEAD, fontWeight: 800, fontSize: 52, color: '#241400' }}>كود</span>
        <span style={{ fontFamily: EN, fontWeight: 800, fontSize: 66, color: '#241400', letterSpacing: 3 }}>LUFY10</span>
        <span style={{ fontFamily: AR_HEAD, fontWeight: 800, fontSize: 52, color: '#241400' }}>خصم 10%</span>
      </div>
      <div style={{ marginTop: 56, fontFamily: EN, fontWeight: 800, fontSize: 80, letterSpacing: 4, color: '#fff', textShadow: '0 4px 24px rgba(0,0,0,0.4)', opacity: lerp(f, 478, 490, 0, 1) }}>lufy.store</div>
    </AbsoluteFill>
  );
};

/** Always-on disclosure (TikTok AIGC policy): hand shot + narration are AI-generated; this is an ad. */
const Disclosure: React.FC = () => (
  <AbsoluteFill style={{ alignItems: 'center', pointerEvents: 'none' }}>
    <div style={{ marginTop: 118, display: 'flex', alignItems: 'center', gap: 14, direction: 'rtl', padding: '8px 26px 12px', borderRadius: 99, background: 'rgba(0,0,0,0.62)', border: '1.5px solid rgba(255,255,255,0.35)', fontFamily: AR_HEAD, fontWeight: 700, fontSize: 27, color: '#fff' }}>
      <span style={{ fontFamily: EN, fontWeight: 800, fontSize: 22, padding: '2px 10px', borderRadius: 8, background: '#fff', color: '#111' }}>AI</span>
      مشهد اليد والتعليق الصوتي مولّدان بالذكاء الاصطناعي · إعلان
    </div>
  </AbsoluteFill>
);

export const WeekendAd: React.FC = () => {
  const f = useCurrentFrame();
  const head2 = lerp(f, 108, 122, 0, 1);
  const priceSlam = interpolate(f, [190, 196, 200], [0, 1.25, 1], clamp);
  const head3 = lerp(f, 272, 284, 0, 1);
  return (
    <AbsoluteFill style={{ background: '#000' }}>
      {f < 436 && <HandPhone />}
      {f >= 105 && f < 436 && <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(10,3,24,0.85) 0%, rgba(10,3,24,0) 22%)' }} />}
      {/* S2 headline: القاضي 4K — 6 أشهر بـ 69 ريال فقط */}
      {f >= 105 && f < 270 && (
        <AbsoluteFill style={{ alignItems: 'center', paddingTop: 196, opacity: head2 * interpolate(f, [262, 270], [1, 0], clamp) }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22, direction: 'rtl' }}>
            <Headline size={78} weight={800}>القاضي</Headline>
            <span style={{ fontFamily: EN, fontWeight: 800, fontSize: 78, color: C.gold }}>4K</span>
            <Headline size={78} weight={800}>— 6 أشهر</Headline>
          </div>
          {f >= 190 && (
            <div style={{ marginTop: 4, transform: `scale(${priceSlam})`, display: 'flex', alignItems: 'baseline', gap: 16, direction: 'rtl', padding: '6px 40px 14px', borderRadius: 30, background: `linear-gradient(180deg, #fbe9b8, ${C.gold} 45%, ${C.goldDeep})`, boxShadow: `0 0 50px rgba(231,194,122,0.7)` }}>
              <span style={{ fontFamily: AR_HEAD, fontWeight: 800, fontSize: 56, color: '#241400' }}>بـ</span>
              <span style={{ fontFamily: EN, fontWeight: 800, fontSize: 104, color: '#241400' }}>{PRICE}</span>
              <span style={{ fontFamily: AR_HEAD, fontWeight: 800, fontSize: 56, color: '#241400' }}>ريال فقط</span>
            </div>
          )}
        </AbsoluteFill>
      )}
      {/* S3 headline + coupon motion graphic */}
      {f >= 270 && f < 432 && (
        <>
          <AbsoluteFill style={{ alignItems: 'center', paddingTop: 200, opacity: head3 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, direction: 'rtl', transform: `scale(${interpolate(f, [272, 278, 284], [1.4, 0.95, 1], clamp)})` }}>
              <Headline size={76} weight={800}>واستخدم كود</Headline>
              <span style={{ fontFamily: EN, fontWeight: 800, fontSize: 80, color: C.gold, textShadow: `0 0 24px ${C.gold}` }}>LUFY10</span>
              <span style={{ fontSize: 76 }}>🎁</span>
            </div>
          </AbsoluteFill>
          <CouponCard />
        </>
      )}
      {f >= 432 && <EndCard />}
      <Flash at={105} dur={6} color={PURPLE} max={0.55} />
      <Flash at={190} dur={5} color={C.gold} max={0.4} />
      <Flash at={326} dur={5} color={C.gold} max={0.45} />
      <Flash at={432} dur={8} color="#ffffff" max={0.7} />
      <Disclosure />
      <Vignette strength={0.55} />
      <Grain opacity={0.07} />
    </AbsoluteFill>
  );
};
