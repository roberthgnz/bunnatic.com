"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { Zap, ArrowRight, CheckCircle2, Sparkles, MapPin, MessageSquare, Users, Globe } from "lucide-react";
import { content } from "@/lib/content";
import { useLanguage } from "@/components/LanguageProvider";
import { use } from "react";

const iconMap: Record<string, any> = {
  Sparkles,
  MapPin,
  MessageSquare,
  Users,
  Globe,
};

export default function FeaturePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { language } = useLanguage();
  const t = content[language];
  
  // Find the feature based on slug
  const feature = t.features?.find((f) => f.id === slug);

  if (!feature) {
    notFound();
  }

  const IconComponent = iconMap[feature.icon] || Sparkles;

  return (
    <main className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
              <Zap className="h-5 w-5 fill-emerald-600 text-emerald-600" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">Nova Web</span>
          </Link>
          <Link
            href="/crear"
            className="rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:scale-105 hover:bg-gray-800 hover:shadow-md"
          >
            {t.navbar.cta} →
          </Link>
        </div>
      </nav>

      <section className="relative overflow-hidden bg-slate-50 px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-50" />
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-100 shadow-sm ring-1 ring-emerald-200">
            <IconComponent className="h-10 w-10 text-emerald-600" />
          </div>
          <h1 className="text-5xl font-extrabold tracking-tighter text-gray-900 sm:text-7xl leading-[1.1]">
            {feature.title}
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg text-gray-600 sm:text-xl leading-relaxed">
            {feature.description}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4">
            <Link
              href="/crear"
              className="group flex items-center gap-2 rounded-full bg-emerald-500 px-8 py-4 text-lg font-semibold text-white shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] transition-all hover:scale-105 hover:bg-emerald-400"
            >
              {language === 'es' ? 'Probar esta funcionalidad' : 'Provar aquesta funcionalitat'}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-center mb-16">{language === 'es' ? '¿Qué incluye esta característica?' : 'Què inclou aquesta característica?'}</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {feature.benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-4 p-6 rounded-3xl bg-white shadow-sm ring-1 ring-gray-200">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                </div>
                <p className="text-lg font-medium text-gray-900 pt-1">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
