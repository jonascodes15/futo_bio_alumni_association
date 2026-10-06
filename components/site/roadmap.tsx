import { Network, FlaskConical, Microscope } from "lucide-react";

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
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">Interim Roadmap</p>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">The 3 Pillars of Our First Year</h2>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {pillars.map(({ n, icon: Icon, title, body }) => (
            <article
              key={n}
              className="rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur transition hover:-translate-y-1 hover:border-gold-500/50"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-500 text-forest-950">
                  <Icon className="h-6 w-6" />
                </span>
                <span className="font-display text-4xl font-bold text-white/15">{n}</span>
              </div>
              <h3 className="mt-6 text-lg font-bold leading-snug">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/75">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
