import type { Prisma } from "@prisma/client";

export type AlumniFilters = {
  q?: string;
  year?: string;
  industry?: string;
  country?: string;
};

export function alumniWhere(f: AlumniFilters): Prisma.AlumniCensusWhereInput {
  const where: Prisma.AlumniCensusWhereInput = {};
  if (f.q) {
    where.OR = [
      { fullName: { contains: f.q, mode: "insensitive" } },
      { email: { contains: f.q, mode: "insensitive" } },
      { company: { contains: f.q, mode: "insensitive" } },
      { currentCity: { contains: f.q, mode: "insensitive" } },
    ];
  }
  if (f.year && !Number.isNaN(Number(f.year))) where.gradYear = Number(f.year);
  if (f.industry) where.industrySector = f.industry;
  if (f.country) where.currentCountry = f.country;
  return where;
}
