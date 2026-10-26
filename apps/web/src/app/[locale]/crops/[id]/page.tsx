import React from "react";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { ArrowLeft, Droplets, Sprout, DollarSign, Calendar, ShieldCheck, ExternalLink } from "lucide-react";
import { SAMPLE_CROPS } from "@farmscale/scoring";

import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  const params: { locale: string; id: string }[] = [];
  for (const locale of routing.locales) {
    for (const id of Object.keys(SAMPLE_CROPS)) {
      params.push({ locale, id });
    }
  }
  return params;
}

interface CropDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function CropDetailPage({ params }: CropDetailPageProps) {
  const { id } = await params;
  const crop = SAMPLE_CROPS[id];

  if (!crop) {
    notFound();
  }

  const cropName = crop.id.replace("_", " ").toUpperCase();

  const traits = [
    {
      name: "Water Requirement & Efficiency",
      value: `${crop.waterNeedRating} / 10`,
      desc: crop.waterNeedRating >= 7 ? "Low irrigation demand. Saves groundwater in dry winter." : "High irrigation required. Strains deep tube wells.",
      source: "FAO-56 Irrigation and Drainage / Sample fixture",
      icon: Droplets,
      color: "text-water",
    },
    {
      name: "Soil Regeneration & Nitrogen Fixation",
      value: `${crop.soilBenefitRating} / 10`,
      desc: crop.soilBenefitRating >= 7 ? "Legume nodulation enriches topsoil with atmospheric nitrogen." : "Minimal nitrogen contribution; relies on external fertilizers.",
      source: "BARI Agronomy Division / Sample fixture",
      icon: Sprout,
      color: "text-leaf",
    },
    {
      name: "Income & Market Margin",
      value: `${crop.incomeRating} / 10`,
      desc: "Gross market price relative to local production input costs in Rajshahi.",
      source: "Department of Agricultural Marketing (DAM) / Sample fixture",
      icon: DollarSign,
      color: "text-gold-text",
    },
    {
      name: "Season & Growth Duration",
      value: crop.season.replace("_", " ").toUpperCase(),
      desc: "Optimal planting window in Bangladesh agro-ecological calendar.",
      source: "Bangladesh Agricultural Research Institute (BARI)",
      icon: Calendar,
      color: "text-primary",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* Back Link */}
      <Link href="/crops">
        <Button variant="ghost" size="sm" className="gap-2 -ml-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Crop Library</span>
        </Button>
      </Link>

      {/* Main Header */}
      <div className="p-6 rounded-lg bg-surface border border-border shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-secondary px-2.5 py-1 rounded bg-bg border border-border">
            Season: {crop.season.replace("_", "-")}
          </span>
          <Chip state="sample">Sample crop traits</Chip>
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-primary m-0">
          {cropName}
        </h1>

        <p className="text-secondary text-sm leading-relaxed m-0">
          Crop trait profiles are evaluated by the FarmScale scoring engine when ranking rotations for the Barind delta. Every trait is accompanied by a transparent citation and sample data tag.
        </p>
      </div>

      {/* Individual Trait Cards (Each with distinct source & sample label) */}
      <div className="space-y-4">
        <h2 className="text-lg font-serif font-bold text-primary">
          Agronomic Profile & Telemetry
        </h2>

        {traits.map((trait) => {
          const Icon = trait.icon;
          return (
            <div
              key={trait.name}
              className="p-5 rounded-md bg-surface border border-border shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-full bg-bg border border-border">
                    <Icon className={`w-5 h-5 ${trait.color}`} />
                  </div>
                  <h3 className="font-serif font-bold text-base text-primary m-0">
                    {trait.name}
                  </h3>
                </div>
                <div className="font-mono text-xl font-bold text-primary">
                  {trait.value}
                </div>
              </div>

              <p className="text-xs text-secondary leading-relaxed pl-11 m-0">
                {trait.desc}
              </p>

              <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted pl-11">
                <span>Source: {trait.source}</span>
                <Chip state="sample" className="text-[10px] py-0">Sample</Chip>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Footer */}
      <div className="p-6 rounded-lg bg-surface-hover border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-serif font-bold text-primary m-0">
            See {cropName} in a 3-Season Rotation
          </h3>
          <p className="text-xs text-secondary m-0">
            Compare recommendations with this crop on the Rotation Planner.
          </p>
        </div>

        <Link href="/plan">
          <Button variant="primary" size="md">
            <span>Explore in Planner</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
