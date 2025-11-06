"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/design-system";
import { Button, buttonVariants } from "@/components/ui/button";

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success" | VariantProps<typeof buttonVariants>["variant"];
  size?: "sm" | "md" | "lg" | VariantProps<typeof buttonVariants>["size"];
  disabled?: boolean;
  loading?: boolean;
  asChild?: boolean;
}

export function AnimatedButton({
  children,
  onClick,
  className,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  asChild = false,
}: AnimatedButtonProps) {
  // Map our custom variants to button variants
  const variantMap: Record<string, VariantProps<typeof buttonVariants>["variant"]> = {
    primary: "default",
    secondary: "secondary",
    ghost: "ghost",
    danger: "destructive",
    success: "default",
  };

  const sizeMap: Record<string, VariantProps<typeof buttonVariants>["size"]> = {
    sm: "sm",
    md: "default",
    lg: "lg",
  };

  const mappedVariant = variantMap[variant as string] || (variant as VariantProps<typeof buttonVariants>["variant"]) || "default";
  const mappedSize = sizeMap[size as string] || (size as VariantProps<typeof buttonVariants>["size"]) || "default";

  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className="inline-block"
    >
      <Button
        onClick={onClick}
        disabled={disabled || loading}
        variant={mappedVariant}
        size={mappedSize}
        asChild={asChild}
        className={cn(
          "rounded-xl font-[Cinzel] tracking-wide overflow-hidden relative",
          // Theme-aware styling with modern gradients
          variant === "primary" && [
            "bg-gradient-to-r from-[var(--theme-gold)] to-[var(--theme-gold-dark)] text-slate-900 font-semibold",
            "shadow-[0_4px_12px_rgba(234,179,8,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]",
            "hover:shadow-[0_8px_24px_rgba(234,179,8,0.4)]",
            "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
            "before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-600",
          ],
          variant === "secondary" && [
            "border-2 border-[var(--theme-border)] hover:border-[var(--theme-accent)] text-[var(--theme-gold)]",
            "bg-transparent hover:bg-[var(--theme-gold)]/10",
          ],
          variant === "success" && [
            "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold",
            "shadow-[0_4px_12px_rgba(16,185,129,0.3)]",
            "hover:shadow-[0_8px_24px_rgba(16,185,129,0.4)]",
          ],
          variant === "danger" && [
            "shadow-[0_4px_12px_rgba(239,68,68,0.3)]",
            "hover:shadow-[0_8px_24px_rgba(239,68,68,0.4)]",
          ],
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
      </Button>
    </motion.div>
  );
}
