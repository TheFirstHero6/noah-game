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
        // Modern Fluid Color System
        gold: {
          50: "var(--gold-50)",
          100: "var(--gold-100)",
          200: "var(--gold-200)",
          300: "var(--gold-300)",
          400: "var(--gold-400)",
          500: "var(--gold-500)",
          600: "var(--gold-600)",
          700: "var(--gold-700)",
          800: "var(--gold-800)",
          900: "var(--gold-900)",
        },
        steel: {
          50: "var(--steel-50)",
          100: "var(--steel-100)",
          200: "var(--steel-200)",
          300: "var(--steel-300)",
          400: "var(--steel-400)",
          500: "var(--steel-500)",
          600: "var(--steel-600)",
          700: "var(--steel-700)",
          800: "var(--steel-800)",
          900: "var(--steel-900)",
        },
        royal: {
          50: "var(--royal-50)",
          100: "var(--royal-100)",
          200: "var(--royal-200)",
          300: "var(--royal-300)",
          400: "var(--royal-400)",
          500: "var(--royal-500)",
          600: "var(--royal-600)",
          700: "var(--royal-700)",
          800: "var(--royal-800)",
          900: "var(--royal-900)",
        },
        // Theme-aware colors
        theme: {
          gold: "var(--theme-gold)",
          "gold-dark": "var(--theme-gold-dark)",
          accent: "var(--theme-accent)",
          bg: "var(--theme-bg)",
          "card-bg": "var(--theme-card-bg)",
          border: "var(--theme-border)",
        },
        emerald: {
          50: "var(--emerald-50)",
          100: "var(--emerald-100)",
          200: "var(--emerald-200)",
          300: "var(--emerald-300)",
          400: "var(--emerald-400)",
          500: "var(--emerald-500)",
          600: "var(--emerald-600)",
          700: "var(--emerald-700)",
          800: "var(--emerald-800)",
          900: "var(--emerald-900)",
        },
        crimson: {
          50: "var(--crimson-50)",
          100: "var(--crimson-100)",
          200: "var(--crimson-200)",
          300: "var(--crimson-300)",
          400: "var(--crimson-400)",
          500: "var(--crimson-500)",
          600: "var(--crimson-600)",
          700: "var(--crimson-700)",
          800: "var(--crimson-800)",
          900: "var(--crimson-900)",
        },
        // Legacy medieval colors for backward compatibility
        medieval: {
          gold: {
            50: "#fefce8",
            100: "#fef9c3",
            200: "#fef08a",
            300: "#fde047",
            400: "#facc15",
            500: "var(--primary)",
            600: "#ca8a04",
            700: "#a16207",
            800: "#854d0e",
            900: "#713f12",
          },
          steel: {
            50: "#f8fafc",
            100: "#f1f5f9",
            200: "#e2e8f0",
            300: "#cbd5e1",
            400: "#94a3b8",
            500: "#64748b",
            600: "#475569",
            700: "#334155",
            800: "#1e293b",
            900: "#0f172a",
          },
          crimson: {
            50: "#fef2f2",
            100: "#fee2e2",
            200: "#fecaca",
            300: "#fca5a5",
            400: "#f87171",
            500: "#ef4444",
            600: "#dc2626",
            700: "#b91c1c",
            800: "#991b1b",
            900: "#7f1d1d",
          },
          emerald: {
            50: "#ecfdf5",
            100: "#d1fae5",
            200: "#a7f3d0",
            300: "#6ee7b7",
            400: "#34d399",
            500: "#10b981",
            600: "#059669",
            700: "#047857",
            800: "#065f46",
            900: "#064e3b",
          },
          royal: {
            50: "#f0f9ff",
            100: "#e0f2fe",
            200: "#bae6fd",
            300: "#7dd3fc",
            400: "#38bdf8",
            500: "#0ea5e9",
            600: "#0284c7",
            700: "#0369a1",
            800: "#075985",
            900: "#0c4a6e",
          },
        },
      },
      fontFamily: {
        medieval: ["Cinzel", "serif"],
        fantasy: ["Uncial Antiqua", "cursive"],
        script: ["Dancing Script", "cursive"],
        serif: ["Playfair Display", "serif"],
      },
      animation: {
        "sword-unsheath": "unsheath 1s ease-in-out forwards",
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "slide-left": "slideLeft 0.3s ease-out",
        "slide-right": "slideRight 0.3s ease-out",
        glow: "glow 2s ease-in-out infinite alternate",
        float: "float 3s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "bounce-gentle": "bounceGentle 2s ease-in-out infinite",
        "scale-in": "scaleIn 0.3s ease-out",
        "scale-out": "scaleOut 0.3s ease-in",
        "rotate-in": "rotateIn 0.5s ease-out",
        wiggle: "wiggle 1s ease-in-out infinite",
        "gradient-shift": "gradientShift 3s ease-in-out infinite",
        "text-glow": "textGlow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        unsheath: {
          "0%": {
            transform: "scaleX(0)",
          },
          "50%": {
            transform: "scaleX(1.2)",
          },
          "100%": {
            transform: "scaleX(1)",
          },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideLeft: {
          "0%": { transform: "translateX(20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideRight: {
          "0%": { transform: "translateX(-20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(234, 179, 8, 0.5)" },
          "100%": {
            boxShadow:
              "0 0 20px rgba(234, 179, 8, 0.8), 0 0 30px rgba(234, 179, 8, 0.6)",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        pulseGlow: {
          "0%, 100%": {
            boxShadow: "0 0 5px rgba(234, 179, 8, 0.5)",
            transform: "scale(1)",
          },
          "50%": {
            boxShadow: "0 0 20px rgba(234, 179, 8, 0.8)",
            transform: "scale(1.02)",
          },
        },
        bounceGentle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        scaleOut: {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(0.8)", opacity: "0" },
        },
        rotateIn: {
          "0%": { transform: "rotate(-180deg) scale(0.8)", opacity: "0" },
          "100%": { transform: "rotate(0deg) scale(1)", opacity: "1" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        textGlow: {
          "0%": { textShadow: "0 0 5px rgba(234, 179, 8, 0.5)" },
          "100%": {
            textShadow:
              "0 0 20px rgba(234, 179, 8, 0.8), 0 0 30px rgba(234, 179, 8, 0.6)",
          },
        },
      },
      backgroundImage: {
        "medieval-pattern":
          'url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23d4af37" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')',
        parchment: "linear-gradient(135deg, #f4f1e8 0%, #e8dcc0 100%)",
        stone: "linear-gradient(135deg, #8b7355 0%, #6b5b47 100%)",
        metal: "linear-gradient(135deg, #c0c0c0 0%, #a0a0a0 100%)",
      },
      boxShadow: {
        medieval:
          "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        "glow-gold": "0 0 20px rgba(234, 179, 8, 0.5)",
        "glow-silver": "0 0 20px rgba(192, 192, 192, 0.5)",
        "inner-glow": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)",
      },
    },
  },
  plugins: [],
} satisfies Config;
