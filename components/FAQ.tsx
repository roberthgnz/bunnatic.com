"use client";

import { content } from "@/lib/content";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "./LanguageProvider";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { language } = useLanguage();
  const t = content[language];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-[#0a0a0a] py-24 sm:py-32 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl text-center mb-16">
            {t.faq.title}
          </h2>
          <dl className="mt-10 space-y-4">
            {t.faq.questions.map((faq, index) => (
              <div 
                key={index} 
                className="rounded-2xl border border-white/10 bg-white/5 px-6 py-2 backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                <dt>
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="flex w-full items-center justify-between py-4 text-left text-white"
                  >
                    <span className="text-lg font-semibold leading-7">
                      {faq.q}
                    </span>
                    <span className="ml-6 flex h-7 items-center">
                      <motion.div
                        animate={{ rotate: openIndex === index ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </motion.div>
                    </span>
                  </button>
                </dt>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.dd
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 text-base leading-7 text-gray-400">
                        {faq.a}
                      </p>
                    </motion.dd>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
