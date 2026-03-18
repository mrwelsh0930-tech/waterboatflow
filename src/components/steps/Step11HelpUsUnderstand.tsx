"use client";

import { OtherIncidentSubtype } from "@/types/fnol";
import { QuestionCard } from "@/components/ui/QuestionCard";
import { ButtonSingleSelect } from "@/components/ui/ButtonSingleSelect";

interface Props {
  onContinue: (subtype: OtherIncidentSubtype) => void;
  onBack: () => void;
}

const OPTIONS: { value: OtherIncidentSubtype; label: string; emoji: string }[] = [
  { value: "hit-and-run", label: "Hit and run", emoji: "🚤" },
  { value: "theft", label: "Theft", emoji: "🔓" },
  { value: "fire", label: "Fire", emoji: "🔥" },
  { value: "stolen-boat", label: "Stolen boat", emoji: "🚨" },
  { value: "parts-stolen", label: "Parts stolen", emoji: "🔩" },
  { value: "vandalized", label: "Vandalized", emoji: "🎨" },
  { value: "something-fell-on-boat", label: "Something fell on the boat", emoji: "📦" },
  { value: "water-assistance", label: "Water assistance", emoji: "🆘" },
  { value: "object-fell-from-boat", label: "Object fell from the boat", emoji: "⬇️" },
  { value: "other", label: "Other", emoji: "🤔" },
];

export function Step11HelpUsUnderstand({ onContinue, onBack }: Props) {
  return (
    <QuestionCard
      question="Help us understand what happened"
      helperText="Select the option that best describes the situation."
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
