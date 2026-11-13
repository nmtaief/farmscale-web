"use client";

import React from "react";
import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Home, Activity, CalendarRange, Sparkles } from "lucide-react";
import { useAppStore } from "@/lib/store/useAppStore";

export const BottomTabBar: React.FC = () => {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const setAiModalOpen = useAppStore((state) => state.setAiModalOpen);

  const tabs = [
    { href: "/", label: t("home"), icon: Home, isAction: false },
    { href: "/dashboard", label: t("myField"), icon: Activity, isAction: false },
    { href: "/plan", label: t("plan"), icon: CalendarRange, isAction: false },
    { href: "#ask", label: t("ask"), icon: Sparkles, isAction: true },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border pb-safe transition-colors shadow-sheet"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : !tab.isAction && pathname.startsWith(tab.href);

          if (tab.isAction) {
            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => setAiModalOpen(true)}
                className="flex flex-col items-center justify-center flex-1 h-full min-h-[48px] min-w-[48px] transition-colors rounded-sm text-secondary hover:text-gold touch-target"
                aria-label="Open AI Advisor"
              >
                <span className="p-1 rounded-full bg-gold/20 text-forest dark:text-gold transition-transform">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </span>
                <span className="text-[11px] leading-tight mt-0.5 tracking-tight font-bold text-primary">
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center flex-1 h-full min-h-[48px] min-w-[48px] transition-colors rounded-sm touch-target ${
                isActive
                  ? "text-forest dark:text-gold font-bold"
                  : "text-secondary hover:text-primary"
              }`}
            >
              <span
                className={`p-1 rounded-full transition-transform ${
                  isActive ? "bg-gold text-forest shadow-xs scale-105" : ""
                }`}
              >
                <Icon className="w-5 h-5" aria-hidden="true" />
              </span>
              <span className="text-[11px] leading-tight mt-0.5 tracking-tight font-medium">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
