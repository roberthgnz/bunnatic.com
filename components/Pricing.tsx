"use client";

import { content } from "@/lib/content";
import { Check, CircleHelp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "./LanguageProvider";

export default function Pricing() {
  const { language } = useLanguage();
  const t = content[language];
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section className="bg-[#f4f7fc] py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-800 sm:text-5xl">
            {t.pricing.title}
          </h2>
          <p className="mt-4 text-xl text-slate-600">{t.pricing.subtitle}</p>

          <button
            type="button"
            onClick={() => setIsAnnual((prev) => !prev)}
            className="mt-8 inline-flex items-center gap-3 text-base font-medium text-slate-700"
            aria-pressed={isAnnual}
          >
            <span
              className={`inline-flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors ${
                isAnnual ? "bg-indigo-600" : "bg-slate-200"
              }`}
            >
              <span
                className={`h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                  isAnnual ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </span>
            <span>
              {t.pricing.billingLabel},{" "}
              <span className="text-indigo-600">{t.pricing.saveLabel}</span>
            </span>
          </button>
        </div>

        <div className="mt-14 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="grid grid-cols-1 divide-y divide-slate-200 xl:grid-cols-4 xl:divide-x xl:divide-y-0">
            {t.pricing.tiers.map((tier) => (
              <article key={tier.id} className="flex h-full flex-col">
                <div className="flex h-full flex-col p-6 sm:p-8">
                  <div>
                    <h3 className="text-3xl font-extrabold text-slate-800">{tier.name}</h3>
                    <p className="mt-3 max-w-xs text-lg text-slate-600">{tier.description}</p>
                  </div>

                  <div className="mt-8">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-extrabold tracking-tight text-slate-800">
                        {isAnnual ? tier.priceYearly : tier.priceMonthly}
                      </span>
                      <span className="text-2xl font-semibold text-slate-500">{tier.period}</span>
                    </div>
                    <div className="mt-2 min-h-[44px] text-sm text-slate-500">
                      {isAnnual ? (
                        <div className="space-y-1">
                          <p>
                            {t.pricing.previousPriceLabel}:{" "}
                            <span className="line-through">{tier.priceMonthly}{tier.period}</span>
                          </p>
                          <p>
                            {t.pricing.billedAnnuallyLabel}:{" "}
                            <span className="font-semibold text-slate-700">{tier.annualTotal}</span>
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Link
                      href="#"
                      className="rounded-full bg-indigo-600 px-5 py-2.5 text-base font-semibold text-white transition-colors hover:bg-indigo-500"
                    >
                      {tier.cta}
                    </Link>
                    {tier.secondaryCta && (
                      <Link href="#" className="text-base font-semibold text-slate-500 hover:text-slate-700">
                        {tier.secondaryCta}
                      </Link>
                    )}
                  </div>

                  <ul className="mt-10 space-y-5">
                    {tier.features.map((feature) => (
                      <li key={feature.title} className="flex items-start gap-3">
                        <Check className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />
                        <div className="space-y-1">
                          <p className="text-2xl font-extrabold text-slate-900">{feature.title}</p>
                          <p className="text-base text-slate-500">{feature.detail}</p>
                        </div>
                        <CircleHelp className="ml-auto mt-1 h-4 w-4 shrink-0 text-slate-300" />
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto border-t border-slate-200 bg-slate-50 p-6 sm:p-8">
                  <h4 className="text-lg font-bold text-slate-700">{t.pricing.addonsTitle}</h4>
                  <ul className="mt-3 space-y-2">
                    {tier.addons.map((item) => (
                      <li key={item} className="flex items-center text-2xl text-slate-600">
                        <span>{item}</span>
                        <CircleHelp className="ml-auto h-4 w-4 text-slate-300" />
                      </li>
                    ))}
                  </ul>

                  <h4 className="mt-7 text-lg font-bold text-slate-700">{t.pricing.includesTitle}</h4>
                  <ul className="mt-3 space-y-2">
                    {tier.includes.map((item) => (
                      <li key={item} className="flex items-center text-2xl text-slate-600">
                        <span>{item}</span>
                        <CircleHelp className="ml-auto h-4 w-4 text-slate-300" />
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
