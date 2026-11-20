import { IBM_Plex_Sans_Arabic, Inter, Readex_Pro } from "next/font/google";

// Brand typeface: Readex Pro covers Arabic + Latin with one consistent geometric voice.
export const brand = Readex_Pro({ subsets: ["arabic", "latin", "latin-ext"], weight: ["300", "400", "500", "600", "700"], variable: "--f-brand", display: "swap" });
export const sans = Inter({ subsets: ["latin"], variable: "--f-sans", display: "swap" });
export const ar = IBM_Plex_Sans_Arabic({ subsets: ["arabic"], weight: ["300", "400", "500", "600", "700"], variable: "--f-ar", display: "swap" });

export const fontVars = [brand.variable, sans.variable, ar.variable].join(" ");
