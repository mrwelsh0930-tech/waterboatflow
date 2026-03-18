"use client";

import { useState } from "react";
import { QuestionCard } from "@/components/ui/QuestionCard";
import { ButtonMultiSelect } from "@/components/ui/ButtonMultiSelect";
import { TextInputField } from "@/components/ui/TextInputField";

interface Props {
  onContinue: (precautions: string[], other: string) => void;
  onBack: () => void;
}

const OPTIONS = [
  { value: "moved-to-shelter", label: "Moved to a sheltered location", emoji: "🏠" },
  { value: "secured-lines", label: "Secured additional lines", emoji: "🪢" },
  { value: "dropped-anchor", label: "Dropped anchor", emoji: "⚓" },
  { value: "reduced-speed", label: "Reduced speed", emoji: "🐢" },
  { value: "checked-forecast", label: "Checked weather forecast beforehand", emoji: "📱" },
  { value: "life-jackets", label: "Put on life jackets", emoji: "🦺" },
  { value: "none", label: "No precautions taken", emoji: "—" },
  { value: "other", label: "Other", emoji: "🤔" },
];

export function Step35Precautions({ onContinue, onBack }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [otherText, setOtherText] = useState("");

  function toggle(v: string) {
    if (v === "none") {
      setSelected(["none"]);
      return;
    }
    setSelected((prev) => {
      const withoutNone = prev.filter((x) => x !== "none");
      return withoutNone.includes(v)
        ? withoutNone.filter((x) => x !== v)
        : [...withoutNone, v];
    });
  }

  const hasOther = selected.includes("other");
  const canContinue =
    selected.length > 0 && (!hasOther || otherText.trim().length > 0);

  return (
    <QuestionCard
      question="What precautions were taken before or during the storm?"
      helperText="Select all that apply."
      onContinue={() => onContinue(selected, otherText)}
      continueDisabled={!canContinue}
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
      {hasOther && (
        <TextInputField
          value={otherText}
          onChange={setOtherText}
          placeholder="Describe precautions taken…"
          multiline
          rows={3}
        />
      )}
    </QuestionCard>
  );
}
