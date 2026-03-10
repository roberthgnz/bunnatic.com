"use client";

import Link from "next/link";
import { Zap, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

const notFoundContent = {
  es: {
    title: "Página no encontrada",
    description: "Lo sentimos, no hemos podido encontrar la página que estás buscando.",
    back: "Volver al inicio",
  },
  ca: {
    title: "Pàgina no trobada",
    description: "Ho sentim, no hem pogut trobar la pàgina que estàs buscant.",
    back: "Tornar a l'inici",
  },
} as const;

export default function NotFound() {
  const { language } = useLanguage();
  const t = notFoundContent[language];

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 mb-8">
        <Zap className="h-8 w-8 fill-emerald-600 text-emerald-600" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl mb-4">
        {t.title}
      </h1>
      <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
        {t.description}
      </p>
      <Link
        href="/"
        className="flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-800"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.back}
      </Link>
    </main>
  );
}
