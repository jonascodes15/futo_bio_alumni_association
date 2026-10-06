"use client";

import { motion, stagger, type Variants } from "motion/react";

// Long, soft deceleration: quick to start, slow to settle.
export const EASE_PREMIUM = [0.22, 1, 0.36, 1] as const;

const viewport = { once: true, margin: "0px 0px -12% 0px" };

const reveal: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.98 },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.9, ease: EASE_PREMIUM, delay },
  }),
};

const item: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.9, ease: EASE_PREMIUM } },
};

/** Fades and lifts its content in the first time it scrolls into view. */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={reveal}
      custom={delay}
    >
      {children}
    </motion.div>
  );
}

/** Container whose <StaggerItem> children reveal one after another. */
export function Stagger({
  children,
  className,
  interval = 0.09,
}: {
  children: React.ReactNode;
  className?: string;
  interval?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={{ hidden: {}, show: { transition: { delayChildren: stagger(interval, { startDelay: 0.05 }) } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}
