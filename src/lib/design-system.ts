import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility function for merging Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Modern 2025 Color System
export const colors = {
  // Primary Gold Palette
  gold: {
    50: "#fefce8",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },
  // Steel/Slate Palette
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
  // Royal Blue Palette
  royal: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
  },
  // Emerald Palette
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
  // Crimson Palette
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
};

// Modern Gradient System
export const gradients = {
  // Single Color Gradients
  gold: "from-gold-400 via-gold-500 to-gold-600",
  steel: "from-steel-400 via-steel-500 to-steel-600",
  royal: "from-royal-400 via-royal-500 to-royal-600",
  emerald: "from-emerald-400 via-emerald-500 to-emerald-600",
  crimson: "from-crimson-400 via-crimson-500 to-crimson-600",

  // Multi-Color Gradients
  sunset: "from-gold-400 via-crimson-500 to-crimson-600",
  ocean: "from-royal-400 via-steel-500 to-royal-600",
  forest: "from-emerald-400 via-steel-500 to-emerald-600",
  fire: "from-crimson-400 via-gold-500 to-gold-600",
  mystic: "from-royal-500 via-crimson-500 to-gold-500",

  // Background Gradients
  background: "from-steel-900 via-steel-800 to-steel-900",
  card: "from-white/5 via-white/2 to-white/5",
  glass: "from-white/10 via-white/5 to-white/10",
};

// Modern Shadow System
export const shadows = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
  glow: "0 0 20px rgba(245, 158, 11, 0.3)",
  "glow-lg": "0 0 40px rgba(245, 158, 11, 0.4)",
  "glow-xl": "0 0 60px rgba(245, 158, 11, 0.5)",
};

// Animation Variants for Framer Motion
export const animations = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" },
  },
  slideUp: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  },
  slideDown: {
    initial: { opacity: 0, y: -40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  },
  slideLeft: {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  },
  slideRight: {
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  },
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: "easeOut" },
  },
  stagger: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
};

// Modern Component Styles
export const components = {
  button: {
    base: "relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden",
    primary:
      "bg-gradient-to-r from-[var(--theme-gold)] to-[var(--theme-gold-dark)] text-slate-900 hover:shadow-xl transform hover:scale-105 focus:ring-[var(--theme-gold)]",
    secondary:
      "border-2 border-[var(--theme-border)] hover:border-[var(--theme-accent)] text-[var(--theme-gold)] hover:bg-[var(--theme-gold)]/10",
    ghost:
      "bg-transparent text-[var(--theme-gold)] hover:bg-[var(--theme-gold)]/10",
    danger:
      "bg-gradient-to-r from-crimson-500 to-crimson-600 text-white hover:shadow-xl transform hover:scale-105",
    success:
      "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-xl transform hover:scale-105",
  },
  card: {
    base: "relative rounded-2xl backdrop-blur-xl border border-[var(--theme-border)] transition-all duration-300",
    glass:
      "bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300",
    interactive:
      "hover:scale-[1.02] hover:border-[var(--theme-accent)] hover:shadow-2xl cursor-pointer",
    elevated:
      "shadow-xl hover:shadow-2xl",
  },
  input: {
    base: "w-full px-4 py-3 rounded-xl border-2 border-[var(--theme-border)] bg-[var(--theme-card-bg)] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent)] focus:border-transparent transition-all duration-300",
    error: "border-crimson-500 focus:ring-crimson-500",
  },
  badge: {
    base: "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm border",
    gold: "bg-gold-500/10 text-gold-300 border-gold-500/30",
    steel: "bg-steel-500/10 text-steel-300 border-steel-500/30",
    emerald: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    crimson: "bg-crimson-500/10 text-crimson-300 border-crimson-500/30",
    royal: "bg-royal-500/10 text-royal-300 border-royal-500/30",
  },
};

// Responsive Breakpoints
export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

// Typography Scale - Enhanced Medieval System
export const typography = {
  display:
    "font-[Cinzel] text-5xl md:text-6xl lg:text-7xl font-bold text-[var(--theme-gold)] tracking-wide leading-tight",
  title:
    "font-[Cinzel] text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--theme-gold)] tracking-wide leading-tight",
  subtitle: "font-[Cinzel] text-2xl md:text-3xl lg:text-4xl font-semibold text-[var(--theme-gold)] leading-snug",
  heading: "font-[Cinzel] text-xl md:text-2xl lg:text-3xl font-semibold text-[var(--theme-gold)] leading-snug",
  body: "font-[Merriweather] text-base md:text-lg text-gray-200 leading-relaxed",
  bodySerif: "font-[Cormorant_Garamond] text-lg md:text-xl text-gray-200 leading-relaxed",
  caption: "font-[Inter] text-sm text-gray-400 tracking-wide",
  label: "font-[Cinzel] text-xs md:text-sm text-[var(--theme-gold)] uppercase tracking-wider font-medium",
  small: "text-xs text-gray-500",
};

// Spacing Scale
export const spacing = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem",
  "3xl": "4rem",
  "4xl": "6rem",
  "5xl": "8rem",
};

// Border Radius Scale
export const radius = {
  sm: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.5rem",
  "2xl": "2rem",
  full: "9999px",
};