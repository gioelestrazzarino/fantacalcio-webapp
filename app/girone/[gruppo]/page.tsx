import Link from "next/link";
import { notFound } from "next/navigation";
import { readTeams } from "@/lib/teams";
import {
  AUCTION_INFO,
  GROUPS,
  MEMBERS_PER_GROUP,
  countMembers,
  type Group,
} from "@/lib/types";

export const dynamic = "force-dynamic";

function display(value: string): string {
  return value.trim() === "" ? "-" : value;
}

function MemberCell({
  label,
  name,
  paid,
}: {
  label: string;
  name: string;
  paid: boolean;
}) {
  const hasName = name.trim() !== "";
  return (
    <div className="min-w-0">
      <p className="text-xs uppercase tracking-wide text-text-secondary">
        {label}
      </p>
      <p className="break-words font-medium">{display(name)}</p>
      {hasName && (
        <p className="mt-0.5 flex items-center gap-1.5 text-xs">
          <span
            className={`h-2 w-2 shrink-0 rounded-full ${
              paid ? "bg-slot-full" : "bg-red-500"
            }`}
            aria-hidden
          />
          <span className={paid ? "text-slot-full" : "text-red-400"}>
            {paid ? "Pagato" : "Da pagare"}
          </span>
        </p>
      )}
    </div>
  );
}

export default async function GironePage({
  params,
}: {
  params: Promise<{ gruppo: string }>;
}) {
  const { gruppo } = await params;
  const group = gruppo.toUpperCase() as Group;
  if (!GROUPS.includes(group)) notFound();

  const teams = (await readTeams())
    .filter((t) => t.group === group)
    .sort((a, b) => a.slot_number - b.slot_number);
  const count = countMembers(teams);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Link
          href="/"
          className="text-sm font-medium text-gold-muted hover:text-gold-bright"
        >
          ← Torna alla dashboard
        </Link>
      </div>

      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-2xl font-extrabold text-gold">Girone {group}</h1>
        <span className="text-lg font-semibold">
          <span className={count === MEMBERS_PER_GROUP ? "text-slot-full" : ""}>
            {count}
          </span>
          /{MEMBERS_PER_GROUP} giocatori
        </span>
      </div>
      <p className="-mt-3 text-sm text-text-secondary">{AUCTION_INFO[group]}</p>

      <div className="flex items-center gap-4 rounded-xl border border-border-base bg-bg-card px-4 py-2 text-xs text-text-secondary">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-slot-full" aria-hidden />
          Pagato
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" aria-hidden />
          Da pagare
        </span>
      </div>

      <ul className="flex flex-col gap-3">
        {teams.map((team) => (
          <li
            key={team.id}
            className="rounded-2xl border border-border-base bg-bg-card p-4"
          >
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
              <MemberCell
                label="Membro 1"
                name={team.member_one}
                paid={team.member_one_paid}
              />
              <MemberCell
                label="Membro 2"
                name={team.member_two}
                paid={team.member_two_paid}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
