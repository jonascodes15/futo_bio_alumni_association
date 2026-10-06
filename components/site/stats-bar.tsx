"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion, useSpring, useTransform } from "motion/react";
import { Users, Globe2, Briefcase } from "lucide-react";
import { EASE_PREMIUM } from "@/components/motion/reveal";

export type Stats = {
  total: number;
  countries: number;
  topIndustries: { name: string; count: number }[];
};

export function StatsBar({ initial }: { initial: Stats }) {
  const [stats, setStats] = useState(initial);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch("/api/stats", { cache: "no-store" });
        if (res.ok && active) setStats(await res.json());
      } catch {
        /* keep last known stats */
      }
    };
    load();
    const id = setInterval(load, 20000);
    window.addEventListener("census:registered", load);
    return () => {
      active = false;
      clearInterval(id);
      window.removeEventListener("census:registered", load);
    };
  }, []);

  return (
    <section className="relative z-10 mx-auto -mt-14 max-w-5xl animate-rise px-5" style={{ animationDelay: "1000ms" }}>
      <div className="grid gap-px overflow-hidden rounded-2xl bg-forest-100 shadow-xl shadow-forest-900/10 ring-1 ring-forest-700/10 sm:grid-cols-3">
        <Stat icon={<Users className="h-5 w-5" />} value={stats.total} label="Registered Alumni" />
        <Stat icon={<Globe2 className="h-5 w-5" />} value={stats.countries} label="Countries Represented" />
        <div className="bg-white p-6">
          <div className="flex items-center gap-2 text-forest-700">
            <Briefcase className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Top Industries</span>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            {stats.topIndustries.length === 0 ? (
              <motion.p key="empty" {...fade} className="mt-3 text-sm text-slate-500">
                Be the first to register!
              </motion.p>
            ) : (
              <motion.ul key="list" {...fade} className="mt-3 space-y-1 text-sm">
                <AnimatePresence initial={false}>
                  {stats.topIndustries.map((i) => (
                    // `layout` lets rows glide to their new rank when counts change.
                    <motion.li
                      key={i.name}
                      layout
                      {...fade}
                      transition={{ duration: 0.6, ease: EASE_PREMIUM }}
                      className="flex justify-between gap-3"
                    >
                      <span className="truncate font-medium">{i.name}</span>
                      <span className="font-semibold tabular-nums text-forest-700">{i.count}</span>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

const fade = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.4, ease: EASE_PREMIUM },
};

function Stat({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="bg-white p-6">
      <div className="flex items-center gap-2 text-forest-700">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <p className="mt-2 font-display text-4xl font-bold tabular-nums text-forest-900">
        <CountUp value={value} />
      </p>
    </div>
  );
}

/** Counts up from zero once visible, then glides to any new value the live stats bring. */
function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const spring = useSpring(0, { stiffness: 60, damping: 20 });
  const text = useTransform(spring, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    if (!inView) return;
    if (reduce) spring.jump(value);
    else spring.set(value);
  }, [inView, reduce, value, spring]);

  return <motion.span ref={ref}>{text}</motion.span>;
}
