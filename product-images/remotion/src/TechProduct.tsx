import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import '@fontsource/ibm-plex-sans-arabic/500.css';
import '@fontsource/ibm-plex-sans-arabic/700.css';
import '@fontsource/inter/800.css';
import './fonts';
import { AR_HEAD, C, EN } from './fx';

// Product image: "تصميم موقع تعريفي + ربط مع المتاجر + لوحة تحكم" — 2500 SAR (LUFY TECH)
const Chip: React.FC<{ icon: string; text: string }> = ({ icon, text }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, direction: 'rtl', padding: '12px 22px 14px', borderRadius: 22, background: 'rgba(18,7,36,0.82)', border: `2px solid ${C.neon}aa`, boxShadow: '0 0 24px rgba(124,58,237,0.5)' }}>
    <span style={{ fontSize: 30 }}>{icon}</span>
    <span style={{ fontFamily: AR_HEAD, fontWeight: 700, fontSize: 30, color: '#fff' }}>{text}</span>
  </div>
);

export type TechProps = { price: string; badge?: string };
export const TechProduct: React.FC<TechProps> = ({ price, badge }) => (
  <AbsoluteFill style={{ background: '#05010b' }}>
    <AbsoluteFill style={{ background: 'radial-gradient(circle at 50% 52%, rgba(124,58,237,0.35), rgba(5,1,11,0) 60%)' }} />
    {/* full 16:9 art across the middle, edges blended into the background */}
    <Img src={staticFile('tech_art.png')} style={{ position: 'absolute', left: 0, top: 268, width: 1080, height: 608, WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, #000 14%, #000 82%, transparent 100%)', maskImage: 'linear-gradient(180deg, transparent 0%, #000 14%, #000 82%, transparent 100%)' }} />
    {badge && (
      <div style={{ position: 'absolute', bottom: 226, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 5 }}>
        <div style={{ fontFamily: AR_HEAD, fontWeight: 700, fontSize: 44, color: '#fff', direction: 'rtl', padding: '10px 40px 16px', borderRadius: 26, background: `linear-gradient(90deg, ${C.purpleDark}, ${C.purple})`, border: '3px solid rgba(255,255,255,0.85)', boxShadow: '0 0 40px rgba(124,58,237,0.9), 0 14px 30px rgba(0,0,0,0.6)' }}>{badge}</div>
      </div>
    )}
    {/* header: logo + LUFY TECH */}
    <div style={{ position: 'absolute', top: 34, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <Img src={staticFile('lufy_logo.png')} style={{ width: 84, height: 84, borderRadius: '50%', boxShadow: '0 0 24px rgba(124,58,237,0.8)' }} />
      <div style={{ fontFamily: EN, fontWeight: 800, fontSize: 40, letterSpacing: 3, color: '#fff' }}>LUFY <span style={{ color: C.neon }}>TECH</span></div>
    </div>
    {/* headline */}
    <div style={{ position: 'absolute', top: 140, left: 0, right: 0, textAlign: 'center', direction: 'rtl' }}>
      <div style={{ fontFamily: AR_HEAD, fontWeight: 700, fontSize: 84, lineHeight: 1.15, color: '#fff', textShadow: `0 0 24px ${C.purple}, 0 4px 18px rgba(0,0,0,0.8)` }}>تصميم موقع تعريفي</div>
      <div style={{ fontFamily: AR_HEAD, fontWeight: 500, fontSize: 36, color: '#e4d6ff', marginTop: 6, textShadow: '0 2px 12px rgba(0,0,0,0.9)' }}>احترافي ومتجاوب لنشاطك التجاري</div>
    </div>
    {/* features */}
    <div style={{ position: 'absolute', bottom: 140, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 16, direction: 'rtl' }}>
      <Chip icon="🌐" text="موقع تعريفي" />
      <Chip icon="🔗" text="ربط مع المتاجر" />
      <Chip icon="📊" text="لوحة تحكم" />
    </div>
    {/* price */}
    <div style={{ position: 'absolute', bottom: 38, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, direction: 'rtl', padding: '6px 46px 14px', borderRadius: 99, background: `linear-gradient(180deg, #fbe9b8, ${C.gold} 45%, ${C.goldDeep})`, boxShadow: '0 0 40px rgba(231,194,122,0.6)' }}>
        <span style={{ fontFamily: EN, fontWeight: 800, fontSize: 64, color: '#241400' }}>{price}</span>
        <span style={{ fontFamily: AR_HEAD, fontWeight: 700, fontSize: 34, color: '#241400' }}>ريال</span>
      </div>
    </div>
  </AbsoluteFill>
);
