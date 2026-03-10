"use client";

import { content } from "@/lib/content";
import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "./LanguageProvider";

const slugify = (text: string) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const slugMap: Record<string, string> = {
  peluquerias: "peluquerias",
  restaurantes: "restaurantes",
  gimnasios: "gimnasios",
  farmacias: "farmacias",
  esteticas: "esteticas",
  veterinarios: "veterinarios",
  dentistas: "dentistas",
  fotografos: "fotografos",
  inmobiliarias: "inmobiliarias",
  talleres: "talleres",
  perruqueries: "peluquerias",
  restaurants: "restaurantes",
  gimnasos: "gimnasios",
  farmacies: "farmacias",
  estetiques: "esteticas",
  veterinaris: "veterinarios",
  dentistes: "dentistas",
  fotografs: "fotografos",
  immobiliaries: "inmobiliarias",
  tallers: "talleres",
};

const getBusinessSlug = (business: string) => {
  const normalized = slugify(business);
  return slugMap[normalized] ?? normalized;
};

export default function Ticker() {
  const { language } = useLanguage();
  const t = content[language];
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section className="overflow-hidden bg-[#0a0a0a] py-16 text-white border-y border-white/5">
      <div className="relative flex w-full flex-col items-center justify-center">
        {/* Gradient Masks for smooth fade out on edges */}
        <div className="absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent pointer-events-none" />

        <div className="flex w-full overflow-hidden whitespace-nowrap">
          <div
            className="flex items-center gap-12 px-4 text-xl font-semibold text-gray-400 sm:text-2xl"
            style={{
              animation: "ticker-scroll 30s linear infinite",
              animationPlayState: isPaused ? "paused" : "running",
            }}
          >
            {/* Duplicate the array to create a seamless loop */}
            {[...t.ticker.businesses, ...t.ticker.businesses].map(
              (business, index) => (
                <Link
                  key={index}
                  href={`/negocio/${getBusinessSlug(business)}`}
                  className="flex-shrink-0 hover:text-white transition-colors"
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                  onFocus={() => setIsPaused(true)}
                  onBlur={() => setIsPaused(false)}
                >
                  {business}
                </Link>
              )
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 text-center px-4">
          <p className="text-sm font-medium text-gray-400 tracking-wide uppercase">{t.ticker.text1}</p>
          <p className="max-w-4xl text-xs text-gray-600 font-medium leading-relaxed">
            {t.ticker.text2}
          </p>
        </div>
      </div>
      <style jsx>{`
        @keyframes ticker-scroll {
          from {
            transform: translateX(0%);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
