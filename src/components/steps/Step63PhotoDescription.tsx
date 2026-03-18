"use client";

import { useState } from "react";
import { QuestionCard } from "@/components/ui/QuestionCard";
import { TextInputField } from "@/components/ui/TextInputField";

interface Props {
  onContinue: (description: string) => void;
  onBack: () => void;
}

export function Step63PhotoDescription({ onContinue, onBack }: Props) {
  const [description, setDescription] = useState("");

  return (
    <QuestionCard
      question="Please describe the photos uploaded"
      helperText="Include what each photo shows and the location of the damage."
      onContinue={() => onContinue(description)}
      continueLabel={description.trim() ? "Continue" : "Skip — continue"}
      onBack={onBack}
    >
      <TextInputField
        multiline
        value={description}
        onChange={setDescription}
        placeholder="e.g. Photo 1 shows hull damage on the starboard bow. Photo 2 shows the damaged propeller."
        rows={5}
      />
    </QuestionCard>
  );
}
