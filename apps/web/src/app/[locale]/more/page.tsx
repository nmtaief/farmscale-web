"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { AiAssistantSlot } from "@/components/layout/AiAssistantSlot";
import { Globe, Moon, Database, ShieldAlert, BookOpen, ExternalLink, Info, MapPin } from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";

export default function MorePage() {
  const location = useAppStore((s) => s.location);
  const viewMode = useAppStore((s) => s.viewMode);
  const toggleViewMode = useAppStore((s) => s.toggleViewMode);

  return (
    <div className="space-y-8 pb-16 max-w-3xl mx-auto">
      {/* Title */}
      <div className="border-b border-border pb-4 space-y-1">
        <span className="text-xs uppercase font-mono font-bold tracking-wider text-secondary">
          Preferences & Disclosures
        </span>
        <h1 className="text-2xl sm:text-4xl font-serif font-bold text-primary m-0">
          Settings & About
        </h1>
      </div>

      {/* Preferences Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-serif font-bold text-primary">
          User Preferences
        </h2>

        <div className="rounded-lg bg-surface border border-border shadow-card divide-y divide-border">
          {/* Language Selection */}
          <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-semibold text-sm text-primary block">
                Interface Language
              </span>
              <span className="text-xs text-secondary">
                Supports English, বাংলা (Bangla), and 日本語 (Japanese)
              </span>
            </div>
            <LanguageSwitcher />
          </div>

          {/* Theme Mode */}
          <div className="p-4 flex items-center justify-between gap-3">
            <div>
              <span className="font-semibold text-sm text-primary block">
                Color Theme
              </span>
              <span className="text-xs text-secondary">
                Switch between Agro-Scientific Light and Night Dark modes
              </span>
            </div>
            <ThemeToggle />
          </div>

          {/* Expert Telemetry Toggle */}
          <div className="p-4 flex items-center justify-between gap-3">
            <div>
              <span className="font-semibold text-sm text-primary block">
                Telemetry Depth
              </span>
              <span className="text-xs text-secondary">
                Simple view for farmers, Expert view for agronomists
              </span>
            </div>
            <button
              type="button"
              onClick={toggleViewMode}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                viewMode === "expert"
                  ? "bg-leaf text-white border-leaf"
                  : "bg-surface text-primary border-border"
              }`}
            >
              {viewMode === "expert" ? "Expert View Active" : "Simple View Active"}
            </button>
          </div>
        </div>
      </section>

      {/* About FarmScale & Pilot Region */}
      <section className="space-y-4">
        <h2 className="text-lg font-serif font-bold text-primary">
          About FarmScale
        </h2>

        <div className="p-6 rounded-lg bg-surface border border-border shadow-card space-y-4 text-xs sm:text-sm text-secondary leading-relaxed">
          <p className="m-0">
            <strong className="text-primary font-semibold">FarmScale</strong> is a decision-support platform designed for the <strong className="text-primary font-semibold">NASA Space Apps Challenge 2026</strong> under the challenge <em>&quot;Field Shift: Adapting Farms with NASA Data&quot;</em>.
          </p>
          <p className="m-0">
            It turns NASA Earth observations (POWER, SMAP, MODIS/VIIRS) and local ISRIC soil properties into ranked 3-season crop rotations, customized for farmer priorities across water conservation, economic income, and soil regeneration.
          </p>

          <div className="p-3.5 rounded bg-bg border border-border/80 flex items-center gap-3">
            <MapPin className="w-5 h-5 text-water flex-shrink-0" />
            <div>
              <span className="font-semibold text-primary block text-xs">Pilot Focus Region: Rajshahi, Bangladesh</span>
              <span className="text-[11px] text-muted block">Barind Tract Pleistocene terrace. Severe groundwater depletion from extensive dry-season boro rice cultivation.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Data Limits & Scientific Disclaimers */}
      <section className="space-y-4">
        <h2 className="text-lg font-serif font-bold text-primary">
          Data Disclosures & Known Limits
        </h2>

        <div className="p-5 rounded-lg bg-surface border border-border shadow-card space-y-3 text-xs text-secondary leading-relaxed">
          <ul className="space-y-2 m-0 pl-4 list-disc">
            <li>
              <strong className="text-primary">Coarse Gridded Climatology:</strong> NASA POWER data resolution is approximately 0.5° × 0.5° (~50 km). Telemetry reflects regional climatology, not micro-plot topography.
            </li>
            <li>
              <strong className="text-primary">SMAP Moisture History:</strong> NASA SMAP satellite observation series commenced in April 2015. Data prior to 2015 uses modeled reanalysis.
            </li>
            <li>
              <strong className="text-primary">Sample Crop Traits:</strong> All traits and suitability ratings are illustrative pilot figures labeled as sample data until final validation against BARI / FAO agronomic tables.
            </li>
          </ul>
        </div>
      </section>

      {/* Navigation Links */}
      <section className="p-4 rounded-lg bg-surface border border-border flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-primary font-semibold">
          <Database className="w-4 h-4 text-secondary" />
          <span>Need API access or endpoint documentation?</span>
        </div>
        <Link href="/gateway">
          <Button variant="outline" size="sm">
            <span>Data Gateway</span>
          </Button>
        </Link>
      </section>

      {/* Reserved AI Slot */}
      <section>
        <AiAssistantSlot />
      </section>
    </div>
  );
}
