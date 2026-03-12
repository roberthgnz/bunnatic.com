"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/LanguageProvider";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Suspense, useEffect, useMemo, useSyncExternalStore } from "react";
import { trackFunnelEvent } from "@/lib/funnelEvents";
import { getLegalSlug } from "@/lib/pageSlugs";

const EMPTY_DRAFT_SNAPSHOT = "";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const pathname = usePathname() ?? "/";
  const plan = searchParams.get("plan") || searchParams.get("planSuggested") || "starter";
  const draftId = searchParams.get("draftId");
  const publishIntent = searchParams.get("publishIntent");
  const tempGenerationKey = searchParams.get("tempGenerationKey");
  const locale = pathname.split("/").filter(Boolean)[0];
  const hasLocale = locale === "es" || locale === "ca";
  const localePrefix = hasLocale ? `/${locale}` : "";
  
  const legalLinks = useMemo(() => {
    const lang = language === "ca" ? "ca" : "es";
    return {
      terms: `/${getLegalSlug("aviso-legal", lang)}`,
      privacy: `/${getLegalSlug("politica-privacidad", lang)}`,
    };
  }, [language]);
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
    if (publishIntent) {
      params.set("publishIntent", publishIntent);
    }
    if (tempGenerationKey) {
      params.set("tempGenerationKey", tempGenerationKey);
    }
    return `${localePrefix}/onboarding?${params.toString()}`;
  }, [draftId, localePrefix, plan, publishIntent, searchParams, tempGenerationKey]);
  const draftSnapshot = useSyncExternalStore(
    (callback) => {
      if (typeof window === "undefined") return () => {};
      window.addEventListener("storage", callback);
      return () => window.removeEventListener("storage", callback);
    },
    () => {
      if (!draftId || typeof window === "undefined") return EMPTY_DRAFT_SNAPSHOT;
      return window.localStorage.getItem(`draft:${draftId}`) ?? EMPTY_DRAFT_SNAPSHOT;
    },
    () => EMPTY_DRAFT_SNAPSHOT
  );
  const draftData = useMemo(() => {
    if (!draftSnapshot) return { name: "", sector: "" };
    try {
      const parsed = JSON.parse(draftSnapshot) as { name?: string; sector?: string };
      return {
        name: parsed.name ?? "",
        sector: parsed.sector ?? "",
      };
    } catch {
      return { name: "", sector: "" };
    }
  }, [draftSnapshot]);

  useEffect(() => {
    trackFunnelEvent("checkout_started", {
      locale: language,
      plan,
      has_draft: Boolean(draftId),
    });
  }, [draftId, language, plan]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:py-12 lg:py-16">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-3">
            {language === "es" ? "Comienza tu prueba" : "Comença la teva prova"}
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-blue-500 to-emerald-500 bg-clip-text text-transparent">
              {language === "es" ? "gratuita de 14 días" : "gratuïta de 14 dies"}
            </span>
          </h1>
          
          <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto">
            {language === "es" 
              ? "Sin tarjeta de crédito. Sin compromiso." 
              : "Sense targeta de crèdit. Sense compromís."}
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden mb-6">
          {/* Plan Header */}
          <div className="bg-gradient-to-br from-emerald-50 to-blue-50 p-4 sm:p-6 border-b border-emerald-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
                {plan.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-emerald-600 font-medium uppercase">
                  {language === "es" ? "Plan" : "Pla"}
                </p>
                <h2 className="text-xl font-bold text-gray-900 truncate">
                  {plan.charAt(0).toUpperCase() + plan.slice(1)}
                </h2>
              </div>
            </div>
            
            {draftData.name && (
              <div className="bg-white/70 rounded-lg p-3 backdrop-blur-sm">
                <p className="text-xs text-gray-600 mb-1">
                  {language === "es" ? "Web para:" : "Web per a:"}
                </p>
                <p className="font-semibold text-gray-900 text-sm break-words">{draftData.name}</p>
                {draftData.sector && (
                  <p className="text-xs text-gray-600 mt-1">
                    {draftData.sector}
                  </p>
                )}
              </div>
            )}
          </div>
          
          {/* Benefits */}
          <div className="p-4 sm:p-6 space-y-3">
            <div className="flex items-start gap-3">
              <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              </div>
              <span className="text-sm text-gray-700">
                {language === "es" ? "14 días de prueba gratis" : "14 dies de prova gratis"}
              </span>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              </div>
              <span className="text-sm text-gray-700">
                {language === "es" ? "Sin tarjeta de crédito" : "Sense targeta de crèdit"}
              </span>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              </div>
              <span className="text-sm text-gray-700">
                {language === "es" ? "Cancela cuando quieras" : "Cancel·la quan vulguis"}
              </span>
            </div>
          </div>
          
          {/* CTA */}
          <div className="p-4 sm:p-6 pt-0">
            <Button 
              asChild 
              className="w-full rounded-full bg-gray-900 h-12 sm:h-14 text-sm sm:text-base font-bold text-white hover:bg-gray-800 transition-all"
            >
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
                {language === "es" ? "Iniciar prueba gratuita" : "Iniciar prova gratuïta"}
              </Link>
            </Button>
            
            <p className="text-center text-xs text-gray-500 mt-4 leading-relaxed">
              {language === "es" ? (
                <>
                  Al continuar, aceptas nuestros{" "}
                  <Link 
                    href={legalLinks.terms} 
                    className="text-emerald-600 hover:text-emerald-700 underline"
                  >
                    términos
                  </Link>
                  {" "}y{" "}
                  <Link 
                    href={legalLinks.privacy} 
                    className="text-emerald-600 hover:text-emerald-700 underline"
                  >
                    privacidad
                  </Link>
                  .
                </>
              ) : (
                <>
                  En continuar, acceptes els nostres{" "}
                  <Link 
                    href={legalLinks.terms} 
                    className="text-emerald-600 hover:text-emerald-700 underline"
                  >
                    termes
                  </Link>
                  {" "}i{" "}
                  <Link 
                    href={legalLinks.privacy} 
                    className="text-emerald-600 hover:text-emerald-700 underline"
                  >
                    privacitat
                  </Link>
                  .
                </>
              )}
            </p>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 text-center">
          <div className="flex flex-col items-center gap-1.5">
            <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="text-xs font-semibold text-gray-900">
              {language === "es" ? "Sin riesgos" : "Sense riscos"}
            </p>
          </div>
          
          <div className="flex flex-col items-center gap-1.5">
            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-xs font-semibold text-gray-900">
              {language === "es" ? "Rápido" : "Ràpid"}
            </p>
          </div>
          
          <div className="flex flex-col items-center gap-1.5">
            <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-xs font-semibold text-gray-900">
              {language === "es" ? "Soporte" : "Suport"}
            </p>
          </div>
        </div>
      </div>
  );
}
