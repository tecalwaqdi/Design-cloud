import type { Content, Stats } from "./types";

// Starting content. Everything here is placeholder copy that the owner
// replaces from the dashboard (/admin); store links start empty on purpose.
export const defaultContent: Content = {
  identity: {
    name: "Mediatrix",
    tagline: {
      ar: "جمال يُعنى به بدقة طبية",
      en: "Beauty, cared for with medical precision",
    },
    gold: "#A8875A",
    navy: "#1C2A3F",
  },
  hero: {
    welcome: { ar: "مرحباً بكم في", en: "Welcome to" },
    subtitle: {
      ar: "اختر دولتك وتسوّق من متجرنا الرسمي فيها",
      en: "Choose your country and shop from our official store there",
    },
  },
  countries: [
    {
      id: "us",
      flag: "US",
      name: { ar: "الولايات المتحدة", en: "United States" },
      landmark: { ar: "تمثال الحرية – نيويورك", en: "Statue of Liberty – NYC" },
      art: "liberty",
      storeUrl: "",
      enabled: true,
    },
    {
      id: "de",
      flag: "DE",
      name: { ar: "ألمانيا", en: "Germany" },
      landmark: { ar: "بوابة براندنبورغ – برلين", en: "Brandenburg Gate – Berlin" },
      art: "brandenburg",
      storeUrl: "",
      enabled: true,
    },
    {
      id: "uk",
      flag: "GB",
      name: { ar: "المملكة المتحدة", en: "United Kingdom" },
      landmark: { ar: "ساعة بيغ بن – لندن", en: "Big Ben – London" },
      art: "bigben",
      storeUrl: "",
      enabled: true,
    },
    {
      id: "ae",
      flag: "AE",
      name: { ar: "الإمارات", en: "United Arab Emirates" },
      landmark: { ar: "برج خليفة – دبي", en: "Burj Khalifa – Dubai" },
      art: "burj",
      storeUrl: "",
      enabled: true,
    },
    {
      id: "sa",
      flag: "SA",
      name: { ar: "السعودية", en: "Saudi Arabia" },
      landmark: { ar: "برج المملكة – الرياض", en: "Kingdom Centre – Riyadh" },
      art: "kingdom",
      storeUrl: "",
      enabled: true,
    },
  ],
  about: {
    title: { ar: "من نحن", en: "About Us" },
    body: {
      ar: "ميدياتركس علامة متخصصة في منتجات العناية بالبشرة والتجميل، تجمع بين الدقة العلمية والفخامة. نعمل عبر شبكة متاجر رسمية في عدة دول لنوصل منتجاتنا إلى عملائنا أينما كانوا.",
      en: "Mediatrix is a skincare and beauty brand that brings scientific precision and luxury together. We operate through a network of official stores in several countries to bring our products to customers wherever they are.",
    },
    story: {
      ar: "بدأت قصتنا بفكرة بسيطة: أن تكون العناية بالبشرة مبنية على العلم وتُقدَّم بتجربة راقية. اليوم نواصل التوسع بنفس الشغف.",
      en: "Our story began with a simple idea: skincare should be grounded in science and delivered as a refined experience. Today we keep growing with the same passion.",
    },
  },
  vision: {
    vision: {
      ar: "أن نكون الاسم الأول في العناية بالبشرة الفاخرة في المنطقة والعالم.",
      en: "To be the first name in luxury skincare across the region and the world.",
    },
    mission: {
      ar: "تقديم منتجات موثوقة وفعّالة بتجربة شراء سهلة عبر متاجرنا الرسمية في كل دولة.",
      en: "To deliver trusted, effective products with an effortless shopping experience through our official store in every country.",
    },
    goals: [
      { ar: "جودة لا تقبل المساومة", en: "Uncompromising quality" },
      { ar: "توسّع مدروس في أسواق جديدة", en: "Thoughtful expansion into new markets" },
      { ar: "تجربة عميل تليق بعلامتنا", en: "A customer experience worthy of our brand" },
    ],
  },
  services: [
    {
      id: "s1",
      icon: "drop",
      title: { ar: "منتجات العناية بالبشرة", en: "Skincare Products" },
      desc: { ar: "سيرومات وكريمات وأمبولات بتركيبات مدروسة.", en: "Serums, creams and ampoules with carefully studied formulas." },
    },
    {
      id: "s2",
      icon: "globe",
      title: { ar: "متاجر رسمية دولية", en: "Official International Stores" },
      desc: { ar: "تسوّق من متجر دولتك مباشرة بأسعار وشحن محلي.", en: "Shop directly from your country's store with local prices and shipping." },
    },
    {
      id: "s3",
      icon: "pulse",
      title: { ar: "استشارات متخصصة", en: "Expert Consultation" },
      desc: { ar: "فريق يساعدك تختار الروتين المناسب لبشرتك.", en: "A team that helps you pick the right routine for your skin." },
    },
    {
      id: "s4",
      icon: "handshake",
      title: { ar: "شراكات وتوزيع", en: "Partnerships & Distribution" },
      desc: { ar: "فرص توزيع للعيادات والمتاجر والموزعين.", en: "Distribution opportunities for clinics, retailers and distributors." },
    },
  ],
  branches: [
    {
      id: "b1",
      flag: "SA",
      city: { ar: "الرياض", en: "Riyadh" },
      address: { ar: "يُضاف العنوان من لوحة التحكم", en: "Address added from the dashboard" },
      phone: "",
      mapUrl: "",
    },
    {
      id: "b2",
      flag: "AE",
      city: { ar: "دبي", en: "Dubai" },
      address: { ar: "يُضاف العنوان من لوحة التحكم", en: "Address added from the dashboard" },
      phone: "",
      mapUrl: "",
    },
  ],
  partners: [
    { id: "p1", name: "Partner One" },
    { id: "p2", name: "Partner Two" },
    { id: "p3", name: "Partner Three" },
    { id: "p4", name: "Partner Four" },
    { id: "p5", name: "Partner Five" },
  ],
  gallery: [],
  contact: {
    phone: "",
    whatsapp: "",
    email: "",
    address: { ar: "", en: "" },
    hours: { ar: "الأحد – الخميس، ٩ص – ٦م", en: "Sun – Thu, 9am – 6pm" },
    social: { instagram: "", tiktok: "", snapchat: "", x: "", youtube: "", linkedin: "" },
  },
  sections: [
    { key: "countries", visible: true },
    { key: "about", visible: true },
    { key: "vision", visible: true },
    { key: "services", visible: true },
    { key: "branches", visible: true },
    { key: "partners", visible: true },
    { key: "gallery", visible: true },
    { key: "contact", visible: true },
  ],
  seo: {
    title: { ar: "ميدياتركس | الموقع الرسمي", en: "Mediatrix | Official Website" },
    description: {
      ar: "الموقع الرسمي لميدياتركس – اختر دولتك وتسوّق من متجرنا الرسمي.",
      en: "The official Mediatrix website – choose your country and shop from our official store.",
    },
    keywords: "Mediatrix, skincare, beauty, ميدياتركس, عناية بالبشرة",
    gaId: "",
  },
  privacy: {
    ar: "نحترم خصوصيتك. لا نجمع من بياناتك إلا ما ترسله لنا عبر نموذج التواصل، ونستخدمه فقط للرد عليك. يمكنك طلب حذف بياناتك في أي وقت عبر التواصل معنا.\n\nعند انتقالك إلى أحد متاجرنا، تخضع بياناتك لسياسة الخصوصية الخاصة بذلك المتجر.",
    en: "We respect your privacy. We only collect the information you send us through the contact form and use it solely to reply to you. You can ask us to delete your data at any time by contacting us.\n\nWhen you move to one of our stores, your data is governed by that store's own privacy policy.",
  },
  updatedAt: new Date(0).toISOString(),
};

export const emptyStats: Stats = { visits: {}, clicks: {}, messages: [] };
