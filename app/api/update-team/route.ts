import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, isValidSessionValue } from "@/lib/auth";
import { readTeams, writeTeamsLocal } from "@/lib/teams";
import {
  hasGithubToken,
  readTeamsFromGithub,
  commitTeamsToGithub,
} from "@/lib/github";
import { LAST_YEAR_RESULTS, type Team } from "@/lib/types";

const MAX_LENGTH = 60;

interface UpdatePayload {
  id: string;
  team_name: string;
  member_one: string;
  member_two: string;
  last_year_result: string;
}

function parsePayload(body: unknown): UpdatePayload | null {
  if (typeof body !== "object" || body === null) return null;
  const b = body as Record<string, unknown>;
  const fields = ["id", "team_name", "member_one", "member_two", "last_year_result"] as const;
  if (!fields.every((f) => typeof b[f] === "string")) return null;

  const payload: UpdatePayload = {
    id: (b.id as string).trim(),
    team_name: (b.team_name as string).trim().slice(0, MAX_LENGTH),
    member_one: (b.member_one as string).trim().slice(0, MAX_LENGTH),
    member_two: (b.member_two as string).trim().slice(0, MAX_LENGTH),
    last_year_result: (b.last_year_result as string).trim(),
  };
  if (
    payload.last_year_result !== "" &&
    !LAST_YEAR_RESULTS.includes(payload.last_year_result as (typeof LAST_YEAR_RESULTS)[number])
  ) {
    return null;
  }
  return payload;
}

function applyUpdate(teams: Team[], payload: UpdatePayload): Team | null {
  const team = teams.find((t) => t.id === payload.id);
  if (!team) return null;
  team.team_name = payload.team_name;
  team.member_one = payload.member_one;
  team.member_two = payload.member_two;
  team.last_year_result = payload.last_year_result;
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
