import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  poweredByHeader: false,
};

export default nextConfig;

// Gives `next dev` local D1 / R2 bindings (same code path as production).
initOpenNextCloudflareForDev();
