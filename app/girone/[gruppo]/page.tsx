import Link from "next/link";
import { notFound } from "next/navigation";
import { readTeams } from "@/lib/teams";
import { AUCTION_INFO, GROUPS, countMembers, type Group } from "@/lib/types";

export const dynamic = "force-dynamic";

function display(value: string): string {
  return value.trim() === "" ? "-" : value;
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
          <span className={count === 16 ? "text-slot-full" : ""}>{count}</span>
          /16 giocatori
        </span>
      </div>
      <p className="-mt-3 text-sm text-text-secondary">{AUCTION_INFO[group]}</p>

      <ul className="flex flex-col gap-3">
        {teams.map((team) => {
          const filled =
            team.member_one.trim() !== "" || team.member_two.trim() !== "";
          return (
            <li
              key={team.id}
              className="rounded-2xl border border-border-base bg-bg-card p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-2">
                  <span
                    className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                      filled ? "bg-slot-full" : "bg-slot-empty"
                    }`}
                    aria-hidden
                  />
                  <p className="break-words text-lg font-bold text-text-primary">
                    {display(team.team_name)}
                  </p>
                </div>
                <span className="shrink-0 rounded-md border border-border-base px-2 py-0.5 text-xs font-semibold text-gold-muted">
                  <span className="font-normal text-text-secondary">
                    Scorsa stagione:{" "}
                  </span>
                  {display(team.last_year_result)}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wide text-text-secondary">
                    Membro 1
                  </p>
                  <p className="break-words font-medium">
                    {display(team.member_one)}
                  </p>
                </div>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wide text-text-secondary">
                    Membro 2
                  </p>
                  <p className="break-words font-medium">
                    {display(team.member_two)}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
