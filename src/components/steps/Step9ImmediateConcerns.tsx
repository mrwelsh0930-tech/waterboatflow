"use client";

import { useState } from "react";
import { ImmediateConcern } from "@/types/fnol";
import { QuestionCard } from "@/components/ui/QuestionCard";
import { ButtonMultiSelect } from "@/components/ui/ButtonMultiSelect";

interface Props {
  boatLabel: string;
  onContinue: (concerns: ImmediateConcern[], isUrgent: boolean) => void;
  onBack: () => void;
}

const CONCERNS: { value: ImmediateConcern; label: string; emoji: string }[] = [
  { value: "fuel-spill", label: "Fuel spilled into the water", emoji: "⛽" },
  { value: "oil-spill", label: "Oil spilled into the water", emoji: "🛢️" },
  { value: "taking-on-water", label: "Taking on water / sinking", emoji: "💧" },
  { value: "partially-submerged", label: "Partially submerged", emoji: "🌊" },
  { value: "sunk", label: "Fully sunk", emoji: "⬇️" },
  { value: "grounded", label: "Grounded or stranded", emoji: "🏔️" },
  { value: "adrift", label: "Adrift and unable to operate", emoji: "🌀" },
  { value: "capsized", label: "Capsized", emoji: "🔄" },
  { value: "fire", label: "Caught fire", emoji: "🔥" },
];

export function Step9ImmediateConcerns({ boatLabel, onContinue, onBack }: Props) {
  const [selected, setSelected] = useState<ImmediateConcern[]>([]);
  const [noneSelected, setNoneSelected] = useState(false);

  function toggle(concern: ImmediateConcern) {
    setNoneSelected(false);
    setSelected((prev) =>
      prev.includes(concern)
        ? prev.filter((c) => c !== concern)
        : [...prev, concern]
    );
  }

  function handleNone() {
    setSelected([]);
    setNoneSelected(true);
  }

  function handleContinue() {
    onContinue(selected, selected.length > 0);
  }

  const canContinue = selected.length > 0 || noneSelected;

  return (
    <QuestionCard
      question={`Do any immediate concerns apply to ${boatLabel}?`}
      helperText="Select all that apply. Urgent situations will be prioritized."
      onContinue={handleContinue}
      continueDisabled={!canContinue}
      continueLabel={selected.length > 0 ? "Flag as urgent & continue" : "Continue"}
      onBack={onBack}
    >
      {CONCERNS.map((c) => (
        <ButtonMultiSelect
          key={c.value}
          emoji={c.emoji}
          label={c.label}
          selected={selected.includes(c.value)}
          onClick={() => toggle(c.value)}
        />
      ))}
      <div className="border-t border-[#E2E8F0] my-1" />
      <ButtonMultiSelect
        emoji="✅"
        label="None of the above"
        selected={noneSelected}
        onClick={handleNone}
      />
    </QuestionCard>
  );
}
