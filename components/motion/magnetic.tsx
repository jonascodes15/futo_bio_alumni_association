"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useSpring } from "motion/react";

const spring = { stiffness: 180, damping: 16, mass: 0.5 };

/**
 * Pulls its child gently toward the cursor while hovered, then springs back.
 * Only reacts to precise pointers (mouse / trackpad), never touch.
 */
export function Magnetic({
  children,
  strength = 0.25,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);

  function onPointerMove(e: React.PointerEvent<HTMLSpanElement>) {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.span
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      style={{ x, y }}
      className={className ?? "inline-block"}
    >
      {children}
    </motion.span>
  );
}
