import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        "sword-unsheath": "unsheath 1s ease-in-out forwards",
      },
      keyframes: {
        unsheath: {
          "0%": {
            transform: "scaleX(0)",
          },
          "50%": {
            transform: "scaleX()1.2",
          },
          "100%": {
            transform: "scaleX(1)",
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
