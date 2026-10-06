import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { alumniWhere } from "@/lib/alumni-query";

export const dynamic = "force-dynamic";

function csvCell(v: unknown) {
  let s = v == null ? "" : String(v);
  // Neutralise spreadsheet formula injection.
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sp = new URL(req.url).searchParams;
  const rows = await prisma.alumniCensus.findMany({
    where: alumniWhere({
      q: sp.get("q") ?? undefined,
      year: sp.get("year") ?? undefined,
      industry: sp.get("industry") ?? undefined,
      country: sp.get("country") ?? undefined,
    }),
    orderBy: { createdAt: "desc" },
  });

  const header = [
    "Full Name", "Graduation Year", "Email", "Phone", "City", "Country",
    "Industry", "Role", "Company", "Mentorship", "Registered At",
  ];
  const lines = [header.map(csvCell).join(",")];
  for (const r of rows) {
    lines.push(
      [
        r.fullName, r.gradYear, r.email, r.phone, r.currentCity, r.currentCountry,
        r.industrySector, r.currentRole, r.company,
        r.interestedInMentorship ? "Yes" : "No", r.createdAt.toISOString(),
      ].map(csvCell).join(","),
    );
  }

  return new NextResponse("﻿" + lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="futo-bio-alumni-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
