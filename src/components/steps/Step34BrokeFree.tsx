"use client";

import { QuestionCard } from "@/components/ui/QuestionCard";
import { ButtonSingleSelect } from "@/components/ui/ButtonSingleSelect";

interface Props {
  boatLabel: string;
  onContinue: (brokeFree: boolean) => void;
  onBack: () => void;
}

export function Step34BrokeFree({ boatLabel, onContinue, onBack }: Props) {
  return (
    <QuestionCard
      question={`Did ${boatLabel} break free during the storm?`}
      onBack={onBack}
    >
      <ButtonSingleSelect emoji="✅" label="Yes" selected={false} onClick={() => onContinue(true)} />
      <ButtonSingleSelect emoji="❌" label="No" selected={false} onClick={() => onContinue(false)} />
    </QuestionCard>
  );
}
