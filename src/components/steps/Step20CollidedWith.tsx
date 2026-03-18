"use client";

import { useState } from "react";
import { CollisionEntityType } from "@/types/fnol";
import { QuestionCard } from "@/components/ui/QuestionCard";
import { ButtonMultiSelect } from "@/components/ui/ButtonMultiSelect";

interface Props {
  boatLabel: string;
  onContinue: (entities: CollisionEntityType[]) => void;
  onBack: () => void;
}

const OPTIONS: { value: CollisionEntityType; label: string; emoji: string }[] = [
  { value: "boat", label: "Another boat", emoji: "🚤" },
  { value: "fixed-property", label: "Fixed property", emoji: "🏠" },
  { value: "animal", label: "Animal", emoji: "🐟" },
  { value: "object", label: "Object in the water", emoji: "🪨" },
  { value: "swimmer", label: "Swimmer", emoji: "🏊" },
];

export function Step20CollidedWith({ boatLabel, onContinue, onBack }: Props) {
  const [selected, setSelected] = useState<CollisionEntityType[]>([]);

  function toggle(value: CollisionEntityType) {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  return (
    <QuestionCard
      question={`What did ${boatLabel} collide with?`}
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
