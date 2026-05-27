'use client';

import { motion } from 'motion/react';
import { ReactNode } from 'react';

export function FadeUp({
  children,
  delay = 0,
  className = "",
  stagger = false
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  stagger?: boolean;
}) {
  if (stagger) {
    return (
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15, margin: "0px 0px -50px 0px" }}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.1,
              delayChildren: delay
            }
          }
        }}
        className={`fade-up ${className}`}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -50px 0px" }}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={`fade-up ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function FadeUpItem({ children, className = "" }: { children: ReactNode, className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] } }
      }}
      className={`fade-up-item ${className}`}
    >
      {children}
    </motion.div>
  );
}
