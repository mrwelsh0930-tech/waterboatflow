# CIQ Boats — Project Knowledge

Collision Investigation Questionnaire for marine/boating claims. Standalone Next.js app built to demo to **Progressive**. No Assured backend integration yet — pure React state, Vercel-hosted.

---

## Tech Stack

- Next.js 16 + React 19 + TypeScript + Tailwind CSS 4
- Google Maps JS API (`@react-google-maps/api`) — drawing, markers, polylines
- Sentry (`@sentry/nextjs`) — error tracking
- No GraphQL, no Prisma, no auth
- Env vars: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, `NEXT_PUBLIC_SENTRY_DSN`
- Deploy: `npx vercel --prod` (Vercel project: `ciq-boats`)

---

## Key Files

| File | Purpose |
|------|---------|
| `src/components/BoatReconstructionFlow.tsx` | Master orchestrator — all state, step logic, navigation (~1046 lines) |
| `src/components/BoatSummary.tsx` | Step 12 — final summary, collision type override, demo carrier payload |
| `src/components/MapView.tsx` | Google Maps canvas — drawing, impact pin, path visualization |
| `src/types/reconstruction.ts` | All type definitions + `BOAT_STEPS` constant |
| `src/lib/geometry.ts` | Bearing, distance, approach angle, PDOF classification math |
| `src/components/SpeedInput.tsx` | Steps 4 & 13 — movement type + speed (mph or knots) |
| `src/components/AccelerationInput.tsx` | Steps 5 & 14 — speed trend (accel/decel/constant/unknown) |
| `src/components/EmbarkationInput.tsx` | Step 2 — departure location (address or GPS fallback) |
| `src/components/BoatCollisionTypeSelector.tsx` | Step 3 — entity type + water-aware subtypes |

---

## Data Model

```typescript
// reconstruction.ts
type BoatCollisionEntityType = "boat" | "fixed-property" | "animal" | "object" | "swimmer"
type WaterBodyType = "ocean" | "lake" | "river" | "other"

interface BoatData {
  id: "you" | "other"
  preImpactPath: LatLng[]
  postImpactPath: LatLng[]
  approachBearing: number | null      // auto-computed from drawn path
  speedEstimate: number | null
  speedUnit: "mph" | "knots"
  movementType: "forward" | "reverse" | "stopped" | null
  speedTrend: "accelerating" | "decelerating" | "constant" | "unknown" | null
  rotation: number                    // 0-360, boat orientation at impact
}

interface DerivedData {
  approachAngle: number | null        // angle between two bearings
  collisionType: string | null        // "Overtaken" or "Boat Crossing" (auto-classified)
  pdofClockApprox: number | null      // 1-12 o'clock
}
```

---

## Step Flow

Steps are dynamically filtered in `BoatReconstructionFlow.tsx` based on collision type:

| Step | Description | Condition |
|------|-------------|-----------|
| 0 | Water body type (ocean/lake/river/other) | Always |
| 1 | State + city | Always |
| 2 | Embarkation point (address or GPS) | Always |
| 3 | What was hit (entity type + subtype) | Always |
| 4 | Your boat speed/movement | Always |
| 5 | Your boat speed trend | Skipped if your boat stopped |
| 6 | Marina area? | Skipped for swimmer collisions |
| 7 | Pre-draw instructions | Always |
| 8 | Impact point (map pin) | Always |
| 9 | Draw your boat's path | Always |
| 10 | Draw other boat's path | **Boat-to-boat only** |
| 12 | Summary & review | Always |
| 13 | Other boat speed/movement | **Boat-to-boat only** |
| 14 | Other boat speed trend | **Boat-to-boat only**, skipped if other stopped |

### Step Navigation (key handlers in BoatReconstructionFlow.tsx)

```
handleSpeedComplete()          Step 4 → 5 (if moving) | 13 (if boat + stopped) | 7
handleAccelerationComplete()   Step 5 → 13 (if boat) | 7
handleOtherSpeedComplete()     Step 13 → 14 (if moving) | 7
handleOtherAccelerationComplete() Step 14 → 7
```

---

## Collision Classification (geometry.ts)

```
Approach angle between bearings → Collision type
0–30°    → Overtaken
30–60°   → Overtaken
60–120°  → Boat Crossing
120–180° → Overtaken
```

PDOF clock position computed from approach angle. Both are auto-derived from drawn paths. User can override in the summary step.

---

## Entity Subtypes by Water Body

**Fixed property** (always): Dock, Boat lift, Bridge piling, Buoy, Pier, Seawall

**Animals:**
- Saltwater: Dolphin, Manatee, Sea turtle
- Freshwater: Fish, Duck, Goose, Turtle

**Objects:**
- Saltwater: Sandbar, Floating debris, Reef, Submerged object
- Freshwater: Rock, Log, Stump

---

## Upstream: damageIQ

Point of impact is captured in the **damageIQ assessment**, which runs **before** this reconstruction flow. This means:
- Rotation overlay in MapView is **not needed** — boat orientation is already known upstream
- Do not re-implement rotation capture here

---

## Relationship to ciq2 (Auto Version)

`ciq2` at `/Users/mark/Desktop/Personal Projects/ciq2/` is the auto-collision predecessor. `ciq-boats` is a domain-specialized fork. Key differences:

| | ciq2 (Auto) | ciq-boats (Marine) |
|--|------------|-------------------|
| Entity types | Car, motorcycle, bicycle | Boat, fixed-property, animal, object, swimmer |
| Location | Scene address | Embarkation point (departure) |
| Collision context | Parking lot, highway | Marina vs. open water |
| Animal/object subtypes | None | Saltwater vs. freshwater variants |
| Boat cursors on map | None | Forward/reverse SVG boat icons |
| Rotation | Feature flag `?rotation=true` | Dropped — damageIQ captures upstream |

---

## Future Integration with Assured Platform

Currently standalone. When embedded:
1. Accept `claimId`, `embarkationLocation` as props
2. `onComplete(state: BoatReconstructionState)` → GraphQL mutation to Assured backend
3. Map `BoatReconstructionState` → `EngineClaim` schema (TBD)
4. Step definitions could move to `apps/backend/src/workflows/modules/`

---

## Demo Carrier Payload (BoatSummary.tsx)

The summary's "Demo Only" section shows the structured JSON the carrier would receive:
- Impact coordinates (6 decimal precision)
- Boat 1 (insured): path point counts, bearing, rotation
- Boat 2 (other): path point counts, bearing (boat-to-boat only)
- Derived: approach angle, collision type, PDOF clock

---

## Active Plan (as of 2026-03-16)

Two items remaining before Progressive demo:

**1. Copy change** — `getMapInstruction()` in `BoatReconstructionFlow.tsx`
- Update 4 strings to include "collision": step 9 draw, step 9 confirm, step 10 draw, step 10 confirm

**2. Other vessel speed + acceleration** — steps 13/14 for boat-to-boat
- Add step 13, 14 to `BOAT_STEPS` in `types/reconstruction.ts`
- Add `vehicleLabel` prop to `AccelerationInput.tsx`
- Wire navigation handlers + JSX rendering blocks
- Update `BoatSummary.tsx` to show other vessel speed/movement/trend
