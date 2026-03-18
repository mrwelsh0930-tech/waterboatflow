"use client";

import { CollisionLocation } from "@/types/fnol";
import { QuestionCard } from "@/components/ui/QuestionCard";
import { ButtonSingleSelect } from "@/components/ui/ButtonSingleSelect";

interface Props {
  onContinue: (location: CollisionLocation) => void;
  onBack: () => void;
}

const OPTIONS: { value: CollisionLocation; label: string; emoji: string }[] = [
  { value: "marina", label: "Marina", emoji: "⚓" },
  { value: "channel", label: "Channel or marked waterway", emoji: "🚧" },
  { value: "boat-ramp", label: "Boat ramp / launch area", emoji: "🏗️" },
  { value: "open-water", label: "Open water", emoji: "🌊" },
];

export function Step21CollisionLocation({ onContinue, onBack }: Props) {
  return (
    <QuestionCard
      question="Where in the water did the collision take place?"
      onBack={onBack}
    >
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
