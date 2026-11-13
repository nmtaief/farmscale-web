import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { PriorityWeights, SoilOverrides } from "@farmscale/scoring";
import type { LandUnit } from "@/lib/agronomics/rotationData";

export interface LocationInfo {
  name: string;
  lat: number;
  lon: number;
  district: string;
  isPilot: boolean;
}

export const DEFAULT_LOCATION: LocationInfo = {
  name: "Rajshahi Sadar, Barind Tract",
  lat: 24.3745,
  lon: 88.6042,
  district: "Rajshahi",
  isPilot: true,
};

export type ViewMode = "simple" | "expert";
export type AppTheme = "light" | "dark";

interface AppState {
  location: LocationInfo;
  priorities: PriorityWeights;
  viewMode: ViewMode;
  theme: AppTheme;
  isOffline: boolean;
  soilOverrides?: SoilOverrides;
  unit: LandUnit;
  aiModalOpen: boolean;

  // Actions
  setLocation: (loc: LocationInfo) => void;
  setPriorities: (weights: PriorityWeights) => void;
  setPriority: (key: keyof PriorityWeights, value: number) => void;
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
  setIsOffline: (status: boolean) => void;
  setSoilOverrides: (overrides: SoilOverrides | undefined) => void;
  resetPriorities: () => void;
  setUnit: (unit: LandUnit) => void;
  setAiModalOpen: (open: boolean) => void;
  toggleAiModal: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      location: DEFAULT_LOCATION,
      priorities: {
        water: 8,
        income: 3,
        soil: 4,
      },
      viewMode: "simple",
      theme: "light",
      isOffline: false,
      soilOverrides: undefined,
      unit: "bigha",
      aiModalOpen: false,

      setLocation: (location) => set({ location }),
      setPriorities: (priorities) => set({ priorities }),
      setPriority: (key, value) =>
        set((state) => ({
          priorities: {
            ...state.priorities,
            [key]: Math.max(0, Math.min(10, value)),
          },
        })),
      setViewMode: (viewMode) => set({ viewMode }),
      toggleViewMode: () =>
        set((state) => ({
          viewMode: state.viewMode === "simple" ? "expert" : "simple",
        })),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),
      setIsOffline: (isOffline) => set({ isOffline }),
      setSoilOverrides: (soilOverrides) => set({ soilOverrides }),
      resetPriorities: () =>
        set({
          priorities: { water: 5, income: 5, soil: 5 },
          soilOverrides: undefined,
        }),
      setUnit: (unit) => set({ unit }),
      setAiModalOpen: (aiModalOpen) => set({ aiModalOpen }),
      toggleAiModal: () => set((state) => ({ aiModalOpen: !state.aiModalOpen })),
    }),
    {
      name: "farmscale_client_store_v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        location: state.location,
        priorities: state.priorities,
        viewMode: state.viewMode,
        theme: state.theme,
        soilOverrides: state.soilOverrides,
        unit: state.unit,
      }),
    }
  )
);
