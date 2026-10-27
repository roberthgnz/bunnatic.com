'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import {
  AlertCircle,
  ArrowRight,
  Check,
  Clock,
  Euro,
  Globe2,
  Leaf,
  Loader2,
  MapPin,
  Phone,
  RotateCcw,
  Search,
  Sparkles,
  Star,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CreateStepper from '@/components/create/CreateStepper'
import CreateResultsList from '@/components/create/CreateResultsList'
import CreateAnalyzing, {
  slugifyHost,
} from '@/components/create/CreateAnalyzing'
import GeneratedSitePreview from '@/components/create/GeneratedSitePreview'
import { trackFunnelEvent } from '@/lib/funnelEvents'
import { cn } from '@/lib/utils'

const createPageContent = {
  es: {
    crear: {
      title: 'Empecemos por',
      titleAccent: 'tu negocio.',
      subtitle:
        'Busca tu negocio en Google o pega la dirección de tu web. Con sus datos públicos preparamos una primera versión de tu nueva web en un momento.',
      searchLabel: 'Nombre y ciudad de tu negocio, o la dirección de tu web',
      searchPlaceholder: 'Ej.: Pizzería Napoli, Madrid',
      searchButton: 'Buscar',
      analyzeButton: 'Analizar mi web',
      analyzingTitle: 'Estamos preparando tu propuesta',
      analyzingSubtitleGoogle:
        'Leemos tu ficha pública de Google (dirección, horario y reseñas) y redactamos los primeros textos de tu web.',
      analyzingSubtitleWeb:
        'Leemos el contenido público de tu web actual y lo ordenamos para redactar los primeros textos de tu nueva web.',
      step1Google: 'Consultando tu ficha de Google',
      step1Web: 'Leyendo tu web actual',
      step2: 'Ordenando dirección, contacto y horarios',
      step3: 'Redactando textos y eligiendo el diseño',
      extractedData: 'Datos encontrados',
      reviewsAnalyzed: 'reseñas',
      allCorrect: '¿Te gusta cómo queda?',
      generatedProposalGoogle:
        'Hemos preparado esta propuesta a partir de tu ficha de Google. Crea tu cuenta para guardarla, editarla y publicarla.',
      generatedProposalWeb:
        'Hemos preparado esta propuesta a partir de tu web actual. Crea tu cuenta para guardarla, editarla y publicarla.',
      publishNow: 'Publicar mi web',
      searchAnother: 'Buscar otro negocio',
      previewTitle: 'La web de {name},',
      previewTitleAccent: 'lista para revisar.',
      heroSubtitle: 'Tu {type} de confianza en {city}.',
      heroFallback: 'Tu negocio, ahora con una presencia online profesional.',
      contactNow: 'Contactar',
      aboutUs: 'Sobre nosotros',
      aboutUsText:
        'Nuestros clientes nos valoran con {rating} estrellas en Google. Te esperamos en {city} con el trato cercano de siempre.',
      aboutUsGeneric:
        'Un negocio local con trato cercano en {city}. Aquí contarás tu historia y lo que te hace diferente; podrás editarlo cuando quieras.',
      contactInfo: 'Información de contacto',
      website: 'Web actual',
      schedule: 'Horario',
      openNow: 'Abierto ahora',
      closedNow: 'Cerrado ahora',
      priceLevel: 'Nivel de precio',
      servicesTitle: 'Servicios',
      servicesSubtitle: 'Detectados a partir de tu información pública.',
      whatClientsSay: 'Lo que dicen nuestros clientes',
      minimalistNote:
        'Es una primera versión. Al crear tu cuenta podrás cambiar textos, fotos y servicios, añadir secciones y conectar tu dominio.',
      publishedTitle: 'Tu web está en marcha',
      publishedSubtitle:
        'Gestiona la web de {name} desde tu panel: textos, servicios, dominio y contactos.',
      goToDashboard: 'Ir a mi panel',
      createAnother: 'Crear otra web',
      noResultsTitle: 'No encontramos coincidencias',
      noResultsSubtitle:
        'Prueba con el nombre exacto del negocio y la ciudad, o pega la dirección completa de tu web.',
    },
  },
} as const

type PlaceSearchResult = {
  place_id: string
  name: string
  formatted_address?: string
  rating?: number
  user_ratings_total?: number
  types?: string[]
}

type PlaceReview = {
  text?: string
  rating?: number
  author_name?: string
}

type PlaceDetails = PlaceSearchResult & {
  editorial_summary?: {
    overview?: string
  }
  opening_hours?: {
    open_now?: boolean
  }
  price_level?: number
  website?: string
  formatted_phone_number?: string
  reviews?: PlaceReview[]
  [key: string]: unknown
}

function isCompleteHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

function safeHost(value: string): string | null {
  try {
    return new URL(value).host.replace(/^www\./, '')
  } catch {
    return null
  }
}

/** "Calle Mayor 1, 28013 Madrid, España" -> "Madrid" */
function getCityFromAddress(address?: string): string | null {
  if (!address) return null
  const parts = address
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
  if (parts.length < 2) return null
  const candidate = parts[parts.length - 2].replace(/^\d{4,5}\s*/, '').trim()
  return candidate || null
}

export default function CreateWebClient({
  initialSearch,
}: {
  initialSearch: string
}) {
  const language = 'es'
  const pageSearchParams = useMemo(
    () => new URLSearchParams(initialSearch),
    [initialSearch]
  )
  const t = createPageContent[language]
  const [step, setStep] = useState<
    'search' | 'analyzing' | 'preview' | 'dashboard'
  >('search')
  const [query, setQuery] = useState(() =>
    (pageSearchParams.get('q') ?? '').slice(0, 200)
  )
  const [places, setPlaces] = useState<PlaceSearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [placeDetails, setPlaceDetails] = useState<PlaceDetails | null>(null)
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
  // Only Spanish dictionary labels are shown as a category (no raw API ids).
  const dictionaryTypeLabel = (types?: string[]): string | null => {
    const dictionary = typeLabels[language]
    const match = (types ?? []).find((rawType) => rawType in dictionary)
    return match ? dictionary[match as keyof typeof dictionary] : null
  }
  const categoryLabel = dictionaryTypeLabel(placeDetails?.types)
  const city = getCityFromAddress(placeDetails?.formatted_address)
  const heroText = categoryLabel
    ? t.crear.heroSubtitle
        .replace('{type}', categoryLabel.toLowerCase())
        .replace('{city}', city ?? 'tu zona')
    : t.crear.heroFallback
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
    (placeDetails?.rating
      ? t.crear.aboutUsText.replace(
          '{rating}',
          placeDetails.rating.toLocaleString('es-ES')
        )
      : t.crear.aboutUsGeneric
    ).replace('{city}', city ?? 'tu ciudad')
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
    !searchError &&
    query.trim().length > 0 &&
    places.length === 0
  const genericUrlError =
    'No pudimos analizar esa URL. Verifica que sea pública y vuelve a intentarlo.'
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
    generatedPlaceData: PlaceDetails,
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
        let finalResult: PlaceDetails | null = null

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
            finalResult = statusData.result as PlaceDetails
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
          data.message ||
            'Has alcanzado el límite de búsquedas de demostración.'
        )
        setPlaces([])
      } else if (
        !res.ok ||
        (data.status && !['OK', 'ZERO_RESULTS'].includes(data.status))
      ) {
        setPlaces([])
        setSearchError(
          'No pudimos buscar negocios en Google en este momento. Vuelve a intentarlo en unos minutos o introduce la dirección de tu web.'
        )
      } else {
        setPlaces(
          Array.isArray(data.results)
            ? (data.results as PlaceSearchResult[])
            : []
        )
      }
    } catch (error) {
      console.error('Error searching places:', error)
      setPlaces([])
      setSearchError('No pudimos buscar negocios en Google en este momento.')
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelectPlace = async (place: PlaceSearchResult) => {
    const nextDraftId = `${place.place_id}-${Date.now()}`
    setDraftId(nextDraftId)
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

  const stepIndex = step === 'search' ? 0 : step === 'analyzing' ? 1 : 2
  const trimmedInput = query.trim()
  const inputIsUrl = isCompleteHttpUrl(trimmedInput)
  const inputHost = inputIsUrl ? safeHost(trimmedInput) : null
  const resultItems = places.map((place) => ({
    place_id: place.place_id,
    name: place.name,
    formatted_address: place.formatted_address,
    rating: place.rating,
    user_ratings_total: place.user_ratings_total,
    categoryLabel: dictionaryTypeLabel(place.types),
  }))
  const previewReviews = (placeDetails?.reviews ?? [])
    .filter(
      (review: PlaceReview) =>
        typeof review?.text === 'string' && review.text.trim().length > 0
    )
    .slice(0, 2)
    .map((review: PlaceReview) => ({
      text: review.text as string,
      rating: review.rating,
      author_name: review.author_name,
    }))
  const searchStatus = isSearching
    ? lastSearchMode === 'url'
      ? 'Analizando tu web…'
      : 'Buscando tu negocio en Google…'
    : places.length > 0
      ? `${places.length} resultados encontrados. Elige tu negocio.`
      : showNoResults
        ? t.crear.noResultsTitle
        : ''

  // Move focus (and the viewport) to the new heading on every stage change.
  const headingRef = useRef<HTMLHeadingElement>(null)
  const previousStep = useRef(step)
  useEffect(() => {
    if (previousStep.current === step) return
    previousStep.current = step
    window.scrollTo({ top: 0 })
    headingRef.current?.focus({ preventScroll: true })
  }, [step])

  return (
    <div className="landing-page home-page flex min-h-screen flex-col bg-white font-sans text-[#0b0b0b]">
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <Navbar />

      <main id="contenido" className="relative flex-1">
        <div className="relative mx-auto w-full max-w-6xl px-5 pt-10 pb-20 sm:px-8 sm:pt-12 lg:pb-32">
          <CreateStepper current={stepIndex} />
          <p aria-live="polite" aria-atomic="true" className="sr-only">
            {searchStatus}
          </p>

          {step === 'search' && (
            <div key="search">
              <div className="mx-auto mt-14 max-w-2xl sm:mt-20">
                <div className="text-center">
                  <p className="mb-6 inline-flex items-center gap-2 text-[13px] font-medium text-(--home-muted)">
                    <Sparkles className="size-3.5" aria-hidden="true" />
                    Demo gratuita · sin registro
                  </p>
                  <h1
                    ref={headingRef}
                    tabIndex={-1}
                    className="text-[clamp(44px,7vw,84px)] leading-[0.95] font-medium tracking-[-0.055em] text-balance outline-none"
                  >
                    {t.crear.title}{' '}
                    <span className="block text-[#8a8a84]">
                      {t.crear.titleAccent}
                    </span>
                  </h1>
                  <p className="mx-auto mt-7 max-w-lg text-base leading-7 text-(--home-muted) sm:text-lg sm:leading-8">
                    {t.crear.subtitle}
                  </p>
                </div>

                <form onSubmit={handleSearch} className="mt-12" role="search">
                  <label
                    htmlFor="crear-business"
                    className="mb-2.5 block px-1 text-sm font-medium sm:px-5"
                  >
                    {t.crear.searchLabel}
                  </label>
                  <div className="flex flex-col gap-1.5 rounded-3xl border border-black/15 bg-white p-1.5 shadow-[0_18px_50px_-28px_rgba(0,0,0,0.25)] transition-[border-color,box-shadow] focus-within:border-[#0b0b0b] focus-within:shadow-[0_0_0_3px_rgba(0,0,0,0.08)] sm:flex-row sm:items-center sm:rounded-full">
                    <div className="flex min-w-0 flex-1 items-center">
                      {inputIsUrl ? (
                        <Globe2
                          className="ml-4 size-4 shrink-0 text-[#0b0b0b]"
                          aria-hidden="true"
                        />
                      ) : (
                        <Search
                          className="ml-4 size-4 shrink-0 text-black/45"
                          aria-hidden="true"
                        />
                      )}
                      <input
                        id="crear-business"
                        type="search"
                        enterKeyHint="search"
                        autoComplete="off"
                        spellCheck={false}
                        aria-describedby="crear-business-hint"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={t.crear.searchPlaceholder}
                        className="min-w-0 flex-1 bg-transparent px-3 py-3.5 text-base text-[#0b0b0b] outline-none! placeholder:text-black/45 sm:text-[15px]"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSearching || !query.trim()}
                      className="home-button shrink-0 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {isSearching ? (
                        <>
                          <Loader2
                            className="size-4 motion-safe:animate-spin"
                            aria-hidden="true"
                          />
                          Buscando…
                        </>
                      ) : (
                        <>
                          {inputIsUrl
                            ? t.crear.analyzeButton
                            : t.crear.searchButton}
                          <ArrowRight className="size-4" aria-hidden="true" />
                        </>
                      )}
                    </button>
                  </div>
                  <p
                    id="crear-business-hint"
                    className="mt-3 px-1 text-xs leading-5 text-(--home-muted) sm:px-5"
                  >
                    {inputIsUrl
                      ? `Analizaremos el contenido público de ${inputHost ?? 'tu web'}.`
                      : trimmedInput
                        ? 'Buscaremos tu negocio en Google. Añade la ciudad si tiene un nombre común.'
                        : 'Escribe el nombre y la ciudad, o pega la dirección completa de tu web (https://…).'}
                  </p>
                </form>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <SourceHint
                    icon={MapPin}
                    title="Desde Google"
                    text="Nombre + ciudad. Ej.: Pizzería Napoli, Madrid"
                    active={Boolean(trimmedInput) && !inputIsUrl}
                  />
                  <SourceHint
                    icon={Globe2}
                    title="Desde tu web"
                    text="La dirección completa. Ej.: https://tunegocio.es"
                    active={inputIsUrl}
                  />
                </div>

                <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-(--home-muted)">
                  {['Demo gratis', 'Sin tarjeta', 'Solo datos públicos'].map(
                    (item) => (
                      <li key={item} className="flex items-center gap-1.5">
                        <Check
                          className="size-3.5 text-[#0b0b0b]"
                          aria-hidden="true"
                        />
                        {item}
                      </li>
                    )
                  )}
                </ul>

                {searchError && !rateLimitExceeded && (
                  <div
                    role="alert"
                    className="border-destructive/25 bg-destructive/5 text-destructive mt-6 flex items-start gap-2.5 rounded-2xl border px-4 py-3 text-sm leading-6"
                  >
                    <AlertCircle
                      className="mt-1 size-4 shrink-0"
                      aria-hidden="true"
                    />
                    <span>{searchError}</span>
                  </div>
                )}

                {rateLimitExceeded && (
                  <div
                    role="alert"
                    className="mt-6 rounded-3xl bg-(--home-soft) p-6 sm:p-8"
                  >
                    <div className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-[#0b0b0b]"
                      >
                        <Clock className="size-4" />
                      </span>
                      <div className="min-w-0">
                        <h2 className="text-xl font-medium tracking-[-0.03em]">
                          Has llegado al límite de la demo
                        </h2>
                        <p className="mt-1.5 text-sm leading-6 text-(--home-muted)">
                          Ya has usado las búsquedas gratuitas de la
                          demostración.
                          {rateLimitResetAt
                            ? ` Podrás volver a probar en unas ${Math.ceil((rateLimitResetAt - Date.now()) / (1000 * 60 * 60))} horas, o crear tu cuenta y seguir desde tu panel.`
                            : ' Crea tu cuenta y sigue desde tu panel.'}
                        </p>
                      </div>
                    </div>
                    <ul className="mt-6 grid gap-2 border-t border-black/10 pt-5 text-xs text-black/70 sm:grid-cols-3">
                      {[
                        'Crea tu web desde tu panel',
                        '14 días de prueba',
                        'Sin tarjeta para empezar',
                      ].map((item) => (
                        <li key={item} className="flex items-center gap-1.5">
                          <Check
                            className="size-3.5 shrink-0 text-[#0b0b0b]"
                            aria-hidden="true"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={signupHref}
                      className="home-button mt-6 w-full sm:w-auto"
                    >
                      Crear mi cuenta gratis
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  </div>
                )}

                {places.length > 0 && (
                  <CreateResultsList
                    items={resultItems}
                    onSelect={(placeId) => {
                      const place = places.find(
                        (item) => item.place_id === placeId
                      )
                      if (place) handleSelectPlace(place)
                    }}
                  />
                )}

                {showNoResults && (
                  <div className="mt-6 rounded-3xl bg-(--home-soft) p-6 sm:p-8">
                    <h2 className="text-xl font-medium tracking-[-0.03em]">
                      {t.crear.noResultsTitle}
                    </h2>
                    <p className="mt-1.5 text-sm leading-6 text-(--home-muted)">
                      {t.crear.noResultsSubtitle}
                    </p>
                    <div className="mt-6 flex flex-col gap-4 border-t border-black/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm font-medium">
                        ¿Prefieres que te ayudemos personalmente?
                      </p>
                      <Link
                        href={signupHref}
                        className="home-button home-button-light"
                      >
                        Crear mi web con ayuda
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {!hasSearched && !isSearching && (
                <div className="mx-auto mt-28 max-w-5xl sm:mt-36">
                  <h2 className="landing-eyebrow text-center">Así funciona</h2>
                  <ol className="mt-8 grid gap-8 sm:grid-cols-3 sm:gap-10">
                    {[
                      {
                        number: '01',
                        title: 'Busca tu negocio',
                        text: 'En Google o a partir de tu web actual.',
                      },
                      {
                        number: '02',
                        title: 'Preparamos tu propuesta',
                        text: 'Textos, servicios y diseño a partir de tus datos públicos.',
                      },
                      {
                        number: '03',
                        title: 'Revisa y publica',
                        text: 'Crea tu cuenta, ajusta lo que quieras y publícala.',
                      },
                    ].map((item) => (
                      <li
                        key={item.number}
                        className="border-t border-black/15 pt-6"
                      >
                        <span
                          aria-hidden="true"
                          className="text-lg font-medium text-black/35 tabular-nums"
                        >
                          {item.number}
                        </span>
                        <h3 className="mt-4 text-2xl font-medium tracking-[-0.03em]">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-(--home-muted)">
                          {item.text}
                        </p>
                      </li>
                    ))}
                  </ol>

                  <div className="mt-16 flex flex-col gap-6 rounded-3xl bg-(--home-soft) p-6 sm:flex-row sm:items-center sm:justify-between sm:p-10">
                    <div className="flex items-start gap-4">
                      <span
                        aria-hidden="true"
                        className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-[#0b0b0b]"
                      >
                        <Leaf className="size-5" />
                      </span>
                      <div>
                        <h2 className="text-xl font-medium tracking-[-0.03em] sm:text-2xl">
                          ¿Tu negocio no aparece en Google?
                        </h2>
                        <p className="mt-1.5 max-w-md text-sm leading-6 text-(--home-muted)">
                          No pasa nada. Crea tu cuenta y te guiamos para montar
                          tu web desde cero.
                        </p>
                      </div>
                    </div>
                    <Link
                      href={signupHref}
                      className="home-button home-button-light shrink-0"
                    >
                      Empezar desde cero
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 'analyzing' && (
            <div key="analyzing" className="mt-14 sm:mt-20">
              <CreateAnalyzing
                ref={headingRef}
                progress={analysisProgress}
                inputMode={analysisInputMode}
                title={t.crear.analyzingTitle}
                subtitle={
                  analysisInputMode === 'url'
                    ? t.crear.analyzingSubtitleWeb
                    : t.crear.analyzingSubtitleGoogle
                }
                businessName={placeDetails?.name ?? null}
                steps={[
                  {
                    label:
                      analysisInputMode === 'url'
                        ? t.crear.step1Web
                        : t.crear.step1Google,
                    doneAt: 20,
                  },
                  { label: t.crear.step2, doneAt: 55 },
                  { label: t.crear.step3, doneAt: 90 },
                ]}
              />
            </div>
          )}

          {step === 'preview' && placeDetails && (
            <div key="preview" className="mt-14 sm:mt-20">
              <div className="max-w-4xl">
                <p className="mb-6 inline-flex items-center gap-2 text-[13px] font-medium text-(--home-muted)">
                  <Check className="size-3.5" aria-hidden="true" />
                  Propuesta generada
                </p>
                <h1
                  ref={headingRef}
                  tabIndex={-1}
                  className="text-[clamp(36px,5.4vw,72px)] leading-[1] font-medium tracking-[-0.05em] break-words outline-none"
                >
                  {t.crear.previewTitle.replace('{name}', placeDetails.name)}{' '}
                  <span className="block text-[#8a8a84]">
                    {t.crear.previewTitleAccent}
                  </span>
                </h1>
                <p className="mt-6 max-w-xl text-base leading-7 text-(--home-muted) sm:text-lg sm:leading-8">
                  {t.crear.minimalistNote}
                </p>
              </div>

              <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-8">
                <GeneratedSitePreview
                  name={placeDetails.name}
                  host={`${slugifyHost(placeDetails.name)}.locavo.com`}
                  types={placeDetails.types}
                  address={placeDetails.formatted_address}
                  phone={placeDetails.formatted_phone_number}
                  website={placeDetails.website}
                  openNow={openNow}
                  city={city}
                  categoryLabel={categoryLabel}
                  heroText={heroText}
                  aboutText={aboutText}
                  services={detectedServices}
                  reviews={previewReviews}
                  copy={{
                    contactNow: t.crear.contactNow,
                    aboutUs: t.crear.aboutUs,
                    contactInfo: t.crear.contactInfo,
                    website: t.crear.website,
                    schedule: t.crear.schedule,
                    openNow: t.crear.openNow,
                    closedNow: t.crear.closedNow,
                    servicesTitle: t.crear.servicesTitle,
                    servicesSubtitle: t.crear.servicesSubtitle,
                    whatClientsSay: t.crear.whatClientsSay,
                  }}
                />

                <aside className="space-y-4 lg:sticky lg:top-24">
                  <section
                    aria-labelledby="crear-data-title"
                    className="rounded-3xl border border-(--home-line) bg-white p-6"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h2
                        id="crear-data-title"
                        className="text-[13px] font-medium text-(--home-muted)"
                      >
                        {t.crear.extractedData}
                      </h2>
                      <span className="rounded-full bg-(--home-soft) px-2.5 py-1 text-[11px] font-medium text-black/70">
                        {analysisInputMode === 'url'
                          ? 'Desde tu web'
                          : 'Desde Google'}
                      </span>
                    </div>
                    <p className="mt-4 text-2xl leading-tight font-medium tracking-[-0.03em] break-words">
                      {placeDetails.name}
                    </p>
                    <dl className="mt-5 space-y-3 border-t border-(--home-line) pt-5 text-sm text-(--home-muted)">
                      {placeDetails.formatted_address ? (
                        <DataRow icon={MapPin} label="Dirección">
                          {placeDetails.formatted_address}
                        </DataRow>
                      ) : null}
                      {placeDetails.formatted_phone_number ? (
                        <DataRow icon={Phone} label="Teléfono">
                          {placeDetails.formatted_phone_number}
                        </DataRow>
                      ) : null}
                      {placeDetails.rating ? (
                        <DataRow icon={Star} label="Valoración" star>
                          <span className="font-medium text-[#0b0b0b]">
                            {placeDetails.rating.toLocaleString('es-ES')}
                          </span>{' '}
                          ·{' '}
                          {placeDetails.user_ratings_total ||
                            placeDetails.reviews?.length ||
                            0}{' '}
                          {t.crear.reviewsAnalyzed}
                        </DataRow>
                      ) : null}
                      {priceLevelValue ? (
                        <DataRow icon={Euro} label={t.crear.priceLevel}>
                          {t.crear.priceLevel}:{' '}
                          <span className="font-medium text-[#0b0b0b]">
                            {priceLevelValue}
                          </span>
                        </DataRow>
                      ) : null}
                      {placeDetails.website ? (
                        <DataRow icon={Globe2} label="Web">
                          <span className="break-all">
                            {safeHost(placeDetails.website) ??
                              placeDetails.website}
                          </span>
                        </DataRow>
                      ) : null}
                    </dl>
                  </section>

                  <section
                    aria-labelledby="crear-publish-title"
                    className="home-dark relative overflow-hidden rounded-3xl bg-[#0b0b0b] p-6 text-white sm:p-7"
                  >
                    <div className="relative">
                      <h2
                        id="crear-publish-title"
                        className="text-2xl font-medium tracking-[-0.03em]"
                      >
                        {t.crear.allCorrect}
                      </h2>
                      <p className="mt-3 text-sm leading-6 text-white/65">
                        {analysisInputMode === 'url'
                          ? t.crear.generatedProposalWeb
                          : t.crear.generatedProposalGoogle}
                      </p>
                      <ul className="mt-6 space-y-2.5 border-t border-white/15 pt-5 text-sm text-white/80">
                        {[
                          'Edita textos, fotos y servicios',
                          'Conecta tu propio dominio',
                          '14 días de prueba · sin tarjeta para empezar',
                        ].map((item) => (
                          <li key={item} className="flex items-center gap-2">
                            <Check
                              className="size-4 shrink-0 text-white"
                              aria-hidden="true"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
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
                        className="home-button home-button-light mt-7 w-full"
                      >
                        {t.crear.publishNow}
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setStep('search')}
                        className="home-button home-button-outline mt-2.5 w-full border-white/25!"
                      >
                        <RotateCcw className="size-4" aria-hidden="true" />
                        {t.crear.searchAnother}
                      </button>
                    </div>
                  </section>
                </aside>
              </div>
            </div>
          )}

          {step === 'dashboard' && placeDetails && (
            <div
              key="dashboard"
              className="mx-auto mt-14 max-w-xl rounded-3xl border border-(--home-line) bg-white p-8 text-center sm:mt-20 sm:p-12"
            >
              <span
                aria-hidden="true"
                className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#0b0b0b] text-white"
              >
                <Check className="size-5" />
              </span>
              <h1
                ref={headingRef}
                tabIndex={-1}
                className="mt-6 text-3xl leading-tight font-medium tracking-[-0.045em] outline-none sm:text-4xl"
              >
                {t.crear.publishedTitle}
              </h1>
              <p className="mt-3 text-sm leading-6 text-(--home-muted) sm:text-base">
                {t.crear.publishedSubtitle.replace('{name}', placeDetails.name)}
              </p>
              <p className="mt-6 inline-flex max-w-full items-center gap-2 rounded-full bg-(--home-soft) px-4 py-2 text-sm text-black/75">
                <Globe2 className="size-4 shrink-0" aria-hidden="true" />
                <span className="truncate">
                  {slugifyHost(placeDetails.name)}.locavo.com
                </span>
              </p>
              <div className="mt-8 flex flex-col justify-center gap-2.5 sm:flex-row">
                <Link href="/dashboard" className="home-button">
                  {t.crear.goToDashboard}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  onClick={() => setStep('search')}
                  className="home-button home-button-outline border-(--home-line)!"
                >
                  {t.crear.createAnother}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

function SourceHint({
  icon: Icon,
  title,
  text,
  active,
}: {
  icon: typeof MapPin
  title: string
  text: string
  active: boolean
}) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-2xl border px-4 py-3.5 transition-colors',
        active
          ? 'border-[#0b0b0b] bg-white'
          : 'border-(--home-line) bg-(--home-soft)/60'
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full',
          active ? 'bg-[#0b0b0b] text-white' : 'bg-white text-black/50'
        )}
      >
        <Icon className="size-3.5" />
      </span>
      <div className="min-w-0">
        <p className="text-[13px] font-medium">{title}</p>
        <p className="mt-0.5 text-xs leading-5 break-words text-(--home-muted)">
          {text}
        </p>
      </div>
    </div>
  )
}

function DataRow({
  icon: Icon,
  label,
  star = false,
  children,
}: {
  icon: typeof MapPin
  label: string
  star?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-2.5">
      <dt className="mt-0.5 shrink-0">
        <Icon
          className={cn(
            'size-4',
            star ? 'fill-[#0b0b0b] text-[#0b0b0b]' : 'text-black/40'
          )}
          aria-hidden="true"
        />
        <span className="sr-only">{label}</span>
      </dt>
      <dd className="min-w-0 leading-6 break-words">{children}</dd>
    </div>
  )
}
