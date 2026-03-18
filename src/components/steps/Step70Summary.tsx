"use client";

import { FNOLState } from "@/types/fnol";
import { AssuredHeader } from "@/components/AssuredHeader";

interface Props {
  state: FNOLState;
  onRestart: () => void;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
      <div className="px-4 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0]">
        <h3 className="text-sm font-semibold text-[#475569] uppercase tracking-wide">{title}</h3>
      </div>
      <div className="divide-y divide-[#F1F5F9]">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="px-4 py-3 flex justify-between gap-3">
      <span className="text-sm text-[#64748B] flex-shrink-0">{label}</span>
      <span className="text-sm font-medium text-[#1E293B] text-right">{value}</span>
    </div>
  );
}

function Badge({ label, color = "blue" }: { label: string; color?: "blue" | "red" | "green" }) {
  const colors = {
    blue: "bg-blue-50 text-[#1660F4] border-blue-200",
    red: "bg-red-50 text-red-600 border-red-200",
    green: "bg-green-50 text-green-700 border-green-200",
  };
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors[color]}`}>
      {label}
    </span>
  );
}

export function Step70Summary({ state, onRestart }: Props) {
  const {
    boatLabel, make, color, boatType,
    stateProvince, city, isMarina, locationMethod,
    embarkationAddress, impactPoint,
    immediateConcerns, isUrgent,
    incidentType, otherIncidentSubtype, otherIncidentDetail,
    operatingState,
    collisionEntities, collisionLocation, collisionType,
    otherParty,
    hadWeatherWarning, stormName, weatherConditions, boatWasSecured, boatBrokeFree, precautionsTaken,
    damageVisible, propulsionDamaged, propulsionParts,
    partiesInvolved, petOnboard,
    coastGuardReportFiled, additionalPhotos, photoDescription,
    ciqComplete,
  } = state;

  const boatTypeLabel = boatType?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) ?? null;
  const incidentTypeLabel = incidentType?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) ?? null;
  const hasCollision = incidentType === "collision" || isUrgent;
  const collisionEntityLabels = collisionEntities.map((e) =>
    e.type.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  ).join(", ");

  const payload = {
    claimType: "BOAT_FNOL",
    generatedAt: new Date().toISOString(),
    watercraft: { make, color, boatType },
    location: {
      state: stateProvince, city, isMarina, method: locationMethod,
      embarkationAddress, impactLat: impactPoint?.lat, impactLng: impactPoint?.lng,
    },
    immediateFlags: { isUrgent, concerns: immediateConcerns },
    incident: {
      type: incidentType, subtype: otherIncidentSubtype, detail: otherIncidentDetail,
      operatingState,
    },
    collision: hasCollision ? {
      entities: collisionEntities, location: collisionLocation,
      type: collisionType, otherParty,
    } : null,
    weather: incidentType === "weather" ? {
      warning: hadWeatherWarning, stormName, conditions: weatherConditions,
      wasSecured: boatWasSecured, brokeFree: boatBrokeFree, precautions: precautionsTaken,
    } : null,
    damage: { visible: damageVisible, propulsionDamaged, propulsionParts },
    passengers: { partiesInvolved, petOnboard },
    documentation: { coastGuardReport: coastGuardReportFiled, additionalPhotos, photoDescription },
    ciqComplete,
  };

  return (
    <div className="w-full max-w-[393px] flex flex-col gap-4">
      <AssuredHeader showBack={false} />

      {/* Header */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-[#1E293B]">Claim Summary</h1>
            <p className="text-sm text-[#64748B] mt-0.5">Review your submitted information</p>
          </div>
          <div className="flex flex-col gap-1.5 items-end">
            {isUrgent && <Badge label="🚨 Urgent" color="red" />}
            <Badge label="Demo Only" color="blue" />
          </div>
        </div>
      </div>

      {/* Watercraft Identity */}
      <Section title="Watercraft">
        <Row label="Make" value={make || "—"} />
        <Row label="Color" value={color || "—"} />
        <Row label="Type" value={boatTypeLabel} />
      </Section>

      {/* Location */}
      <Section title="Location">
        <Row label="State / City" value={[stateProvince, city].filter(Boolean).join(", ") || "—"} />
        <Row label="Location type" value={isMarina ? "Marina" : "Open waterway"} />
        <Row label="Method" value={locationMethod?.replace(/-/g, " ")} />
        {embarkationAddress && <Row label="Starting point" value={embarkationAddress} />}
        {impactPoint && (
          <Row
            label="Impact point"
            value={`${impactPoint.lat.toFixed(5)}, ${impactPoint.lng.toFixed(5)}`}
          />
        )}
      </Section>

      {/* Immediate Concerns */}
      {immediateConcerns.length > 0 && (
        <Section title="Immediate Concerns">
          <div className="px-4 py-3 flex flex-wrap gap-1.5">
            {immediateConcerns.map((c) => (
              <Badge
                key={c}
                label={c.replace(/-/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase())}
                color="red"
              />
            ))}
          </div>
        </Section>
      )}

      {/* Incident */}
      <Section title="Incident">
        <Row label="Type" value={incidentTypeLabel} />
        {otherIncidentSubtype && (
          <Row label="Subtype" value={otherIncidentSubtype.replace(/-/g, " ")} />
        )}
        {otherIncidentDetail && <Row label="Details" value={otherIncidentDetail} />}
        {operatingState.length > 0 && (
          <Row
            label="Operating state"
            value={operatingState.map((s) => s.replace(/-/g, " ")).join(", ")}
          />
        )}
      </Section>

      {/* Collision GCR */}
      {hasCollision && collisionEntities.length > 0 && (
        <Section title="Collision Details">
          <Row label="Collided with" value={collisionEntityLabels || "—"} />
          <Row label="Location" value={collisionLocation?.replace(/-/g, " ")} />
          <Row label="Collision type" value={collisionType?.replace(/-/g, " ")} />
          {otherParty && (
            <>
              <Row label="Other party type" value={otherParty.type?.replace(/-/g, " ")} />
              <Row label="Other party color" value={otherParty.color} />
              <Row
                label="Other party operating state"
                value={otherParty.operatingState.map((s) => s.replace(/-/g, " ")).join(", ")}
              />
              <Row
                label="Insurance card"
                value={otherParty.hasInsuranceCard === true ? "Yes" : otherParty.hasInsuranceCard === false ? "No" : "—"}
              />
            </>
          )}
        </Section>
      )}

      {/* Weather */}
      {incidentType === "weather" && (
        <Section title="Weather">
          <Row
            label="Active warning"
            value={hadWeatherWarning === true ? "Yes" : hadWeatherWarning === false ? "No" : "Unknown"}
          />
          {stormName && <Row label="Storm name" value={stormName} />}
          {weatherConditions.length > 0 && (
            <Row
              label="Conditions"
              value={weatherConditions.map((c) => c.replace(/-/g, " ")).join(", ")}
            />
          )}
          <Row
            label="Boat secured"
            value={boatWasSecured === true ? "Yes" : boatWasSecured === false ? "No" : "—"}
          />
          {boatWasSecured && (
            <Row
              label="Broke free"
              value={boatBrokeFree === true ? "Yes" : boatBrokeFree === false ? "No" : "—"}
            />
          )}
          {precautionsTaken.length > 0 && (
            <Row
              label="Precautions"
              value={precautionsTaken.map((p) => p.replace(/-/g, " ")).join(", ")}
            />
          )}
        </Section>
      )}

      {/* Damage */}
      <Section title="Damage">
        <Row
          label="Visible damage"
          value={damageVisible === true ? "Yes" : damageVisible === false ? "No" : "Mechanical/electrical only"}
        />
        <Row
          label="Propulsion damage"
          value={propulsionDamaged === true ? "Yes" : propulsionDamaged === false ? "No" : "—"}
        />
        {propulsionParts.length > 0 && (
          <Row
            label="Parts affected"
            value={propulsionParts.map((p) => p.replace(/-/g, " ")).join(", ")}
          />
        )}
      </Section>

      {/* Passengers */}
      <Section title="Passengers & Pets">
        <Row label="Parties involved" value={partiesInvolved !== null ? String(partiesInvolved) : "—"} />
        <Row label="Pet onboard" value={petOnboard === true ? "Yes" : petOnboard === false ? "No" : "—"} />
      </Section>

      {/* Documentation */}
      <Section title="Documentation">
        <Row
          label="Coast Guard report"
          value={coastGuardReportFiled === true ? "Filed" : coastGuardReportFiled === false ? "Not filed" : "—"}
        />
        <Row
          label="Additional photos"
          value={additionalPhotos === true ? "Uploaded" : additionalPhotos === false ? "None" : "—"}
        />
        {photoDescription && <Row label="Photo description" value={photoDescription} />}
      </Section>

      {/* Demo Carrier Payload */}
      <div className="bg-[#1E293B] rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
          <span className="text-xs font-mono text-[#94A3B8]">Demo Only</span>
          <span className="text-xs text-[#64748B]">Carrier data payload</span>
        </div>
        <pre className="px-4 py-4 text-xs font-mono text-[#86EFAC] overflow-x-auto whitespace-pre-wrap leading-relaxed">
          {JSON.stringify(payload, null, 2)}
        </pre>
      </div>

      {/* Restart */}
      <button
        onClick={onRestart}
        className="w-full py-3.5 rounded-xl text-sm font-semibold border border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC] transition-colors mb-6"
      >
        Start a new claim
      </button>
    </div>
  );
}
