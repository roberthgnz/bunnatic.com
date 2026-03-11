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
  const easeOut = [0.16, 1, 0.3, 1] as const;
  const easeInOut = [0.4, 0, 0.2, 1] as const;

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
      transition: { duration: 0.25, ease: easeOut },
    },
  };

  const subtleEmphasis = {
    rest: { opacity: 1, scale: 1 },
    hover: {
      opacity: 1,
      scale: 1.01,
      transition: { duration: 0.3, ease: easeOut },
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
      transition: { duration: 0.35, ease: easeOut },
    },
  };

  const listItemEmphasis = {
    rest: { opacity: 1, scale: 1 },
    hover: (index: number) => ({
      scale: [1, 1.01, 1],
      transition: {
        delay: index * 0.08,
        duration: 0.3,
        ease: easeOut,
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
      transition: { duration: 0.35, ease: easeOut },
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
      transition: { duration: 0.35, ease: easeOut },
    },
  };

  const progressPulse = {
    rest: { scaleX: 0.5, transformOrigin: "left" },
    hover: {
      scaleX: 1,
      transformOrigin: "left",
      transition: { duration: 0.5, ease: easeOut },
    },
  };

  const checkBadge = {
    rest: { scale: 1, opacity: 1 },
    hover: {
      scale: [1, 1.05, 1],
      opacity: [1, 0.95, 1],
      transition: { duration: 0.5, ease: easeOut },
    },
  };

  return (
    <section className="relative overflow-hidden bg-slate-50 py-16 sm:py-24 lg:py-32">
      <div className="absolute inset-0 bg-grid-pattern opacity-50" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            {t.howItWorks.title}
          </h2>
          <p className="mt-3 text-base leading-7 text-gray-600 sm:mt-4 sm:text-lg sm:leading-8">
            {t.howItWorks.subtitle}
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-2xl sm:mt-14 lg:mt-20 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-4 sm:gap-6 lg:max-w-none lg:grid-cols-3 lg:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.12,
                  ease: easeOut,
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
                    <CardContent className="p-5 sm:p-7 lg:p-8">
                      <dt className="flex items-center gap-x-2.5 text-base font-bold leading-7 text-gray-900 sm:gap-x-3 sm:text-lg">
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm text-white shadow-sm sm:h-10 sm:w-10 sm:text-base ${
                            stepAccent[index] ?? "bg-emerald-500"
                          }`}
                        >
                          {step.number}
                        </span>
                        {step.title}
                      </dt>
                      <dd className="mt-3 flex flex-auto flex-col text-sm leading-relaxed text-gray-600 sm:mt-4 sm:text-base">
                        <motion.p
                          variants={revealText}
                          className="flex-auto"
                        >
                          {step.description}
                        </motion.p>

                        <Card className="mt-5 border border-gray-100 bg-gray-50/50 p-4 shadow-inner sm:mt-7 sm:p-5 lg:mt-8 lg:p-6">
                          {index === 0 && (
                            <motion.div
                              className="space-y-3 sm:space-y-4"
                              variants={stepCardVariants}
                            >
                              <motion.div
                                variants={subtleEmphasis}
                                className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-xs text-gray-500 shadow-sm sm:px-4 sm:py-3 sm:text-sm"
                              >
                                <Search className="h-3.5 w-3.5 text-gray-400 flex-shrink-0 sm:h-4 sm:w-4" />
                                <span>{step.mockup?.input}</span>
                              </motion.div>
                              <motion.div
                                variants={searchResultReveal}
                                className="overflow-hidden"
                              >
                                <motion.div
                                  className="flex items-center gap-2 px-1.5 text-xs font-medium text-gray-900 sm:px-2 sm:text-sm"
                                  variants={subtleEmphasis}
                                >
                                  <MapPin className="h-3.5 w-3.5 text-emerald-500 sm:h-4 sm:w-4" />
                                  <span>{step.mockup?.result}</span>
                                </motion.div>
                              </motion.div>
                            </motion.div>
                          )}

                          {index === 1 && (
                            <motion.div
                              className="space-y-4 sm:space-y-5"
                              variants={stepCardVariants}
                            >
                              <motion.div
                                variants={revealText}
                                className="flex items-center gap-2 border-b border-gray-200 pb-2.5 text-xs font-semibold text-gray-900 sm:pb-3 sm:text-sm"
                              >
                                <Globe className="h-3.5 w-3.5 text-violet-500 sm:h-4 sm:w-4" />
                                {step.mockup?.title}
                              </motion.div>
                              <ul className="space-y-3 text-xs font-medium text-gray-600 sm:space-y-4 sm:text-sm">
                                {step.mockup?.items?.map((item, i) => (
                                  i < 2 ? (
                                    <motion.li
                                      key={i}
                                      custom={i}
                                      variants={listItemEmphasis}
                                      className="flex items-center gap-3"
                                    >
                                      <CheckCircle2 className="h-4 w-4 text-emerald-500 sm:h-5 sm:w-5" />
                                      <span>{item}</span>
                                    </motion.li>
                                  ) : (
                                    <motion.li
                                      key={i}
                                      variants={loadingItem}
                                      className="flex items-center gap-3 overflow-hidden"
                                    >
                                      <motion.div
                                        className="ml-0.5 h-3.5 w-3.5 rounded-full border-2 border-gray-300 border-t-violet-500 sm:h-4 sm:w-4"
                                        variants={{
                                          rest: { rotate: 0 },
                                          hover: {
                                            rotate: [0, 180, 360],
                                            transition: {
                                              duration: 1,
                                              ease: easeInOut,
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
                              className="space-y-4 sm:space-y-5"
                              variants={stepCardVariants}
                            >
                              <motion.div
                                variants={checkBadge}
                                className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-700 sm:text-xs"
                              >
                                <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                {step.mockup?.tag}
                              </motion.div>
                              <motion.div
                                variants={chatReveal}
                                className="overflow-hidden"
                              >
                                <motion.div
                                  variants={subtleEmphasis}
                                  className="origin-bottom-left rounded-xl bg-white p-3 shadow-sm ring-1 ring-gray-100 sm:p-4"
                                >
                                  <div className="flex items-start gap-2.5 sm:gap-3">
                                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 ring-1 ring-blue-100 sm:h-10 sm:w-10">
                                      <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                                    </div>
                                    <p className="text-xs font-medium leading-snug text-gray-700 sm:text-sm">
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
