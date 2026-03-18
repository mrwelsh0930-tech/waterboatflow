"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FNOLState, INITIAL_FNOL_STATE } from "@/types/fnol";
import { getNextStep, getPrevStep } from "@/lib/getActiveSteps";

const STORAGE_KEY = "waterboatflow_fnol_state";
const STORAGE_VERSION = "v3"; // bump when state shape changes to auto-clear stale data
const STORAGE_VERSION_KEY = "waterboatflow_fnol_version";

function loadFromStorage(): FNOLState {
  if (typeof window === "undefined") return INITIAL_FNOL_STATE;
  try {
    const version = localStorage.getItem(STORAGE_VERSION_KEY);
    if (version !== STORAGE_VERSION) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(STORAGE_VERSION_KEY, STORAGE_VERSION);
      return INITIAL_FNOL_STATE;
    }
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_FNOL_STATE;
    return { ...INITIAL_FNOL_STATE, ...JSON.parse(raw) };
  } catch {
    return INITIAL_FNOL_STATE;
  }
}

function saveToStorage(state: FNOLState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage full or unavailable — silent fail
  }
}

export function clearFNOLState(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function useFNOLState(initialStepId?: number) {
  const router = useRouter();
  const [state, setStateRaw] = useState<FNOLState>(() => {
    const loaded = loadFromStorage();
    if (initialStepId !== undefined) {
      return { ...loaded, currentStepId: initialStepId };
    }
    return loaded;
  });

  // Sync to localStorage whenever state changes
  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  const setState = useCallback((updates: Partial<FNOLState>) => {
    setStateRaw((prev) => {
      const next = { ...prev, ...updates };
      // Auto-compute boatLabel when make or color changes
      if (updates.make !== undefined || updates.color !== undefined) {
        const make = updates.make ?? prev.make;
        const color = updates.color ?? prev.color;
        if (make || color) {
          next.boatLabel = [color, make].filter(Boolean).join(" ") || "your boat";
        }
      }
      return next;
    });
  }, []);

  const goToStep = useCallback(
    (stepId: number) => {
      setStateRaw((prev) => {
        const next = { ...prev, currentStepId: stepId };
        saveToStorage(next);
        return next;
      });
      router.push(`/step/${stepId}`);
    },
    [router]
  );

  const goForward = useCallback(
    (updates?: Partial<FNOLState>) => {
      setStateRaw((prev) => {
        const merged = updates ? { ...prev, ...updates } : prev;
        const nextStepId = getNextStep(prev.currentStepId, merged);
        if (nextStepId === null) return prev;
        const next = { ...merged, currentStepId: nextStepId };
        saveToStorage(next);
        router.push(`/step/${nextStepId}`);
        return next;
      });
    },
    [router]
  );

  const goBack = useCallback(() => {
    setStateRaw((prev) => {
      const prevStepId = getPrevStep(prev.currentStepId, prev);
      if (prevStepId === null) return prev;
      const next = { ...prev, currentStepId: prevStepId };
      saveToStorage(next);
      router.push(`/step/${prevStepId}`);
      return next;
    });
  }, [router]);

  const restart = useCallback(() => {
    clearFNOLState();
    setStateRaw(INITIAL_FNOL_STATE);
    router.push("/step/91");
  }, [router]);

  return { state, setState, goForward, goBack, goToStep, restart };
}
