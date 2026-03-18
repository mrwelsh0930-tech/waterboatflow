"use client";

import { useState } from "react";
import { QuestionCard } from "@/components/ui/QuestionCard";
import { ButtonSingleSelect } from "@/components/ui/ButtonSingleSelect";

interface Props {
  value: string;
  onContinue: (color: string) => void;
  onBack: () => void;
}

const COLORS = [
  { label: "White", emoji: "⬜" },
  { label: "Blue", emoji: "🟦" },
  { label: "Black", emoji: "⬛" },
  { label: "Red", emoji: "🟥" },
  { label: "Silver / Gray", emoji: "🩶" },
  { label: "Green", emoji: "🟩" },
  { label: "Yellow", emoji: "🟨" },
  { label: "Orange", emoji: "🟧" },
  { label: "Brown / Tan", emoji: "🟫" },
  { label: "Two-tone / Other", emoji: "🎨" },
];

export function Step2Color({ value, onContinue, onBack }: Props) {
  const [color, setColor] = useState(value);

  return (
    <QuestionCard
      question="What color best matches your watercraft?"
      onContinue={() => onContinue(color)}
      continueDisabled={!color}
      onBack={onBack}
    >
      {COLORS.map((c) => (
        <ButtonSingleSelect
          key={c.label}
          label={c.label}
          emoji={c.emoji}
          selected={color === c.label}
          onClick={() => setColor(c.label)}
        />
      ))}
    </QuestionCard>
  );
}
