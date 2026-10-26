import React from "react";
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";
import { Header } from "@/components/layout/Header";
import { ContextBar } from "@/components/layout/ContextBar";
import { BottomTabBar } from "@/components/layout/BottomTabBar";
import { OfflineBanner } from "@/components/layout/OfflineBanner";
import "@/styles/globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // Allow up to 200%+ zoom for WCAG compliance
  themeColor: "#F3F7F0",
};

export const metadata: Metadata = {
  title: "FarmScale – Climate-Adapted Crop Rotations with NASA Earth Data",
  description:
    "Decision-support web app combining NASA Earth observations, local soil metrics and farmer priorities to plan resilient 3-season crop rotations.",
  icons: {
    icon: "/favicon.ico",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  // Determine script-specific class for font scoping
  const scriptClass =
    locale === "bn"
      ? "font-bengali"
      : locale === "ja"
      ? "font-japanese"
      : "font-latin";

  return (
    <html lang={locale} className={scriptClass} suppressHydrationWarning>
      <head>
        {/* Self-hosted subset font declarations are defined in globals.css / tokens.css */}
        <link rel="preconnect" href="/" />
      </head>
      <body className="min-h-screen flex flex-col bg-bg text-primary transition-colors">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <OfflineBanner />
          <Header />
          <ContextBar />
          <main className="flex-1 pb-24 md:pb-12 max-w-content w-full mx-auto px-4 py-6">
            {children}
          </main>
          <BottomTabBar />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
