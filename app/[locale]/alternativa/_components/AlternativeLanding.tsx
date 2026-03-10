"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import Footer from "@/components/Footer";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  MessageSquareQuote,
  ShieldCheck,
  XCircle,
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

type AlternativeCopy = {
  badge: string;
  title: string;
  subtitle: string;
  urgencyText: string;
  ctaPrimary: string;
  ctaSecondary: string;
  trustLine: string;
  competitorCardTitle: string;
  competitorItems: string[];
  novaCardTitle: string;
  novaItems: string[];
  switchTitle: string;
  switchSteps: Step[];
  proofTitle: string;
  testimonials: Testimonial[];
  planTitle: string;
  planPrice: string;
  planItems: string[];
  finalTitle: string;
  finalSubtitle: string;
};

type AlternativeLandingProps = {
  slug: string;
  copy: Record<Locale, AlternativeCopy>;
};

export default function AlternativeLanding({ slug, copy }: AlternativeLandingProps) {
  const { language } = useLanguage();
  const locale: Locale = language === "ca" ? "ca" : "es";
  const t = copy[locale];
  const signupHref = `/signup?source=alternative-${slug}`;
  const planHref = `/signup?plan=pro&source=alternative-${slug}`;

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 sm:h-8 sm:w-8">
              <Zap className="h-4 w-4 fill-emerald-600 text-emerald-600 sm:h-5 sm:w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight sm:text-xl">Wibloz</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/crear"
              className="hidden rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 sm:inline-flex"
            >
              {t.ctaSecondary}
            </Link>
            <Link
              href={signupHref}
              className="inline-flex items-center gap-1.5 rounded-full bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-gray-800 sm:gap-2 sm:px-4 sm:py-2 sm:text-sm sm:hover:scale-105"
            >
              {t.ctaPrimary}
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden px-4 pb-14 pt-10 sm:px-6 sm:pb-16 sm:pt-16 lg:px-8 lg:pb-20 lg:pt-24">
        <div className="absolute inset-0 bg-grid-pattern opacity-60" />
        <div className="absolute left-0 top-0 h-52 w-52 -translate-x-12 -translate-y-12 rounded-full bg-emerald-200/50 blur-3xl sm:h-72 sm:w-72 sm:-translate-x-16 sm:-translate-y-16" />
        <div className="relative mx-auto max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100 sm:px-4 sm:py-2 sm:text-sm">
            <Clock3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            {t.badge}
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:mt-6 sm:text-5xl lg:text-6xl">{t.title}</h1>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-gray-600 sm:mt-6 sm:text-lg">{t.subtitle}</p>
          <p className="mt-3 text-xs font-semibold text-gray-500 sm:mt-4 sm:text-sm">{t.urgencyText}</p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link
              href={signupHref}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-[0_10px_35px_-15px_rgba(16,185,129,0.7)] transition-all hover:bg-emerald-400 sm:w-auto sm:text-base sm:hover:scale-105"
            >
              {t.ctaPrimary}
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
            <Link
              href="/crear"
              className="inline-flex w-full items-center justify-center rounded-full border border-gray-300 px-6 py-3 text-sm font-bold text-gray-900 transition-colors hover:bg-gray-50 sm:w-auto sm:text-base"
            >
              {locale === "es" ? "Probar demo ahora" : "Provar demo"}
            </Link>
          </div>
          <p className="mt-4 text-xs font-medium text-gray-500 sm:mt-5 sm:text-sm">{t.trustLine}</p>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:gap-8 md:grid-cols-2">
            <article className="rounded-3xl bg-gray-50 p-5 ring-1 ring-gray-200 sm:p-8">
              <h2 className="text-xl font-extrabold text-gray-900 sm:text-2xl">{t.competitorCardTitle}</h2>
              <ul className="mt-5 space-y-3 sm:mt-6 sm:space-y-4">
                {t.competitorItems.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                    <span className="text-sm font-medium text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </article>
            <article className="relative rounded-3xl bg-emerald-50 p-5 ring-1 ring-emerald-200 shadow-sm sm:p-8">
              <span className="absolute -top-3 right-5 rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-bold text-white sm:right-6 sm:text-xs">
                {locale === "es" ? "Recomendado" : "Recomanat"}
              </span>
              <h2 className="text-xl font-extrabold text-emerald-900 sm:text-2xl">{t.novaCardTitle}</h2>
              <ul className="mt-5 space-y-3 sm:mt-6 sm:space-y-4">
                {t.novaItems.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-900">{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold sm:text-3xl">{t.switchTitle}</h2>
          <div className="mt-6 grid gap-4 sm:mt-10 sm:gap-6 md:grid-cols-3">
            {t.switchSteps.map((step, index) => (
              <article key={step.title} className="rounded-3xl bg-white p-5 ring-1 ring-gray-200 sm:p-6">
                <p className="text-xs font-bold text-emerald-600 sm:text-sm">0{index + 1}</p>
                <h3 className="mt-2 text-lg font-bold sm:mt-3 sm:text-xl">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600 sm:mt-3">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:gap-8 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
            <h2 className="text-xl font-extrabold sm:text-2xl">{t.proofTitle}</h2>
            <div className="mt-6 space-y-4">
              {t.testimonials.map((item) => (
                <article key={item.author} className="rounded-2xl bg-slate-50 p-4 sm:p-5">
                  <MessageSquareQuote className="h-5 w-5 text-emerald-600" />
                  <p className="mt-3 text-sm leading-relaxed text-gray-700">{item.quote}</p>
                  <p className="mt-3 text-sm font-bold text-gray-900">{item.author}</p>
                  <p className="text-xs font-medium text-gray-500">{item.role}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 sm:p-8">
            <h3 className="text-lg font-extrabold text-gray-900 sm:text-xl">{t.planTitle}</h3>
            <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl">{t.planPrice}</p>
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
      </section>

      <section className="border-t border-gray-100 bg-slate-50 py-14 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-4xl">{t.finalTitle}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-gray-600 sm:mt-4 sm:text-lg">{t.finalSubtitle}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={signupHref}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-emerald-400 sm:w-auto sm:text-base sm:hover:scale-105"
            >
              {t.ctaPrimary}
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
            <Link
              href="/crear"
              className="inline-flex w-full items-center justify-center rounded-full border border-gray-300 px-6 py-3 text-sm font-bold text-gray-900 transition-colors hover:bg-white sm:w-auto sm:text-base"
            >
              {t.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
