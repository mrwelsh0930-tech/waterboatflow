"use client";

import { QuestionCard } from "@/components/ui/QuestionCard";
import { ButtonSingleSelect } from "@/components/ui/ButtonSingleSelect";

interface Props {
  onContinue: (visible: boolean | null) => void;
  onBack: () => void;
}

export function Step40DamageVisible({ onContinue, onBack }: Props) {
  return (
    <QuestionCard
      question="Can you see the damage to your boat?"
      onBack={onBack}
    >
      <ButtonSingleSelect
        emoji="✅"
        label="Yes — visible damage"
        selected={false}
        onClick={() => onContinue(true)}
      />
      <ButtonSingleSelect
        emoji="❌"
        label="No visible damage"
        selected={false}
        onClick={() => onContinue(false)}
      />
      <ButtonSingleSelect
        emoji="🔧"
        label="Mechanical or electrical only"
        selected={false}
        onClick={() => onContinue(null)}
      />
    </QuestionCard>
  );
}
