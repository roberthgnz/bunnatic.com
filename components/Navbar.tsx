"use client";

import { content } from "@/lib/content";
import { ChevronDown, Zap } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "./LanguageProvider";

export default function Navbar() {
  const { language, setLanguage } = useLanguage();
  const t = content[language];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
            <Zap className="h-5 w-5 fill-emerald-600 text-emerald-600" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">
            {t.navbar.logo}
          </span>
        </div>
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="relative hidden sm:block group">
            <button
              type="button"
              className="flex items-center gap-1 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              {t.navbar.platformLabel}
              <ChevronDown className="h-4 w-4" />
            </button>
            <div className="pointer-events-none absolute left-0 top-full z-10 mt-3 w-72 rounded-xl border border-gray-200 bg-white p-3 opacity-0 shadow-lg transition-all duration-150 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
              <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                {t.navbar.coreFeaturesLabel}
              </p>
              <div className="space-y-1">
                {t.navbar.coreFeatures.map((feature) => (
                  <Link
                    key={feature.id}
                    href={`/caracteristicas/${feature.id}`}
                    className="block rounded-lg px-2 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
                  >
                    {feature.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-500">
            <button 
              onClick={() => setLanguage("es")}
              className={`hover:text-gray-900 transition-colors ${language === "es" ? "text-gray-900 font-bold" : ""}`}
            >
              ES
            </button>
            <span>|</span>
            <button 
              onClick={() => setLanguage("ca")}
              className={`hover:text-gray-900 transition-colors ${language === "ca" ? "text-gray-900 font-bold" : ""}`}
            >
              CA
            </button>
          </div>
          <Link
            href="/crear"
            className="rounded-full bg-gray-900 px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-medium text-white shadow-sm transition-all hover:scale-105 hover:bg-gray-800 hover:shadow-md"
          >
            {t.navbar.cta}
          </Link>
        </div>
      </div>
    </nav>
  );
}
