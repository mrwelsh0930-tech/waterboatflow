"use client";

import { useState } from "react";
import { QuestionCard } from "@/components/ui/QuestionCard";
import { ButtonSingleSelect } from "@/components/ui/ButtonSingleSelect";
import { ModalOverlay } from "@/components/ui/ModalOverlay";

interface Props {
  onWater: () => void;
  onBack: () => void;
}

type Answer = "water" | "land" | "other" | null;

export function Step4LandOrWater({ onWater, onBack }: Props) {
  const [answer, setAnswer] = useState<Answer>(null);
  const [showLandModal, setShowLandModal] = useState(false);

  function handleContinue() {
    if (answer === "water") {
      onWater();
    } else {
      setShowLandModal(true);
    }
  }

  return (
    <>
      <QuestionCard
        question="Was your watercraft on land or water at the time of the incident?"
        onContinue={handleContinue}
        continueDisabled={!answer}
        onBack={onBack}
      >
        <ButtonSingleSelect
          emoji="🌊"
          label="On water"
          description="Lake, river, ocean, or any body of water"
          selected={answer === "water"}
          onClick={() => setAnswer("water")}
        />
        <ButtonSingleSelect
          emoji="🏗️"
          label="On land"
          description="Trailered, in storage, at a launch ramp"
          selected={answer === "land"}
          onClick={() => setAnswer("land")}
        />
        <ButtonSingleSelect
          emoji="🤔"
          label="Other / Not sure"
          selected={answer === "other"}
          onClick={() => setAnswer("other")}
        />
      </QuestionCard>

      {showLandModal && (
        <ModalOverlay
          emoji="🏗️"
          title="Land incidents coming soon"
          message="This prototype currently covers water-based incidents only. Please call our claims line for land-based incidents."
          primaryLabel="Return to start"
          onPrimary={() => {
            setShowLandModal(false);
            setAnswer(null);
          }}
        />
      )}
    </>
  );
}
