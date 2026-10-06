import { NextResponse } from "next/server";
import { setSessionCookie, verifyCredentials } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = (await req.json().catch(() => ({}))) as {
    email?: string;
    password?: string;
  };
  if (!email || !password || !(await verifyCredentials(email, password))) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }
  await setSessionCookie(email.trim().toLowerCase());
  return NextResponse.json({ ok: true });
}
