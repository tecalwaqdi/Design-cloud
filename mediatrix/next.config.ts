import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  poweredByHeader: false,
};

export default nextConfig;

// Gives `next dev` local D1 / R2 bindings (same code path as production).
// Only in development, and never on Vercel (which uses the filesystem fallback).
if (process.env.NODE_ENV === "development" && !process.env.VERCEL) {
  initOpenNextCloudflareForDev();
}
