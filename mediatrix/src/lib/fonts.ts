import { Amiri, Cormorant_Garamond, IBM_Plex_Sans_Arabic, Inter, Libre_Baskerville, Readex_Pro } from "next/font/google";

export const display = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600", "700"], style: ["normal", "italic"], variable: "--f-display", display: "swap" });
export const logo = Libre_Baskerville({ subsets: ["latin"], weight: ["400", "700"], variable: "--f-logo", display: "swap" });
export const sans = Inter({ subsets: ["latin"], variable: "--f-sans", display: "swap" });
export const arDisplay = Amiri({ subsets: ["arabic"], weight: ["400", "700"], variable: "--f-ar-display", display: "swap" });
export const ar = IBM_Plex_Sans_Arabic({ subsets: ["arabic"], weight: ["300", "400", "500", "600", "700"], variable: "--f-ar", display: "swap" });

// Brand wordmark (logo name): clean, highly legible
export const brand = Readex_Pro({ subsets: ["latin", "latin-ext"], weight: ["500", "600", "700"], variable: "--f-brand", display: "swap" });

export const fontVars = [brand.variable, display.variable, logo.variable, sans.variable, arDisplay.variable, ar.variable].join(" ");
