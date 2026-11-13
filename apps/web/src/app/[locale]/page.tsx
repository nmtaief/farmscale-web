import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";
import { RotationRing } from "@/components/season/RotationRing";
import { LocateMeButton } from "@/components/ui/LocateMeButton";
import { FarmerHeroActions } from "@/components/layout/FarmerHeroActions";
import { Compass, ShieldCheck, Cpu, Smartphone, ArrowRight, Search, MapPin, Sparkles } from "lucide-react";

export default function LandingPage() {
  const tLanding = useTranslations("landing");
  const tCommon = useTranslations("common");

  const pilotLocations = [
    { name: "Rajshahi Sadar", lat: "24.37° N", lon: "88.60° E" },
    { name: "Godagari (Barind)", lat: "24.46° N", lon: "88.33° E" },
    { name: "Tanore", lat: "24.58° N", lon: "88.57° E" },
    { name: "Paba", lat: "24.43° N", lon: "88.62° E" },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Honest sample notice banner */}
      <div className="p-3.5 rounded-md bg-leaf/10 border border-leaf/30 text-xs text-primary leading-relaxed">
        <span className="font-bold text-leaf mr-1.5">পাইলট প্রাক্কলন:</span>
        {tCommon("honestSampleBanner")}
      </div>

      {/* Pilot Region Disclaimer Banner */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-leaf/10 border border-leaf/25 text-leaf text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-leaf animate-pulse" />
          <span>{tCommon("pilotNotice")}</span>
        </div>
        <span className="text-xs text-muted font-mono">
          Barind Tract Grid Cell: 24.37° N, 88.60° E
        </span>
      </div>

      {/* Hero Section: 3 Big Icon Buttons (Part B.1) */}
      <section className="space-y-6">
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-primary tracking-tight leading-[1.15]">
            {tLanding("heroTitle")}
          </h1>
          <p className="text-base sm:text-lg text-secondary leading-relaxed max-w-2xl">
            {tLanding("heroSubtitle")}
          </p>
        </div>

        {/* 3 Large Action Cards */}
        <FarmerHeroActions />
      </section>

      {/* Field Shift Story & Rotation Ring Illustration */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
        <div className="lg:col-span-7 space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-gold">
            NASA Space Apps Challenge 2026 – Field Shift
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary m-0">
            Adapting Farms with Ground-Truth and Satellite Earth Data
          </h2>
          <p className="text-sm text-secondary leading-relaxed m-0">
            Continuous flooded boro rice has dropped Barind groundwater from 26 ft to over 113 ft. FarmScale introduces high-value mustard and legume rotations that restore the aquifer while boosting net profit.
          </p>

          {/* Quick Pilot Coordinates & GPS Trigger */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 text-xs text-secondary">
            <LocateMeButton variant="chip" />
            <span className="font-medium mr-1 ml-1">Pilot areas:</span>
            {pilotLocations.map((loc) => (
              <Link
                key={loc.name}
                href="/explore"
                className="px-2.5 py-1 rounded-full bg-surface border border-border hover:border-gold hover:text-primary transition-colors inline-flex items-center gap-1 text-[11px]"
              >
                <MapPin className="w-3 h-3 text-water" />
                <span>{loc.name}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-lg bg-surface border border-border shadow-card relative overflow-hidden">
          <div className="absolute top-3 right-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-secondary px-2 py-0.5 rounded bg-bg border border-border">
              3-Season Cycle
            </span>
          </div>

          <RotationRing size={240} />

          <p className="text-xs text-secondary text-center mt-3 max-w-xs leading-relaxed">
            Kharif-1 pulses (mungbean) fix soil nitrogen before monsoon rice.
          </p>
        </div>
      </section>

      {/* Visual Showcase: Real Local Agro-Scientific Imagery (Optimized responsive sizes) */}
      <section className="rounded-lg overflow-hidden border border-border bg-surface shadow-card">
        <div className="relative h-60 sm:h-72 md:h-80 w-full">
          <Image
            src="/images/hero_crop_fields.jpg"
            alt="Lush agricultural mosaic of crop rotation fields in Bengal delta"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            className="object-cover"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/40 to-transparent flex items-end p-6">
            <div className="text-white max-w-2xl space-y-1.5">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-gold">
                Barind Aquifer Restoration
              </span>
              <p className="text-sm text-gray-200 leading-relaxed max-w-xl">
                Replacing water-intensive boro with mustard and mungbean saves up to 60% groundwater while increasing annual farm profit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Trust Points (Developer metrics block removed per Part A.9) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <div className="p-6 rounded-md bg-surface border border-border shadow-card space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-full bg-water/15 text-water flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-serif font-bold text-primary">
              {tLanding("trustPoint1Title")}
            </h2>
            <p className="text-sm text-secondary leading-relaxed">
              {tLanding("trustPoint1Desc")} Coarse gridded climatology calibrated for the Barind delta.
            </p>
          </div>
          <div className="relative h-28 w-full rounded overflow-hidden border border-border">
            <Image
              src="/images/satellite_earth_data.jpg"
              alt="NASA Earth observation satellite scan over Bengal delta"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
              loading="lazy"
            />
          </div>
        </div>

        <div className="p-6 rounded-md bg-surface border border-border shadow-card space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-full bg-leaf/15 text-leaf flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-serif font-bold text-primary">
              {tLanding("trustPoint2Title")}
            </h2>
            <p className="text-sm text-secondary leading-relaxed">
              {tLanding("trustPoint2Desc")} Every recommendation explicitly explains its water savings and soil recovery.
            </p>
          </div>
          <div className="relative h-28 w-full rounded overflow-hidden border border-border">
            <Image
              src="/images/farmer_field_tactile.jpg"
              alt="Smallholder farmer inspecting healthy soil and crop roots"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
              loading="lazy"
            />
          </div>
        </div>

        <div className="p-6 rounded-md bg-surface border border-border shadow-card space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-full bg-gold/20 text-forest dark:text-gold flex items-center justify-center">
              <Smartphone className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-serif font-bold text-primary">
              {tLanding("trustPoint3Title")}
            </h2>
            <p className="text-sm text-secondary leading-relaxed">
              {tLanding("trustPoint3Desc")} Designed for rural Android phones with offline persistence and touch-first navigation.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-bg border border-border text-xs space-y-1">
            <span className="font-bold text-primary block">
              {tCommon("pilotNotice")}
            </span>
            <p className="text-[11px] text-secondary m-0">
              Rajshahi Sadar, Godagari, Tanore, Paba, Naogaon & Natore pilot zones.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
