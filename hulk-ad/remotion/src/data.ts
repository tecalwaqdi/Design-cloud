// HULK plans — verified from the store (Salla API via the connected store) on 2026-11-16.
export const HULK = [
  { id: 'hulk_3', name: 'اشتراك هولك HULK – 3 أشهر', duration: '3 أشهر', price: 98 },
  { id: 'hulk_6', name: 'اشتراك هولك HULK – 6 أشهر', duration: '6 أشهر', price: 149 },
  { id: 'hulk_12', name: 'اشتراك هولك HULK – 12 شهر', duration: '12 شهر', price: 196 },
];
// 196 / 12 = 16.33 SAR per month  ->  "أقل من 17 ريال بالشهر"
export const ONE_YEAR_MONTHLY = (196 / 12).toFixed(1); // "16.3"
export type Product = { id: string; name: string; duration: string; devices?: string; price: number; image: string };
