"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  MessageSquareQuote,
  ShieldCheck,
  Sparkles,
  MapPin,
  MessageSquare,
  Users,
  Globe,
  Zap,
} from "lucide-react";

type Locale = "es" | "ca";

type Step = {
  title: string;
  description: string;
};

type Testimonial = {
  quote: string;
  author: string;
  role: string;
};

type Faq = {
  q: string;
  a: string;
};

type FeatureCopy = {
  badge: string;
  title: string;
  subtitle: string;
  urgencyText: string;
  trustLine: string;
  outcomesTitle: string;
  outcomes: string[];
  processTitle: string;
  process: Step[];
  objectionsTitle: string;
  objections: Faq[];
  proofTitle: string;
  testimonials: Testimonial[];
  planTitle: string;
  planPrice: string;
  planItems: string[];
  finalTitle: string;
  finalSubtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
};

type FeatureLandingProps = {
  slug: string;
  icon: "Sparkles" | "MapPin" | "MessageSquare" | "Users" | "Globe";
  copy: Record<Locale, FeatureCopy>;
};

const iconMap = {
  Sparkles,
  MapPin,
  MessageSquare,
  Users,
  Globe,
};

export default function FeatureLanding({ slug, icon, copy }: FeatureLandingProps) {
  const { language } = useLanguage();
  const locale: Locale = language === "ca" ? "ca" : "es";
  const t = copy[locale];
  const IconComponent = iconMap[icon] ?? Sparkles;
  const signupHref = `/signup?source=feature-${slug}`;
  const planHref = `/signup?plan=pro&source=feature-${slug}`;

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
              <Zap className="h-5 w-5 fill-emerald-600 text-emerald-600" />
            </div>
            <span className="text-xl font-bold tracking-tight">Nova Web</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/crear"
              className="hidden rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 sm:inline-flex"
            >
              {t.ctaSecondary}
            </Link>
            <Link
              href={signupHref}
              className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition-all hover:scale-105 hover:bg-gray-800"
            >
              {t.ctaPrimary}
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pt-24">
        <div className="absolute inset-0 bg-grid-pattern opacity-60" />
        <div className="absolute right-0 top-0 h-72 w-72 -translate-y-16 translate-x-16 rounded-full bg-emerald-200/50 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-100">
              <Clock3 className="h-4 w-4" />
              {t.badge}
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              {t.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600">{t.subtitle}</p>
            <p className="mt-4 text-sm font-semibold text-gray-500">{t.urgencyText}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={signupHref}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-base font-bold text-white shadow-[0_10px_35px_-15px_rgba(16,185,129,0.7)] transition-all hover:scale-105 hover:bg-emerald-400"
              >
                {t.ctaPrimary}
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href={planHref}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 px-6 py-3 text-base font-bold text-gray-900 transition-colors hover:bg-gray-50"
              >
                {locale === "es" ? "Ver plan recomendado" : "Veure pla recomanat"}
              </Link>
            </div>

            <p className="mt-5 text-sm font-medium text-gray-500">{t.trustLine}</p>
          </div>

          <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-xl shadow-emerald-100/50">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">
              <IconComponent className="h-7 w-7 text-emerald-600" />
            </div>
            <h2 className="text-xl font-extrabold">{t.outcomesTitle}</h2>
            <ul className="mt-5 space-y-4">
              {t.outcomes.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                  <span className="text-sm font-medium text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold">{t.processTitle}</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {t.process.map((step, index) => (
              <article key={step.title} className="rounded-3xl bg-white p-6 ring-1 ring-gray-200">
                <p className="text-sm font-bold text-emerald-600">0{index + 1}</p>
                <h3 className="mt-3 text-xl font-bold">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-2 lg:px-8">
          <div className="rounded-3xl bg-[#0a0a0a] p-8 text-white">
            <h2 className="text-2xl font-extrabold">{t.objectionsTitle}</h2>
            <div className="mt-6 space-y-5">
              {t.objections.map((item) => (
                <article key={item.q} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="font-bold">{item.q}</p>
                  <p className="mt-2 text-sm text-gray-300">{item.a}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-extrabold">{t.proofTitle}</h2>
              <div className="mt-6 space-y-4">
                {t.testimonials.map((item) => (
                  <article key={item.author} className="rounded-2xl bg-slate-50 p-5">
                    <MessageSquareQuote className="h-5 w-5 text-emerald-600" />
                    <p className="mt-3 text-sm leading-relaxed text-gray-700">{item.quote}</p>
                    <p className="mt-3 text-sm font-bold text-gray-900">{item.author}</p>
                    <p className="text-xs font-medium text-gray-500">{item.role}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
              <h3 className="text-xl font-extrabold text-gray-900">{t.planTitle}</h3>
              <p className="mt-1 text-4xl font-extrabold text-gray-900">{t.planPrice}</p>
              <ul className="mt-5 space-y-3">
                {t.planItems.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm font-medium text-gray-700">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href={planHref}
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-gray-900 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-800"
              >
                {locale === "es" ? "Crear cuenta y empezar" : "Crear compte i començar"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 bg-slate-50 py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{t.finalTitle}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">{t.finalSubtitle}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={signupHref}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-base font-bold text-white transition-all hover:scale-105 hover:bg-emerald-400"
            >
              {t.ctaPrimary}
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/crear"
              className="inline-flex items-center justify-center rounded-full border border-gray-300 px-6 py-3 text-base font-bold text-gray-900 transition-colors hover:bg-white"
            >
              {t.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
