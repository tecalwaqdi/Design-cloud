"use client";
import { useEffect, useMemo, useState } from "react";
import { landmarkOptions, LandmarkScene } from "../art/Landmarks";
import { Logo } from "../art/Logo";
import { Icon, iconKeys } from "../site/Icons";
import { Btn, Card, emptyL, Field, LField, ListEditor, Text, Toggle, uid, Upload, inputCls } from "./ui";
import type { Branch, ContactMessage, Content, Country, GalleryItem, Partner, SectionKey, Service } from "@/lib/types";

export type StatsView = {
  days: { date: string; visits: number }[];
  clicks: { id: string; name: string; flag: string; d30: number; total: number }[];
  visits30: number;
  visitsToday: number;
  clicks30: number;
  unread: number;
};

const TABS = [
  { k: "overview", label: "نظرة عامة", icon: "pulse" },
  { k: "identity", label: "الهوية والواجهة", icon: "sparkle" },
  { k: "countries", label: "الدول والمتاجر", icon: "globe" },
  { k: "about", label: "من نحن والرؤية", icon: "heart" },
  { k: "services", label: "الخدمات", icon: "star" },
  { k: "branches", label: "الفروع", icon: "truck" },
  { k: "partners", label: "الشركاء", icon: "handshake" },
  { k: "gallery", label: "معرض الصور", icon: "flask" },
  { k: "contact", label: "التواصل", icon: "drop" },
  { k: "sections", label: "ترتيب الأقسام", icon: "shield" },
  { k: "seo", label: "SEO والخصوصية", icon: "globe" },
  { k: "messages", label: "الرسائل", icon: "heart" },
  { k: "security", label: "الأمان", icon: "shield" },
] as const;
type Tab = (typeof TABS)[number]["k"];

const sectionNames: Record<SectionKey, string> = {
  countries: "الدول والمتاجر",
  about: "من نحن وقصتنا",
  vision: "الرؤية والرسالة والأهداف",
  services: "الخدمات",
  branches: "الفروع",
  partners: "الشركاء والعملاء",
  gallery: "معرض الصور",
  contact: "تواصل معنا",
};

export function Dashboard({ initial, stats }: { initial: Content; stats: StatsView }) {
  const [tab, setTab] = useState<Tab>("overview");
  const [c, setC] = useState<Content>(initial);
  const [saved, setSaved] = useState<string>(JSON.stringify(initial));
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ ok: boolean; msg: string } | null>(null);
  const [menu, setMenu] = useState(false);
  const dirty = JSON.stringify(c) !== saved;

  useEffect(() => {
    const h = location.hash.slice(1) as Tab;
    if (TABS.some((t) => t.k === h)) setTab(h);
  }, []);
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const set = <K extends keyof Content>(k: K, v: Content[K]) => setC((p) => ({ ...p, [k]: v }));

  async function save() {
    setSaving(true);
    const res = await fetch("/api/admin/content", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(c) }).catch(() => null);
    setSaving(false);
    if (res?.ok) {
      const next = await res.json();
      setC(next);
      setSaved(JSON.stringify(next));
      setToast({ ok: true, msg: "تم الحفظ ونشر التعديلات على الموقع ✓" });
    } else if (res?.status === 401) {
      setToast({ ok: false, msg: "انتهت الجلسة، سجّل الدخول مرة أخرى" });
    } else setToast({ ok: false, msg: "تعذّر الحفظ" });
    setTimeout(() => setToast(null), 3500);
  }

  const go = (k: Tab) => {
    setTab(k);
    history.replaceState(null, "", `#${k}`);
    setMenu(false);
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="bg-ice min-h-screen">
      {/* top bar */}
      <header className="glass sticky top-0 z-40 !border-x-0 !border-t-0">
        <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <button className="rounded-lg border border-ice-300 px-2.5 py-1.5 lg:hidden" onClick={() => setMenu((v) => !v)} aria-label="القائمة">
              ☰
            </button>
            <Logo size="sm" animated={false} name={c.identity.name} />
            <span className="hidden rounded-full bg-navy px-2.5 py-0.5 text-[0.65rem] font-semibold text-gold-light sm:inline">لوحة التحكم</span>
          </div>
          <div className="flex items-center gap-2">
            {dirty && <span className="hidden text-xs text-gold-deep sm:inline">● تعديلات غير محفوظة</span>}
            <a href="/ar" target="_blank" className="hidden rounded-xl border border-ice-300 bg-white px-3 py-2 text-sm text-navy-soft hover:border-gold sm:inline-block">
              معاينة الموقع ↗
            </a>
            <Btn variant="gold" onClick={save} disabled={!dirty || saving}>
              {saving ? "جارٍ الحفظ…" : "حفظ ونشر"}
            </Btn>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1400px] gap-6 px-4 py-6 md:px-6">
        {/* sidebar */}
        <aside className={`${menu ? "fixed inset-x-4 top-20 z-30 block" : "hidden"} lg:sticky lg:top-24 lg:block lg:h-fit lg:w-60 lg:shrink-0`}>
          <nav className="glass rounded-2xl p-2">
            {TABS.map((t) => (
              <button
                key={t.k}
                onClick={() => go(t.k)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm transition ${
                  tab === t.k ? "bg-navy text-white shadow" : "text-navy-soft hover:bg-white"
                }`}
              >
                <Icon name={t.icon} className={`h-4 w-4 ${tab === t.k ? "text-gold-light" : "text-gold"}`} />
                {t.label}
                {t.k === "messages" && stats.unread > 0 && <span className="ms-auto rounded-full bg-gold px-2 text-[0.65rem] text-white">{stats.unread}</span>}
              </button>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 space-y-6">
          {tab === "overview" && <Overview stats={stats} c={c} go={go} />}

          {tab === "identity" && (
            <>
              <Card title="الهوية" desc="الاسم والشعار والألوان تظهر في كل صفحات الموقع.">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="اسم العلامة">
                    <Text ltr value={c.identity.name} onChange={(name) => set("identity", { ...c.identity, name })} />
                  </Field>
                  <Field label="الشعار (اختياري)" hint="اتركه فارغاً لاستخدام الشعار المتحرك (خط النبض). يفضل PNG شفاف أو SVG.">
                    <Upload value={c.identity.logoUrl} onChange={(logoUrl) => set("identity", { ...c.identity, logoUrl })} />
                  </Field>
                </div>
                <LField label="الشعار النصي (Tagline)" value={c.identity.tagline} onChange={(tagline) => set("identity", { ...c.identity, tagline })} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="اللون الذهبي">
                    <ColorInput value={c.identity.gold} onChange={(gold) => set("identity", { ...c.identity, gold })} />
                  </Field>
                  <Field label="اللون الكحلي">
                    <ColorInput value={c.identity.navy} onChange={(navy) => set("identity", { ...c.identity, navy })} />
                  </Field>
                </div>
              </Card>
              <Card title="الواجهة الرئيسية (Hero)">
                <LField label="عبارة الترحيب" value={c.hero.welcome} onChange={(welcome) => set("hero", { ...c.hero, welcome })} />
                <LField label="النص التعريفي" value={c.hero.subtitle} onChange={(subtitle) => set("hero", { ...c.hero, subtitle })} />
                <Field label="صورة البانر (اختياري)" hint="ارفع صورة منتجاتكم الحقيقية (PNG شفاف بعرض 2400px تقريباً). اتركه فارغاً لاستخدام الرسم المتحرك.">
                  <Upload value={c.hero.bannerUrl} onChange={(bannerUrl) => set("hero", { ...c.hero, bannerUrl })} />
                </Field>
              </Card>
            </>
          )}

          {tab === "countries" && (
            <Card title="الدول والمتاجر" desc="كل دولة تظهر كبطاقة في الصفحة الرئيسية. اترك رابط المتجر فارغاً ليظهر زر «قريباً».">
              <ListEditor<Country>
                items={c.countries}
                onChange={(countries) => set("countries", countries)}
                addLabel="إضافة دولة"
                make={() => ({ id: uid(), flag: "KW", name: { ar: "دولة جديدة", en: "New country" }, landmark: emptyL(), art: "generic", storeUrl: "", enabled: true })}
                title={(x) => (
                  <span className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/flags/${x.flag}`} alt="" className="h-4 w-6 rounded-sm object-cover ring-1 ring-ice-300" />
                    {x.name.ar}
                    {!x.enabled && <span className="rounded bg-ice-200 px-1.5 text-[0.65rem] text-mist">مخفية</span>}
                    {x.storeUrl ? <span className="text-[0.65rem] text-green-700">● متجر مفعّل</span> : <span className="text-[0.65rem] text-mist">● قريباً</span>}
                  </span>
                )}
                render={(x, up) => (
                  <div className="grid gap-5 lg:grid-cols-[1fr_220px]">
                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="رمز الدولة (ISO)" hint="حرفان مثل SA، AE، KW، QA، BH، OM، EG">
                          <Text ltr maxLength={2} value={x.flag} onChange={(flag) => up({ flag: flag.toUpperCase() })} />
                        </Field>
                        <Field label="ظاهرة في الموقع">
                          <div className="pt-2">
                            <Toggle checked={x.enabled} onChange={(enabled) => up({ enabled })} label={x.enabled ? "ظاهرة" : "مخفية"} />
                          </div>
                        </Field>
                      </div>
                      <LField label="اسم الدولة" value={x.name} onChange={(name) => up({ name })} />
                      <LField label="المعلم / وصف قصير" value={x.landmark} onChange={(landmark) => up({ landmark })} />
                      <Field label="رابط المتجر" hint="مثال: https://store.salla.sa/… — الزيارات تُحسب تلقائياً وتضاف لها روابط تتبع UTM.">
                        <Text ltr placeholder="https://" value={x.storeUrl} onChange={(storeUrl) => up({ storeUrl })} />
                      </Field>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="الرسم المتحرك للبطاقة">
                          <select className={inputCls} value={x.art} onChange={(e) => up({ art: e.target.value as typeof x.art })}>
                            {landmarkOptions.map((o) => (
                              <option key={o.value} value={o.value}>
                                {o.label}
                              </option>
                            ))}
                          </select>
                        </Field>
                        <Field label="أو صورة / فيديو خاص" hint="يحل محل الرسم المتحرك (MP4 قصير أو صورة)">
                          <Upload accept="image/*,video/mp4,video/webm" value={x.mediaUrl} onChange={(mediaUrl) => up({ mediaUrl })} />
                        </Field>
                      </div>
                    </div>
                    <div className="h-fit overflow-hidden rounded-2xl border border-ice-200 bg-white p-2">
                      <div className="aspect-[4/3] overflow-hidden rounded-xl">
                        {x.mediaUrl ? (
                          /\.(mp4|webm|mov)$/i.test(x.mediaUrl) ? (
                            <video src={x.mediaUrl} className="h-full w-full object-cover" muted autoPlay loop playsInline />
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={x.mediaUrl} alt="" className="h-full w-full object-cover" />
                          )
                        ) : (
                          <LandmarkScene art={x.art} id={`pv-${x.id}`} />
                        )}
                      </div>
                      <p className="mt-2 text-center text-sm font-semibold text-navy">{x.name.ar}</p>
                      <p className="text-center text-xs text-mist">{x.landmark.ar}</p>
                    </div>
                  </div>
                )}
              />
            </Card>
          )}

          {tab === "about" && (
            <>
              <Card title="من نحن">
                <LField label="العنوان" value={c.about.title} onChange={(title) => set("about", { ...c.about, title })} />
                <LField area label="النص التعريفي" value={c.about.body} onChange={(body) => set("about", { ...c.about, body })} />
                <LField area label="قصتنا" value={c.about.story} onChange={(story) => set("about", { ...c.about, story })} />
              </Card>
              <Card title="الرؤية والرسالة والأهداف">
                <LField area rows={3} label="الرؤية" value={c.vision.vision} onChange={(vision) => set("vision", { ...c.vision, vision })} />
                <LField area rows={3} label="الرسالة" value={c.vision.mission} onChange={(mission) => set("vision", { ...c.vision, mission })} />
                <div className="space-y-3">
                  <span className="block text-xs font-semibold text-navy-soft">الأهداف</span>
                  {c.vision.goals.map((g, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="flex-1">
                        <LField label={`هدف ${i + 1}`} value={g} onChange={(v) => set("vision", { ...c.vision, goals: c.vision.goals.map((x, j) => (j === i ? v : x)) })} />
                      </div>
                      <Btn variant="danger" className="mt-6" onClick={() => set("vision", { ...c.vision, goals: c.vision.goals.filter((_, j) => j !== i) })}>
                        حذف
                      </Btn>
                    </div>
                  ))}
                  <Btn className="w-full border-dashed" onClick={() => set("vision", { ...c.vision, goals: [...c.vision.goals, emptyL()] })}>
                    + إضافة هدف
                  </Btn>
                </div>
              </Card>
            </>
          )}

          {tab === "services" && (
            <Card title="الخدمات">
              <ListEditor<Service>
                items={c.services}
                onChange={(services) => set("services", services)}
                addLabel="إضافة خدمة"
                make={() => ({ id: uid(), icon: "sparkle", title: { ar: "خدمة جديدة", en: "New service" }, desc: emptyL() })}
                title={(x) => (
                  <span className="flex items-center gap-2">
                    <Icon name={x.icon} className="h-5 w-5 text-gold" />
                    {x.title.ar}
                  </span>
                )}
                render={(x, up) => (
                  <>
                    <Field label="الأيقونة">
                      <div className="flex flex-wrap gap-2">
                        {iconKeys.map((k) => (
                          <button
                            key={k}
                            type="button"
                            onClick={() => up({ icon: k })}
                            className={`flex h-11 w-11 items-center justify-center rounded-xl border transition ${x.icon === k ? "border-gold bg-gold-pale text-gold-deep" : "border-ice-300 bg-white text-navy-soft"}`}
                          >
                            <Icon name={k} />
                          </button>
                        ))}
                      </div>
                    </Field>
                    <LField label="العنوان" value={x.title} onChange={(title) => up({ title })} />
                    <LField area rows={3} label="الوصف" value={x.desc} onChange={(desc) => up({ desc })} />
                  </>
                )}
              />
            </Card>
          )}

          {tab === "branches" && (
            <Card title="الفروع">
              <ListEditor<Branch>
                items={c.branches}
                onChange={(branches) => set("branches", branches)}
                addLabel="إضافة فرع"
                make={() => ({ id: uid(), flag: "SA", city: { ar: "فرع جديد", en: "New branch" }, address: emptyL(), phone: "", mapUrl: "" })}
                title={(x) => (
                  <span className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/flags/${x.flag}`} alt="" className="h-4 w-6 rounded-sm object-cover" />
                    {x.city.ar}
                  </span>
                )}
                render={(x, up) => (
                  <>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <Field label="رمز الدولة">
                        <Text ltr maxLength={2} value={x.flag} onChange={(flag) => up({ flag: flag.toUpperCase() })} />
                      </Field>
                      <Field label="الهاتف">
                        <Text ltr value={x.phone} onChange={(phone) => up({ phone })} />
                      </Field>
                      <Field label="رابط خرائط Google">
                        <Text ltr placeholder="https://maps.app.goo.gl/…" value={x.mapUrl} onChange={(mapUrl) => up({ mapUrl })} />
                      </Field>
                    </div>
                    <LField label="المدينة" value={x.city} onChange={(city) => up({ city })} />
                    <LField label="العنوان" value={x.address} onChange={(address) => up({ address })} />
                  </>
                )}
              />
            </Card>
          )}

          {tab === "partners" && (
            <Card title="الشركاء والعملاء" desc="تظهر في شريط متحرك. يفضل شعارات PNG شفافة.">
              <ListEditor<Partner>
                items={c.partners}
                onChange={(partners) => set("partners", partners)}
                addLabel="إضافة شريك"
                make={() => ({ id: uid(), name: "Partner" })}
                title={(x) => x.name}
                render={(x, up) => (
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="الاسم">
                      <Text value={x.name} onChange={(name) => up({ name })} />
                    </Field>
                    <Field label="الرابط (اختياري)">
                      <Text ltr value={x.url || ""} onChange={(url) => up({ url })} />
                    </Field>
                    <Field label="الشعار">
                      <Upload value={x.logoUrl} onChange={(logoUrl) => up({ logoUrl })} />
                    </Field>
                  </div>
                )}
              />
            </Card>
          )}

          {tab === "gallery" && (
            <Card title="معرض الصور والأعمال" desc="القسم يختفي تلقائياً من الموقع إذا كان فارغاً.">
              <ListEditor<GalleryItem>
                items={c.gallery}
                onChange={(gallery) => set("gallery", gallery)}
                addLabel="إضافة صورة / فيديو"
                make={() => ({ id: uid(), url: "", caption: emptyL() })}
                title={(x, i) => (
                  <span className="flex items-center gap-3">
                    {x.url && !/\.(mp4|webm|mov)$/i.test(x.url) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={x.url} alt="" className="h-8 w-12 rounded object-cover" />
                    ) : null}
                    {x.caption.ar || `عنصر ${i + 1}`}
                  </span>
                )}
                render={(x, up) => (
                  <>
                    <Upload accept="image/*,video/mp4,video/webm" value={x.url} onChange={(url) => up({ url: url || "" })} />
                    <LField label="الوصف" value={x.caption} onChange={(caption) => up({ caption })} />
                  </>
                )}
              />
            </Card>
          )}

          {tab === "contact" && (
            <Card title="بيانات التواصل">
              <div className="grid gap-4 md:grid-cols-3">
                <Field label="الهاتف">
                  <Text ltr value={c.contact.phone} onChange={(phone) => set("contact", { ...c.contact, phone })} />
                </Field>
                <Field label="واتساب" hint="بالصيغة الدولية مثل 9665xxxxxxxx — يظهر زر عائم">
                  <Text ltr value={c.contact.whatsapp} onChange={(whatsapp) => set("contact", { ...c.contact, whatsapp })} />
                </Field>
                <Field label="البريد الإلكتروني">
                  <Text ltr type="email" value={c.contact.email} onChange={(email) => set("contact", { ...c.contact, email })} />
                </Field>
              </div>
              <LField label="العنوان" value={c.contact.address} onChange={(address) => set("contact", { ...c.contact, address })} />
              <LField label="ساعات العمل" value={c.contact.hours} onChange={(hours) => set("contact", { ...c.contact, hours })} />
              <div className="grid gap-4 md:grid-cols-3">
                {(Object.keys(c.contact.social) as (keyof Content["contact"]["social"])[]).map((k) => (
                  <Field key={k} label={k[0].toUpperCase() + k.slice(1)}>
                    <Text ltr placeholder="https://" value={c.contact.social[k]} onChange={(v) => set("contact", { ...c.contact, social: { ...c.contact.social, [k]: v } })} />
                  </Field>
                ))}
              </div>
            </Card>
          )}

          {tab === "sections" && (
            <Card title="ترتيب الأقسام وإظهارها" desc="رتّب أقسام الصفحة الرئيسية كما تريد، وأخفِ ما لا تحتاجه.">
              <div className="space-y-2">
                {c.sections.map((s, i) => (
                  <div key={s.key} className="flex items-center gap-3 rounded-xl border border-ice-200 bg-white p-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ice-100 text-xs font-bold text-gold-deep">{i + 1}</span>
                    <span className={`flex-1 font-semibold ${s.visible ? "text-navy" : "text-mist line-through"}`}>{sectionNames[s.key]}</span>
                    <Toggle checked={s.visible} onChange={(visible) => set("sections", c.sections.map((x) => (x.key === s.key ? { ...x, visible } : x)))} />
                    <Btn
                      className="!px-2 !py-1"
                      disabled={i === 0}
                      onClick={() => {
                        const n = [...c.sections];
                        [n[i - 1], n[i]] = [n[i], n[i - 1]];
                        set("sections", n);
                      }}
                    >
                      ↑
                    </Btn>
                    <Btn
                      className="!px-2 !py-1"
                      disabled={i === c.sections.length - 1}
                      onClick={() => {
                        const n = [...c.sections];
                        [n[i + 1], n[i]] = [n[i], n[i + 1]];
                        set("sections", n);
                      }}
                    >
                      ↓
                    </Btn>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {tab === "seo" && (
            <>
              <Card title="تحسين الظهور في محركات البحث (SEO)">
                <LField label="عنوان الصفحة" value={c.seo.title} onChange={(title) => set("seo", { ...c.seo, title })} />
                <LField area rows={2} label="الوصف" value={c.seo.description} onChange={(description) => set("seo", { ...c.seo, description })} />
                <Field label="الكلمات المفتاحية" hint="مفصولة بفواصل">
                  <Text value={c.seo.keywords} onChange={(keywords) => set("seo", { ...c.seo, keywords })} />
                </Field>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="صورة المشاركة (Open Graph)" hint="1200×630 تظهر عند مشاركة الرابط">
                    <Upload value={c.seo.ogImage} onChange={(ogImage) => set("seo", { ...c.seo, ogImage })} />
                  </Field>
                  <Field label="Google Analytics ID" hint="مثل G-XXXXXXX (اختياري)">
                    <Text ltr value={c.seo.gaId} onChange={(gaId) => set("seo", { ...c.seo, gaId })} />
                  </Field>
                </div>
              </Card>
              <Card title="سياسة الخصوصية">
                <LField area rows={8} label="النص" value={c.privacy} onChange={(privacy) => set("privacy", privacy)} />
              </Card>
            </>
          )}

          {tab === "messages" && <Messages />}
          {tab === "security" && <Security />}
        </main>
      </div>

      {toast && (
        <div className={`fixed bottom-6 start-1/2 z-50 -translate-x-1/2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-lg rtl:translate-x-1/2 ${toast.ok ? "bg-navy" : "bg-red-700"}`}>{toast.msg}</div>
      )}
    </div>
  );
}

function ColorInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-10 w-14 cursor-pointer rounded-lg border border-ice-300 bg-white p-1" />
      <Text ltr value={value} onChange={onChange} />
    </div>
  );
}

function Overview({ stats, c, go }: { stats: StatsView; c: Content; go: (t: Tab) => void }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...stats.days.map((d) => d.visits));
  const maxClick = Math.max(1, ...stats.clicks.map((x) => x.d30));
  const noStore = c.countries.filter((x) => x.enabled && !x.storeUrl).length;
  const tiles = [
    { label: "زيارات اليوم", value: stats.visitsToday },
    { label: "زيارات آخر ٣٠ يوماً", value: stats.visits30 },
    { label: "نقرات المتاجر (٣٠ يوماً)", value: stats.clicks30 },
    { label: "رسائل جديدة", value: stats.unread },
  ];
  const fmt = (d: string) => new Date(d + "T00:00:00").toLocaleDateString("ar", { day: "numeric", month: "short" });

  return (
    <>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-2xl border border-white bg-white/80 p-5 shadow-[0_10px_30px_-20px_rgba(28,42,63,.35)]">
            <p className="text-xs text-mist">{t.label}</p>
            <p className="mt-2 text-3xl font-bold text-navy tabular-nums">{t.value.toLocaleString("en")}</p>
          </div>
        ))}
      </div>

      {noStore > 0 && (
        <button onClick={() => go("countries")} className="w-full rounded-2xl border border-gold/40 bg-gold-pale/40 p-4 text-start text-sm text-gold-deep">
          ⓘ يوجد {noStore} {noStore === 1 ? "دولة" : "دول"} بدون رابط متجر وتظهر بزر «قريباً». اضغط هنا لإضافة الروابط.
        </button>
      )}

      <div className="grid gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
        <Card title="الزيارات اليومية" desc="آخر ٣٠ يوماً">
          <div>
            <div className="relative" dir="ltr">
              <div className="flex h-44 items-end gap-[2px]" onMouseLeave={() => setHover(null)}>
                {stats.days.map((d, i) => (
                  <div key={d.date} className="group relative flex h-full flex-1 items-end" onMouseEnter={() => setHover(i)}>
                    <div
                      className={`w-full rounded-t-[4px] transition-colors ${hover === i ? "bg-navy" : "bg-gold"}`}
                      style={{ height: `${Math.max(d.visits ? 3 : 0, (d.visits / max) * 100)}%` }}
                    />
                  </div>
                ))}
              </div>
              <div className="h-px bg-ice-300" />
              <div className="mt-1.5 flex justify-between text-[0.65rem] text-mist">
                <span>{fmt(stats.days[0].date)}</span>
                <span>{fmt(stats.days[stats.days.length - 1].date)}</span>
              </div>
              {hover !== null && (
                <div
                  className="pointer-events-none absolute -top-2 rounded-lg bg-navy px-2.5 py-1.5 text-xs text-white shadow-lg"
                  style={{ left: `${((hover + 0.5) / stats.days.length) * 100}%`, transform: "translate(-50%,-100%)" }}
                >
                  <span className="block text-[0.65rem] text-white/70">{fmt(stats.days[hover].date)}</span>
                  <span className="font-bold tabular-nums">{stats.days[hover].visits}</span> زيارة
                </div>
              )}
            </div>
          </div>
        </Card>
        </div>
        <div className="xl:col-span-2">
        <Card title="النقرات على المتاجر" desc="آخر ٣٠ يوماً (والإجمالي)">
          <div className="space-y-3">
            {stats.clicks.map((x) => (
              <div key={x.id} title={`${x.name}: ${x.d30} نقرة خلال ٣٠ يوماً — ${x.total} إجمالاً`}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-navy">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/flags/${x.flag}`} alt="" className="h-3.5 w-5 rounded-sm object-cover" />
                    {x.name}
                  </span>
                  <span className="tabular-nums text-navy-soft">
                    {x.d30} <span className="text-xs text-mist">/ {x.total}</span>
                  </span>
                </div>
                <div className="h-2 rounded-full bg-ice-100">
                  <div className="h-2 rounded-full bg-gold" style={{ width: `${(x.d30 / maxClick) * 100}%` }} />
                </div>
              </div>
            ))}
            {!stats.clicks.length && <p className="text-sm text-mist">لا توجد دول بعد.</p>}
          </div>
        </Card>
        </div>
      </div>
    </>
  );
}

function Messages() {
  const [list, setList] = useState<ContactMessage[] | null>(null);
  useEffect(() => {
    fetch("/api/admin/messages")
      .then((r) => r.json())
      .then(setList)
      .catch(() => setList([]));
  }, []);
  const patch = async (body: object) => {
    const r = await fetch("/api/admin/messages", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    if (r.ok) setList(await r.json());
  };
  return (
    <Card title="رسائل نموذج التواصل">
      {!list && <p className="text-sm text-mist">جارٍ التحميل…</p>}
      {list?.length === 0 && <p className="text-sm text-mist">لا توجد رسائل بعد.</p>}
      <div className="space-y-3">
        {list?.map((m) => (
          <div key={m.id} className={`rounded-xl border p-4 ${m.read ? "border-ice-200 bg-white" : "border-gold/40 bg-gold-pale/30"}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold text-navy">
                {!m.read && <span className="me-2 inline-block h-2 w-2 rounded-full bg-gold" />}
                {m.name}
              </p>
              <span className="text-xs text-mist" dir="ltr">
                {new Date(m.at).toLocaleString("en-GB")}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap gap-x-4 text-sm" dir="ltr">
              {m.email && (
                <a className="text-gold-deep hover:underline" href={`mailto:${m.email}`}>
                  {m.email}
                </a>
              )}
              {m.phone && (
                <a className="text-gold-deep hover:underline" href={`tel:${m.phone}`}>
                  {m.phone}
                </a>
              )}
            </div>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-navy-soft">{m.message}</p>
            <div className="mt-3 flex gap-2">
              <Btn onClick={() => patch({ id: m.id, read: !m.read })}>{m.read ? "تعليم كغير مقروءة" : "تعليم كمقروءة"}</Btn>
              <Btn variant="danger" onClick={() => confirm("حذف الرسالة؟") && patch({ id: m.id, remove: true })}>
                حذف
              </Btn>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function Security() {
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);
  const strength = useMemo(() => {
    let s = 0;
    if (next.length >= 8) s++;
    if (next.length >= 12) s++;
    if (/[A-Z]/.test(next) && /[a-z]/.test(next)) s++;
    if (/\d/.test(next) && /[^A-Za-z0-9]/.test(next)) s++;
    return s;
  }, [next]);
  async function submit() {
    const r = await fetch("/api/admin/password", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ current: cur, next }) });
    const d = await r.json().catch(() => ({}));
    setMsg(r.ok ? { ok: true, t: "تم تغيير كلمة المرور ✓" } : { ok: false, t: d.error || "تعذّر التغيير" });
    if (r.ok) {
      setCur("");
      setNext("");
    }
  }
  return (
    <Card title="الأمان" desc="غيّر كلمة مرور لوحة التحكم. تُحفظ مشفّرة (bcrypt).">
      <div className="grid max-w-xl gap-4">
        <Field label="كلمة المرور الحالية">
          <Text ltr type="password" value={cur} onChange={setCur} autoComplete="current-password" />
        </Field>
        <Field label="كلمة المرور الجديدة" hint="٨ أحرف على الأقل، ويفضل خلط الأحرف والأرقام والرموز">
          <Text ltr type="password" value={next} onChange={setNext} autoComplete="new-password" />
        </Field>
        <div className="flex gap-1">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={`h-1.5 flex-1 rounded-full ${i < strength ? "bg-gold" : "bg-ice-200"}`} />
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Btn variant="gold" onClick={submit} disabled={!cur || next.length < 8}>
            تغيير كلمة المرور
          </Btn>
          <Btn
            variant="danger"
            onClick={async () => {
              await fetch("/api/admin/logout", { method: "POST" });
              location.href = "/admin/login";
            }}
          >
            تسجيل الخروج
          </Btn>
          {msg && <span className={`text-sm ${msg.ok ? "text-green-700" : "text-red-700"}`}>{msg.t}</span>}
        </div>
      </div>
    </Card>
  );
}

