"use client";

import { useState } from "react";
import Link from "next/link";
import { Zap, ArrowLeft, Search, MapPin, Star, Phone, Globe, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/LanguageProvider";

const createPageContent = {
  es: {
    navbar: {
      logo: "Nova Web",
    },
    crear: {
      back: "Volver",
      title: "Encuentra tu negocio",
      subtitle: "Extraemos tu información pública y creamos una web lista para publicar en segundos.",
      searchPlaceholder: "Ej: Pizzería Napoli, Madrid",
      searchButton: "Buscar",
      resultsTitle: "Resultados de Google",
      analyzingTitle: "La IA está analizando tu negocio...",
      analyzingSubtitle: "Extrayendo información de Google, leyendo reseñas y generando textos optimizados para SEO.",
      step1: "Conectando con Google My Business",
      step2: "Extrayendo dirección y horarios",
      step3: "Generando diseño y textos persuasivos",
      extractedData: "Datos Extraídos",
      reviewsAnalyzed: "reseñas analizadas",
      allCorrect: "¿Todo correcto?",
      generatedProposal: "Hemos generado una propuesta de diseño basada en tu perfil de Google.",
      publishNow: "Publicar mi web ahora",
      searchAnother: "Buscar otro negocio",
      heroSubtitle: "El mejor servicio de {type} en tu zona.",
      heroFallback: "Tu negocio, ahora con una presencia online profesional.",
      contactNow: "Contactar ahora",
      aboutUs: "Sobre nosotros",
      aboutUsText: "Basado en las excelentes reseñas de nuestros clientes ({rating} estrellas), nos enorgullece ofrecer el mejor servicio en {city}.",
      contactInfo: "Información de contacto",
      website: "Web",
      schedule: "Horario",
      openNow: "Abierto ahora",
      closedNow: "Cerrado ahora",
      priceLevel: "Nivel de precio",
      servicesTitle: "Servicios",
      servicesSubtitle: "Información detectada automáticamente desde Google.",
      whatClientsSay: "Lo que dicen nuestros clientes",
      minimalistNote: "Esta es una versión minimalista de tu web. La versión final puede incluir más secciones, diseño avanzado, SEO técnico y automatizaciones.",
      publishedTitle: "¡Tu web está publicada!",
      publishedSubtitle: "El sitio web para {name} ya está online y listo para recibir clientes.",
      visitsToday: "Visitas Hoy",
      contacts: "Contactos",
      seoStatus: "Estado SEO",
      optimized: "Optimizado",
      goToDashboard: "Ir al Panel de Control",
      createAnother: "Crear otra web",
    },
  },
  ca: {
    navbar: {
      logo: "Nova Web",
    },
    crear: {
      back: "Tornar",
      title: "Troba el teu negoci",
      subtitle: "Connectem amb Google My Business per extreure la teva informació i crear la teva web en segons.",
      searchPlaceholder: "Ex: Pizzeria Napoli, Barcelona",
      searchButton: "Cercar",
      resultsTitle: "Resultats de Google",
      analyzingTitle: "La IA està analitzant el teu negoci...",
      analyzingSubtitle: "Extraient informació de Google, llegint ressenyes i generant textos optimitzats per a SEO.",
      step1: "Connectant amb Google My Business",
      step2: "Extraient adreça i horaris",
      step3: "Generant disseny i textos persuasius",
      extractedData: "Dades Extretes",
      reviewsAnalyzed: "ressenyes analitzades",
      allCorrect: "Tot correcte?",
      generatedProposal: "Hem generat una proposta de disseny basada en el teu perfil de Google.",
      publishNow: "Publicar la meva web ara",
      searchAnother: "Buscar un altre negoci",
      heroSubtitle: "El millor servei de {type} a la teva zona.",
      heroFallback: "El teu negoci, ara amb una presència online professional.",
      contactNow: "Contactar ara",
      aboutUs: "Sobre nosaltres",
      aboutUsText: "Basat en les excel·lents ressenyes dels nostres clients ({rating} estrelles), ens enorgulleix oferir el millor servei a {city}.",
      contactInfo: "Informació de contacte",
      website: "Web",
      schedule: "Horari",
      openNow: "Obert ara",
      closedNow: "Tancat ara",
      priceLevel: "Nivell de preu",
      servicesTitle: "Serveis",
      servicesSubtitle: "Informació detectada automàticament des de Google.",
      whatClientsSay: "El que diuen els nostres clients",
      minimalistNote: "Aquesta és una versió minimalista del teu web. La versió final pot incloure més seccions, disseny avançat, SEO tècnic i automatitzacions.",
      publishedTitle: "La teva web està publicada!",
      publishedSubtitle: "El lloc web per a {name} ja està online i llest per rebre clients.",
      visitsToday: "Visites Avui",
      contacts: "Contactes",
      seoStatus: "Estat SEO",
      optimized: "Optimitzat",
      goToDashboard: "Anar al Tauler de Control",
      createAnother: "Crear una altra web",
    },
  },
} as const;

export default function CreateWebPage() {
  const { language } = useLanguage();
  const t = createPageContent[language];
  const [step, setStep] = useState<"search" | "analyzing" | "preview" | "dashboard">("search");
  const [query, setQuery] = useState("");
  const [places, setPlaces] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [placeDetails, setPlaceDetails] = useState<any>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const typeLabels = {
    es: {
      restaurant: "Restaurante",
      cafe: "Cafetería",
      bar: "Bar",
      bakery: "Panadería",
      meal_takeaway: "Comida para llevar",
      beauty_salon: "Centro de estética",
      hair_care: "Peluquería",
      dentist: "Clínica dental",
      doctor: "Centro médico",
      veterinary_care: "Clínica veterinaria",
      pharmacy: "Farmacia",
      gym: "Gimnasio",
      real_estate_agency: "Inmobiliaria",
      car_repair: "Taller mecánico",
      locksmith: "Cerrajería",
      electrician: "Electricista",
      plumber: "Fontanería",
      roofing_contractor: "Reformas y cubiertas",
      moving_company: "Mudanzas",
      furniture_store: "Tienda de muebles",
      clothing_store: "Tienda de ropa",
      shoe_store: "Zapatería",
      electronics_store: "Tienda de electrónica",
      lodging: "Alojamiento",
    },
    ca: {
      restaurant: "Restaurant",
      cafe: "Cafeteria",
      bar: "Bar",
      bakery: "Forn",
      meal_takeaway: "Menjar per emportar",
      beauty_salon: "Centre d'estètica",
      hair_care: "Perruqueria",
      dentist: "Clínica dental",
      doctor: "Centre mèdic",
      veterinary_care: "Clínica veterinària",
      pharmacy: "Farmàcia",
      gym: "Gimnàs",
      real_estate_agency: "Immobiliària",
      car_repair: "Taller mecànic",
      locksmith: "Serralleria",
      electrician: "Electricista",
      plumber: "Fontaneria",
      roofing_contractor: "Reformes i cobertes",
      moving_company: "Mudances",
      furniture_store: "Botiga de mobles",
      clothing_store: "Botiga de roba",
      shoe_store: "Sabateria",
      electronics_store: "Botiga d'electrònica",
      lodging: "Allotjament",
    },
  } as const;

  const serviceFlagLabels = {
    es: {
      delivery: "Entrega a domicilio",
      takeout: "Recogida en local",
      dine_in: "Consumo en local",
      reservable: "Reservas disponibles",
      serves_breakfast: "Desayunos",
      serves_lunch: "Comidas",
      serves_dinner: "Cenas",
      serves_vegetarian_food: "Opciones vegetarianas",
      wheelchair_accessible_entrance: "Acceso adaptado",
    },
    ca: {
      delivery: "Lliurament a domicili",
      takeout: "Recollida al local",
      dine_in: "Consum al local",
      reservable: "Reserves disponibles",
      serves_breakfast: "Esmorzars",
      serves_lunch: "Dinars",
      serves_dinner: "Sopars",
      serves_vegetarian_food: "Opcions vegetarianes",
      wheelchair_accessible_entrance: "Accés adaptat",
    },
  } as const;

  const normalizeTypeLabel = (rawType: string) => {
    const fromDictionary = typeLabels[language][rawType as keyof (typeof typeLabels)[typeof language]];
    if (fromDictionary) return fromDictionary;
    return rawType
      .replace(/_/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const servicesFromFlags = Object.entries(serviceFlagLabels[language])
    .filter(([flagKey]) => Boolean(placeDetails?.[flagKey]))
    .map(([, label]) => label);

  const ignoredTypes = new Set([
    "point_of_interest",
    "establishment",
    "food",
    "store",
    "health",
    "locality",
    "political",
    "premise",
    "subpremise",
  ]);

  const servicesFromTypes = (placeDetails?.types || [])
    .filter((rawType: string) => !ignoredTypes.has(rawType))
    .map((rawType: string) => normalizeTypeLabel(rawType));

  const detectedServices = Array.from(new Set([...servicesFromFlags, ...servicesFromTypes])).slice(0, 8);
  const hasDetectedServices = detectedServices.length > 0;
  const priceLevelValue = typeof placeDetails?.price_level === "number" ? "€".repeat(placeDetails.price_level) : null;
  const openNow = placeDetails?.opening_hours?.open_now;
  const aboutText =
    placeDetails?.editorial_summary?.overview ||
    t.crear.aboutUsText
      .replace("{rating}", placeDetails?.rating || "")
      .replace("{city}", placeDetails?.formatted_address?.split(",")?.[1]?.trim() || (language === "es" ? "la ciudad" : "la ciutat"));
  const signupHref = `/${language}/signup?redirect=/crear`;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch(`/api/places/search?q=${encodeURIComponent(query)}&lang=${language}`);
      const data = await res.json();
      if (data.results) {
        setPlaces(data.results);
      }
    } catch (error) {
      console.error("Error searching places:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectPlace = async (place: any) => {
    setSelectedPlace(place);
    setStep("analyzing");
    setPlaceDetails(null);
    setAnalysisProgress(0);

    const analysisDurationMs = 3000;
    const analysisStart = Date.now();
    const progressInterval = window.setInterval(() => {
      const elapsed = Date.now() - analysisStart;
      const progress = Math.min(95, Math.round((elapsed / analysisDurationMs) * 100));
      setAnalysisProgress(progress);
    }, 120);

    const analysisPromise = new Promise<void>((resolve) => {
      window.setTimeout(() => {
        setAnalysisProgress(100);
        resolve();
      }, analysisDurationMs);
    });

    try {
      const detailsPromise = (async () => {
        const res = await fetch(`/api/places/details?place_id=${place.place_id}&lang=${language}`);
        const data = await res.json();
        if (!data.result) {
          throw new Error("Place details not found");
        }
        setPlaceDetails(data.result);
      })();

      await Promise.all([analysisPromise, detailsPromise]);
      setStep("preview");
    } catch (error) {
      console.error("Error fetching place details:", error);
      setStep("search"); // Revert on error
    } finally {
      window.clearInterval(progressInterval);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-gray-900">
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
              <Zap className="h-5 w-5 fill-emerald-600 text-emerald-600" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">{t.navbar.logo}</span>
          </div>
          <Link href="/" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4" />
            {t.crear.back}
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          {step === "search" && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mx-auto max-w-2xl"
            >
              <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                  {t.crear.title}
                </h1>
                <p className="mt-4 text-lg text-gray-600">
                  {t.crear.subtitle}
                </p>
              </div>

              <form onSubmit={handleSearch} className="relative mb-8">
                <div className="relative flex items-center">
                  <Search className="absolute left-4 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t.crear.searchPlaceholder}
                    className="w-full rounded-full border-2 border-gray-200 py-4 pl-12 pr-20 text-lg focus:border-emerald-500 focus:outline-none focus:ring-0 shadow-sm transition-colors"
                  />
                  <Button
                    type="submit"
                    variant="default"
                    disabled={isSearching || !query.trim()}
                    aria-label={t.crear.searchButton}
                    className="absolute right-2 h-12 w-12 rounded-full bg-gray-900 p-0 text-white transition-all hover:scale-105 hover:bg-gray-800 disabled:opacity-50"
                  >
                    {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                  </Button>
                </div>
              </form>

              {places.length > 0 && (
                <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
                  <h3 className="mb-4 px-4 text-sm font-bold uppercase tracking-wider text-gray-500">
                    {t.crear.resultsTitle}
                  </h3>
                  <div className="space-y-2">
                    {places.map((place) => (
                      <button
                        type="button"
                        className="flex w-full items-start gap-4 rounded-2xl p-4 text-left transition-colors hover:bg-gray-50 focus:bg-emerald-50 focus:outline-none"
                        key={place.place_id}
                        onClick={() => handleSelectPlace(place)}
                      >
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                          <MapPin className="h-6 w-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="break-words text-lg font-bold leading-tight text-gray-900">{place.name}</h4>
                          <p className="mt-1 break-words text-sm text-gray-500">{place.formatted_address}</p>
                          {place.rating && (
                            <div className="mt-2 flex flex-wrap items-center gap-1 text-sm font-medium text-amber-600">
                              <Star className="h-4 w-4 flex-shrink-0 fill-amber-500 text-amber-500" />
                              <span className="break-words">
                                {place.rating} ({place.user_ratings_total} {t.crear.reviewsAnalyzed})
                              </span>
                            </div>
                          )}
                        </div>
                        <ArrowRight className="mt-1 h-5 w-5 flex-shrink-0 text-gray-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {step === "analyzing" && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="relative flex h-32 w-32 items-center justify-center">
                <div className="absolute inset-0 animate-ping rounded-full bg-emerald-200 opacity-20" />
                <div className="absolute inset-4 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
                <Zap className="h-10 w-10 text-emerald-600" />
              </div>
              <h2 className="mt-8 text-3xl font-extrabold text-gray-900">
                {t.crear.analyzingTitle}
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-md">
                {t.crear.analyzingSubtitle}
              </p>

              <div className="mt-8 w-full max-w-md">
                <div className="mb-2 text-right text-sm font-medium text-gray-600">{analysisProgress}%</div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-200"
                    style={{ width: `${analysisProgress}%` }}
                  />
                </div>
              </div>
              
              <div className="mt-10 w-full max-w-sm space-y-4 text-left">
                <div className="flex items-center gap-3 text-emerald-600 font-medium">
                  {analysisProgress >= 20 ? <CheckCircle2 className="h-5 w-5" /> : <Loader2 className="h-5 w-5 animate-spin" />}
                  <span>{t.crear.step1}</span>
                </div>
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                  className="flex items-center gap-3 text-emerald-600 font-medium"
                >
                  {analysisProgress >= 55 ? <CheckCircle2 className="h-5 w-5" /> : <Loader2 className="h-5 w-5 animate-spin" />}
                  <span>{t.crear.step2}</span>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
                  className="flex items-center gap-3 text-emerald-600 font-medium"
                >
                  {analysisProgress >= 90 ? <CheckCircle2 className="h-5 w-5" /> : <Loader2 className="h-5 w-5 animate-spin" />}
                  <span>{t.crear.step3}</span>
                </motion.div>
              </div>
            </motion.div>
          )}

          {step === "preview" && placeDetails && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-8 lg:grid-cols-3"
            >
              {/* Sidebar / Info extracted */}
              <div className="space-y-6 lg:col-span-1">
                <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                  <div className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-emerald-600">
                    <CheckCircle2 className="h-5 w-5" />
                    {t.crear.extractedData}
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900">{placeDetails.name}</h2>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex items-start gap-3 text-gray-600">
                      <MapPin className="h-5 w-5 flex-shrink-0 text-gray-400" />
                      <span className="text-sm">{placeDetails.formatted_address}</span>
                    </div>
                    {placeDetails.formatted_phone_number && (
                      <div className="flex items-center gap-3 text-gray-600">
                        <Phone className="h-5 w-5 flex-shrink-0 text-gray-400" />
                        <span className="text-sm">{placeDetails.formatted_phone_number}</span>
                      </div>
                    )}
                    {placeDetails.rating && (
                      <div className="flex items-center gap-3 text-gray-600">
                        <Star className="h-5 w-5 flex-shrink-0 text-amber-500 fill-amber-500" />
                        <span className="text-sm font-medium text-gray-900">{placeDetails.rating}</span>
                        <span className="text-sm">({placeDetails.user_ratings_total || placeDetails.reviews?.length || 0} {t.crear.reviewsAnalyzed})</span>
                      </div>
                    )}
                    {priceLevelValue && (
                      <div className="flex items-center gap-3 text-gray-600">
                        <span className="text-sm text-gray-400">{t.crear.priceLevel}:</span>
                        <span className="text-sm font-medium text-gray-900">{priceLevelValue}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-3xl bg-gray-900 p-6 text-white shadow-lg">
                  <h3 className="text-lg font-bold">{t.crear.allCorrect}</h3>
                  <p className="mt-2 text-sm text-gray-400">
                    {t.crear.generatedProposal}
                  </p>
                  <div className="mt-6 space-y-3">
                    <Button
                      asChild
                      type="button"
                      variant="default"
                      className="h-12 w-full rounded-full bg-emerald-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-400"
                    >
                      <Link href={signupHref}>{t.crear.publishNow}</Link>
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setStep("search")}
                      variant="ghost"
                      className="h-12 w-full rounded-full border border-white/20 bg-transparent px-4 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                    >
                      {t.crear.searchAnother}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Preview Area */}
              <div className="lg:col-span-2">
                <div className="mb-3 px-1 text-xs text-slate-500">
                  {t.crear.minimalistNote}
                </div>
                <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">
                  {/* Browser Chrome */}
                  <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-3">
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-red-400" />
                      <div className="h-3 w-3 rounded-full bg-amber-400" />
                      <div className="h-3 w-3 rounded-full bg-emerald-400" />
                    </div>
                    <div className="ml-4 flex-1 rounded-md bg-white px-3 py-1 text-xs text-gray-400 shadow-sm flex items-center gap-2">
                      <Globe className="h-3 w-3" />
                      {placeDetails.name.toLowerCase().replace(/\s+/g, '')}.novaweb.com
                    </div>
                  </div>
                  
                  {/* Generated Site Preview */}
                  <div className="h-[600px] overflow-y-auto bg-white">
                    {/* Hero Section */}
                    <div className="relative bg-slate-900 px-8 py-20 text-center text-white">
                      <div className="absolute inset-0 opacity-20 bg-[url('https://picsum.photos/seed/business/1200/800')] bg-cover bg-center" />
                      <div className="absolute inset-0 bg-slate-900/60" />
                      <div className="relative z-10">
                        <h1 className="text-4xl font-extrabold sm:text-5xl">{placeDetails.name}</h1>
                        <p className="mt-4 text-lg text-gray-300 max-w-xl mx-auto">
                          {placeDetails.types?.[0] ? t.crear.heroSubtitle.replace('{type}', placeDetails.types[0].replace(/_/g, ' ')) : t.crear.heroFallback}
                        </p>
                        <Button
                          type="button"
                          variant="default"
                          className="mt-8 rounded-full bg-emerald-500 px-8 py-3 font-bold text-white"
                        >
                          {t.crear.contactNow}
                        </Button>
                      </div>
                    </div>

                    {/* Info Section */}
                    <div className="px-8 py-16">
                      <div className="grid gap-8 sm:grid-cols-2">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">{t.crear.aboutUs}</h3>
                          <p className="mt-4 text-gray-600 leading-relaxed">
                            {aboutText}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-6">
                          <h4 className="font-bold text-gray-900 mb-4">{t.crear.contactInfo}</h4>
                          <div className="space-y-3 text-sm text-gray-600">
                            <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-emerald-500" /> {placeDetails.formatted_address}</p>
                            {placeDetails.formatted_phone_number && (
                              <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-emerald-500" /> {placeDetails.formatted_phone_number}</p>
                            )}
                            {placeDetails.website && (
                              <p className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-emerald-500" />
                                <a
                                  href={placeDetails.website}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-emerald-700 underline decoration-emerald-300 underline-offset-2"
                                >
                                  {t.crear.website}
                                </a>
                              </p>
                            )}
                            {typeof openNow === "boolean" && (
                              <p className="flex items-center gap-2">
                                <CheckCircle2 className={`h-4 w-4 ${openNow ? "text-emerald-500" : "text-gray-400"}`} />
                                {t.crear.schedule}: {openNow ? t.crear.openNow : t.crear.closedNow}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Services Section */}
                    {hasDetectedServices && (
                      <div className="px-8 py-14 border-t border-gray-100">
                        <div className="mx-auto max-w-4xl">
                          <h3 className="text-2xl font-bold text-gray-900 text-center">{t.crear.servicesTitle}</h3>
                          <p className="mt-2 text-center text-sm text-gray-500">{t.crear.servicesSubtitle}</p>
                          <div className="mt-8 grid gap-4 sm:grid-cols-2">
                            {detectedServices.map((serviceName) => (
                              <div key={serviceName} className="rounded-2xl border border-gray-200 bg-white px-4 py-3">
                                <p className="flex items-center gap-2 text-sm font-medium text-gray-800">
                                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                  {serviceName}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Reviews Section */}
                    {placeDetails.reviews?.some((review: any) => typeof review?.text === "string" && review.text.trim().length > 0) && (
                      <div className="bg-gray-50 px-8 py-16">
                        <h3 className="text-2xl font-bold text-gray-900 text-center mb-10">{t.crear.whatClientsSay}</h3>
                        <div className="grid gap-6 sm:grid-cols-2">
                          {placeDetails.reviews
                            .filter((review: any) => typeof review?.text === "string" && review.text.trim().length > 0)
                            .slice(0, 2)
                            .map((review: any, idx: number) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                              <div className="flex items-center gap-1 mb-3">
                                {[...Array(review.rating)].map((_, i) => (
                                  <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500" />
                                ))}
                              </div>
                              <p className="text-gray-600 text-sm italic whitespace-pre-line">&quot;{review.text}&quot;</p>
                              <p className="mt-4 text-sm font-bold text-gray-900">- {review.author_name}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === "dashboard" && placeDetails && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto max-w-4xl"
            >
              <div className="rounded-3xl bg-white p-8 sm:p-12 shadow-xl ring-1 ring-gray-200 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 mb-6">
                  <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">{t.crear.publishedTitle}</h2>
                <p className="mt-4 text-lg text-gray-600">
                  {t.crear.publishedSubtitle.replace('{name}', placeDetails.name)}
                </p>
                
                <div className="mt-8 flex items-center justify-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <Globe className="h-6 w-6 text-gray-400" />
                  <a href="#" className="text-lg sm:text-xl font-medium text-emerald-600 hover:underline">
                    {placeDetails.name.toLowerCase().replace(/\s+/g, '')}.novaweb.com
                  </a>
                </div>

                <div className="mt-12 grid gap-6 sm:grid-cols-3 text-left">
                  <div className="rounded-2xl bg-slate-50 p-6 border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">{t.crear.visitsToday}</h3>
                    <p className="mt-2 text-3xl font-extrabold text-gray-900">0</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-6 border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">{t.crear.contacts}</h3>
                    <p className="mt-2 text-3xl font-extrabold text-gray-900">0</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-6 border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">{t.crear.seoStatus}</h3>
                    <p className="mt-2 text-lg font-bold text-emerald-600 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5" /> {t.crear.optimized}
                    </p>
                  </div>
                </div>

                <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button
                    type="button"
                    variant="default"
                    className="w-full sm:w-auto rounded-full bg-gray-900 px-8 py-4 text-sm font-bold text-white transition-colors hover:bg-gray-800"
                  >
                    {t.crear.goToDashboard}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setStep("search")}
                    variant="outline"
                    className="w-full sm:w-auto rounded-full bg-white border border-gray-200 px-8 py-4 text-sm font-bold text-gray-900 transition-colors hover:bg-gray-50"
                  >
                    {t.crear.createAnother}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
