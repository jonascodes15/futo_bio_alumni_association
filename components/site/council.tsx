import { UserRound } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

// Add `name` once announced; drop images in /public/council and set `photo`.
const council: { role: string; name?: string; bio: string; photo?: string }[] = [
  { role: "President", bio: "Leads the association's vision and represents alumni to the department and the university." },
  { role: "Vice President", bio: "Supports the President and coordinates the association's committees and programmes." },
  { role: "General Secretary", bio: "Keeps official records, minutes and correspondence of the association." },
  { role: "Financial Secretary", bio: "Manages dues, contributions and transparent financial reporting." },
  { role: "Public Relations Officer", bio: "Tells the alumni story and manages communication with members and the public." },
];

export function Council() {
  return (
    <section id="council" className="py-24">
      <div className="mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest-600">Leadership</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-forest-900 sm:text-4xl">Interim Executive Council</h2>
          <p className="mt-3 text-slate-600">The pioneers steering the association until our first general election.</p>
        </Reveal>
        {/* Flex rather than grid so an incomplete last row stays centred. */}
        <Stagger className="mt-14 flex flex-wrap justify-center gap-6">
          {council.map((m) => (
            <StaggerItem key={m.role} className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc((100%-3rem)/3)]">
              <article className="group h-full rounded-2xl bg-white p-7 text-center shadow-lg shadow-forest-900/5 ring-1 ring-forest-700/10 transition-[transform,box-shadow] duration-700 ease-premium hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-forest-900/15 hover:ring-forest-700/20">
                <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-forest-50 ring-4 ring-gold-500/60 transition-[box-shadow,transform] duration-700 ease-premium group-hover:scale-105 group-hover:ring-gold-500">
                  {m.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={m.photo}
                      alt={m.name ?? m.role}
                      className="h-full w-full object-cover transition-transform duration-700 ease-premium group-hover:scale-110"
                    />
                  ) : (
                    <UserRound className="h-14 w-14 text-forest-600/60" />
                  )}
                </div>
                {m.name ? (
                  <>
                    <p className="mt-5 text-xs font-bold uppercase tracking-widest text-forest-600">{m.role}</p>
                    <h3 className="mt-1 font-display text-xl font-bold text-forest-900">{m.name}</h3>
                  </>
                ) : (
                  // No name yet: the role itself becomes the card's heading.
                  <h3 className="mt-5 font-display text-xl font-bold text-forest-900">{m.role}</h3>
                )}
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{m.bio}</p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
