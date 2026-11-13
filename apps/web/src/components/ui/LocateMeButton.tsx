"use client";

import React, { useState } from "react";
import { Navigation, Loader2, Check, AlertCircle } from "lucide-react";
import { useAppStore, type LocationInfo } from "@/lib/store/useAppStore";
import { requestUserLocation } from "@/lib/location/geolocation";

interface LocateMeButtonProps {
  variant?: "primary" | "secondary" | "icon" | "chip";
  className?: string;
  onLocated?: (location: LocationInfo) => void;
  showLabel?: boolean;
}

export const LocateMeButton: React.FC<LocateMeButtonProps> = ({
  variant = "chip",
  className = "",
  onLocated,
  showLabel = true,
}) => {
  const setStoreLocation = useAppStore((s) => s.setLocation);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<"success" | "error" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLocate = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);
    setFeedback(null);
    setErrorMessage(null);

    const result = await requestUserLocation();
    setLoading(false);

    if (result.status === "success" && result.location) {
      setStoreLocation(result.location);
      if (onLocated) {
        onLocated(result.location);
      }
      setFeedback("success");
      setTimeout(() => setFeedback(null), 3000);
    } else {
      setFeedback("error");
      setErrorMessage(result.error || "Location access failed.");
      setTimeout(() => {
        setFeedback(null);
        setErrorMessage(null);
      }, 4500);
    }
  };

  if (variant === "icon") {
    return (
      <div className="relative inline-flex items-center">
        <button
          type="button"
          onClick={handleLocate}
          disabled={loading}
          title={errorMessage || "Access device GPS location"}
          aria-label="Access device GPS location"
          className={`p-1.5 rounded-full border transition-all text-xs flex items-center justify-center ${
            feedback === "success"
              ? "bg-leaf text-white border-leaf"
              : feedback === "error"
              ? "bg-amber-100 text-amber-800 border-amber-300"
              : "bg-surface text-secondary hover:text-water hover:border-water border-border"
          } ${className}`}
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-water" />
          ) : feedback === "success" ? (
            <Check className="w-3.5 h-3.5" />
          ) : feedback === "error" ? (
            <AlertCircle className="w-3.5 h-3.5" />
          ) : (
            <Navigation className="w-3.5 h-3.5" />
          )}
        </button>
        {errorMessage && (
          <span className="absolute left-0 bottom-full mb-1 z-50 text-[10px] bg-bg/95 border border-border shadow-raised rounded px-2 py-1 text-red-600 whitespace-nowrap">
            {errorMessage}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="relative inline-flex flex-col">
      <button
        type="button"
        onClick={handleLocate}
        disabled={loading}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all touch-target min-h-[36px] ${
          feedback === "success"
            ? "bg-leaf/15 text-leaf border-leaf/40 font-bold"
            : feedback === "error"
            ? "bg-red-50 text-red-700 border-red-200"
            : variant === "primary"
            ? "bg-forest text-white border-forest hover:bg-forest/90"
            : "bg-surface text-primary border-border hover:border-water hover:bg-surface-hover shadow-2xs"
        } ${className}`}
        title="Access current device location via browser GPS"
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-water" />
        ) : feedback === "success" ? (
          <Check className="w-3.5 h-3.5 text-leaf" />
        ) : feedback === "error" ? (
          <AlertCircle className="w-3.5 h-3.5 text-red-500" />
        ) : (
          <Navigation className="w-3.5 h-3.5 text-water" />
        )}
        {showLabel && (
          <span>
            {loading
              ? "Accessing GPS..."
              : feedback === "success"
              ? "Located!"
              : feedback === "error"
              ? "Permission Denied"
              : "Use My Location"}
          </span>
        )}
      </button>

      {errorMessage && (
        <span className="absolute top-full mt-1.5 left-0 z-50 text-[11px] bg-surface text-red-600 border border-red-200 shadow-raised rounded px-2.5 py-1 max-w-xs leading-tight">
          {errorMessage}
        </span>
      )}
    </div>
  );
};
