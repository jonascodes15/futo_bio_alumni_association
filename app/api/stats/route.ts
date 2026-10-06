import { NextResponse } from "next/server";
import { getPublicStats } from "@/lib/stats";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await getPublicStats());
  } catch {
    return NextResponse.json({ total: 0, countries: 0, topIndustries: [] });
  }
}
