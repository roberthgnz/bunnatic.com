"use client";

import { Suspense, useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams, useRouter } from "next/navigation";
import { createBusiness } from "@/lib/supabase/actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
  const plan = searchParams.get("plan") ?? "starter";
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

  useEffect(() => {
    if (!publishIntent || !tempGenerationKey) return;

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
  }, [publishIntent, tempGenerationKey]);

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
      step: "1/3",
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
      step: "1/3",
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
  }[language === "ca" ? "ca" : "es"];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-16">
      <div className="rounded-2xl bg-white shadow-lg border border-gray-200 overflow-hidden">
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
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
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
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
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
