// Abu Kayan v3 · concept A v2 — «الكل يرسل لك عروض… أبو كيان يسألك عنك» (60 s, 9:16, no faces).
// Everything happens inside a phone chat UI drawn in the logo palette (navy / copper / cream).
import React from 'react';
import { AbsoluteFill, Img, interpolate, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { ArchWipe, B, BrandBg, clamp, COPPER_GRAD, DIN, ease, easeInOut, Glint, Grain, Lockup, Mark, PLEX, s } from './brand';

export const V3A_DURATION = s(60);

/* ---------------- timeline (seconds) ---------------- */
export const T = {
  hook: 0,
  flood: 5,
  freeze: 15,
  wipe: 19,
  abu: 24,
  offer: 36,
  split: 50,
  cta: 55,
};

/* ---------------- phone ---------------- */
const PW = 700;
const PH = 1440;
const PX = (1080 - PW) / 2;
const PY = 400;
const SCREEN_BG = '#0E1A2E';

const Phone: React.FC<{ children: React.ReactNode; shake?: number; dim?: number; scale?: number; style?: React.CSSProperties }> = ({ children, shake = 0, dim = 0, scale = 1, style }) => {
  const f = useCurrentFrame();
  const dx = shake * Math.sin(f * 2.7) * 9;
  const rot = shake * Math.sin(f * 3.3) * 0.7;
  return (
    <div style={{ position: 'absolute', left: PX, top: PY, width: PW, height: PH, transform: `translateX(${dx}px) rotate(${rot}deg) scale(${scale})`, ...style }}>
      <div style={{ position: 'absolute', inset: -16, borderRadius: 96, background: '#050A14', boxShadow: `0 0 0 2px ${B.copper}55, 0 50px 120px rgba(0,0,0,0.6)` }} />
      <div style={{ position: 'absolute', inset: 0, borderRadius: 80, overflow: 'hidden', background: SCREEN_BG, direction: 'rtl' }}>
        {children}
        <div style={{ position: 'absolute', inset: 0, background: '#050A14', opacity: dim, pointerEvents: 'none' }} />
      </div>
      {/* dynamic island */}
      <div style={{ position: 'absolute', top: 20, left: PW / 2 - 90, width: 180, height: 50, borderRadius: 25, background: '#000' }} />
    </div>
  );
};

const StatusBar: React.FC = () => (
  <div style={{ position: 'absolute', top: 26, left: 56, right: 56, display: 'flex', justifyContent: 'space-between', direction: 'ltr', fontFamily: DIN, fontWeight: 700, fontSize: 30, color: B.cream }}>
    <span>9:41</span>
    <span style={{ letterSpacing: 4, fontSize: 24 }}>▮▮▮ 5G ▭</span>
  </div>
);

/* ---------------- small helpers ---------------- */
const pIn = (f: number, at: number, dur = 10) => interpolate(f, [at, at + dur], [0, 1], { ...clamp, easing: ease });

/** Height grows from 0 (grid 0fr → 1fr trick), so the bottom-anchored chat scrolls smoothly. */
const Grow: React.FC<{ at: number; dur?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ at, dur = 9, children, style }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = pIn(f, at, dur);
  return (
    <div style={{ display: 'grid', gridTemplateRows: `${p}fr`, ...style }}>
      <div style={{ minHeight: 0, overflow: 'hidden' }}>
        <div style={{ opacity: p, transform: `translateY(${(1 - p) * 30}px) scale(${0.94 + 0.06 * p})` }}>{children}</div>
      </div>
    </div>
  );
};

/* ---------------- caption (VO text on screen) ---------------- */
const Caption: React.FC<{ lines: { at: number; text: React.ReactNode; color?: string }[]; out?: number; top?: number; size?: number }> = ({ lines, out, top = 150, size = 60 }) => {
  const f = useCurrentFrame();
  const o = out !== undefined ? interpolate(f, [out - 8, out], [1, 0], clamp) : 1;
  return (
    <div style={{ position: 'absolute', top, left: 50, right: 50, direction: 'rtl', textAlign: 'center', opacity: o }}>
      {lines.map((l, i) => {
        const p = pIn(f, l.at, 12);
        if (f < l.at) return null;
        return (
          <div key={i} style={{ fontFamily: DIN, fontWeight: 700, fontSize: size, lineHeight: 1.3, color: l.color ?? B.cream, opacity: p, transform: `translateY(${(1 - p) * 18}px)`, clipPath: `inset(-30% 0 -30% ${(1 - p) * 100}%)` }}>
            {l.text}
          </div>
        );
      })}
    </div>
  );
};
const Cu: React.FC<{ children: React.ReactNode }> = ({ children }) => <span style={{ color: B.copperLight }}>{children}</span>;

/* ================= 1) HOOK — the phone won't stop (0–5 s) ================= */
const NOTIFS = [
  ['أبو فهد | عقارات', '🔥 عرض خاص!'],
  ['مكتب الدار العقاري', 'شقة لقطة لا تفوتك'],
  ['سامي - وسيط', 'آخر فرصة اليوم!'],
  ['عقارات الشمال', 'عندي لك شقة 👌'],
  ['أبو ماجد', 'سعر حصري لك بس'],
  ['وسيط عقاري', 'شقة 5 غرف 🔥 تبيها؟'],
  ['مكتب الريان', 'متى تبي تشوفها؟ أنا جاهز'],
  ['أبو فهد | عقارات', 'رد علي ضروري 🙏'],
];
export const NOTIF_AT = NOTIFS.map((_, i) => 8 + i * 11); // frames (also used by the mix)

const Avatar: React.FC<{ letter?: string; size?: number; brand?: boolean; hue?: number }> = ({ letter, size = 72, brand, hue = 0 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      flex: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: brand ? B.navyDeep : `hsl(${215 + hue}, 18%, ${34 + (hue % 3) * 4}%)`,
      border: brand ? `3px solid ${B.copper}` : 'none',
      fontFamily: DIN,
      fontWeight: 700,
      fontSize: size * 0.42,
      color: B.cream,
    }}
  >
    {brand ? <Mark width={size * 0.56} id={`av${size}`} /> : letter}
  </div>
);

const LockScreen: React.FC = () => {
  const f = useCurrentFrame();
  const shown = NOTIF_AT.filter((a) => f >= a).length;
  const countP = interpolate(f, [s(2.9), s(4.2)], [0, 38], { ...clamp, easing: ease });
  const badge = pIn(f, s(2.9), 10);
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(120% 70% at 50% 0%, ${B.navyLight} 0%, ${SCREEN_BG} 60%)` }} />
      <StatusBar />
      <div style={{ position: 'absolute', top: 120, width: '100%', textAlign: 'center', fontFamily: DIN, color: B.cream }}>
        <div style={{ fontSize: 34, fontWeight: 500, opacity: 0.8 }}>الثلاثاء، 17 نوفمبر</div>
        <div style={{ fontSize: 170, fontWeight: 300, lineHeight: 1.05, direction: 'ltr' }}>9:41</div>
      </div>
      <div style={{ position: 'absolute', top: 400, left: 28, right: 28, display: 'flex', flexDirection: 'column-reverse', justifyContent: 'flex-end' }}>
        {NOTIFS.slice(0, shown).map(([who, msg], i) => {
          const p = pIn(f, NOTIF_AT[i], 8);
          return (
            <div key={i} style={{ display: 'grid', gridTemplateRows: `${p}fr` }}>
              <div style={{ minHeight: 0, overflow: 'hidden' }}>
                <div
                  style={{
                    marginBottom: 14,
                    padding: '20px 24px',
                    borderRadius: 34,
                    background: 'rgba(243,236,226,0.13)',
                    border: '1px solid rgba(243,236,226,0.12)',
                    display: 'flex',
                    gap: 18,
                    alignItems: 'center',
                    transform: `translateY(${(1 - p) * -40}px) scale(${0.92 + 0.08 * p})`,
                    opacity: p,
                  }}
                >
                  <div style={{ width: 62, height: 62, borderRadius: 16, background: '#2E8B57', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, flex: 'none' }}>💬</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: DIN, fontSize: 28, fontWeight: 700, color: B.cream }}>
                      <span>{who}</span>
                      <span style={{ fontWeight: 400, fontSize: 22, opacity: 0.6 }}>الآن</span>
                    </div>
                    <div style={{ fontFamily: DIN, fontSize: 30, color: B.cream, opacity: 0.9, whiteSpace: 'nowrap' }}>{msg}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* counter */}
      {badge > 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: 70,
            left: '50%',
            transform: `translateX(-50%) scale(${0.6 + 0.4 * badge})`,
            opacity: badge,
            padding: '18px 40px',
            borderRadius: 50,
            background: COPPER_GRAD,
            fontFamily: DIN,
            fontWeight: 900,
            fontSize: 44,
            color: B.navyDeep,
            whiteSpace: 'nowrap',
            boxShadow: '0 16px 50px rgba(0,0,0,0.5)',
          }}
        >
          {Math.round(countP)} محادثة جديدة
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ================= 2) FLOOD — broker chats (5–15 s) ================= */
const ChatHeader: React.FC<{ name: string; sub?: string; brand?: boolean; hue?: number; badge?: number }> = ({ name, sub = 'متصل الآن', brand, hue = 0, badge }) => (
  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 210, background: brand ? B.navyDeep : '#13223A', borderBottom: `1px solid ${brand ? B.copper + '66' : 'rgba(255,255,255,0.06)'}` }}>
    <StatusBar />
    <div style={{ position: 'absolute', top: 92, right: 26, left: 26, display: 'flex', alignItems: 'center', gap: 18 }}>
      <span style={{ fontSize: 44, color: B.cream, opacity: 0.8, fontFamily: DIN }}>›</span>
      {badge !== undefined && <span style={{ fontFamily: DIN, fontSize: 24, fontWeight: 700, color: B.navyDeep, background: B.copper, borderRadius: 20, padding: '2px 12px' }}>{badge}</span>}
      <Avatar letter={name[0]} size={84} brand={brand} hue={hue} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: DIN, fontWeight: 700, fontSize: brand ? 32 : 36, color: B.cream, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 10 }}>
          {name}
          {brand && <span style={{ width: 30, height: 30, borderRadius: '50%', background: B.copper, color: B.navyDeep, fontSize: 20, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>✓</span>}
        </div>
        <div style={{ fontFamily: PLEX, fontSize: 24, color: brand ? B.copperLight : '#7FD1A4' }}>{sub}</div>
      </div>
    </div>
  </div>
);

const ChatBody: React.FC<{ children: React.ReactNode; brand?: boolean }> = ({ children, brand }) => (
  <div style={{ position: 'absolute', top: 210, left: 0, right: 0, bottom: 0, overflow: 'hidden', background: brand ? `linear-gradient(180deg, ${B.navy} 0%, ${SCREEN_BG} 100%)` : '#0C1626' }}>
    <div style={{ position: 'absolute', left: 24, right: 24, bottom: 120, display: 'flex', flexDirection: 'column', gap: 0 }}>{children}</div>
    {/* composer */}
    <div style={{ position: 'absolute', left: 20, right: 20, bottom: 30, height: 74, borderRadius: 37, background: 'rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', padding: '0 28px', fontFamily: PLEX, fontSize: 26, color: 'rgba(243,236,226,0.4)' }}>
      اكتب رسالة…
    </div>
  </div>
);

const Bubble: React.FC<{ children: React.ReactNode; out?: boolean; brand?: boolean; time?: string; style?: React.CSSProperties }> = ({ children, out, brand, time = '9:41', style }) => (
  <div style={{ display: 'flex', justifyContent: out ? 'flex-end' : 'flex-start', marginTop: 14 }}>
    <div
      style={{
        maxWidth: '86%',
        padding: '16px 22px 12px',
        borderRadius: 30,
        borderTopRightRadius: out ? 30 : 8,
        borderTopLeftRadius: out ? 8 : 30,
        background: out ? B.copperDark : brand ? B.navyLight : '#1E2D45',
        border: brand ? `1.5px solid ${B.copper}88` : 'none',
        fontFamily: DIN,
        fontSize: 34,
        lineHeight: 1.4,
        color: B.cream,
        ...style,
      }}
    >
      {children}
      <div style={{ fontFamily: PLEX, fontSize: 18, opacity: 0.55, textAlign: 'left', direction: 'ltr', marginTop: 2 }}>{time}{out ? ' ✓✓' : ''}</div>
    </div>
  </div>
);

const PHOTOS = ['kitchen_a', 'kitchen_b', 'living_b', 'kitchen_a', 'living_a', 'kitchen_b'];
const PhotoMsg: React.FC<{ i: number }> = ({ i }) => (
  <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 10 }}>
    <div style={{ width: 380, height: 210, borderRadius: 24, overflow: 'hidden', border: '6px solid #1E2D45', position: 'relative' }}>
      <Img src={staticFile(`img/${PHOTOS[i]}.jpg`)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `50% ${30 + i * 8}%`, filter: 'saturate(0.8) blur(1px)' }} />
      <span style={{ position: 'absolute', bottom: 8, left: 12, fontFamily: PLEX, fontSize: 20, color: '#fff', direction: 'ltr' }}>{i + 1}/6</span>
    </div>
  </div>
);

const Voice: React.FC<{ len: string; seed: number }> = ({ len, seed }) => (
  <Bubble>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, direction: 'ltr', width: 440 }}>
      <span style={{ fontSize: 36 }}>▶</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1, height: 50 }}>
        {Array.from({ length: 34 }).map((_, k) => (
          <div key={k} style={{ width: 5, borderRadius: 3, background: B.cream, opacity: 0.7, height: 8 + Math.abs(Math.sin(k * 1.7 + seed) * 38) }} />
        ))}
      </div>
      <span style={{ fontFamily: PLEX, fontSize: 26 }}>{len}</span>
    </div>
  </Bubble>
);

type Chat = { name: string; hue: number; badge: number; body: (f: number) => React.ReactNode };
const CH = s(2); // each broker chat lasts 2 s
const CHATS: Chat[] = [
  { name: 'أبو فهد | عقارات', hue: 0, badge: 12, body: () => [0, 1, 2, 3, 4, 5].map((i) => <Grow key={i} at={4 + i * 8} dur={6}><PhotoMsg i={i} /></Grow>) },
  {
    name: 'سامي - وسيط',
    hue: 40,
    badge: 9,
    body: () => (
      <>
        <Grow at={3}><Bubble>اسمع الفويس للآخر 👇</Bubble></Grow>
        <Grow at={12}><Voice len="2:47" seed={1} /></Grow>
        <Grow at={34}><Voice len="1:58" seed={4} /></Grow>
      </>
    ),
  },
  {
    name: 'مكتب الدار العقاري',
    hue: 80,
    badge: 7,
    body: () => (
      <>
        <Grow at={3}><Bubble>الشقة اللي كلمتك عنها…</Bubble></Grow>
        <Grow at={14}><Bubble style={{ fontWeight: 700 }}>فيه زبون ثاني عليها، قرر بسرعة! ⏰</Bubble></Grow>
        <Grow at={36}><Bubble>⏰⏰⏰</Bubble></Grow>
      </>
    ),
  },
  {
    name: 'أبو ماجد',
    hue: 120,
    badge: 5,
    body: () => (
      <>
        <Grow at={3}><Bubble>أبشرك لقيت لك شي 🔥</Bubble></Grow>
        <Grow at={16}><Bubble style={{ fontWeight: 700 }}>السعر لك بس 😉</Bubble></Grow>
        <Grow at={36}><Bubble>لا تقول لأحد</Bubble></Grow>
      </>
    ),
  },
  {
    name: 'عقارات الشمال',
    hue: 160,
    badge: 14,
    body: () => (
      <>
        <Grow at={3}><Bubble>وينك؟ 📞📞</Bubble></Grow>
        <Grow at={14}><Bubble style={{ fontWeight: 700 }}>تعال الحين أنا تحت العمارة</Bubble></Grow>
        <Grow at={32}>
          <Bubble>
            <div style={{ width: 400, height: 150, borderRadius: 18, background: 'repeating-linear-gradient(35deg,#24364f 0 14px,#1c2c43 14px 28px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>📍 موقع مباشر</div>
          </Bubble>
        </Grow>
      </>
    ),
  },
];

const BrokerChat: React.FC<{ c: Chat }> = ({ c }) => (
  <AbsoluteFill>
    <ChatBody>{c.body(0)}</ChatBody>
    <ChatHeader name={c.name} hue={c.hue} badge={c.badge} />
  </AbsoluteFill>
);

const Flood: React.FC = () => {
  const f = useCurrentFrame();
  const idx = Math.min(CHATS.length - 1, Math.floor(f / CH));
  const local = f - idx * CH;
  // fast RTL slide between chats
  const slide = idx > 0 ? interpolate(local, [0, 7], [-PW, 0], { ...clamp, easing: ease }) : 0;
  return (
    <AbsoluteFill>
      {idx > 0 && slide !== 0 && (
        <div style={{ position: 'absolute', inset: 0, transform: `translateX(${slide + PW}px)` }}>
          <Sequence from={(idx - 1) * CH} layout="none">
            <BrokerChat c={CHATS[idx - 1]} />
          </Sequence>
        </div>
      )}
      <div style={{ position: 'absolute', inset: 0, transform: `translateX(${slide}px)` }}>
        <Sequence from={idx * CH} layout="none">
          <BrokerChat c={CHATS[idx]} />
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};
export const CHAT_CUTS = CHATS.map((_, i) => s(T.flood) + i * CH);

/* ================= 3) FREEZE — "but nobody asked you" (15–19 s) ================= */
const FreezeText: React.FC = () => {
  const f = useCurrentFrame();
  const bg = interpolate(f, [0, 8], [0, 0.88], clamp);
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', inset: 0, background: B.navyDeep, opacity: bg }} />
      <div style={{ position: 'absolute', top: 700, left: 60, right: 60, textAlign: 'center', direction: 'rtl', fontFamily: DIN }}>
        {f >= 14 && <div style={{ fontSize: 76, fontWeight: 500, color: B.cream, opacity: pIn(f, 14, 14) }}>بس…</div>}
        {f >= 36 && <div style={{ fontSize: 76, fontWeight: 700, color: B.cream, opacity: pIn(f, 36, 14), marginTop: 20 }}>ولا واحد سألك:</div>}
        {f >= 70 && (
          <div style={{ fontSize: 132, fontWeight: 900, marginTop: 40, background: COPPER_GRAD, WebkitBackgroundClip: 'text', color: 'transparent', opacity: pIn(f, 70, 12), transform: `scale(${1.15 - 0.15 * pIn(f, 70, 14)})` }}>
            أنت وش تبي؟
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

/* ================= 4) WIPE — only one chat survives (19–24 s) ================= */
const LIST = [
  ['أبو فهد | عقارات', '📷 6 صور', 12],
  ['سامي - وسيط', '🎤 2:47', 9],
  ['مكتب الدار العقاري', 'فيه زبون ثاني عليها…', 7],
  ['أبو كيان للخدمات العقارية', 'هلا وغلا 🌿 قبل ما أرسل لك أي عرض…', 1],
  ['أبو ماجد', 'السعر لك بس 😉', 5],
  ['عقارات الشمال', 'تعال الحين أنا تحت العمارة', 14],
  ['مكتب الريان', 'متى تبي تشوفها؟', 6],
  ['وسيط عقاري', 'شقة 5 غرف 🔥', 8],
] as const;
const ABU_ROW = 3;
const DEL_ORDER = [0, 7, 1, 6, 2, 5, 4];
export const WIPE_AT = DEL_ORDER.map((_, k) => 22 + k * 8); // local frames of each deletion

const ChatList: React.FC = () => {
  const f = useCurrentFrame();
  const glow = pIn(f, 22 + 7 * 8 + 6, 16);
  return (
    <AbsoluteFill>
      <StatusBar />
      <div style={{ position: 'absolute', top: 100, right: 36, fontFamily: DIN, fontWeight: 900, fontSize: 56, color: B.cream }}>المحادثات</div>
      <div style={{ position: 'absolute', top: 190, left: 24, right: 24, display: 'flex', flexDirection: 'column' }}>
        {LIST.map(([name, prev, n], i) => {
          const k = DEL_ORDER.indexOf(i);
          const at = k >= 0 ? WIPE_AT[k] : 1e9;
          const x = interpolate(f, [at, at + 8], [0, -760], { ...clamp, easing: easeInOut });
          const h = interpolate(f, [at + 5, at + 12], [1, 0], { ...clamp, easing: easeInOut });
          const isAbu = i === ABU_ROW;
          return (
            <div key={i} style={{ display: 'grid', gridTemplateRows: `${h}fr` }}>
              <div style={{ minHeight: 0, overflow: 'hidden' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 20,
                    padding: '18px 16px',
                    margin: '4px 0',
                    borderRadius: 28,
                    transform: `translateX(${x}px)`,
                    background: isAbu ? `rgba(199,146,109,${0.08 + 0.14 * glow})` : 'transparent',
                    border: isAbu ? `2px solid rgba(199,146,109,${0.3 + 0.7 * glow})` : '2px solid transparent',
                    boxShadow: isAbu ? `0 0 ${60 * glow}px rgba(199,146,109,${0.45 * glow})` : 'none',
                  }}
                >
                  <Avatar letter={name[0]} size={92} brand={isAbu} hue={i * 37} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: DIN, fontWeight: 700, fontSize: isAbu ? 31 : 34, color: isAbu ? B.copperLight : B.cream, whiteSpace: 'nowrap' }}>{name}</div>
                    <div style={{ fontFamily: PLEX, fontSize: 25, color: 'rgba(243,236,226,0.6)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{prev}</div>
                  </div>
                  <div style={{ minWidth: 46, height: 46, borderRadius: 23, background: isAbu ? B.copper : '#2E8B57', color: isAbu ? B.navyDeep : '#fff', fontFamily: DIN, fontWeight: 700, fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{n}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ================= 5+6) ABU KAYAN CHAT (24–50 s) ================= */
const Typing: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const f = useCurrentFrame();
  if (f < from || f >= to) return null;
  return (
    <Bubble brand time="">
      <div style={{ display: 'flex', gap: 10, padding: '8px 4px' }}>
        {[0, 1, 2].map((k) => (
          <div key={k} style={{ width: 16, height: 16, borderRadius: 8, background: B.copperLight, opacity: 0.35 + 0.65 * Math.max(0, Math.sin((f - from) * 0.35 - k * 0.9)) }} />
        ))}
      </div>
    </Bubble>
  );
};

const Chip: React.FC<{ icon: string; children: React.ReactNode }> = ({ icon, children }) => (
  <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 12 }}>
    <div style={{ maxWidth: '86%', padding: '16px 26px', borderRadius: 26, border: `2px solid ${B.copper}`, background: 'rgba(199,146,109,0.1)', fontFamily: DIN, fontWeight: 700, fontSize: 31, lineHeight: 1.35, color: B.copperLight, display: 'flex', gap: 14 }}>
      <span>{icon}</span>
      <span>{children}</span>
    </div>
  </div>
);

const FEATURES = [
  ['🏫', 'المدارس', '5 دقايق'],
  ['🕌', 'المسجد', 'مشي'],
  ['🛒', 'الخدمات والسوبرماركت', 'قريبة'],
  ['🌊', 'الكورنيش', '10 دقايق'],
  ['📄', 'الصك والأوراق', 'مضبوطة ✓'],
  ['💰', 'السعر', 'واضح من البداية ✓'],
] as const;

// local frames inside the Abu Kayan chat (starts at T.abu)
const A = {
  typing1: [4, 26],
  msg1: 26,
  chips: [s(4.6), s(6.6), s(8.6)],
  replies: [s(12.3), s(12.9), s(13.5)],
  typing2: [s(14.2), s(15.4)],
  card: s(15.4),
  feat0: s(16.6),
  featStep: s(0.95),
  msg2: s(23.2),
};
export const ABU_EVENTS = { ...A, base: s(T.abu) };

const OfferCard: React.FC = () => {
  const f = useCurrentFrame();
  const sweep = interpolate(f, [A.card + 6, A.card + 40], [-0.3, 1.3], clamp);
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 14 }}>
      <div style={{ width: '90%', borderRadius: 32, padding: 4, background: COPPER_GRAD, boxShadow: '0 20px 60px rgba(0,0,0,0.45)' }}>
        <div style={{ borderRadius: 28, overflow: 'hidden', background: B.navyDeep }}>
          <div style={{ height: 250, position: 'relative', overflow: 'hidden' }}>
            <Img src={staticFile('img/kitchen_a.jpg')} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 42%', transform: `scale(${1.12 - 0.06 * pIn(f, A.card, 60)})` }} />
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(105deg, transparent ${sweep * 100 - 12}%, rgba(255,240,225,0.35) ${sweep * 100}%, transparent ${sweep * 100 + 12}%)` }} />
            <div style={{ position: 'absolute', top: 16, right: 16, padding: '6px 18px', borderRadius: 18, background: COPPER_GRAD, fontFamily: DIN, fontWeight: 700, fontSize: 24, color: B.navyDeep }}>على مقاس طلبك</div>
          </div>
          <div style={{ padding: '18px 26px 10px' }}>
            <div style={{ fontFamily: DIN, fontWeight: 900, fontSize: 36, color: B.cream }}>شقة 4 غرف · شمال جدة</div>
            <div style={{ height: 2, background: COPPER_GRAD, opacity: 0.6, margin: '12px 0 4px' }} />
            {FEATURES.map(([ic, k, v], i) => (
              <Grow key={i} at={A.feat0 + i * A.featStep} dur={8}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '9px 0', fontFamily: DIN, fontSize: 29, color: B.cream, borderBottom: i < 5 ? '1px solid rgba(199,146,109,0.18)' : 'none' }}>
                  <span style={{ fontSize: 30 }}>{ic}</span>
                  <span style={{ flex: 1, opacity: 0.85 }}>{k}</span>
                  <span style={{ fontWeight: 700, color: B.copperLight }}>{v}</span>
                </div>
              </Grow>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AbuChat: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <ChatBody brand>
        <Typing from={A.typing1[0]} to={A.typing1[1]} />
        <Grow at={A.msg1}>
          <Bubble brand>
            هلا وغلا 🌿 قبل ما أرسل لك أي عرض…
            <br />
            <b style={{ color: B.copperLight }}>قلّي وش البيت اللي في بالك؟</b>
          </Bubble>
        </Grow>
        <Grow at={A.chips[0]}><Chip icon="📍">وش الحي اللي في بالك؟</Chip></Grow>
        <Grow at={A.chips[1]}><Chip icon="💰">كم ميزانيتك؟</Chip></Grow>
        <Grow at={A.chips[2]}><Chip icon="⭐">وش أهم شي عندك: الهدوء، الإطلالة، ولا قرب الخدمات؟</Chip></Grow>
        <Grow at={A.replies[0]}><Bubble out>📍 شمال جدة</Bubble></Grow>
        <Grow at={A.replies[1]}><Bubble out>💰 حدود 900 ألف</Bubble></Grow>
        <Grow at={A.replies[2]}><Bubble out>⭐ الهدوء وقرب المدارس</Bubble></Grow>
        <Typing from={A.typing2[0]} to={A.typing2[1]} />
        <Grow at={A.card} dur={12}><OfferCard /></Grow>
        <Grow at={A.msg2}>
          <Bubble brand>
            هذي على مقاس طلبك بالضبط 👌
            <br />
            متى يناسبك نشوفها؟
          </Bubble>
        </Grow>
      </ChatBody>
      <ChatHeader name="أبو كيان للخدمات العقارية" brand sub={f >= A.typing1[0] && f < A.typing1[1] || f >= A.typing2[0] && f < A.typing2[1] ? 'يكتب…' : 'متصل الآن'} />
    </AbsoluteFill>
  );
};

/* ================= 7) SPLIT + the line (50–55 s) ================= */
const Split: React.FC = () => {
  const f = useCurrentFrame();
  const l = pIn(f, 4, 14);
  const r = pIn(f, 14, 14);
  return (
    <AbsoluteFill>
      <BrandBg />
      {/* divider */}
      <div style={{ position: 'absolute', left: 539, top: 230, width: 2, height: 880 * pIn(f, 0, 18), background: COPPER_GRAD }} />
      {/* left: 38 chats, all offers (placed on the left half; Arabic reads right-to-left so the "one chat" sits first on the right) */}
      <div style={{ position: 'absolute', left: 40, top: 230, width: 460, opacity: l, direction: 'rtl' }}>
        <div style={{ height: 690, overflow: 'hidden', position: 'relative', maskImage: 'linear-gradient(180deg,#000 60%,transparent)', WebkitMaskImage: 'linear-gradient(180deg,#000 60%,transparent)' }}>
          <div style={{ transform: `translateY(${-f * 6}px)` }}>
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 6px', opacity: 0.55, filter: 'saturate(0.3)' }}>
                <Avatar letter={LIST[i % 8][0][0]} size={58} hue={i * 37} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: DIN, fontWeight: 700, fontSize: 24, color: B.cream, whiteSpace: 'nowrap' }}>{['🔥 عرض خاص!', 'لقطة لا تفوتك', 'آخر فرصة!', 'سعر حصري'][i % 4]}</div>
                  <div style={{ height: 10, width: `${50 + (i * 23) % 40}%`, borderRadius: 5, background: 'rgba(243,236,226,0.25)', marginTop: 6 }} />
                </div>
                <div style={{ width: 34, height: 34, borderRadius: 17, background: '#2E8B57', fontFamily: DIN, fontSize: 18, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{(i * 7) % 13 + 1}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'center', fontFamily: DIN, color: B.slate, marginTop: 10 }}>
          <div style={{ fontSize: 96, fontWeight: 900, lineHeight: 1 }}>38</div>
          <div style={{ fontSize: 38, fontWeight: 700 }}>محادثة… كلها عروض</div>
        </div>
      </div>
      {/* right: one chat, tailored */}
      <div style={{ position: 'absolute', left: 580, top: 230, width: 460, opacity: r, transform: `translateY(${(1 - r) * 30}px)`, direction: 'rtl' }}>
        <div style={{ height: 690, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', padding: '26px 20px', borderRadius: 30, border: `3px solid ${B.copper}`, background: 'rgba(199,146,109,0.12)', boxShadow: `0 0 60px rgba(199,146,109,0.35)`, display: 'flex', alignItems: 'center', gap: 16 }}>
            <Avatar brand size={96} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: DIN, fontWeight: 900, fontSize: 36, color: B.copperLight }}>أبو كيان</div>
              <div style={{ fontFamily: PLEX, fontSize: 24, color: B.cream, opacity: 0.8 }}>وش البيت اللي في بالك؟</div>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', fontFamily: DIN, color: B.copperLight, marginTop: 10 }}>
          <div style={{ fontSize: 96, fontWeight: 900, lineHeight: 1 }}>1</div>
          <div style={{ fontSize: 38, fontWeight: 700 }}>محادثة… على مقاسك</div>
        </div>
      </div>
      {/* the line */}
      <div style={{ position: 'absolute', top: 1280, left: 40, right: 40, textAlign: 'center', direction: 'rtl', fontFamily: DIN }}>
        {f >= s(1.0) && <div style={{ fontSize: 74, fontWeight: 700, color: B.cream, opacity: pIn(f, s(1.0), 12) }}>الكل يبي يبيعك شقة.</div>}
        {f >= s(2.65) && (
          <div style={{ fontSize: 86, fontWeight: 900, marginTop: 24, background: COPPER_GRAD, WebkitBackgroundClip: 'text', color: 'transparent', opacity: pIn(f, s(2.65), 12), transform: `scale(${1.1 - 0.1 * pIn(f, s(2.65), 14)})` }}>
            أبو كيان يبيك تلقى بيتك.
          </div>
        )}
      </div>
      <Glint at={s(2.95)} x={880} y={1440} size={150} />
    </AbsoluteFill>
  );
};

/* ================= 8) CTA (55–60 s) ================= */
const CTA: React.FC = () => {
  const f = useCurrentFrame();
  const lock = interpolate(f, [0, 40], [0, 1], clamp);
  const shine = interpolate(f, [42, 72], [-0.2, 1.2], clamp);
  const rows = pIn(f, 34, 14);
  const btn = pIn(f, 50, 14);
  const pulse = 1 + 0.035 * Math.sin(Math.max(0, f - 64) * 0.28);
  return (
    <AbsoluteFill>
      <BrandBg />
      <div style={{ position: 'absolute', top: 300, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Lockup markW={320} p={lock} shine={shine} nameSize={80} id="cta" />
      </div>
      <div style={{ position: 'absolute', top: 1050, width: '100%', textAlign: 'center', fontFamily: DIN, color: B.cream, opacity: rows, transform: `translateY(${(1 - rows) * 20}px)` }}>
        <div style={{ fontSize: 64, fontWeight: 700, direction: 'ltr' }}>📞 0565005633</div>
        <div style={{ fontSize: 40, fontWeight: 500, marginTop: 18, color: B.copperLight, direction: 'ltr' }}>✉️ ulwaqedi@gmail.com</div>
      </div>
      <div style={{ position: 'absolute', top: 1330, width: '100%', display: 'flex', justifyContent: 'center', opacity: btn }}>
        <div style={{ padding: '30px 80px', borderRadius: 60, background: COPPER_GRAD, fontFamily: DIN, fontWeight: 900, fontSize: 62, color: B.navyDeep, transform: `scale(${(0.8 + 0.2 * btn) * pulse})`, boxShadow: '0 24px 70px rgba(199,146,109,0.35)', direction: 'rtl' }}>
          أرسل طلبك الآن
        </div>
      </div>
      {f >= 98 && <div style={{ position: 'absolute', top: 1520, width: '100%', textAlign: 'center', fontFamily: DIN, fontWeight: 700, fontSize: 46, color: B.cream, opacity: pIn(f, 98, 12), direction: 'rtl' }}>…وبتلاقي طلبك 🌿</div>}
    </AbsoluteFill>
  );
};

/* ================= assembly ================= */
const Seg: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => (
  <Sequence from={s(from)} durationInFrames={s(to) - s(from)}>
    {children}
  </Sequence>
);

export const AbuKayanV3A: React.FC = () => {
  const f = useCurrentFrame();
  // phone vibrates as notifications land
  const hookShake = NOTIF_AT.reduce((m, a) => Math.max(m, interpolate(f, [a, a + 2, a + 9], [0, 1, 0], clamp)), 0);
  const phoneIn = interpolate(f, [0, 14], [1.25, 1], { ...clamp, easing: ease });
  return (
    <AbsoluteFill style={{ background: B.navyDeep }}>
      <BrandBg />

      {/* 1 hook */}
      <Seg from={T.hook} to={T.flood}>
        <Phone shake={hookShake} scale={phoneIn}>
          <LockScreen />
        </Phone>
        <Caption lines={[{ at: 6, text: <>من أول ما قلت إنك تدوّر شقة في <Cu>جدة</Cu>…</> }, { at: s(2.9), text: <>جوالك ما سكت!</> }]} />
      </Seg>

      {/* 2 flood */}
      <Seg from={T.flood} to={T.freeze}>
        <Phone>
          <Flood />
        </Phone>
        <Caption
          lines={[
            { at: 4, text: 'الكل يرسل عروض…' },
            { at: s(3.3), text: 'الكل مستعجل…' },
            { at: s(6.6), text: <>والكل عنده <Cu>«لقطة»</Cu>.</> },
          ]}
          size={56}
          top={110}
        />
      </Seg>

      {/* 3 freeze: last broker chat frozen + grayscale, then the question */}
      <Seg from={T.freeze} to={T.wipe}>
        <Phone dim={0.35} style={{ filter: 'grayscale(1)' }}>
          <Sequence from={-CH} layout="none">
            <BrokerChat c={CHATS[CHATS.length - 1]} />
          </Sequence>
        </Phone>
        <FreezeText />
      </Seg>

      {/* 4 wipe: chat list, everyone deleted except Abu Kayan */}
      <Seg from={T.wipe} to={T.abu}>
        <Phone>
          <ChatList />
        </Phone>
        <Caption lines={[{ at: s(2.3), text: <><Cu>إلا واحد.</Cu></> }]} size={84} top={170} />
      </Seg>

      {/* 5+6 Abu Kayan chat */}
      <Seg from={T.abu} to={T.split}>
        <Phone>
          <AbuChat />
        </Phone>
        <Caption lines={[{ at: 6, text: 'أبو كيان ما يبدأ بعرض…' }, { at: s(2.4), text: <Cu>يبدأ بطلبك أنت.</Cu> }]} out={s(11.6)} />
        <Sequence from={s(12)}>
          <Caption lines={[{ at: 4, text: 'وبعدها يجيك العرض' }, { at: s(1.1), text: <Cu>مفصّل على مقاسك</Cu> }]} out={s(7.2)} />
        </Sequence>
        <Sequence from={s(19.4)}>
          <Caption lines={[{ at: 4, text: 'كل شي واضح…' }, { at: s(1.1), text: <Cu>قبل ما تطلع أي مشوار</Cu> }]} />
        </Sequence>
      </Seg>

      {/* 7 split + line */}
      <Seg from={T.split} to={T.cta}>
        <Split />
      </Seg>

      {/* 8 CTA */}
      <Seg from={T.cta} to={60}>
        <CTA />
      </Seg>

      <ArchWipe cut={s(T.split)} />
      <ArchWipe cut={s(T.cta)} />
      {/* soft flash on the freeze cut */}
      <div style={{ position: 'absolute', inset: 0, background: '#fff', opacity: interpolate(f, [s(T.freeze), s(T.freeze) + 1, s(T.freeze) + 6], [0, 0.35, 0], clamp), pointerEvents: 'none' }} />
      <Grain amount={0.04} />
    </AbsoluteFill>
  );
};
