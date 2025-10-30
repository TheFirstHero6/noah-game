const isDev = process.env.NODE_ENV === "development";
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  // Disable next-pwa in development to avoid injecting webpack config under Turbopack
  disable: isDev,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Explicitly set Turbopack config to silence the webpack-without-turbopack warning
  turbopack: {
    root: __dirname,
  },
};

module.exports = withPWA(nextConfig);
