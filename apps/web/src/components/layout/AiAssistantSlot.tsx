"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Sparkles, ChevronDown, ChevronUp, Lock } from "lucide-react";

interface AiConfig {
  enabled: boolean;
}

// Hardcoded feature flag defaulting to false per AGENTS.md rule 3
const AI_CONFIG: AiConfig = {
  enabled: false,
};

export const AiAssistantSlot: React.FC = () => {
  const t = useTranslations("ai");
  const [isExpanded, setIsExpanded] = useState(false);

  // If AI is disabled (as strictly required), render the disabled reserved slot
  return (
    <div className="w-full rounded-md border border-border bg-surface overflow-hidden transition-colors shadow-2xs">
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full flex items-center justify-between p-3.5 text-left text-sm font-semibold text-primary hover:bg-surface-hover transition-colors touch-target min-h-[44px]"
        aria-expanded={isExpanded}
        aria-controls="ai-assistant-content"
      >
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-full bg-border text-secondary">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
          </span>
          <span>{t("panelTitle")}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-border text-secondary font-normal inline-flex items-center gap-1">
            <Lock className="w-3 h-3" />
            {t("status")}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-secondary" />
        ) : (
          <ChevronDown className="w-4 h-4 text-secondary" />
        )}
      </button>

      {isExpanded && (
        <div
          id="ai-assistant-content"
          className="p-4 pt-1 border-t border-border/60 text-xs text-secondary leading-relaxed bg-bg/50"
        >
          <p className="m-0 font-medium">{t("disclaimer")}</p>
        </div>
      )}
    </div>
  );
};
