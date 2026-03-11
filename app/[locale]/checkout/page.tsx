"use client";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/LanguageProvider";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { trackFunnelEvent } from "@/lib/funnelEvents";

export default function CheckoutPage() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const pathname = usePathname() ?? "/";
  const plan = searchParams.get("plan") || searchParams.get("planSuggested") || "starter";
  const draftId = searchParams.get("draftId");
  const locale = pathname.split("/").filter(Boolean)[0];
  const hasLocale = locale === "es" || locale === "ca";
  const localePrefix = hasLocale ? `/${locale}` : "";
  const onboardingHref = useMemo(() => {
    const params = new URLSearchParams();
    params.set("plan", plan);
    if (draftId) {
      params.set("draftId", draftId);
    }
    const source = searchParams.get("source");
    if (source) {
      params.set("source", source);
    }
    return `${localePrefix}/onboarding?${params.toString()}`;
  }, [draftId, localePrefix, plan, searchParams]);
  const draftData = useMemo(() => {
    if (!draftId || typeof window === "undefined") {
      return { name: "", sector: "" };
    }
    const raw = window.localStorage.getItem(`draft:${draftId}`);
    if (!raw) {
      return { name: "", sector: "" };
    }
    try {
      const parsed = JSON.parse(raw) as { name?: string; sector?: string };
      return {
        name: parsed.name ?? "",
        sector: parsed.sector ?? "",
      };
    } catch {
      return { name: "", sector: "" };
    }
  }, [draftId]);

  useEffect(() => {
    trackFunnelEvent("checkout_started", {
      locale: language,
      plan,
      has_draft: Boolean(draftId),
    });
  }, [draftId, language, plan]);

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-gray-900">
      <Navbar />
      
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-200">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              {language === "es" ? "Comienza tu prueba gratuita" : "Comença la teva prova gratuïta"}
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              {language === "es" 
                ? "Tienes 14 días gratis. Sin compromiso." 
                : "Tens 14 dies gratis. Sense compromís."}
            </p>
          </div>

          <div className="rounded-2xl bg-emerald-50 p-6 mb-8 border border-emerald-100">
            <h3 className="text-lg font-bold text-emerald-800 mb-2">
              {language === "es" ? "Plan seleccionado:" : "Pla seleccionat:"} {plan.toUpperCase()}
            </h3>
            {draftData.name ? (
              <p className="mb-3 text-sm text-emerald-800">
                {language === "es" ? "Web creada para:" : "Web creada per a:"} {draftData.name}
              </p>
            ) : null}
            <ul className="space-y-2 text-sm text-emerald-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                {language === "es" ? "14 días de prueba gratis" : "14 dies de prova gratis"}
              </li>
              {draftData.sector ? (
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  {language === "es" ? "Sector detectado:" : "Sector detectat:"} {draftData.sector}
                </li>
              ) : null}
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                {language === "es" ? "Cancela cuando quieras" : "Cancel·la quan vulguis"}
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <Button asChild className="w-full rounded-full bg-emerald-600 py-6 text-lg font-bold hover:bg-emerald-500">
              <Link
                href={onboardingHref}
                onClick={() =>
                  trackFunnelEvent("checkout_completed", {
                    locale: language,
                    plan,
                    has_draft: Boolean(draftId),
                  })
                }
              >
                {language === "es" ? "Iniciar prueba de 14 días" : "Iniciar prova de 14 dies"}
              </Link>
            </Button>
            <p className="text-center text-xs text-gray-500">
              {language === "es" 
                ? "Al continuar, aceptas nuestros términos y condiciones." 
                : "En continuar, acceptes els nostres termes i condicions."}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
