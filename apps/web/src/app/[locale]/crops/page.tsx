"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Filter, Droplets, Sprout, DollarSign, Calendar, ArrowRight, Search } from "lucide-react";
import { SAMPLE_CROPS, type CropTrait } from "@farmscale/scoring";

export default function CropsPage() {
  const t = useTranslations("crops");
  const tCommon = useTranslations("common");

  const [seasonFilter, setSeasonFilter] = useState<string>("all");
  const [waterFilter, setWaterFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const cropList = Object.values(SAMPLE_CROPS);

  const filteredCrops = cropList.filter((crop) => {
    if (seasonFilter !== "all" && crop.season !== seasonFilter) return false;
    if (waterFilter === "low" && crop.waterNeedRating < 7) return false;
    if (waterFilter === "high" && crop.waterNeedRating >= 7) return false;
    if (searchQuery && !crop.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <span className="text-xs uppercase font-mono font-bold tracking-wider text-secondary">
            Agronomic Traits & Evidence
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-primary m-0">
            Crop Library ({filteredCrops.length})
          </h1>
          <p className="text-sm text-secondary m-0 mt-1">
            Browse verified crop profiles, seasonal water demands, and nitrogen-fixing traits for Rajshahi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Chip state="sample">Sample crop traits</Chip>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-lg bg-surface border border-border shadow-card flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <Search className="w-4 h-4 text-secondary" />
          <input
            type="text"
            placeholder="Search crop name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-primary focus:outline-none placeholder:text-muted"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-secondary mr-1">Season:</span>
          {["all", "rabi", "kharif_1", "kharif_2"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSeasonFilter(s)}
              className={`px-3 py-1.5 rounded-full capitalize transition-colors ${
                seasonFilter === s
                  ? "bg-gold text-forest font-bold shadow-xs"
                  : "bg-bg text-secondary hover:text-primary border border-border"
              }`}
            >
              {s.replace("_", "-")}
            </button>
          ))}

          <span className="font-semibold text-secondary ml-3 mr-1">Water Need:</span>
          {["all", "low", "high"].map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => setWaterFilter(w)}
              className={`px-3 py-1.5 rounded-full capitalize transition-colors ${
                waterFilter === w
                  ? "bg-water text-white font-bold shadow-xs"
                  : "bg-bg text-secondary hover:text-primary border border-border"
              }`}
            >
              {w === "low" ? "Low (Saves water)" : w === "high" ? "High Water" : "All"}
            </button>
          ))}
        </div>
      </div>

      {/* Crop Cards Grid (2-3 columns on desktop, 1 on mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCrops.map((crop) => (
          <Link
            key={crop.id}
            href={`/crops/${crop.id}`}
            className="group rounded-lg bg-surface border border-border hover:border-gold shadow-card hover:shadow-raised transition-all p-5 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-bg text-secondary">
                  {crop.season.replace("_", "-")}
                </span>
                <Chip state="sample">Sample data</Chip>
              </div>

              <h2 className="text-xl font-serif font-bold text-primary group-hover:text-gold-text transition-colors capitalize m-0">
                {crop.id.replace("_", " ")}
              </h2>

              {/* Trait Gauges */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-secondary flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-water" />
                    Water Efficiency
                  </span>
                  <span className="font-mono font-bold text-primary">{crop.waterNeedRating}/10</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full bg-water"
                    style={{ width: `${crop.waterNeedRating * 10}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-secondary flex items-center gap-1.5">
                    <Sprout className="w-3.5 h-3.5 text-leaf" />
                    Soil Regeneration
                  </span>
                  <span className="font-mono font-bold text-primary">{crop.soilBenefitRating}/10</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full bg-leaf"
                    style={{ width: `${crop.soilBenefitRating * 10}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-secondary flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-gold-text" />
                    Income Margin
                  </span>
                  <span className="font-mono font-bold text-primary">{crop.incomeRating}/10</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full bg-gold"
                    style={{ width: `${crop.incomeRating * 10}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-secondary font-medium">
              <span>View full trait profile</span>
              <ArrowRight className="w-4 h-4 text-secondary group-hover:text-primary group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
