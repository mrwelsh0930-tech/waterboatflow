"use client";

import { useState } from "react";
import { OtherIncidentSubtype } from "@/types/fnol";
import { QuestionCard } from "@/components/ui/QuestionCard";
import { TextInputField } from "@/components/ui/TextInputField";

const SUBTYPE_LABELS: Record<OtherIncidentSubtype, string> = {
  "hit-and-run": "Hit and run",
  theft: "Theft",
  fire: "Fire",
  "stolen-boat": "Stolen boat",
  "parts-stolen": "Parts stolen",
  vandalized: "Vandalized",
  "something-fell-on-boat": "Something fell on the boat",
  "water-assistance": "Water assistance",
  "object-fell-from-boat": "Object fell from the boat",
  other: "this incident",
};

interface Props {
  subtype: OtherIncidentSubtype;
  onContinue: (detail: string) => void;
  onBack: () => void;
}

export function Step12TellMeMore({ subtype, onContinue, onBack }: Props) {
  const [detail, setDetail] = useState("");

  const label = SUBTYPE_LABELS[subtype] ?? "this incident";

  return (
    <QuestionCard
      question={`Tell us more about ${label}`}
      helperText="In your own words, describe what happened. Include any details that may be helpful."
      onContinue={() => onContinue(detail)}
      continueDisabled={detail.trim().length < 3}
      onBack={onBack}
    >
      <TextInputField
        multiline
        value={detail}
        onChange={setDetail}
        placeholder="Describe what happened…"
        rows={5}
      />
    </QuestionCard>
  );
}
