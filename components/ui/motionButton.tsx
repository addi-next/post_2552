"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./button";

interface MotionButtonProps
  extends React.ComponentPropsWithoutRef<typeof motion.button> {
  children: React.ReactNode;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const MotionButton = ({
  children,
  className = "",
  variant = "default",
  size = "default",
  ...props
}: MotionButtonProps) => {
  return (
    <motion.button
      className={cn(buttonVariants({ variant, size }), className)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17,
      }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default MotionButton;
