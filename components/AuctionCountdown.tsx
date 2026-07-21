"use client";

import { useEffect, useState } from "react";
import { AUCTION_START_ISO } from "@/lib/types";

const TARGET = new Date(AUCTION_START_ISO).getTime();

function remaining() {
  const diff = TARGET - Date.now();
  if (diff <= 0) return null;
  const totalMinutes = Math.floor(diff / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;
  return { days, hours, minutes };
}

function plural(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`;
}

export default function AuctionCountdown() {
  // null iniziale = non ancora calcolato lato client (evita mismatch SSR/idratazione)
  const [time, setTime] = useState<ReturnType<typeof remaining> | undefined>(
    undefined
  );

  useEffect(() => {
    setTime(remaining());
    const id = setInterval(() => setTime(remaining()), 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      aria-label="Conto alla rovescia per l'inizio dell'asta"
      className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-gold bg-bg-card p-8 text-center shadow-[0_0_24px_rgba(212,175,55,0.15)]"
    >
      {time === null ? (
        <p className="text-2xl font-extrabold text-gold-bright sm:text-3xl">
          L&apos;asta è iniziata! 🔥
        </p>
      ) : (
        <>
          <p className="text-sm font-semibold uppercase tracking-wide text-gold-muted">
            Inizio asta tra
          </p>
          <p className="text-2xl font-extrabold text-gold sm:text-3xl">
            {time === undefined
              ? "—"
              : `${plural(time.days, "giorno", "giorni")}, ${plural(
                  time.hours,
                  "ora",
                  "ore"
                )}, ${plural(time.minutes, "minuto", "minuti")}`}
          </p>
          <p className="text-xs text-text-secondary">
            22 agosto 2026, ore 8:00
          </p>
        </>
      )}
    </section>
  );
}
