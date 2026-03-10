"use client";

import { content } from "@/lib/content";
import { Zap } from "lucide-react";
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
            href="/signup"
            className="rounded-full bg-gray-900 px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-medium text-white shadow-sm transition-all hover:scale-105 hover:bg-gray-800 hover:shadow-md"
          >
            {t.navbar.cta}
          </Link>
        </div>
      </div>
    </nav>
  );
}
