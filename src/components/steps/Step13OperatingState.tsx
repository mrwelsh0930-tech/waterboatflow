"use client";

import { useState } from "react";
import { OperatingState } from "@/types/fnol";
import { QuestionCard } from "@/components/ui/QuestionCard";
import { ButtonMultiSelect } from "@/components/ui/ButtonMultiSelect";

interface Props {
  boatLabel: string;
  onContinue: (operatingState: OperatingState[]) => void;
  onBack: () => void;
}

const OPTIONS: { value: OperatingState; label: string; emoji: string }[] = [
  { value: "under-power", label: "Under power (engine running)", emoji: "⚡" },
  { value: "drifting", label: "Drifting", emoji: "🌊" },
  { value: "anchored", label: "Anchored", emoji: "⚓" },
  { value: "moored", label: "Moored (tied up)", emoji: "🪢" },
  { value: "docked", label: "Docked", emoji: "🏗️" },
];

export function Step13OperatingState({ boatLabel, onContinue, onBack }: Props) {
  const [selected, setSelected] = useState<OperatingState[]>([]);

  function toggle(value: OperatingState) {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  return (
    <QuestionCard
      question={`How was ${boatLabel} operating at the time?`}
      helperText="Select all that apply."
      onContinue={() => onContinue(selected)}
      continueDisabled={selected.length === 0}
      onBack={onBack}
    >
      {OPTIONS.map((o) => (
        <ButtonMultiSelect
          key={o.value}
          emoji={o.emoji}
          label={o.label}
          selected={selected.includes(o.value)}
          onClick={() => toggle(o.value)}
        />
      ))}
    </QuestionCard>
  );
}
