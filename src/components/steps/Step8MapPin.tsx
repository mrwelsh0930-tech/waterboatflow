"use client";

import { useState, useCallback } from "react";
import { LatLng } from "@/types/fnol";
import { MapView } from "@/components/MapView";
import { AssuredHeader } from "@/components/AssuredHeader";

interface Props {
  isMarina: boolean;
  embarkationLocation: LatLng | null;
  impactPoint: LatLng | null;
  onConfirm: (impactPoint: LatLng) => void;
  onBack: () => void;
}

export function Step8MapPin({
  isMarina,
  embarkationLocation,
  impactPoint: initialImpactPoint,
  onConfirm,
  onBack,
}: Props) {
  const [impactPoint, setImpactPoint] = useState<LatLng | null>(initialImpactPoint);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleMapClick = useCallback((latlng: LatLng) => {
    setImpactPoint(latlng);
  }, []);

  const handleImpactDrag = useCallback((latlng: LatLng) => {
    setImpactPoint(latlng);
  }, []);

  const defaultCenter = embarkationLocation ?? { lat: 25.7617, lng: -80.1918 };

  return (
    <div className={`flex flex-col ${isFullscreen ? "fixed inset-0 z-50 bg-white" : "w-full max-w-[393px]"}`}>
      <AssuredHeader onBack={onBack} showBack />

      {/* Instruction card */}
      {!isFullscreen && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm p-4 mb-3">
          <h2 className="text-[15px] font-semibold text-[#1E293B] mb-1">
            Mark the incident location
          </h2>
          <p className="text-sm text-[#64748B] leading-relaxed">
            To your best recollection, tap or drag the pin to the incident point.
          </p>
        </div>
      )}

      {/* Map */}
      <div className={`relative rounded-xl overflow-hidden border border-[#E2E8F0] ${isFullscreen ? "flex-1" : "h-[340px]"}`}>
        <MapView
          mode={impactPoint ? "idle" : "place-impact"}
          impactPoint={impactPoint}
          currentPath={[]}
          currentPathColor="#3B82F6"
          completedPaths={[]}
          otherEntityPosition={null}
          restPositions={[]}
          useSatellite={isMarina ?? false}
          onMapClick={handleMapClick}
          onPathUpdate={() => {}}
          onDrawEnd={() => {}}
          onImpactDrag={handleImpactDrag}
          zoomLevel={15}
          onZoomChanged={() => {}}
          centerOverride={defaultCenter}
        />

        {/* Fullscreen toggle */}
        <button
          onClick={() => setIsFullscreen((f) => !f)}
          className="absolute top-3 right-3 bg-white rounded-lg shadow px-2.5 py-1.5 text-xs font-medium text-[#475569] border border-[#E2E8F0] hover:bg-[#F1F5F9]"
        >
          {isFullscreen ? "Exit" : "⛶ Full screen"}
        </button>
      </div>

      {/* Confirm button */}
      <div className="mt-3">
        <button
          onClick={() => impactPoint && onConfirm(impactPoint)}
          disabled={!impactPoint}
          className={`
            w-full py-3.5 rounded-lg text-sm font-semibold transition-colors
            ${impactPoint
              ? "bg-[#1660F4] text-white hover:bg-[#1250D4]"
              : "bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed"
            }
          `}
        >
          {impactPoint ? "Confirm incident point" : "Tap the map to mark the incident"}
        </button>
      </div>
    </div>
  );
}
