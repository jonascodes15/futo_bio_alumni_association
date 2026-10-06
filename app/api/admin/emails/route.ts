import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { emailShell, escapeHtml } from "@/lib/email";

const schema = z.object({
  subject: z.string().trim().min(3).max(200),
  body: z.string().trim().min(10).max(20000),
  industry: z.string().trim().optional(), // empty / "ALL" = everyone
  mentorsOnly: z.boolean().optional(),
});

/** Plain text -> simple HTML paragraphs, with **bold** and bare URLs supported. */
function bodyToHtml(text: string) {
  return escapeHtml(text)
    .split(/\n{2,}/)
    .map((p) => {
      const html = p
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" style="color:#0b5d33">$1</a>')
        .replace(/\n/g, "<br/>");
      return `<p style="margin:0 0 14px">${html}</p>`;
    })
    .join("");
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "RESEND_API_KEY is not configured" }, { status: 500 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }
  const { subject, body, industry, mentorsOnly } = parsed.data;

  const recipients = await prisma.alumniCensus.findMany({
    where: {
      ...(industry && industry !== "ALL" ? { industrySector: industry } : {}),
      ...(mentorsOnly ? { interestedInMentorship: true } : {}),
    },
    select: { email: true },
  });
  if (recipients.length === 0) {
    return NextResponse.json({ error: "No alumni match this segment" }, { status: 400 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const from = process.env.EMAIL_FROM || "FUTO Bio Alumni <onboarding@resend.dev>";
  const html = emailShell(bodyToHtml(body));

  // Each recipient gets an individual message so addresses are never exposed.
  const BATCH = 100;
  let sent = 0;
  let failed = 0;
  for (let i = 0; i < recipients.length; i += BATCH) {
    const chunk = recipients.slice(i, i + BATCH);
    const { error } = await resend.batch.send(
      chunk.map((r) => ({ from, to: [r.email], subject, html })),
    );
    if (error) failed += chunk.length;
    else sent += chunk.length;
  }

  return NextResponse.json({ ok: failed === 0, sent, failed, total: recipients.length });
}
