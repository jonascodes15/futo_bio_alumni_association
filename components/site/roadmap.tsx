import { Network, FlaskConical, Microscope } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { SpotlightCard } from "@/components/motion/spotlight-card";

const pillars = [
  {
    n: "01",
    icon: Network,
    title: "Global Alumni Census & Network Directory",
    body: "A verified, searchable directory of every FUTO bioscientist, so classmates reconnect and careers, referrals and collaborations flow.",
  },
  {
    n: "02",
    icon: FlaskConical,
    title: "Undergraduate Final-Year Research Mentorship & Grant Fund",
    body: "Pairing final-year students with alumni mentors and funding project research to produce stronger graduates.",
  },
  {
    n: "03",
    icon: Microscope,
    title: "Departmental Laboratory & Facility Support",
    body: "Pooling alumni contributions to equip teaching laboratories and improve facilities for the next generation.",
  },
];

export function Roadmap() {
  return (
    <section id="roadmap" className="dna-bg py-24 text-white">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">Interim Roadmap</p>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">The 3 Pillars of Our First Year</h2>
        </Reveal>
        <Stagger className="mt-14 grid gap-6 md:grid-cols-3" interval={0.12}>
          {pillars.map(({ n, icon: Icon, title, body }) => (
            <StaggerItem key={n}>
              <SpotlightCard className="h-full rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur transition-[transform,border-color,box-shadow] duration-700 ease-premium hover:-translate-y-1.5 hover:border-gold-500/50 hover:shadow-2xl hover:shadow-black/30">
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500 text-forest-950 transition-transform duration-700 ease-premium group-hover:-rotate-6 group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="font-display text-4xl font-bold text-white/15 transition-colors duration-700 ease-premium group-hover:text-gold-500/40">
                    {n}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-bold leading-snug">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/75">{body}</p>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
