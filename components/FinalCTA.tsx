"use client";

import { content } from "@/lib/content";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import { usePathname } from "next/navigation";
import { trackFunnelEvent } from "@/lib/funnelEvents";

export default function FinalCTA() {
  const { language } = useLanguage();
  const t = content[language];
  const pathname = usePathname() ?? "/";
  const locale = pathname.split("/").filter(Boolean)[0];
  const hasLocale = locale === "es" || locale === "ca";
  const targetPath = hasLocale ? `/${locale}/crear-pagina-web-negocio` : "/crear-pagina-web-negocio";

  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] py-24 sm:py-32">
      <div className="absolute inset-0 bg-grid-pattern-dark opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-20 bg-purple-500 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl"
          >
            {t.finalCta.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-2xl font-bold leading-8 bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent sm:text-3xl"
          >
            {t.finalCta.subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 flex flex-col items-center justify-center gap-6"
          >
            <Link
              href={targetPath}
              onClick={() => trackFunnelEvent("landing_cta_click", { placement: "final_cta", locale: language })}
              className="group flex items-center gap-2 rounded-full bg-emerald-500 px-8 py-4 text-lg font-bold text-white shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] transition-all hover:scale-105 hover:bg-emerald-400"
            >
              {t.finalCta.cta.replace(" →", "")}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <p className="text-sm font-medium text-gray-400">{t.finalCta.trustText}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
