"use client";

import { content } from "@/lib/content";
import { motion } from "motion/react";
import Link from "next/link";
import { useLanguage } from "./LanguageProvider";

const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[🍽🍕💆🌿🏋🐾🦷📸🏠⚖]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

export default function Ticker() {
  const { language } = useLanguage();
  const t = content[language];

  return (
    <section className="overflow-hidden bg-[#0a0a0a] py-16 text-white border-y border-white/5">
      <div className="relative flex w-full flex-col items-center justify-center">
        {/* Gradient Masks for smooth fade out on edges */}
        <div className="absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent pointer-events-none" />

        <div className="flex w-full overflow-hidden whitespace-nowrap group">
          <motion.div
            className="flex items-center gap-12 px-4 text-xl font-semibold text-gray-400 sm:text-2xl group-hover:[animation-play-state:paused]"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 30,
            }}
          >
            {/* Duplicate the array to create a seamless loop */}
            {[...t.ticker.businesses, ...t.ticker.businesses].map(
              (business, index) => (
                <Link 
                  key={index} 
                  href={`/negocio/${slugify(business)}`}
                  className="flex-shrink-0 hover:text-white transition-colors"
                >
                  {business}
                </Link>
              )
            )}
          </motion.div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 text-center px-4">
          <p className="text-sm font-medium text-gray-400 tracking-wide uppercase">{t.ticker.text1}</p>
          <p className="max-w-4xl text-xs text-gray-600 font-medium leading-relaxed">
            {t.ticker.text2}
          </p>
        </div>
      </div>
    </section>
  );
}
