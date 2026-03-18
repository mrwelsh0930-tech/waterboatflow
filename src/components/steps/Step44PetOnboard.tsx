"use client";

import { QuestionCard } from "@/components/ui/QuestionCard";
import { ButtonSingleSelect } from "@/components/ui/ButtonSingleSelect";

interface Props {
  onContinue: (petOnboard: boolean) => void;
  onBack: () => void;
}

export function Step44PetOnboard({ onContinue, onBack }: Props) {
  return (
    <QuestionCard
      question="Was there a pet onboard at the time of the incident?"
      onBack={onBack}
    >
      <ButtonSingleSelect emoji="🐶" label="Yes" selected={false} onClick={() => onContinue(true)} />
      <ButtonSingleSelect emoji="❌" label="No" selected={false} onClick={() => onContinue(false)} />
    </QuestionCard>
  );
}
