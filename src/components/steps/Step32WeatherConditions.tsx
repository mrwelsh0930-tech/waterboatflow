"use client";

import { useState } from "react";
import { WeatherCondition } from "@/types/fnol";
import { QuestionCard } from "@/components/ui/QuestionCard";
import { ButtonMultiSelect } from "@/components/ui/ButtonMultiSelect";

interface Props {
  onContinue: (conditions: WeatherCondition[]) => void;
  onBack: () => void;
}

const OPTIONS: { value: WeatherCondition; label: string; emoji: string }[] = [
  { value: "strong-winds", label: "Strong winds", emoji: "💨" },
  { value: "large-waves", label: "Large waves", emoji: "🌊" },
  { value: "low-visibility", label: "Low visibility (night, dusk, fog)", emoji: "🌫️" },
  { value: "shallow-water", label: "Shallow water", emoji: "🏖️" },
  { value: "other", label: "Other", emoji: "🌀" },
];

export function Step32WeatherConditions({ onContinue, onBack }: Props) {
  const [selected, setSelected] = useState<WeatherCondition[]>([]);

  function toggle(v: WeatherCondition) {
    setSelected((prev) => prev.includes(v) ? prev.filter((c) => c !== v) : [...prev, v]);
  }

  return (
    <QuestionCard
      question="What were the weather conditions?"
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
