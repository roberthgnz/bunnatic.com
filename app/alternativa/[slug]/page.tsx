"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { Zap, ArrowRight, XCircle, CheckCircle2 } from "lucide-react";
import { content } from "@/lib/content";
import { useLanguage } from "@/components/LanguageProvider";
import { use } from "react";

export default function AlternativaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { language } = useLanguage();
  const t = content[language];
  
  // Find the competitor based on slug
  const competitor = t.competitors?.find((c) => c.id === slug);

  if (!competitor) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
              <Zap className="h-5 w-5 fill-emerald-600 text-emerald-600" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">{t.navbar.logo}</span>
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:scale-105 hover:bg-gray-800 hover:shadow-md"
          >
            {t.navbar.cta} →
          </Link>
        </div>
      </nav>

      <section className="relative overflow-hidden bg-slate-50 px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-50" />
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tighter text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1]">
            {language === 'es' ? 'La mejor alternativa a' : 'La millor alternativa a'} <span className="text-emerald-600">{competitor.name}</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg text-gray-600 sm:text-xl leading-relaxed">
            {competitor.description}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4">
            <Link
              href="/signup"
              className="group flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold text-white shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] transition-all hover:scale-105 hover:bg-emerald-400"
            >
              {t.hero.cta.replace(" →", "")}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-center mb-16">
            Nova Web vs {competitor.name}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Competitor Card */}
            <div className="rounded-3xl bg-gray-50 p-8 ring-1 ring-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-200">
                {competitor.comparison.competitor.title}
              </h3>
              <ul className="space-y-6">
                {competitor.comparison.competitor.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <XCircle className="h-6 w-6 text-red-500 shrink-0" />
                    <span className="text-gray-600 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Nova Web Card */}
            <div className="rounded-3xl bg-emerald-50 p-8 ring-1 ring-emerald-200 shadow-lg relative">
              <div className="absolute -top-4 right-8 bg-emerald-500 text-white text-sm font-bold px-4 py-1 rounded-full shadow-sm">
                {language === 'es' ? 'Recomendado' : 'Recomanat'}
              </div>
              <h3 className="text-2xl font-bold text-emerald-900 mb-8 pb-4 border-b border-emerald-200">
                {competitor.comparison.novaweb.title}
              </h3>
              <ul className="space-y-6">
                {competitor.comparison.novaweb.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
                    <span className="text-emerald-900 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
