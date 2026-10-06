import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { sendWelcome } from "@/lib/welcome";

const schema = z.object({
  fullName: z.string().trim().min(2, "Full name is required").max(120),
  gradYear: z.coerce.number().int().min(1970).max(new Date().getFullYear() + 1),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  phone: z.string().trim().min(6, "Enter a valid phone number").max(30),
  currentCity: z.string().trim().min(1, "City is required").max(80),
  currentCountry: z.string().trim().min(1, "Country is required").max(80),
  industrySector: z.string().trim().min(1, "Select an industry").max(80),
  currentRole: z.string().trim().max(120).optional().or(z.literal("")),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  interestedInMentorship: z.boolean().optional().default(false),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }
  const d = parsed.data;

  try {
    const record = await prisma.alumniCensus.create({
      data: {
        ...d,
        currentRole: d.currentRole || null,
        company: d.company || null,
      },
    });
    // Welcome email must never block or fail the registration.
    const mail = await sendWelcome(record.fullName, record.email).catch(() => ({ ok: false }));
    return NextResponse.json({ ok: true, emailSent: mail.ok }, { status: 201 });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return NextResponse.json(
        { error: "This email is already registered in the census." },
        { status: 409 },
      );
    }
    console.error("[census]", e);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
