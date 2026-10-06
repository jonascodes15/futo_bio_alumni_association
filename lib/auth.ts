import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const SESSION_COOKIE = "futo_admin_session";
const MAX_AGE = 60 * 60 * 8; // 8 hours

function secret() {
  const s = process.env.NEXTAUTH_SECRET;
  if (!s) throw new Error("NEXTAUTH_SECRET is not set");
  return new TextEncoder().encode(s);
}

export async function createSessionToken(email: string) {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());
}

export async function verifySessionToken(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload as { email: string };
  } catch {
    return null;
  }
}

export async function getSession() {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

/** For route handlers: returns true if the request has a valid admin session. */
export async function isAdmin() {
  return (await getSession()) !== null;
}

export async function setSessionCookie(email: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, await createSessionToken(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** Checks env credentials first, then AdminUser rows in the database. */
export async function verifyCredentials(email: string, password: string) {
  const e = email.trim().toLowerCase();
  const envEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const envPass = process.env.ADMIN_PASSWORD;
  if (envEmail && envPass && e === envEmail && password === envPass) return true;

  try {
    const user = await prisma.adminUser.findUnique({ where: { email: e } });
    if (!user) return false;
    return await bcrypt.compare(password, user.passwordHash);
  } catch (err) {
    console.error("[auth] admin lookup failed", err);
    return false;
  }
}
