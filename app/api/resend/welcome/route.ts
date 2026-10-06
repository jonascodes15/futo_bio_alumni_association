import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { sendWelcome } from "@/lib/welcome";

/**
 * Re-sends the welcome email to a registered alumnus.
 * Open to the public only for registrations made in the last 10 minutes
 * (so it can't be used to spam arbitrary addresses); admins can resend any time.
 */
export async function POST(req: Request) {
  const { email } = (await req.json().catch(() => ({}))) as { email?: string };
  if (!email) return NextResponse.json({ error: "email is required" }, { status: 400 });

  const record = await prisma.alumniCensus.findUnique({
    where: { email: email.trim().toLowerCase() },
  });
  if (!record) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const fresh = Date.now() - record.createdAt.getTime() < 10 * 60 * 1000;
  if (!fresh && !(await isAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const res = await sendWelcome(record.fullName, record.email);
  if (!res.ok) return NextResponse.json({ error: res.error }, { status: 502 });
  return NextResponse.json({ ok: true });
}
