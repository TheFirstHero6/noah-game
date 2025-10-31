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
  // Map our custom variants to Figma button variants
  const variantMap: Record<string, VariantProps<typeof buttonVariants>["variant"]> = {
    primary: "default",
    secondary: "secondary",
    ghost: "ghost",
    danger: "destructive",
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
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="inline-block"
    >
      <Button
        onClick={onClick}
        disabled={disabled || loading}
        variant={mappedVariant}
        size={mappedSize}
        asChild={asChild}
        className={cn(
          // Theme-aware Figma styling
          variant === "primary" && "bg-gradient-to-r from-[var(--theme-gold)] to-[var(--theme-gold-dark)] text-slate-900",
          variant === "secondary" && "border-2 border-[var(--theme-border)] hover:border-[var(--theme-accent)] text-[var(--theme-gold)]",
          variant === "success" && "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl",
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
