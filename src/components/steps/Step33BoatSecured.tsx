"use client";

import { QuestionCard } from "@/components/ui/QuestionCard";
import { ButtonSingleSelect } from "@/components/ui/ButtonSingleSelect";

interface Props {
  boatLabel: string;
  onContinue: (wasSecured: boolean) => void;
  onBack: () => void;
}

export function Step33BoatSecured({ boatLabel, onContinue, onBack }: Props) {
  return (
    <QuestionCard
      question={`Was ${boatLabel} secured or tied up at the time of the incident?`}
      onBack={onBack}
    >
      <ButtonSingleSelect emoji="✅" label="Yes" selected={false} onClick={() => onContinue(true)} />
      <ButtonSingleSelect emoji="❌" label="No" selected={false} onClick={() => onContinue(false)} />
    </QuestionCard>
  );
}
