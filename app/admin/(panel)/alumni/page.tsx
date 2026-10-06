import Link from "next/link";
import { Download, Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { alumniWhere } from "@/lib/alumni-query";
import { INDUSTRIES } from "@/lib/utils";

type SP = { q?: string; year?: string; industry?: string; country?: string };

export default async function AlumniPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const [rows, years, countries] = await Promise.all([
    prisma.alumniCensus.findMany({ where: alumniWhere(sp), orderBy: { createdAt: "desc" }, take: 500 }),
    prisma.alumniCensus.groupBy({ by: ["gradYear"], orderBy: { gradYear: "desc" } }),
    prisma.alumniCensus.groupBy({ by: ["currentCountry"], orderBy: { currentCountry: "asc" } }),
  ]);

  const qs = new URLSearchParams(Object.entries(sp).filter(([, v]) => v) as [string, string][]).toString();
  const filtered = Boolean(qs);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold text-forest-900">Alumni Directory</h1>
        <a
          href={`/api/admin/alumni/export${qs ? `?${qs}` : ""}`}
          className="inline-flex items-center gap-2 rounded-lg bg-forest-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-forest-600"
        >
          <Download className="h-4 w-4" /> Export {filtered ? "filtered view" : "all"} to CSV
        </a>
      </div>

      <form className="grid gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-forest-700/10 sm:grid-cols-2 lg:grid-cols-5">
        <div className="relative lg:col-span-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input name="q" defaultValue={sp.q} placeholder="Search name, email, company, city" className="field pl-9" />
        </div>
        <select name="year" defaultValue={sp.year ?? ""} className="field">
          <option value="">All years</option>
          {years.map((y) => (
            <option key={y.gradYear} value={y.gradYear}>{y.gradYear}</option>
          ))}
        </select>
        <select name="industry" defaultValue={sp.industry ?? ""} className="field">
          <option value="">All industries</option>
          {INDUSTRIES.map((i) => (
            <option key={i} value={i}>{i}</option>
          ))}
        </select>
        <select name="country" defaultValue={sp.country ?? ""} className="field">
          <option value="">All countries</option>
          {countries.map((c) => (
            <option key={c.currentCountry} value={c.currentCountry}>{c.currentCountry}</option>
          ))}
        </select>
        <div className="flex gap-2 sm:col-span-2 lg:col-span-5">
          <button className="rounded-lg bg-forest-900 px-4 py-2 text-sm font-semibold text-white hover:bg-forest-800">
            Apply filters
          </button>
          {filtered && (
            <Link href="/admin/alumni" className="rounded-lg border border-[#cfdcd3] px-4 py-2 text-sm font-semibold text-forest-800 hover:bg-forest-50">
              Clear
            </Link>
          )}
        </div>
      </form>

      <p className="text-sm text-slate-500">
        Showing {rows.length}
        {rows.length === 500 ? "+ (first 500; export CSV for everything)" : ""} record{rows.length === 1 ? "" : "s"}
      </p>

      <div className="overflow-x-auto rounded-xl bg-white shadow-sm ring-1 ring-forest-700/10">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-forest-50 text-xs uppercase tracking-wide text-forest-800">
            <tr>
              {["Name", "Class", "Email", "Phone", "Location", "Industry", "Role / Company", "Mentor", "Joined"].map((h) => (
                <th key={h} className="px-4 py-3 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-forest-100">
            {rows.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-slate-500">No alumni match.</td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-forest-50/50">
                <td className="px-4 py-3 font-medium">{r.fullName}</td>
                <td className="px-4 py-3">{r.gradYear}</td>
                <td className="px-4 py-3">{r.email}</td>
                <td className="px-4 py-3">{r.phone}</td>
                <td className="px-4 py-3">{r.currentCity}, {r.currentCountry}</td>
                <td className="px-4 py-3">{r.industrySector}</td>
                <td className="px-4 py-3">{[r.currentRole, r.company].filter(Boolean).join(" @ ") || "-"}</td>
                <td className="px-4 py-3">{r.interestedInMentorship ? "Yes" : "-"}</td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-500">{r.createdAt.toLocaleDateString("en-GB")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
