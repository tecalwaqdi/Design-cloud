import type { L, Lang } from "./types";

export const langs: Lang[] = ["ar", "en"];
export const isLang = (v: string): v is Lang => v === "ar" || v === "en";
export const dirOf = (lang: Lang) => (lang === "ar" ? "rtl" : "ltr");
export const tr = (v: L | undefined, lang: Lang) => (v ? v[lang] || v[lang === "ar" ? "en" : "ar"] || "" : "");

const dict = {
  nav_home: { ar: "الرئيسية", en: "Home" },
  nav_about: { ar: "من نحن", en: "About Us" },
  nav_story: { ar: "قصتنا", en: "Our Story" },
  nav_services: { ar: "خدماتنا", en: "Services" },
  nav_network: { ar: "شبكتنا العالمية", en: "Global Networks" },
  nav_contact: { ar: "تواصل معنا", en: "Contact" },
  go_store: { ar: "اذهب للمتجر", en: "Go to Store" },
  coming_soon: { ar: "قريباً", en: "Coming Soon" },
  your_country: { ar: "دولتك", en: "Your country" },
  countries_title: { ar: "متاجرنا حول العالم", en: "Our Stores Worldwide" },
  countries_sub: { ar: "اختر دولتك لتنتقل إلى متجرنا الرسمي فيها", en: "Choose your country to visit our official store there" },
  vision: { ar: "رؤيتنا", en: "Our Vision" },
  mission: { ar: "رسالتنا", en: "Our Mission" },
  goals: { ar: "أهدافنا", en: "Our Goals" },
  services_title: { ar: "خدماتنا", en: "Our Services" },
  branches_title: { ar: "فروعنا", en: "Our Branches" },
  partners_title: { ar: "شركاؤنا وعملاؤنا", en: "Partners & Clients" },
  gallery_title: { ar: "معرض الأعمال", en: "Gallery" },
  contact_title: { ar: "تواصل معنا", en: "Get in Touch" },
  contact_sub: { ar: "يسعدنا تواصلك، وسنرد عليك في أقرب وقت", en: "We'd love to hear from you and will reply shortly" },
  f_name: { ar: "الاسم", en: "Name" },
  f_email: { ar: "البريد الإلكتروني", en: "Email" },
  f_phone: { ar: "رقم الجوال", en: "Phone" },
  f_message: { ar: "رسالتك", en: "Your message" },
  f_send: { ar: "إرسال", en: "Send" },
  f_sending: { ar: "جارٍ الإرسال…", en: "Sending…" },
  f_sent: { ar: "تم الإرسال، شكراً لتواصلك ✨", en: "Sent — thank you for reaching out ✨" },
  f_error: { ar: "تعذّر الإرسال، حاول مرة أخرى", en: "Couldn't send, please try again" },
  map: { ar: "الموقع على الخريطة", en: "View on map" },
  privacy: { ar: "سياسة الخصوصية", en: "Privacy Policy" },
  rights: { ar: "جميع الحقوق محفوظة", en: "All rights reserved" },
  whatsapp: { ar: "تواصل عبر واتساب", en: "Chat on WhatsApp" },
  hours: { ar: "ساعات العمل", en: "Working hours" },
  back_home: { ar: "العودة للرئيسية", en: "Back to home" },
  scroll: { ar: "اكتشف", en: "Discover" },
} satisfies Record<string, L>;

export type DictKey = keyof typeof dict;
export const t = (key: DictKey, lang: Lang) => dict[key][lang];
