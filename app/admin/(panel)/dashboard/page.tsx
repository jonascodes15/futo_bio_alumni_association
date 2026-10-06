import { Users, Globe2, GraduationCap, Inbox } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function Dashboard() {
  const [total, countries, mentors, unread, recent, byIndustry] = await Promise.all([
    prisma.alumniCensus.count(),
    prisma.alumniCensus.groupBy({ by: ["currentCountry"] }).then((r) => r.length),
    prisma.alumniCensus.count({ where: { interestedInMentorship: true } }),
    prisma.feedbackMessage.count({ where: { isRead: false } }),
    prisma.alumniCensus.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.alumniCensus.groupBy({
      by: ["industrySector"],
      _count: { _all: true },
      orderBy: { _count: { industrySector: "desc" } },
    }),
  ]);

  const cards = [
    { label: "Total Registered Alumni", value: total, icon: Users },
    { label: "Countries Represented", value: countries, icon: Globe2 },
    { label: "Mentors Opted-In", value: mentors, icon: GraduationCap },
    { label: "Unread Messages", value: unread, icon: Inbox },
  ];
  const max = Math.max(1, ...byIndustry.map((i) => i._count._all));

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-bold text-forest-900">Overview</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-forest-700/10">
            <div className="flex items-center justify-between text-forest-700">
              <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
              <Icon className="h-5 w-5" />
            </div>
            <p className="mt-3 font-display text-4xl font-bold text-forest-900">{value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-forest-700/10">
          <h2 className="font-semibold text-forest-900">Alumni by Industry</h2>
          {byIndustry.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">No registrations yet.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {byIndustry.map((i) => (
                <li key={i.industrySector}>
                  <div className="flex justify-between text-sm">
                    <span>{i.industrySector}</span>
                    <span className="font-semibold">{i._count._all}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-forest-100">
                    <div className="h-2 rounded-full bg-forest-600" style={{ width: `${(i._count._all / max) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-forest-700/10">
          <h2 className="font-semibold text-forest-900">Latest Registrations</h2>
          {recent.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">No registrations yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-forest-100">
              {recent.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{r.fullName}</p>
                    <p className="truncate text-slate-500">
                      {r.currentCity}, {r.currentCountry} · Class of {r.gradYear}
                    </p>
                  </div>
                  <time className="shrink-0 text-xs text-slate-400">{r.createdAt.toLocaleDateString("en-GB")}</time>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
