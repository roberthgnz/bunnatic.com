"use client";

import { content } from "@/lib/content";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="hidden sm:flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
              >
                {t.navbar.platformLabel}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-72">
              {t.navbar.coreFeatures.map((feature) => (
                <DropdownMenuItem key={feature.id} asChild>
                  <Link
                    href={`/caracteristicas/${feature.id}`}
                    className="block rounded-lg px-2 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
                  >
                    {feature.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-500">
            <Button
              variant="ghost"
              size="sm"
              className={`hidden hover:text-gray-900 transition-colors sm:flex ${language === "es" ? "text-gray-900 font-bold" : ""}`}
              onClick={() => setLanguage("es")}
            >
              ES
            </Button>
            <span>|</span>
            <Button
              variant="ghost"
              size="sm"
              className={`hidden hover:text-gray-900 transition-colors sm:flex ${language === "ca" ? "text-gray-900 font-bold" : ""}`}
              onClick={() => setLanguage("ca")}
            >
              CA
            </Button>
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
