'use client'

import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  applyBusinessSourceGeneration,
  buildBusinessSourcePreview as buildBusinessSourcePreviewAction,
  getGenerationEntitlement,
} from '@/lib/supabase/actions'
import { RotatingLoaderText } from '@/app/dashboard/_components/RotatingLoaderText'
import type {
  BusinessSourcePreview,
  GenerationEntitlement,
  SourceBlock,
  SourceType,
} from '@/lib/businessSourceGeneration'
import { trackFunnelEvent } from '@/lib/funnelEvents'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Loader2,
  MapPin,
  Search,
  Sparkles,
  Globe,
  Clock,
  Briefcase,
  User,
  CheckSquare,
  Square,
  Wand2,
  PhoneCall,
  Tag,
  AlignLeft,
  Navigation,
  Star,
} from 'lucide-react'

type PlaceSearchResult = {
  place_id: string
  name: string
  formatted_address: string
}

const googleSearchSchema = z.object({
  query: z.string().min(1, { message: 'query_required' }),
})
type GoogleSearchValues = z.infer<typeof googleSearchSchema>

const urlCrawlSchema = z.object({
  url: z.string().url({ message: 'url_invalid' }),
})
type UrlCrawlValues = z.infer<typeof urlCrawlSchema>

function getProfileHasContent(preview: BusinessSourcePreview): boolean {
  const { profile } = preview
  return [
    profile.name,
    profile.category,
    profile.description,
    profile.address,
    profile.phone,
    profile.website,
  ].some((value) => value.trim().length > 0)
}

function getDefaultSelectedBlocks(
  preview: BusinessSourcePreview
): Set<SourceBlock> {
  const next = new Set<SourceBlock>()
  if (getProfileHasContent(preview)) next.add('profile')
  if (preview.services.length > 0) next.add('services')
  if (preview.hours.length > 0) next.add('hours')
  return next
}

export default function SourceGenerationPanel({
  businessId,
  locale,
}: {
  businessId: string
  locale: string
}) {
  const router = useRouter()
  const safeLocale = locale === 'ca' ? 'ca' : 'es'
  const [sourceType, setSourceType] = useState<SourceType>('google')
  const [googleResults, setGoogleResults] = useState<PlaceSearchResult[]>([])
  const [preview, setPreview] = useState<BusinessSourcePreview | null>(null)
  const [selectedBlocks, setSelectedBlocks] = useState<Set<SourceBlock>>(
    new Set()
  )
  const [entitlement, setEntitlement] = useState<GenerationEntitlement | null>(
    null
  )
  const [isSearching, setIsSearching] = useState(false)
  const [isBuildingPreview, setIsBuildingPreview] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [isCrawling, setIsCrawling] = useState(false)

  const googleSearchForm = useForm<GoogleSearchValues>({
    resolver: zodResolver(googleSearchSchema),
    defaultValues: { query: '' },
  })

  const urlCrawlForm = useForm<UrlCrawlValues>({
    resolver: zodResolver(urlCrawlSchema),
    defaultValues: { url: '' },
  })

  const t = useMemo(
    () =>
      ({
        es: {
          title: 'Generar desde fuente',
          subtitle:
            'Usa los datos reales de tu negocio desde Google My Business o desde tu web para regenerar información.',
          sourceLabel: 'Fuente de datos',
          sourceGoogle: 'Google My Business',
          sourceUrl: 'URL del sitio',
          quotaUnlimited: 'Generaciones ilimitadas en tu plan',
          quotaLimited: 'Generaciones usadas este mes',
          searchPlaceholder: 'Ej: Restaurante Casa Pepe Madrid',
          searchButton: 'Buscar',
          searching: 'Buscando...',
          selectBusiness:
            'Busca tu negocio en Google para generar un preview automático.',
          urlPlaceholder: 'https://tu-negocio.com',
          crawlButton: 'Analizar URL',
          crawling: 'Analizando...',
          previewTitle: 'Preview generado',
          generatingPreview: 'Generando preview...',
          generatingMessages: [
            'Analizando fuente de datos...',
            'Extrayendo información del negocio...',
            'Generando vista previa...',
            'Esto puede tardar unos segundos...',
          ],
          blocksTitle: 'Elige qué aplicar',
          blockProfile: 'Perfil',
          blockProfileDesc: 'Nombre, categoría, descripción y contacto',
          blockServices: 'Servicios',
          blockServicesDesc: 'Catálogo de servicios detectados',
          blockHours: 'Horarios',
          blockHoursDesc: 'Horario de apertura semanal',
          ratingLabel: 'Valoración',
          reviewsLabel: 'Reseñas',
          priceLabel: 'Precio',
          statusLabel: 'Estado',
          mapsLabel: 'Google Maps',
          noPreview: 'Aún no hay preview generado.',
          noServices: 'No se detectaron servicios en la fuente.',
          noHours: 'No se detectaron horarios en la fuente.',
          applyButton: 'Aplicar selección',
          applying: 'Aplicando...',
          limitReached: 'Has alcanzado el límite mensual de tu plan Starter.',
          limitReachedHint: 'Sube de plan para generación ilimitada.',
          errorSearch: 'No se pudo buscar en Google.',
          errorDetails: 'No se pudieron cargar los detalles del negocio.',
          errorCrawl: 'No se pudo analizar la URL indicada.',
          errorPreview: 'No se pudo construir el preview.',
          success: 'Información actualizada correctamente.',
        },
        ca: {
          title: 'Generar des de font',
          subtitle:
            'Fes servir les dades reals del teu negoci des de Google My Business o des del teu web per regenerar informació.',
          sourceLabel: 'Font de dades',
          sourceGoogle: 'Google My Business',
          sourceUrl: 'URL del lloc',
          quotaUnlimited: 'Generacions il·limitades al teu pla',
          quotaLimited: 'Generacions usades aquest mes',
          searchPlaceholder: 'Ex: Restaurant Casa Pepe Barcelona',
          searchButton: 'Cercar',
          searching: 'Cercant...',
          selectBusiness:
            'Cerca el teu negoci a Google per generar una vista prèvia automàtica.',
          urlPlaceholder: 'https://el-teu-negoci.com',
          crawlButton: 'Analitzar URL',
          crawling: 'Analitzant...',
          previewTitle: 'Vista prèvia generada',
          generatingPreview: 'Generant vista prèvia...',
          generatingMessages: [
            'Analitzant font de dades...',
            'Extraient informació del negoci...',
            'Generant vista prèvia...',
            'Això pot trigar uns segons...',
          ],
          blocksTitle: 'Tria què aplicar',
          blockProfile: 'Perfil',
          blockProfileDesc: 'Nom, categoria, descripció i contacte',
          blockServices: 'Serveis',
          blockServicesDesc: 'Catàleg de serveis detectats',
          blockHours: 'Horaris',
          blockHoursDesc: "Horari d'obertura setmanal",
          ratingLabel: 'Valoració',
          reviewsLabel: 'Ressenyes',
          priceLabel: 'Preu',
          statusLabel: 'Estat',
          mapsLabel: 'Google Maps',
          noPreview: 'Encara no hi ha vista prèvia generada.',
          noServices: "No s'han detectat serveis a la font.",
          noHours: "No s'han detectat horaris a la font.",
          applyButton: 'Aplicar selecció',
          applying: 'Aplicant...',
          limitReached: 'Has arribat al límit mensual del teu pla Starter.',
          limitReachedHint: 'Canvia de pla per generar sense límits.',
          errorSearch: "No s'ha pogut cercar a Google.",
          errorDetails: "No s'han pogut carregar els detalls del negoci.",
          errorCrawl: "No s'ha pogut analitzar la URL indicada.",
          errorPreview: "No s'ha pogut construir la vista prèvia.",
          success: 'Informació actualitzada correctament.',
        },
      })[safeLocale],
    [safeLocale]
  )

  const loadEntitlement = async () => {
    const result = await getGenerationEntitlement()
    if ('error' in result) return
    setEntitlement(result.entitlement)
  }

  useEffect(() => {
    void loadEntitlement()
  }, [])

  const isLimitReached = Boolean(
    entitlement?.isLimited && (entitlement.remaining ?? 0) <= 0
  )
  const hasSelectableBlocks = selectedBlocks.size > 0

  const resetGeneratedState = () => {
    setPreview(null)
    setSelectedBlocks(new Set())
  }

  const handleSourceChange = (nextSource: SourceType) => {
    if (sourceType === nextSource) return
    setSourceType(nextSource)
    setGoogleResults([])
    resetGeneratedState()
    trackFunnelEvent('source_selected', {
      source_type: nextSource,
      locale: safeLocale,
    })
  }

  const handleGoogleSearch = async (values: GoogleSearchValues) => {
    setIsSearching(true)
    setGoogleResults([])
    resetGeneratedState()

    try {
      const response = await fetch(
        `/api/places/search?q=${encodeURIComponent(values.query.trim())}&lang=${safeLocale}`
      )
      const data = (await response.json()) as {
        results?: PlaceSearchResult[]
        error?: string
      }
      if (!response.ok) throw new Error(data.error || t.errorSearch)
      setGoogleResults(Array.isArray(data.results) ? data.results : [])
    } catch (error) {
      console.error(error)
      toast.error(t.errorSearch)
    } finally {
      setIsSearching(false)
    }
  }

  const buildPreviewFromPayload = async (
    nextSourceType: SourceType,
    sourcePayload: unknown
  ) => {
    setIsBuildingPreview(true)
    resetGeneratedState()

    try {
      const result = await buildBusinessSourcePreviewAction({
        sourceType: nextSourceType,
        sourcePayload,
      })
      if ('error' in result || !result.preview) throw new Error('Preview error')

      const nextPreview = result.preview
      const defaultBlocks = getDefaultSelectedBlocks(nextPreview)
      setPreview(nextPreview)
      setSelectedBlocks(defaultBlocks)
      trackFunnelEvent('preview_generated', {
        source_type: nextSourceType,
        locale: safeLocale,
      })
    } catch (error) {
      console.error(error)
      toast.error(t.errorPreview)
    } finally {
      setIsBuildingPreview(false)
    }
  }

  const handleSelectGoogleResult = async (result: PlaceSearchResult) => {
    setIsBuildingPreview(true)
    try {
      const response = await fetch(
        `/api/places/details?place_id=${encodeURIComponent(result.place_id)}&lang=${safeLocale}`
      )
      const data = (await response.json()) as {
        result?: unknown
        error?: string
      }
      if (!response.ok || !data.result)
        throw new Error(data.error || t.errorDetails)
      await buildPreviewFromPayload('google', data.result)
    } catch (error) {
      console.error(error)
      toast.error(t.errorDetails)
      setIsBuildingPreview(false)
    }
  }

  const handleCrawlUrl = async (values: UrlCrawlValues) => {
    setIsCrawling(true)
    resetGeneratedState()

    try {
      const startResponse = await fetch('/api/places/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: values.url, lang: safeLocale }),
      })
      const startData = (await startResponse.json()) as {
        jobId?: string
        error?: string
      }
      if (!startResponse.ok || !startData.jobId)
        throw new Error(startData.error || t.errorCrawl)

      const timeoutMs = 90_000
      const intervalMs = 1_200
      const startedAt = Date.now()
      let crawlResult: unknown = null

      while (Date.now() - startedAt < timeoutMs) {
        await new Promise((resolve) => window.setTimeout(resolve, intervalMs))
        const statusResponse = await fetch(
          `/api/places/crawl?jobId=${encodeURIComponent(startData.jobId)}&url=${encodeURIComponent(values.url)}`,
          { cache: 'no-store' }
        )
        const statusData = (await statusResponse.json()) as {
          status?: string
          result?: unknown
          error?: string
        }
        if (!statusResponse.ok)
          throw new Error(statusData.error || t.errorCrawl)
        if (statusData.status === 'completed' && statusData.result) {
          crawlResult = statusData.result
          break
        }
      }

      if (!crawlResult) throw new Error(t.errorCrawl)
      await buildPreviewFromPayload('url', crawlResult)
    } catch (error) {
      console.error(error)
      toast.error(t.errorCrawl)
    } finally {
      setIsCrawling(false)
    }
  }

  const toggleBlock = (block: SourceBlock) => {
    setSelectedBlocks((prev) => {
      const next = new Set(prev)
      if (next.has(block)) {
        next.delete(block)
      } else {
        next.add(block)
      }
      return next
    })
  }

  const handleApply = async () => {
    if (!preview) return
    if (isLimitReached) {
      trackFunnelEvent('limit_blocked', {
        source_type: sourceType,
        locale: safeLocale,
      })
      toast.error(t.limitReached)
      return
    }

    const blocks = Array.from(selectedBlocks)
    if (blocks.length === 0) return

    setIsApplying(true)
    trackFunnelEvent('apply_submitted', {
      source_type: sourceType,
      locale: safeLocale,
      blocks_count: blocks.length,
    })

    try {
      const result = await applyBusinessSourceGeneration({
        businessId,
        sourceType,
        selectedBlocks: blocks,
        previewPayload: preview,
      })

      if ('error' in result) {
        toast.error(result.error)
        if ('entitlement' in result && result.entitlement) {
          setEntitlement(result.entitlement)
        }
        return
      }

      toast.success(t.success)
      trackFunnelEvent('apply_success', {
        source_type: sourceType,
        locale: safeLocale,
        blocks_count: blocks.length,
      })
      if ('entitlement' in result && result.entitlement) setEntitlement(result.entitlement)
      else await loadEntitlement()
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error(t.errorPreview)
    } finally {
      setIsApplying(false)
    }
  }

  const quotaLabel = entitlement?.isLimited
    ? `${entitlement.usedThisMonth}/${entitlement.monthlyLimit}`
    : t.quotaUnlimited

  const blockDefs: {
    key: SourceBlock
    icon: React.ReactNode
    label: string
    desc: string
  }[] = [
      {
        key: 'profile',
        icon: <User className="h-4 w-4" />,
        label: t.blockProfile,
        desc: t.blockProfileDesc,
      },
      {
        key: 'services',
        icon: <Briefcase className="h-4 w-4" />,
        label: t.blockServices,
        desc: t.blockServicesDesc,
      },
      {
        key: 'hours',
        icon: <Clock className="h-4 w-4" />,
        label: t.blockHours,
        desc: t.blockHoursDesc,
      },
    ]

  const isBlockDisabled = (key: SourceBlock) => {
    if (!preview) return true
    if (key === 'profile') return !getProfileHasContent(preview)
    if (key === 'services') return preview.services.length === 0
    if (key === 'hours') return preview.hours.length === 0
    return false
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/20 ring-1 ring-blue-400/30">
            <Wand2 className="h-4.5 w-4.5 text-blue-300" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{t.title}</h3>
            <p className="max-w-sm text-xs leading-relaxed text-slate-400">
              {t.subtitle}
            </p>
          </div>
        </div>
        {/* Quota badge */}
        <div className="shrink-0">
          {entitlement?.isLimited ? (
            <div
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ${isLimitReached ? 'bg-red-900/40 text-red-300 ring-red-700/40' : 'bg-blue-900/30 text-blue-300 ring-blue-700/30'}`}
            >
              <Sparkles className="h-3 w-3" />
              {t.quotaLimited}: {quotaLabel}
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-900/30 px-3 py-1 text-xs font-medium text-emerald-300 ring-1 ring-emerald-700/30">
              <Sparkles className="h-3 w-3" />
              {quotaLabel}
            </div>
          )}
        </div>
      </div>

      {/* Limit warning */}
      {isLimitReached && (
        <div className="flex items-start gap-3 border-b border-amber-200 bg-amber-50 px-6 py-3">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <p className="text-sm text-amber-800">
            {t.limitReached}{' '}
            <span className="font-medium">{t.limitReachedHint}</span>
          </p>
        </div>
      )}

      <div className="space-y-6 p-6">
        {/* Source toggle */}
        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
            {t.sourceLabel}
          </p>
          <div className="inline-flex gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
            <button
              type="button"
              onClick={() => handleSourceChange('google')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${sourceType === 'google'
                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              <MapPin className="h-3.5 w-3.5" />
              {t.sourceGoogle}
            </button>
            <button
              type="button"
              onClick={() => handleSourceChange('url')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${sourceType === 'url'
                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              <Globe className="h-3.5 w-3.5" />
              {t.sourceUrl}
            </button>
          </div>
        </div>

        {/* Search / URL input */}
        {sourceType === 'google' ? (
          <div className="space-y-3">
            <form
              onSubmit={googleSearchForm.handleSubmit(handleGoogleSearch)}
              className="flex flex-col gap-2 sm:flex-row"
            >
              <div className="relative flex-1 space-y-1.5">
                <div className="relative">
                  <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    {...googleSearchForm.register('query')}
                    placeholder={t.searchPlaceholder}
                    aria-invalid={!!googleSearchForm.formState.errors.query}
                    className="h-10 border-slate-200 bg-white pl-9 text-sm focus-visible:ring-blue-500/30"
                  />
                </div>
                {googleSearchForm.formState.errors.query && (
                  <p className="text-destructive flex items-center gap-1 text-xs font-medium">
                    <svg
                      className="h-3 w-3 shrink-0"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      aria-hidden
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm.75 3.75a.75.75 0 0 0-1.5 0v3.5a.75.75 0 0 0 1.5 0v-3.5zM8 11a.875.875 0 1 0 0-1.75A.875.875 0 0 0 8 11z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {t.errorSearch}
                  </p>
                )}
              </div>
              <Button type="submit" disabled={isSearching || isBuildingPreview}>
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t.searching}
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    {t.searchButton}
                  </>
                )}
              </Button>
            </form>

            {/* Search results */}
            {googleResults.length > 0 && (
              <div className="animate-in fade-in slide-in-from-top-2 space-y-1 rounded-xl border border-slate-200 bg-slate-50/80 p-2 duration-200">
                {googleResults.map((result) => (
                  <button
                    key={result.place_id}
                    type="button"
                    className="group flex w-full items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-left transition-all hover:border-blue-200 hover:bg-blue-50/50 disabled:opacity-50"
                    onClick={() => handleSelectGoogleResult(result)}
                    disabled={isBuildingPreview}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 ring-1 ring-blue-100 transition-colors group-hover:bg-blue-100">
                      <MapPin className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900">
                        {result.name}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {result.formatted_address}
                      </p>
                    </div>
                    <Search className="h-3.5 w-3.5 shrink-0 text-slate-300 transition-colors group-hover:text-blue-400" />
                  </button>
                ))}
              </div>
            )}

            {googleResults.length === 0 && !isSearching && (
              <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-10 text-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    {t.sourceGoogle}
                  </p>
                  <p className="mt-0.5 max-w-xs text-xs text-slate-400">
                    {t.selectBusiness}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <form
            onSubmit={urlCrawlForm.handleSubmit(handleCrawlUrl)}
            className="flex flex-col gap-2 sm:flex-row"
          >
            <div className="relative flex-1 space-y-1.5">
              <div className="relative">
                <Globe className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  {...urlCrawlForm.register('url')}
                  placeholder={t.urlPlaceholder}
                  aria-invalid={!!urlCrawlForm.formState.errors.url}
                  className="h-10 border-slate-200 bg-white pl-9 text-sm focus-visible:ring-blue-500/30"
                />
              </div>
              {urlCrawlForm.formState.errors.url && (
                <p className="text-destructive flex items-center gap-1 text-xs font-medium">
                  <svg
                    className="h-3 w-3 shrink-0"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm.75 3.75a.75.75 0 0 0-1.5 0v3.5a.75.75 0 0 0 1.5 0v-3.5zM8 11a.875.875 0 1 0 0-1.75A.875.875 0 0 0 8 11z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {t.errorCrawl}
                </p>
              )}
            </div>
            <Button type="submit" disabled={isCrawling || isBuildingPreview}>
              {isCrawling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.crawling}
                </>
              ) : (
                <>
                  <Globe className="mr-2 h-4 w-4" />
                  {t.crawlButton}
                </>
              )}
            </Button>
          </form>
        )}

        {/* Building preview loader */}
        {(isBuildingPreview || isCrawling) && (
          <div className="animate-in fade-in flex items-center justify-center gap-3 rounded-xl border border-blue-100 bg-blue-50 py-10 duration-300">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            <RotatingLoaderText messages={t.generatingMessages} />
          </div>
        )}

        {/* Preview section */}
        {!isBuildingPreview && !isCrawling && (
          <>
            {preview ? (
              <div className="animate-in fade-in slide-in-from-bottom-2 space-y-5 duration-300">
                {/* Block selector */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
                    {t.blocksTitle}
                  </p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {blockDefs.map(({ key, icon, label, desc }) => {
                      const isSelected = selectedBlocks.has(key)
                      const disabled = isBlockDisabled(key)
                      return (
                        <button
                          key={key}
                          type="button"
                          disabled={disabled}
                          onClick={() => toggleBlock(key)}
                          className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${disabled
                            ? 'cursor-not-allowed border-slate-200 bg-slate-50 opacity-40'
                            : isSelected
                              ? 'border-blue-300 bg-blue-50 ring-1 ring-blue-200'
                              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                            }`}
                        >
                          <div
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${isSelected && !disabled ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}
                          >
                            {icon}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p
                              className={`text-sm font-semibold ${isSelected && !disabled ? 'text-blue-800' : 'text-slate-800'}`}
                            >
                              {label}
                            </p>
                            <p className="text-xs leading-relaxed text-slate-500">
                              {desc}
                            </p>
                          </div>
                          <div
                            className={`mt-0.5 shrink-0 ${isSelected && !disabled ? 'text-blue-500' : 'text-slate-300'}`}
                          >
                            {isSelected && !disabled ? (
                              <CheckSquare className="h-4 w-4" />
                            ) : (
                              <Square className="h-4 w-4" />
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Preview data */}
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Profile card */}
                  <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-slate-500" />
                      <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
                        {t.blockProfile}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-slate-900">
                        {preview.profile.name || '—'}
                      </p>
                      {typeof preview.profile.rating === 'number' && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Star className="h-3 w-3 text-amber-500" />
                          {t.ratingLabel}: {preview.profile.rating.toFixed(1)} /
                          5
                        </div>
                      )}
                      {typeof preview.profile.reviewCount === 'number' && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Sparkles className="h-3 w-3" />
                          {t.reviewsLabel}: {preview.profile.reviewCount}
                        </div>
                      )}
                      {typeof preview.profile.priceLevel === 'number' &&
                        preview.profile.priceLevel > 0 && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Tag className="h-3 w-3" />
                            {t.priceLabel}:{' '}
                            {'€'.repeat(preview.profile.priceLevel)}
                          </div>
                        )}
                      {preview.profile.businessStatus && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Tag className="h-3 w-3" />
                          {t.statusLabel}: {preview.profile.businessStatus}
                        </div>
                      )}
                      {preview.profile.category && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Tag className="h-3 w-3" />
                          {preview.profile.category}
                        </div>
                      )}
                      {preview.profile.description && (
                        <div className="flex items-start gap-1.5 text-xs text-slate-600">
                          <AlignLeft className="mt-0.5 h-3 w-3 shrink-0" />
                          <span className="line-clamp-3">
                            {preview.profile.description}
                          </span>
                        </div>
                      )}
                      {preview.profile.address && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Navigation className="h-3 w-3" />
                          {preview.profile.address}
                        </div>
                      )}
                      {preview.profile.phone && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <PhoneCall className="h-3 w-3" />
                          {preview.profile.phone}
                        </div>
                      )}
                      {preview.profile.website && (
                        <div className="flex items-center gap-1.5 truncate text-xs text-slate-500">
                          <Globe className="h-3 w-3 shrink-0" />
                          <span className="truncate">
                            {preview.profile.website}
                          </span>
                        </div>
                      )}
                      {preview.profile.mapsUrl && (
                        <div className="flex items-center gap-1.5 truncate text-xs text-slate-500">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="truncate">
                            {t.mapsLabel}: {preview.profile.mapsUrl}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Services card */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-slate-500" />
                        <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
                          {t.blockServices}
                        </p>
                      </div>
                      {preview.services.length > 0 ? (
                        <ul className="space-y-1">
                          {preview.services.map((service) => (
                            <li
                              key={service.name}
                              className="flex items-center gap-2 text-xs text-slate-700"
                            >
                              <span className="h-1 w-1 shrink-0 rounded-full bg-blue-400" />
                              {service.name}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-slate-400 italic">
                          {t.noServices}
                        </p>
                      )}
                    </div>

                    {/* Hours card */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-500" />
                        <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
                          {t.blockHours}
                        </p>
                      </div>
                      {preview.hours.length > 0 ? (
                        <ul className="space-y-1">
                          {preview.hours.map((hour) => (
                            <li
                              key={`${hour.day_of_week}-${hour.open_time}-${hour.close_time}`}
                              className="flex items-center justify-between text-xs text-slate-700"
                            >
                              <span className="font-medium text-slate-600">
                                {hour.day_of_week}
                              </span>
                              <span
                                className={
                                  hour.is_closed
                                    ? 'text-slate-400 italic'
                                    : 'text-slate-800'
                                }
                              >
                                {hour.is_closed
                                  ? '—'
                                  : `${hour.open_time ?? '—'} · ${hour.close_time ?? '—'}`}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-slate-400 italic">
                          {t.noHours}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Apply button */}
                <div className="pt-1">
                  <Button
                    type="button"
                    onClick={handleApply}
                    disabled={
                      isApplying || !hasSelectableBlocks || isLimitReached
                    }
                    className="h-1 w-full"
                  >
                    {isApplying ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t.applying}
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        {t.applyButton}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 ring-1 ring-blue-100">
                  <Sparkles className="h-6 w-6 text-blue-400" />
                </div>
                <p className="text-sm font-medium text-slate-500">
                  {t.noPreview}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
