import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "War of The Elector",
    short_name: "WTE",
    description: "A medieval fantasy strategy game built with Next.js",
    start_url: "/",
    display: "fullscreen",
    orientation: "portrait",
    background_color: "#1a1a1a",
    theme_color: "#d4af37",
    icons: [
      {
        src: "/favicon-196.png",
        sizes: "196x196",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/manifest-icon-192.maskable.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/manifest-icon-512.maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    categories: ["games", "strategy", "entertainment"],
    screenshots: [
      {
        src: "/apple-splash-1125-2436.jpg",
        sizes: "1125x2436",
        type: "image/jpeg",
      },
      {
        src: "/apple-splash-1536-2048.jpg",
        sizes: "1536x2048",
        type: "image/jpeg",
      },
    ],
  };
}
