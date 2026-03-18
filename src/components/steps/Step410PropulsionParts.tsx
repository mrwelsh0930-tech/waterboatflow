"use client";

import { useState } from "react";
import { PropulsionDamagePart } from "@/types/fnol";
import { QuestionCard } from "@/components/ui/QuestionCard";
import { ButtonMultiSelect } from "@/components/ui/ButtonMultiSelect";

interface Props {
  onContinue: (parts: PropulsionDamagePart[]) => void;
  onBack: () => void;
}

const OPTIONS: { value: PropulsionDamagePart; label: string; emoji: string }[] = [
  { value: "propeller", label: "Propeller", emoji: "🔄" },
  { value: "lower-unit", label: "Lower unit / outdrive", emoji: "⚙️" },
  { value: "engine", label: "Engine", emoji: "🔧" },
  { value: "prop-shaft", label: "Prop shaft", emoji: "🔩" },
  { value: "unknown", label: "I don't know", emoji: "🤔" },
];

export function Step410PropulsionParts({ onContinue, onBack }: Props) {
  const [selected, setSelected] = useState<PropulsionDamagePart[]>([]);

  function toggle(v: PropulsionDamagePart) {
    if (v === "unknown") {
      setSelected(["unknown"]);
      return;
    }
    setSelected((prev) => {
      const withoutUnknown = prev.filter((x) => x !== "unknown");
      return withoutUnknown.includes(v)
        ? withoutUnknown.filter((x) => x !== v)
        : [...withoutUnknown, v];
    });
  }

  return (
    <QuestionCard
      question="What propulsion components were damaged?"
      helperText="Select all that apply."
      onContinue={() => onContinue(selected)}
      continueDisabled={selected.length === 0}
      onBack={onBack}
    >
      {OPTIONS.map((o) => (
        <ButtonMultiSelect
          key={o.value}
          emoji={o.emoji}
          label={o.label}
          selected={selected.includes(o.value)}
          onClick={() => toggle(o.value)}
        />
      ))}
    </QuestionCard>
  );
}
