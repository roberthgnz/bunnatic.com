"use client";

import { content } from "@/lib/content";
import { motion } from "motion/react";
import { Search, MapPin, CheckCircle2, Globe, MessageCircle } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

export default function HowItWorks() {
  const { language } = useLanguage();
  const t = content[language];

  return (
    <section className="bg-slate-50 py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-50" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            {t.howItWorks.title}
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            {t.howItWorks.subtitle}
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
            {t.howItWorks.steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="flex flex-col rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-200 transition-shadow hover:shadow-md"
              >
                <dt className="flex items-center gap-x-3 text-lg font-bold leading-7 text-gray-900">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm ${
                      index === 1 ? "bg-purple-600" : "bg-emerald-500"
                    }`}
                  >
                    {step.number}
                  </span>
                  {step.title}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-relaxed text-gray-600">
                  <p className="flex-auto">{step.description}</p>
                  
                  {/* Mockup Card */}
                  <div className="mt-8 rounded-2xl border border-gray-100 bg-gray-50/50 p-6 shadow-inner">
                    {index === 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500 shadow-sm">
                          <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          <motion.div
                            animate={{ width: ["0%", "100%", "100%", "0%"] }}
                            transition={{ duration: 5, repeat: Infinity, times: [0, 0.2, 0.8, 1] }}
                            className="overflow-hidden whitespace-nowrap border-r-2 border-emerald-500 pr-1"
                          >
                            {step.mockup?.input}
                          </motion.div>
                        </div>
                        <motion.div
                          animate={{ opacity: [0, 0, 1, 1, 0], y: [10, 10, 0, 0, 10] }}
                          transition={{ duration: 5, repeat: Infinity, times: [0, 0.2, 0.3, 0.8, 1] }}
                          className="flex items-center gap-2 px-2 text-sm font-medium text-gray-900"
                        >
                          <MapPin className="h-4 w-4 text-emerald-500" />
                          {step.mockup?.result}
                        </motion.div>
                        <motion.button
                          animate={{ scale: [1, 1, 0.95, 1, 1] }}
                          transition={{ duration: 5, repeat: Infinity, times: [0, 0.4, 0.45, 0.5, 1] }}
                          className="w-full rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-600"
                        >
                          {step.mockup?.button}
                        </motion.button>
                      </div>
                    )}

                    {index === 1 && (
                      <div className="space-y-5">
                        <div className="flex items-center gap-2 border-b border-gray-200 pb-3 text-sm font-semibold text-gray-900">
                          <Globe className="h-4 w-4 text-purple-500" />
                          {step.mockup?.title}
                        </div>
                        <ul className="space-y-4 text-sm font-medium text-gray-600">
                          {step.mockup?.items?.map((item, i) => (
                            <motion.li
                              key={i}
                              animate={{ opacity: i === 0 ? [0.3, 1, 1, 0.3] : i === 1 ? [0.3, 0.3, 1, 1, 0.3] : [0.3, 0.3, 1, 1, 0.3] }}
                              transition={{ duration: 5, repeat: Infinity, times: i === 0 ? [0, 0.2, 0.8, 1] : i === 1 ? [0, 0.2, 0.4, 0.8, 1] : [0, 0.4, 0.6, 0.8, 1] }}
                              className="flex items-center gap-3"
                            >
                              {i < 2 ? (
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                              ) : (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  className="h-4 w-4 ml-0.5 rounded-full border-2 border-gray-300 border-t-purple-600"
                                />
                              )}
                              <span className={i === 2 ? "text-gray-400" : ""}>{item}</span>
                            </motion.li>
                          ))}
                        </ul>
                        {/* Progress Bar */}
                        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                          <motion.div
                            className="h-full bg-purple-500"
                            animate={{ width: ["0%", "100%", "100%", "0%"] }}
                            transition={{ duration: 5, repeat: Infinity, times: [0, 0.6, 0.8, 1], ease: "easeInOut" }}
                          />
                        </div>
                      </div>
                    )}

                    {index === 2 && (
                      <div className="space-y-5">
                        <motion.div
                          animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.8] }}
                          transition={{ duration: 5, repeat: Infinity, times: [0, 0.15, 0.8, 1] }}
                          className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {step.mockup?.tag}
                        </motion.div>
                        <motion.div
                          animate={{ opacity: [0, 0, 1, 1, 0], y: [20, 20, 0, 0, 20], scale: [0.9, 0.9, 1, 1, 0.9] }}
                          transition={{ duration: 5, repeat: Infinity, times: [0, 0.2, 0.35, 0.8, 1] }}
                          className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 origin-bottom-left"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                              <MessageCircle className="h-5 w-5" />
                            </div>
                            <p className="text-sm font-medium text-gray-700 leading-snug">{step.mockup?.chat}</p>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </div>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
