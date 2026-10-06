"use client";

import { useEffect, useState } from "react";
import { Users, Globe2, Briefcase } from "lucide-react";

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
    <section className="relative z-10 mx-auto -mt-14 max-w-5xl px-5">
      <div className="grid gap-px overflow-hidden rounded-2xl bg-forest-100 shadow-xl shadow-forest-900/10 ring-1 ring-forest-700/10 sm:grid-cols-3">
        <Stat icon={<Users className="h-5 w-5" />} value={stats.total.toLocaleString()} label="Registered Alumni" />
        <Stat icon={<Globe2 className="h-5 w-5" />} value={stats.countries.toLocaleString()} label="Countries Represented" />
        <div className="bg-white p-6">
          <div className="flex items-center gap-2 text-forest-700">
            <Briefcase className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-wider">Top Industries</span>
          </div>
          {stats.topIndustries.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">Be the first to register!</p>
          ) : (
            <ul className="mt-3 space-y-1 text-sm">
              {stats.topIndustries.map((i) => (
                <li key={i.name} className="flex justify-between gap-3">
                  <span className="truncate font-medium">{i.name}</span>
                  <span className="font-semibold text-forest-700">{i.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="bg-white p-6">
      <div className="flex items-center gap-2 text-forest-700">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <p className="mt-2 font-display text-4xl font-bold text-forest-900">{value}</p>
    </div>
  );
}
