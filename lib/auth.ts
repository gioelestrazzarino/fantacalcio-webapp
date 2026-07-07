import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "fanta_admin";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 giorni

function adminPin(): string {
  const pin = process.env.ADMIN_PIN;
  if (!pin) {
    throw new Error("ADMIN_PIN non configurato nelle variabili d'ambiente");
  }
  return pin;
}

// Il valore del cookie è un HMAC derivato dal PIN: verificabile lato server
// senza alcun database di sessioni.
export function sessionToken(): string {
  return createHmac("sha256", adminPin())
    .update("fantacalcio-admin-session-v1")
    .digest("hex");
}

export function isValidSessionValue(value: string | undefined): boolean {
  if (!value) return false;
  const expected = Buffer.from(sessionToken());
  const received = Buffer.from(value);
  return (
    expected.length === received.length && timingSafeEqual(expected, received)
  );
}

export function isValidPin(pin: string): boolean {
  const expected = Buffer.from(adminPin());
  const received = Buffer.from(pin);
  return (
    expected.length === received.length && timingSafeEqual(expected, received)
  );
}

export async function isAdminSession(): Promise<boolean> {
  const store = await cookies();
  return isValidSessionValue(store.get(SESSION_COOKIE)?.value);
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE,
  };
}
