"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Card with a soft glow that follows the cursor. The position is written
 * straight to CSS variables, so moving the mouse never re-renders React.
 */
export function SpotlightCard({
  children,
  className,
  glow = "rgb(245 197 24 / 0.16)",
}: {
  children: React.ReactNode;
  className?: string;
  glow?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  function onPointerMove(e: React.PointerEvent<HTMLElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
  }

  return (
    <article ref={ref} onPointerMove={onPointerMove} className={cn("group relative overflow-hidden", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-premium group-hover:opacity-100"
        style={{
          background: `radial-gradient(420px circle at var(--spot-x, 50%) var(--spot-y, 50%), ${glow}, transparent 65%)`,
        }}
      />
      <div className="relative">{children}</div>
    </article>
  );
}
