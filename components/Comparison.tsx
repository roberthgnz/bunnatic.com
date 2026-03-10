"use client";

import { content } from "@/lib/content";
import { AnimatePresence, motion } from "motion/react";
import { Check, X } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { useLanguage } from "./LanguageProvider";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type ComparisonConfig = {
  title: string;
  caption: string;
  cards: {
    facebook: {
      title: string;
      items: string[];
    };
    novaweb: {
      title: string;
      items: string[];
    };
  };
};

type ComparisonProps = {
  alternativeId?: string;
};

const logoByCompetitorId = {
  facebook: "/logos/facebook.svg",
  instagram: "/logos/instagram.svg",
  "google-my-business": "/logos/google-my-business.svg",
  wordpress: "/logos/wordpress.svg",
  wix: "/logos/wix.svg",
  squarespace: "/logos/squarespace.svg",
} as const;

export default function Comparison({ alternativeId }: ComparisonProps) {
  const { language } = useLanguage();
  const t = content[language];
  const pathname = usePathname();

  const normalizedName = (name: string) =>
    name
      .replace(/\sPages$/i, "")
      .replace(/^Con\s+/i, "")
      .replace(/^Solo con\s+/i, "")
      .replace(/^Només amb\s+/i, "")
      .trim();

  const pathSegments = pathname?.split("/").filter(Boolean) ?? [];
  const alternativaIndex = pathSegments.findIndex((segment) => segment === "alternativa");
  const inferredAlternativeId = alternativaIndex >= 0 ? pathSegments[alternativaIndex + 1] : undefined;

  const activeAlternative = alternativeId ?? inferredAlternativeId;
  const competitors = t.competitors;
  const [manualSelectedCompetitorId, setManualSelectedCompetitorId] = useState(
    competitors[0]?.id ?? "",
  );
  const selectedCompetitorId = activeAlternative ?? manualSelectedCompetitorId;

  const competitor = useMemo(() => {
    return (
      competitors.find((item) => item.id === selectedCompetitorId) ??
      competitors[0]
    );
  }, [competitors, selectedCompetitorId]);

  const comparatorLabel = language === "ca" ? "Només amb" : "Con solo";
  const versusLabel = "Wibloz";
  const contextualCaption = (platformName: string) =>
    language === "ca"
      ? `${platformName} ajuda, però la teva web és la que converteix visites en clients.`
      : `${platformName} ayuda, pero tu web es la que convierte visitas en clientes.`;

  const comparison: ComparisonConfig = competitor
    ? {
        title: competitor.description,
        cards: {
          facebook: {
            title: `${comparatorLabel} ${normalizedName(competitor.name)}`,
            items: competitor.comparison.competitor.items,
          },
          novaweb: {
            title: competitor.comparison.novaweb.title,
            items: competitor.comparison.novaweb.items,
          },
        },
        caption: contextualCaption(normalizedName(competitor.name)),
      }
    : t.comparison;

  const comparisonKey = competitor?.id ?? "default";
  const isLockedByRoute = Boolean(activeAlternative);

  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl lg:max-w-none">
          <div className="flex flex-wrap items-center gap-3">
            {competitors.map((item) => {
              const logoSrc =
                logoByCompetitorId[item.id as keyof typeof logoByCompetitorId];
              const isActive = item.id === comparisonKey;

              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={isLockedByRoute}
                  onClick={() => setManualSelectedCompetitorId(item.id)}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                    isActive
                      ? "border-slate-900 bg-white text-slate-900"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  } ${isLockedByRoute ? "cursor-default" : ""}`}
                >
                  {logoSrc ? (
                    <Image
                      src={logoSrc}
                      alt={normalizedName(item.name)}
                      width={16}
                      height={16}
                      className="h-4 w-4 object-contain"
                    />
                  ) : null}
                  {normalizedName(item.name)}
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex items-center gap-3">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
              {versusLabel}
            </span>
            <span className="text-base font-bold uppercase tracking-wide text-gray-400">VS</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
              {competitor ? normalizedName(competitor.name) : "Competidor"}
            </span>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={comparisonKey}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <h2 className="mt-8 text-3xl font-extrabold leading-[1.1] tracking-tight text-gray-900 sm:text-4xl md:text-5xl sm:whitespace-pre-line">
                {comparison.title}
              </h2>

              <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
                <Card className="rounded-3xl border border-gray-200 bg-gray-50/50 p-0 shadow-sm">
                  <CardHeader className="px-8 pb-6 pt-8 sm:px-10">
                    <h3 className="flex items-center gap-3 text-2xl font-bold text-gray-900">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                        <X className="h-5 w-5 text-red-600" />
                      </span>
                      {comparison.cards.facebook.title}
                    </h3>
                  </CardHeader>
                  <CardContent className="px-8 pb-10 sm:px-10">
                    <ul className="space-y-6">
                      {comparison.cards.facebook.items.map((item, i) => (
                        <li key={i} className="flex gap-4 text-gray-600">
                          <X className="h-6 w-6 flex-shrink-0 text-red-400" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden rounded-3xl border-2 border-emerald-500 bg-white p-0 shadow-xl">
                  <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-50 blur-3xl" />
                  <CardHeader className="relative z-10 px-8 pb-6 pt-8 sm:px-10">
                    <h3 className="flex items-center gap-3 text-2xl font-bold text-gray-900">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                        <Check className="h-5 w-5 text-emerald-600" />
                      </span>
                      {comparison.cards.novaweb.title}
                    </h3>
                  </CardHeader>
                  <CardContent className="relative z-10 px-8 pb-10 sm:px-10">
                    <ul className="space-y-6">
                      {comparison.cards.novaweb.items.map((item, i) => (
                        <li key={i} className="flex gap-4 text-gray-900">
                          <Check className="h-6 w-6 flex-shrink-0 text-emerald-500" />
                          <span className="font-medium leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <p className="mt-12 text-center text-base font-medium text-gray-500">
                {comparison.caption}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
