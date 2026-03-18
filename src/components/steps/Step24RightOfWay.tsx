"use client";

import { QuestionCard } from "@/components/ui/QuestionCard";
import { ButtonSingleSelect } from "@/components/ui/ButtonSingleSelect";

type RightOfWay = "insured" | "other" | "unknown";

interface Props {
  onContinue: (rightOfWay: RightOfWay) => void;
  onBack: () => void;
}

const OPTIONS: { value: RightOfWay; label: string; emoji: string }[] = [
  { value: "insured", label: "Your boat had the right of way", emoji: "✅" },
  { value: "other", label: "The other boat had the right of way", emoji: "🚤" },
  { value: "unknown", label: "I'm not sure", emoji: "🤔" },
];

export function Step24RightOfWay({ onContinue, onBack }: Props) {
  return (
    <QuestionCard question="Which boat had the right of way?" onBack={onBack}>
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
