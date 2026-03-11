"use client";

import { Suspense, useState } from "react";
import Navbar from "@/components/Navbar";
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
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    
    // Generate a simple slug from name if not provided (though we are not asking for it explicitly yet, maybe backend can handle or we generate here)
    const name = formData.get("name") as string;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Math.floor(Math.random() * 1000);
    formData.append("slug", slug);

    const result = await createBusiness(formData);

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
      title: "Configura tu negocio",
      subtitle: "Introduce los datos básicos para empezar.",
      nameLabel: "Nombre del negocio",
      categoryLabel: "Categoría",
      descLabel: "Descripción corta",
      submit: "Crear negocio",
      submitting: "Creando...",
    },
    ca: {
      title: "Configura el teu negoci",
      subtitle: "Introdueix les dades bàsiques per començar.",
      nameLabel: "Nom del negoci",
      categoryLabel: "Categoria",
      descLabel: "Descripció curta",
      submit: "Crear negoci",
      submitting: "Creant...",
    },
  }[language === "ca" ? "ca" : "es"];

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-gray-900">
      <Navbar />

      <div className="mx-auto max-w-lg px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-200">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {t.title}
          </h1>
          <p className="mt-2 text-gray-600 mb-8">
            {t.subtitle}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-900">
                {t.nameLabel}
              </label>
              <Input
                id="name"
                name="name"
                required
                placeholder="Ej. Restaurante La Plaza"
                className="h-12 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium text-gray-900">
                {t.categoryLabel}
              </label>
              <Input
                id="category"
                name="category"
                required
                placeholder="Ej. Restaurante, Clínica, Taller..."
                className="h-12 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-gray-900">
                {t.descLabel}
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-base"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? t.submitting : t.submit}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}

