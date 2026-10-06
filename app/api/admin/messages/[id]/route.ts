import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const { isRead } = (await req.json().catch(() => ({}))) as { isRead?: boolean };
  if (typeof isRead !== "boolean") {
    return NextResponse.json({ error: "isRead (boolean) required" }, { status: 400 });
  }
  await prisma.feedbackMessage.update({ where: { id }, data: { isRead } });
  return NextResponse.json({ ok: true });
}
