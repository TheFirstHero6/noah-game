"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/design-system";
import { Card } from "@/components/ui/card";

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
      "backdrop-blur-xl bg-[var(--theme-card-bg)] border border-[var(--theme-border)]",
    glass: "bg-white/5 backdrop-blur-md border border-white/10",
    interactive:
      "backdrop-blur-xl bg-[var(--theme-card-bg)] border border-[var(--theme-border)] hover:border-[var(--theme-accent)] cursor-pointer",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.33, 1, 0.68, 1],
      }}
      whileHover={
        hover
          ? {
              y: -6,
              scale: 1.01,
              transition: { duration: 0.3, ease: [0.33, 1, 0.68, 1] },
            }
          : {}
      }
      className={cn("transition-all duration-300", className)}
    >
      <Card 
        className={cn(
          "rounded-2xl transition-all duration-300",
          "shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]",
          variants[variant],
          hover && "hover:shadow-[0_20px_40px_rgba(0,0,0,0.3),0_0_30px_rgba(234,179,8,0.2)]"
        )}
      >
        {children}
      </Card>
    </motion.div>
  );
}
