import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  fullName: z.string().trim().min(2, "Name is required").max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  type: z.enum(["SUGGESTION", "NEWSLETTER_SUBSCRIBE", "INQUIRY"]),
  message: z.string().trim().max(4000).default(""),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }
  const d = parsed.data;
  if (d.type !== "NEWSLETTER_SUBSCRIBE" && d.message.length < 5) {
    return NextResponse.json({ error: "Please write a message" }, { status: 400 });
  }

  await prisma.feedbackMessage.create({
    data: {
      ...d,
      message: d.message || "Subscribed to newsletter",
    },
  });
  return NextResponse.json({ ok: true }, { status: 201 });
}
