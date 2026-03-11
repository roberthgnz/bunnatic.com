"use client";

import { content } from "@/lib/content";
import { motion, useInView } from "motion/react";
import { CheckCircle2, Globe, MapPin, MessageCircle, Search } from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import { Card, CardContent } from "@/components/ui/card";
import { useRef } from "react";

export default function HowItWorks() {
  const { language } = useLanguage();
  const t = content[language];
  const steps = [...t.howItWorks.steps].sort(
    (a, b) => Number(a.number) - Number(b.number),
  );
  const stepAccent = ["bg-emerald-500", "bg-violet-500", "bg-blue-500"];
  const easeOut = [0.16, 1, 0.3, 1] as const;
  const easeInOut = [0.4, 0, 0.2, 1] as const;

  const step1Ref = useRef(null);
  const step2Ref = useRef(null);
  const step3Ref = useRef(null);
  const isStep1InView = useInView(step1Ref, { once: false, amount: 0.5 });
  const isStep2InView = useInView(step2Ref, { once: false, amount: 0.5 });
  const isStep3InView = useInView(step3Ref, { once: false, amount: 0.5 });

  const stepCardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: easeOut,
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const revealText = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: easeOut },
    },
  };

  const subtleEmphasis = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: easeOut },
    },
  };

  const searchResultReveal = {
    hidden: {
      opacity: 0,
      maxHeight: "0px",
      marginTop: "0px",
    },
    visible: {
      opacity: 1,
      maxHeight: "48px",
      marginTop: "12px",
      transition: { duration: 0.5, ease: easeOut, delay: 0.6 },
    },
  };

  const listItemEmphasis = {
    hidden: { opacity: 0, x: -10 },
    visible: (index: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: index * 0.15,
        duration: 0.4,
        ease: easeOut,
      },
    }),
  };

  const loadingItem = {
    hidden: {
      opacity: 0,
      maxHeight: "0px",
      marginTop: "0px",
    },
    visible: {
      opacity: 1,
      maxHeight: "44px",
      marginTop: "16px",
      transition: { duration: 0.5, ease: easeOut, delay: 0.5 },
    },
  };

  const chatReveal = {
    hidden: {
      opacity: 0,
      maxHeight: "0px",
      marginTop: "0px",
    },
    visible: {
      opacity: 1,
      maxHeight: "130px",
      marginTop: "12px",
      transition: { duration: 0.6, ease: easeOut, delay: 0.4 },
    },
  };

  const progressPulse = {
    hidden: { scaleX: 0, transformOrigin: "left" },
    visible: {
      scaleX: 1,
      transformOrigin: "left",
      transition: { duration: 1.2, ease: easeOut, delay: 0.8 },
    },
  };

  const checkBadge = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { 
        duration: 0.5, 
        ease: [0.34, 1.56, 0.64, 1],
        delay: 0.2,
      },
    },
  };

  const spinnerRotate = {
    hidden: { rotate: 0 },
    visible: {
      rotate: 360,
      transition: {
        duration: 1.5,
        ease: "linear",
        repeat: Infinity,
      },
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
            {steps.map((step, index) => {
              const stepRef = index === 0 ? step1Ref : index === 1 ? step2Ref : step3Ref;
              const isInView = index === 0 ? isStep1InView : index === 1 ? isStep2InView : isStep3InView;
              
              return (
                <motion.div
                  key={step.title}
                  ref={stepRef}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.15,
                    ease: easeOut,
                  }}
                  className="overflow-hidden rounded-3xl"
                >
                  <motion.div
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={stepCardVariants}
                    className="rounded-3xl"
                  >
                    <Card className="flex flex-col rounded-3xl bg-white p-0 shadow-sm ring-1 ring-gray-200 transition-shadow hover:shadow-lg">
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
                                          variants={spinnerRotate}
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
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}
