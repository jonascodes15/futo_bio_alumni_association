import { prisma } from "@/lib/prisma";

export async function getPublicStats() {
  const [total, countries, industries] = await Promise.all([
    prisma.alumniCensus.count(),
    prisma.alumniCensus.groupBy({ by: ["currentCountry"] }),
    prisma.alumniCensus.groupBy({
      by: ["industrySector"],
      _count: { _all: true },
      orderBy: { _count: { industrySector: "desc" } },
      take: 3,
    }),
  ]);
  return {
    total,
    countries: countries.length,
    topIndustries: industries.map((i) => ({ name: i.industrySector, count: i._count._all })),
  };
}
