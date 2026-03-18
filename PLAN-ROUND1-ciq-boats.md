# Boats CIQ — Round 1 Feedback Implementation

**Overall Progress:** `0%`

## TLDR
Seven product feedback items: reorder the flow (marina + collision pin upstream, before speed questions), remove rest position step, update collision types to boat-specific terms, filter address search by state/city, add collision coordinates to summary, fix rotation handle to appear at impact point, and clean up embarkation search UX.

## Critical Decisions
- **Step IDs stay as-is, reorder BOAT_STEPS array** — step IDs are semantic (8 = collision pin, 9 = your path). Reordering the array + fixing explicit handler jumps is cleaner than renumbering every switch/case across the codebase.
- **New step flow**: 0→1→2→3→6→8→4→5→7→9→10→12 (step 11 removed entirely)
- **Rotation at impact point** — compute initial bearing from pre-impact path (preview split), render boat marker + ring at `state.impactPoint` instead of path endpoint. This is the UX-correct position since orientation matters at collision, not at rest.
- **Collision type auto-classification** — update `classifyCollision()` to return boat-specific terms (Overtaken, Boat Crossing, etc.). "Anchored/Moored Boat Struck" is conditional on `movementType === "stopped"`.
- **Address free-form fallback** — allow user to proceed without selecting a prediction. Use city/state center as map fallback location.

## Tasks:

- [ ] 🟥 **Step 1: Reorder flow + remove rest position**
  - [ ] 🟥 Reorder `BOAT_STEPS` array in `reconstruction.ts`: `[0,1,2,3,6,8,4,5,7,9,10,12]`
  - [ ] 🟥 Remove step 11 from `BOAT_STEPS`
  - [ ] 🟥 Update `handleCollisionTypeSelect`: jump to step 6 (marina) for non-swimmer, step 4 (speed) for swimmer
  - [ ] 🟥 Update `handleMarinaArea`: jump to step 8 (collision pin) instead of step 7
  - [ ] 🟥 Update `handleSpeedComplete`: stopped → step 7 (instruction), moving → step 5 (acceleration), swimmer → step 12
  - [ ] 🟥 Update `handleAccelerationComplete`: jump to step 7 (instruction)
  - [ ] 🟥 Remove step 11 from `getMapMode`, `canProceed`, `getMapInstruction`, `getMapSubInstruction`, `handleMapClick`
  - [ ] 🟥 Remove rest position auto-populate in `goToNextStep`
  - [ ] 🟥 Remove step 11 from swimmer skip filter (no longer exists)
  - [ ] 🟥 Remove `restPositions` prop from MapView call (pass empty array)
  - [ ] 🟥 Remove "Rest position: Recorded" from BoatSummary

- [ ] 🟥 **Step 2: Update collision types to boat-specific**
  - [ ] 🟥 Replace `BOAT_COLLISION_TYPE_OPTIONS` in `reconstruction.ts`: `["Overtaken", "Boat Crossing", "Anchored/Moored Boat Struck", "Docking/Undocking Collision"]`
  - [ ] 🟥 Update `classifyCollision()` in `geometry.ts` to return boat terms: ≤30° → "Overtaken", ≥150° → "Boat Crossing" (head-on approach = crossing paths), 60-120° → "Boat Crossing", else → "Overtaken"
  - [ ] 🟥 In BoatSummary, conditionally show "Anchored/Moored Boat Struck" only when `movementType === "stopped"` — pass `movementType` or derive from state

- [ ] 🟥 **Step 3: Filter address search by state/city + update help text**
  - [ ] 🟥 Add `locationBias?: { state: string; city: string }` prop to `AddressInput`
  - [ ] 🟥 Use Google Places `componentRestrictions` (country: US) + `location`/`radius` bias centered on city/state
  - [ ] 🟥 Remove "boat ramp" from help text — update to imply marina or pier name only
  - [ ] 🟥 Add "Continue with this address" button when user types but no prediction matches (free-form fallback)
  - [ ] 🟥 For free-form: geocode the text via Google Geocoding, or fall back to city/state center
  - [ ] 🟥 Pass `stateProvince` + `city` from flow state into AddressInput

- [ ] 🟥 **Step 4: Add collision coordinates to user-facing summary**
  - [ ] 🟥 Add "Approximate Collision Coordinates" row to the user-facing summary section in `BoatSummary` (above the demo data block), showing lat/lng rounded to ~4 decimal places

- [ ] 🟥 **Step 5: Move rotation handle to impact point**
  - [ ] 🟥 Change `rotationOverlay.position` from `currentPath[currentPath.length - 1]` to `state.impactPoint`
  - [ ] 🟥 Compute initial rotation from pre-impact approach bearing: preemptively run `splitPathAtImpact` on `currentPath` + `impactPoint`, then `getPathEndBearing` on the pre-impact segment
  - [ ] 🟥 Remove rotation override on path-end boat marker (let it use path-derived bearing)
  - [ ] 🟥 Render rotated boat marker at impact point in MapView when rotation overlay is active (new prop or check `rotationOverlay` position)
  - [ ] 🟥 Update sub-instruction text: "Drag the blue handle to set your vessel's orientation at the collision point."

- [ ] 🟥 **Step 6: Build, test, deploy**
  - [ ] 🟥 `next build` — verify clean compilation
  - [ ] 🟥 Manual walkthrough: boat-to-boat flow (full path)
  - [ ] 🟥 Manual walkthrough: swimmer flow (skip map)
  - [ ] 🟥 Manual walkthrough: fixed-property flow (sticker + single path)
  - [ ] 🟥 Verify rotation handle appears at impact point, not path end
  - [ ] 🟥 Verify address search filters by state/city
  - [ ] 🟥 `vercel --prod` deploy
