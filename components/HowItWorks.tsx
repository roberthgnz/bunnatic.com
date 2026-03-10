"use client";

import { content } from "@/lib/content";
import { motion } from "motion/react";
import { CheckCircle2, Globe, MapPin, MessageCircle, Search } from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import { Card, CardContent } from "@/components/ui/card";

export default function HowItWorks() {
  const { language } = useLanguage();
  const t = content[language];
  const steps = [...t.howItWorks.steps].sort(
    (a, b) => Number(a.number) - Number(b.number),
  );
  const stepAccent = ["bg-emerald-500", "bg-violet-500", "bg-blue-500"];

  const stepCardVariants = {
    rest: {
      transition: {
        staggerChildren: 0.05,
      },
    },
    hover: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const revealText = {
    rest: { opacity: 1, scale: 1 },
    hover: {
      opacity: 1,
      scale: 1.01,
      transition: { duration: 0.25, ease: "easeOut" },
    },
  };

  const subtleEmphasis = {
    rest: { opacity: 1, scale: 1 },
    hover: {
      opacity: 1,
      scale: 1.01,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const searchResultReveal = {
    rest: {
      opacity: 0,
      maxHeight: "0px",
      marginTop: "0px",
    },
    hover: {
      opacity: 1,
      maxHeight: "48px",
      marginTop: "12px",
      transition: { duration: 0.35, ease: "easeOut" },
    },
  };

  const listItemEmphasis = {
    rest: { opacity: 1, scale: 1 },
    hover: (index: number) => ({
      scale: [1, 1.01, 1],
      transition: {
        delay: index * 0.08,
        duration: 0.3,
        ease: "easeOut",
      },
    }),
  };

  const loadingItem = {
    rest: {
      opacity: 0,
      maxHeight: "0px",
      marginTop: "0px",
    },
    hover: {
      opacity: 1,
      maxHeight: "44px",
      marginTop: "16px",
      transition: { duration: 0.35, ease: "easeOut" },
    },
  };

  const chatReveal = {
    rest: {
      opacity: 0,
      maxHeight: "0px",
      marginTop: "0px",
    },
    hover: {
      opacity: 1,
      maxHeight: "130px",
      marginTop: "12px",
      transition: { duration: 0.35, ease: "easeOut" },
    },
  };

  const progressPulse = {
    rest: { scaleX: 0.5, transformOrigin: "left" },
    hover: {
      scaleX: 1,
      transformOrigin: "left",
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const checkBadge = {
    rest: { scale: 1, opacity: 1 },
    hover: {
      scale: [1, 1.05, 1],
      opacity: [1, 0.95, 1],
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section className="relative bg-slate-50 py-24 sm:py-32 overflow-hidden">
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
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.12,
                  ease: "easeOut",
                }}
                className="overflow-hidden rounded-3xl"
              >
                <motion.div
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                  variants={stepCardVariants}
                  className="rounded-3xl"
                >
                  <Card className="flex flex-col rounded-3xl bg-white p-0 shadow-sm ring-1 ring-gray-200 transition-all hover:shadow-md">
                    <CardContent className="p-8">
                      <dt className="flex items-center gap-x-3 text-lg font-bold leading-7 text-gray-900">
                        <span
                          className={`flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-sm ${
                            stepAccent[index] ?? "bg-emerald-500"
                          }`}
                        >
                          {step.number}
                        </span>
                        {step.title}
                      </dt>
                      <dd className="mt-4 flex flex-auto flex-col text-base leading-relaxed text-gray-600">
                        <motion.p
                          variants={revealText}
                          className="flex-auto"
                        >
                          {step.description}
                        </motion.p>

                        <Card className="mt-8 border border-gray-100 bg-gray-50/50 p-6 shadow-inner">
                          {index === 0 && (
                            <motion.div
                              className="space-y-4"
                              variants={stepCardVariants}
                            >
                              <motion.div
                                variants={subtleEmphasis}
                                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500 shadow-sm"
                              >
                                <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                <span>{step.mockup?.input}</span>
                              </motion.div>
                              <motion.div
                                variants={searchResultReveal}
                                className="overflow-hidden"
                              >
                                <motion.div
                                  className="flex items-center gap-2 px-2 text-sm font-medium text-gray-900"
                                  variants={subtleEmphasis}
                                >
                                  <MapPin className="h-4 w-4 text-emerald-500" />
                                  <span>{step.mockup?.result}</span>
                                </motion.div>
                              </motion.div>
                            </motion.div>
                          )}

                          {index === 1 && (
                            <motion.div
                              className="space-y-5"
                              variants={stepCardVariants}
                            >
                              <motion.div
                                variants={revealText}
                                className="flex items-center gap-2 border-b border-gray-200 pb-3 text-sm font-semibold text-gray-900"
                              >
                                <Globe className="h-4 w-4 text-violet-500" />
                                {step.mockup?.title}
                              </motion.div>
                              <ul className="space-y-4 text-sm font-medium text-gray-600">
                                {step.mockup?.items?.map((item, i) => (
                                  i < 2 ? (
                                    <motion.li
                                      key={i}
                                      custom={i}
                                      variants={listItemEmphasis}
                                      className="flex items-center gap-3"
                                    >
                                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                      <span>{item}</span>
                                    </motion.li>
                                  ) : (
                                    <motion.li
                                      key={i}
                                      variants={loadingItem}
                                      className="flex items-center gap-3 overflow-hidden"
                                    >
                                      <motion.div
                                        className="h-4 w-4 ml-0.5 rounded-full border-2 border-gray-300 border-t-violet-500"
                                        variants={{
                                          rest: { rotate: 0 },
                                          hover: {
                                            rotate: [0, 180, 360],
                                            transition: {
                                              duration: 1,
                                              ease: "easeInOut",
                                            },
                                          },
                                        }}
                                      />
                                      <span className="text-gray-400">{item}</span>
                                    </motion.li>
                                  )
                                ))}
                              </ul>
                              <motion.div
                                className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-gray-200"
                                variants={stepCardVariants}
                              >
                                <motion.div
                                  variants={progressPulse}
                                  className="h-full w-full bg-violet-500"
                                />
                              </motion.div>
                            </motion.div>
                          )}

                          {index === 2 && (
                            <motion.div
                              className="space-y-5"
                              variants={stepCardVariants}
                            >
                              <motion.div
                                variants={checkBadge}
                                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                {step.mockup?.tag}
                              </motion.div>
                              <motion.div
                                variants={chatReveal}
                                className="overflow-hidden"
                              >
                                <motion.div
                                  variants={subtleEmphasis}
                                  className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 origin-bottom-left"
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                                      <MessageCircle className="h-5 w-5" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-700 leading-snug">
                                      {step.mockup?.chat}
                                    </p>
                                  </div>
                                </motion.div>
                              </motion.div>
                            </motion.div>
                          )}
                        </Card>
                      </dd>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
