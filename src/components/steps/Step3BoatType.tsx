"use client";

import { useState } from "react";
import { BoatType } from "@/types/fnol";
import { QuestionCard } from "@/components/ui/QuestionCard";

interface Props {
  value: BoatType | null;
  onContinue: (type: BoatType) => void;
  onBack: () => void;
}

const BOAT_TYPES: { value: BoatType; label: string; emoji: string; description: string }[] = [
  { value: "center-console", label: "Center Console", emoji: "⛵", description: "Open deck, center steering" },
  { value: "pontoon", label: "Pontoon / Tritoon", emoji: "🛟", description: "Flat deck, pontoon tubes" },
  { value: "pwc", label: "Personal Watercraft (PWC)", emoji: "🏄", description: "Jet ski, WaveRunner" },
  { value: "jet-boat", label: "Jet Boat", emoji: "💨", description: "Jet-propelled, no propeller" },
  { value: "sailboat", label: "Sailboat", emoji: "⛵", description: "Wind-powered vessel" },
  { value: "motor-yacht", label: "Motor Yacht / Trawler", emoji: "🛥️", description: "Large powered cruiser" },
  { value: "performance-runabout", label: "Bowrider / Performance Runabout", emoji: "🚤", description: "V-hull sport boat" },
  { value: "bass", label: "Bass / Flats / Bayboat", emoji: "🎣", description: "Fishing-focused hull" },
  { value: "ski-wake", label: "Ski / Wake Boat", emoji: "🎿", description: "Tow sports, deep V" },
  { value: "dinghy-other", label: "Dinghy / Aluminum / Other", emoji: "🤔", description: "Jon boat, utility, runabout" },
];

export function Step3BoatType({ value, onContinue, onBack }: Props) {
  const [selected, setSelected] = useState<BoatType | null>(value);

  return (
    <QuestionCard
      question="Select your boat type"
      helperText="Choose the option that best describes your watercraft."
      onContinue={() => selected && onContinue(selected)}
      continueDisabled={!selected}
      onBack={onBack}
    >
      <div className="grid grid-cols-2 gap-2">
        {BOAT_TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => setSelected(t.value)}
            className={`
              flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-colors text-center
              ${
                selected === t.value
                  ? "border-[#1660F4] bg-blue-50 text-[#1660F4]"
                  : "border-[#D4D4D4] bg-white text-[#475569] hover:border-[#1660F4] hover:bg-blue-50"
              }
            `}
          >
            <span className="text-2xl">{t.emoji}</span>
            <span className="text-xs font-medium leading-tight">{t.label}</span>
          </button>
        ))}
      </div>
    </QuestionCard>
  );
}
