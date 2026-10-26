"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { Tooltip } from "@/components/ui/Tooltip";
import { ChevronDown, ChevronUp, Sparkles, CheckCircle2, Lock } from "lucide-react";
import type { ScoredRotation } from "@farmscale/scoring";

export interface RotationCardProps {
  rotation: ScoredRotation;
  isTopRank?: boolean;
}

export const RotationCard: React.FC<RotationCardProps> = ({
  rotation,
  isTopRank = false,
}) => {
  const t = useTranslations("planner");
  const tCommon = useTranslations("common");
  const [whyOpen, setWhyOpen] = useState(false);

  // Crop list in order
  const crops = [
    { season: "Rabi (Winter)", crop: rotation.crops.rabi },
    { season: "Kharif-1 (Pre-monsoon)", crop: rotation.crops.kharif1 },
    { season: "Kharif-2 (Monsoon)", crop: rotation.crops.kharif2 },
  ];

  return (
    <article
      className={`rounded-md border transition-all duration-200 overflow-hidden shadow-card ${
        isTopRank
          ? "border-gold ring-1 ring-gold/40 bg-surface"
          : "border-border bg-surface hover:border-border-strong"
      }`}
    >
      {/* Top Banner for Rank #1 */}
      {isTopRank && (
        <div className="bg-gold px-4 py-1 text-forest text-xs font-bold tracking-wide flex items-center justify-between">
          <span>TOP RECOMMENDED ROTATION</span>
          <Chip state="sample" className="bg-forest/10 text-forest border-transparent">
            Sample data
          </Chip>
        </div>
      )}

      <div className="p-5 space-y-4">
        {/* Header: Rank, Title, Score */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                  isTopRank ? "bg-gold text-forest" : "bg-border text-secondary"
                }`}
              >
                #{rotation.rank}
              </span>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-primary m-0">
                {crops.map((c) => c.crop.id.replace("_", " ")).join(" – ").toUpperCase()}
              </h3>
            </div>
            {rotation.isCustomSoil && (
              <span className="text-xs text-leaf font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {t("usingYourValues")}
              </span>
            )}
          </div>

          {/* Large Score */}
          <div className="text-right flex-shrink-0">
            <div className="font-mono text-2xl sm:text-3xl font-extrabold text-primary">
              {rotation.score}
              <span className="text-sm font-sans font-normal text-secondary">/10</span>
            </div>
            <span className="text-[11px] font-medium text-secondary">Suitability</span>
          </div>
        </div>

        {/* 3-Season Timeline Bar */}
        <div className="space-y-1.5 pt-1">
          <span className="text-xs font-semibold text-secondary">Season Progression:</span>
          <div className="grid grid-cols-3 gap-2">
            {crops.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-sm bg-bg border border-border/80 text-center flex flex-col justify-between"
              >
                <span className="text-[10px] font-mono uppercase text-secondary font-bold">
                  {item.season.split(" ")[0]}
                </span>
                <span className="text-xs font-bold text-primary capitalize mt-1">
                  {item.crop.id.replace("_", " ")}
                </span>
                <span className="text-[10px] text-muted capitalize mt-0.5">
                  {item.crop.season}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Expandable "Why this rotation" Section */}
        <div className="pt-2 border-t border-border">
          <button
            type="button"
            onClick={() => setWhyOpen((prev) => !prev)}
            className="w-full flex items-center justify-between py-1 text-xs font-bold text-primary hover:text-gold transition-colors touch-target min-h-[38px]"
            aria-expanded={whyOpen}
          >
            <span>{t("whyThisRotation")}</span>
            {whyOpen ? (
              <ChevronUp className="w-4 h-4 text-secondary" />
            ) : (
              <ChevronDown className="w-4 h-4 text-secondary" />
            )}
          </button>

          {whyOpen && (
            <div className="mt-2 p-3.5 rounded bg-bg text-xs space-y-2 border border-border/80">
              <div className="font-semibold text-primary">Grounded Data Signals:</div>
              <ul className="space-y-1.5 m-0 pl-4 list-disc text-secondary">
                {rotation.signalCodes.map((code) => (
                  <li key={code} className="leading-relaxed">
                    <span className="font-mono text-[11px] text-primary block sm:inline mr-1">
                      [{code}]
                    </span>
                    <span>
                      {code.includes("water")
                        ? "Preserves groundwater table by shifting irrigation to rainfed monsoon."
                        : code.includes("legume") || code.includes("pulse")
                        ? "Restores organic nitrogen into topsoil, cutting synthetic fertilizer needs."
                        : "Stabilizes crop revenues while keeping soil structure protected."}
                    </span>
                    <span className="text-[10px] text-muted block mt-0.5">
                      Source: FAO-56 / ISRIC SoilGrids baseline (Sample)
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Disabled "Ask about this recommendation" Button */}
        <div className="pt-1 flex items-center justify-between gap-3">
          <span className="text-xs text-muted">
            Source: NASA POWER + ISRIC (Sample)
          </span>

          <Tooltip content={t("aiComingSoon")}>
            <Button
              variant="outline"
              size="sm"
              disabled
              disabledReason={t("aiComingSoon")}
              className="opacity-60 cursor-not-allowed"
            >
              <Sparkles className="w-3.5 h-3.5 text-secondary" />
              <span>{t("askAi")}</span>
              <Lock className="w-3 h-3 text-secondary" />
            </Button>
          </Tooltip>
        </div>
      </div>
    </article>
  );
};
