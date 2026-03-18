"use client";

import { QuestionCard } from "@/components/ui/QuestionCard";
import { ButtonSingleSelect } from "@/components/ui/ButtonSingleSelect";

interface Props {
  onContinue: (filingFor: "myself" | "someone-else") => void;
  onBack: () => void;
}

export function Step94FilingFor({ onContinue, onBack }: Props) {
  return (
    <QuestionCard
      question="Are you filing on behalf of yourself, or someone else?"
      onBack={onBack}
    >
      <ButtonSingleSelect
        emoji="🙋"
        label="Myself"
        selected={false}
        onClick={() => onContinue("myself")}
      />
      <ButtonSingleSelect
        emoji="👉"
        label="Someone else"
        selected={false}
        onClick={() => onContinue("someone-else")}
      />
    </QuestionCard>
  );
}
