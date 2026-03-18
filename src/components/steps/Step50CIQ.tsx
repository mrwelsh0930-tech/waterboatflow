"use client";

import { useState } from "react";
import { LatLng, OperatingState, WaterBodyType, CollisionEntity } from "@/types/fnol";
import { BoatReconstructionFlow, FnolContext } from "@/components/BoatReconstructionFlow";

interface Props {
  impactPoint: LatLng | null;
  collisionEntities: CollisionEntity[];
  isMarina: boolean | null;
  waterBodyType: WaterBodyType | null;
  stateProvince: string;
  city: string;
  embarkationAddress: string;
  embarkationLocation: LatLng | null;
  operatingState: OperatingState[];
  onComplete: () => void;
  onBack: () => void;
}

export function Step50CIQ({
  impactPoint,
  collisionEntities,
  isMarina,
  waterBodyType,
  stateProvince,
  city,
  embarkationAddress,
  embarkationLocation,
  operatingState,
  onComplete,
  onBack,
}: Props) {
  const [showFinish, setShowFinish] = useState(false);

  const firstEntity = collisionEntities[0] ?? null;
  const collisionEntityType = firstEntity
    ? (firstEntity.type as FnolContext["collisionEntityType"])
    : null;
  const collisionEntitySubtype =
    firstEntity?.propertySubtype ??
    firstEntity?.animalSubtype ??
    firstEntity?.objectSubtype ??
    null;

  const fnolContext: FnolContext = {
    waterBodyType,
    stateProvince,
    city,
    embarkationAddress,
    embarkationLocation,
    impactPoint,
    isMarina,
    collisionEntityType,
    collisionEntitySubtype,
    operatingState: operatingState as string[],
  };

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* CIQ banner */}
      <div className="w-full max-w-[393px] bg-[#1660F4] text-white px-4 py-2.5 rounded-xl mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold">Collision IQ — Reconstruction</span>
        <button
          onClick={onBack}
          className="text-xs text-white/70 hover:text-white transition-colors"
        >
          ← Back
        </button>
      </div>

      {/* Embedded CIQ */}
      <BoatReconstructionFlow fnolContext={fnolContext} />

      {/* Done toggle */}
      <div className="w-full max-w-[393px] mt-4">
        {!showFinish ? (
          <button
            onClick={() => setShowFinish(true)}
            className="w-full py-3 rounded-lg text-sm font-medium border border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC] transition-colors"
          >
            Done with reconstruction →
          </button>
        ) : (
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-4 flex flex-col gap-3">
            <p className="text-sm text-[#1E293B] font-medium">
              Ready to continue to your claim summary?
            </p>
            <button
              onClick={onComplete}
              className="w-full py-3.5 rounded-lg text-sm font-semibold bg-[#1660F4] text-white hover:bg-[#1250D4] transition-colors"
            >
              Continue to Claim Summary
            </button>
            <button
              onClick={() => setShowFinish(false)}
              className="text-sm text-[#64748B] hover:text-[#475569] transition-colors"
            >
              Go back to reconstruction
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
