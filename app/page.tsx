import Link from "next/link";
import Image from "next/image";
import { readTeams } from "@/lib/teams";
import {
  AUCTION_INFO,
  GROUPS,
  PAYMENT_DEADLINE,
  countMembers,
} from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  const teams = await readTeams();
  const total = countMembers(teams);

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col items-center gap-4 text-center">
        <Image
          src="/logo.png"
          alt="Logo Fantacalcio"
          width={110}
          height={110}
          className="rounded-full"
          priority
        />
        <h1 className="text-3xl font-extrabold text-gold sm:text-4xl">
          Fantacalcio 2026-2027 🔥⚽️
        </h1>
        <p className="rounded-full border border-gold-muted bg-bg-card px-5 py-2 text-lg font-semibold">
          Iscritti: <span className="text-gold-bright">{total}/64</span>
        </p>
        <p className="text-base font-semibold text-gold-bright">
          ⏰ {PAYMENT_DEADLINE}
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {GROUPS.map((group) => {
          const count = countMembers(teams.filter((t) => t.group === group));
          return (
            <Link
              key={group}
              href={`/girone/${group.toLowerCase()}`}
              className="flex flex-col gap-2 rounded-2xl border border-border-base bg-bg-card p-5 transition-colors hover:bg-bg-card-hover"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gold">Girone {group}</h2>
                <span
                  className={`text-lg font-semibold ${
                    count === 16 ? "text-slot-full" : "text-text-primary"
                  }`}
                >
                  {count}/16
                </span>
              </div>
              <p className="text-sm text-text-secondary">
                {AUCTION_INFO[group]}
              </p>
              <p className="mt-1 text-sm font-medium text-gold-muted">
                Vedi squadre →
              </p>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
