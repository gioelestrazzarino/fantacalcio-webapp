"use client";

import { useState } from "react";
import { LAST_YEAR_RESULTS, type Team } from "@/lib/types";

type SaveState = "idle" | "saving" | "saved" | "error";

export default function EditRow({ team }: { team: Team }) {
  const [teamName, setTeamName] = useState(team.team_name);
  const [memberOne, setMemberOne] = useState(team.member_one);
  const [memberTwo, setMemberTwo] = useState(team.member_two);
  const [memberOnePaid, setMemberOnePaid] = useState(team.member_one_paid);
  const [memberTwoPaid, setMemberTwoPaid] = useState(team.member_two_paid);
  const [result, setResult] = useState(team.last_year_result);
  const [state, setState] = useState<SaveState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSave() {
    setState("saving");
    setErrorMsg("");
    try {
      const res = await fetch("/api/update-team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: team.id,
          team_name: teamName,
          member_one: memberOne,
          member_two: memberTwo,
          member_one_paid: memberOnePaid,
          member_two_paid: memberTwoPaid,
          last_year_result: result,
        }),
      });
      if (res.ok) {
        setState("saved");
        setTimeout(() => setState("idle"), 3000);
      } else {
        const body = await res.json().catch(() => null);
        setErrorMsg(body?.error ?? "Salvataggio fallito");
        setState("error");
      }
    } catch {
      setErrorMsg("Errore di rete, riprova.");
      setState("error");
    }
  }

  const inputClass =
    "w-full rounded-lg border border-border-base bg-bg-primary px-3 py-2 text-sm text-text-primary outline-none focus:border-gold";

  return (
    <div className="rounded-2xl border border-border-base bg-bg-card p-4">
      <p className="mb-3 text-sm font-semibold text-gold-muted">
        Slot {team.slot_number}
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-wide text-text-secondary">
            Nome squadra
          </span>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            maxLength={60}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-wide text-text-secondary">
            Risultato anno scorso
          </span>
          <select
            value={result}
            onChange={(e) => setResult(e.target.value)}
            className={inputClass}
          >
            <option value="">-</option>
            {LAST_YEAR_RESULTS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>
        <div className="flex flex-col gap-1">
          <label className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wide text-text-secondary">
              Membro 1
            </span>
            <input
              type="text"
              value={memberOne}
              onChange={(e) => setMemberOne(e.target.value)}
              maxLength={60}
              className={inputClass}
            />
          </label>
          <label className="mt-1 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={memberOnePaid}
              onChange={(e) => setMemberOnePaid(e.target.checked)}
              className="h-4 w-4 accent-[var(--slot-full)]"
            />
            <span className={memberOnePaid ? "text-slot-full" : "text-text-secondary"}>
              Pagato
            </span>
          </label>
        </div>
        <div className="flex flex-col gap-1">
          <label className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wide text-text-secondary">
              Membro 2
            </span>
            <input
              type="text"
              value={memberTwo}
              onChange={(e) => setMemberTwo(e.target.value)}
              maxLength={60}
              className={inputClass}
            />
          </label>
          <label className="mt-1 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={memberTwoPaid}
              onChange={(e) => setMemberTwoPaid(e.target.checked)}
              className="h-4 w-4 accent-[var(--slot-full)]"
            />
            <span className={memberTwoPaid ? "text-slot-full" : "text-text-secondary"}>
              Pagato
            </span>
          </label>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={state === "saving"}
          className="rounded-lg bg-gold px-5 py-2 text-sm font-bold text-bg-primary transition-colors hover:bg-gold-bright disabled:opacity-50"
        >
          {state === "saving" ? "Salvataggio..." : "Salva"}
        </button>
        {state === "saved" && (
          <span className="text-sm font-semibold text-slot-full">
            Salvato ✓
          </span>
        )}
        {state === "error" && (
          <span className="text-sm font-semibold text-red-400">{errorMsg}</span>
        )}
      </div>
    </div>
  );
}
