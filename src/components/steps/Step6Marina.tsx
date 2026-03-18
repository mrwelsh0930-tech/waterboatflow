"use client";

import { QuestionCard } from "@/components/ui/QuestionCard";
import { ButtonSingleSelect } from "@/components/ui/ButtonSingleSelect";

interface Props {
  value: boolean | null;
  onContinue: (isMarina: boolean) => void;
  onBack: () => void;
}

export function Step6Marina({ onContinue, onBack }: Props) {
  return (
    <QuestionCard
      question="Did the incident occur in a marina or busy waterway?"
      helperText="This helps us show the right map view for your location."
      onBack={onBack}
    >
      <ButtonSingleSelect
        emoji="⚓"
        label="Yes, marina or busy waterway"
        description="Marina, harbor, channel, or high-traffic area"
        selected={false}
        onClick={() => onContinue(true)}
      />
      <ButtonSingleSelect
        emoji="🌊"
        label="No, open water"
        description="Lake, ocean, river, or low-traffic area"
        selected={false}
        onClick={() => onContinue(false)}
      />
    </QuestionCard>
  );
}
