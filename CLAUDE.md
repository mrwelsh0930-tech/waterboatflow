# waterboatflow — Claude Context

Always check for CLAUDE.md and README.md files in relevant directories.

---

## What This Is

**waterboatflow** = Full Boat-on-Water FNOL (First Notice of Loss) intake prototype. The complete claim filing flow for marine incidents, built to demo to **Progressive** insurance. Deployed at `waterboatflow.vercel.app`.

**Forked from:** `ciq-boats` (`/Users/mark/Desktop/Personal Projects/ciq-boats/`) which covered only location entry + CIQ. This project extends that into the full FNOL experience.

**Owner:** Mark (Head of Product, Assured)
**Auto CIQ predecessor:** `/Users/mark/Desktop/Personal Projects/ciq2/`

> See `KNOWLEDGE-ciq-boats.md` for the full ciq-boats reference (components, types, step flow, geometry). Many of those components are reused here directly.

---

## Tech Stack

- Next.js 16 + React 19 + TypeScript + Tailwind CSS 4
- Google Maps JS API (`@react-google-maps/api`) — drawing, markers, polylines, satellite/road views
- Sentry (`@sentry/nextjs`) — error tracking
- **No GraphQL, no Prisma, no auth** — all state is local React + localStorage
- Env vars: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, `NEXT_PUBLIC_SENTRY_DSN`
- Deploy: `npx vercel --prod`

---

## Architecture

### State Persistence
- `FNOLState` (in `src/types/fnol.ts`) is the single source of truth for the entire flow
- Serialized to `localStorage` on every update
- URL reflects current step: `/step/12` — refresh restores from localStorage
- `useFNOLState` hook manages all state transitions and persistence
- `getActiveSteps(state)` drives all branching logic — returns ordered list of active step IDs

### Step Routing
- Next.js App Router: `src/app/step/[stepId]/page.tsx`
- `FNOLFlow.tsx` renders the correct screen per step ID
- Back/forward browser navigation works via URL + localStorage restore

### Reused from ciq-boats (unchanged)
`MapView.tsx`, `SpeedInput.tsx`, `AccelerationInput.tsx`, `geometry.ts`, `simplify.ts`,
`AssuredHeader.tsx`, `StepIndicator.tsx`, `AddressInput.tsx`, `EmbarkationInput.tsx`, `StateCityInput.tsx`

---

## Key Files

| File | Purpose |
|------|---------|
| `src/types/fnol.ts` | Complete `FNOLState` + `CollisionEntity` types |
| `src/hooks/useFNOLState.ts` | State management, localStorage, navigation |
| `src/lib/getActiveSteps.ts` | All branching logic — returns active step list |
| `src/components/FNOLFlow.tsx` | Master orchestrator — renders correct screen per step |
| `src/components/MapView.tsx` | Google Maps — drawing, sticker placement, satellite/road toggle (from ciq-boats) |
| `src/components/SpeedInput.tsx` | Speed + movement type (from ciq-boats) |
| `src/components/AccelerationInput.tsx` | Speed trend capture (from ciq-boats) |
| `src/lib/geometry.ts` | Bearing, PDOF, collision classification math (from ciq-boats) |
| `src/app/step/[stepId]/page.tsx` | URL-based step routing entry point |
| `src/app/page.tsx` | Redirects to `/step/1` |

### Shared UI Primitives (`src/components/ui/`)
| Component | Purpose |
|-----------|---------|
| `ButtonSingleSelect.tsx` | Full-width emoji + label single-select button |
| `ButtonMultiSelect.tsx` | Same visual with checkbox multi-select behavior |
| `QuestionCard.tsx` | Card wrapper: title, helper text, continue button |
| `TextInputField.tsx` | Single-line and multi-line text inputs |
| `ModalOverlay.tsx` | Overlay for land-only popup, water assistance end screen |

---

## Complete Flow (ordered)

### Section 1: Watercraft Identity (always)
1. Make/manufacturer — text search (supports Bayliner etc.)
2. Color — color select
3. Boat type — emoji grid (Center Console, Pontoon, PWC, Jet Boat, Sailboat, Motor Yacht, Performance Runabout, Bass, Ski/Wake, Dinghy/Other)

### Section 2: Land vs Water Fork
4. Land or water? → Land: friendly modal "water-only prototype" → end. Water: continue.

### Section 3: Location Entry
5. State + city (filters downstream Google searches)
6. Marina or busy waterway? → `isMarina` → satellite vs road map view
7. Location method: 🚩 Starting location / 📍 GPS / 🌎 International waters
   - International waters → termination screen → end
8. Map pin placement — confirm incident point

### Section 4: Immediate Concerns
9. Multi-select urgent conditions (fuel spill, sinking, capsized, etc.)
   - ANY selected → `isUrgent = true` → **skip GCR → jump to CIQ**
   - None → continue

### Section 5: Incident Type + Operating State
10. What happened? Collision / Engine+Propulsion / Weather / Other
    - Other → "Help us understand" screen → Water assistance = end. Else = "Tell me more" free-form → continue, `skipCollision = true`
11. Operating state (multi-select): Under power / Drifting / Anchored / Moored / Docked

### Section 7A: Collision Branch (GCR)
12. What did your boat collide with? (MULTI-SELECT — sequential follow-ups per entity)
13. Where in the water?
14. Collision type (if other boat: Overtaken / Crossing / Docking / Other)
15. Collision-type-specific questions (navigational rules, right-of-way, under power)
16. Other party (type, operating state, color, insurance card)

### Section 7B: Weather Branch
17–22. Warning / storm name / conditions / secured / break-free / precautions
→ **Rejoins main flow after weather questions** (does NOT end)
→ Skips: collision entity, GCR, other party, CIQ

### Sections 8 & 9: Damage + Passengers
23. Visible damage?
24. Propulsion damage? → which parts?
25–27. Parties involved / life vests / pet onboard

### Section 10: Enhanced CIQ (collision branch only)
Receives `impactLocation`, `collisionEntities`, `operatingState` from upstream.

| Enhancement | Behavior |
|-------------|----------|
| Anchored/moored | Direction question (360° drag handle) → manual sticker placement |
| Drifting | Skip speed + accel questions |
| Multi-entity | Skip collision point; draw moving boats → place non-moving boat sticker → place static stickers → summary |
| Single entity | Standard ciq-boats flow preserved |

Standard CIQ features maintained: speed (mph/knots), accel trend, other boat speed/accel, path drawing, PDOF, collision type override.

### Section 11: Documentation
28. Coast guard report (Yes/No → photo)
29. Additional photos (with "same location" option)
30. Photo description (large text box)

### Section 12: Summary
Full structured FNOL summary + "Demo Only" carrier JSON payload + restart button

---

## Branching Logic Quick Reference

| Condition | Effect |
|-----------|--------|
| Land selected | Modal → end |
| International waters | Termination screen → end |
| Water assistance selected | Waterside number screen → end |
| Any immediate concern | `isUrgent = true` → skip GCR → CIQ |
| What happened = Weather | Skip collision/GCR/CIQ, continue to damage |
| What happened = Engine/Propulsion | Skip collision/GCR/CIQ, continue to damage |
| What happened = Other (non-water-assistance) | `skipCollision = true`, skip collision questions |
| operatingState = Anchored/Moored | CIQ: direction picker + sticker vs path drawing |
| operatingState = Drifting | CIQ: skip speed + accel |
| Multiple collision entities | CIQ: skip collision point, multi-entity sticker flow |

---

## CIQ Enhancements vs ciq-boats

See `KNOWLEDGE-ciq-boats.md` for the original ciq-boats CIQ behavior. Changes in this project:

- Location entry is **separated from CIQ** — handled upstream in Section 3
- "What collided with" is **upstream** — feeds entity types into CIQ
- Anchored/moored boats use **direction picker + sticker** instead of path drawing
- Drifting boats **skip speed/accel** questions
- Multi-entity collisions use **multi-sticker flow** — no single collision point

---

## Design System

- Assured design system card pattern for all new screens (`ButtonSingleSelect/List` style)
- CIQ screens: preserve ciq-boats look
- Colors: Primary `#1660F4`, Amber `#F59E0B` (other boat), Blue `#3B82F6` (your boat), Red `#EF4444` (impact)
- Font: Inter 400/500/600, base 16px

---

## How Mark Likes to Work

- Plan first, execute phase by phase
- Status report after each phase so mistakes can be caught early
- Minimal diffs, not full files
- Ask before guessing on ambiguous requirements
- Flag insurance domain implications (mitigation duty, fraud signals, subrogation)
