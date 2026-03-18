// ─── Primitives ───────────────────────────────────────────────────────────────

export interface LatLng {
  lat: number;
  lng: number;
}

// ─── Watercraft Identity ──────────────────────────────────────────────────────

export type BoatType =
  | "center-console"
  | "pontoon"
  | "pwc"
  | "jet-boat"
  | "sailboat"
  | "motor-yacht"
  | "performance-runabout"
  | "bass"
  | "ski-wake"
  | "dinghy-other";

// ─── Location ─────────────────────────────────────────────────────────────────

export type LocationMethod = "starting-location" | "gps" | "international-waters";

export type WaterBodyType = "ocean" | "lake" | "river" | "other";

// ─── Incident Type ────────────────────────────────────────────────────────────

export type IncidentType = "collision" | "engine-propulsion" | "weather" | "other";

export type OtherIncidentSubtype =
  | "hit-and-run"
  | "theft"
  | "fire"
  | "stolen-boat"
  | "parts-stolen"
  | "vandalized"
  | "something-fell-on-boat"
  | "water-assistance"
  | "object-fell-from-boat"
  | "other";

// ─── Operating State ──────────────────────────────────────────────────────────

export type OperatingState =
  | "under-power"
  | "drifting"
  | "anchored"
  | "moored"
  | "docked";

// ─── Collision Entities ───────────────────────────────────────────────────────

export type CollisionEntityType =
  | "boat"
  | "fixed-property"
  | "animal"
  | "object"
  | "swimmer";

export type PropertySubtype =
  | "dock"
  | "boat-lift"
  | "bridge-piling"
  | "buoy"
  | "pier"
  | "seawall"
  | "other";

export type AnimalSubtypeSaltwater = "dolphin" | "manatee" | "sea-turtle" | "other";
export type AnimalSubtypeFreshwater = "fish" | "duck" | "goose" | "turtle" | "other";
export type AnimalSubtype = AnimalSubtypeSaltwater | AnimalSubtypeFreshwater;

export type ObjectSubtypeSaltwater =
  | "sandbar"
  | "floating-debris"
  | "reef"
  | "submerged-object"
  | "other";
export type ObjectSubtypeFreshwater = "rock" | "log" | "stump" | "other";
export type ObjectSubtype = ObjectSubtypeSaltwater | ObjectSubtypeFreshwater;

export interface CollisionEntity {
  type: CollisionEntityType;
  // Property-specific
  propertySubtype?: PropertySubtype;
  propertySubtypeOther?: string;
  propertyOwnerName?: string;
  propertyOwnerPhone?: string;
  // Animal/object-specific
  animalSubtype?: AnimalSubtype;
  animalSubtypeOther?: string;
  objectSubtype?: ObjectSubtype;
  objectSubtypeOther?: string;
  // CIQ data (populated during the CIQ section)
  operatingState?: OperatingState[];
  speedEstimate?: number | null;
  speedUnit?: "mph" | "knots";
  speedTrend?: "accelerating" | "decelerating" | "constant" | "unknown" | null;
  preImpactPath?: LatLng[];
  postImpactPath?: LatLng[];
  approachBearing?: number | null;
  separationBearing?: number | null;
  headingChange?: number | null;
  rotation?: number; // 0-360, direction if anchored/moored
  stickerPosition?: LatLng | null; // manual placement for static entities
}

// ─── Collision GCR ────────────────────────────────────────────────────────────

export type CollisionLocation =
  | "marina"
  | "channel"
  | "boat-ramp"
  | "open-water";

export type CollisionType =
  | "overtaken"
  | "boats-crossing"
  | "docking-undocking"
  | "other";

export type OtherPartyType =
  | "motorized-watercraft"
  | "non-motorized-watercraft"
  | "person-in-water"
  | "something-else";

export interface OtherParty {
  type: OtherPartyType | null;
  operatingState: OperatingState[];
  color: string;
  hasInsuranceCard: boolean | null;
}

// ─── Weather ──────────────────────────────────────────────────────────────────

export type WeatherCondition =
  | "strong-winds"
  | "large-waves"
  | "low-visibility"
  | "shallow-water"
  | "other";

// ─── Immediate Concerns ───────────────────────────────────────────────────────

export type ImmediateConcern =
  | "fuel-spill"
  | "oil-spill"
  | "taking-on-water"
  | "partially-submerged"
  | "sunk"
  | "grounded"
  | "adrift"
  | "capsized"
  | "fire"
  | "towed";

// ─── Propulsion ───────────────────────────────────────────────────────────────

export type PropulsionDamagePart =
  | "propeller"
  | "lower-unit"
  | "engine"
  | "prop-shaft"
  | "unknown";

// ─── CIQ Derived Data ────────────────────────────────────────────────────────

export interface CIQDerived {
  approachAngle: number | null;
  collisionType: "Overtaken" | "Boat Crossing" | null;
  pdofClockApprox: number | null;
  collisionTypeOverride: string | null;
}

// ─── Full FNOL State ──────────────────────────────────────────────────────────

export interface FNOLState {
  // Navigation
  currentStepId: number;

  // Section 1: Watercraft Identity
  make: string;
  color: string;
  boatType: BoatType | null;
  boatLabel: string; // e.g. "Red Bayliner" — computed from make + color

  // Section 2: Land vs Water
  isOnWater: boolean | null;

  // Section 3: Location Entry
  stateProvince: string;
  city: string;
  isMarina: boolean | null;
  locationMethod: LocationMethod | null;
  waterBodyType: WaterBodyType | null;
  embarkationAddress: string;
  embarkationLocation: LatLng | null;
  impactPoint: LatLng | null;

  // Section 4: Immediate Concerns
  immediateConcerns: ImmediateConcern[];
  isUrgent: boolean; // true if any immediateConcerns selected

  // Section 5: Incident Type
  incidentType: IncidentType | null;
  otherIncidentSubtype: OtherIncidentSubtype | null;
  otherIncidentDetail: string; // free-form "tell me more"
  skipCollision: boolean; // true if Other (non-collision) selected

  // Section 6: Operating State
  operatingState: OperatingState[];

  // Section 7A: Collision GCR
  collisionEntities: CollisionEntity[]; // multi-select — ordered list
  collisionLocation: CollisionLocation | null;
  collisionType: CollisionType | null;
  // Overtaken-specific
  otherBoatFollowedRules: boolean | null;
  insuredFollowedRules: boolean | null;
  insuredUnderPowerAtImpact: boolean | null;
  otherUnderPowerAtImpact: boolean | null;
  // Crossing-specific
  rightOfWay: "insured" | "other" | "unknown" | null;
  // Docking-specific
  insuredDockingOrUndocking: "docking" | "undocking" | null;
  otherDockingOrUndocking: "docking" | "undocking" | null;
  // Other party
  otherParty: OtherParty | null;

  // Section 7B: Weather
  hadWeatherWarning: boolean | null;
  stormHadName: boolean | null;
  stormName: string;
  weatherConditions: WeatherCondition[];
  boatWasSecured: boolean | null;
  boatBrokeFree: boolean | null;
  precautionsTaken: string[]; // multi-select + free-form Other
  precautionsOther: string;

  // Section 8: Damage
  damageVisible: boolean | null; // null = mechanical/electrical only
  propulsionDamaged: boolean | null;
  propulsionParts: PropulsionDamagePart[];

  // Section 9: Passengers & Pets
  partiesInvolved: number | null;
  towActivities: string[]; // Tubing, Waterskiing, Wakeboarding, Wakesurfing, Other
  lifeVestWorn: boolean | null;
  petOnboard: boolean | null;

  // Section 10: CIQ
  ciqDerived: CIQDerived;
  ciqComplete: boolean;

  // Section 11: Documentation
  coastGuardReportFiled: boolean | null;
  additionalPhotos: boolean | null;
  photosAtIncidentLocation: boolean | null;
  photoDescription: string;
}

// ─── Initial State ────────────────────────────────────────────────────────────

export const INITIAL_FNOL_STATE: FNOLState = {
  currentStepId: 1,

  make: "",
  color: "",
  boatType: null,
  boatLabel: "your boat",

  isOnWater: null,

  stateProvince: "",
  city: "",
  isMarina: null,
  locationMethod: null,
  waterBodyType: null,
  embarkationAddress: "",
  embarkationLocation: null,
  impactPoint: null,

  immediateConcerns: [],
  isUrgent: false,

  incidentType: null,
  otherIncidentSubtype: null,
  otherIncidentDetail: "",
  skipCollision: false,

  operatingState: [],

  collisionEntities: [],
  collisionLocation: null,
  collisionType: null,
  otherBoatFollowedRules: null,
  insuredFollowedRules: null,
  insuredUnderPowerAtImpact: null,
  otherUnderPowerAtImpact: null,
  rightOfWay: null,
  insuredDockingOrUndocking: null,
  otherDockingOrUndocking: null,
  otherParty: null,

  hadWeatherWarning: null,
  stormHadName: null,
  stormName: "",
  weatherConditions: [],
  boatWasSecured: null,
  boatBrokeFree: null,
  precautionsTaken: [],
  precautionsOther: "",

  damageVisible: null,
  propulsionDamaged: null,
  propulsionParts: [],

  partiesInvolved: null,
  towActivities: [],
  lifeVestWorn: null,
  petOnboard: null,

  ciqDerived: {
    approachAngle: null,
    collisionType: null,
    pdofClockApprox: null,
    collisionTypeOverride: null,
  },
  ciqComplete: false,

  coastGuardReportFiled: null,
  additionalPhotos: null,
  photosAtIncidentLocation: null,
  photoDescription: "",
};
