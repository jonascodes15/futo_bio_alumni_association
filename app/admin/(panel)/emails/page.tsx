import { prisma } from "@/lib/prisma";
import { BroadcastForm } from "@/components/admin/broadcast-form";

export default async function EmailsPage() {
  const groups = await prisma.alumniCensus.groupBy({ by: ["industrySector"], _count: { _all: true } });
  const counts = Object.fromEntries(groups.map((g) => [g.industrySector, g._count._all]));
  const total = groups.reduce((n, g) => n + g._count._all, 0);

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-forest-900">Email Broadcast Center</h1>
        <p className="mt-1 text-slate-600">Send an update to all alumni or a specific industry segment.</p>
      </div>
      <BroadcastForm counts={counts} total={total} />
    </div>
  );
}
