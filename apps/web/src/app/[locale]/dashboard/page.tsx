"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";
import { DataCard } from "@/components/data/DataCard";
import { Chip } from "@/components/ui/Chip";
import { Tooltip } from "@/components/ui/Tooltip";
import { useAppStore } from "@/lib/store/useAppStore";
import { ArrowRight, MapPin, Compass, AlertCircle, Droplets, Sun, Sprout, Activity, Database } from "lucide-react";

export default function DashboardPage() {
  const location = useAppStore((s) => s.location);

  return (
    <div className="space-y-8 pb-12">
      {/* Page Title & Context Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <span className="text-xs uppercase font-mono font-bold tracking-wider text-secondary">
            Climate & Soil Telemetry
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-primary m-0">
            Field Dashboard: {location.name}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/plan">
            <Button variant="primary" size="md" className="shadow-raised">
              <span>See Rotations</span>
              <ArrowRight className="w-4 h-4 text-forest" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Layout: 8 Columns Data Cards + 4 Columns Sticky Rail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): 5 Core DataCards */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Rainfall Trend */}
          <DataCard
            title="Precipitation History"
            statement="Annual rainfall decreased 25.6% across northwest Bangladesh since 1981."
            metricValue="1,625"
            metricUnit="mm / year"
            changeNote="(vs. 2,550 mm national avg)"
            source="NASA POWER API (Daily Climatology)"
            updatedAt="2026-10-24"
            state="sample"
            tableData={[
              { label: "1985-1995 Avg", value: "2,180 mm" },
              { label: "1995-2005 Avg", value: "1,940 mm" },
              { label: "2005-2015 Avg", value: "1,750 mm" },
              { label: "2015-2025 Avg", value: "1,625 mm" },
            ]}
            expertContent={
              <div className="space-y-1">
                <p>Monsoon onset shifted later by ~12 days. Rain intensity concentrated in fewer storm events.</p>
                <div className="font-mono text-[11px] text-muted">Grid resolution: 0.5° × 0.5° (~50 km)</div>
              </div>
            }
          >
            {/* Simple SVG Bar Trend */}
            <div className="h-20 w-full flex items-end gap-3 pt-3">
              {[
                { year: "1990", h: "85%", v: "2,180" },
                { year: "2000", h: "75%", v: "1,940" },
                { year: "2010", h: "65%", v: "1,750" },
                { year: "2024", h: "52%", v: "1,625" },
              ].map((bar) => (
                <div key={bar.year} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-water rounded-t-sm transition-all duration-300"
                    style={{ height: bar.h }}
                  />
                  <span className="text-[10px] font-mono text-secondary">{bar.year}</span>
                </div>
              ))}
            </div>
          </DataCard>

          {/* Card 2: Extreme Heat Days */}
          <DataCard
            title="Temperature Extremes"
            statement="Extreme heat days above 35°C increased by 18 days per year in the Barind."
            metricValue="42"
            metricUnit="days / year > 35°C"
            changeNote="(Pre-monsoon heat stress)"
            source="NASA POWER API (MERRA-2 2m Temp)"
            updatedAt="2026-10-24"
            state="sample"
            tableData={[
              { label: "Pre-monsoon (Apr-May)", value: "26 days" },
              { label: "Monsoon (Jun-Aug)", value: "11 days" },
              { label: "Winter (Dec-Feb)", value: "0 days" },
            ]}
            expertContent={
              <p>Heat stress during flowering causes pollen sterility in dry-season crops. Early Rabi planting recommended.</p>
            }
          >
            <div className="h-16 w-full flex items-center gap-2">
              <div className="flex-1 bg-heat/15 h-3 rounded-full overflow-hidden">
                <div className="bg-heat h-full w-[65%]" />
              </div>
              <span className="text-xs font-mono text-heat font-bold">High Heat Risk</span>
            </div>
          </DataCard>

          {/* Card 3: Soil Moisture Profile */}
          <DataCard
            title="Root-Zone Moisture"
            statement="Surface moisture in Rabi winter drops below wilting point without irrigation."
            metricValue="0.18"
            metricUnit="m³ / m³ (Root zone)"
            changeNote="(SMAP L4 Volumetric)"
            source="NASA SMAP (Soil Moisture Active Passive)"
            updatedAt="2026-10-24"
            state="sample"
            tableData={[
              { label: "Surface (0-5 cm)", value: "0.12 m³/m³" },
              { label: "Root Zone (0-100 cm)", value: "0.18 m³/m³" },
              { label: "Wilting Threshold", value: "0.14 m³/m³" },
            ]}
            expertContent={
              <p>NASA SMAP telemetry available from 2015 onwards. Mustard requires ~60% less supplementary water than flooded boro paddy.</p>
            }
          >
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs text-secondary font-medium">
                <span>Current Profile</span>
                <span className="text-water font-mono font-bold">Stress Percentile: 24th</span>
              </div>
              <div className="w-full h-3 rounded-full bg-border overflow-hidden">
                <div className="bg-water h-full w-[24%]" />
              </div>
            </div>
          </DataCard>

          {/* Card 4: Vegetation Health (NDVI) */}
          <DataCard
            title="Vegetation Greenness"
            statement="NDVI anomaly indicates healthy monsoon rice canopy, but winter fallows remain bare."
            metricValue="0.64"
            metricUnit="NDVI index (0-1)"
            changeNote="(MODIS 16-day Composite)"
            source="NASA MODIS / VIIRS Terra"
            updatedAt="2026-10-24"
            state="sample"
            expertContent={
              <p>Moderate Resolution Imaging Spectroradiometer 250m resolution. Winter fallow periods expose vulnerable topsoil to wind erosion.</p>
            }
          >
            <div className="h-16 w-full flex items-center justify-between p-3 rounded bg-leaf/10 border border-leaf/20 text-xs">
              <div className="flex items-center gap-2 text-leaf font-semibold">
                <Sprout className="w-5 h-5" />
                <span>Peak Canopy Health: Kharif-2 Aman Rice</span>
              </div>
              <span className="font-mono font-bold text-leaf">+8% vs. 10-yr baseline</span>
            </div>
          </DataCard>

          {/* Card 5: Soil Properties Baseline */}
          <DataCard
            title="Soil Chemistry & Organic Matter"
            statement="Topsoil organic carbon is severely depleted at 0.68%, demanding legume nitrogen fixation."
            metricValue="0.68"
            metricUnit="% Organic Carbon"
            changeNote="(Target: > 1.5%)"
            source="ISRIC SoilGrids 250m"
            updatedAt="2026-10-24"
            state="sample"
            tableData={[
              { label: "Organic Carbon (SOC)", value: "0.68%" },
              { label: "Soil pH (H₂O)", value: "5.8 (Mildly acidic)" },
              { label: "Texture Class", value: "Sandy Loam" },
              { label: "Cation Exchange (CEC)", value: "14.2 cmol/kg" },
            ]}
            expertContent={
              <p>Barind Tract weathered Pleistocene red-brown terrace soil. Low clay content accelerates moisture loss.</p>
            }
          >
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-2.5 rounded bg-bg border border-border/80">
                <span className="text-[10px] text-secondary uppercase font-bold block">Soil pH</span>
                <span className="font-mono text-base font-bold text-primary">5.8</span>
                <span className="text-[10px] text-muted block">Slightly acidic</span>
              </div>
              <div className="p-2.5 rounded bg-bg border border-border/80">
                <span className="text-[10px] text-secondary uppercase font-bold block">Soil Texture</span>
                <span className="font-mono text-base font-bold text-primary">Sandy Loam</span>
                <span className="text-[10px] text-muted block">Rapid percolation</span>
              </div>
            </div>
          </DataCard>
        </div>

        {/* Right Rail (4 cols): Sticky Location Summary & Mini Map */}
        <aside className="lg:col-span-4 sticky top-32 space-y-6">
          {/* Location Summary Card */}
          <div className="p-5 rounded-lg bg-surface border border-border shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-water" />
                <h3 className="font-serif font-bold text-base text-primary m-0">
                  {location.name}
                </h3>
              </div>
              <Chip state="sample">Pilot</Chip>
            </div>

            {/* Mini Map Preview */}
            <div className="relative h-40 w-full rounded overflow-hidden border border-border">
              <Image
                src="/images/hero_crop_fields.jpg"
                alt="Mini location map preview"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-forest/20 flex items-center justify-center">
                <div className="px-2 py-1 rounded bg-surface/90 text-[10px] font-mono font-bold text-primary shadow-xs">
                  {location.lat}° N, {location.lon}° E
                </div>
              </div>
            </div>

            <div className="text-xs space-y-2 text-secondary">
              <div className="flex justify-between py-1 border-b border-border/60">
                <span>Agro-Ecological Zone:</span>
                <span className="font-semibold text-primary">AEZ-25 (Barind Tract)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/60">
                <span>BMDA Deep Wells:</span>
                <span className="font-semibold text-primary">~16,000 active</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Groundwater Depth:</span>
                <span className="font-semibold text-heat">Over 113 ft</span>
              </div>
            </div>

            <Link href="/plan" className="block w-full pt-2">
              <Button variant="primary" size="lg" className="w-full shadow-raised">
                <span>Go to Rotation Planner</span>
                <ArrowRight className="w-4 h-4 text-forest" />
              </Button>
            </Link>

            <Link href="/explore" className="block w-full">
              <Button variant="outline" size="sm" className="w-full">
                <span>Change Field Location</span>
              </Button>
            </Link>
          </div>

          {/* NASA Data Limits Callout */}
          <div className="p-4 rounded-lg bg-surface-hover border border-dashed border-border text-xs text-secondary space-y-2">
            <div className="font-semibold text-primary flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-secondary" />
              <span>NASA Telemetry Notice</span>
            </div>
            <p className="m-0 leading-relaxed text-[11px]">
              NASA POWER gridded data is coarse (~50 km cells). SMAP moisture series commences in 2015. All telemetry is intended for agro-climatic planning, not high-precision field survey.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
