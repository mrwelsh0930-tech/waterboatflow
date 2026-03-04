export type BoatCollisionEntityType = "boat" | "fixed-property" | "animal" | "object" | "swimmer";

export type WaterBodyType = "ocean" | "lake" | "river" | "other";

export interface LatLng {
  lat: number;
  lng: number;
}

export interface BoatData {
  id: string;
  label: string;
  preImpactPath: LatLng[];
  postImpactPath: LatLng[];
  restPosition: LatLng | null;
  approachBearing: number | null;
  separationBearing: number | null;
  headingChange: number | null;
  speedEstimate: number | null;
  speedUnit: "mph" | "knots";
  movementType: "forward" | "reverse" | "stopped" | null;
  speedTrend: "accelerating" | "decelerating" | "constant" | "unknown" | null;
  rotation: number; // 0-360 degrees, orientation of boat at impact
}

export interface OtherEntityData {
  type: BoatCollisionEntityType;
  entitySubType: string | null;
  label: string;
  position: LatLng | null;
  description: string;
}

export interface DerivedData {
  approachAngle: number | null;
  separationAngle: number | null;
  collisionType: string | null;
  pdofClockApprox: number | null;
}

export interface BoatReconstructionState {
  currentStep: number;
  waterBodyType: WaterBodyType | null;
  stateProvince: string | null;
  city: string | null;
  embarkationAddress: string | null;
  embarkationLocation: LatLng | null;
  collisionEntityType: BoatCollisionEntityType | null;
  impactPoint: LatLng | null;
  mapBearingAtImpact: number | null;
  collisionTypeOverride: string | null;
  isMarina: boolean | null;
  yourBoat: BoatData;
  otherEntity: BoatData | OtherEntityData;
  derived: DerivedData;
}

export const INITIAL_BOAT_DATA: BoatData = {
  id: "",
  label: "",
  preImpactPath: [],
  postImpactPath: [],
  restPosition: null,
  approachBearing: null,
  separationBearing: null,
  headingChange: null,
  speedEstimate: null,
  speedUnit: "mph",
  movementType: null,
  speedTrend: null,
  rotation: 0,
};

export const BOAT_STEPS = [
  { id: 0, title: "Body of water", description: "What type of water?" },
  { id: 1, title: "Location", description: "State and city" },
  { id: 2, title: "Embarkation point", description: "Where did you depart from?" },
  { id: 3, title: "What happened?", description: "What did your boat collide with?" },
  { id: 6, title: "Marina area", description: "Was this in a marina?" },
  { id: 8, title: "Collision point", description: "Confirm the collision point" },
  { id: 4, title: "Before the collision", description: "How was your boat moving?" },
  { id: 5, title: "Speed change", description: "Were you speeding up or slowing down?" },
  { id: 13, title: "Other boat movement", description: "How was the other boat moving?" },
  { id: 14, title: "Other boat speed change", description: "Was the other boat speeding up or slowing down?" },
  { id: 7, title: "Drawing tool", description: "How this works" },
  { id: 9, title: "Your path", description: "Draw your boat's path" },
  { id: 10, title: "Other path", description: "Draw the other boat's path" },
  { id: 12, title: "Summary", description: "Review your reconstruction" },
];

export const BOAT_COLLISION_TYPE_OPTIONS = [
  "Overtaken",
  "Boat Crossing",
  "Anchored/Moored Boat Struck",
  "Docking/Undocking Collision",
];
