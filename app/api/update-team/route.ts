import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, isValidSessionValue } from "@/lib/auth";
import { readTeams, writeTeamsLocal } from "@/lib/teams";
import {
  hasGithubToken,
  readTeamsFromGithub,
  commitTeamsToGithub,
} from "@/lib/github";
import { type Team } from "@/lib/types";

const MAX_LENGTH = 60;

interface UpdatePayload {
  id: string;
  member_one: string;
  member_two: string;
  member_one_paid: boolean;
  member_two_paid: boolean;
}

function parsePayload(body: unknown): UpdatePayload | null {
  if (typeof body !== "object" || body === null) return null;
  const b = body as Record<string, unknown>;
  const fields = ["id", "member_one", "member_two"] as const;
  if (!fields.every((f) => typeof b[f] === "string")) return null;
  const boolFields = ["member_one_paid", "member_two_paid"] as const;
  if (!boolFields.every((f) => typeof b[f] === "boolean")) return null;

  return {
    id: (b.id as string).trim(),
    member_one: (b.member_one as string).trim().slice(0, MAX_LENGTH),
    member_two: (b.member_two as string).trim().slice(0, MAX_LENGTH),
    member_one_paid: b.member_one_paid as boolean,
    member_two_paid: b.member_two_paid as boolean,
  };
}

function applyUpdate(teams: Team[], payload: UpdatePayload): Team | null {
  const team = teams.find((t) => t.id === payload.id);
  if (!team) return null;
  team.member_one = payload.member_one;
  team.member_two = payload.member_two;
  team.member_one_paid = payload.member_one_paid;
  team.member_two_paid = payload.member_two_paid;
  return team;
}

export async function POST(request: Request) {
  const store = await cookies();
  if (!isValidSessionValue(store.get(SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Richiesta non valida" }, { status: 400 });
  }
  const payload = parsePayload(body);
  if (!payload) {
    return NextResponse.json({ error: "Dati non validi" }, { status: 400 });
  }

  try {
    if (hasGithubToken()) {
      // Produzione: aggiorna il file nel repo con un commit diretto su main.
      const { teams, sha } = await readTeamsFromGithub();
      const team = applyUpdate(teams, payload);
      if (!team) {
        return NextResponse.json({ error: "Squadra non trovata" }, { status: 404 });
      }
      await commitTeamsToGithub(
        teams,
        sha,
        `Aggiorna Girone ${team.group} — slot ${team.slot_number}`
      );
    } else {
      // Sviluppo locale senza GITHUB_TOKEN: scrive direttamente il file.
      const teams = await readTeams();
      const team = applyUpdate(teams, payload);
      if (!team) {
        return NextResponse.json({ error: "Squadra non trovata" }, { status: 404 });
      }
      await writeTeamsLocal(teams);
    }
  } catch (err) {
    console.error("Errore salvataggio:", err);
    return NextResponse.json(
      { error: "Salvataggio fallito. Riprova tra qualche secondo." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
