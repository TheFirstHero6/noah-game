"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/design-system";

interface StaggeredContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  direction?: "up" | "down" | "left" | "right";
}

export function StaggeredContainer({
  children,
  className,
  staggerDelay = 0.1,
  direction = "up",
}: StaggeredContainerProps) {
  const directionVariants = {
    up: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } },
    down: { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 } },
    left: { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 } },
    right: { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 } },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={{
        animate: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={cn(className)}
    >
      {Array.isArray(children) ? (
        children.map((child, index) => (
          <motion.div
            key={index}
            variants={directionVariants[direction]}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {child}
          </motion.div>
        ))
      ) : (
        <motion.div
          variants={directionVariants[direction]}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      )}
    </motion.div>
  );
}
