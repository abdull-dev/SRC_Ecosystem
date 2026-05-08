# SRC Ecosystem — Frontend Assessment

A fintech/blockchain dashboard built for the SRC Ecosystem frontend assessment. All four tasks are implemented as a single cohesive application.

---

## Setup

**Requirements:** Node.js 18+

```bash
git clone <repo-url>
cd my-project
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

```bash
npm run build    # production build
npm run preview  # preview production build locally
```

---

## Tasks Completed

### Task 1 — Dashboard UI
**Route:** `/dashboard`

Responsive dashboard with sidebar navigation, topbar, 3 stat cards, a recent transactions table, a top exporters widget, a KYB queue, and a live market rates widget. Fully responsive — sidebar collapses to a mobile drawer on small screens.

### Task 2 — Multi-Step Onboarding
**Route:** `/exporters`

4-step exporter onboarding flow: Company Information → KYC/KYB Documents → Wallet Connection → Review & Submit. Each step validates independently with Zod before allowing progression. Animated step transitions, progress indicator (desktop stepper + mobile progress bar), and a success confirmation screen.

### Task 3 — API Integration
**Widget:** Live Market Rates on the Dashboard

Fetches live BTC/ETH/SOL/BNB prices from the CoinGecko public API (no key required). Handles loading skeletons, error state with retry, empty state, and a manual refresh button. Data is cached for 60 seconds via TanStack Query to avoid unnecessary re-fetches.

### Task 4 — Transaction Modal
**Route:** `/transactions` → Send Payment tab

A blockchain payment confirmation modal with 4 states: Review (cost breakdown, address reveal/hide) → Pending (animated network broadcast) → Success (transaction hash + copy) → Failed (network tip + retry). Also accessible from the transaction table rows for existing transactions.

---

## Design Decisions

### Architecture — Feature-Based

```
src/
  features/          ← self-contained feature slices
    dashboard/
      index.tsx
      api/           ← fetcher lives here, not in the component
      components/
    transactions/
      index.tsx
      components/
    exporters/
      index.tsx
      components/    ← step components
      schemas.ts     ← Zod validation
      content.ts     ← copy/labels
    kyb/ wallets/ settings/
  shared/            ← reusable across features
    components/
      ui/            ← Spinner, StatCard, StatusBadge, NetworkSelect…
      form/          ← FormInput, SelectInput, FileUploadBox…
      layout/        ← Sidebar, Topbar
      icons/
    data/            ← mockData, networksConfig, shared TS types
```

**The rule:** if only one feature uses something, it lives inside that feature. It moves to `shared/` only when two or more features need it. You can understand or delete any feature by touching one folder.

### TypeScript — Strict Mode
All 40+ files are `.tsx`/`.ts` with explicit prop interfaces. Shared data types (`Transaction`, `Exporter`, `KYBItem`) are exported from `shared/data/mockData.ts`. `tsc --noEmit` passes with zero errors.

### State Management
No global state library — the complexity didn't warrant it. Dark mode lives in `App.tsx`. Form state lives in the page that owns the form. TanStack Query handles the one real async operation (CoinGecko API). Adding Zustand/Redux would be premature at this scale.

### Component Separation — Single Responsibility
- `features/exporters/schemas.ts` — validation only
- `features/exporters/content.ts` — copy/labels only
- `shared/components/form/` — generic form primitives, zero business logic
- `features/exporters/components/` — step components that compose the primitives
- `features/dashboard/api/marketRates.ts` — HTTP concern only, no UI

### UX for Non-Crypto Users
The Send Payment modal shows plain-English cost breakdowns ("You pay $84.04 total") rather than raw gas values. Wallet addresses are masked by default with a toggle to reveal. Transaction hash is shown with a copy button as proof of payment. Warning banners appear before irreversible actions. A 20% simulated failure rate exercises all modal states.

---

## Stack

| | |
|---|---|
| Framework | React 19 + Vite 8 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (CSS-based theme tokens) |
| Animation | Framer Motion |
| Data fetching | TanStack React Query |
| Validation | Zod |
| Notifications | Sonner |
| Routing | React Router v6 |
