# SAR Guardian — SAR Intelligence Platform

A prototype AML compliance console for reviewing transaction-monitoring alerts and
drafting UK Suspicious Activity Reports (SARs), with a full audit trail over every
rule trigger, AI prompt, template retrieval and analyst action.

> **Prototype.** All data in this app is mock data held in memory
> (`src/data/mockData.ts`). Nothing is persisted, and nothing is filed with any
> regulator. State resets on refresh.

## Features

- **Alert queue** — transaction alerts ranked by risk score, with typology tags,
  KYC summary and triggered AML rules.
- **Case view** — per-subject transaction detail with flagged-transaction
  highlighting and the rules that fired.
- **SAR drafting** — generates a narrative from the selected alert's own customer,
  transactions and triggered rules, in UK NCA/FCA SAR format.
- **Human review** — analyst edit, approve and reject flows with version history.
- **Audit trail** — append-only log, filterable by category, with per-entry metadata.
- **Role switching** — analyst and read-only auditor views.

## Getting started

Requires Node.js 20.19+ or 22.12+ (Vite 7 / Vitest 5).

```sh
npm ci
npm run dev
```

The dev server listens on <http://localhost:8080>.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint over the whole project |
| `npm run typecheck` | `tsc -b` across both TS projects |
| `npm test` | Run the Vitest suite once |
| `npm run test:watch` | Run Vitest in watch mode |

## Tech stack

Vite 7 · React 18 · TypeScript 5 (strict) · Tailwind CSS 3 · Radix UI · Vitest 5

## Project layout

```
src/
  components/        Feature components (Dashboard, CaseView, SARView, AuditTrail)
    shared/          Small presentational primitives shared across views
    ui/              shadcn/ui primitives still in use (toast, tooltip, sonner)
  context/
    app-context.ts   Context object and its type
    AppContext.tsx   AppProvider — all state transitions live here
    useApp.ts        Consumer hook
  data/mockData.ts   Mock alerts, audit log and the SAR narrative generator
  types/index.ts     Domain types
```

## Known limitations

These are deliberate gaps in the prototype rather than defects:

- **No persistence.** The audit trail is labelled immutable but lives in memory;
  a refresh clears it. There is no tamper-evidence (e.g. hash chaining).
- **Auditor read-only is presentational.** The auditor role hides editing
  controls but the context mutators are not themselves guarded.
- **Navigation is state-based.** React Router is mounted but the app uses a
  single route, so cases cannot be deep-linked and the back button does not
  step through views.
- **Currency is assumed GBP.** `Transaction.currency` exists but every view
  formats with a hardcoded `£`.
