import { promises as fs } from "fs";
import path from "path";
import type { Team } from "./types";

const DATA_PATH = path.join(process.cwd(), "data", "teams.json");

export async function readTeams(): Promise<Team[]> {
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  return JSON.parse(raw) as Team[];
}

export async function writeTeamsLocal(teams: Team[]): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify(teams, null, 2) + "\n", "utf-8");
}
