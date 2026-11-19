export type Lang = "ar" | "en";
export type L = { ar: string; en: string };

export type LandmarkArt =
  | "liberty"
  | "brandenburg"
  | "bigben"
  | "burj"
  | "kingdom"
  | "kuwait"
  | "doha"
  | "bahrain"
  | "oman"
  | "generic";

export interface Country {
  id: string;
  flag: string; // ISO 3166-1 alpha-2, e.g. "SA"
  name: L;
  landmark: L;
  art: LandmarkArt; // built-in animated illustration
  mediaUrl?: string; // optional uploaded photo / video that replaces the illustration
  storeUrl: string; // empty = "coming soon"
  enabled: boolean;
}

export interface Service {
  id: string;
  icon: string; // key of built-in icon set
  title: L;
  desc: L;
}

export interface Branch {
  id: string;
  flag: string;
  city: L;
  address: L;
  phone: string;
  mapUrl: string;
}

export interface Partner {
  id: string;
  name: string;
  logoUrl?: string;
  url?: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  caption: L;
}

export type SectionKey =
  | "countries"
  | "about"
  | "vision"
  | "services"
  | "branches"
  | "partners"
  | "gallery"
  | "contact";

export interface Section {
  key: SectionKey;
  visible: boolean;
}

export interface Content {
  identity: {
    name: string;
    tagline: L;
    logoUrl?: string; // optional uploaded logo, otherwise the animated SVG logo
    gold: string;
    navy: string;
  };
  hero: {
    welcome: L;
    subtitle: L;
    bannerUrl?: string; // optional uploaded product image (transparent PNG) for the banner
  };
  countries: Country[];
  about: { title: L; body: L; story: L };
  vision: { vision: L; mission: L; goals: L[] };
  services: Service[];
  branches: Branch[];
  partners: Partner[];
  gallery: GalleryItem[];
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
    address: L;
    hours: L;
    social: {
      instagram: string;
      tiktok: string;
      snapchat: string;
      x: string;
      youtube: string;
      linkedin: string;
    };
  };
  sections: Section[];
  seo: {
    title: L;
    description: L;
    keywords: string;
    ogImage?: string;
    gaId: string;
  };
  privacy: L;
  updatedAt: string;
}

export interface Stats {
  visits: Record<string, number>; // yyyy-mm-dd -> count
  clicks: Record<string, Record<string, number>>; // countryId -> { yyyy-mm-dd -> count }
  messages: ContactMessage[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  at: string;
  read: boolean;
}
