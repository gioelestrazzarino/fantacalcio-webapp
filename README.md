# Fantacalcio 2026-2027 — Web App

Web app pubblica, mobile-first, per vedere le squadre iscritte ai 4 gironi del
Fantacalcio 2026-2027. Lettura libera per tutti; modifica riservata
all'organizzatore tramite PIN.

## Stack

- **Next.js** (App Router) + React + TypeScript
- **Tailwind CSS** — tema dark oro/nero
- **Nessun database**: i dati vivono in [`data/teams.json`](data/teams.json)
  dentro il repo. Ogni salvataggio dall'interfaccia di modifica crea un commit
  su `main` tramite la GitHub API, che triggera un nuovo deploy su Vercel.

## Sviluppo locale

```bash
npm install
cp .env.example .env.local   # poi imposta ADMIN_PIN
npm run dev
```

Senza `GITHUB_TOKEN` (sviluppo locale) i salvataggi scrivono direttamente su
`data/teams.json`. Con il token (produzione/Vercel) i salvataggi diventano
commit sul repo GitHub.

## Variabili d'ambiente

| Nome | Obbligatoria | Descrizione |
| --- | --- | --- |
| `ADMIN_PIN` | Sì | PIN per sbloccare la modalità di modifica |
| `GITHUB_TOKEN` | Solo in produzione | PAT GitHub con permesso di scrittura sui contenuti del repo |
| `GITHUB_REPO` | No | Default: `gioelestrazzarino/fantacalcio-webapp` |
| `GITHUB_BRANCH` | No | Default: `main` |

## Struttura

- `/` — dashboard con contatore iscritti e card dei 4 gironi
- `/girone/[gruppo]` — squadre del girone (a, b, c, d)
- `/modifica` — vista di modifica (solo con sessione PIN valida)
- `/api/login` — verifica PIN e imposta il cookie di sessione (httpOnly)
- `/api/update-team` — verifica il cookie e salva la riga (commit su GitHub)
