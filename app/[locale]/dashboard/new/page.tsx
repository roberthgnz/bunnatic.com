'use client'

import { useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createBusinessFromGoogle } from '@/lib/supabase/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Loader2,
  Search,
  MapPin,
  Star,
  CheckCircle2,
  ArrowLeft,
  Globe,
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

type Place = {
  place_id: string
  name: string
  formatted_address: string
}

type PlaceDetails = {
  place_id: string
  name: string
  formatted_address: string
  formatted_phone_number?: string
  website?: string
  rating?: number
  user_ratings_total?: number
  types?: string[]
  reviews?: Array<{ text: string; author_name: string }>
  editorial_summary?: { overview?: string }
}

type Step = 'search' | 'analyzing' | 'preview'
type SourceType = 'google' | 'url'

export default function NewSitePage() {
  const params = useParams<{ locale: string }>()
  const locale = params?.locale === 'ca' ? 'ca' : 'es'
  const router = useRouter()

  const [sourceType, setSourceType] = useState<SourceType>('google')
  const [query, setQuery] = useState('')
  const [urlQuery, setUrlQuery] = useState('')
  const [places, setPlaces] = useState<Place[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isCrawling, setIsCrawling] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const [placeDetails, setPlaceDetails] = useState<PlaceDetails | null>(null)
  const [step, setStep] = useState<Step>('search')
  const [creating, setCreating] = useState(false)

  const t = useMemo(
    () =>
      ({
        es: {
          title: 'Crear negocio',
          subtitle: 'Busca tu negocio en Google y genera su panel en minutos.',
          sourceLabel: 'Fuente de datos',
          sourceGoogle: 'Google My Business',
          sourceUrl: 'Sitio web (crawl)',
          back: 'Volver al dashboard',
          searchPlaceholder: 'Ej: Restaurante Casa Pepe',
          urlPlaceholder: 'https://tu-negocio.com',
          search: 'Buscar',
          searching: 'Buscando...',
          crawl: 'Analizar URL',
          crawling: 'Analizando...',
          invalidUrl: 'Introduce una URL válida (http/https).',
          noResults: 'No encontramos resultados para esa búsqueda.',
          analyzing: 'Analizando negocio...',
          analyzingHint:
            'Estamos preparando una base inicial de contenido y estructura.',
          extractedData: 'Datos detectados',
          create: 'Crear negocio',
          creating: 'Creando...',
          searchAgain: 'Volver a buscar',
          previewTitle: 'Vista previa inicial',
          about: 'Sobre el negocio',
          reviews: 'Reseñas',
          fallbackDescription:
            'Tu negocio, ahora con una presencia online profesional.',
          fallbackAbout:
            'En {name}, nos dedicamos a ofrecer el mejor servicio a nuestros clientes.',
          searchError: 'No hemos podido completar la búsqueda.',
          detailsError: 'No hemos podido obtener los detalles del negocio.',
          createError: 'No hemos podido crear el negocio.',
          createSuccess: 'Negocio creado correctamente',
          rating: 'valoraciones',
        },
        ca: {
          title: 'Crear negoci',
          subtitle:
            'Cerca el teu negoci a Google i genera el seu panell en minuts.',
          sourceLabel: 'Font de dades',
          sourceGoogle: 'Google My Business',
          sourceUrl: 'Lloc web (crawl)',
          back: 'Tornar al dashboard',
          searchPlaceholder: 'Ex: Restaurant Casa Pepe',
          urlPlaceholder: 'https://el-teu-negoci.com',
          search: 'Cercar',
          searching: 'Cercant...',
          crawl: 'Analitzar URL',
          crawling: 'Analitzant...',
          invalidUrl: 'Introdueix una URL vàlida (http/https).',
          noResults: 'No hem trobat resultats per a aquesta cerca.',
          analyzing: 'Analitzant negoci...',
          analyzingHint:
            'Estem preparant una base inicial de contingut i estructura.',
          extractedData: 'Dades detectades',
          create: 'Crear negoci',
          creating: 'Creant...',
          searchAgain: 'Tornar a cercar',
          previewTitle: 'Vista prèvia inicial',
          about: 'Sobre el negoci',
          reviews: 'Ressenyes',
          fallbackDescription:
            'El teu negoci, ara amb una presència online professional.',
          fallbackAbout:
            'A {name}, ens dediquem a oferir el millor servei als nostres clients.',
          searchError: 'No hem pogut completar la cerca.',
          detailsError: 'No hem pogut obtenir els detalls del negoci.',
          createError: 'No hem pogut crear el negoci.',
          createSuccess: 'Negoci creat correctament',
          rating: 'valoracions',
        },
      })[locale],
    [locale]
  )

  const resetSearchState = () => {
    setStep('search')
    setPlaces([])
    setSelectedPlace(null)
    setPlaceDetails(null)
  }

  const isValidHttpUrl = (value: string): boolean => {
    try {
      const parsed = new URL(value)
      return parsed.protocol === 'http:' || parsed.protocol === 'https:'
    } catch {
      return false
    }
  }

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!query.trim()) return

    setIsSearching(true)
    resetSearchState()

    try {
      const res = await fetch(
        `/api/places/search?q=${encodeURIComponent(query)}&lang=${locale}`
      )
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error || t.searchError)
      }

      setPlaces(Array.isArray(data.results) ? data.results : [])
    } catch (error) {
      console.error('Error searching places:', error)
      toast.error(t.searchError)
    } finally {
      setIsSearching(false)
    }
  }

  const handleCrawl = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedUrl = urlQuery.trim()
    if (!isValidHttpUrl(trimmedUrl)) {
      toast.error(t.invalidUrl)
      return
    }

    setIsCrawling(true)
    resetSearchState()
    setStep('analyzing')

    try {
      const startResponse = await fetch('/api/places/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmedUrl, lang: locale }),
      })
      const startData = (await startResponse.json()) as {
        jobId?: string
        error?: string
      }
      if (!startResponse.ok || !startData.jobId) {
        throw new Error(startData.error || t.detailsError)
      }

      const timeoutMs = 90_000
      const intervalMs = 1_200
      const startedAt = Date.now()
      let crawlResult: unknown = null

      while (Date.now() - startedAt < timeoutMs) {
        await new Promise((resolve) => window.setTimeout(resolve, intervalMs))
        const statusResponse = await fetch(
          `/api/places/crawl?jobId=${encodeURIComponent(startData.jobId)}&url=${encodeURIComponent(trimmedUrl)}`,
          { cache: 'no-store' }
        )
        const statusData = (await statusResponse.json()) as {
          status?: string
          result?: unknown
          error?: string
        }
        if (!statusResponse.ok)
          throw new Error(statusData.error || t.detailsError)
        if (statusData.status === 'completed' && statusData.result) {
          crawlResult = statusData.result
          break
        }
      }

      if (!crawlResult) throw new Error(t.detailsError)
      setSelectedPlace(null)
      setPlaceDetails(crawlResult as PlaceDetails)
      setStep('preview')
    } catch (error) {
      console.error('Error crawling site:', error)
      toast.error(t.detailsError)
      setStep('search')
    } finally {
      setIsCrawling(false)
    }
  }

  const handleSelectPlace = async (place: Place) => {
    setSelectedPlace(place)
    setStep('analyzing')
    setPlaceDetails(null)

    try {
      const res = await fetch(
        `/api/places/details?place_id=${place.place_id}&lang=${locale}`
      )
      const data = await res.json()

      if (!res.ok || !data.result) {
        throw new Error(data?.error || t.detailsError)
      }

      setPlaceDetails(data.result)
      setStep('preview')
    } catch (error) {
      console.error(error)
      toast.error(t.detailsError)
      setStep('search')
      setSelectedPlace(null)
    }
  }

  const handleCreate = async () => {
    if (!placeDetails) return

    setCreating(true)
    try {
      const result = await createBusinessFromGoogle(placeDetails)
      if (result?.error || !result?.slug) {
        throw new Error(result?.error || t.createError)
      }

      toast.success(t.createSuccess)
      router.push(`/${locale}/dashboard/businesses/${result.slug}`)
    } catch (error) {
      console.error(error)
      toast.error(error instanceof Error ? error.message : t.createError)
      setCreating(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {t.title}
          </h1>
          <p className="text-sm text-slate-600">{t.subtitle}</p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/${locale}/dashboard`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.back}
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.sourceLabel}</CardTitle>
          <CardDescription>{t.subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              onClick={() => {
                if (sourceType === 'google') return
                setSourceType('google')
                resetSearchState()
              }}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
                sourceType === 'google'
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <MapPin className="h-4 w-4" />
              {t.sourceGoogle}
            </button>
            <button
              type="button"
              onClick={() => {
                if (sourceType === 'url') return
                setSourceType('url')
                resetSearchState()
              }}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
                sourceType === 'url'
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Globe className="h-4 w-4" />
              {t.sourceUrl}
            </button>
          </div>

          {sourceType === 'google' ? (
            <>
              <form
                onSubmit={handleSearch}
                className="flex flex-col gap-3 sm:flex-row"
              >
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="h-10"
                  required
                />
                <Button
                  type="submit"
                  disabled={isSearching || isCrawling}
                  className="sm:w-36"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t.searching}
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      {t.search}
                    </>
                  )}
                </Button>
              </form>

              {step === 'search' && places.length > 0 && (
                <div className="space-y-2">
                  {places.map((place) => (
                    <button
                      key={place.place_id}
                      onClick={() => handleSelectPlace(place)}
                      className="flex w-full items-start gap-3 rounded-md border border-slate-200 bg-white px-4 py-3 text-left transition-colors hover:bg-slate-50"
                      type="button"
                    >
                      <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-slate-50">
                        <MapPin className="h-4 w-4 text-slate-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">
                          {place.name}
                        </p>
                        <p className="text-sm text-slate-600">
                          {place.formatted_address}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {step === 'search' &&
                !isSearching &&
                query.trim().length > 0 &&
                places.length === 0 && (
                  <p className="text-sm text-slate-600">{t.noResults}</p>
                )}
            </>
          ) : (
            <form
              onSubmit={handleCrawl}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <Input
                value={urlQuery}
                onChange={(e) => setUrlQuery(e.target.value)}
                placeholder={t.urlPlaceholder}
                className="h-10"
                required
              />
              <Button
                type="submit"
                disabled={isSearching || isCrawling}
                className="sm:w-40"
              >
                {isCrawling ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t.crawling}
                  </>
                ) : (
                  <>
                    <Globe className="mr-2 h-4 w-4" />
                    {t.crawl}
                  </>
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {step === 'analyzing' && (selectedPlace || sourceType === 'url') && (
        <Card>
          <CardContent className="py-12 text-center">
            <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-emerald-600" />
            <p className="text-base font-semibold text-slate-900">
              {t.analyzing}
            </p>
            <p className="mt-1 text-sm text-slate-600">{t.analyzingHint}</p>
          </CardContent>
        </Card>
      )}

      {step === 'preview' && placeDetails && (
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>{t.extractedData}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {placeDetails.name}
                </p>
                <p className="text-sm text-slate-600">
                  {placeDetails.formatted_address}
                </p>
              </div>
              {placeDetails.rating ? (
                <p className="flex items-center gap-1 text-sm text-slate-600">
                  <Star className="h-4 w-4 text-amber-500" />
                  {placeDetails.rating} ({placeDetails.user_ratings_total || 0}{' '}
                  {t.rating})
                </p>
              ) : null}
              <div className="space-y-2 pt-2">
                <Button
                  onClick={handleCreate}
                  disabled={creating}
                  className="w-full"
                >
                  {creating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t.creating}
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      {t.create}
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setStep('search')
                    setSelectedPlace(null)
                    setPlaceDetails(null)
                  }}
                >
                  {t.searchAgain}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>{t.previewTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <section className="rounded-md border border-slate-200 bg-slate-50/60 p-5">
                <h2 className="text-xl font-semibold text-slate-900">
                  {placeDetails.name}
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  {placeDetails.editorial_summary?.overview ||
                    t.fallbackDescription}
                </p>
              </section>

              <section>
                <h3 className="text-base font-semibold text-slate-900">
                  {t.about}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {placeDetails.editorial_summary?.overview ||
                    t.fallbackAbout.replace('{name}', placeDetails.name)}
                </p>
              </section>

              {placeDetails.reviews && placeDetails.reviews.length > 0 ? (
                <section>
                  <h3 className="text-base font-semibold text-slate-900">
                    {t.reviews}
                  </h3>
                  <div className="mt-3 space-y-3">
                    {placeDetails.reviews.slice(0, 2).map((review, index) => (
                      <div
                        key={`${review.author_name}-${index}`}
                        className="rounded-md border border-slate-200 bg-white p-4"
                      >
                        <p className="text-sm text-slate-700">
                          <q>{review.text}</q>
                        </p>
                        <p className="mt-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                          {review.author_name}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
