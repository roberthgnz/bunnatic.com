"use client";

import { content } from "@/lib/content";
import { motion } from "motion/react";
import { X, Check } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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
  const [rotatingIndex, setRotatingIndex] = useState(0);
  const isLockedByRoute = Boolean(activeAlternative);
  const competitorFromRoute = activeAlternative
    ? competitors.find((item) => item.id === activeAlternative)
    : undefined;

  useEffect(() => {
    if (isLockedByRoute || competitors.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setRotatingIndex((prev) => (prev + 1) % competitors.length);
    }, 3500);

    return () => window.clearInterval(interval);
  }, [competitors.length, isLockedByRoute]);

  const competitor = useMemo(() => {
    if (competitorFromRoute) {
      return competitorFromRoute;
    }

    return competitors[rotatingIndex];
  }, [competitorFromRoute, competitors, rotatingIndex]);

  const comparatorLabel = language === "ca" ? "Només amb" : "Con solo";

  const comparison: ComparisonConfig = competitor
    ? {
        title: t.comparison.title.replace(/Facebook/g, normalizedName(competitor.name)),
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
        caption: t.comparison.caption.replace(/Facebook/g, normalizedName(competitor.name)),
      }
    : t.comparison;

  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl lg:max-w-none">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl sm:whitespace-pre-line leading-[1.1]">
            {comparison.title}
          </h2>

          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Facebook Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden rounded-3xl"
          >
            <Card className="rounded-3xl border border-gray-200 bg-gray-50/50 p-0 shadow-sm">
              <CardHeader className="px-8 sm:px-10 pt-8 pb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                      <X className="h-5 w-5 text-red-600" />
                    </span>
                  {comparison.cards.facebook.title}
                </h3>
              </CardHeader>
              <CardContent className="px-8 sm:px-10 pb-10">
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
          </motion.div>

            {/* Nova Web Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="overflow-hidden rounded-3xl"
            >
              <Card className="relative overflow-hidden rounded-3xl border-2 border-emerald-500 bg-white p-0 shadow-xl">
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-50 blur-3xl" />
              <CardHeader className="relative z-10 px-8 sm:px-10 pt-8 pb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                    <Check className="h-5 w-5 text-emerald-600" />
                  </span>
                  {comparison.cards.novaweb.title}
                </h3>
              </CardHeader>
                <CardContent className="relative z-10 px-8 sm:px-10 pb-10">
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
            </motion.div>
          </div>

          <p className="mt-12 text-center text-base font-medium text-gray-500">
            {comparison.caption}
          </p>
        </div>
      </div>
    </section>
  );
}
