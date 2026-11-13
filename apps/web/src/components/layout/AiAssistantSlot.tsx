"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Send,
  Loader2,
  Settings2,
  KeyRound,
  MapPin,
  Check,
  TrendingUp,
  Droplets,
  Sprout,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useAppStore, type LocationInfo } from "@/lib/store/useAppStore";
import { LocateMeButton } from "@/components/ui/LocateMeButton";

interface RankedRotation {
  rank: number;
  id: string;
  name: string;
  matchScore: number;
  pattern: string[];
  suitability: string;
  telemetryNote: string;
  crops: {
    rabi: { name: string; water: number; income: number; soil: number };
    kharif1: { name: string; water: number; income: number; soil: number };
    kharif2: { name: string; water: number; income: number; soil: number };
  };
}

interface AdvisorResponse {
  status: string;
  location: LocationInfo;
  intent: {
    goal: string;
    language: string;
    season: string;
  };
  ranked_rotations: RankedRotation[];
  plain_language_answer: string;
  model_used: string;
}

export const AiAssistantSlot: React.FC = () => {
  const t = useTranslations("ai");
  const location = useAppStore((state) => state.location);
  const setPriorities = useAppStore((state) => state.setPriorities);

  const [isExpanded, setIsExpanded] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AdvisorResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Settings modal
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("openrouter/free");
  const [keySaved, setKeySaved] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem("farmscale_openrouter_key") || "";
    const savedModel = localStorage.getItem("farmscale_openrouter_model") || "openrouter/free";
    setApiKey(savedKey);
    setModel(savedModel);
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem("farmscale_openrouter_key", apiKey.trim());
    localStorage.setItem("farmscale_openrouter_model", model);
    setKeySaved(true);
    setTimeout(() => {
      setKeySaved(false);
      setSettingsOpen(false);
    }, 1200);
  };

  const handleAsk = async (customPrompt?: string) => {
    const query = (customPrompt !== undefined ? customPrompt : prompt).trim();
    if (!query) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: query,
          location,
          apiKey: apiKey.trim() || undefined,
          model,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data.status === "error") {
        throw new Error(data.message || "Failed to generate recommendation");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "Could not reach FarmScale advisor.");
    } finally {
      setLoading(false);
    }
  };

  const applyToPlanner = (goal: string) => {
    if (goal === "soil_fertility") {
      setPriorities({ water: 4, income: 4, soil: 9 });
    } else if (goal === "land_preservation") {
      setPriorities({ water: 9, income: 4, soil: 5 });
    } else {
      setPriorities({ water: 4, income: 9, soil: 4 });
    }
  };

  const samplePrompts = [
    { label: "🌾 Cash Crop Rotation", query: "I want highest profit commercial cash crops for my field in Rajshahi" },
    { label: "🌱 Rebuild Soil Nitrogen", query: "My soil is degraded, recommend legume nitrogen-fixing rotation" },
    { label: "💧 Drought & Water Saving", query: "Drought resilience: need crops that use minimal irrigation" },
    { label: "🇧🇩 বাংলায় পরামর্শ", query: "আমি রাজশাহীর কৃষক, জমিতে নাইট্রোজেন বাড়াতে কোন ফসল আবর্তন করব?" },
  ];

  return (
    <div className="w-full rounded-lg border border-border bg-surface overflow-hidden transition-all shadow-card">
      {/* Header Bar */}
      <div className="flex items-center justify-between p-3.5 bg-surface/90 border-b border-border/80">
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="flex items-center gap-2 text-left text-sm font-serif font-bold text-primary hover:text-gold transition-colors"
          aria-expanded={isExpanded}
        >
          <span className="p-1.5 rounded-full bg-leaf/15 text-leaf">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
          </span>
          <span>FarmScale AI Advisor</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-forest/10 text-forest font-sans font-semibold uppercase tracking-wider">
            Layer 1 + ML
          </span>
        </button>

        <div className="flex items-center gap-2">
          {/* Active Field Location with GPS Button */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-secondary bg-bg px-2.5 py-1 rounded-full border border-border">
            <MapPin className="w-3.5 h-3.5 text-water" />
            <span className="truncate max-w-[140px] font-medium text-primary">
              {location.name}
            </span>
            <LocateMeButton variant="icon" />
          </div>

          {/* Settings Trigger */}
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="p-1.5 rounded-md hover:bg-surface-hover text-secondary hover:text-primary transition-colors"
            title="Configure OpenRouter LLM Settings"
            aria-label="OpenRouter Settings"
          >
            <Settings2 className="w-4 h-4" />
          </button>

          {/* Expand/Collapse */}
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="p-1 rounded text-secondary hover:text-primary"
            aria-label={isExpanded ? "Collapse panel" : "Expand panel"}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Natural Language Prompt Input */}
          <div className="space-y-2">
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleAsk();
                  }
                }}
                placeholder="Ask about crop suitability, soil fertility, or seasonal planning for your field (e.g., 'What cash crop rotation suits Godagari?' or 'মাটির উর্বরতা বাড়াতে কী চাষ করব?')..."
                rows={2}
                className="w-full p-3 pr-24 rounded-md bg-bg border border-border text-primary text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold transition-all resize-none"
              />
              <div className="absolute right-2.5 bottom-2.5">
                <button
                  type="button"
                  onClick={() => handleAsk()}
                  disabled={loading || !prompt.trim()}
                  className="px-3 py-1.5 rounded bg-forest text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-forest/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xs"
                >
                  {loading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>Ask AI</span>
                </button>
              </div>
            </div>

            {/* Quick Prompt Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[11px] text-muted mr-1 font-medium">Quick prompts:</span>
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setPrompt(p.query);
                    handleAsk(p.query);
                  }}
                  className="px-2.5 py-1 rounded-full bg-surface-hover/80 hover:bg-leaf/10 hover:text-leaf border border-border hover:border-leaf/30 text-secondary text-xs transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200 text-xs text-red-700">
              {error}
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="p-4 rounded-md bg-bg border border-border flex items-center justify-center gap-3 text-secondary text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-water" />
              <span>Analyzing location telemetry, evaluating crop models, and generating response...</span>
            </div>
          )}

          {/* Response Display */}
          {result && (
            <div className="space-y-4 pt-1">
              {/* Plain Language Agronomic Explanation */}
              <div className="p-3.5 rounded-md bg-leaf/10 border border-leaf/30 text-primary text-sm leading-relaxed space-y-1.5">
                <div className="flex items-center justify-between text-xs text-leaf font-semibold">
                  <span className="inline-flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Agronomic Guidance ({result.intent.language.toUpperCase()})
                  </span>
                  <span className="text-[11px] font-mono text-muted">
                    Engine: {result.model_used}
                  </span>
                </div>
                <p className="m-0 text-primary font-medium">{result.plain_language_answer}</p>
              </div>

              {/* Recommended Rotations List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-secondary">
                  <span>Top Scored 3-Season Rotations for {result.location.name}</span>
                  <button
                    type="button"
                    onClick={() => applyToPlanner(result.intent.goal)}
                    className="text-forest hover:underline font-bold flex items-center gap-1"
                  >
                    <span>Sync with Planner</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {result.ranked_rotations.map((rot) => (
                    <div
                      key={rot.id}
                      className="p-3 rounded-md bg-bg border border-border hover:border-gold transition-all space-y-2 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-surface border border-border text-secondary">
                            Option #{rot.rank}
                          </span>
                          <span className="text-xs font-bold text-forest">
                            Score {rot.matchScore}
                          </span>
                        </div>
                        <h4 className="text-xs font-serif font-bold text-primary m-0 line-clamp-1">
                          {rot.name}
                        </h4>
                        <p className="text-[11px] text-secondary m-0 mt-1 line-clamp-2">
                          {rot.suitability}
                        </p>
                      </div>

                      {/* Seasonal Sequence Badges */}
                      <div className="pt-2 border-t border-border/60 text-[10px] space-y-1">
                        <div className="flex items-center justify-between text-muted">
                          <span>Rabi (Winter):</span>
                          <span className="font-semibold text-primary">{rot.crops.rabi.name}</span>
                        </div>
                        <div className="flex items-center justify-between text-muted">
                          <span>Kharif-1 (Summer):</span>
                          <span className="font-semibold text-primary">{rot.crops.kharif1.name}</span>
                        </div>
                        <div className="flex items-center justify-between text-muted">
                          <span>Kharif-2 (Monsoon):</span>
                          <span className="font-semibold text-primary">{rot.crops.kharif2.name}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* OpenRouter API Settings Modal */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-lg bg-surface border border-border p-5 shadow-raised space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-gold" />
                <h3 className="text-sm font-serif font-bold text-primary m-0">
                  OpenRouter & LLM Settings
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSettingsOpen(false)}
                className="text-xs text-secondary hover:text-primary"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-secondary m-0 leading-relaxed">
              Optional: Enter your OpenRouter API key to activate live multi-model LLM inference.
              If omitted, FarmScale uses the server-configured environment key or built-in agronomic engine.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-primary block mb-1">
                  OpenRouter API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-or-v1-..."
                  className="w-full p-2.5 rounded bg-bg border border-border text-primary font-mono text-xs focus:outline-none focus:ring-2 focus:ring-gold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-primary block mb-1">
                  LLM Model
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full p-2.5 rounded bg-bg border border-border text-primary text-xs focus:outline-none focus:ring-2 focus:ring-gold"
                >
                  <option value="openrouter/free">OpenRouter: Free Auto-Router (100% Free)</option>
                  <option value="google/gemma-4-31b-it:free">Google: Gemma 4 31B (Free)</option>
                  <option value="nvidia/nemotron-3.5-lightning:free">NVIDIA: Nemotron 3.5 Lightning (Free)</option>
                  <option value="baidu/ernie-5.5-flash-preview:free">Baidu: Ernie 5.5 Flash (Free)</option>
                  <option value="openai/gpt-4o-mini">OpenAI: GPT-4o Mini</option>
                  <option value="google/gemini-2.0-flash">Google: Gemini 2.0 Flash</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-[11px] text-muted">
                Stored in browser local storage
              </span>
              <button
                type="button"
                onClick={handleSaveSettings}
                className="px-4 py-2 rounded bg-forest text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-forest/90 transition-all shadow-xs"
              >
                {keySaved ? <Check className="w-3.5 h-3.5 text-white" /> : null}
                <span>{keySaved ? "Saved!" : "Save Settings"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
