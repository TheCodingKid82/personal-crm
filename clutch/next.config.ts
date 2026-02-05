import type { NextConfig } from "next";

// next-pwa works by generating a service worker into /public.
// We disable it in dev to avoid caching headaches.
// Docs: https://github.com/shadowwalker/next-pwa
//
// Note: This project uses the App Router.
// next-pwa wraps the Next.js config.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Next 16 enables Turbopack by default; next-pwa currently relies on webpack.
  // An empty turbopack config silences the "webpack config" build error.
  turbopack: {},
};

export default withPWA(nextConfig);
