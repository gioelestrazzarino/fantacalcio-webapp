export const GROUPS = ["A", "B", "C", "D"] as const;
export type Group = (typeof GROUPS)[number];

export const LAST_YEAR_RESULTS = [
  "NA",
  "10th GS",
  "9th GS",
  "8th GS",
  "R16",
  "QF",
  "4th",
  "3rd",
  "2nd",
  "1st",
] as const;
export type LastYearResult = (typeof LAST_YEAR_RESULTS)[number];

export interface Team {
  id: string;
  group: Group;
  slot_number: number;
  team_name: string;
  member_one: string;
  member_two: string;
  member_one_paid: boolean;
  member_two_paid: boolean;
  last_year_result: string;
}

export const PAYMENT_DEADLINE = "Scadenza pagamento: 14 agosto";
export const FEE_PER_PERSON = 20;
export const TOTAL_PARTICIPANTS = 64;
// Inizio asta: 22 agosto 2026, ore 8:00 (Europe/Rome, CEST = UTC+2)
export const AUCTION_START_ISO = "2026-08-22T08:00:00+02:00";

export const AUCTION_INFO: Record<Group, string> = {
  A: "Asta: 22 agosto mattina",
  B: "Asta: 22 agosto pomeriggio",
  C: "Asta: 23 agosto mattina",
  D: "Asta: 23 agosto pomeriggio",
};

export function countMembers(teams: Team[]): number {
  return teams.reduce(
    (acc, t) =>
      acc + (t.member_one.trim() ? 1 : 0) + (t.member_two.trim() ? 1 : 0),
    0
  );
}

export function countPaid(teams: Team[]): number {
  return teams.reduce(
    (acc, t) => acc + (t.member_one_paid ? 1 : 0) + (t.member_two_paid ? 1 : 0),
    0
  );
}
