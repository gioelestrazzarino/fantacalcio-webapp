import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  isValidPin,
  sessionToken,
  sessionCookieOptions,
} from "@/lib/auth";

export async function POST(request: Request) {
  let pin: unknown;
  try {
    ({ pin } = await request.json());
  } catch {
    return NextResponse.json({ error: "Richiesta non valida" }, { status: 400 });
  }

  if (typeof pin !== "string" || !isValidPin(pin.trim())) {
    return NextResponse.json({ error: "PIN errato" }, { status: 401 });
  }

  const store = await cookies();
  store.set(SESSION_COOKIE, sessionToken(), sessionCookieOptions());
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  return NextResponse.json({ ok: true });
}
