import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility function for merging Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Fluid color system with modern gradients
export const colors = {
  // Primary medieval gold with fluid variations
  gold: {
    50: "#fefce8",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b", // Base gold
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },
  // Steel/silver with modern metallic feel
  steel: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b", // Base steel
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
  },
  // Deep royal blue for accents
  royal: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6", // Base royal
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
  },
  // Rich emerald for success states
  emerald: {
    50: "#ecfdf5",
    100: "#d1fae5",
    200: "#a7f3d0",
    300: "#6ee7b7",
    400: "#34d399",
    500: "#10b981", // Base emerald
    600: "#059669",
    700: "#047857",
    800: "#065f46",
    900: "#064e3b",
  },
  // Warm amber for warnings
  amber: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b", // Base amber
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },
  // Deep crimson for errors
  crimson: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444", // Base crimson
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
  },
};

// Modern gradient combinations
export const gradients = {
  primary: "from-gold-400 via-gold-500 to-gold-600",
  secondary: "from-steel-400 via-steel-500 to-steel-600",
  royal: "from-royal-400 via-royal-500 to-royal-600",
  emerald: "from-emerald-400 via-emerald-500 to-emerald-600",
  amber: "from-amber-400 via-amber-500 to-amber-600",
  crimson: "from-crimson-400 via-crimson-500 to-crimson-600",

  // Complex multi-color gradients
  sunset: "from-gold-400 via-amber-500 to-crimson-500",
  ocean: "from-royal-400 via-steel-500 to-royal-600",
  forest: "from-emerald-400 via-steel-500 to-emerald-600",
  fire: "from-amber-400 via-crimson-500 to-amber-600",

  // Background gradients
  background: "from-steel-900 via-steel-800 to-steel-900",
  card: "from-steel-800/50 via-steel-700/30 to-steel-800/50",
  glass: "from-white/10 via-white/5 to-white/10",
};

// Modern shadow system
export const shadows = {
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
  "2xl": "shadow-2xl",
  inner: "shadow-inner",
  glow: "shadow-glow",
  "glow-lg": "shadow-glow-lg",
  "glow-xl": "shadow-glow-xl",
};

// Animation presets
export const animations = {
  // Framer Motion variants
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
    initial: { opacity: 0, scale: 0.8 },
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

// Modern component styles
export const components = {
  button: {
    base: "relative inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
    primary:
      "bg-gradient-to-r from-gold-500 to-gold-600 text-steel-900 hover:from-gold-400 hover:to-gold-500 focus:ring-gold-500 shadow-lg hover:shadow-xl transform hover:scale-105",
    secondary:
      "bg-gradient-to-r from-steel-600 to-steel-700 text-white hover:from-steel-500 hover:to-steel-600 focus:ring-steel-500 shadow-md hover:shadow-lg",
    ghost:
      "bg-transparent text-gold-400 hover:bg-gold-500/10 hover:text-gold-300 focus:ring-gold-500",
    danger:
      "bg-gradient-to-r from-crimson-500 to-crimson-600 text-white hover:from-crimson-400 hover:to-crimson-500 focus:ring-crimson-500 shadow-lg hover:shadow-xl",
  },
  card: {
    base: "bg-gradient-to-br from-steel-800/50 via-steel-700/30 to-steel-800/50 backdrop-blur-sm border border-steel-600/30 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300",
    glass:
      "bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300",
    interactive:
      "hover:scale-105 hover:border-gold-500/50 hover:shadow-glow cursor-pointer",
  },
  input: {
    base: "w-full px-4 py-3 bg-steel-800/50 border border-steel-600/50 rounded-lg text-white placeholder-steel-400 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all duration-300",
    error: "border-crimson-500 focus:ring-crimson-500",
  },
  badge: {
    base: "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
    gold: "bg-gold-500/20 text-gold-300 border border-gold-500/30",
    steel: "bg-steel-500/20 text-steel-300 border border-steel-500/30",
    emerald: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
    crimson: "bg-crimson-500/20 text-crimson-300 border border-crimson-500/30",
  },
};

// Responsive breakpoints
export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

// Typography scale
export const typography = {
  title:
    "text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent",
  subtitle: "text-xl md:text-2xl lg:text-3xl font-semibold text-gold-300",
  heading: "text-2xl md:text-3xl font-bold text-gold-400",
  body: "text-base md:text-lg text-steel-200",
  caption: "text-sm text-steel-400",
  small: "text-xs text-steel-500",
};
