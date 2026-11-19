import type { Content, Stats } from "./types";

// Starting content. Everything here is placeholder copy that the owner
// replaces from the dashboard (/admin); store links start empty on purpose.
export const defaultContent: Content = {
  identity: {
    name: "Mediatrix",
    tagline: {
      ar: "مستلزمات طبية موثوقة بمعايير عالمية",
      en: "Trusted medical supplies, global standards",
    },
    gold: "#A8875A",
    navy: "#1C2A3F",
  },
  hero: {
    welcome: { ar: "مرحباً بكم في", en: "Welcome to" },
    subtitle: {
      ar: "اختر دولتك واطلب مستلزماتك الطبية من متجرنا الرسمي فيها",
      en: "Choose your country and order your medical supplies from our official store there",
    },
  },
  countries: [
    {
      id: "sa",
      flag: "SA",
      name: { ar: "السعودية", en: "Saudi Arabia" },
      landmark: { ar: "برج المملكة – الرياض", en: "Kingdom Centre – Riyadh" },
      art: "kingdom",
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
      id: "kw",
      flag: "KW",
      name: { ar: "الكويت", en: "Kuwait" },
      landmark: { ar: "أبراج الكويت – مدينة الكويت", en: "Kuwait Towers – Kuwait City" },
      art: "kuwait",
      storeUrl: "",
      enabled: true,
    },
    {
      id: "qa",
      flag: "QA",
      name: { ar: "قطر", en: "Qatar" },
      landmark: { ar: "كورنيش الدوحة", en: "Doha Corniche" },
      art: "doha",
      storeUrl: "",
      enabled: true,
    },
    {
      id: "bh",
      flag: "BH",
      name: { ar: "البحرين", en: "Bahrain" },
      landmark: { ar: "مركز البحرين التجاري العالمي – المنامة", en: "Bahrain World Trade Center – Manama" },
      art: "bahrain",
      storeUrl: "",
      enabled: true,
    },
    {
      id: "om",
      flag: "OM",
      name: { ar: "عُمان", en: "Oman" },
      landmark: { ar: "جامع السلطان قابوس – مسقط", en: "Sultan Qaboos Grand Mosque – Muscat" },
      art: "oman",
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
      id: "de",
      flag: "DE",
      name: { ar: "ألمانيا", en: "Germany" },
      landmark: { ar: "بوابة براندنبورغ – برلين", en: "Brandenburg Gate – Berlin" },
      art: "brandenburg",
      storeUrl: "",
      enabled: true,
    },
    {
      id: "us",
      flag: "US",
      name: { ar: "الولايات المتحدة", en: "United States" },
      landmark: { ar: "تمثال الحرية – نيويورك", en: "Statue of Liberty – NYC" },
      art: "liberty",
      storeUrl: "",
      enabled: true,
    },
  ],
  about: {
    title: { ar: "من نحن", en: "About Us" },
    body: {
      ar: "ميدياتركس شركة متخصصة في توريد المستلزمات والأجهزة الطبية. نوفّر كل ما يحتاجه القطاع الصحي والأفراد: من المستهلكات اليومية وأدوات التعقيم والسلامة، إلى أجهزة القياس والرعاية المنزلية. منتجاتنا أصلية ومعتمدة، ونوصلها عبر متاجر رسمية في عدة دول.",
      en: "Mediatrix specialises in supplying medical consumables and devices. We provide what healthcare facilities and individuals need every day: from consumables, sterilisation and safety essentials to monitoring and home-care devices. Our products are genuine and certified, delivered through official stores in several countries.",
    },
    story: {
      ar: "بدأنا من قناعة بسيطة: الجودة في المستلزمات الطبية ليست رفاهية، بل أمان. لذلك نختار كل منتج بعناية، ونتأكد من مطابقته للمعايير، ونوصله بسرعة وثقة لمن يحتاجه.",
      en: "We started from a simple belief: in medical supplies, quality isn't a luxury — it's safety. So we choose every product carefully, make sure it meets the standards, and deliver it quickly and reliably to those who need it.",
    },
  },
  vision: {
    vision: {
      ar: "أن نكون المورّد الأوثق للمستلزمات والأجهزة الطبية في المنطقة.",
      en: "To be the most trusted supplier of medical supplies and devices in the region.",
    },
    mission: {
      ar: "توفير مستلزمات وأجهزة طبية أصلية ومعتمدة بأسعار عادلة، مع توصيل سريع وخدمة تفهم احتياج القطاع الصحي.",
      en: "To provide genuine, certified medical supplies and devices at fair prices, with fast delivery and service that understands healthcare.",
    },
    goals: [
      { ar: "منتجات أصلية مطابقة للمعايير الصحية", en: "Genuine products that meet health standards" },
      { ar: "توفّر دائم وتوصيل سريع", en: "Constant availability and fast delivery" },
      { ar: "خدمة المنشآت الصحية والأفراد على حد سواء", en: "Serving healthcare facilities and individuals alike" },
    ],
  },
  services: [
    {
      id: "s1",
      icon: "syringe",
      title: { ar: "المستهلكات الطبية", en: "Medical Consumables" },
      desc: {
        ar: "إبر ومحاقن وقفازات طبية وشاش ومستلزمات الاستخدام اليومي للعيادات والمنازل.",
        en: "Needles, syringes, medical gloves, gauze and everyday essentials for clinics and homes.",
      },
    },
    {
      id: "s2",
      icon: "shieldplus",
      title: { ar: "التعقيم والسلامة", en: "Sterilisation & Safety" },
      desc: {
        ar: "مطهرات ومعقمات وكمامات وأدوات الحماية الشخصية لبيئة عمل آمنة.",
        en: "Disinfectants, sanitisers, masks and personal protective equipment for a safe environment.",
      },
    },
    {
      id: "s3",
      icon: "monitor",
      title: { ar: "أجهزة القياس", en: "Monitoring Devices" },
      desc: {
        ar: "أجهزة قياس السكر والضغط ونسبة الأكسجين، بدقة يعتمد عليها في المنزل والعيادة.",
        en: "Glucose, blood-pressure and oxygen-saturation monitors you can rely on at home or in clinic.",
      },
    },
    {
      id: "s4",
      icon: "oxygen",
      title: { ar: "الأكسجين والرعاية المنزلية", en: "Oxygen & Home Care" },
      desc: {
        ar: "أجهزة ومستلزمات الأكسجين والرعاية المنزلية، مع إرشاد لاختيار الأنسب.",
        en: "Oxygen equipment and home-care supplies, with guidance to choose the right one.",
      },
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
    title: { ar: "ميدياتركس | مستلزمات وأجهزة طبية", en: "Mediatrix | Medical Supplies & Devices" },
    description: {
      ar: "ميدياتركس لتوريد المستلزمات والأجهزة الطبية: إبر وقفازات ومطهرات وأدوات سلامة، وأجهزة قياس السكر والضغط والأكسجين. اختر دولتك واطلب من متجرنا الرسمي.",
      en: "Mediatrix medical supplies and devices: needles, gloves, disinfectants, safety equipment, glucose and blood-pressure monitors and oxygen devices. Choose your country and order from our official store.",
    },
    keywords: "Mediatrix, medical supplies, medical devices, gloves, syringes, disinfectants, glucose meter, blood pressure monitor, oxygen, ميدياتركس, مستلزمات طبية, أجهزة طبية, قفازات, إبر, مطهرات, جهاز قياس السكر, جهاز الضغط, أجهزة الأكسجين",
    gaId: "",
  },
  privacy: {
    ar: "نحترم خصوصيتك. لا نجمع من بياناتك إلا ما ترسله لنا عبر نموذج التواصل، ونستخدمه فقط للرد عليك. يمكنك طلب حذف بياناتك في أي وقت عبر التواصل معنا.\n\nعند انتقالك إلى أحد متاجرنا، تخضع بياناتك لسياسة الخصوصية الخاصة بذلك المتجر.",
    en: "We respect your privacy. We only collect the information you send us through the contact form and use it solely to reply to you. You can ask us to delete your data at any time by contacting us.\n\nWhen you move to one of our stores, your data is governed by that store's own privacy policy.",
  },
  updatedAt: new Date(0).toISOString(),
};

export const emptyStats: Stats = { visits: {}, clicks: {}, messages: [] };
