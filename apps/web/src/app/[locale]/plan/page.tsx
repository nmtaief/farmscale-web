"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Slider } from "@/components/ui/Slider";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { RotationCard } from "@/components/planner/RotationCard";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { AiAssistantSlot } from "@/components/layout/AiAssistantSlot";
import { Droplets, DollarSign, Sprout, Sliders, Settings2, RotateCcw, AlertCircle } from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";
import { rankRotations, SAMPLE_ROTATIONS } from "@farmscale/scoring";

export default function PlannerPage() {
  const t = useTranslations("planner");
  const priorities = useAppStore((s) => s.priorities);
  const setPriority = useAppStore((s) => s.setPriority);
  const soilOverrides = useAppStore((s) => s.soilOverrides);
  const setSoilOverrides = useAppStore((s) => s.setSoilOverrides);
  const resetPriorities = useAppStore((s) => s.resetPriorities);

  const [mobileSlidersOpen, setMobileSlidersOpen] = useState(false);
  const [soilModalOpen, setSoilModalOpen] = useState(false);
  const [customSoc, setCustomSoc] = useState(
    soilOverrides?.organicCarbonPercent !== undefined
      ? String(soilOverrides.organicCarbonPercent)
      : "0.68"
  );
  const [customPh, setCustomPh] = useState(
    soilOverrides?.ph !== undefined ? String(soilOverrides.ph) : "5.8"
  );

  // Deterministic scoring calculation
  const rankedRotations = rankRotations(SAMPLE_ROTATIONS, priorities, soilOverrides);
  const allZero = priorities.water === 0 && priorities.income === 0 && priorities.soil === 0;

  const handleSaveSoil = () => {
    const soc = parseFloat(customSoc);
    const ph = parseFloat(customPh);
    setSoilOverrides({
      organicCarbonPercent: isNaN(soc) ? undefined : soc,
      ph: isNaN(ph) ? undefined : ph,
    });
    setSoilModalOpen(false);
  };

  const handleClearSoilOverrides = () => {
    setSoilOverrides(undefined);
    setCustomSoc("0.68");
    setCustomPh("5.8");
    setSoilModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <span className="text-xs uppercase font-mono font-bold tracking-wider text-secondary">
            Multi-Objective Optimization
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-primary m-0">
            {t("title")}
          </h1>
          <p className="text-sm text-secondary m-0 mt-1">
            {t("subtitle")}
          </p>
        </div>

        {/* Soil Override Control */}
        <div className="flex items-center gap-2">
          {soilOverrides && (
            <Chip state="sample">Using your soil values</Chip>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSoilModalOpen(true)}
            className="flex items-center gap-1.5"
          >
            <Settings2 className="w-4 h-4 text-leaf" />
            <span>Override Soil Values</span>
          </Button>
        </div>
      </div>

      {/* Main Grid: 4 Cols Sticky Sliders Left + 8 Cols Ranked Cards Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (4 cols): Sticky Sliders Panel */}
        <aside className="lg:col-span-4 sticky top-28 space-y-6">
          <div className="p-6 rounded-lg bg-surface border border-border shadow-card space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-gold" />
                <h2 className="text-base font-serif font-bold text-primary m-0">
                  Farmer Priorities
                </h2>
              </div>
              <button
                type="button"
                onClick={resetPriorities}
                className="text-xs text-secondary hover:text-primary flex items-center gap-1 touch-target min-h-[30px]"
                title="Reset sliders"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Slider 1: Save Water */}
            <Slider
              label={t("saveWater")}
              value={priorities.water}
              onChange={(val) => setPriority("water", val)}
              icon={<Droplets className="w-4 h-4 text-water" />}
              accentColor="water"
              description="Favors mustard & rainfed rice over high-pumping boro"
            />

            {/* Slider 2: Earn Income */}
            <Slider
              label={t("earnIncome")}
              value={priorities.income}
              onChange={(val) => setPriority("income", val)}
              icon={<DollarSign className="w-4 h-4 text-gold" />}
              accentColor="gold"
              description="Maximizes high gross market harvest value"
            />

            {/* Slider 3: Rebuild Soil */}
            <Slider
              label={t("rebuildSoil")}
              value={priorities.soil}
              onChange={(val) => setPriority("soil", val)}
              icon={<Sprout className="w-4 h-4 text-leaf" />}
              accentColor="leaf"
              description="Adds legume pulse crops that fix nitrogen"
            />

            {/* Presets */}
            <div className="pt-2 border-t border-border space-y-2">
              <span className="text-[11px] font-mono uppercase text-secondary font-bold block">
                Quick Presets
              </span>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPriority("water", 8);
                    setPriority("income", 3);
                    setPriority("soil", 4);
                  }}
                  className="text-xs"
                >
                  Water First (8/3/4)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPriority("water", 3);
                    setPriority("income", 8);
                    setPriority("soil", 4);
                  }}
                  className="text-xs"
                >
                  Income First (3/8/4)
                </Button>
              </div>
            </div>
          </div>

          {/* Reserved AI Slot */}
          <AiAssistantSlot />
        </aside>

        {/* Right Column (8 cols): Top Ranked Crop Rotations */}
        <section className="lg:col-span-8 space-y-6">
          {/* All Zeros Gentle Prompt */}
          {allZero ? (
            <div className="p-8 rounded-lg bg-surface border border-dashed border-gold text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-gold/15 text-gold-text mx-auto flex items-center justify-center">
                <Sliders className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-bold text-primary m-0">
                {t("zeroPrompt")}
              </h3>
              <p className="text-xs text-secondary max-w-sm mx-auto">
                Adjust any of the three priority sliders on the left to see rotations ranked according to your farm goals.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-serif font-bold text-primary m-0">
                  Top Ranked Recommendations ({rankedRotations.length})
                </h2>
                <span className="text-xs text-muted">
                  Deterministic algorithm: (W&times;R)/&Sigma;W
                </span>
              </div>

              {/* Ranked Rotation Cards */}
              <div className="space-y-5">
                {rankedRotations.slice(0, 3).map((rotation, idx) => (
                  <RotationCard
                    key={rotation.id}
                    rotation={rotation}
                    isTopRank={idx === 0}
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Soil Overrides Modal / Bottom Sheet */}
      <BottomSheet
        isOpen={soilModalOpen}
        onClose={() => setSoilModalOpen(false)}
        title="Custom Soil & Field Measurements"
      >
        <p className="text-xs text-secondary leading-relaxed">
          If you have local soil test results from DAE, BMDA, or your field sensor, enter them below. The scoring algorithm will adjust crop suitability scores immediately.
        </p>

        <div className="space-y-4 pt-2">
          <div>
            <label className="text-xs font-semibold text-primary block mb-1">
              Topsoil Organic Carbon (SOC %)
            </label>
            <input
              type="number"
              step="0.05"
              min="0.1"
              max="5.0"
              value={customSoc}
              onChange={(e) => setCustomSoc(e.target.value)}
              className="w-full p-2.5 rounded bg-bg border border-border text-primary font-mono text-sm focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <span className="text-[11px] text-muted block mt-1">
              Baseline default in Barind is 0.68%. Values below 0.8% increase legume recommendation value.
            </span>
          </div>

          <div>
            <label className="text-xs font-semibold text-primary block mb-1">
              Soil pH (H₂O)
            </label>
            <input
              type="number"
              step="0.1"
              min="4.0"
              max="9.0"
              value={customPh}
              onChange={(e) => setCustomPh(e.target.value)}
              className="w-full p-2.5 rounded bg-bg border border-border text-primary font-mono text-sm focus:outline-none focus:ring-2 focus:ring-gold"
            />
            <span className="text-[11px] text-muted block mt-1">
              Baseline default in Barind is 5.8 (Mildly acidic).
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Button variant="ghost" size="sm" onClick={handleClearSoilOverrides}>
            Reset to Default
          </Button>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => setSoilModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveSoil}>
              Apply Values
            </Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
