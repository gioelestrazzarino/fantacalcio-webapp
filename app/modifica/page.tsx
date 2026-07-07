import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/auth";
import { readTeams } from "@/lib/teams";
import { GROUPS } from "@/lib/types";
import EditRow from "@/components/EditRow";

export const dynamic = "force-dynamic";

export default async function ModificaPage() {
  if (!(await isAdminSession())) {
    redirect("/");
  }

  const teams = await readTeams();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/"
          className="text-sm font-medium text-gold-muted hover:text-gold-bright"
        >
          ← Torna alla dashboard
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-extrabold text-gold">Modifica squadre</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Ogni salvataggio crea un commit sul repository: il sito pubblico si
          aggiorna in 30-90 secondi.
        </p>
      </div>

      {GROUPS.map((group) => (
        <section key={group} className="flex flex-col gap-3">
          <h2 className="border-b border-border-base pb-2 text-xl font-bold text-gold">
            Girone {group}
          </h2>
          {teams
            .filter((t) => t.group === group)
            .sort((a, b) => a.slot_number - b.slot_number)
            .map((team) => (
              <EditRow key={team.id} team={team} />
            ))}
        </section>
      ))}
    </div>
  );
}
