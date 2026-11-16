// Product data captured live from https://lufy.store on 2026-11-16 (see assets/store/products.json).
// Names / durations / prices are copied verbatim from the product pages — do not edit by hand.

export type Product = {
  id: string;
  name: string; // exact product title on the store
  duration: string; // duration label shown in the ad
  devices?: string; // device count (kept separate from duration on purpose)
  price: number; // SAR, verified live on capture date
  image: string; // original product image from the store CDN
};

export const CAPTURE_DATE = '2026-11-16';

export const HULK: Product[] = [
  { id: 'hulk_3', name: 'اشتراك هولك HULK – 3 أشهر', duration: '3 أشهر', price: 98, image: 'store/products/hulk_3.jpg' },
  { id: 'hulk_6', name: 'اشتراك هولك HULK – 6 أشهر', duration: '6 أشهر', price: 149, image: 'store/products/hulk_6.jpg' },
  { id: 'hulk_12', name: 'اشتراك هولك HULK – 12 شهر', duration: '12 شهر', price: 196, image: 'store/products/hulk_12.jpg' },
];

export const ALQADI: Product[] = [
  { id: 'alqadi_6', name: 'اشتراك القاضي ALQadi 4K – 6 أشهر', duration: '6 أشهر', price: 69, image: 'store/products/alqadi_6.jpg' },
  { id: 'alqadi_15', name: 'اشتراك القاضي ALQadi 4K – سنة + 3 أشهر (15 شهرًا)', duration: '15 شهرًا', price: 99, image: 'store/products/alqadi_15.jpg' },
  { id: 'alqadi_2dev', name: 'اشتراك القاضي ALQadi 4K - سنة لجهازين بجودة فائقة', duration: 'سنة', devices: 'لجهازين', price: 136, image: 'store/products/alqadi_2dev.jpg' },
];

export const SNAP = {
  name: 'اشتراك سناب لوفي بلس – سنة (لأول اشتراك فقط)',
  price: 49,
  page: 'store/products/snap_plus_page.png',
  image: 'store/products/snap_plus.jpg', // store's own product image (added to the product on 2026-11-16)
};
