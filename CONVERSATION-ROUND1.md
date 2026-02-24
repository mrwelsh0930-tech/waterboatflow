# Boats CIQ — Round 1 Feedback Implementation

## Context
- Boats CIQ is a standalone marine collision reconstruction tool built with Next.js 16.1.6, React 19, Tailwind CSS v4, TypeScript
- Deployed to Vercel at https://ciq-boats.vercel.app
- The user (head of product at Assured) provided 7 Round 1 feedback items after the initial build and rotation feature were completed

## Round 1 Feedback Items
1. Google Maps search should filter by previously entered state/city
2. Collision types should be boat-specific: Overtaken, Boat Crossing, Anchored/Moored Boat Struck (conditional on stopped), Docking/Undocking Collision
3. Add approximate collision coordinates to user-facing summary
4. Move marina question + collision pin upstream (right after collision type, before speed questions)
5. Remove rest position step — boats float too much
6. Remove "boat ramp" from help text, allow free-form address entry
7. Vessel rotation orientation at collision point, not path end

## Implementation Summary

### Step 1: Flow Reorder + Remove Rest Position
- Reordered BOAT_STEPS: [0,1,2,3,6,8,4,5,7,9,10,12]
- Removed step 11 (rest position) entirely
- Updated all handler transitions (handleCollisionTypeSelect, handleMarinaArea, handleSpeedComplete, handleAccelerationComplete)
- Removed step 11 from getMapMode, canProceed, getMapInstruction, getMapSubInstruction, handleMapClick
- Files: reconstruction.ts, BoatReconstructionFlow.tsx, BoatSummary.tsx

### Step 2: Update Collision Types
- Changed BOAT_COLLISION_TYPE_OPTIONS to boat-specific terms
- Updated classifyCollision() in geometry.ts: ≤30° → "Overtaken", 60-120° → "Boat Crossing"
- Made "Anchored/Moored Boat Struck" conditional on movementType === "stopped" in BoatSummary
- Files: reconstruction.ts, geometry.ts, BoatSummary.tsx

### Step 3: Address Search Filtering
- Added locationBias prop to AddressInput
- Geocodes city/state to bias Google Places autocomplete results
- Uses locationBias (Circle) on AutocompletionRequest instead of deprecated location/radius
- Added free-form "Continue with..." button with geocoding fallback
- Removed "boat ramp" from help text
- Passed locationBias from BoatReconstructionFlow
- Files: AddressInput.tsx, BoatReconstructionFlow.tsx

### Step 4: Collision Coordinates in Summary
- Added approximate lat/lng (4 decimal places) to user-facing summary section
- Files: BoatSummary.tsx

### Step 5: Rotation at Impact Point
- Changed rotationOverlay position from path end to state.impactPoint
- Compute initial rotation from pre-impact approach bearing via splitPathAtImpact
- Files: BoatReconstructionFlow.tsx

### Step 6: Build & Deploy
- Build passed cleanly
- Deployed via `npx vercel --prod` (auto-deploy not configured)

## Known Issue: Drawing Regression
After deployment, the user reported that drawing paths on the map stopped working (clicking/touching on "Draw the path" screen does nothing).

Root cause investigation:
- The flow reorder caused the map to UNMOUNT between collision pin (step 8) and drawing (step 9) — previously it stayed mounted
- Google Maps' internal DOM panes may create z-index conflicts with the drawing overlay when the map freshly mounts
- Fix attempted: Adding `position: relative; zIndex: 0` to MAP_CONTAINER_STYLE to create a stacking context for the GoogleMap container, isolating its internal z-indices
- Status: Fix deployed, awaiting confirmation

## Files Changed
- `src/types/reconstruction.ts` — Step order, collision types
- `src/lib/geometry.ts` — classifyCollision()
- `src/components/AddressInput.tsx` — locationBias, free-form entry
- `src/components/BoatReconstructionFlow.tsx` — Flow reorder, rotation at impact point, address bias
- `src/components/BoatSummary.tsx` — Collision coordinates, conditional collision types
- `src/components/MapView.tsx` — Stacking context fix for drawing regression

## Deployment
- Vercel project: kenais-projects-51052634/ciq-boats
- URL: https://ciq-boats.vercel.app
- Git remote: https://github.com/mrwelsh0930-tech/ciq-boats.git
- Git email for deploys: mrwelsh0930@gmail.com
