"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/design-system";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "default" | "glass" | "interactive";
  hover?: boolean;
}

export function AnimatedCard({
  children,
  className,
  delay = 0,
  variant = "default",
  hover = true,
}: AnimatedCardProps) {
  const variants = {
    default:
      "bg-gradient-to-br from-steel-800/50 via-steel-700/30 to-steel-800/50 backdrop-blur-sm border border-steel-600/30",
    glass: "bg-white/5 backdrop-blur-md border border-white/10",
    interactive:
      "bg-gradient-to-br from-steel-800/50 via-steel-700/30 to-steel-800/50 backdrop-blur-sm border border-steel-600/30 hover:border-gold-500/50 hover:shadow-glow cursor-pointer",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay,
        ease: "easeOut",
      }}
      whileHover={
        hover
          ? {
              y: -8,
              scale: 1.02,
              transition: { duration: 0.3 },
            }
          : {}
      }
      className={cn(
        "rounded-xl shadow-xl transition-all duration-300",
        variants[variant],
        className
      )}
    >
      {children}
    </motion.div>
  );
}
