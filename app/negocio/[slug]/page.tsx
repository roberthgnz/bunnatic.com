"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import { content } from "@/lib/content";
import { useLanguage } from "@/components/LanguageProvider";
import { use } from "react";

// Helper to slugify business names
const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[🍽🍕💆🌿🏋🐾🦷📸🏠⚖]/g, "") // Remove emojis
    .trim()
    .replace(/\s+/g, "-");
};

export default function NegocioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { language } = useLanguage();
  const t = content[language];
  
  // Find the business based on slug
  const business = t.ticker.businesses.find(
    (b) => slugify(b) === slug
  );

  if (!business) {
    notFound();
  }

  const businessName = business.replace(/[🍽🍕💆🌿🏋🐾🦷📸🏠⚖]/g, "").trim();

  return (
    <main className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
              <Zap className="h-5 w-5 fill-emerald-600 text-emerald-600" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">Nova Web</span>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden bg-slate-50 px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-50" />
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tighter text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1]">
            {language === 'es' ? 'Web profesional para' : 'Web professional per a'} <span className="text-emerald-600">{businessName}</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg text-gray-600 sm:text-xl leading-relaxed">
            {language === 'es' ? `Atrae más clientes a tu ${businessName.toLowerCase()} con una web que destaca en Google. Creada en minutos por nuestra IA.` : `Atreu més clients a la teva ${businessName.toLowerCase()} amb una web que destaca a Google. Creada en minuts per la nostra IA.`}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4">
            <Link
              href="/signup"
              className="group flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold text-white shadow-[0_0_40px_-10px_rgba(0,0,0,0.3)] transition-all hover:scale-105 hover:bg-gray-800"
            >
              {language === 'es' ? `Crear mi web de ${businessName.toLowerCase()} gratis` : `Crear la meva web de ${businessName.toLowerCase()} gratis`}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-center mb-16">{language === 'es' ? `¿Por qué tu ${businessName.toLowerCase()} necesita Nova Web?` : `Per què la teva ${businessName.toLowerCase()} necessita Nova Web?`}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "SEO Local", desc: language === 'es' ? "Aparece cuando buscan tu servicio en tu ciudad." : "Apareix quan busquen el teu servei a la teva ciutat." },
              { title: language === 'es' ? "Reservas/Contactos" : "Reserves/Contactes", desc: language === 'es' ? "Formulario directo para que no pierdas clientes." : "Formulari directe perquè no perdis clients." },
              { title: language === 'es' ? "Diseño Profesional" : "Disseny Professional", desc: language === 'es' ? "Tu negocio proyectará confianza desde el primer clic." : "El teu negoci projectarà confiança des del primer clic." }
            ].map((item) => (
              <div key={item.title} className="p-8 rounded-3xl bg-white shadow-sm ring-1 ring-gray-200">
                <CheckCircle2 className="h-10 w-10 text-emerald-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
