# Schoolwork AI App — Naming + Branding (WIP)

## Vision (Andrew)
- "AI for school work" — roughly half **studying** / half **do-it-for-you**.
- We’re designing this app from the ground up together.
- Goal: become the biggest Spark Studio app yet.

## Brand positioning (draft)
- **Promise:** Learn faster *and* ship better work.
- **Vibe:** confident, clean, not childish; feels like a premium “student OS”.
- **North star:** credibility (helps you understand) + capability (helps you deliver).

## Name directions (draft)
### Direction A: Study-first, credible
- **Syllabus**
- **Mentor**
- **CourseCorrect**
- **ClearStudy**

### Direction B: Output-first, punchy
- **Draftline**
- **PaperPilot**
- **Worksmith**
- **Submit**

### Direction C: “Student OS” / all-in-one
- **Campus**
- **DeskOS**
- **Backpack**
- **StudyKit**

### Direction D: New-word / brandable
- **Klaro**
- **Studia**
- **Notely**
- **Skola**

## Visual identity (draft)
- **Style:** dark-mode friendly, crisp typography, subtle grid/paper motifs (but modern).
- **Primary colors:** deep navy/graphite base with a bright accent (electric blue or lime).
- **Typography:** geometric sans for UI + a highly-legible reading font for content.
- **Logo idea:** simple mark that can become an app icon (monogram, cursor+page, or “spark” on a note).

## Voice (draft)
- Direct, helpful, slightly competitive.
- Avoid cringe/juvenile study language.

## Open questions for next iteration
1. Target users: high school, college, or both?
2. Do we want the name to sound academic (trust) or edgy (viral)?
3. Any hard constraints (must include “AI”, must avoid “cheat” connotation, etc.)?
4. Core surface: web app, mobile, Chrome extension, or all?

---

## Naming research (Claude)
Source: Claude (Opus 4.5) generated 100 names across 10 patterns + curated a Top 20. Notes below are *probabilistic* collision/SEO risks (not a trademark/domain check).

## Decision (2026-02-05)
- Working name selected: **Clutch** (formerly Beacon)
- Platform decision: **Mobile-first PWA** (web app added to home screen; not native App Store)
- MVP wedge decision (Henry): **Study Pack first** (parent/teacher-safe + highly shareable)
- Share unit naming (Henry): **Review Pack** (sounds normal in school group chats)

## Product concept (live notes)
### Packs (shareable unit)
- A **Pack** is the unit of value + virality: one topic turned into a study layer + sharing layer.
- V1 focus: **Review Packs** (aka Study Packs): flashcards, practice quiz, 1-page review sheet.
- V2: **Assignment Packs** (Doc → turn-in ready) once trust + safety is established.
- **Class Pack unlock**: each Pack has a solo version immediately + an upgraded version unlocked once ~5 classmates join (teacher-style questions, hard-mode quiz, most-missed Qs, etc.).
- Safety constraint: no anonymous free text / no public comments / no rating classmates; sharing is utility-first only.

---

## Execution plan (mobile-first PWA)
### Phase 1 — Foundation (2–4 days)
- Next.js app (mobile-first)
- PWA install (manifest + service worker) + “Add to Home Screen” onboarding
- Auth (phone/email) + minimal profile: school, grade

### Implementation notes (current MVP scaffold)
- **Repo path:** `C:\Users\theul\clawd\clutch` (Next.js App Router + Tailwind)
- **PWA:** `next-pwa` + `public/manifest.webmanifest` + placeholder icons in `public/icons/`
  - Service worker generation configured in `clutch/next.config.ts` (disabled in dev)
  - Install banner component: `clutch/src/components/install-banner.tsx`
- **Core flows shipped:**
  - `/` home paste → generate: `clutch/src/app/page.tsx`
  - Generate endpoint (mock heuristic): `clutch/src/app/api/generate/route.ts`
  - Pack page: `clutch/src/app/pack/[id]/page.tsx`
  - Public preview + join to unlock: `clutch/src/app/p/[id]/page.tsx`
- **Unlock mechanic (threshold=5):** SQLite via `better-sqlite3`
  - DB logic: `clutch/src/lib/db.ts` (db file: `clutch/data/clutch.db`)
  - Join APIs: `clutch/src/app/api/packs/[id]/join/route.ts` + `status/route.ts`
- **Pack structure:** `clutch/src/lib/pack.ts` (flashcards, quiz, one-pager derived from text)


### Phase 2 — Review Pack generator (4–7 days)
- Input: paste text + upload doc (Google Doc link later if permissions are annoying)
- Output: flashcards + quiz + 1-page review sheet
- Pack pages: preview (no login) + full (login)

### Phase 3 — Virality (3–5 days)
- Share link + “Join this Review Pack” flow
- Unlock mechanic: 5 joins → upgrade pack + push notifications
- Notification timing presets: ~4pm + Sunday night

### Phase 4 — Instrumentation + rollout (ongoing)
- Metrics: shares/user, join conversion, pack completion, D1/D7
- School-by-school rollout flags (atomic networks)

## Local branding tool (logo/icon explorer)
- Folder: `C:\\Users\\theul\\clawd\\beacon-branding`
- Purpose: generate + review many SVG icon variants (concepts × colorways × stroke weights), with local export (SVG/PNG).
- Run:
  ```bash
  cd C:\\Users\\theul\\clawd\\beacon-branding
  pnpm install
  pnpm dev
  ```
  Then open the printed localhost URL (typically `http://localhost:5173`).

### Claude’s Top 20 (in order)
1. Grasp
2. MindMint
3. Clevra
4. Scio
5. Lumino
6. Clutch
7. Keen
8. Margin
9. Illume
10. Folio
11. Beacon
12. Questly
13. Axiom
14. Lumen
15. Studion
16. Prism
17. Cortex
18. Rally
19. Epoch
20. Beam

### Ranked Top 15 shortlist (synthesized for app-store + brandability)
1) **MindMint** — distinctive, memorable, teen-credible; low generic-search drag.
   - Palette: graphite + mint accent (#1B1F2A / #36E6B0)
   - Type: geometric sans (Space Grotesk/Inter)
   - Icon: “M” monogram with mint leaf / spark notch
   - Collision risk: low–medium (compound; still check domains)

2) **Clevra** — invented-but-obvious (“clever”), feels like a modern consumer app.
   - Palette: deep navy + electric violet (#0B1020 / #7C4DFF)
   - Type: rounded neo-grotesk (Satoshi/Inter)
   - Icon: speech bubble + checkmark (subtle)
   - Collision risk: low

3) **Illume** — premium clarity vibe; ownable spelling; great for “aha” positioning.
   - Palette: charcoal + warm gold (#111318 / #FFC857)
   - Type: modern serif accent for headlines (Fraunces) + Inter for UI
   - Icon: minimal bulb/beam wedge inside a rounded square
   - Collision risk: low–medium (lighting brands)

4) **Lumino** — friendly illumination metaphor; smooth to say; global.
   - Palette: midnight + cyan glow (#06121F / #34D7FF)
   - Type: clean grotesk (Inter/Manrope)
   - Icon: gradient halo ring
   - Collision risk: medium (other industries)

5) **Scio** — ultra-short, clean, slightly academic without being stuffy.
   - Palette: black + white + single accent (lime or blue)
   - Type: Swiss grotesk vibe (Neue Haas Grotesk/Inter)
   - Icon: “S” carved into a bookmark
   - Collision risk: low–medium (B2B/science overlaps)

6) **Prism** — “breaks down complexity”; strong metaphor for explaining.
   - Palette: dark base + prismatic gradient accent
   - Type: tech-forward sans (SF Pro/Inter)
   - Icon: triangle prism splitting a line
   - Collision risk: medium (generic word)

7) **Questly** — gamified without being cringe; hints at progression.
   - Palette: slate + neon green (#121826 / #7CFF6B)
   - Type: slightly playful sans (DM Sans/Satoshi)
   - Icon: map pin + star / quest marker
   - Collision risk: low–medium (-ly names exist)

8) **Keen** — short, positive, smart; works for parents/teachers too.
   - Palette: navy + sky (#0B1B3A / #5DD6FF)
   - Type: classic sans (Inter)
   - Icon: eye/arrow “keen sight” mark
   - Collision risk: medium (prior products named Keen)

9) **Margin** — clever double meaning (notes + competitive edge); intriguing.
   - Palette: off-white + black + highlighter yellow
   - Type: editorial vibe (IBM Plex Sans + Plex Serif)
   - Icon: page margin bracket
   - Collision risk: medium (finance/crypto term)

10) **Epoch** — “new era of studying”; strong, modern, short.
   - Palette: black + cobalt (#05060A / #2D5BFF)
   - Type: sharp geometric (Space Grotesk)
   - Icon: forward arrow/clock hand
   - Collision risk: medium (dev/tooling usage)

11) **Lumen** — clear learning signal; a bit science-y but approachable.
   - Palette: graphite + white + amber
   - Type: modern sans + subtle mono for “study OS” feel
   - Icon: dot emitting rays
   - Collision risk: medium (common)

12) **Axiom** — “first principles”; great for math/logic; a bit serious.
   - Palette: deep blue + coral accent
   - Type: technical sans (IBM Plex Sans)
   - Icon: stacked lines / axiom glyph
   - Collision risk: medium (tech/finance)

13) **Grasp** — direct and benefit-forward (“finally get it”).
   - Palette: dark + bright blue
   - Type: bold grotesk
   - Icon: hand/hold glyph (abstract)
   - Collision risk: medium–high (generic word)

14) **Folio** — portfolio/notebook vibe; trusted by adults; slightly broad.
   - Palette: cream + ink + teal
   - Type: editorial (serif headers)
   - Icon: folded page corner
   - Collision risk: medium (productivity/portfolio apps)

15) **Beam** — crisp “clarity” mark; short; but generic.
   - Palette: dark + neon cyan
   - Type: minimal sans
   - Icon: diagonal light beam
   - Collision risk: medium–high (common word)

### Bench list (additional candidates from the 100)
**Compounds:** BrainPace, SnapLearn, ThinkFuel, StudyNest, LeapMind, FocusDen, BrightPath, QuickGrasp, SkillSpark

**Invented:** Learnly, Studra, Nootra, Scripto

**Latin/Greek-ish:** Lexica, Mentis, Doceo, Modus, Ratio, Veritas, Eureka

**Companion vibe:** Ally, Pacer, Wingmate, Scout, Sage, Sherpa

**Level-up vibe:** Rankup, Ascend, Surge, Rally, Streak, Questify, Upskill

**Clarity vibe:** Lucid, Clarify, Insight, Glow, Dawn

**Time/planning:** Tempo, Cadence, Chrono, Stint, Cue, Agenda, Session, Sprint

**Notebook/paper:** Jotter, Scribe, Slate, Quill, Draft, Leaflet, Papyrus

**AI-subtle / technical:** Cortex, Synaptic, Vector, Tensor, Cipher, Neural, Logic, Vertex (high collision), Codex (high collision)

### Quick collision “red flag” notes (from Claude + common-sense)
- **Very high collision:** Copilot (Microsoft), Grok (xAI), Codex (OpenAI), Vertex (Google Vertex AI)
- **Likely crowded/generic SEO:** Spark, Beacon, Clarity, Insight, Planner, Session, Boost, Prism, Beam
- **Possible category confusion:** Margin (finance/crypto), Sage (accounting), Slate (magazine), Drift (sleep), Sprint (telecom)

---

## Viral strategy research (Nikita Bier)
*Source: Claude Deep Research mode UI (side panel). Note: the research run was still “gathering sources” when captured; treat numeric claims as **to-be-verified**. The patterns are what matter.*

### Executive summary (what made tbh/Gas spread in schools)
- **Schools are dense graphs**: you can reach “network effects” with a small number of installs because students share many overlapping connections (classes/teams). Once a threshold is crossed, adoption can jump extremely fast.
- **Notification-first virality**: the product creates *reasons to ping non-users* (“someone mentioned you”, “you were voted…”, “unlock your result”) which prompts immediate installs.
- **Constrained anonymity** (positive-only) reduces the downside of anonymous social while keeping the “mystery + status” upside.
- **Geo/school scarcity**: launch *one school/region at a time* to create FOMO and the feeling that “everyone at my school is on this.”

### Key takeaways (high-signal claims surfaced in the research panel)
- Schools can hit extremely high penetration quickly once a tipping point is reached (panel claim: **~40% download in 24 hours** in some cases).
- “Exclusivity + timing” tactics: create coordinated moments (panel claim: notifications synchronized around **~4pm dismissal**) to amplify in-person chatter.
- “Teen invites are uniquely high”: panel claim that **invitation rate drops ~20% per year of age from 13→18**, so younger teens are the most viral cohort.
- Retention risk: panel claim that some of these apps peaked fast, then struggled with longer-term retention (tbh/Gas narrative: fast virality ≠ durable daily utility).

### Growth loops to copy (adapted for Beacon)
**Loop A — “You were mentioned” → install**
1) User completes an action that references peers (vote/endorse/shoutout/study win).
2) Referenced peer gets a notification/SMS/push: “Someone in *[School]* gave you a Beacon.”
3) On open/install, the peer must join their school cohort (lightweight verification) to reveal it.
4) Reveal screen nudges them to give 3–5 Beacons to others.

**Loop B — Cohort unlock / school leaderboard**
1) School feed is partially locked until **X classmates** join (or X people in your grade/class).
2) Each new join increases visible “school energy” meter.
3) Users share invites to unlock their cohort feed (teams/clubs/class periods become sub-cohorts).

**Loop C — Daily prompts → outbound invites**
1) Daily prompt that is *positive + identity/status* (e.g., “Most clutch explainer”, “Saved the group project”).
2) Prompt requires selecting from contacts/school roster.
3) Each vote triggers notifications, pulling in non-users.

### Distribution channels & launch tactics (school-by-school)
- **Seed by clusters**: teams, clubs, friend groups (sports + activities) are ideal “mini-graphs.”
- **Off-platform sharing**: iMessage/Snap/IG stories as the main distribution rails.
- **Time releases**: launch moments that align with when students are together (lunch, dismissal, evening scrolling).
- **Local exclusivity**: start with one metro area; create “your school is live” moments.

### Referral / invite system mechanics (practical)
- “Give 5, get 1” style: you must send Beacons to reveal yours, or to unlock your “week recap.”
- “Skip the wait” / fast track for inviting 3 friends.
- “School roster” onboarding: users pick school → verify via email domain / code / invite-only roster.
- Rate limits to prevent spam; strong anti-abuse throttles by device + IP.

### Safety / parent / school constraints (and mitigations)
- **Avoid freeform anonymous messaging.** Only allow *positive-only* preset prompts + structured endorsements.
- **Hard moderation primitives**: report, block, “remove me from this,” hide identity where appropriate; audit logs.
- **Under-13 / COPPA**: default to 13+; if supporting 7–8th graders, implement age-gating + parental consent path (or restrict features).
- **School admin concerns**: publish a clear safety policy + how anonymity works; make it easy to contact support.
- **Bullying risk**: do not allow negative rankings; no “least ___” prompts; no public tallies that can ostracize.

### 30-day launch plan (for Beacon)
**North-star objective:** win *school-by-school adoption* while staying safe.

**KPIs to instrument day 0**
- Activation: % who verify school + complete first “Beacon” (endorsement) within 10 min
- Viral: invites sent/user, invite accept rate, K-factor (invites→activated)
- Retention: D1/D7 (overall + by school penetration bucket)
- School penetration: % of target school active in last 7 days
- Content: endorsements/day, study wins/day, group sessions created
- Safety: reports/1k actions, block rate, “remove me” rate, moderation SLA

**Week 1 (Days 1–7): Build the loop + seed one school**
- Pick 1–2 target schools (same metro). Recruit 20–50 students via clubs/teams.
- Ship: school verification, endorsement prompts, “you were mentioned” notifications.
- Goal: ≥25% of seed cohort sends ≥5 invites.

**Week 2 (Days 8–14): Drive school threshold**
- Add cohort unlock meter + “grade/class circles.”
- Add “daily prompt” cadence + recap.
- Goal: 10–15% of the school installed OR a visible “everyone is on it” hallway effect.

**Week 3 (Days 15–21): Replicate to 3–5 schools**
- Repeat playbook; optimize activation funnel and invite conversion.
- Add anti-spam throttles and safety tooling based on real reports.
- Goal: K-factor > 1.0 inside seeded schools (even if global K < 1).

**Week 4 (Days 22–30): Scale within metro + harden safety**
- Launch “school live” moments + timed notifications.
- Publish safety transparency page; refine prompt library.
- Goal: 5–10 schools with ≥5% weekly active penetration; D7 retention improving week-over-week.

### What to copy vs. what to avoid
**Copy**
- School-based exclusivity + dense-graph seeding
- Notification loops that reference *you* (identity/status)
- Constrained positive-only anonymity

**Avoid**
- Freeform anonymous posting
- Negative ranking mechanics
- Over-optimizing for initial spike without a durable daily use case (study utility must stay core)
