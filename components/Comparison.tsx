"use client";

import { content } from "@/lib/content";
import { motion } from "motion/react";
import { X, Check } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

export default function Comparison() {
  const { language } = useLanguage();
  const t = content[language];

  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl lg:max-w-none">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl sm:whitespace-pre-line leading-[1.1]">
            {t.comparison.title}
          </h2>

          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Facebook Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl border border-gray-200 bg-gray-50/50 p-8 sm:p-10 shadow-sm"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                  <X className="h-5 w-5 text-red-600" />
                </span>
                {t.comparison.cards.facebook.title}
              </h3>
              <ul className="space-y-6">
                {t.comparison.cards.facebook.items.map((item, i) => (
                  <li key={i} className="flex gap-4 text-gray-600">
                    <X className="h-6 w-6 flex-shrink-0 text-red-400" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Nova Web Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-3xl border-2 border-emerald-500 bg-white p-8 sm:p-10 shadow-xl relative overflow-hidden"
            >
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-50 blur-3xl" />
              <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3 relative z-10">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                  <Check className="h-5 w-5 text-emerald-600" />
                </span>
                {t.comparison.cards.novaweb.title}
              </h3>
              <ul className="space-y-6 relative z-10">
                {t.comparison.cards.novaweb.items.map((item, i) => (
                  <li key={i} className="flex gap-4 text-gray-900">
                    <Check className="h-6 w-6 flex-shrink-0 text-emerald-500" />
                    <span className="font-medium leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          <p className="mt-12 text-center text-base font-medium text-gray-500">
            {t.comparison.caption}
          </p>
        </div>
      </div>
    </section>
  );
}
