"use client";

import { useFNOLState } from "@/hooks/useFNOLState";
import { CollisionEntity } from "@/types/fnol";
import { getProgressPercent } from "@/lib/getActiveSteps";

// Steps
import { Step91Safety } from "@/components/steps/Step91Safety";
import { Step92NamePhone } from "@/components/steps/Step92NamePhone";
import { Step93IncidentDate } from "@/components/steps/Step93IncidentDate";
import { Step94FilingFor } from "@/components/steps/Step94FilingFor";
import { Step95Progressive } from "@/components/steps/Step95Progressive";
import { Step36Owner } from "@/components/steps/Step36Owner";
import { Step1Make } from "@/components/steps/Step1Make";
import { Step2Color } from "@/components/steps/Step2Color";
import { Step3BoatType } from "@/components/steps/Step3BoatType";
import { Step4LandOrWater } from "@/components/steps/Step4LandOrWater";
import { Step5StateCity } from "@/components/steps/Step5StateCity";
import { Step6Marina } from "@/components/steps/Step6Marina";
import { Step7LocationMethod } from "@/components/steps/Step7LocationMethod";
import { Step7bInternationalWaters } from "@/components/steps/Step7bInternationalWaters";
import { Step7cLocationEntry } from "@/components/steps/Step7cLocationEntry";
import { Step8MapPin } from "@/components/steps/Step8MapPin";
import { Step9ImmediateConcerns } from "@/components/steps/Step9ImmediateConcerns";
import { Step10WhatHappened } from "@/components/steps/Step10WhatHappened";
import { Step11HelpUsUnderstand } from "@/components/steps/Step11HelpUsUnderstand";
import { Step11bWaterAssistance } from "@/components/steps/Step11bWaterAssistance";
import { Step12TellMeMore } from "@/components/steps/Step12TellMeMore";
import { Step13OperatingState } from "@/components/steps/Step13OperatingState";
import { Step20CollidedWith } from "@/components/steps/Step20CollidedWith";
import { Step20EntityFollowup } from "@/components/steps/Step20EntityFollowup";
import { Step21CollisionLocation } from "@/components/steps/Step21CollisionLocation";
import { Step22CollisionType } from "@/components/steps/Step22CollisionType";
import { Step23OvertakenQuestions } from "@/components/steps/Step23OvertakenQuestions";
import { Step24RightOfWay } from "@/components/steps/Step24RightOfWay";
import { Step25DockingQuestions } from "@/components/steps/Step25DockingQuestions";
import { Step26OtherParty } from "@/components/steps/Step26OtherParty";
import { Step30WeatherWarning } from "@/components/steps/Step30WeatherWarning";
import { Step31StormName } from "@/components/steps/Step31StormName";
import { Step32WeatherConditions } from "@/components/steps/Step32WeatherConditions";
import { Step33BoatSecured } from "@/components/steps/Step33BoatSecured";
import { Step34BrokeFree } from "@/components/steps/Step34BrokeFree";
import { Step35Precautions } from "@/components/steps/Step35Precautions";
import { Step40DamageVisible } from "@/components/steps/Step40DamageVisible";
import { Step41PropulsionDamage } from "@/components/steps/Step41PropulsionDamage";
import { Step410PropulsionParts } from "@/components/steps/Step410PropulsionParts";
import { Step42PartiesInvolved } from "@/components/steps/Step42PartiesInvolved";
import { Step44PetOnboard } from "@/components/steps/Step44PetOnboard";
import { Step50CIQ } from "@/components/steps/Step50CIQ";
import { Step60CoastGuard } from "@/components/steps/Step60CoastGuard";
import { Step61CoastGuardPhoto } from "@/components/steps/Step61CoastGuardPhoto";
import { Step62AdditionalPhotos } from "@/components/steps/Step62AdditionalPhotos";
import { Step63PhotoDescription } from "@/components/steps/Step63PhotoDescription";
import { Step70Summary } from "@/components/steps/Step70Summary";

interface Props {
  stepId: number;
}

export function FNOLFlow({ stepId }: Props) {
  const { state, setState, goForward, goBack, goToStep, restart } = useFNOLState(stepId);

  const progress = getProgressPercent(state);
  const { boatLabel, isMarina, collisionEntities } = state;

  // ── Terminal state overrides ───────────────────────────────────────────────
  if (state.incidentType === "other" && state.otherIncidentSubtype === "water-assistance") {
    return (
      <FlowShell progress={100}>
        <Step11bWaterAssistance onRestart={restart} />
      </FlowShell>
    );
  }

  if (state.locationMethod === "international-waters") {
    return (
      <FlowShell progress={100}>
        <Step7bInternationalWaters
          onRestart={restart}
          onBack={() => setState({ locationMethod: null })}
        />
      </FlowShell>
    );
  }

  // ── Entity follow-up steps (step IDs 200–399) ──────────────────────────────
  if (stepId >= 200 && stepId < 400) {
    const entityIdx = Math.floor((stepId - 200) / 10);
    const entity = collisionEntities[entityIdx];

    if (!entity) {
      goToStep(20);
      return null;
    }

    const isSaltwater = isMarina === true;

    function handleEntityFollowup(updates: Partial<CollisionEntity>) {
      const updated = collisionEntities.map((e, i) =>
        i === entityIdx ? { ...e, ...updates } : e
      );
      goForward({ collisionEntities: updated });
    }

    return (
      <FlowShell progress={progress}>
        <Step20EntityFollowup
          entity={entity}
          isSaltwater={isSaltwater}
          onContinue={handleEntityFollowup}
          onBack={goBack}
        />
      </FlowShell>
    );
  }

  // ── Regular step rendering ─────────────────────────────────────────────────
  let content: React.ReactNode;

  switch (stepId) {
    // ── Pre-flow Intake ───────────────────────────────────────────────────────
    case 91:
      content = (
        <Step91Safety onContinue={() => goForward({})} />
      );
      break;

    case 92:
      content = (
        <Step92NamePhone
          fullName={state.fullName}
          phone={state.phone}
          onContinue={(fullName, phone) => goForward({ fullName, phone })}
          onBack={goBack}
        />
      );
      break;

    case 93:
      content = (
        <Step93IncidentDate
          incidentDate={state.incidentDate}
          incidentTime={state.incidentTime}
          onContinue={(incidentDate, incidentTime) => goForward({ incidentDate, incidentTime })}
          onBack={goBack}
        />
      );
      break;

    case 94:
      content = (
        <Step94FilingFor
          onContinue={(filingFor) => goForward({ filingFor })}
          onBack={goBack}
        />
      );
      break;

    case 95:
      content = (
        <Step95Progressive
          fullName={state.fullName}
          onContinue={(isInsuredByProgressive) => goForward({ isInsuredByProgressive })}
          onBack={goBack}
        />
      );
      break;

    // ── Section 2: Land vs Water ──────────────────────────────────────────────
    // (moved before Section 1 in step ordering — case 4 handles it below)

    // ── Section 1: Watercraft Identity ──────────────────────────────────────
    case 1:
      content = (
        <Step1Make
          value={state.make}
          onContinue={(make) => {
            const boatLabel = [state.color !== "Unknown" ? state.color : "", make].filter(Boolean).join(" ") || "your boat";
            goForward({ make, boatLabel });
          }}
        />
      );
      break;

    case 2:
      content = (
        <Step2Color
          value={state.color}
          onContinue={(color) => {
            const boatLabel = [color !== "Unknown" ? color : "", state.make].filter(Boolean).join(" ") || "your boat";
            goForward({ color, boatLabel });
          }}
          onBack={goBack}
        />
      );
      break;

    case 3:
      content = (
        <Step3BoatType
          value={state.boatType}
          onContinue={(boatType) => goForward({ boatType })}
          onBack={goBack}
        />
      );
      break;

    case 36:
      content = (
        <Step36Owner
          fullName={state.fullName}
          boatLabel={boatLabel}
          onContinue={(isOwner) => goForward({ isOwner })}
          onBack={goBack}
        />
      );
      break;

    // ── Section 2: Land vs Water ─────────────────────────────────────────────
    case 4:
      content = (
        <Step4LandOrWater
          onWater={() => goForward({ isOnWater: true })}
          onBack={goBack}
        />
      );
      break;

    // ── Section 3: Location Entry ─────────────────────────────────────────────
    case 5:
      content = (
        <Step5StateCity
          onContinue={(stateProvince, city) => goForward({ stateProvince, city })}
          onBack={goBack}
        />
      );
      break;

    case 6:
      content = (
        <Step6Marina
          value={state.isMarina}
          onContinue={(isMarina) => goForward({ isMarina })}
          onBack={goBack}
        />
      );
      break;

    case 7:
      content = (
        <Step7LocationMethod
          value={state.locationMethod}
          onContinue={(locationMethod) => {
            if (locationMethod === "international-waters") {
              // Terminal — set state, terminal override will render
              setState({ locationMethod });
            } else {
              // Advance to step 75 (location entry)
              goForward({ locationMethod });
            }
          }}
          onBack={goBack}
        />
      );
      break;

    case 75:
      content = (
        <Step7cLocationEntry
          method={state.locationMethod ?? "starting-location"}
          addressValue={state.embarkationAddress}
          locationValue={state.embarkationLocation}
          stateProvince={state.stateProvince}
          city={state.city}
          onContinue={(address, location) =>
            goForward({
              embarkationAddress: address,
              embarkationLocation: location,
            })
          }
          onBack={goBack}
        />
      );
      break;

    case 8:
      content = (
        <Step8MapPin
          isMarina={isMarina ?? false}
          embarkationLocation={state.embarkationLocation}
          impactPoint={state.impactPoint}
          onConfirm={(impactPoint) => goForward({ impactPoint })}
          onBack={goBack}
        />
      );
      break;

    // ── Section 4: Immediate Concerns ────────────────────────────────────────
    case 9:
      content = (
        <Step9ImmediateConcerns
          boatLabel={boatLabel}
          onContinue={(immediateConcerns, isUrgent) =>
            goForward({ immediateConcerns, isUrgent })
          }
          onBack={goBack}
        />
      );
      break;

    // ── Section 5: Incident Type ──────────────────────────────────────────────
    case 10:
      content = (
        <Step10WhatHappened
          onContinue={(incidentType) => {
            const skipCollision = incidentType !== "collision";
            goForward({ incidentType, skipCollision });
          }}
          onBack={goBack}
        />
      );
      break;

    case 11:
      content = (
        <Step11HelpUsUnderstand
          onContinue={(otherIncidentSubtype) => {
            if (otherIncidentSubtype === "water-assistance") {
              // Terminal — set state, terminal override will render
              setState({ otherIncidentSubtype });
            } else {
              goForward({ otherIncidentSubtype });
            }
          }}
          onBack={goBack}
        />
      );
      break;

    case 12:
      content = (
        <Step12TellMeMore
          subtype={state.otherIncidentSubtype ?? "other"}
          onContinue={(otherIncidentDetail) => goForward({ otherIncidentDetail })}
          onBack={goBack}
        />
      );
      break;

    // ── Section 6: Operating State ────────────────────────────────────────────
    case 13:
      content = (
        <Step13OperatingState
          boatLabel={boatLabel}
          onContinue={(operatingState) => goForward({ operatingState })}
          onBack={goBack}
        />
      );
      break;

    // ── Section 7A: Collision GCR ─────────────────────────────────────────────
    case 20:
      content = (
        <Step20CollidedWith
          boatLabel={boatLabel}
          onContinue={(entityTypes) => {
            const entities: CollisionEntity[] = entityTypes.map((type) => ({ type }));
            goForward({ collisionEntities: entities });
          }}
          onBack={goBack}
        />
      );
      break;

    case 21:
      content = (
        <Step21CollisionLocation
          onContinue={(collisionLocation) => goForward({ collisionLocation })}
          onBack={goBack}
        />
      );
      break;

    case 22:
      content = (
        <Step22CollisionType
          onContinue={(collisionType) => goForward({ collisionType })}
          onBack={goBack}
        />
      );
      break;

    case 23:
      content = (
        <Step23OvertakenQuestions
          boatLabel={boatLabel}
          onContinue={(answers) => goForward(answers)}
          onBack={goBack}
        />
      );
      break;

    case 24:
      content = (
        <Step24RightOfWay
          onContinue={(rightOfWay) => goForward({ rightOfWay })}
          onBack={goBack}
        />
      );
      break;

    case 25:
      content = (
        <Step25DockingQuestions
          onContinue={(answers) => goForward(answers)}
          onBack={goBack}
        />
      );
      break;

    case 26:
      content = (
        <Step26OtherParty
          onContinue={(otherParty) => goForward({ otherParty })}
          onBack={goBack}
        />
      );
      break;

    // ── Section 7B: Weather ───────────────────────────────────────────────────
    case 30:
      content = (
        <Step30WeatherWarning
          onContinue={(hadWeatherWarning) => goForward({ hadWeatherWarning })}
          onBack={goBack}
        />
      );
      break;

    case 31:
      content = (
        <Step31StormName
          onContinue={(stormHadName, stormName) =>
            goForward({ stormHadName, stormName })
          }
          onBack={goBack}
        />
      );
      break;

    case 32:
      content = (
        <Step32WeatherConditions
          onContinue={(weatherConditions) => goForward({ weatherConditions })}
          onBack={goBack}
        />
      );
      break;

    case 33:
      content = (
        <Step33BoatSecured
          boatLabel={boatLabel}
          onContinue={(boatWasSecured) => goForward({ boatWasSecured })}
          onBack={goBack}
        />
      );
      break;

    case 34:
      content = (
        <Step34BrokeFree
          boatLabel={boatLabel}
          onContinue={(boatBrokeFree) => goForward({ boatBrokeFree })}
          onBack={goBack}
        />
      );
      break;

    case 35:
      content = (
        <Step35Precautions
          onContinue={(precautionsTaken, precautionsOther) =>
            goForward({ precautionsTaken, precautionsOther })
          }
          onBack={goBack}
        />
      );
      break;

    // ── Sections 8 & 9: Damage + Passengers ──────────────────────────────────
    case 40:
      content = (
        <Step40DamageVisible
          onContinue={(damageVisible) => goForward({ damageVisible })}
          onBack={goBack}
        />
      );
      break;

    case 41:
      content = (
        <Step41PropulsionDamage
          onContinue={(propulsionDamaged) => goForward({ propulsionDamaged })}
          onBack={goBack}
        />
      );
      break;

    case 410:
      content = (
        <Step410PropulsionParts
          onContinue={(propulsionParts) => goForward({ propulsionParts })}
          onBack={goBack}
        />
      );
      break;

    case 42:
      content = (
        <Step42PartiesInvolved
          onContinue={(partiesInvolved) => goForward({ partiesInvolved })}
          onBack={goBack}
        />
      );
      break;

    case 44:
      content = (
        <Step44PetOnboard
          onContinue={(petOnboard) => goForward({ petOnboard })}
          onBack={goBack}
        />
      );
      break;

    // ── Section 10: CIQ ───────────────────────────────────────────────────────
    case 50:
      content = (
        <Step50CIQ
          impactPoint={state.impactPoint}
          collisionEntities={state.collisionEntities}
          isMarina={isMarina}
          waterBodyType={state.waterBodyType}
          stateProvince={state.stateProvince}
          city={state.city}
          embarkationAddress={state.embarkationAddress}
          embarkationLocation={state.embarkationLocation}
          operatingState={state.operatingState}
          onComplete={() => goForward({ ciqComplete: true })}
          onBack={goBack}
        />
      );
      break;

    // ── Section 11: Documentation ─────────────────────────────────────────────
    case 60:
      content = (
        <Step60CoastGuard
          onContinue={(coastGuardReportFiled) => goForward({ coastGuardReportFiled })}
          onBack={goBack}
        />
      );
      break;

    case 61:
      content = (
        <Step61CoastGuardPhoto
          onContinue={() => goForward()}
          onBack={goBack}
        />
      );
      break;

    case 62:
      content = (
        <Step62AdditionalPhotos
          onContinue={(additionalPhotos, photosAtIncidentLocation) =>
            goForward({ additionalPhotos, photosAtIncidentLocation })
          }
          onBack={goBack}
        />
      );
      break;

    case 63:
      content = (
        <Step63PhotoDescription
          onContinue={(photoDescription) => goForward({ photoDescription })}
          onBack={goBack}
        />
      );
      break;

    // ── Section 12: Summary ───────────────────────────────────────────────────
    case 70:
      content = <Step70Summary state={state} onRestart={restart} />;
      break;

    default:
      content = (
        <div className="flex flex-col items-center gap-4 p-6 text-center">
          <p className="text-sm text-[#64748B]">Step not found. Returning to start…</p>
          <button
            onClick={() => goToStep(1)}
            className="px-4 py-2.5 rounded-lg bg-[#1660F4] text-white text-sm font-semibold"
          >
            Start over
          </button>
        </div>
      );
  }

  return <FlowShell progress={progress}>{content}</FlowShell>;
}

// ── Shell with progress bar ───────────────────────────────────────────────────

function FlowShell({
  progress,
  children,
}: {
  progress: number;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center pt-4 px-4 pb-8">
      {progress > 0 && progress < 100 && (
        <div className="w-full max-w-[393px] mb-4">
          <div className="h-1 bg-[#E2E8F0] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1660F4] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
