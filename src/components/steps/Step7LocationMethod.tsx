"use client";

import { useState } from "react";
import { LocationMethod } from "@/types/fnol";
import { QuestionCard } from "@/components/ui/QuestionCard";
import { ButtonSingleSelect } from "@/components/ui/ButtonSingleSelect";

interface Props {
  value: LocationMethod | null;
  onContinue: (method: LocationMethod) => void;
  onBack: () => void;
}

export function Step7LocationMethod({ value, onContinue, onBack }: Props) {
  const [method, setMethod] = useState<LocationMethod | null>(value);

  return (
    <QuestionCard
      question="How would you like to identify the location of the incident?"
      onContinue={() => method && onContinue(method)}
      continueDisabled={!method}
      onBack={onBack}
    >
      <ButtonSingleSelect
        emoji="🚩"
        label="Starting location"
        description="Search marina, dock, pier, or address"
        selected={method === "starting-location"}
        onClick={() => setMethod("starting-location")}
      />
      <ButtonSingleSelect
        emoji="📍"
        label="GPS coordinates"
        description="Enter latitude and longitude"
        selected={method === "gps"}
        onClick={() => setMethod("gps")}
      />
      <ButtonSingleSelect
        emoji="🌎"
        label="International waters"
        description="Incident occurred outside US territorial waters"
        selected={method === "international-waters"}
        onClick={() => setMethod("international-waters")}
      />
    </QuestionCard>
  );
}
