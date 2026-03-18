"use client";

import { useState } from "react";
import { QuestionCard } from "@/components/ui/QuestionCard";
import { ButtonSingleSelect } from "@/components/ui/ButtonSingleSelect";

interface Props {
  onContinue: (hasPhotos: boolean, atIncidentLocation: boolean | null) => void;
  onBack: () => void;
}

export function Step62AdditionalPhotos({ onContinue, onBack }: Props) {
  const [hasPhotos, setHasPhotos] = useState<boolean | null>(null);
  const [atLocation, setAtLocation] = useState<boolean | null>(null);

  function handleContinue() {
    if (hasPhotos === false) {
      onContinue(false, null);
    } else if (hasPhotos === true) {
      onContinue(true, atLocation);
    }
  }

  const canContinue = hasPhotos === false || (hasPhotos === true && atLocation !== null);

  return (
    <QuestionCard
      question="Are there additional photos of the damage or incident?"
      onContinue={handleContinue}
      continueDisabled={!canContinue}
      onBack={onBack}
    >
      <ButtonSingleSelect
        emoji="✅"
        label="Yes — I have photos"
        selected={hasPhotos === true}
        onClick={() => setHasPhotos(true)}
      />
      <ButtonSingleSelect
        emoji="❌"
        label="No photos"
        selected={hasPhotos === false}
        onClick={() => setHasPhotos(false)}
      />

      {hasPhotos === true && (
        <>
          <div className="border-t border-[#E2E8F0] my-1" />
          <p className="text-sm font-medium text-[#1E293B] mt-1">
            Were the photos taken at the incident location?
          </p>
          <ButtonSingleSelect
            emoji="📍"
            label="Yes — same location as incident"
            selected={atLocation === true}
            onClick={() => setAtLocation(true)}
          />
          <ButtonSingleSelect
            emoji="📷"
            label="No — different location"
            selected={atLocation === false}
            onClick={() => setAtLocation(false)}
          />

          <div className="border-2 border-dashed border-[#CBD5E1] rounded-xl p-6 flex flex-col items-center gap-2 bg-[#F8FAFC] mt-1">
            <span className="text-2xl">📸</span>
            <p className="text-sm font-medium text-[#475569]">Tap to add photos</p>
            <button className="px-4 py-2 rounded-lg bg-[#1660F4] text-white text-xs font-semibold hover:bg-[#1250D4] transition-colors">
              Choose photos
            </button>
          </div>
        </>
      )}
    </QuestionCard>
  );
}
