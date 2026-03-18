"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  BoatReconstructionState,
  BoatCollisionEntityType,
  INITIAL_BOAT_DATA,
  BOAT_STEPS,
  LatLng,
  BoatData,
  OtherEntityData,
  WaterBodyType,
} from "@/types/reconstruction";
import {
  getPathEndBearing,
  calculateApproachAngle,
  classifyCollision,
  toPDOFClock,
  splitPathAtImpact,
} from "@/lib/geometry";
import { MapView, MapMode } from "./MapView";
import { StepIndicator } from "./StepIndicator";
import { AssuredHeader } from "./AssuredHeader";
import { WaterBodySelector } from "./WaterBodySelector";
import { StateCityInput } from "./StateCityInput";
import { EmbarkationInput } from "./EmbarkationInput";
import { BoatCollisionTypeSelector } from "./BoatCollisionTypeSelector";
import { SpeedInput } from "./SpeedInput";
import { AccelerationInput } from "./AccelerationInput";
import { BoatSummary } from "./BoatSummary";

const INITIAL_STATE: BoatReconstructionState = {
  currentStep: 0,
  waterBodyType: null,
  stateProvince: null,
  city: null,
  embarkationAddress: null,
  embarkationLocation: null,
  collisionEntityType: null,
  impactPoint: null,
  mapBearingAtImpact: null,
  collisionTypeOverride: null,
  isMarina: null,
  yourBoat: { ...INITIAL_BOAT_DATA, id: "you", label: "Your boat" },
  otherEntity: { ...INITIAL_BOAT_DATA, id: "other", label: "Other boat" },
  derived: {
    approachAngle: null,
    separationAngle: null,
    collisionType: null,
    pdofClockApprox: null,
  },
};

const MIN_PATH_POINTS = 2;

const YOUR_PATH_COLOR = "#3B82F6";
const OTHER_PATH_COLOR = "#F59E0B";

const CARD_SHADOW = "0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px rgba(0,0,0,0.06)";

// Entity sticker mapping for non-boat collisions
function getEntitySticker(type: BoatCollisionEntityType | null, subType: string | null): string | null {
  if (!type || type === "boat") return null;
  if (type === "swimmer") return "\uD83C\uDFCA";
  if (type === "fixed-property") {
    switch (subType) {
      case "dock": return "\u2693";
      case "buoy": return "\uD83D\uDD34";
      case "pier": return "\uD83C\uDF09";
      case "seawall": return "\uD83E\uDDF1";
      default: return "\u2693";
    }
  }
  if (type === "animal") {
    switch (subType) {
      case "manatee": return "\uD83D\uDC0B";
      case "dolphin": return "\uD83D\uDC2C";
      case "sea-turtle": return "\uD83D\uDC22";
      default: return "\uD83D\uDC1F";
    }
  }
  if (type === "object") {
    switch (subType) {
      case "debris": return "\uD83E\uDEA8";
      case "log": return "\uD83E\uDEB5";
      case "rock": return "\uD83E\uDEA8";
      default: return "\uD83E\uDEA8";
    }
  }
  return null;
}

export interface FnolContext {
  waterBodyType: WaterBodyType | null;
  stateProvince: string;
  city: string;
  embarkationAddress: string;
  embarkationLocation: LatLng | null;
  impactPoint: LatLng | null;
  isMarina: boolean | null;
  collisionEntityType: BoatCollisionEntityType | null;
  collisionEntitySubtype: string | null;
  operatingState: string[];
}

function buildStateFromContext(ctx: FnolContext): BoatReconstructionState {
  const isAnchoredMoored = ctx.operatingState.some(
    (s) => s === "anchored" || s === "moored"
  );
  const otherEntity: BoatData | OtherEntityData =
    ctx.collisionEntityType === "boat" || ctx.collisionEntityType === null
      ? { ...INITIAL_BOAT_DATA, id: "other", label: "Other boat" }
      : {
          type: ctx.collisionEntityType,
          entitySubType: ctx.collisionEntitySubtype,
          label:
            ctx.collisionEntityType === "fixed-property"
              ? "Fixed property"
              : ctx.collisionEntityType === "animal"
                ? "Animal"
                : ctx.collisionEntityType === "swimmer"
                  ? "Swimmer"
                  : "Object",
          position: null,
          description: "",
        };
  return {
    currentStep: isAnchoredMoored ? 15 : 4,
    waterBodyType: ctx.waterBodyType,
    stateProvince: ctx.stateProvince,
    city: ctx.city,
    embarkationAddress: ctx.embarkationAddress,
    embarkationLocation: ctx.embarkationLocation,
    collisionEntityType: ctx.collisionEntityType,
    impactPoint: ctx.impactPoint,
    mapBearingAtImpact: null,
    collisionTypeOverride: null,
    isMarina: ctx.isMarina,
    yourBoat: { ...INITIAL_BOAT_DATA, id: "you", label: "Your boat" },
    otherEntity,
    derived: {
      approachAngle: null,
      separationAngle: null,
      collisionType: null,
      pdofClockApprox: null,
    },
  };
}

export function BoatReconstructionFlow({ fnolContext }: { fnolContext?: FnolContext }) {
  const searchParams = useSearchParams();
  const rotationEnabled = searchParams.get("rotation") === "true";

  const isAnchoredOrMoored = fnolContext
    ? fnolContext.operatingState.some((s) => s === "anchored" || s === "moored")
    : false;
  const isDrifting = fnolContext
    ? fnolContext.operatingState.some((s) => s === "drifting")
    : false;

  const [state, setState] = useState<BoatReconstructionState>(() =>
    fnolContext ? buildStateFromContext(fnolContext) : INITIAL_STATE
  );
  const [currentPath, setCurrentPath] = useState<LatLng[]>([]);
  const [drawComplete, setDrawComplete] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [boatRotation, setBoatRotation] = useState(0);
  const rotationInitializedRef = useRef(false);
  const mapZoomRef = useRef<number>(16);

  const isBoat = state.collisionEntityType === "boat";
  const isSwimmer = state.collisionEntityType === "swimmer";
  const isStopped = state.yourBoat.movementType === "stopped";
  const isOtherStopped = isBoat && "movementType" in state.otherEntity
    ? (state.otherEntity as BoatData).movementType === "stopped"
    : false;

  // Auto-set rotation from approach bearing toward the impact point
  useEffect(() => {
    if (drawComplete && !rotationInitializedRef.current && currentPath.length >= 2 && state.impactPoint) {
      // Find the path segment approaching the impact point and use its bearing
      const { pre } = splitPathAtImpact(currentPath, state.impactPoint);
      const bearing = getPathEndBearing(pre.length >= 2 ? pre : currentPath);
      setBoatRotation(bearing ?? 0);
      rotationInitializedRef.current = true;
    }
  }, [drawComplete, currentPath, state.impactPoint]);

  // Auto-place impact pin and zoom out when entering step 8 from GPS
  useEffect(() => {
    if (
      state.currentStep === 8 &&
      !state.impactPoint &&
      state.embarkationLocation &&
      state.embarkationAddress?.startsWith("GPS:")
    ) {
      setState((prev) => ({ ...prev, impactPoint: prev.embarkationLocation }));
      mapZoomRef.current = 13;
    }
  }, [state.currentStep]);

  const entitySubType = !isBoat && !isSwimmer && state.otherEntity && "entitySubType" in state.otherEntity
    ? (state.otherEntity as OtherEntityData).entitySubType
    : null;
  const entitySticker = getEntitySticker(state.collisionEntityType, entitySubType);

  // Step filtering
  const activeSteps = BOAT_STEPS.filter((step) => {
    // Skip steps already captured by FNOL upstream
    if (fnolContext && [0, 1, 2, 3, 6, 8].includes(step.id)) return false;
    // Skip direction picker (step 15) unless anchored/moored
    if (!isAnchoredOrMoored && step.id === 15) return false;
    // Anchored/moored: skip movement/speed, acceleration, and your-path steps
    if (isAnchoredOrMoored && (step.id === 4 || step.id === 5 || step.id === 9)) return false;
    // Anchored/moored + non-boat: skip drawing instructions (nothing to draw)
    if (isAnchoredOrMoored && !isBoat && step.id === 7) return false;
    // Skip "other path" for non-boat collisions
    if (!isBoat && step.id === 10) return false;
    // Skip other boat speed/acceleration for non-boat collisions
    if (!isBoat && (step.id === 13 || step.id === 14)) return false;
    // Skip acceleration step if stopped (your boat) or drifting
    if ((isStopped || isDrifting) && step.id === 5) return false;
    // Skip other boat acceleration if other boat is stopped
    if (isOtherStopped && step.id === 14) return false;
    // Skip marina + drawing steps for swimmer (no map interaction needed)
    if (isSwimmer && (step.id === 6 || step.id === 7 || step.id === 8 || step.id === 9 || step.id === 10)) return false;
    return true;
  });

  const currentStepIndex = activeSteps.findIndex(
    (s) => s.id === state.currentStep
  );

  const goBack = () => {
    if (currentStepIndex > 0) {
      const prevStep = activeSteps[currentStepIndex - 1];
      setState((prev) => ({ ...prev, currentStep: prevStep.id }));
      setCurrentPath([]);
      setDrawComplete(false);
      setBoatRotation(0);
      rotationInitializedRef.current = false;
    }
  };

  const getMapMode = (): MapMode => {
    if (drawComplete && (state.currentStep === 9 || state.currentStep === 10)) {
      return "idle";
    }
    switch (state.currentStep) {
      case 8:
        return state.impactPoint ? "idle" : "place-impact";
      case 9:
      case 10:
        return "draw-path";
      default:
        return "idle";
    }
  };

  const getCompletedPaths = () => {
    const paths: { path: LatLng[]; color: string; rotation?: number; reverse?: boolean }[] = [];

    const yourPre = state.yourBoat.preImpactPath;
    const yourPost = state.yourBoat.postImpactPath;
    if (yourPre.length > 0 || yourPost.length > 0) {
      let fullPath: LatLng[];
      if (yourPre.length > 0 && yourPost.length > 1) {
        fullPath = [...yourPre, ...yourPost.slice(1)];
      } else if (yourPre.length > 0) {
        fullPath = yourPre;
      } else {
        fullPath = yourPost;
      }
      paths.push({ path: fullPath, color: YOUR_PATH_COLOR, rotation: state.yourBoat.rotation, reverse: state.yourBoat.movementType === "reverse" });
    }

    if (isBoat && "preImpactPath" in state.otherEntity) {
      const other = state.otherEntity as BoatData;
      const otherPre = other.preImpactPath;
      const otherPost = other.postImpactPath;
      if (otherPre.length > 0 || otherPost.length > 0) {
        let fullPath: LatLng[];
        if (otherPre.length > 0 && otherPost.length > 1) {
          fullPath = [...otherPre, ...otherPost.slice(1)];
        } else if (otherPre.length > 0) {
          fullPath = otherPre;
        } else {
          fullPath = otherPost;
        }
        const otherRotation = (state.otherEntity as BoatData).rotation;
        paths.push({ path: fullPath, color: OTHER_PATH_COLOR, rotation: otherRotation, reverse: (state.otherEntity as BoatData).movementType === "reverse" });
      }
    }

    return paths;
  };

  // Step 0: Water body type
  const handleWaterBodySelect = (type: WaterBodyType) => {
    setState((prev) => ({
      ...prev,
      waterBodyType: type,
      currentStep: 1,
    }));
  };

  // Step 1: State + City
  const handleStateCityConfirm = (stateProvince: string, city: string) => {
    setState((prev) => ({
      ...prev,
      stateProvince,
      city,
      currentStep: 2,
    }));
  };

  // Step 2: Embarkation point
  const handleEmbarkationConfirm = (address: string, location: LatLng) => {
    setState((prev) => ({
      ...prev,
      embarkationAddress: address,
      embarkationLocation: location,
      currentStep: 3,
    }));
  };

  // Step 3: Collision type
  const handleCollisionTypeSelect = (type: BoatCollisionEntityType, subType: string | null) => {
    const otherEntity: BoatData | OtherEntityData =
      type === "boat"
        ? { ...INITIAL_BOAT_DATA, id: "other", label: "Other boat" }
        : {
            type,
            entitySubType: subType,
            label:
              type === "fixed-property"
                ? "Fixed property"
                : type === "animal"
                  ? "Animal"
                  : type === "swimmer"
                    ? "Swimmer"
                    : "Object",
            position: null,
            description: "",
          };

    setState((prev) => ({
      ...prev,
      // Swimmer skips marina + map — go straight to speed
      currentStep: type === "swimmer" ? 4 : 6,
      collisionEntityType: type,
      otherEntity,
    }));
  };

  // Step 4: Speed
  const handleSpeedComplete = (data: {
    movementType: "forward" | "reverse" | "stopped";
    speedEstimate: number | null;
    speedUnit: "mph" | "knots";
  }) => {
    // Swimmer skips drawing — jump straight to summary
    // Stopped skips acceleration — but boat-to-boat still needs other boat questions
    let nextStep: number;
    if (isSwimmer) {
      nextStep = 12; // summary
    } else if (data.movementType === "stopped" || isDrifting) {
      nextStep = isBoat ? 13 : 7; // boat: other boat speed, else: drawing instruction
    } else {
      nextStep = 5; // acceleration
    }

    setState((prev) => ({
      ...prev,
      yourBoat: {
        ...prev.yourBoat,
        movementType: data.movementType,
        speedEstimate: data.speedEstimate,
        speedUnit: data.speedUnit,
      },
      currentStep: nextStep,
    }));
  };

  // Step 5: Acceleration — boat-to-boat goes to other boat speed (13), else drawing instruction (7)
  const handleAccelerationComplete = (trend: "accelerating" | "decelerating" | "constant" | "unknown") => {
    setState((prev) => ({
      ...prev,
      yourBoat: {
        ...prev.yourBoat,
        speedTrend: trend,
      },
      currentStep: prev.collisionEntityType === "swimmer" ? 12 : prev.collisionEntityType === "boat" ? 13 : 7,
    }));
  };

  // Step 13: Other boat speed
  const handleOtherSpeedComplete = (data: {
    movementType: "forward" | "reverse" | "stopped";
    speedEstimate: number | null;
    speedUnit: "mph" | "knots";
  }) => {
    setState((prev) => ({
      ...prev,
      otherEntity: {
        ...(prev.otherEntity as BoatData),
        movementType: data.movementType,
        speedEstimate: data.speedEstimate,
        speedUnit: data.speedUnit,
      },
      currentStep: data.movementType === "stopped" ? 7 : 14,
    }));
  };

  // Step 14: Other boat acceleration
  const handleOtherAccelerationComplete = (trend: "accelerating" | "decelerating" | "constant" | "unknown") => {
    setState((prev) => ({
      ...prev,
      otherEntity: {
        ...(prev.otherEntity as BoatData),
        speedTrend: trend,
      },
      currentStep: 7,
    }));
  };

  // Step 6: Marina area — now goes to collision pin (step 8)
  const handleMarinaArea = (isMarina: boolean) => {
    setState((prev) => ({
      ...prev,
      isMarina,
      currentStep: 8,
    }));
  };

  // Step 15: Direction picker (anchored/moored boats)
  const handleDirectionSelect = (bearing: number) => {
    const nextIdx = currentStepIndex + 1;
    const nextStep = activeSteps[nextIdx];
    setState((prev) => ({
      ...prev,
      yourBoat: {
        ...prev.yourBoat,
        rotation: bearing,
        approachBearing: bearing,
        movementType: "stopped",
      },
      currentStep: nextStep?.id ?? prev.currentStep,
    }));
  };

  const handleMapClick = useCallback(
    (latlng: LatLng) => {
      if (state.currentStep === 8) {
        setState((prev) => ({ ...prev, impactPoint: latlng }));
      }
    },
    [state.currentStep]
  );

  const handleImpactDrag = useCallback(
    (latlng: LatLng) => {
      setState((prev) => ({ ...prev, impactPoint: latlng }));
    },
    []
  );

  const handlePathUpdate = useCallback((path: LatLng[]) => {
    setCurrentPath(path);
  }, []);

  const handleDrawEnd = useCallback(() => {
    setDrawComplete(true);
  }, []);

  const handleRedraw = () => {
    setCurrentPath([]);
    setDrawComplete(false);
    setBoatRotation(0);
    rotationInitializedRef.current = false;
  };

  const handleAdjust = () => {
    setDrawComplete(false);
  };

  const handleCollisionTypeOverride = (type: string) => {
    setState((prev) => ({
      ...prev,
      collisionTypeOverride: type,
    }));
  };

  const computeDerived = (s: BoatReconstructionState): BoatReconstructionState => {
    const yourBearing = getPathEndBearing(s.yourBoat.preImpactPath);
    const updated = { ...s };
    updated.yourBoat = {
      ...s.yourBoat,
      approachBearing: yourBearing,
    };

    const isBoatCollision = s.collisionEntityType === "boat";
    if (isBoatCollision && "preImpactPath" in s.otherEntity) {
      const otherBoat = s.otherEntity as BoatData;
      const otherBearing = getPathEndBearing(otherBoat.preImpactPath);

      if (yourBearing !== null && otherBearing !== null) {
        const angle = calculateApproachAngle(yourBearing, otherBearing);
        updated.derived = {
          approachAngle: angle,
          separationAngle: null,
          collisionType: classifyCollision(angle),
          pdofClockApprox: toPDOFClock(angle),
        };
      }
    }

    if (s.yourBoat.postImpactPath.length >= 2) {
      const postBearing = getPathEndBearing(s.yourBoat.postImpactPath);
      updated.yourBoat.separationBearing = postBearing;
      if (yourBearing !== null && postBearing !== null) {
        updated.yourBoat.headingChange = postBearing - yourBearing;
      }
    }

    return updated;
  };

  const goToNextStep = () => {
    const currentId = state.currentStep;
    let updatedState = { ...state };

    if (currentId === 9 && currentPath.length >= 2 && state.impactPoint) {
      const { pre, post } = splitPathAtImpact(currentPath, state.impactPoint);
      updatedState.yourBoat = {
        ...updatedState.yourBoat,
        preImpactPath: pre,
        postImpactPath: post,
        rotation: boatRotation,
      };
    } else if (currentId === 10 && isBoat && currentPath.length >= 2 && state.impactPoint) {
      const { pre, post } = splitPathAtImpact(currentPath, state.impactPoint);
      updatedState.otherEntity = {
        ...(updatedState.otherEntity as BoatData),
        preImpactPath: pre,
        postImpactPath: post,
        rotation: boatRotation,
      };
    }

    updatedState = computeDerived(updatedState);

    const nextActiveStep = activeSteps[currentStepIndex + 1];
    if (nextActiveStep) {
      updatedState.currentStep = nextActiveStep.id;
    }

    setState(updatedState);
    setCurrentPath([]);
    setDrawComplete(false);
    setBoatRotation(0);
    rotationInitializedRef.current = false;
  };

  const canProceed = (): boolean => {
    switch (state.currentStep) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 13:
      case 14:
      case 15:
        return false; // These steps have their own handlers
      case 8:
        return state.impactPoint !== null;
      case 9:
      case 10:
        return currentPath.length >= MIN_PATH_POINTS;
      default:
        return false;
    }
  };

  const handleStartOver = () => {
    setState(INITIAL_STATE);
    setCurrentPath([]);
    setDrawComplete(false);
    setIsFullscreen(false);
    setBoatRotation(0);
    rotationInitializedRef.current = false;
  };

  const getCurrentPathColor = (): string => {
    if (state.currentStep === 10) return OTHER_PATH_COLOR;
    return YOUR_PATH_COLOR;
  };

  const getMapInstruction = (): string => {
    switch (state.currentStep) {
      case 8:
        return state.impactPoint
          ? "Drag the pin to adjust, or confirm below."
          : "Tap to place the collision point.";
      case 9:
        return drawComplete
          ? "Does this look like the collision path taken by your boat?"
          : "Draw the collision path your boat traveled \u2014 just your best recollection.";
      case 10:
        return drawComplete
          ? "Does this look like the collision path taken by the other boat?"
          : "Draw the collision path the other boat traveled \u2014 just your best recollection.";
      default:
        return "";
    }
  };

  const getMapSubInstruction = (): string | null => {
    switch (state.currentStep) {
      case 8:
        return state.impactPoint
          ? null
          : "Drag the map to reposition the pin. It\u2019s okay if it\u2019s not exact \u2014 just place it as close as you remember.";
      case 9:
        return drawComplete
          ? (rotationEnabled ? "Drag the blue handle to rotate your boat\u2019s orientation." : null)
          : "Make sure the path touches the collision point.";
      case 10:
        return drawComplete
          ? (rotationEnabled ? "Drag the blue handle to rotate the other boat\u2019s orientation." : null)
          : "Make sure the path touches the collision point.";
      default:
        return null;
    }
  };

  const hasYourPath = state.yourBoat.preImpactPath.length > 0;
  const hasOtherPath = isBoat && "preImpactPath" in state.otherEntity &&
    (state.otherEntity as BoatData).preImpactPath.length > 0;

  // ─── Shared layout wrappers ───
  const PageShell = ({
    children,
    showBack = true,
  }: {
    children: React.ReactNode;
    showBack?: boolean;
  }) => (
    <div className="fixed inset-0 flex flex-col bg-[#E2E8F0]">
      <AssuredHeader onBack={showBack ? goBack : undefined} showBack={showBack} />
      {children}
      <StepIndicator
        currentStep={currentStepIndex}
        totalSteps={activeSteps.length}
      />
    </div>
  );

  const Card = ({
    children,
    className = "",
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div
      className={`bg-white w-[342px] rounded-[6px] overflow-visible ${className}`}
      style={{ boxShadow: CARD_SHADOW }}
    >
      {children}
    </div>
  );

  const PrimaryButton = ({
    children,
    onClick,
    disabled = false,
    className = "",
  }: {
    children: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
    className?: string;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full h-[55px] bg-[#1660F4] rounded-[8px] text-white text-[16px] font-normal leading-[24px] active:bg-[#1250D4] transition-colors disabled:bg-[#94A3B8] disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );

  // ─── Step 0: Water body type ───
  if (state.currentStep === 0) {
    return (
      <PageShell showBack={false}>
        <div className="flex-1 flex flex-col items-center justify-center py-6 overflow-y-auto">
          <Card className="py-8 px-8 flex flex-col gap-8 items-center">
            <WaterBodySelector onSelect={handleWaterBodySelect} />
          </Card>
        </div>
      </PageShell>
    );
  }

  // ─── Step 1: State + City ───
  if (state.currentStep === 1) {
    return (
      <PageShell>
        <div className="flex-1 flex flex-col items-center justify-center py-6 overflow-y-auto">
          <Card className="py-8 px-8 flex flex-col gap-8 items-center">
            <StateCityInput onConfirm={handleStateCityConfirm} />
          </Card>
        </div>
      </PageShell>
    );
  }

  // ─── Step 2: Embarkation point (address or GPS) ───
  if (state.currentStep === 2) {
    return (
      <PageShell>
        <div className="flex-1 flex flex-col items-center justify-center py-6 overflow-y-auto">
          <Card className="py-8 px-8 flex flex-col gap-8 items-center">
            <EmbarkationInput
              onConfirm={handleEmbarkationConfirm}
              locationBias={state.stateProvince && state.city ? { state: state.stateProvince, city: state.city } : null}
            />
          </Card>
        </div>
      </PageShell>
    );
  }

  // ─── Step 3: Collision type ───
  if (state.currentStep === 3) {
    return (
      <PageShell>
        <div className="flex-1 flex flex-col items-center justify-center py-6 overflow-y-auto">
          <Card className="py-8 px-8 flex flex-col gap-8 items-center">
            <BoatCollisionTypeSelector onSelect={handleCollisionTypeSelect} waterBodyType={state.waterBodyType} />
          </Card>
        </div>
      </PageShell>
    );
  }

  // ─── Step 4: Speed/movement ───
  if (state.currentStep === 4) {
    return (
      <PageShell>
        <div className="flex-1 flex flex-col items-center justify-center py-6 overflow-y-auto">
          <Card className="py-8 px-8 flex flex-col gap-8 items-center">
            <SpeedInput
              vehicleLabel="your boat"
              onComplete={handleSpeedComplete}
            />
          </Card>
        </div>
      </PageShell>
    );
  }

  // ─── Step 5: Acceleration ───
  if (state.currentStep === 5) {
    return (
      <PageShell>
        <div className="flex-1 flex flex-col items-center justify-center py-6 overflow-y-auto">
          <Card className="py-8 px-8 flex flex-col gap-8 items-center">
            <AccelerationInput onComplete={handleAccelerationComplete} />
          </Card>
        </div>
      </PageShell>
    );
  }

  // ─── Step 13: Other boat speed ───
  if (state.currentStep === 13) {
    return (
      <PageShell>
        <div className="flex-1 flex flex-col items-center justify-center py-6 overflow-y-auto">
          <Card className="py-8 px-8 flex flex-col gap-8 items-center">
            <SpeedInput
              vehicleLabel="the other boat"
              onComplete={handleOtherSpeedComplete}
            />
          </Card>
        </div>
      </PageShell>
    );
  }

  // ─── Step 14: Other boat acceleration ───
  if (state.currentStep === 14) {
    return (
      <PageShell>
        <div className="flex-1 flex flex-col items-center justify-center py-6 overflow-y-auto">
          <Card className="py-8 px-8 flex flex-col gap-8 items-center">
            <AccelerationInput
              vehicleLabel="the other boat"
              onComplete={handleOtherAccelerationComplete}
            />
          </Card>
        </div>
      </PageShell>
    );
  }

  // ─── Step 15: Direction picker (anchored/moored) ───
  if (state.currentStep === 15) {
    const DIRECTIONS = [
      { label: "NW", arrow: "↖", bearing: 315 },
      { label: "N",  arrow: "↑", bearing: 0 },
      { label: "NE", arrow: "↗", bearing: 45 },
      { label: "W",  arrow: "←", bearing: 270 },
      { label: "",   arrow: "",  bearing: -1 }, // center (empty)
      { label: "E",  arrow: "→", bearing: 90 },
      { label: "SW", arrow: "↙", bearing: 225 },
      { label: "S",  arrow: "↓", bearing: 180 },
      { label: "SE", arrow: "↘", bearing: 135 },
    ];
    return (
      <PageShell>
        <div className="flex-1 flex flex-col items-center justify-center py-6 overflow-y-auto">
          <Card className="py-8 px-8 flex flex-col gap-6 items-center">
            <div className="flex flex-col items-center gap-2 text-center">
              <h2 className="font-medium text-[18px] leading-[28px] tracking-[-0.26px] text-[#475569]">
                Which direction was your bow facing?
              </h2>
              <p className="font-normal text-[14px] leading-[20px] tracking-[-0.09px] text-[#475569]">
                Since your boat was stationary, select the direction the front of your boat was pointing just before the incident.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 w-full max-w-[240px]">
              {DIRECTIONS.map((d, i) =>
                d.bearing === -1 ? (
                  <div key={i} className="h-[64px]" />
                ) : (
                  <button
                    key={d.label}
                    onClick={() => handleDirectionSelect(d.bearing)}
                    className="h-[64px] flex flex-col items-center justify-center gap-1 border border-[#D4D4D4] rounded-[8px] hover:border-[#1660F4] hover:bg-[#F1F5F9] active:bg-[#E2E8F0] transition-all"
                  >
                    <span className="text-[20px] leading-none">{d.arrow}</span>
                    <span className="text-[11px] font-medium text-[#475569]">{d.label}</span>
                  </button>
                )
              )}
            </div>
          </Card>
        </div>
      </PageShell>
    );
  }

  // ─── Step 6: Marina area ───
  if (state.currentStep === 6) {
    return (
      <PageShell>
        <div className="flex-1 flex flex-col items-center justify-center py-6 overflow-y-auto">
          <Card className="py-8 px-8 flex flex-col gap-8 items-center">
            <div className="flex flex-col items-center w-full">
              <h2 className="font-medium text-[18px] leading-[28px] tracking-[-0.26px] text-[#475569] text-center mb-[10px]">
                Did the collision occur in a marina or dense boating area?
              </h2>
              <p className="font-normal text-[14px] leading-[20px] tracking-[-0.09px] text-[#475569] text-center mb-8">
                This helps us show you the best map view.
              </p>
              <div className="w-full space-y-3">
                <button
                  onClick={() => handleMarinaArea(true)}
                  className="w-full flex items-center gap-4 p-4 border border-[#D4D4D4] rounded-[8px] hover:border-[#1660F4] hover:bg-[#F1F5F9] active:bg-[#E2E8F0] transition-all text-left"
                >
                  <span className="text-2xl">{"\u2693"}</span>
                  <p className="font-medium text-[14px] leading-[20px] text-[#475569]">Yes, marina or dense area</p>
                </button>
                <button
                  onClick={() => handleMarinaArea(false)}
                  className="w-full flex items-center gap-4 p-4 border border-[#D4D4D4] rounded-[8px] hover:border-[#1660F4] hover:bg-[#F1F5F9] active:bg-[#E2E8F0] transition-all text-left"
                >
                  <span className="text-2xl">{"\uD83C\uDF0A"}</span>
                  <p className="font-medium text-[14px] leading-[20px] text-[#475569]">No, open water</p>
                </button>
              </div>
            </div>
          </Card>
        </div>
      </PageShell>
    );
  }

  // ─── Step 7: Pre-draw instruction ───
  if (state.currentStep === 7) {
    return (
      <PageShell>
        <div className="flex-1 flex flex-col items-center justify-center py-6 overflow-y-auto">
          <Card className="py-8 px-6 flex flex-col gap-8 items-center">
            <div className="flex flex-col gap-4 text-center w-full">
              <p className="font-medium text-[18px] leading-[28px] tracking-[-0.26px] text-[#475569]">
                Now we&apos;ll use a simple drawing tool to show what happened.
              </p>
              <p className="font-normal text-[14px] leading-[20px] tracking-[-0.09px] text-[#475569]">
                On the next screen, you&apos;ll use your finger to draw {isBoat ? "each boat\u2019s" : "your boat\u2019s"} path, leading up to and after the collision.
              </p>
              <p className="font-normal text-[14px] leading-[20px] tracking-[-0.09px] text-[#94A3B8] mt-2">
                This is just a rough sketch — it doesn&apos;t need to be exact.
              </p>
            </div>

            {/* Illustration — boat paths */}
            <div className="bg-[#F1F5F9] rounded-[8px] p-6 flex items-center justify-center w-full">
              <svg width="200" height="100" viewBox="0 0 200 100" fill="none">
                <line x1="20" y1="50" x2="120" y2="50" stroke="#3B82F6" strokeWidth="6" strokeLinecap="round"/>
                <line x1="100" y1="20" x2="100" y2="90" stroke="#EF4444" strokeWidth="6" strokeLinecap="round"/>
                <circle cx="100" cy="50" r="8" fill="#EF4444" stroke="white" strokeWidth="3"/>
                {/* Boat shapes instead of car shapes */}
                <path d="M120,44 L116,47 L116,53 L117,56 L123,56 L124,53 L124,47 Z" fill="#3B82F6" stroke="white" strokeWidth="1.5"/>
                <path d="M94,78 L97,75 L103,75 L106,78 L103,81 L97,81 Z" fill="#EF4444" stroke="white" strokeWidth="1.5" transform="rotate(90 100 78)"/>
              </svg>
            </div>

            <PrimaryButton onClick={goToNextStep}>
              Continue
            </PrimaryButton>
          </Card>
        </div>
      </PageShell>
    );
  }

  // ─── Step 12: Summary ───
  if (state.currentStep === 12) {
    return (
      <PageShell>
        <div className="flex-1 overflow-y-auto flex flex-col items-center py-6">
          <Card className="py-8 px-6">
            <BoatSummary
              state={state}
              onStartOver={handleStartOver}
              onCollisionTypeOverride={handleCollisionTypeOverride}
            />
          </Card>
        </div>
      </PageShell>
    );
  }

  // ─── Map-based steps (8-11) ───
  const otherEntityPos =
    !isBoat && !isSwimmer && "position" in state.otherEntity
      ? (state.otherEntity as OtherEntityData).position
      : null;

  const restPositions: (LatLng | null)[] = [];

  const isDrawStep = state.currentStep === 9 || state.currentStep === 10;
  const showConfirmation = isDrawStep && drawComplete && currentPath.length >= MIN_PATH_POINTS;
  const subInstruction = getMapSubInstruction();

  const vehicleLabelPills = (bottomClass: string) =>
    (hasYourPath || (isDrawStep && state.currentStep === 10 && currentPath.length > 0) || hasOtherPath) ? (
      <div className={`absolute ${bottomClass} left-3 z-20 space-y-1.5`}>
        {(hasYourPath || (state.currentStep === 9 && currentPath.length > 0)) && (
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: YOUR_PATH_COLOR }} />
            <span className="text-xs font-medium text-[#475569]">Your boat</span>
          </div>
        )}
        {(hasOtherPath || (state.currentStep === 10 && currentPath.length > 0)) && (
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: OTHER_PATH_COLOR }} />
            <span className="text-xs font-medium text-[#475569]">Other boat</span>
          </div>
        )}
      </div>
    ) : null;

  return (
    <div className="fixed inset-0 flex flex-col bg-[#E2E8F0]">
      {!isFullscreen && <AssuredHeader onBack={goBack} />}

      <div className={`flex-1 ${isFullscreen ? "flex flex-col" : "flex flex-col items-center py-6"} min-h-0`}>
        <div
          className={isFullscreen
            ? "flex flex-col flex-1 min-h-0"
            : "bg-white w-[342px] rounded-[6px] overflow-hidden flex flex-col flex-1 min-h-0"
          }
          style={isFullscreen ? undefined : { boxShadow: CARD_SHADOW }}
        >
          {/* Instruction text */}
          {!isFullscreen && (
            <div className="px-8 py-6 text-center shrink-0">
              <p className="font-medium text-[18px] leading-[28px] tracking-[-0.26px] text-[#475569]">
                {getMapInstruction()}
              </p>
              {subInstruction && (
                <p className="font-normal text-[14px] leading-[20px] tracking-[-0.09px] text-[#475569] mt-[10px]">
                  {subInstruction}
                </p>
              )}
            </div>
          )}

          {/* Map container */}
          <div className="flex-1 relative min-h-0">
            <MapView
              mode={getMapMode()}
              impactPoint={state.impactPoint}
              currentPath={currentPath}
              currentPathColor={getCurrentPathColor()}
              completedPaths={getCompletedPaths()}
              otherEntityPosition={otherEntityPos}
              restPositions={restPositions}
              onMapClick={handleMapClick}
              onPathUpdate={handlePathUpdate}
              onDrawEnd={handleDrawEnd}
              onImpactDrag={handleImpactDrag}
              centerOverride={state.embarkationLocation}
              panToPoint={isDrawStep ? state.impactPoint : null}
              basePath={isDrawStep && !drawComplete && currentPath.length > 0 ? currentPath : []}
              useSatellite={state.isMarina === true}
              entitySticker={entitySticker}
              reverseBoat={
                state.currentStep === 9
                  ? state.yourBoat.movementType === "reverse"
                  : state.currentStep === 10 && isBoat && "movementType" in state.otherEntity
                    ? (state.otherEntity as BoatData).movementType === "reverse"
                    : false
              }
              rotationOverlay={
                rotationEnabled && showConfirmation && currentPath.length >= 2 && state.impactPoint
                  ? {
                      position: state.impactPoint,
                      rotation: boatRotation,
                      onRotate: setBoatRotation,
                    }
                  : null
              }
              zoomLevel={mapZoomRef.current}
              onZoomChanged={(z) => { mapZoomRef.current = z; }}
            />

            {/* Fullscreen: floating instruction at top */}
            {isFullscreen && (
              <div className="absolute top-3 left-3 right-14 z-20 pointer-events-none">
                <div className="bg-white/95 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg text-center">
                  <p className="font-medium text-[15px] leading-[22px] text-[#475569]">
                    {getMapInstruction()}
                  </p>
                  {subInstruction && (
                    <p className="font-normal text-[13px] leading-[18px] text-[#94A3B8] mt-1">
                      {subInstruction}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Fullscreen: collapse button */}
            {isFullscreen && (
              <button
                onClick={() => setIsFullscreen(false)}
                className="absolute top-3 right-3 z-[200] w-10 h-10 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg flex items-center justify-center active:bg-[#F1F5F9]"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M7 2v5H2M11 16v-5h5" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}

            {/* Fullscreen: floating CTA at bottom */}
            {isFullscreen && (
              <div className="absolute bottom-4 left-3 right-3 z-20">
                {showConfirmation ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-3">
                      <button
                        onClick={handleRedraw}
                        className="flex-1 h-[44px] bg-white/95 backdrop-blur-sm border border-[#D4D4D4] rounded-[8px] text-[14px] font-medium text-[#475569] shadow-lg active:bg-[#F1F5F9]"
                      >
                        Redraw
                      </button>
                      <button
                        onClick={handleAdjust}
                        className="flex-1 h-[44px] bg-white/95 backdrop-blur-sm border border-[#D4D4D4] rounded-[8px] text-[14px] font-medium text-[#475569] shadow-lg active:bg-[#F1F5F9]"
                      >
                        Adjust
                      </button>
                    </div>
                    <button
                      onClick={goToNextStep}
                      className="w-full h-[50px] bg-[#1660F4] rounded-[8px] text-[15px] font-medium text-white shadow-lg active:bg-[#1250D4]"
                    >
                      Confirm
                    </button>
                  </div>
                ) : !isDrawStep ? (
                  <button
                    onClick={goToNextStep}
                    disabled={!canProceed()}
                    className="w-full h-[50px] bg-[#1660F4] rounded-[8px] text-white text-[15px] font-medium shadow-lg active:bg-[#1250D4] disabled:bg-[#94A3B8] transition-colors"
                  >
                    {state.currentStep === 8 ? "Confirm collision point" : "Continue"}
                  </button>
                ) : null}
              </div>
            )}

            {/* Normal: expand button */}
            {!isFullscreen && (
              <button
                onClick={() => setIsFullscreen(true)}
                className="absolute top-3 right-3 z-[200] w-9 h-9 bg-white/90 backdrop-blur-sm rounded-lg shadow-md flex items-center justify-center active:bg-[#F1F5F9]"
              >
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                  <path d="M11 2h5v5M7 16H2v-5" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}

            {/* Boat label pills */}
            {vehicleLabelPills(isFullscreen ? "bottom-20" : "bottom-3")}
          </div>

          {/* CTA button inside card for non-draw, non-fullscreen map steps */}
          {!isFullscreen && !isDrawStep && (
            <div className="shrink-0 px-6 py-4">
              <PrimaryButton onClick={goToNextStep} disabled={!canProceed()}>
                {state.currentStep === 8 ? "Confirm collision point" : "Continue"}
              </PrimaryButton>
            </div>
          )}
        </div>

        {/* Redraw/Adjust/Confirm outside card for draw steps (non-fullscreen) */}
        {!isFullscreen && showConfirmation && (
          <div className="w-[342px] mt-4 flex flex-col gap-3">
            <div className="flex gap-3">
              <button
                onClick={handleRedraw}
                className="flex-1 h-[48px] bg-white border border-[#D4D4D4] rounded-[8px] text-[15px] font-normal text-[#475569] active:bg-[#F1F5F9] transition-colors"
                style={{ boxShadow: CARD_SHADOW }}
              >
                Redraw
              </button>
              <button
                onClick={handleAdjust}
                className="flex-1 h-[48px] bg-white border border-[#D4D4D4] rounded-[8px] text-[15px] font-normal text-[#475569] active:bg-[#F1F5F9] transition-colors"
                style={{ boxShadow: CARD_SHADOW }}
              >
                Adjust
              </button>
            </div>
            <button
              onClick={goToNextStep}
              className="w-full h-[55px] bg-[#1660F4] rounded-[8px] text-[16px] font-normal text-white active:bg-[#1250D4] transition-colors"
            >
              Confirm
            </button>
          </div>
        )}

        {/* Spacer for draw steps before confirmation (non-fullscreen) */}
        {!isFullscreen && isDrawStep && !showConfirmation && (
          <div className="w-[342px] mt-4 opacity-0 pointer-events-none">
            <div className="h-[55px]" />
          </div>
        )}
      </div>

      {!isFullscreen && (
        <StepIndicator
          currentStep={currentStepIndex}
          totalSteps={activeSteps.length}
        />
      )}
    </div>
  );
}
