import { UserRound } from "lucide-react";

// Replace names / bios / photos (drop images in /public/council and set `photo`).
const council: { role: string; name: string; bio: string; photo?: string }[] = [
  { role: "President", name: "To Be Announced", bio: "Leads the association's vision and represents alumni to the department and the university." },
  { role: "Vice President", name: "To Be Announced", bio: "Supports the President and coordinates the association's committees and programmes." },
  { role: "General Secretary", name: "To Be Announced", bio: "Keeps official records, minutes and correspondence of the association." },
  { role: "Legal Advisor", name: "To Be Announced", bio: "Guides the council on the constitution, governance and compliance." },
  { role: "Financial Secretary", name: "To Be Announced", bio: "Manages dues, contributions and transparent financial reporting." },
  { role: "Public Relations Officer", name: "To Be Announced", bio: "Tells the alumni story and manages communication with members and the public." },
];

export function Council() {
  return (
    <section id="council" className="py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest-600">Leadership</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-forest-900 sm:text-4xl">Interim Executive Council</h2>
          <p className="mt-3 text-slate-600">The pioneers steering the association until our first general election.</p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {council.map((m) => (
            <article key={m.role} className="rounded-2xl bg-white p-7 text-center shadow-lg shadow-forest-900/5 ring-1 ring-forest-700/10">
              <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-forest-50 ring-4 ring-gold-500/60">
                {m.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.photo} alt={m.name} className="h-full w-full object-cover" />
                ) : (
                  <UserRound className="h-14 w-14 text-forest-600/60" />
                )}
              </div>
              <p className="mt-5 text-xs font-bold uppercase tracking-widest text-forest-600">{m.role}</p>
              <h3 className="mt-1 font-display text-xl font-bold text-forest-900">{m.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{m.bio}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
