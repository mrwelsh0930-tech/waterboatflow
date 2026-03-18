"use client";

import { QuestionCard } from "@/components/ui/QuestionCard";
import { ButtonSingleSelect } from "@/components/ui/ButtonSingleSelect";

interface Props {
  onContinue: (filed: boolean) => void;
  onBack: () => void;
}

export function Step60CoastGuard({ onContinue, onBack }: Props) {
  return (
    <QuestionCard
      question="Was a Coast Guard or marine patrol report filed?"
      helperText="This includes any official report from law enforcement, the Coast Guard, or marine patrol."
      onBack={onBack}
    >
      <ButtonSingleSelect
        emoji="✅"
        label="Yes — report was filed"
        selected={false}
        onClick={() => onContinue(true)}
      />
      <ButtonSingleSelect
        emoji="❌"
        label="No"
        selected={false}
        onClick={() => onContinue(false)}
      />
    </QuestionCard>
  );
}
