"use client";

import { CollisionType } from "@/types/fnol";
import { QuestionCard } from "@/components/ui/QuestionCard";
import { ButtonSingleSelect } from "@/components/ui/ButtonSingleSelect";

interface Props {
  onContinue: (type: CollisionType) => void;
  onBack: () => void;
}

const OPTIONS: { value: CollisionType; label: string; emoji: string }[] = [
  { value: "overtaken", label: "Overtaken (hit from behind)", emoji: "⬆️" },
  { value: "boats-crossing", label: "Boats crossing", emoji: "↔️" },
  { value: "docking-undocking", label: "Docking / undocking collision", emoji: "🪝" },
  { value: "other", label: "Other", emoji: "🤔" },
];

export function Step22CollisionType({ onContinue, onBack }: Props) {
  return (
    <QuestionCard
      question="Which of the following best describes what happened?"
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
