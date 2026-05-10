import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  key?: any;
}

export default function GlassCard({ children, className, hover = false }: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' } : {}}
      className={cn(
        "glass-card p-6",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
