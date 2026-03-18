"use client";

import { QuestionCard } from "@/components/ui/QuestionCard";
import { ButtonSingleSelect } from "@/components/ui/ButtonSingleSelect";

interface Props {
  onContinue: (damaged: boolean) => void;
  onBack: () => void;
}

export function Step41PropulsionDamage({ onContinue, onBack }: Props) {
  return (
    <QuestionCard
      question="Was there propulsion damage?"
      helperText="This includes the engine, propeller, or drive system."
      onBack={onBack}
    >
      <ButtonSingleSelect emoji="✅" label="Yes" selected={false} onClick={() => onContinue(true)} />
      <ButtonSingleSelect emoji="❌" label="No" selected={false} onClick={() => onContinue(false)} />
    </QuestionCard>
  );
}
