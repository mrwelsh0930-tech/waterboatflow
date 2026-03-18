"use client";

import { useState } from "react";
import { QuestionCard } from "@/components/ui/QuestionCard";
import { ButtonSingleSelect } from "@/components/ui/ButtonSingleSelect";
import { TextInputField } from "@/components/ui/TextInputField";

interface Props {
  onContinue: (hadName: boolean, stormName: string) => void;
  onBack: () => void;
}

export function Step31StormName({ onContinue, onBack }: Props) {
  const [hadName, setHadName] = useState<boolean | null>(null);
  const [name, setName] = useState("");

  function handleContinue() {
    if (hadName === true) {
      onContinue(true, name);
    } else {
      onContinue(false, "");
    }
  }

  const canContinue =
    hadName === false || (hadName === true && name.trim().length > 0);

  return (
    <QuestionCard
      question="Did the storm have a name?"
      onContinue={handleContinue}
      continueDisabled={!canContinue}
      onBack={onBack}
    >
      <ButtonSingleSelect
        emoji="✅"
        label="Yes"
        selected={hadName === true}
        onClick={() => setHadName(true)}
      />
      <ButtonSingleSelect
        emoji="❌"
        label="No"
        selected={hadName === false}
        onClick={() => setHadName(false)}
      />
      {hadName === true && (
        <TextInputField
          label="Storm name"
          value={name}
          onChange={setName}
          placeholder="e.g. Hurricane Ian"
        />
      )}
    </QuestionCard>
  );
}
