"use client";

import { IncidentType } from "@/types/fnol";
import { QuestionCard } from "@/components/ui/QuestionCard";
import { ButtonSingleSelect } from "@/components/ui/ButtonSingleSelect";

interface Props {
  onContinue: (incidentType: IncidentType) => void;
  onBack: () => void;
}

const OPTIONS: { value: IncidentType; label: string; emoji: string }[] = [
  { value: "collision", label: "Collision", emoji: "🚤" },
  { value: "engine-propulsion", label: "Engine or propulsion issue", emoji: "🔧" },
  { value: "weather", label: "Weather incident", emoji: "🌨️" },
  { value: "other", label: "Other", emoji: "🤔" },
];

export function Step10WhatHappened({ onContinue, onBack }: Props) {
  return (
    <QuestionCard
      question="What happened?"
      helperText="Select the option that best describes the incident."
      onBack={onBack}
    >
      {OPTIONS.map((o) => (
        <ButtonSingleSelect
          key={o.value}
          emoji={o.emoji}
          label={o.label}
          selected={false}
          onClick={() => onContinue(o.value)}
        />
      ))}
    </QuestionCard>
  );
}
