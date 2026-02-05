# Clutch (MVP)

Mobile-first PWA that turns pasted text into a **Review Pack**:
- **One-pager** (summary + key points)
- **Flashcards**
- **Quiz**

Then you can share a public preview link (`/p/[id]`) where people can **Join to unlock**. Unlock threshold is **5 joins**.

## Tech
- Next.js (App Router) + Tailwind
- PWA via `next-pwa` (service worker generated on build)
- SQLite via `better-sqlite3` (db file: `./data/clutch.db`)

## Local dev

```powershell
cd C:\Users\theul\clawd\clutch
pnpm install

# IMPORTANT: better-sqlite3 is a native module.
# If pnpm blocks build scripts, run:
pnpm approve-builds

pnpm dev
```

Open: http://localhost:3000

### PWA notes
- Service worker is **disabled in development** (to avoid caching issues).
- To test install/offline behavior:

```powershell
pnpm build
pnpm start
```

Then open http://localhost:3000 in Chrome and use "Install".

## Core flows
1. **Home** (`/`): paste text → **Generate Review Pack**
2. **Pack** (`/pack/[id]`): shows full pack + share link
3. **Public preview** (`/p/[id]`): shows join progress; reveals full pack once `joinCount >= 5`

## API
- `POST /api/generate` → `{ id, pack }`
- `GET /api/packs/[id]/status` → `{ joinCount, threshold, unlocked }`
- `POST /api/packs/[id]/join` → increments join count

## Key paths
- DB + unlock logic: `src/lib/db.ts`
- Heuristic pack generator: `src/lib/pack.ts`
- Generate endpoint: `src/app/api/generate/route.ts`
- Join endpoints: `src/app/api/packs/[id]/*`
- Pages: `src/app/page.tsx`, `src/app/pack/[id]/page.tsx`, `src/app/p/[id]/page.tsx`
- PWA manifest: `public/manifest.webmanifest`
- Install banner: `src/components/install-banner.tsx`
