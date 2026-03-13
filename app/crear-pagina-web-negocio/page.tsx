'use client'

import { Suspense, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Zap,
  Search,
  MapPin,
  Star,
  Phone,
  Globe,
  CheckCircle2,
  Loader2,
  ArrowRight,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { useSearchParams } from 'next/navigation'
import { trackFunnelEvent } from '@/lib/funnelEvents'

const createPageContent = {
  es: {
    crear: {
      title: 'Encuentra tu negocio',
      subtitle:
        'Extraemos tu información pública y creamos una web lista para publicar en segundos.',
      searchPlaceholder: 'Ej: Pizzería Napoli, Madrid o https://tu-negocio.com',
      searchButton: 'Buscar',
      resultsTitle: 'Resultados',
      analyzingTitle: 'La IA está analizando tu negocio...',
      analyzingSubtitle:
        'Extrayendo información de Google, leyendo reseñas y generando textos optimizados para SEO.',
      step1Google: 'Extrayendo información del negocio',
      step1Web: 'Analizando tu sitio web',
      step2: 'Extrayendo dirección y horarios',
      step3: 'Generando diseño y textos persuasivos',
      extractedData: 'Datos Extraídos',
      reviewsAnalyzed: 'reseñas analizadas',
      allCorrect: '¿Todo correcto?',
      generatedProposal:
        'Hemos generado una propuesta de diseño basada en tu perfil de Google.',
      publishNow: 'Publicar mi web ahora',
      searchAnother: 'Buscar otro negocio',
      heroSubtitle: 'El mejor servicio de {type} en tu zona.',
      heroFallback: 'Tu negocio, ahora con una presencia online profesional.',
      contactNow: 'Contactar ahora',
      aboutUs: 'Sobre nosotros',
      aboutUsText:
        'Basado en las excelentes reseñas de nuestros clientes ({rating} estrellas), nos enorgullece ofrecer el mejor servicio en {city}.',
      contactInfo: 'Información de contacto',
      website: 'Web',
      schedule: 'Horario',
      openNow: 'Abierto ahora',
      closedNow: 'Cerrado ahora',
      priceLevel: 'Nivel de precio',
      servicesTitle: 'Servicios',
      servicesSubtitle: 'Información detectada automáticamente desde Google.',
      whatClientsSay: 'Lo que dicen nuestros clientes',
      minimalistNote:
        'Esta es una versión minimalista de tu web. La versión final puede incluir más secciones, diseño avanzado, SEO técnico y automatizaciones.',
      publishedTitle: '¡Tu web está publicada!',
      publishedSubtitle:
        'El sitio web para {name} ya está online y listo para recibir clientes.',
      visitsToday: 'Visitas Hoy',
      contacts: 'Contactos',
      seoStatus: 'Estado SEO',
      optimized: 'Optimizado',
      goToDashboard: 'Ir al Panel de Control',
      createAnother: 'Crear otra web',
      noResultsTitle: 'No encontramos coincidencias',
      noResultsSubtitle:
        'Prueba con el nombre exacto del negocio y la ciudad para mejorar los resultados.',
    },
  },
} as const

function isCompleteHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export default function CreateWebPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <CreateWebContent />
    </Suspense>
  )
}

function CreateWebContent() {
  const language = 'es'
  const pageSearchParams = useSearchParams()
  const t = createPageContent[language]
  const [step, setStep] = useState<
    'search' | 'analyzing' | 'preview' | 'dashboard'
  >('search')
  const [query, setQuery] = useState('')
  const [places, setPlaces] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState<any>(null)
  const [placeDetails, setPlaceDetails] = useState<any>(null)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [draftId, setDraftId] = useState<string | null>(null)
  const [tempSessionId, setTempSessionId] = useState<string | null>(null)
  const [tempGenerationKey, setTempGenerationKey] = useState<string | null>(
    null
  )
  const [searchError, setSearchError] = useState<string | null>(null)
  const [analysisInputMode, setAnalysisInputMode] = useState<'google' | 'url'>(
    'google'
  )
  const [lastSearchMode, setLastSearchMode] = useState<'google' | 'url' | null>(
    null
  )
  const [rateLimitExceeded, setRateLimitExceeded] = useState(false)
  const [rateLimitResetAt, setRateLimitResetAt] = useState<number | null>(null)

  const typeLabels = {
    es: {
      restaurant: 'Restaurante',
      cafe: 'Cafetería',
      bar: 'Bar',
      bakery: 'Panadería',
      meal_takeaway: 'Comida para llevar',
      beauty_salon: 'Centro de estética',
      hair_care: 'Peluquería',
      dentist: 'Clínica dental',
      doctor: 'Centro médico',
      veterinary_care: 'Clínica veterinaria',
      pharmacy: 'Farmacia',
      gym: 'Gimnasio',
      real_estate_agency: 'Inmobiliaria',
      car_repair: 'Taller mecánico',
      locksmith: 'Cerrajería',
      electrician: 'Electricista',
      plumber: 'Fontanería',
      roofing_contractor: 'Reformas y cubiertas',
      moving_company: 'Mudanzas',
      furniture_store: 'Tienda de muebles',
      clothing_store: 'Tienda de ropa',
      shoe_store: 'Zapatería',
      electronics_store: 'Tienda de electrónica',
      lodging: 'Alojamiento',
    },
  } as const

  const serviceFlagLabels = {
    es: {
      delivery: 'Entrega a domicilio',
      takeout: 'Recogida en local',
      dine_in: 'Consumo en local',
      reservable: 'Reservas disponibles',
      serves_breakfast: 'Desayunos',
      serves_lunch: 'Comidas',
      serves_dinner: 'Cenas',
      serves_vegetarian_food: 'Opciones vegetarianas',
      wheelchair_accessible_entrance: 'Acceso adaptado',
    },
  } as const

  const normalizeTypeLabel = (rawType: string) => {
    const fromDictionary =
      typeLabels[language][
        rawType as keyof (typeof typeLabels)[typeof language]
      ]
    if (fromDictionary) return fromDictionary
    return rawType
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase())
  }

  const servicesFromFlags = Object.entries(serviceFlagLabels[language])
    .filter(([flagKey]) => Boolean(placeDetails?.[flagKey]))
    .map(([, label]) => label)

  const ignoredTypes = new Set([
    'point_of_interest',
    'establishment',
    'food',
    'store',
    'health',
    'locality',
    'political',
    'premise',
    'subpremise',
  ])

  const servicesFromTypes = (placeDetails?.types || [])
    .filter((rawType: string) => !ignoredTypes.has(rawType))
    .map((rawType: string) => normalizeTypeLabel(rawType))

  const detectedServices = Array.from(
    new Set([...servicesFromFlags, ...servicesFromTypes])
  ).slice(0, 8)
  const hasDetectedServices = detectedServices.length > 0
  const priceLevelValue =
    typeof placeDetails?.price_level === 'number'
      ? '€'.repeat(placeDetails.price_level)
      : null
  const openNow = placeDetails?.opening_hours?.open_now
  const sourceValue = useMemo(() => {
    const qs = pageSearchParams.toString()
    return `/crear-pagina-web-negocio${qs ? `?${qs}` : ''}`
  }, [pageSearchParams])
  const planSuggested = useMemo(() => {
    if (!placeDetails?.price_level) {
      return 'starter'
    }
    if (placeDetails.price_level >= 4) {
      return 'agency'
    }
    if (placeDetails.price_level >= 2) {
      return 'pro'
    }
    return 'starter'
  }, [placeDetails])
  const sector = (placeDetails?.types?.[0] as string | undefined) ?? ''
  const aboutText =
    placeDetails?.editorial_summary?.overview ||
    t.crear.aboutUsText
      .replace('{rating}', placeDetails?.rating || '')
      .replace(
        '{city}',
        placeDetails?.formatted_address?.split(',')?.[1]?.trim() || 'la ciudad'
      )
  const signupParams = new URLSearchParams()
  signupParams.set('redirect', '/checkout')
  signupParams.set('source', sourceValue)
  signupParams.set('planSuggested', planSuggested)
  if (sector) {
    signupParams.set('sector', sector)
  }
  if (draftId) {
    signupParams.set('draftId', draftId)
  }
  for (const key of [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
  ]) {
    const value = pageSearchParams.get(key)
    if (value) {
      signupParams.set(key, value)
    }
  }
  const signupHref = `/signup?${signupParams.toString()}`
  const publishSignupParams = new URLSearchParams(signupParams.toString())
  publishSignupParams.set('publishIntent', '1')
  if (tempGenerationKey) {
    publishSignupParams.set('tempGenerationKey', tempGenerationKey)
  }
  const publishSignupHref = `/signup?${publishSignupParams.toString()}`
  const showNoResults =
    lastSearchMode === 'google' &&
    hasSearched &&
    !isSearching &&
    query.trim().length > 0 &&
    places.length === 0
  const genericUrlError = 'No pudimos analizar esa URL. Verifica que sea pública y vuelve a intentarlo.'
  const urlPollIntervalMs = 1200
  const urlPollMaxWaitMs = 90000

  const getOrCreateTempSessionId = () => {
    if (typeof window === 'undefined') return null
    if (tempSessionId) return tempSessionId

    const existing = window.localStorage.getItem('temp-generation-session-id')
    if (existing) {
      setTempSessionId(existing)
      return existing
    }

    const created = crypto.randomUUID()
    window.localStorage.setItem('temp-generation-session-id', created)
    setTempSessionId(created)
    return created
  }

  const saveTemporaryGeneration = async (
    generatedPlaceData: any,
    nextDraftId: string
  ): Promise<string | null> => {
    try {
      const sessionId = getOrCreateTempSessionId()
      const response = await fetch('/api/temp-generation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionId ?? undefined,
          draftId: nextDraftId,
          source: sourceValue,
          placeData: generatedPlaceData,
        }),
      })

      if (!response.ok) {
        return null
      }

      const data = await response.json()
      if (typeof data.key === 'string' && data.key.length > 0) {
        setTempGenerationKey(data.key)
        return data.key
      }
    } catch (error) {
      console.error('Error saving temporary generation:', error)
    }

    return null
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedQuery = query.trim()
    if (!trimmedQuery) return
    const inputMode: 'google' | 'url' = isCompleteHttpUrl(trimmedQuery)
      ? 'url'
      : 'google'
    setLastSearchMode(inputMode)
    trackFunnelEvent('crear_search_submitted', {
      locale: language,
      has_source: Boolean(pageSearchParams.get('source')),
      input_mode: inputMode,
    })

    setIsSearching(true)
    setHasSearched(true)
    setSearchError(null)
    setPlaces([])
    setRateLimitExceeded(false)

    if (inputMode === 'url') {
      const nextDraftId = `url-${Date.now()}`
      setDraftId(nextDraftId)
      setSelectedPlace({ place_id: trimmedQuery, name: trimmedQuery })
      setStep('analyzing')
      setAnalysisInputMode('url')
      setPlaceDetails(null)
      setAnalysisProgress(0)

      const progressInterval = window.setInterval(() => {
        setAnalysisProgress((current) => Math.min(92, current + 2))
      }, 350)

      try {
        const startRes = await fetch('/api/demo/places/crawl', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: trimmedQuery, lang: language }),
        })
        const startData = await startRes.json()

        if (startRes.status === 429) {
          setRateLimitExceeded(true)
          setRateLimitResetAt(startData.resetAt || null)
          throw new Error(startData.message || genericUrlError)
        }

        if (!startRes.ok || !startData.jobId) {
          throw new Error(
            typeof startData.error === 'string'
              ? startData.error
              : genericUrlError
          )
        }

        const pollStart = Date.now()
        let finalResult: any | null = null

        while (Date.now() - pollStart < urlPollMaxWaitMs) {
          await new Promise((resolve) =>
            window.setTimeout(resolve, urlPollIntervalMs)
          )

          const statusRes = await fetch(
            `/api/demo/places/crawl?jobId=${encodeURIComponent(startData.jobId)}&url=${encodeURIComponent(trimmedQuery)}`,
            { cache: 'no-store' }
          )
          const statusData = await statusRes.json()

          if (!statusRes.ok) {
            throw new Error(
              typeof statusData.error === 'string'
                ? statusData.error
                : genericUrlError
            )
          }

          if (statusData.status === 'completed' && statusData.result) {
            finalResult = statusData.result
            break
          }
        }

        if (!finalResult) {
          throw new Error(
            'El análisis está tardando más de lo esperado. Vuelve a intentarlo.'
          )
        }

        setAnalysisProgress(100)
        setPlaceDetails(finalResult)
        await saveTemporaryGeneration(finalResult, nextDraftId)

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(
            `draft:${nextDraftId}`,
            JSON.stringify({
              draftId: nextDraftId,
              placeId:
                finalResult?.place_id ?? finalResult?.website ?? trimmedQuery,
              name: finalResult?.name ?? trimmedQuery,
              sector: finalResult?.types?.[0] ?? '',
              source: sourceValue,
              updatedAt: Date.now(),
            })
          )
        }

        setStep('preview')
        trackFunnelEvent('crear_preview_generated', {
          locale: language,
          draft_id: nextDraftId,
          input_mode: 'url',
        })
      } catch (error) {
        console.error('Error crawling URL with Firecrawl:', error)
        setSearchError(
          error instanceof Error && error.message
            ? error.message
            : genericUrlError
        )
        setStep('search')
      } finally {
        window.clearInterval(progressInterval)
        setIsSearching(false)
      }

      return
    }

    try {
      const res = await fetch(
        `/api/demo/places/search?q=${encodeURIComponent(trimmedQuery)}&lang=${language}`
      )
      const data = await res.json()

      if (res.status === 429) {
        setRateLimitExceeded(true)
        setRateLimitResetAt(data.resetAt || null)
        setSearchError(
          data.message || 'Has alcanzado el límite de búsquedas de demostración.'
        )
        setPlaces([])
      } else {
        setPlaces(Array.isArray(data.results) ? data.results : [])
      }
    } catch (error) {
      console.error('Error searching places:', error)
      setPlaces([])
      setSearchError(
        'No pudimos buscar negocios en Google en este momento.'
      )
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelectPlace = async (place: any) => {
    const nextDraftId = `${place.place_id}-${Date.now()}`
    setDraftId(nextDraftId)
    setSelectedPlace(place)
    setStep('analyzing')
    setAnalysisInputMode('google')
    setPlaceDetails(null)
    setAnalysisProgress(0)

    const analysisDurationMs = 3000
    const analysisStart = Date.now()
    const progressInterval = window.setInterval(() => {
      const elapsed = Date.now() - analysisStart
      const progress = Math.min(
        95,
        Math.round((elapsed / analysisDurationMs) * 100)
      )
      setAnalysisProgress(progress)
    }, 120)

    const analysisPromise = new Promise<void>((resolve) => {
      window.setTimeout(() => {
        setAnalysisProgress(100)
        resolve()
      }, analysisDurationMs)
    })

    try {
      const detailsPromise = (async () => {
        const res = await fetch(
          `/api/demo/places/details?place_id=${place.place_id}&lang=${language}`
        )
        const data = await res.json()

        if (res.status === 429) {
          setRateLimitExceeded(true)
          setRateLimitResetAt(data.resetAt || null)
          throw new Error(data.message || 'Rate limit exceeded')
        }

        if (!data.result) {
          throw new Error('Place details not found')
        }
        setPlaceDetails(data.result)
        await saveTemporaryGeneration(data.result, nextDraftId)
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(
            `draft:${nextDraftId}`,
            JSON.stringify({
              draftId: nextDraftId,
              placeId: place.place_id,
              name: data.result?.name ?? place.name,
              sector: data.result?.types?.[0] ?? '',
              source: sourceValue,
              updatedAt: Date.now(),
            })
          )
        }
      })()

      await Promise.all([analysisPromise, detailsPromise])
      setStep('preview')
      trackFunnelEvent('crear_preview_generated', {
        locale: language,
        draft_id: nextDraftId,
        input_mode: 'google',
      })
    } catch (error) {
      console.error('Error fetching place details:', error)
      setSearchError(
        'No pudimos cargar los datos del negocio. Inténtalo de nuevo.'
      )
      setStep('search') // Revert on error
    } finally {
      window.clearInterval(progressInterval)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-gray-900">
      <Navbar />

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        {step === 'search' && (
          <div key="search" className="mx-auto max-w-2xl">
            <div className="mb-8 text-center sm:mb-10">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 sm:mb-4 sm:px-4 sm:py-2 sm:text-sm">
                <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="whitespace-nowrap">
                  Web lista en menos de 2 min
                </span>
              </div>
              <h1 className="px-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                {t.crear.title}
              </h1>
              <p className="mx-auto mt-3 max-w-2xl px-4 text-base text-gray-600 sm:mt-4 sm:text-lg lg:text-xl">
                {t.crear.subtitle}
              </p>
              <div className="mt-4 flex flex-col items-center justify-center gap-3 px-4 text-xs text-gray-500 sm:mt-6 sm:flex-row sm:gap-6 sm:text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-500 sm:h-5 sm:w-5" />
                  <span className="whitespace-nowrap">
                    Sin tarjeta de crédito
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-500 sm:h-5 sm:w-5" />
                  <span className="whitespace-nowrap">
                    Prueba gratis 14 días
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSearch} className="relative mb-6 sm:mb-8">
              <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-0">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 text-gray-400 sm:left-4 sm:h-5 sm:w-5" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t.crear.searchPlaceholder}
                    className="w-full rounded-full border-2 border-gray-200 py-3 pr-3 pl-9 text-sm shadow-sm transition-colors focus:border-emerald-500 focus:ring-0 focus:outline-none sm:py-4 sm:pr-16 sm:pl-12 sm:text-base lg:text-lg"
                  />
                </div>
                <Button
                  type="submit"
                  variant="default"
                  disabled={isSearching || !query.trim()}
                  className="h-11 w-full rounded-full bg-gray-900 px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gray-800 disabled:opacity-50 sm:absolute sm:top-1/2 sm:right-2 sm:h-12 sm:w-12 sm:-translate-y-1/2 sm:px-0 sm:shadow-none"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin sm:inline-block" />
                      <span className="ml-2 sm:hidden">Buscando...</span>
                    </>
                  ) : (
                    <>
                      <Search className="h-5 w-5 sm:inline-block" />
                      <span className="ml-2 sm:hidden">
                        {t.crear.searchButton}
                      </span>
                    </>
                  )}
                </Button>
              </div>
            </form>
            {searchError && !rateLimitExceeded && (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:mb-6">
                {searchError}
              </div>
            )}

            {rateLimitExceeded && (
              <div className="mb-4 rounded-2xl border-2 border-amber-300 bg-amber-50 p-5 shadow-sm sm:mb-6 sm:rounded-3xl sm:p-6 lg:p-8">
                <div className="mb-4 flex items-start gap-3 sm:gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-amber-200 sm:h-12 sm:w-12">
                    <Zap className="h-5 w-5 text-amber-700 sm:h-6 sm:w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-base font-bold text-gray-900 sm:text-lg lg:text-xl">
                      ¡Vaya! Has alcanzado el límite de demostración
                    </h3>
                    <p className="mb-1 text-sm text-gray-700 sm:text-base">
                      Has usado tus 5 búsquedas gratuitas. Vemos que tienes mucho interés en crear tu web.
                    </p>
                    {rateLimitResetAt && (
                      <p className="mt-2 text-xs text-gray-600 sm:text-sm">
                        {`Podrás volver a probar en ${Math.ceil((rateLimitResetAt - Date.now()) / (1000 * 60 * 60))} horas, o regístrate ahora para acceso ilimitado.`}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div className="rounded-xl border border-amber-200 bg-white/80 p-4">
                    <h4 className="mb-2 text-sm font-bold text-gray-900 sm:text-base">
                      Regístrate y obtén:
                    </h4>
                    <ul className="space-y-1.5 text-xs text-gray-700 sm:text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-600" />
                        <span>
                          Búsquedas ilimitadas
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-600" />
                        <span>
                          Publica tu web en minutos
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-600" />
                        <span>
                          14 días de prueba gratis
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-600" />
                        <span>
                          Sin tarjeta de crédito
                        </span>
                      </li>
                    </ul>
                  </div>
                  <Button
                    asChild
                    variant="default"
                    className="w-full rounded-full bg-gray-900 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-gray-800 sm:py-4 sm:text-base"
                  >
                    <Link href={signupHref}>
                      Crear mi cuenta gratis →
                    </Link>
                  </Button>
                </div>
              </div>
            )}

            {places.length > 0 && (
              <div className="rounded-2xl bg-white p-2 shadow-sm ring-1 ring-gray-200 sm:rounded-3xl sm:p-3 lg:p-4">
                <h3 className="mb-2 px-2 text-[10px] font-bold tracking-wider text-gray-500 uppercase sm:mb-3 sm:px-3 sm:text-xs lg:mb-4 lg:px-4">
                  {t.crear.resultsTitle}
                </h3>
                <div className="space-y-1.5 sm:space-y-2">
                  {places.map((place) => (
                    <button
                      type="button"
                      className="flex w-full items-start gap-2.5 rounded-xl p-2.5 text-left transition-colors hover:bg-gray-50 focus:bg-emerald-50 focus:outline-none active:bg-gray-100 sm:gap-3 sm:rounded-2xl sm:p-3 lg:gap-4 lg:p-4"
                      key={place.place_id}
                      onClick={() => handleSelectPlace(place)}
                    >
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 sm:h-10 sm:w-10 lg:h-12 lg:w-12">
                        <MapPin className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm leading-tight font-bold break-words text-gray-900 sm:text-base lg:text-lg">
                          {place.name}
                        </h4>
                        <p className="mt-0.5 line-clamp-2 text-[11px] break-words text-gray-500 sm:mt-1 sm:text-xs lg:text-sm">
                          {place.formatted_address}
                        </p>
                        {place.rating && (
                          <div className="mt-1.5 flex flex-wrap items-center gap-1 text-xs font-medium text-amber-600 sm:mt-2 sm:text-sm">
                            <Star className="h-3.5 w-3.5 flex-shrink-0 fill-amber-500 text-amber-500 sm:h-4 sm:w-4" />
                            <span className="break-words">
                              {place.rating} ({place.user_ratings_total})
                            </span>
                          </div>
                        )}
                      </div>
                      <ArrowRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400 sm:mt-1 sm:h-5 sm:w-5" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {showNoResults && (
              <div className="mt-4 sm:mt-6">
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:rounded-3xl sm:p-6 lg:p-8">
                  <h3 className="text-base font-bold text-gray-900 sm:text-lg lg:text-xl">
                    {t.crear.noResultsTitle}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 sm:text-base">
                    {t.crear.noResultsSubtitle}
                  </p>
                  <div className="mt-5 border-t border-amber-100 pt-5 sm:mt-6 sm:pt-6">
                    <p className="mb-3 text-sm font-semibold text-gray-900 sm:text-base">
                      ¿Prefieres que te ayudemos personalmente?
                    </p>
                    <Button
                      asChild
                      variant="default"
                      className="w-full rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 sm:w-auto"
                    >
                      <Link href={signupHref}>Crear mi web con ayuda →</Link>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {!hasSearched && !isSearching && (
              <div className="mt-8 space-y-6 sm:mt-12 sm:space-y-8">
                {/* Social Proof */}
                <div className="px-4 text-center">
                  <div className="mb-2 flex items-center justify-center gap-0.5 sm:gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-400 text-amber-400 sm:h-5 sm:w-5"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 sm:text-sm">
                    Más de 1,200 negocios ya tienen su web con nosotros
                  </p>
                </div>

                {/* Quick Benefits */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                  <div className="rounded-xl bg-white p-5 text-center shadow-sm ring-1 ring-gray-200 sm:rounded-2xl sm:p-6">
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 sm:mb-4 sm:h-12 sm:w-12">
                      <Zap className="h-5 w-5 text-emerald-600 sm:h-6 sm:w-6" />
                    </div>
                    <h3 className="mb-1 text-sm font-bold text-gray-900 sm:mb-2 sm:text-base">
                      Rápido
                    </h3>
                    <p className="text-xs text-gray-600 sm:text-sm">
                      Tu web lista en menos de 2 minutos
                    </p>
                  </div>
                  <div className="rounded-xl bg-white p-5 text-center shadow-sm ring-1 ring-gray-200 sm:rounded-2xl sm:p-6">
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 sm:mb-4 sm:h-12 sm:w-12">
                      <Search className="h-5 w-5 text-blue-600 sm:h-6 sm:w-6" />
                    </div>
                    <h3 className="mb-1 text-sm font-bold text-gray-900 sm:mb-2 sm:text-base">
                      SEO Optimizado
                    </h3>
                    <p className="text-xs text-gray-600 sm:text-sm">
                      Aparece en Google desde el día 1
                    </p>
                  </div>
                  <div className="rounded-xl bg-white p-5 text-center shadow-sm ring-1 ring-gray-200 sm:rounded-2xl sm:p-6">
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 sm:mb-4 sm:h-12 sm:w-12">
                      <Phone className="h-5 w-5 text-purple-600 sm:h-6 sm:w-6" />
                    </div>
                    <h3 className="mb-1 text-sm font-bold text-gray-900 sm:mb-2 sm:text-base">
                      Más Clientes
                    </h3>
                    <p className="text-xs text-gray-600 sm:text-sm">
                      Formularios y llamadas directas
                    </p>
                  </div>
                </div>

                {/* CTA alternativo */}
                <div className="rounded-2xl bg-slate-900 p-6 text-center text-white shadow-sm sm:rounded-3xl sm:p-8 lg:p-10">
                  <h3 className="mb-2 px-2 text-xl font-bold sm:mb-3 sm:text-2xl lg:text-3xl">
                    ¿No encuentras tu negocio en Google?
                  </h3>
                  <p className="mx-auto mb-5 max-w-xl px-2 text-sm text-gray-300 sm:mb-6 sm:text-base">
                    No hay problema. Podemos crear tu web desde cero con toda la
                    información que necesites.
                  </p>
                  <Button
                    asChild
                    variant="default"
                    className="w-full rounded-full bg-emerald-500 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-400 sm:w-auto sm:px-8 sm:py-4 sm:text-base"
                  >
                    <Link href={signupHref}>Crear mi web ahora →</Link>
                  </Button>
                  <p className="mt-3 text-xs text-gray-400 sm:mt-4 sm:text-sm">
                    Sin compromiso • Cancela cuando quieras
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 'analyzing' && (
          <div
            key="analyzing"
            className="flex flex-col items-center justify-center px-4 py-8 text-center sm:py-12 lg:py-20"
          >
            <div className="relative flex h-20 w-20 items-center justify-center sm:h-24 sm:w-24 lg:h-32 lg:w-32">
              <div className="absolute inset-3 animate-spin rounded-full border-3 border-emerald-500 border-t-transparent sm:inset-4 sm:border-4" />
              <Zap className="h-7 w-7 text-emerald-600 sm:h-8 sm:w-8 lg:h-10 lg:w-10" />
            </div>
            <h2 className="mt-5 px-4 text-xl font-extrabold text-gray-900 sm:mt-6 sm:text-2xl lg:mt-8 lg:text-3xl">
              {t.crear.analyzingTitle}
            </h2>
            <p className="mt-3 max-w-md px-4 text-sm text-gray-600 sm:mt-4 sm:text-base lg:text-lg">
              {t.crear.analyzingSubtitle}
            </p>

            <div className="mt-6 w-full max-w-md px-4 sm:mt-8">
              <div className="mb-2 text-right text-xs font-medium text-gray-600 sm:text-sm">
                {analysisProgress}%
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 sm:h-2">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-colors duration-200"
                  style={{ width: `${analysisProgress}%` }}
                />
              </div>
            </div>

            <div className="mt-8 w-full max-w-sm space-y-3 px-4 text-left sm:mt-10 sm:space-y-4">
              <div className="flex items-center gap-2.5 text-sm font-medium text-emerald-600 sm:gap-3 sm:text-base">
                {analysisProgress >= 20 ? (
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5" />
                ) : (
                  <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin sm:h-5 sm:w-5" />
                )}
                <span>
                  {analysisInputMode === 'url'
                    ? t.crear.step1Web
                    : t.crear.step1Google}
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-medium text-emerald-600 sm:gap-3 sm:text-base">
                {analysisProgress >= 55 ? (
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5" />
                ) : (
                  <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin sm:h-5 sm:w-5" />
                )}
                <span>{t.crear.step2}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm font-medium text-emerald-600 sm:gap-3 sm:text-base">
                {analysisProgress >= 90 ? (
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5" />
                ) : (
                  <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin sm:h-5 sm:w-5" />
                )}
                <span>{t.crear.step3}</span>
              </div>
            </div>
          </div>
        )}

        {step === 'preview' && placeDetails && (
          <div key="preview" className="grid gap-6 sm:gap-8 lg:grid-cols-3">
            {/* Sidebar / Info extracted */}
            <div className="order-2 space-y-4 sm:space-y-6 lg:order-1 lg:col-span-1">
              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200 sm:rounded-3xl sm:p-5 lg:p-6">
                <div className="mb-4 flex items-center gap-2 text-[10px] font-bold tracking-wider text-emerald-600 uppercase sm:mb-5 sm:text-xs lg:mb-6">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5" />
                  <span>{t.crear.extractedData}</span>
                </div>

                <h2 className="text-xl font-bold break-words text-gray-900 sm:text-2xl">
                  {placeDetails.name}
                </h2>

                <div className="mt-5 space-y-3 sm:mt-6 sm:space-y-4">
                  <div className="flex items-start gap-2.5 text-gray-600 sm:gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400 sm:h-5 sm:w-5" />
                    <span className="text-xs break-words sm:text-sm">
                      {placeDetails.formatted_address}
                    </span>
                  </div>
                  {placeDetails.formatted_phone_number && (
                    <div className="flex items-center gap-2.5 text-gray-600 sm:gap-3">
                      <Phone className="h-4 w-4 flex-shrink-0 text-gray-400 sm:h-5 sm:w-5" />
                      <span className="text-xs sm:text-sm">
                        {placeDetails.formatted_phone_number}
                      </span>
                    </div>
                  )}
                  {placeDetails.rating && (
                    <div className="flex items-center gap-2.5 text-gray-600 sm:gap-3">
                      <Star className="h-4 w-4 flex-shrink-0 fill-amber-500 text-amber-500 sm:h-5 sm:w-5" />
                      <span className="text-xs font-medium text-gray-900 sm:text-sm">
                        {placeDetails.rating}
                      </span>
                      <span className="text-xs sm:text-sm">
                        (
                        {placeDetails.user_ratings_total ||
                          placeDetails.reviews?.length ||
                          0}{' '}
                        {t.crear.reviewsAnalyzed})
                      </span>
                    </div>
                  )}
                  {priceLevelValue && (
                    <div className="flex items-center gap-2.5 text-gray-600 sm:gap-3">
                      <span className="text-xs text-gray-400 sm:text-sm">
                        {t.crear.priceLevel}:
                      </span>
                      <span className="text-xs font-medium text-gray-900 sm:text-sm">
                        {priceLevelValue}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-2xl bg-gray-900 p-5 text-white shadow-sm sm:rounded-3xl sm:p-6">
                <h3 className="text-base font-bold sm:text-lg">
                  {t.crear.allCorrect}
                </h3>
                <p className="mt-2 text-xs text-gray-400 sm:text-sm">
                  {t.crear.generatedProposal}
                </p>
                <div className="mt-5 space-y-2.5 sm:mt-6 sm:space-y-3">
                  <Button
                    asChild
                    type="button"
                    variant="default"
                    className="h-11 w-full rounded-full bg-emerald-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-400 sm:h-12"
                  >
                    <Link
                      href={publishSignupHref}
                      onClick={() =>
                        trackFunnelEvent('crear_publish_clicked', {
                          locale: language,
                          draft_id: draftId ?? '',
                          plan_suggested: planSuggested,
                          input_mode: analysisInputMode,
                        })
                      }
                    >
                      {t.crear.publishNow}
                    </Link>
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setStep('search')}
                    variant="ghost"
                    className="h-11 w-full rounded-full border border-white/20 bg-transparent px-4 text-sm font-semibold text-white transition-colors hover:bg-white/10 sm:h-12"
                  >
                    {t.crear.searchAnother}
                  </Button>
                </div>
              </div>
            </div>

            {/* Preview Area */}
            <div className="order-1 lg:order-2 lg:col-span-2">
              <div className="mb-2 px-1 text-[10px] text-slate-500 sm:mb-3 sm:text-xs">
                {t.crear.minimalistNote}
              </div>
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm sm:rounded-2xl lg:rounded-3xl">
                {/* Browser Chrome */}
                <div className="flex items-center gap-1.5 border-b border-gray-100 bg-gray-50 px-2.5 py-2 sm:gap-2 sm:px-3 sm:py-2.5 lg:px-4 lg:py-3">
                  <div className="flex gap-1 sm:gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-red-400 sm:h-2.5 sm:w-2.5 lg:h-3 lg:w-3" />
                    <div className="h-2 w-2 rounded-full bg-amber-400 sm:h-2.5 sm:w-2.5 lg:h-3 lg:w-3" />
                    <div className="h-2 w-2 rounded-full bg-emerald-400 sm:h-2.5 sm:w-2.5 lg:h-3 lg:w-3" />
                  </div>
                  <div className="ml-1.5 flex flex-1 items-center gap-1.5 truncate rounded-md bg-white px-2 py-0.5 text-[9px] text-gray-400 shadow-sm sm:ml-2 sm:gap-2 sm:px-2.5 sm:py-1 sm:text-[10px] lg:ml-4 lg:px-3 lg:text-xs">
                    <Globe className="h-2.5 w-2.5 flex-shrink-0 sm:h-3 sm:w-3" />
                    <span className="truncate">
                      {placeDetails.name.toLowerCase().replace(/\s+/g, '')}
                      .bunnatic.com
                    </span>
                  </div>
                </div>

                {/* Generated Site Preview */}
                <div className="h-[400px] overflow-y-auto overscroll-contain bg-white sm:h-[500px] lg:h-[600px]">
                  {/* Hero Section */}
                  <div className="relative bg-slate-900 px-4 py-10 text-center text-white sm:px-6 sm:py-14 lg:px-8 lg:py-20">
                    <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/business/1200/800')] bg-cover bg-center opacity-20" />
                    <div className="absolute inset-0 bg-slate-900/60" />
                    <div className="relative z-10">
                      <h1 className="px-2 text-2xl font-extrabold break-words sm:text-3xl lg:text-4xl xl:text-5xl">
                        {placeDetails.name}
                      </h1>
                      <p className="mx-auto mt-2.5 max-w-xl px-4 text-sm text-gray-300 sm:mt-3 sm:text-base lg:mt-4 lg:text-lg">
                        {placeDetails.types?.[0]
                          ? t.crear.heroSubtitle.replace(
                              '{type}',
                              placeDetails.types[0].replace(/_/g, ' ')
                            )
                          : t.crear.heroFallback}
                      </p>
                      <Button
                        type="button"
                        variant="default"
                        className="mt-5 rounded-full bg-emerald-500 px-5 py-2 text-xs font-bold text-white sm:mt-6 sm:px-6 sm:py-2.5 sm:text-sm lg:mt-8 lg:px-8 lg:py-3 lg:text-base"
                      >
                        {t.crear.contactNow}
                      </Button>
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
                    <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 sm:text-xl lg:text-2xl">
                          {t.crear.aboutUs}
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:mt-4 sm:text-base">
                          {aboutText}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4 sm:p-6">
                        <h4 className="mb-3 font-bold text-gray-900 sm:mb-4">
                          {t.crear.contactInfo}
                        </h4>
                        <div className="space-y-3 text-sm text-gray-600">
                          <p className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-emerald-500" />{' '}
                            {placeDetails.formatted_address}
                          </p>
                          {placeDetails.formatted_phone_number && (
                            <p className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-emerald-500" />{' '}
                              {placeDetails.formatted_phone_number}
                            </p>
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
                          {typeof openNow === 'boolean' && (
                            <p className="flex items-center gap-2">
                              <CheckCircle2
                                className={`h-4 w-4 ${openNow ? 'text-emerald-500' : 'text-gray-400'}`}
                              />
                              {t.crear.schedule}:{' '}
                              {openNow ? t.crear.openNow : t.crear.closedNow}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Services Section */}
                  {hasDetectedServices && (
                    <div className="border-t border-gray-100 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
                      <div className="mx-auto max-w-4xl">
                        <h3 className="text-center text-lg font-bold text-gray-900 sm:text-xl lg:text-2xl">
                          {t.crear.servicesTitle}
                        </h3>
                        <p className="mt-1.5 text-center text-xs text-gray-500 sm:mt-2 sm:text-sm">
                          {t.crear.servicesSubtitle}
                        </p>
                        <div className="mt-5 grid grid-cols-1 gap-2.5 sm:mt-6 sm:grid-cols-2 sm:gap-3 lg:mt-8 lg:gap-4">
                          {detectedServices.map((serviceName) => (
                            <div
                              key={serviceName}
                              className="rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 sm:rounded-2xl sm:px-4 sm:py-3"
                            >
                              <p className="flex items-center gap-2 text-xs font-medium text-gray-800 sm:text-sm">
                                <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-emerald-500 sm:h-4 sm:w-4" />
                                <span className="break-words">
                                  {serviceName}
                                </span>
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Reviews Section */}
                  {placeDetails.reviews?.some(
                    (review: any) =>
                      typeof review?.text === 'string' &&
                      review.text.trim().length > 0
                  ) && (
                    <div className="bg-gray-50 px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
                      <h3 className="mb-5 text-center text-lg font-bold text-gray-900 sm:mb-8 sm:text-xl lg:mb-10 lg:text-2xl">
                        {t.crear.whatClientsSay}
                      </h3>
                      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-5 lg:gap-6">
                        {placeDetails.reviews
                          .filter(
                            (review: any) =>
                              typeof review?.text === 'string' &&
                              review.text.trim().length > 0
                          )
                          .slice(0, 2)
                          .map((review: any, idx: number) => (
                            <div
                              key={idx}
                              className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-5 lg:p-6"
                            >
                              <div className="mb-2.5 flex items-center gap-0.5 sm:mb-3 sm:gap-1">
                                {[...Array(review.rating)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className="h-3.5 w-3.5 fill-amber-500 text-amber-500 sm:h-4 sm:w-4"
                                  />
                                ))}
                              </div>
                              <p className="line-clamp-4 text-xs whitespace-pre-line text-gray-600 italic sm:text-sm">
                                &quot;{review.text}&quot;
                              </p>
                              <p className="mt-3 text-xs font-bold text-gray-900 sm:mt-4 sm:text-sm">
                                - {review.author_name}
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'dashboard' && placeDetails && (
          <div key="dashboard" className="mx-auto max-w-4xl">
            <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-200 sm:rounded-3xl sm:p-8 lg:p-12">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 sm:mb-6 sm:h-16 sm:w-16 lg:h-20 lg:w-20">
                <CheckCircle2 className="h-7 w-7 text-emerald-600 sm:h-8 sm:w-8 lg:h-10 lg:w-10" />
              </div>
              <h2 className="px-4 text-2xl font-extrabold text-gray-900 sm:text-3xl lg:text-4xl">
                {t.crear.publishedTitle}
              </h2>
              <p className="mt-3 px-4 text-base text-gray-600 sm:mt-4 sm:text-lg">
                {t.crear.publishedSubtitle.replace('{name}', placeDetails.name)}
              </p>

              <div className="mt-6 flex flex-col items-center justify-center gap-2 rounded-xl border border-gray-100 bg-gray-50 p-4 sm:mt-8 sm:flex-row sm:gap-3 sm:rounded-2xl">
                <Globe className="h-5 w-5 flex-shrink-0 text-gray-400 sm:h-6 sm:w-6" />
                <a
                  href="#"
                  className="text-base font-medium break-all text-emerald-600 hover:underline sm:text-lg lg:text-xl"
                >
                  {placeDetails.name.toLowerCase().replace(/\s+/g, '')}
                  .bunnatic.com
                </a>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-3 text-left sm:mt-10 sm:grid-cols-3 sm:gap-4 lg:mt-12 lg:gap-6">
                <div className="rounded-xl border border-gray-100 bg-slate-50 p-4 sm:rounded-2xl sm:p-5 lg:p-6">
                  <h3 className="text-[10px] font-bold tracking-wider text-gray-500 uppercase sm:text-xs">
                    {t.crear.visitsToday}
                  </h3>
                  <p className="mt-2 text-2xl font-extrabold text-gray-900 sm:text-3xl">
                    0
                  </p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-slate-50 p-4 sm:rounded-2xl sm:p-5 lg:p-6">
                  <h3 className="text-[10px] font-bold tracking-wider text-gray-500 uppercase sm:text-xs">
                    {t.crear.contacts}
                  </h3>
                  <p className="mt-2 text-2xl font-extrabold text-gray-900 sm:text-3xl">
                    0
                  </p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-slate-50 p-4 sm:rounded-2xl sm:p-5 lg:p-6">
                  <h3 className="text-[10px] font-bold tracking-wider text-gray-500 uppercase sm:text-xs">
                    {t.crear.seoStatus}
                  </h3>
                  <p className="mt-2 flex items-center gap-2 text-base font-bold text-emerald-600 sm:text-lg">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />{' '}
                    {t.crear.optimized}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4 lg:mt-12">
                <Button
                  type="button"
                  variant="default"
                  className="w-full rounded-full bg-gray-900 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-800 sm:w-auto sm:px-8 sm:py-4"
                >
                  {t.crear.goToDashboard}
                </Button>
                <Button
                  type="button"
                  onClick={() => setStep('search')}
                  variant="outline"
                  className="w-full rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-900 transition-colors hover:bg-gray-50 sm:w-auto sm:px-8 sm:py-4"
                >
                  {t.crear.createAnother}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
