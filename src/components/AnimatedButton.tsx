"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/design-system";

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
}

export function AnimatedButton({
  children,
  onClick,
  className,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
}: AnimatedButtonProps) {
  const variants = {
    primary:
      "bg-gradient-to-r from-gold-500 to-gold-600 text-steel-900 hover:from-gold-400 hover:to-gold-500 focus:ring-gold-500 shadow-lg hover:shadow-xl",
    secondary:
      "bg-gradient-to-r from-steel-600 to-steel-700 text-white hover:from-steel-500 hover:to-steel-600 focus:ring-steel-500 shadow-md hover:shadow-lg",
    ghost:
      "bg-transparent text-gold-400 hover:bg-gold-500/10 hover:text-gold-300 focus:ring-gold-500",
    danger:
      "bg-gradient-to-r from-crimson-500 to-crimson-600 text-white hover:from-crimson-400 hover:to-crimson-500 focus:ring-crimson-500 shadow-lg hover:shadow-xl",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "relative inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {loading && (
        <motion.div
          className="mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      )}
      {children}
    </motion.button>
  );
}
