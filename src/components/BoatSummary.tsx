"use client";

import { useState } from "react";
import { BoatReconstructionState } from "@/types/reconstruction";
import { BOAT_COLLISION_TYPE_OPTIONS } from "@/types/reconstruction";

interface BoatSummaryProps {
  state: BoatReconstructionState;
  onStartOver: () => void;
  onCollisionTypeOverride: (type: string) => void;
}

const TREND_LABELS: Record<string, string> = {
  accelerating: "Speeding up",
  decelerating: "Slowing down",
  constant: "Same speed",
  unknown: "Not sure",
};

const WATER_BODY_LABELS: Record<string, string> = {
  ocean: "Ocean",
  lake: "Lake / Pond",
  river: "River / Stream",
  other: "Other body of water",
};

export function BoatSummary({ state, onStartOver, onCollisionTypeOverride }: BoatSummaryProps) {
  const isBoat = state.collisionEntityType === "boat";
  const otherLabel = isBoat
    ? "Another boat"
    : state.collisionEntityType === "fixed-property"
      ? "Fixed property"
      : state.collisionEntityType === "animal"
        ? "An animal"
        : state.collisionEntityType === "object"
          ? "An object"
          : state.collisionEntityType === "swimmer"
            ? "A swimmer"
            : "Unknown";

  const movementLabel = state.yourBoat.movementType === "forward"
    ? "Moving forward"
    : state.yourBoat.movementType === "reverse"
      ? "Reversing"
      : state.yourBoat.movementType === "stopped"
        ? "Anchored / Stopped"
        : null;

  const collisionType = state.collisionTypeOverride
    || state.derived.collisionType
    || "Unable to determine";

  const speedDisplay = state.yourBoat.speedEstimate !== null
    ? `~${state.yourBoat.speedEstimate} ${state.yourBoat.speedUnit}`
    : null;

  const [editing, setEditing] = useState(false);
  const [otherText, setOtherText] = useState("");
  const [showOtherInput, setShowOtherInput] = useState(false);

  const handleTypeSelect = (type: string) => {
    if (type === "Other") {
      setShowOtherInput(true);
    } else {
      onCollisionTypeOverride(type);
      setEditing(false);
      setShowOtherInput(false);
    }
  };

  const handleOtherSubmit = () => {
    if (otherText.trim()) {
      onCollisionTypeOverride(otherText.trim());
      setEditing(false);
      setShowOtherInput(false);
      setOtherText("");
    }
  };

  const isSwimmer = state.collisionEntityType === "swimmer";

  return (
    <div className="flex flex-col items-center w-full">
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-[#F1F5F9] rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-7 h-7 text-[#1660F4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-medium text-[18px] leading-[28px] tracking-[-0.26px] text-[#475569]">All done</h2>
        <p className="font-normal text-[14px] leading-[20px] tracking-[-0.09px] text-[#94A3B8] mt-1">Here&apos;s your approximate reconstruction.</p>
      </div>

      <div className="w-full space-y-3">
        {/* Water body type */}
        {state.waterBodyType && (
          <div className="bg-[#F1F5F9] rounded-[8px] p-4">
            <p className="text-[12px] text-[#94A3B8] uppercase tracking-wide mb-1">
              Body of water
            </p>
            <p className="font-medium text-[14px] text-[#475569]">
              {WATER_BODY_LABELS[state.waterBodyType] || state.waterBodyType}
            </p>
          </div>
        )}

        {/* Location */}
        {(state.stateProvince || state.embarkationAddress) && (
          <div className="bg-[#F1F5F9] rounded-[8px] p-4">
            <p className="text-[12px] text-[#94A3B8] uppercase tracking-wide mb-1">
              Location
            </p>
            {state.embarkationAddress && (
              <p className="font-medium text-[14px] text-[#475569]">{state.embarkationAddress}</p>
            )}
            {state.city && state.stateProvince && (
              <p className="text-[13px] text-[#94A3B8] mt-0.5">{state.city}, {state.stateProvince}</p>
            )}
          </div>
        )}

        {/* What you hit */}
        <div className="bg-[#F1F5F9] rounded-[8px] p-4">
          <p className="text-[12px] text-[#94A3B8] uppercase tracking-wide mb-1">
            Collided with
          </p>
          <p className="font-medium text-[14px] text-[#475569]">{otherLabel}</p>
        </div>

        {/* Collision type (boat-to-boat only) */}
        {isBoat && (
          <div className="bg-[#F1F5F9] rounded-[8px] p-4">
            <p className="text-[12px] text-[#94A3B8] uppercase tracking-wide mb-2">
              Collision type
            </p>
            {!editing ? (
              <div className="flex items-center justify-between">
                <p className="font-medium text-[14px] text-[#475569]">{collisionType}</p>
                <button
                  onClick={() => setEditing(true)}
                  className="text-[13px] font-medium text-[#1660F4] active:text-[#1250D4]"
                >
                  Edit
                </button>
              </div>
            ) : showOtherInput ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={otherText}
                  onChange={(e) => setOtherText(e.target.value)}
                  placeholder="Describe the collision type"
                  autoFocus
                  className="w-full h-[44px] px-3 border border-[#D4D4D4] rounded-[6px] text-[14px] text-[#475569] placeholder:text-[#94A3B8] focus:border-[#1660F4] focus:outline-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => { setShowOtherInput(false); setOtherText(""); }}
                    className="flex-1 h-[36px] border border-[#D4D4D4] rounded-[6px] text-[13px] text-[#475569]"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleOtherSubmit}
                    disabled={!otherText.trim()}
                    className="flex-1 h-[36px] bg-[#1660F4] rounded-[6px] text-[13px] text-white disabled:bg-[#94A3B8]"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                {BOAT_COLLISION_TYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleTypeSelect(opt)}
                    className={`w-full text-left px-3 py-2 rounded-[6px] text-[14px] transition-colors ${
                      collisionType === opt
                        ? "bg-[#1660F4] text-white font-medium"
                        : "bg-white text-[#475569] hover:bg-[#E2E8F0]"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
                <button
                  onClick={() => handleTypeSelect("Other")}
                  className="w-full text-left px-3 py-2 rounded-[6px] text-[14px] bg-white text-[#475569] hover:bg-[#E2E8F0] transition-colors"
                >
                  Other
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="w-full text-center py-1.5 text-[13px] text-[#94A3B8]"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}

        {/* Your vessel info */}
        <div className="bg-[#F1F5F9] rounded-[8px] p-4">
          <p className="text-[12px] text-[#1660F4] uppercase tracking-wide mb-2">
            Your vessel
          </p>
          <div className="space-y-2 text-[14px]">
            {movementLabel && (
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Before the collision</span>
                <span className="font-medium text-[#475569]">{movementLabel}</span>
              </div>
            )}
            {speedDisplay && (
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Estimated speed</span>
                <span className="font-medium text-[#475569]">{speedDisplay}</span>
              </div>
            )}
            {!speedDisplay && state.yourBoat.movementType && state.yourBoat.movementType !== "stopped" && (
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Estimated speed</span>
                <span className="font-medium text-[#94A3B8]">Not sure</span>
              </div>
            )}
            {state.yourBoat.speedTrend && (
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Speed change</span>
                <span className="font-medium text-[#475569]">
                  {TREND_LABELS[state.yourBoat.speedTrend] || state.yourBoat.speedTrend}
                </span>
              </div>
            )}
            {!isSwimmer && (
              <>
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Path</span>
                  <span className="font-medium text-[#1660F4]">Recorded</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Rest position</span>
                  <span className="font-medium text-[#1660F4]">Recorded</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Other boat info */}
        {isBoat && (
          <div className="bg-[#F1F5F9] rounded-[8px] p-4">
            <p className="text-[12px] text-[#F59E0B] uppercase tracking-wide mb-2">
              Other vessel
            </p>
            <div className="space-y-2 text-[14px]">
              <div className="flex justify-between">
                <span className="text-[#94A3B8]">Path</span>
                <span className="font-medium text-[#1660F4]">Recorded</span>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation */}
        <div className="bg-[#F1F5F9] rounded-[8px] p-4 text-center">
          <p className="text-[14px] text-[#475569]">
            This is an approximate sketch based on your memory. Our team will review and verify the details.
          </p>
        </div>

        {/* Carrier Data Preview — demo only */}
        <div className="mt-4 border-t border-dashed border-[#CBD5E1] pt-4">
          <div className="bg-[#6B3CDD]/10 rounded-[8px] p-3 mb-3">
            <p className="text-[12px] font-medium text-[#6B3CDD] uppercase tracking-wide text-center">
              Demo Only — Not User Facing
            </p>
            <p className="text-[12px] text-[#6B3CDD]/70 text-center mt-1">
              Sample of structured data the carrier receives
            </p>
          </div>

          <div className="space-y-2">
            {state.impactPoint && (
              <div className="bg-[#F1F5F9] rounded-[6px] p-3">
                <p className="text-[11px] text-[#94A3B8] uppercase tracking-wide mb-1">Impact Coordinates</p>
                <p className="font-mono text-[12px] text-[#475569]">
                  {state.impactPoint.lat.toFixed(6)}, {state.impactPoint.lng.toFixed(6)}
                </p>
              </div>
            )}

            {!isSwimmer && (
              <div className="bg-[#F1F5F9] rounded-[6px] p-3">
                <p className="text-[11px] text-[#94A3B8] uppercase tracking-wide mb-2">Vessel 1 (Insured)</p>
                <div className="space-y-1 text-[12px] font-mono text-[#475569]">
                  <p>Pre-impact: {state.yourBoat.preImpactPath.length} pts</p>
                  <p>Post-impact: {state.yourBoat.postImpactPath.length} pts</p>
                  {state.yourBoat.approachBearing !== null && (
                    <p>Bearing: {state.yourBoat.approachBearing.toFixed(1)}&deg;</p>
                  )}
                  {state.yourBoat.restPosition && (
                    <p>Rest: {state.yourBoat.restPosition.lat.toFixed(6)}, {state.yourBoat.restPosition.lng.toFixed(6)}</p>
                  )}
                </div>
              </div>
            )}

            {isBoat && "preImpactPath" in state.otherEntity && (
              <div className="bg-[#F1F5F9] rounded-[6px] p-3">
                <p className="text-[11px] text-[#94A3B8] uppercase tracking-wide mb-2">Vessel 2 (Other)</p>
                <div className="space-y-1 text-[12px] font-mono text-[#475569]">
                  <p>Pre-impact: {(state.otherEntity as typeof state.yourBoat).preImpactPath.length} pts</p>
                  <p>Post-impact: {(state.otherEntity as typeof state.yourBoat).postImpactPath.length} pts</p>
                </div>
              </div>
            )}

            <div className="bg-[#F1F5F9] rounded-[6px] p-3">
              <p className="text-[11px] text-[#94A3B8] uppercase tracking-wide mb-2">Computed</p>
              <div className="space-y-1 text-[12px] font-mono text-[#475569]">
                {state.derived.approachAngle !== null && (
                  <p>Approach: {state.derived.approachAngle.toFixed(1)}&deg;</p>
                )}
                {state.derived.collisionType && (
                  <p>Type: {state.collisionTypeOverride || state.derived.collisionType}{state.collisionTypeOverride ? " (user corrected)" : ""}</p>
                )}
                {state.derived.pdofClockApprox !== null && (
                  <p>PDOF: {state.derived.pdofClockApprox} o&apos;clock</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Start Over */}
        <button
          onClick={onStartOver}
          className="w-full h-[55px] bg-[#1660F4] rounded-[8px] text-white text-[16px] font-normal leading-[24px] active:bg-[#1250D4] transition-colors mt-4"
        >
          Start Over
        </button>
      </div>
    </div>
  );
}
