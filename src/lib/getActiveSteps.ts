import type { FNOLState } from "@/types/fnol";

/**
 * Returns the ordered list of step IDs that should be shown for the current
 * state. This is the single source of truth for all branching logic.
 *
 * Step ID ranges:
 *   1–3    Watercraft Identity
 *   4      Land vs Water fork
 *   5–8,75 Location Entry
 *   9      Immediate Concerns
 *   10–11  Incident Type + Operating State
 *   20–25  Collision GCR
 *   30–35  Weather branch
 *   40–41  Damage
 *   42–44  Passengers & Pets
 *   50     CIQ (full sub-flow handled internally by CIQ components)
 *   60–62  Documentation
 *   70     Summary
 */
export function getActiveSteps(state: FNOLState): number[] {
  const steps: number[] = [];

  // ── Section 1: Watercraft Identity (always) ───────────────────────────────
  steps.push(1); // Make/manufacturer
  steps.push(2); // Color
  steps.push(3); // Boat type

  // ── Section 2: Land vs Water fork ────────────────────────────────────────
  steps.push(4); // Land or water?

  // If not on water, flow ends at step 4 (modal shown, no further steps)
  if (state.isOnWater === false) return steps;

  // ── Section 3: Location Entry ─────────────────────────────────────────────
  steps.push(5); // State + city
  steps.push(6); // Marina or busy waterway?
  steps.push(7); // Location method (Starting location / GPS / International waters)

  // International waters terminates — no further steps
  if (state.locationMethod === "international-waters") return steps;

  // Address/GPS entry before map pin
  if (
    state.locationMethod === "starting-location" ||
    state.locationMethod === "gps"
  ) {
    steps.push(75); // Address or GPS coordinate entry
  }

  steps.push(8); // Map pin placement

  // ── Section 4: Immediate Concerns ────────────────────────────────────────
  steps.push(9); // Urgent conditions multi-select

  // ── Section 5: Incident Type + Operating State ───────────────────────────
  // Skip "What happened" if urgent — go straight to CIQ
  if (!state.isUrgent) {
    steps.push(10); // What happened?
    // "Other" + water assistance terminates — no further steps
    if (
      state.incidentType === "other" &&
      state.otherIncidentSubtype === "water-assistance"
    ) {
      return steps;
    }
    // "Other" (non-water-assistance): show "Help us understand" + "Tell me more"
    if (state.incidentType === "other") {
      steps.push(11); // Help us understand sub-screen
      steps.push(12); // Tell me more free-form
    }
  }

  steps.push(13); // Operating state

  // ── Section 7A: Collision GCR ─────────────────────────────────────────────
  const showCollision =
    (state.incidentType === "collision" || state.isUrgent) &&
    !state.skipCollision;

  if (showCollision) {
    steps.push(20); // What did your boat collide with? (multi-select)

    // Per-entity sequential follow-ups (one step per entity; component handles sub-screens internally)
    state.collisionEntities.forEach((entity, idx) => {
      const base = 200 + idx * 10;
      if (
        entity.type === "fixed-property" ||
        entity.type === "animal" ||
        entity.type === "object"
      ) {
        steps.push(base + 1);
      }
      // boat and swimmer: no follow-up question
    });

    steps.push(21); // Where in the water?

    const hasOtherBoat = state.collisionEntities.some((e) => e.type === "boat");
    if (hasOtherBoat) {
      steps.push(22); // Collision type (Overtaken / Crossing / Docking / Other)

      if (state.collisionType === "overtaken") {
        steps.push(23); // Navigational rules + under power questions
      } else if (state.collisionType === "boats-crossing") {
        steps.push(24); // Right of way
      } else if (state.collisionType === "docking-undocking") {
        steps.push(25); // Docking questions + right of way
      } else if (state.collisionType === "other") {
        steps.push(24); // Right of way (reuse same screen)
      }

      steps.push(26); // Other party: type + operating state + color + insurance card
    }
  }

  // ── Section 7B: Weather Branch ────────────────────────────────────────────
  if (state.incidentType === "weather") {
    steps.push(30); // Active weather warning?
    steps.push(31); // Storm name?
    steps.push(32); // Conditions (multi-select)

    const isSecuredState =
      state.operatingState.includes("anchored") ||
      state.operatingState.includes("moored") ||
      state.operatingState.includes("docked");

    if (isSecuredState) {
      steps.push(33); // Was boat secured/tied up?
      if (state.boatWasSecured) {
        steps.push(34); // Did it break free?
      }
    }
    steps.push(35); // Precautions taken (multi-select)
    // Weather branch rejoins main flow — continues to damage/passengers/docs/summary
  }

  // ── Sections 8 & 9: Damage + Passengers ──────────────────────────────────
  steps.push(40); // Can you see the damage?
  if (state.damageVisible !== null) {
    // skip only if explicitly "mechanical/electrical only" (damageVisible === null means skipped)
  }
  steps.push(41); // Propulsion damage?
  if (state.propulsionDamaged) {
    steps.push(410); // Which propulsion parts?
  }

  steps.push(42); // How many parties involved?
  if (state.towActivities.length > 0) {
    steps.push(43); // Life vest question
  }
  steps.push(44); // Pet onboard?

  // ── Section 10: CIQ ──────────────────────────────────────────────────────
  // Show CIQ for collision branch or urgent skip
  if (showCollision) {
    steps.push(50); // CIQ (sub-flow managed internally)
  }

  // ── Section 11: Documentation ─────────────────────────────────────────────
  steps.push(60); // Coast guard report?
  if (state.coastGuardReportFiled) {
    steps.push(61); // Coast guard report photo upload
  }
  steps.push(62); // Additional photos?
  steps.push(63); // Photo description

  // ── Section 12: Summary ───────────────────────────────────────────────────
  steps.push(70); // Summary

  return steps;
}

/**
 * Given current step and state, returns the next step ID.
 */
export function getNextStep(currentStepId: number, state: FNOLState): number | null {
  const steps = getActiveSteps(state);
  const idx = steps.indexOf(currentStepId);
  if (idx === -1 || idx === steps.length - 1) return null;
  return steps[idx + 1];
}

/**
 * Given current step and state, returns the previous step ID.
 */
export function getPrevStep(currentStepId: number, state: FNOLState): number | null {
  const steps = getActiveSteps(state);
  const idx = steps.indexOf(currentStepId);
  if (idx <= 0) return null;
  return steps[idx - 1];
}

/**
 * Returns progress percentage (0–100) based on current position in active steps.
 */
export function getProgressPercent(state: FNOLState): number {
  const steps = getActiveSteps(state);
  const idx = steps.indexOf(state.currentStepId);
  if (idx === -1 || steps.length <= 1) return 0;
  return Math.round((idx / (steps.length - 1)) * 100);
}
