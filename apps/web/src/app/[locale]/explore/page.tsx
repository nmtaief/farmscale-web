"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Search, MapPin, Layers, ArrowRight, Compass, ShieldAlert, Check } from "lucide-react";
import { useAppStore, DEFAULT_LOCATION, type LocationInfo } from "@/lib/store/useAppStore";

export default function ExplorePage() {
  const t = useTranslations("common");
  const storeLocation = useAppStore((s) => s.location);
  const setStoreLocation = useAppStore((s) => s.setLocation);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPin, setSelectedPin] = useState<LocationInfo>(storeLocation);
  const [activeLayer, setActiveLayer] = useState<"precipitation" | "moisture" | "satellite">("satellite");

  const locations: LocationInfo[] = [
    {
      name: "Rajshahi Sadar, Barind",
      lat: 24.3745,
      lon: 88.6042,
      district: "Rajshahi",
      isPilot: true,
    },
    {
      name: "Godagari Upazila",
      lat: 24.4667,
      lon: 88.3333,
      district: "Rajshahi",
      isPilot: true,
    },
    {
      name: "Tanore Upazila",
      lat: 24.5833,
      lon: 88.575,
      district: "Rajshahi",
      isPilot: true,
    },
    {
      name: "Paba Upazila",
      lat: 24.4333,
      lon: 88.625,
      district: "Rajshahi",
      isPilot: true,
    },
    {
      name: "Naogaon Sadar",
      lat: 24.8167,
      lon: 88.9333,
      district: "Naogaon",
      isPilot: false,
    },
    {
      name: "Natore Sadar",
      lat: 24.4167,
      lon: 88.9833,
      district: "Natore",
      isPilot: false,
    },
  ];

  const filteredLocations = locations.filter((loc) =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectLocation = (loc: LocationInfo) => {
    setSelectedPin(loc);
    setStoreLocation(loc);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-primary m-0">
            Location Explorer
          </h1>
          <p className="text-sm text-secondary m-0">
            Select a field or grid coordinate across the Barind Tract to inspect climate and soil signals.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Chip state="sample">Sample grid data</Chip>
        </div>
      </div>

      {/* Main Explorer Workspace: Map on Left / Side Panel on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[550px]">
        {/* Interactive Map Area (8 cols on desktop) */}
        <div className="lg:col-span-8 relative rounded-lg overflow-hidden border border-border bg-surface shadow-card flex flex-col justify-between min-h-[420px]">
          {/* Floating Search Bar */}
          <div className="absolute top-4 left-4 right-4 z-20 max-w-md">
            <div className="flex items-center gap-2 p-2 rounded-md bg-surface/95 backdrop-blur-md border border-border shadow-raised">
              <Search className="w-4 h-4 text-secondary flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search upazila or coordinates (e.g. Godagari)..."
                className="w-full bg-transparent text-sm text-primary focus:outline-none placeholder:text-muted"
                aria-label="Search map location"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-secondary hover:text-primary px-1.5"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Live Autocomplete suggestions */}
            {searchQuery && (
              <div className="mt-1 rounded-md bg-surface border border-border shadow-raised overflow-hidden">
                {filteredLocations.map((loc) => (
                  <button
                    key={loc.name}
                    type="button"
                    onClick={() => {
                      handleSelectLocation(loc);
                      setSearchQuery("");
                    }}
                    className="w-full p-2.5 text-left text-xs text-primary hover:bg-surface-hover flex items-center justify-between border-b border-border last:border-0"
                  >
                    <span className="font-medium">{loc.name}</span>
                    <span className="font-mono text-muted text-[10px]">
                      {loc.lat}° N, {loc.lon}° E
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Map Layer Selector (Top Right) */}
          <div className="absolute top-4 right-4 z-20 hidden sm:flex items-center gap-1 p-1 rounded-full bg-surface/90 backdrop-blur-md border border-border shadow-sm text-xs">
            <button
              type="button"
              onClick={() => setActiveLayer("satellite")}
              className={`px-2.5 py-1 rounded-full transition-colors ${
                activeLayer === "satellite" ? "bg-forest text-white" : "text-secondary"
              }`}
            >
              Satellite
            </button>
            <button
              type="button"
              onClick={() => setActiveLayer("precipitation")}
              className={`px-2.5 py-1 rounded-full transition-colors ${
                activeLayer === "precipitation" ? "bg-water text-white" : "text-secondary"
              }`}
            >
              Rainfall
            </button>
            <button
              type="button"
              onClick={() => setActiveLayer("moisture")}
              className={`px-2.5 py-1 rounded-full transition-colors ${
                activeLayer === "moisture" ? "bg-leaf text-white" : "text-secondary"
              }`}
            >
              Soil Moisture
            </button>
          </div>

          {/* Map Visual (High-Res Satellite Backdrop + Interactive SVG Coordinate Grid) */}
          <div className="relative w-full h-full min-h-[460px] flex-1">
            <Image
              src="/images/hero_crop_fields.jpg"
              alt="Interactive Barind Tract agricultural field map"
              fill
              className="object-cover"
            />
            {/* Dark overlay for contrast */}
            <div className="absolute inset-0 bg-forest/30 pointer-events-none" />

            {/* SVG Grid Overlay representing NASA POWER 50km cells */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                  <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="3 3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Interactive Location Pins */}
            <div className="absolute inset-0 p-8 flex items-center justify-around pointer-events-auto">
              {locations.map((loc, i) => {
                const isSelected = selectedPin.name === loc.name;
                return (
                  <button
                    key={loc.name}
                    type="button"
                    onClick={() => handleSelectLocation(loc)}
                    className={`group absolute transform -translate-x-1/2 -translate-y-1/2 focus:outline-none transition-transform ${
                      isSelected ? "scale-125 z-30" : "scale-100 hover:scale-110 z-10"
                    }`}
                    style={{
                      left: `${20 + (i % 3) * 30 + (i > 2 ? 10 : 0)}%`,
                      top: `${30 + Math.floor(i / 2) * 25}%`,
                    }}
                    title={`${loc.name} (${loc.lat}° N, ${loc.lon}° E)`}
                  >
                    <div className="flex flex-col items-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold shadow-raised whitespace-nowrap mb-1 ${
                          isSelected
                            ? "bg-gold text-forest ring-2 ring-forest"
                            : "bg-surface text-primary"
                        }`}
                      >
                        {loc.name.split(" ")[0]}
                      </span>
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shadow-raised ${
                          isSelected
                            ? "bg-gold text-forest ring-4 ring-gold/40 animate-bounce"
                            : "bg-white text-forest hover:bg-gold"
                        }`}
                      >
                        <MapPin className="w-4 h-4" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Map Status Strip */}
          <div className="p-3 bg-surface/95 border-t border-border flex items-center justify-between text-xs text-secondary z-10">
            <span className="font-mono">
              Selected Cell: {selectedPin.lat}° N, {selectedPin.lon}° E ({selectedPin.name})
            </span>
            <span className="text-[11px] text-muted hidden sm:inline">
              Source: NASA POWER 50 km Resolution Grid
            </span>
          </div>
        </div>

        {/* Selected Location Summary Panel (4 cols on desktop) */}
        <aside className="lg:col-span-4 rounded-lg bg-surface border border-border shadow-card p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-secondary">
                  Location Summary
                </span>
                <h2 className="text-xl font-serif font-bold text-primary m-0">
                  {selectedPin.name}
                </h2>
              </div>
              {selectedPin.isPilot && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-leaf/10 text-leaf">
                  Pilot Zone
                </span>
              )}
            </div>

            {/* 3-4 Quick Summary Cards */}
            <div className="space-y-3">
              <div className="p-3.5 rounded bg-bg border border-border/80 flex items-center justify-between">
                <div>
                  <span className="text-xs text-secondary block">Annual Rainfall</span>
                  <span className="font-mono text-base font-bold text-primary">1,625 mm</span>
                </div>
                <span className="text-xs text-heat font-medium">36% below national avg</span>
              </div>

              <div className="p-3.5 rounded bg-bg border border-border/80 flex items-center justify-between">
                <div>
                  <span className="text-xs text-secondary block">Groundwater Depth</span>
                  <span className="font-mono text-base font-bold text-primary">113 ft</span>
                </div>
                <span className="text-xs text-heat font-medium">Severe water stress</span>
              </div>

              <div className="p-3.5 rounded bg-bg border border-border/80 flex items-center justify-between">
                <div>
                  <span className="text-xs text-secondary block">Topsoil Carbon (SOC)</span>
                  <span className="font-mono text-base font-bold text-primary">0.68%</span>
                </div>
                <span className="text-xs text-gold-text font-medium">Degraded (&lt; 0.8%)</span>
              </div>

              <div className="p-3.5 rounded bg-bg border border-border/80 flex items-center justify-between">
                <div>
                  <span className="text-xs text-secondary block">Recommended Fit</span>
                  <span className="font-serif text-sm font-bold text-primary">Mustard – Mungbean</span>
                </div>
                <span className="text-xs text-leaf font-bold">7.4 / 10</span>
              </div>
            </div>

            <p className="text-xs text-secondary leading-relaxed m-0">
              Barind groundwater has dropped significantly due to high boro rice pumping. Shifting to pulse and oilseed rotations cuts water extraction by 60%.
            </p>
          </div>

          {/* Action button leading to Dashboard */}
          <div className="pt-4 border-t border-border space-y-2">
            <Link href="/dashboard" className="block w-full">
              <Button variant="primary" size="lg" className="w-full shadow-raised">
                <span>Open Climate & Soil Dashboard</span>
                <ArrowRight className="w-4 h-4 text-forest" />
              </Button>
            </Link>
            <Link href="/plan" className="block w-full">
              <Button variant="outline" size="sm" className="w-full">
                <span>Jump Directly to Rotation Planner</span>
              </Button>
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
