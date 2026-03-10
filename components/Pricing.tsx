"use client";

import { content } from "@/lib/content";
import { motion } from "motion/react";
import { Check, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "./LanguageProvider";

export default function Pricing() {
  const { language } = useLanguage();
  const t = content[language];

  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] py-24 sm:py-32">
      <div className="absolute inset-0 bg-grid-pattern-dark opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20 bg-emerald-500 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
            {t.pricing.title}
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-400">
            {t.pricing.subtitle}
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-y-6 sm:mt-20 lg:max-w-none lg:grid-cols-3 lg:gap-x-8">
          {t.pricing.tiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative flex flex-col rounded-[2.5rem] p-8 sm:p-10 shadow-2xl backdrop-blur-xl ${
                tier.mostPopular
                  ? "bg-white/10 ring-2 ring-emerald-500"
                  : "bg-white/5 ring-1 ring-white/10"
              }`}
            >
              {tier.mostPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-emerald-500 px-4 py-1 text-xs font-semibold text-white shadow-sm">
                    Recomendado
                  </span>
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white">{tier.name}</h3>
                <p className="mt-2 text-sm text-gray-400">{tier.description}</p>
              </div>

              <div className="flex items-baseline gap-x-2">
                <span className="text-5xl font-extrabold tracking-tight text-white">
                  {tier.price}
                </span>
                <span className="text-base font-semibold leading-6 text-gray-400">
                  {tier.period}
                </span>
              </div>
              
              <div className="my-8 h-px w-full bg-white/10" />
              
              <ul
                role="list"
                className="flex-1 space-y-4 text-sm leading-6 text-gray-300"
              >
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <Check
                      className="h-6 w-5 flex-none text-emerald-400"
                      aria-hidden="true"
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link
                href="#"
                className={`mt-8 block w-full rounded-full px-4 py-3.5 text-center text-sm font-bold shadow-sm transition-all hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  tier.mostPopular
                    ? "bg-emerald-500 text-white hover:bg-emerald-400 focus-visible:outline-emerald-500"
                    : "bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white"
                }`}
              >
                {tier.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-center gap-4">
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-300">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            🛡 Garantía de satisfacción de 14 días
          </div>
          <div className="flex justify-center gap-6 opacity-40 grayscale">
            <span className="text-sm font-bold text-gray-300">VISA</span>
            <span className="text-sm font-bold text-gray-300">Mastercard</span>
            <span className="text-sm font-bold text-gray-300">SEPA</span>
          </div>
        </div>
      </div>
    </section>
  );
}
