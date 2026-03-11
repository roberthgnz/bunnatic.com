"use client";

import { content } from "@/lib/content";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import { usePathname } from "next/navigation";
import { trackFunnelEvent } from "@/lib/funnelEvents";

export default function Hero() {
  const { language } = useLanguage();
  const t = content[language];
  const pathname = usePathname() ?? "/";
  const locale = pathname.split("/").filter(Boolean)[0];
  const hasLocale = locale === "es" || locale === "ca";
  const targetPath = hasLocale ? `/${locale}/crear-pagina-web-negocio` : "/crear-pagina-web-negocio";

  return (
    <section className="relative overflow-hidden bg-white px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      {/* Background Grid & Gradient */}
      <div className="absolute inset-0 z-0 bg-grid-pattern [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 bg-emerald-400 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex justify-center"
        >
          <span className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white/50 px-4 py-2 sm:px-4 sm:py-1.5 text-[11px] sm:text-sm font-medium text-gray-800 shadow-sm backdrop-blur-sm text-center max-w-full">
            <span className="flex h-1.5 w-1.5 sm:h-2 sm:w-2 shrink-0 rounded-full bg-emerald-500 animate-pulse" />
            <span className="leading-tight">{t.hero.badge.replace("✦ ", "")}</span>
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl font-extrabold tracking-tighter text-gray-900 sm:text-5xl md:text-6xl lg:text-[5.5rem] leading-[1.1]"
        >
          <span className="block">{t.hero.titleLine1}</span>
          <span className="block text-black">{t.hero.titleLine2}</span>
          <span className="block bg-gradient-to-r from-purple-600 via-blue-500 to-emerald-500 bg-clip-text text-transparent pb-2">
            {t.hero.titleLine3}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-8 max-w-2xl text-lg text-gray-600 sm:text-xl leading-relaxed"
        >
          {t.hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-4"
        >
          <Link
            href={targetPath}
            onClick={() => trackFunnelEvent("landing_cta_click", { placement: "hero", locale: language })}
            className="group flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold text-white shadow-[0_0_40px_-10px_rgba(0,0,0,0.3)] transition-all hover:scale-105 hover:bg-gray-800 hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.4)]"
          >
            {t.hero.cta.replace(" →", "")}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <p className="text-sm font-medium text-gray-500">{t.hero.trustText}</p>
        </motion.div>
      </div>
    </section>
  );
}
