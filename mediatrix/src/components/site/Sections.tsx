import { Pulse } from "../art/Logo";
import { ContactForm } from "./ContactForm";
import { CountryGrid } from "./CountryGrid";
import { Gallery } from "./Gallery";
import { Icon, Social } from "./Icons";
import { Reveal } from "./Reveal";
import { t, tr } from "@/lib/i18n";
import type { Content, Lang, SectionKey } from "@/lib/types";

export function SectionHeading({ title, sub, eyebrow }: { title: string; sub?: string; eyebrow?: string }) {
  return (
    <Reveal className="mb-12 text-center">
      {eyebrow && <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-gold rtl:tracking-normal rtl:text-xs">{eyebrow}</p>}
      <h2 className="font-heading text-4xl font-semibold text-navy md:text-5xl">{title}</h2>
      <div className="mx-auto mt-4 flex items-center justify-center gap-3">
        <span className="gold-hairline w-16" />
        <Pulse animated={false} className="h-4 w-12 opacity-70" id={`hd-${title.length}`} />
        <span className="gold-hairline w-16" />
      </div>
      {sub && <p className="mx-auto mt-4 max-w-xl text-sm text-mist md:text-base">{sub}</p>}
    </Reveal>
  );
}

const wrap = "relative mx-auto max-w-7xl px-5 md:px-8";

type Ctx = { c: Content; lang: Lang; visitorCountry?: string };

function Countries({ c, lang, visitorCountry }: Ctx) {
  // Dashboard order; CountryGrid moves the visitor's country to the front.
  const ordered = c.countries.filter((x) => x.enabled);
  const cards = ordered.map((x) => ({
      id: x.id,
      flag: x.flag,
      name: tr(x.name, lang),
      landmark: tr(x.landmark, lang),
      art: x.art,
      mediaUrl: x.mediaUrl,
      hasStore: /^https?:\/\//i.test(x.storeUrl),
    }));
  return (
    <section id="countries" className="relative scroll-mt-24 pb-20 pt-6 lg:pt-4">
      <div className={wrap}>
        <p className="mb-6 text-center text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-gold rtl:tracking-normal rtl:text-xs lg:mb-3">{t("countries_title", lang)}</p>
        <CountryGrid
          cards={cards}
          goLabel={t("go_store", lang)}
          soonLabel={t("coming_soon", lang)}
          yourCountryLabel={t("your_country", lang)}
          visitorCountry={visitorCountry}
        />
      </div>
    </section>
  );
}

function About({ c, lang }: Ctx) {
  return (
    <section id="about" className="relative scroll-mt-24 py-16 md:py-20">
      <div className={`${wrap} grid items-center gap-12 md:grid-cols-2`}>
        <Reveal>
          <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-gold rtl:tracking-normal rtl:text-xs">{c.identity.name}</p>
          <h2 className="font-heading text-4xl font-semibold text-navy md:text-5xl">{tr(c.about.title, lang)}</h2>
          <div className="gold-hairline my-6 w-24 !bg-gradient-to-r from-gold to-transparent rtl:!bg-gradient-to-l" />
          <p className="whitespace-pre-line text-[1.02rem] leading-8 text-navy-soft">{tr(c.about.body, lang)}</p>
        </Reveal>
        <Reveal delay={0.15}>
          <div id="story" className="glass relative scroll-mt-28 overflow-hidden rounded-[28px] p-8 md:p-10">
            <Pulse className="absolute -end-6 -top-2 w-48 opacity-20" id="about-pulse" />
            <h3 className="font-heading text-2xl font-semibold text-gold-deep">{t("nav_story", lang)}</h3>
            <p className="mt-4 whitespace-pre-line leading-8 text-navy-soft">{tr(c.about.story, lang)}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Vision({ c, lang }: Ctx) {
  const items = [
    { k: "vision" as const, body: tr(c.vision.vision, lang), icon: "star" },
    { k: "mission" as const, body: tr(c.vision.mission, lang), icon: "heart" },
  ];
  return (
    <section id="vision" className="relative scroll-mt-24 py-16 md:py-20">
      <div className={wrap}>
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((it, i) => (
            <Reveal key={it.k} delay={i * 0.12}>
              <div className="glass h-full rounded-[24px] p-8 transition duration-500 hover:-translate-y-1">
                <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-b from-gold-pale to-white text-gold-deep ring-1 ring-gold/30">
                  <Icon name={it.icon} />
                </span>
                <h3 className="font-heading text-2xl font-semibold text-navy">{t(it.k, lang)}</h3>
                <p className="mt-3 leading-7 text-navy-soft">{it.body}</p>
              </div>
            </Reveal>
          ))}
          <Reveal delay={0.24}>
            <div className="panel-gold h-full rounded-[24px] p-8">
              <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-gold-deep ring-1 ring-gold/40">
                <Icon name="sparkle" />
              </span>
              <h3 className="font-heading text-2xl font-semibold">{t("goals", lang)}</h3>
              <ul className="mt-4 space-y-3">
                {c.vision.goals.map((g, i) => (
                  <li key={i} className="flex items-start gap-3 text-navy-soft">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" />
                    {tr(g, lang)}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Services({ c, lang }: Ctx) {
  return (
    <section id="services" className="relative scroll-mt-24 py-16 md:py-20">
      <div className={wrap}>
        <SectionHeading title={t("services_title", lang)} eyebrow={c.identity.name} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {c.services.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.08}>
              <div className="glass group relative h-full overflow-hidden rounded-[22px] p-7 transition duration-500 hover:-translate-y-1.5">
                <span className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-gold-deep via-gold-light to-gold-deep transition duration-700 group-hover:scale-x-100 rtl:origin-right" />
                <span className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-white to-gold-pale text-gold-deep ring-1 ring-gold/25 transition duration-500 group-hover:rotate-6">
                  <Icon name={s.icon} className="h-7 w-7" />
                </span>
                <h3 className="font-heading text-xl font-semibold text-navy">{tr(s.title, lang)}</h3>
                <p className="mt-2 text-sm leading-7 text-mist">{tr(s.desc, lang)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Branches({ c, lang }: Ctx) {
  if (!c.branches.length) return null;
  return (
    <section id="branches" className="relative scroll-mt-24 py-16 md:py-20">
      <div className={wrap}>
        <SectionHeading title={t("branches_title", lang)} eyebrow={t("nav_network", lang)} />
        <div className="flex flex-wrap justify-center gap-5">
          {c.branches.map((b, i) => (
            <Reveal key={b.id} delay={i * 0.08} className="w-full sm:w-[calc(50%-0.7rem)] lg:w-[calc(33.333%-0.85rem)]">
              <div className="glass flex h-full gap-4 rounded-[22px] p-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/flags/${b.flag}.svg`} alt="" className="mt-1 h-6 w-9 shrink-0 rounded object-cover shadow ring-1 ring-white" />
                <div className="min-w-0">
                  <h3 className="font-heading text-xl font-semibold text-navy">{tr(b.city, lang)}</h3>
                  <p className="mt-1 text-sm leading-6 text-mist">{tr(b.address, lang)}</p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                    {b.phone && (
                      <a href={`tel:${b.phone}`} dir="ltr" className="text-gold-deep hover:underline">
                        {b.phone}
                      </a>
                    )}
                    {b.mapUrl && (
                      <a href={b.mapUrl} target="_blank" rel="noopener" className="text-gold-deep hover:underline">
                        {t("map", lang)} ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Partners({ c, lang }: Ctx) {
  if (!c.partners.length) return null;
  const row = [...c.partners, ...c.partners];
  return (
    <section id="partners" className="relative scroll-mt-24 py-20">
      <SectionHeading title={t("partners_title", lang)} />
      <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]" dir="ltr">
        <div className="marquee-track flex w-max gap-6" style={{ animation: `marquee ${Math.max(20, c.partners.length * 6)}s linear infinite` }}>
          {row.map((p, i) => {
            const inner = p.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.logoUrl} alt={p.name} className="max-h-12 max-w-[140px] object-contain opacity-70 grayscale transition group-hover:opacity-100 group-hover:grayscale-0" />
            ) : (
              <span className="font-heading text-xl font-semibold tracking-wide text-navy/50 transition group-hover:text-gold-deep">{p.name}</span>
            );
            return (
              <div key={i} className="glass group flex h-24 w-52 shrink-0 items-center justify-center rounded-2xl px-6">
                {p.url ? (
                  <a href={p.url} target="_blank" rel="noopener" aria-label={p.name}>
                    {inner}
                  </a>
                ) : (
                  inner
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function GallerySection({ c, lang }: Ctx) {
  if (!c.gallery.length) return null;
  return (
    <section id="gallery" className="relative scroll-mt-24 py-16 md:py-20">
      <div className={wrap}>
        <SectionHeading title={t("gallery_title", lang)} />
        <Gallery items={c.gallery.map((g) => ({ url: g.url, caption: tr(g.caption, lang) }))} />
      </div>
    </section>
  );
}

function Contact({ c, lang }: Ctx) {
  const ct = c.contact;
  const socials = Object.entries(ct.social).filter(([, v]) => v);
  const rows = [
    ct.phone && { label: t("f_phone", lang), value: ct.phone, href: `tel:${ct.phone}`, ltr: true },
    ct.email && { label: t("f_email", lang), value: ct.email, href: `mailto:${ct.email}`, ltr: true },
    tr(ct.address, lang) && { label: "📍", value: tr(ct.address, lang) },
    tr(ct.hours, lang) && { label: t("hours", lang), value: tr(ct.hours, lang) },
  ].filter(Boolean) as { label: string; value: string; href?: string; ltr?: boolean }[];

  return (
    <section id="contact" className="relative scroll-mt-24 py-16 md:py-20">
      <div className={wrap}>
        <SectionHeading title={t("contact_title", lang)} sub={t("contact_sub", lang)} />
        <div className="grid gap-6 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <div className="panel-gold relative h-full overflow-hidden rounded-[26px] p-8">
              <Pulse className="absolute -bottom-4 -end-8 w-64 opacity-15" id="contact-pulse" />
              <ul className="relative space-y-5">
                {rows.map((r, i) => (
                  <li key={i}>
                    <p className="text-xs uppercase tracking-widest text-gold-deep">{r.label}</p>
                    {r.href ? (
                      <a href={r.href} dir={r.ltr ? "ltr" : undefined} className="mt-1 block text-lg text-navy hover:text-gold-deep">
                        {r.value}
                      </a>
                    ) : (
                      <p className="mt-1 text-navy-soft">{r.value}</p>
                    )}
                  </li>
                ))}
              </ul>
              {socials.length > 0 && (
                <div className="relative mt-8 flex flex-wrap gap-3">
                  {socials.map(([k, v]) => (
                    <a key={k} href={v} target="_blank" rel="noopener" aria-label={k} className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gold-deep ring-1 ring-gold/30 transition hover:bg-gold hover:text-white">
                      <Social name={k} />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </Reveal>
          <Reveal delay={0.12} className="lg:col-span-3">
            <div className="glass rounded-[26px] p-6 md:p-8">
              <ContactForm
                labels={{
                  name: t("f_name", lang),
                  email: t("f_email", lang),
                  phone: t("f_phone", lang),
                  message: t("f_message", lang),
                  send: t("f_send", lang),
                  sending: t("f_sending", lang),
                  sent: t("f_sent", lang),
                  error: t("f_error", lang),
                }}
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

const registry: Record<SectionKey, (p: Ctx) => React.ReactNode> = {
  countries: Countries,
  about: About,
  vision: Vision,
  services: Services,
  branches: Branches,
  partners: Partners,
  gallery: GallerySection,
  contact: Contact,
};

export function RenderSection({ k, ...ctx }: Ctx & { k: SectionKey }) {
  const Comp = registry[k];
  return Comp ? <Comp {...ctx} /> : null;
}
