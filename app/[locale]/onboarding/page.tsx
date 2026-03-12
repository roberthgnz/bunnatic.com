"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { content } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createBusiness } from "@/lib/supabase/actions";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";
import { getLegalSlug } from "@/lib/pageSlugs";
import { trackFunnelEvent } from "@/lib/funnelEvents";

const EMPTY_DRAFT_SNAPSHOT = "";

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <OnboardingContent />
    </Suspense>
  );
}

function OnboardingContent() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname() ?? "/";
  const locale = pathname.split("/").filter(Boolean)[0];
  const hasLocale = locale === "es" || locale === "ca";
  const localePrefix = hasLocale ? `/${locale}` : "";
  const plan = searchParams.get("plan") ?? "starter";
  const step = searchParams.get("step") === "business" ? "business" : "checkout";
  const source = searchParams.get("source");
  const draftId = searchParams.get("draftId");
  const publishIntent = searchParams.get("publishIntent") === "1";
  const tempGenerationKey = searchParams.get("tempGenerationKey");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    address: "",
    phone: "",
    website: "",
    googlePlaceId: "",
    placeData: "",
  });
  const languageKey = language === "ca" ? "ca" : "es";

  const selectedTier = useMemo(() => {
    const tiers = content[languageKey].pricing.tiers;
    return tiers.find((tier) => tier.id === `tier-${plan}`) ?? tiers[0];
  }, [languageKey, plan]);

  const legalLinks = useMemo(() => {
    const lang = language === "ca" ? "ca" : "es";
    return {
      terms: `/${getLegalSlug("aviso-legal", lang)}`,
      privacy: `/${getLegalSlug("politica-privacidad", lang)}`,
    };
  }, [language]);

  const businessStepHref = useMemo(() => {
    const params = new URLSearchParams();
    params.set("step", "business");
    params.set("plan", plan);
    if (draftId) {
      params.set("draftId", draftId);
    }
    if (source) {
      params.set("source", source);
    }
    if (publishIntent) {
      params.set("publishIntent", "1");
    }
    if (tempGenerationKey) {
      params.set("tempGenerationKey", tempGenerationKey);
    }
    return `${localePrefix}/onboarding?${params.toString()}`;
  }, [draftId, localePrefix, plan, publishIntent, source, tempGenerationKey]);

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
    if (step !== "checkout") return;

    trackFunnelEvent("checkout_started", {
      locale: language,
      plan,
      has_draft: Boolean(draftId),
    });
  }, [draftId, language, plan, step]);

  useEffect(() => {
    if (step !== "business" || !publishIntent || !tempGenerationKey) return;

    let cancelled = false;

    const hydrateFromTempGeneration = async () => {
      try {
        const response = await fetch(`/api/temp-generation?key=${encodeURIComponent(tempGenerationKey)}`);
        if (!response.ok) return;

        const data = await response.json();
        const generation = data?.generation;
        if (!generation || cancelled) return;

        setFormData((prev) => ({
          ...prev,
          name: prev.name || (generation.name ?? ""),
          category: prev.category || (generation.category ?? ""),
          description: prev.description || (generation.description ?? ""),
          address: generation.address ?? "",
          phone: generation.phone ?? "",
          website: generation.website ?? "",
          googlePlaceId: generation.googlePlaceId ?? "",
          placeData: generation.placeData ? JSON.stringify(generation.placeData) : "",
        }));
      } catch (error) {
        console.error("Error hydrating onboarding from temp generation:", error);
      }
    };

    hydrateFromTempGeneration();

    return () => {
      cancelled = true;
    };
  }, [publishIntent, step, tempGenerationKey]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const data = new FormData(event.currentTarget);
    
    // Generate a simple slug from name
    const name = data.get("name") as string;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Math.floor(Math.random() * 1000);
    data.append("slug", slug);

    const result = await createBusiness(data);

    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
    } else {
      toast.success(language === "es" ? "Negocio creado correctamente" : "Negoci creat correctament");
      router.push(`/${language}/dashboard`);
    }
  }

  const t = {
    es: {
      title: "Crea tu espacio de trabajo",
      subtitle: "Configura tu negocio para comenzar.",
      step: "2/2",
      nameLabel: "Nombre del negocio",
      namePlaceholder: "Ej. Restaurante La Plaza",
      categoryLabel: "Categoría",
      categoryPlaceholder: "Ej. Restaurante, Clínica, Taller...",
      descLabel: "Descripción corta (opcional)",
      descPlaceholder: "Describe brevemente tu negocio...",
      submit: "Crear negocio",
      submitting: "Creando...",
      previewTitle: "Tu negocio",
      previewUrl: "tunegocio.bunnatic.com",
    },
    ca: {
      title: "Crea el teu espai de treball",
      subtitle: "Configura el teu negoci per començar.",
      step: "2/2",
      nameLabel: "Nom del negoci",
      namePlaceholder: "Ex. Restaurant La Plaça",
      categoryLabel: "Categoria",
      categoryPlaceholder: "Ex. Restaurant, Clínica, Taller...",
      descLabel: "Descripció curta (opcional)",
      descPlaceholder: "Descriu breument el teu negoci...",
      submit: "Crear negoci",
      submitting: "Creant...",
      previewTitle: "El teu negoci",
      previewUrl: "elneutenegoci.bunnatic.com",
    },
  }[languageKey];

  if (step === "checkout") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-6 sm:py-12 lg:py-16">
        <div className="text-center mb-6 sm:mb-10">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 mb-2">
            {language === "es" ? "Paso 1 de 2" : "Pas 1 de 2"}
          </p>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-3">
            {language === "es" ? "Comienza tu prueba" : "Comença la teva prova"}
            <br />
            <span className="text-emerald-700">
              {language === "es" ? "gratuita de 14 días" : "gratuïta de 14 dies"}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto">
            {language === "es"
              ? `Incluye prueba del plan ${selectedTier.name}. Sin tarjeta de crédito.`
              : `Inclou prova del pla ${selectedTier.name}. Sense targeta de crèdit.`}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          <div className="bg-emerald-50 p-4 sm:p-6 border-b border-emerald-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {plan.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-emerald-600 font-medium uppercase">
                  {language === "es" ? "Plan" : "Pla"}
                </p>
                <h2 className="text-xl font-bold text-gray-900 truncate">
                  {selectedTier.name}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedTier.description}
                </p>
              </div>
            </div>

            {draftData.name && (
              <div className="bg-white rounded-lg p-3 border border-emerald-100">
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

          <div className="p-4 sm:p-6 space-y-3">
            <div className="flex items-start gap-3">
              <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              </div>
              <span className="text-sm text-gray-700">
                {language === "es"
                  ? `14 días de prueba del plan ${selectedTier.name}`
                  : `14 dies de prova del pla ${selectedTier.name}`}
              </span>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              </div>
              <span className="text-sm text-gray-700">
                {selectedTier.features[0]?.title}
                {selectedTier.features[0]?.detail ? ` · ${selectedTier.features[0].detail}` : ""}
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

          <div className="p-4 sm:p-6 pt-0">
            <Button
              asChild
              className="w-full rounded-full bg-slate-900 h-12 sm:h-14 text-sm sm:text-base font-bold text-white hover:bg-slate-800 transition-colors"
            >
              <Link
                href={businessStepHref}
                onClick={() =>
                  trackFunnelEvent("checkout_completed", {
                    locale: language,
                    plan,
                    has_draft: Boolean(draftId),
                  })
                }
              >
                {language === "es" ? "Empezar" : "Començar"}
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
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-16">
      <div className="rounded-2xl bg-white shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-0">
          {/* Left side - Form */}
          <div className="p-6 sm:p-10 lg:p-12">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {t.title}
                </h1>
                <span className="text-sm font-medium text-gray-500">
                  {t.step}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {t.subtitle}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-900 block">
                  {t.nameLabel}
                </label>
                <Input
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t.namePlaceholder}
                  className="h-11 rounded-lg border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium text-gray-900 block">
                  {t.categoryLabel}
                </label>
                <Input
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder={t.categoryPlaceholder}
                  className="h-11 rounded-lg border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium text-gray-900 block">
                  {t.descLabel}
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={t.descPlaceholder}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <input type="hidden" name="address" value={formData.address} readOnly />
              <input type="hidden" name="phone" value={formData.phone} readOnly />
              <input type="hidden" name="website" value={formData.website} readOnly />
              <input type="hidden" name="google_place_id" value={formData.googlePlaceId} readOnly />
              <input type="hidden" name="place_data" value={formData.placeData} readOnly />

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-lg bg-gray-900 hover:bg-gray-800 text-white font-medium text-sm transition-colors"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? t.submitting : t.submit}
              </Button>
            </form>
          </div>

          {/* Right side - Preview */}
          <div className="hidden lg:flex bg-gray-100 p-12 items-center justify-center border-l border-gray-200">
            <div className="w-full max-w-sm">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-lg bg-emerald-700 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {formData.name ? formData.name.charAt(0).toUpperCase() : "?"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {formData.name || t.previewTitle}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {formData.name 
                        ? formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + ".bunnatic.com"
                        : t.previewUrl
                      }
                    </p>
                  </div>
                </div>
                
                {formData.category && (
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                      {formData.category}
                    </span>
                  </div>
                )}
                
                {formData.description && (
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {formData.description}
                  </p>
                )}
                
                {!formData.name && !formData.category && !formData.description && (
                  <div className="space-y-3">
                    <div className="h-3 bg-gray-100 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-100 rounded w-full"></div>
                    <div className="h-3 bg-gray-100 rounded w-5/6"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
