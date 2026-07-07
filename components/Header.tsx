"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

export default function Header({ isAdmin }: { isAdmin: boolean }) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      if (res.ok) {
        setPanelOpen(false);
        setPin("");
        router.push("/modifica");
        router.refresh();
      } else {
        const body = await res.json().catch(() => null);
        setError(body?.error ?? "PIN errato");
      }
    } catch {
      setError("Errore di rete, riprova.");
    } finally {
      setBusy(false);
    }
  }

  async function handleLogout() {
    setBusy(true);
    try {
      await fetch("/api/login", { method: "DELETE" });
      setPanelOpen(false);
      if (pathname.startsWith("/modifica")) {
        router.push("/");
      }
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <header className="sticky top-0 z-20 border-b border-border-base bg-bg-primary/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Logo Fantacalcio"
            width={36}
            height={36}
            className="rounded-full"
            priority
          />
          <span className="text-lg font-bold text-gold">Fantacalcio</span>
        </Link>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link
              href="/modifica"
              className="rounded-lg border border-gold-muted px-3 py-1.5 text-sm font-semibold text-gold hover:text-gold-bright"
            >
              Modifica
            </Link>
          )}
          <button
            type="button"
            aria-label={isAdmin ? "Account (connesso)" : "Accedi"}
            onClick={() => {
              setPanelOpen((v) => !v);
              setError("");
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border-base bg-bg-card text-text-secondary transition-colors hover:bg-bg-card-hover hover:text-gold-bright"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke={isAdmin ? "var(--gold)" : "currentColor"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        </div>
      </div>

      {panelOpen && (
        <div className="border-t border-border-base bg-bg-card">
          <div className="mx-auto w-full max-w-3xl px-4 py-4">
            {isAdmin ? (
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-text-secondary">
                  Sei connesso come organizzatore.
                </p>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={busy}
                  className="rounded-lg border border-border-base px-4 py-2 text-sm font-semibold text-text-primary hover:bg-bg-card-hover disabled:opacity-50"
                >
                  Esci
                </button>
              </div>
            ) : (
              <form onSubmit={handleLogin} className="flex flex-col gap-2">
                <label htmlFor="pin" className="text-sm text-text-secondary">
                  Inserisci il PIN organizzatore
                </label>
                <div className="flex gap-2">
                  <input
                    id="pin"
                    type="password"
                    inputMode="numeric"
                    autoComplete="off"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-32 rounded-lg border border-border-base bg-bg-primary px-3 py-2 text-text-primary outline-none focus:border-gold"
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={busy || pin.length === 0}
                    className="rounded-lg bg-gold px-4 py-2 text-sm font-bold text-bg-primary transition-colors hover:bg-gold-bright disabled:opacity-50"
                  >
                    {busy ? "..." : "Accedi"}
                  </button>
                </div>
                {error && <p className="text-sm text-red-400">{error}</p>}
              </form>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
