import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  shadow?: "none" | "sm" | "md" | "lg" | "xl" | "2xl";
  key?: any;
}

export default function GlassCard({ children, className, hover = false, shadow }: GlassCardProps) {
  const shadowClasses = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
    "2xl": "shadow-2xl"
  };

  return (
    <motion.div
      whileHover={hover ? { y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' } : {}}
      className={cn(
        "glass-card p-6",
        shadow && shadowClasses[shadow],
        className
      )}
    >
      {children}
    </motion.div>
  );
}
