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
      "backdrop-blur-sm bg-[var(--theme-card-bg)] border border-[var(--theme-border)]",
    glass: "bg-white/5 backdrop-blur-md border border-white/10",
    interactive:
      "backdrop-blur-sm bg-[var(--theme-card-bg)] border border-[var(--theme-border)] hover:border-[var(--theme-accent)] cursor-pointer",
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
      className={cn("transition-all duration-300", className)}
    >
      <Card 
        className={cn(
          "rounded-3xl shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.3)] transition-all duration-300",
          variants[variant],
          hover && "hover:shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.4)]"
        )}
      >
        {children}
      </Card>
    </motion.div>
  );
}
