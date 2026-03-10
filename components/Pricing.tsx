"use client";

import { content } from "@/lib/content";
import { Check, CircleHelp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useLanguage } from "./LanguageProvider";

const HELP_TEXT = {
  es: {
    addons: {
      "Sección extra 3€/mes": "Añade una sección adicional a tu web actual, ideal para servicios nuevos o promociones.",
      "Usuario extra 4€/mes": "Invita a otra persona de tu equipo para editar contenido con su propio acceso.",
      "Web extra 5€/mes": "Crea una web adicional para otra sede, marca o línea de negocio.",
      "Web extra 4€/mes": "Precio reducido por web adicional cuando ya estás en un plan de mayor capacidad.",
    },
    includes: {
      "Dominio incluido": "Incluye conexión y configuración básica de dominio para publicar sin pasos técnicos.",
      "SSL seguro": "Tu web se publica con HTTPS para proteger datos y mejorar la confianza de clientes.",
      "Analítica básica": "Métricas esenciales de visitas y páginas más vistas para medir resultados.",
      "Todo Esencial": "Incluye todas las funciones del plan Esencial.",
      "SEO local": "Optimización para aparecer mejor en búsquedas de tu zona y en Google Maps.",
      "Soporte prioritario": "Atención más rápida para incidencias o dudas de configuración.",
      "Todo Impulso": "Incluye todas las funciones del plan Impulso.",
      "Reportes personalizados": "Informes adaptados a tu negocio con los indicadores que más te importan.",
      "Calendario compartido": "Organiza cambios y publicaciones con visibilidad para todo el equipo.",
      "Todo Equipo": "Incluye todas las funciones del plan Equipo.",
      "Analítica avanzada": "Panel con mayor detalle para entender conversión, rendimiento y evolución.",
      "Soporte dedicado": "Canal de soporte más cercano para acompañamiento continuo.",
    },
    fallback: "Información adicional de esta funcionalidad.",
  },
  ca: {
    addons: {
      "Secció extra 3€/mes": "Afegeix una secció addicional a la teva web, ideal per nous serveis o promocions.",
      "Usuari extra 4€/mes": "Convida una altra persona del teu equip per editar contingut amb el seu propi accés.",
      "Web extra 5€/mes": "Crea una web addicional per a una altra seu, marca o línia de negoci.",
      "Web extra 4€/mes": "Preu reduit per web addicional quan ja ets en un pla amb més capacitat.",
    },
    includes: {
      "Domini inclòs": "Inclou connexió i configuració bàsica de domini per publicar sense passos tècnics.",
      "SSL segur": "La teva web es publica amb HTTPS per protegir dades i millorar la confiança dels clients.",
      "Analítica bàsica": "Mètriques essencials de visites i pàgines més vistes per mesurar resultats.",
      "Tot Essencial": "Inclou totes les funcions del pla Essencial.",
      "SEO local": "Optimització per aparèixer millor en cerques de la teva zona i a Google Maps.",
      "Suport prioritari": "Atenció més ràpida per incidències o dubtes de configuració.",
      "Tot Impuls": "Inclou totes les funcions del pla Impuls.",
      "Informes personalitzats": "Informes adaptats al teu negoci amb els indicadors que més t'importen.",
      "Calendari compartit": "Organitza canvis i publicacions amb visibilitat per a tot l'equip.",
      "Tot Equip": "Inclou totes les funcions del pla Equip.",
      "Analítica avançada": "Panell amb més detall per entendre conversió, rendiment i evolució.",
      "Suport dedicat": "Canal de suport més proper per acompanyament continu.",
    },
    fallback: "Informació addicional d'aquesta funcionalitat.",
  },
} as const;

export default function Pricing() {
  const { language } = useLanguage();
  const t = content[language];
  const [isAnnual, setIsAnnual] = useState(false);
  const help = HELP_TEXT[language];

  return (
    <section className="bg-[#f4f7fc] py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-800 sm:text-5xl">
            {t.pricing.title}
          </h2>
          <p className="mt-4 text-xl text-slate-600">{t.pricing.subtitle}</p>

          <Button
            type="button"
            onClick={() => setIsAnnual((prev) => !prev)}
            variant="ghost"
            className="mt-8 h-auto inline-flex items-center gap-3 px-0 text-base font-medium text-slate-700 hover:bg-transparent hover:text-slate-700"
            aria-pressed={isAnnual}
          >
            <span
              className={`inline-flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors ${
                isAnnual ? "bg-indigo-600" : "bg-slate-200"
              }`}
            >
              <span
                className={`h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                  isAnnual ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </span>
            <span>
              {t.pricing.billingLabel},{" "}
              <span className="text-indigo-600">{t.pricing.saveLabel}</span>
            </span>
          </Button>
        </div>

        <Card className="mt-14 rounded-3xl border border-slate-200 bg-white p-0">
          <div className="grid grid-cols-1 divide-y divide-slate-200 xl:grid-cols-4 xl:divide-x xl:divide-y-0">
            {t.pricing.tiers.map((tier) => (
              <article key={tier.id} className="flex h-full flex-col">
                <CardContent className="flex h-full flex-1 flex-col p-6 sm:p-8">
                  <div>
                    <h3 className="text-3xl font-extrabold text-slate-800">{tier.name}</h3>
                    <p className="mt-3 max-w-xs text-lg text-slate-600">{tier.description}</p>
                  </div>

                  <div className="mt-8">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-extrabold tracking-tight text-slate-800">
                        {isAnnual ? tier.priceYearly : tier.priceMonthly}
                      </span>
                      <span className="text-2xl font-semibold text-slate-500">{tier.period}</span>
                    </div>
                    <div className="mt-2 min-h-[44px] text-sm text-slate-500">
                      {isAnnual ? (
                        <div className="space-y-1">
                          <p>
                            {t.pricing.previousPriceLabel}:{" "}
                            <span className="line-through">{tier.priceMonthly}{tier.period}</span>
                          </p>
                          <p>
                            {t.pricing.billedAnnuallyLabel}:{" "}
                            <span className="font-semibold text-slate-700">{tier.annualTotal}</span>
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Link
                      href={`/signup?source=pricing&plan=${tier.id.replace("tier-", "")}`}
                      className="rounded-full bg-indigo-600 px-5 py-2.5 text-base font-semibold text-white transition-colors hover:bg-indigo-500"
                    >
                      {tier.cta}
                    </Link>
                    {tier.secondaryCta && (
                      <Link href="#" className="text-base font-semibold text-slate-500 hover:text-slate-700">
                        {tier.secondaryCta}
                      </Link>
                    )}
                  </div>

                  <ul className="mt-10 space-y-5">
                    {tier.features.map((feature) => (
                      <li key={feature.title} className="flex items-start gap-3">
                        <Check className="mt-1 h-5 w-5 shrink-0 text-emerald-500" />
                        <div className="space-y-1">
                          <p className="text-2xl font-extrabold text-slate-900">{feature.title}</p>
                          <p className="text-base text-slate-500">{feature.detail}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="flex flex-col items-start gap-6 rounded-none border-t border-slate-200 bg-slate-50 p-6 text-left sm:p-8">
                  <h4 className="text-base font-semibold text-slate-700">{t.pricing.addonsTitle}</h4>
                  <ul className="mt-3 w-full space-y-2">
                    {tier.addons.map((item) => (
                      <li key={item} className="flex items-center text-sm text-slate-600 sm:text-base">
                        <span>{item}</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="ml-auto h-5 w-5 rounded-full text-slate-300 hover:text-slate-500"
                              aria-label={item}
                            >
                              <CircleHelp className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top" sideOffset={8}>
                            {help.addons[item as keyof typeof help.addons] ?? help.fallback}
                          </TooltipContent>
                        </Tooltip>
                      </li>
                    ))}
                  </ul>

                  <h4 className="mt-7 text-base font-semibold text-slate-700">{t.pricing.includesTitle}</h4>
                  <ul className="mt-3 w-full space-y-2">
                    {tier.includes.map((item) => (
                      <li key={item} className="flex items-center text-sm text-slate-600 sm:text-base">
                        <span>{item}</span>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="ml-auto h-5 w-5 rounded-full text-slate-300 hover:text-slate-500"
                              aria-label={item}
                            >
                              <CircleHelp className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="top" sideOffset={8}>
                            {help.includes[item as keyof typeof help.includes] ?? help.fallback}
                          </TooltipContent>
                        </Tooltip>
                      </li>
                    ))}
                  </ul>
                </CardFooter>
              </article>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}
