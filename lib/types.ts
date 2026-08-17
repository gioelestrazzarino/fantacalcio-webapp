export const GROUPS = ["A", "B"] as const;
export type Group = (typeof GROUPS)[number];

export const SLOTS_PER_GROUP = 12;
export const MEMBERS_PER_GROUP = SLOTS_PER_GROUP * 2; // 24
export const TOTAL_MEMBERS = GROUPS.length * MEMBERS_PER_GROUP; // 48

export interface Team {
  id: string;
  group: Group;
  slot_number: number;
  member_one: string;
  member_two: string;
  member_one_paid: boolean;
  member_two_paid: boolean;
}

export const PAYMENT_DEADLINE = "Scadenza pagamento: 14 agosto";
export const FEE_PER_PERSON = 20;
// Inizio asta: sabato 22 agosto 2026, ore 10:00 (Europe/Rome, CEST = UTC+2)
export const AUCTION_START_ISO = "2026-08-22T10:00:00+02:00";

export const AUCTION_INFO: Record<Group, string> = {
  A: "Asta: sabato 22 agosto, ore 10:00",
  B: "Asta: domenica 23 agosto, ore 10:00",
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
