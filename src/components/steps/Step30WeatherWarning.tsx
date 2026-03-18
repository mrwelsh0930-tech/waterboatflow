"use client";

import { QuestionCard } from "@/components/ui/QuestionCard";
import { ButtonSingleSelect } from "@/components/ui/ButtonSingleSelect";

interface Props {
  onContinue: (hadWarning: boolean | null) => void;
  onBack: () => void;
}

export function Step30WeatherWarning({ onContinue, onBack }: Props) {
  return (
    <QuestionCard
      question="Was there an active weather warning or watch at the time of the incident?"
      onBack={onBack}
    >
      <ButtonSingleSelect emoji="✅" label="Yes" selected={false} onClick={() => onContinue(true)} />
      <ButtonSingleSelect emoji="❌" label="No" selected={false} onClick={() => onContinue(false)} />
      <ButtonSingleSelect emoji="🤔" label="I don't know" selected={false} onClick={() => onContinue(null)} />
    </QuestionCard>
  );
}
