'use client'

import { useEffect, useMemo, useState, type ComponentType } from 'react'
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
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  AlertCircle,
  AlertTriangle,
  AlignLeft,
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Check,
  Clock,
  Globe,
  Loader2,
  MapPin,
  MessageSquare,
  Navigation,
  PhoneCall,
  Search,
  Sparkles,
  Star,
  Tag,
  User,
  Wand2,
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

const sectionLabelClass =
  'text-muted-foreground text-[11px] font-semibold tracking-[0.14em] uppercase'

function StepHeading({
  number,
  title,
  description,
  id,
}: {
  number: number
  title: string
  description?: string
  id?: string
}) {
  return (
    <div className="flex items-start gap-3">
      <span
        aria-hidden="true"
        className="bg-secondary text-secondary-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums"
      >
        {number}
      </span>
      <div className="min-w-0">
        <h3
          id={id}
          className="text-foreground text-sm font-semibold tracking-[-0.01em]"
        >
          {title}
        </h3>
        {description ? (
          <p className="text-muted-foreground mt-0.5 text-xs leading-5">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  )
}

function FieldError({ id, message }: { id: string; message: string }) {
  return (
    <p
      id={id}
      className="text-destructive flex items-center gap-1 text-xs font-medium"
    >
      <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
      {message}
    </p>
  )
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
          title: 'Importa los datos de tu negocio',
          subtitle:
            'Toma la información real de tu ficha de Google o de tu web actual y elige qué quieres aplicar a tu perfil.',
          sourceLabel: 'Elige la fuente',
          sourceDesc: '¿De dónde sacamos la información?',
          sourceGoogle: 'Ficha de Google',
          sourceUrl: 'Tu web actual',
          quotaUnlimited: 'Generaciones ilimitadas',
          quotaLimited: 'Generaciones este mes',
          findGoogleTitle: 'Busca tu negocio',
          findGoogleDesc:
            'Escribe el nombre y la ciudad, y selecciona tu negocio en los resultados.',
          findUrlTitle: 'Indica la dirección de tu web',
          findUrlDesc:
            'Analizaremos la página para extraer tus datos. Puede tardar hasta un minuto y medio.',
          searchLabel: 'Nombre del negocio y ciudad',
          searchPlaceholder: 'Ej.: Restaurante Casa Pepe Madrid',
          searchButton: 'Buscar',
          searching: 'Buscando…',
          resultsLabel: 'Resultados de la búsqueda',
          selectBusiness:
            'Los resultados aparecerán aquí. Elige el tuyo para generar la vista previa.',
          urlLabel: 'URL de tu web',
          urlPlaceholder: 'https://tu-negocio.com',
          crawlButton: 'Analizar web',
          crawling: 'Analizando…',
          previewTitle: 'Revisa y aplica',
          previewDesc:
            'Esto es lo que hemos encontrado. Marca los bloques que quieres aplicar a tu negocio.',
          generatingMessages: [
            'Analizando la fuente de datos…',
            'Extrayendo la información del negocio…',
            'Preparando la vista previa…',
            'Esto puede tardar unos segundos…',
          ],
          blocksTitle: 'Bloques a aplicar',
          blockProfile: 'Perfil',
          blockProfileDesc: 'Nombre, categoría, descripción y contacto',
          blockServices: 'Servicios',
          blockServicesDesc: 'Catálogo de servicios detectados',
          blockHours: 'Horario',
          blockHoursDesc: 'Horario de apertura semanal',
          blockUnavailable: 'Sin datos en la fuente',
          ratingLabel: 'Valoración',
          reviewsLabel: 'reseñas',
          categoryLabel: 'Categoría',
          descriptionLabel: 'Descripción',
          addressLabel: 'Dirección',
          phoneLabel: 'Teléfono',
          websiteLabel: 'Web',
          priceLabel: 'Precio',
          statusLabel: 'Estado',
          mapsLabel: 'Ver en Google Maps',
          closed: 'Cerrado',
          days: [
            'Domingo',
            'Lunes',
            'Martes',
            'Miércoles',
            'Jueves',
            'Viernes',
            'Sábado',
          ],
          noPreview: 'Aún no hay vista previa',
          noPreviewHint:
            'Cuando selecciones tu negocio o analices tu web, verás aquí los datos encontrados.',
          noServices: 'No se han encontrado servicios en la fuente.',
          noHours: 'No se ha encontrado el horario en la fuente.',
          selectedCount: (n: number) =>
            n === 1 ? '1 bloque seleccionado' : `${n} bloques seleccionados`,
          applyHint:
            'Los bloques marcados sustituirán los datos actuales de tu negocio.',
          applyButton: 'Aplicar selección',
          applying: 'Aplicando…',
          limitReached: 'Has alcanzado el límite mensual de tu plan Starter.',
          limitReachedHint: 'Mejora tu plan para generar sin límites.',
          queryRequired: 'Escribe el nombre de tu negocio.',
          urlInvalid: 'Introduce una URL válida, incluyendo https://',
          errorSearch: 'No se ha podido buscar en Google.',
          errorDetails: 'No se han podido cargar los detalles del negocio.',
          errorCrawl: 'No se ha podido analizar la URL indicada.',
          errorPreview: 'No se ha podido generar la vista previa.',
          success: 'Información actualizada correctamente.',
        },
        ca: {
          title: 'Importa les dades del teu negoci',
          subtitle:
            'Agafa la informació real de la teva fitxa de Google o del teu web actual i tria què vols aplicar al teu perfil.',
          sourceLabel: 'Tria la font',
          sourceDesc: "D'on traiem la informació?",
          sourceGoogle: 'Fitxa de Google',
          sourceUrl: 'El teu web actual',
          quotaUnlimited: 'Generacions il·limitades',
          quotaLimited: 'Generacions aquest mes',
          findGoogleTitle: 'Cerca el teu negoci',
          findGoogleDesc:
            'Escriu el nom i la ciutat, i selecciona el teu negoci als resultats.',
          findUrlTitle: "Indica l'adreça del teu web",
          findUrlDesc:
            'Analitzarem la pàgina per extreure les teves dades. Pot trigar fins a un minut i mig.',
          searchLabel: 'Nom del negoci i ciutat',
          searchPlaceholder: 'Ex.: Restaurant Casa Pepe Barcelona',
          searchButton: 'Cercar',
          searching: 'Cercant…',
          resultsLabel: 'Resultats de la cerca',
          selectBusiness:
            'Els resultats apareixeran aquí. Tria el teu per generar la vista prèvia.',
          urlLabel: 'URL del teu web',
          urlPlaceholder: 'https://el-teu-negoci.com',
          crawlButton: 'Analitzar web',
          crawling: 'Analitzant…',
          previewTitle: 'Revisa i aplica',
          previewDesc:
            'Això és el que hem trobat. Marca els blocs que vols aplicar al teu negoci.',
          generatingMessages: [
            'Analitzant la font de dades…',
            'Extraient la informació del negoci…',
            'Preparant la vista prèvia…',
            'Això pot trigar uns segons…',
          ],
          blocksTitle: 'Blocs a aplicar',
          blockProfile: 'Perfil',
          blockProfileDesc: 'Nom, categoria, descripció i contacte',
          blockServices: 'Serveis',
          blockServicesDesc: 'Catàleg de serveis detectats',
          blockHours: 'Horari',
          blockHoursDesc: "Horari d'obertura setmanal",
          blockUnavailable: 'Sense dades a la font',
          ratingLabel: 'Valoració',
          reviewsLabel: 'ressenyes',
          categoryLabel: 'Categoria',
          descriptionLabel: 'Descripció',
          addressLabel: 'Adreça',
          phoneLabel: 'Telèfon',
          websiteLabel: 'Web',
          priceLabel: 'Preu',
          statusLabel: 'Estat',
          mapsLabel: 'Veure a Google Maps',
          closed: 'Tancat',
          days: [
            'Diumenge',
            'Dilluns',
            'Dimarts',
            'Dimecres',
            'Dijous',
            'Divendres',
            'Dissabte',
          ],
          noPreview: 'Encara no hi ha vista prèvia',
          noPreviewHint:
            'Quan seleccionis el teu negoci o analitzis el teu web, veuràs aquí les dades trobades.',
          noServices: "No s'han trobat serveis a la font.",
          noHours: "No s'ha trobat l'horari a la font.",
          selectedCount: (n: number) =>
            n === 1 ? '1 bloc seleccionat' : `${n} blocs seleccionats`,
          applyHint:
            'Els blocs marcats substituiran les dades actuals del teu negoci.',
          applyButton: 'Aplicar selecció',
          applying: 'Aplicant…',
          limitReached: 'Has arribat al límit mensual del teu pla Starter.',
          limitReachedHint: 'Millora el teu pla per generar sense límits.',
          queryRequired: 'Escriu el nom del teu negoci.',
          urlInvalid: 'Introdueix una URL vàlida, incloent-hi https://',
          errorSearch: "No s'ha pogut cercar a Google.",
          errorDetails: "No s'han pogut carregar els detalls del negoci.",
          errorCrawl: "No s'ha pogut analitzar la URL indicada.",
          errorPreview: "No s'ha pogut generar la vista prèvia.",
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
      if ('entitlement' in result && result.entitlement)
        setEntitlement(result.entitlement)
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
    icon: ComponentType<{ className?: string }>
    label: string
    desc: string
  }[] = [
    {
      key: 'profile',
      icon: User,
      label: t.blockProfile,
      desc: t.blockProfileDesc,
    },
    {
      key: 'services',
      icon: Briefcase,
      label: t.blockServices,
      desc: t.blockServicesDesc,
    },
    {
      key: 'hours',
      icon: Clock,
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

  const sourceOptions: {
    key: SourceType
    label: string
    icon: ComponentType<{ className?: string }>
  }[] = [
    { key: 'google', label: t.sourceGoogle, icon: MapPin },
    { key: 'url', label: t.sourceUrl, icon: Globe },
  ]

  const isBusy = isBuildingPreview || isCrawling
  const queryError = googleSearchForm.formState.errors.query
  const urlError = urlCrawlForm.formState.errors.url

  const formatBusinessStatus = (status: string) => {
    const normalized = status.toLowerCase()
    if (safeLocale === 'es') {
      if (normalized.includes('temporar')) return 'Cerrado temporalmente'
      if (normalized.includes('permanent')) return 'Cerrado definitivamente'
      if (normalized.includes('operational')) return 'Abierto'
    }
    return status
  }

  return (
    <section
      aria-labelledby="source-generation-title"
      className="bg-card ring-border overflow-hidden rounded-xl shadow-[0_1px_2px_rgba(31,42,28,0.04)] ring-1"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
        <div className="flex items-start gap-3">
          <span className="bg-secondary text-secondary-foreground flex size-8 shrink-0 items-center justify-center rounded-lg">
            <Wand2 className="size-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2
              id="source-generation-title"
              className="text-foreground text-base font-semibold tracking-[-0.01em]"
            >
              {t.title}
            </h2>
            <p className="text-muted-foreground mt-0.5 max-w-xl text-sm leading-6">
              {t.subtitle}
            </p>
          </div>
        </div>
        {entitlement ? (
          <Badge
            variant={
              !entitlement.isLimited
                ? 'success'
                : isLimitReached
                  ? 'destructive'
                  : 'secondary'
            }
            className="h-6 shrink-0 px-2.5"
          >
            <Sparkles aria-hidden="true" />
            {entitlement.isLimited ? (
              <>
                {t.quotaLimited}:{' '}
                <span className="tabular-nums">{quotaLabel}</span>
              </>
            ) : (
              quotaLabel
            )}
          </Badge>
        ) : null}
      </div>

      {/* Limit warning */}
      {isLimitReached && (
        <div
          role="status"
          className="border-warning/25 bg-warning/10 flex items-start gap-3 border-y px-5 py-3 sm:px-6"
        >
          <AlertTriangle
            className="text-warning mt-0.5 size-4 shrink-0"
            aria-hidden="true"
          />
          <p className="text-foreground text-sm">
            {t.limitReached}{' '}
            <span className="font-medium">{t.limitReachedHint}</span>
          </p>
        </div>
      )}

      {/* Step 1: source */}
      <div className="border-border space-y-4 border-t p-5 sm:p-6">
        <StepHeading
          number={1}
          id="source-step-title"
          title={t.sourceLabel}
          description={t.sourceDesc}
        />
        <div
          role="group"
          aria-labelledby="source-step-title"
          className="bg-muted ring-border grid w-full grid-cols-2 gap-1 rounded-lg p-1 ring-1 sm:inline-grid sm:w-auto"
        >
          {sourceOptions.map(({ key, label, icon: Icon }) => {
            const active = sourceType === key
            return (
              <button
                key={key}
                type="button"
                aria-pressed={active}
                onClick={() => handleSourceChange(key)}
                className={cn(
                  'focus-visible:ring-ring/50 flex items-center justify-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium transition-colors outline-none focus-visible:ring-3',
                  active
                    ? 'bg-card text-foreground ring-border shadow-[0_1px_2px_rgba(31,42,28,0.08)] ring-1'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon
                  className={cn('size-4', active && 'text-primary')}
                  aria-hidden="true"
                />
                {label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Step 2: find */}
      <div className="border-border space-y-4 border-t p-5 sm:p-6">
        {sourceType === 'google' ? (
          <>
            <StepHeading
              number={2}
              title={t.findGoogleTitle}
              description={t.findGoogleDesc}
            />
            <form
              onSubmit={googleSearchForm.handleSubmit(handleGoogleSearch)}
              className="space-y-1.5"
            >
              <Label htmlFor="source-google-query" className="sr-only">
                {t.searchLabel}
              </Label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <Search
                    className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
                    aria-hidden="true"
                  />
                  <Input
                    id="source-google-query"
                    {...googleSearchForm.register('query')}
                    placeholder={t.searchPlaceholder}
                    aria-invalid={!!queryError}
                    aria-describedby={
                      queryError ? 'source-google-query-error' : undefined
                    }
                    className="pl-9"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSearching || isBuildingPreview}
                >
                  {isSearching ? (
                    <Loader2 className="animate-spin" aria-hidden="true" />
                  ) : (
                    <Search aria-hidden="true" />
                  )}
                  {isSearching ? t.searching : t.searchButton}
                </Button>
              </div>
              {queryError && (
                <FieldError
                  id="source-google-query-error"
                  message={t.queryRequired}
                />
              )}
            </form>

            {/* Search results */}
            {googleResults.length > 0 && (
              <div className="space-y-2">
                <p className={sectionLabelClass} id="source-results-label">
                  {t.resultsLabel}
                </p>
                <ul
                  aria-labelledby="source-results-label"
                  className="ring-border divide-border divide-y overflow-hidden rounded-lg ring-1"
                >
                  {googleResults.map((result) => (
                    <li key={result.place_id}>
                      <button
                        type="button"
                        className="group hover:bg-muted/50 focus-visible:bg-muted/60 flex w-full items-center gap-3 px-4 py-3 text-left transition-colors outline-none disabled:pointer-events-none disabled:opacity-50"
                        onClick={() => handleSelectGoogleResult(result)}
                        disabled={isBuildingPreview}
                      >
                        <span className="bg-secondary text-secondary-foreground flex size-8 shrink-0 items-center justify-center rounded-lg">
                          <MapPin className="size-4" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="text-foreground block truncate text-sm font-medium">
                            {result.name}
                          </span>
                          <span className="text-muted-foreground block truncate text-xs">
                            {result.formatted_address}
                          </span>
                        </span>
                        <ArrowRight
                          className="text-muted-foreground/60 group-hover:text-primary size-4 shrink-0 transition-[color,transform] group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {googleResults.length === 0 &&
              !isSearching &&
              !preview &&
              !isBusy && (
                <p className="border-border text-muted-foreground flex items-center gap-2 rounded-lg border border-dashed px-4 py-3 text-xs">
                  <Search className="size-3.5 shrink-0" aria-hidden="true" />
                  {t.selectBusiness}
                </p>
              )}
          </>
        ) : (
          <>
            <StepHeading
              number={2}
              title={t.findUrlTitle}
              description={t.findUrlDesc}
            />
            <form
              onSubmit={urlCrawlForm.handleSubmit(handleCrawlUrl)}
              className="space-y-1.5"
            >
              <Label htmlFor="source-url" className="sr-only">
                {t.urlLabel}
              </Label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <Globe
                    className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
                    aria-hidden="true"
                  />
                  <Input
                    id="source-url"
                    type="url"
                    inputMode="url"
                    autoComplete="url"
                    spellCheck={false}
                    {...urlCrawlForm.register('url')}
                    placeholder={t.urlPlaceholder}
                    aria-invalid={!!urlError}
                    aria-describedby={urlError ? 'source-url-error' : undefined}
                    className="pl-9"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isCrawling || isBuildingPreview}
                >
                  {isCrawling ? (
                    <Loader2 className="animate-spin" aria-hidden="true" />
                  ) : (
                    <Globe aria-hidden="true" />
                  )}
                  {isCrawling ? t.crawling : t.crawlButton}
                </Button>
              </div>
              {urlError && (
                <FieldError id="source-url-error" message={t.urlInvalid} />
              )}
            </form>
          </>
        )}
      </div>

      {/* Step 3: review + apply */}
      <div className="border-border space-y-4 border-t p-5 sm:p-6">
        <StepHeading
          number={3}
          title={t.previewTitle}
          description={preview && !isBusy ? t.previewDesc : undefined}
        />

        {isBusy ? (
          <div
            role="status"
            aria-live="polite"
            className="bg-muted/40 ring-border flex flex-col items-center justify-center gap-2 rounded-lg py-10 ring-1"
          >
            <Loader2
              className="text-primary size-5 animate-spin"
              aria-hidden="true"
            />
            <RotatingLoaderText messages={t.generatingMessages} />
          </div>
        ) : preview ? (
          <div className="space-y-5">
            {/* Block selector */}
            <fieldset className="space-y-2">
              <legend className={cn(sectionLabelClass, 'mb-2')}>
                {t.blocksTitle}
              </legend>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {blockDefs.map(({ key, icon: Icon, label, desc }) => {
                  const disabled = isBlockDisabled(key)
                  const isSelected = selectedBlocks.has(key) && !disabled
                  return (
                    <button
                      key={key}
                      type="button"
                      role="checkbox"
                      aria-checked={isSelected}
                      disabled={disabled}
                      onClick={() => toggleBlock(key)}
                      className={cn(
                        'focus-visible:ring-ring/50 flex items-start gap-3 rounded-lg p-3.5 text-left ring-1 transition-colors outline-none focus-visible:ring-3',
                        disabled
                          ? 'bg-muted/40 ring-border cursor-not-allowed opacity-60'
                          : isSelected
                            ? 'bg-accent/50 ring-primary/60'
                            : 'bg-card ring-border hover:bg-muted/50'
                      )}
                    >
                      <span
                        className={cn(
                          'flex size-8 shrink-0 items-center justify-center rounded-lg',
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground'
                        )}
                      >
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="text-foreground block text-sm font-medium">
                          {label}
                        </span>
                        <span className="text-muted-foreground block text-xs leading-5">
                          {disabled ? t.blockUnavailable : desc}
                        </span>
                      </span>
                      <span
                        aria-hidden="true"
                        className={cn(
                          'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-[5px] ring-1',
                          isSelected
                            ? 'bg-primary text-primary-foreground ring-primary'
                            : 'bg-card ring-border text-transparent'
                        )}
                      >
                        <Check className="size-3" />
                      </span>
                    </button>
                  )
                })}
              </div>
            </fieldset>

            {/* Preview data */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Profile */}
              <div className="ring-border rounded-lg p-4 ring-1">
                <div className="flex items-center gap-2">
                  <User
                    className="text-muted-foreground size-4"
                    aria-hidden="true"
                  />
                  <p className={sectionLabelClass}>{t.blockProfile}</p>
                </div>
                <p className="text-foreground mt-3 text-base font-semibold tracking-[-0.01em]">
                  {preview.profile.name || '—'}
                </p>
                {(typeof preview.profile.rating === 'number' ||
                  typeof preview.profile.reviewCount === 'number' ||
                  (typeof preview.profile.priceLevel === 'number' &&
                    preview.profile.priceLevel > 0)) && (
                  <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                    {typeof preview.profile.rating === 'number' && (
                      <span className="flex items-center gap-1">
                        <Star
                          className="text-warning size-3.5 fill-current"
                          aria-hidden="true"
                        />
                        <span className="sr-only">{t.ratingLabel}: </span>
                        <span className="text-foreground font-medium tabular-nums">
                          {preview.profile.rating.toFixed(1)}
                        </span>
                        /5
                      </span>
                    )}
                    {typeof preview.profile.reviewCount === 'number' && (
                      <span className="flex items-center gap-1">
                        <MessageSquare
                          className="size-3.5"
                          aria-hidden="true"
                        />
                        <span className="tabular-nums">
                          {preview.profile.reviewCount}
                        </span>{' '}
                        {t.reviewsLabel}
                      </span>
                    )}
                    {typeof preview.profile.priceLevel === 'number' &&
                      preview.profile.priceLevel > 0 && (
                        <span>
                          <span className="sr-only">{t.priceLabel}: </span>
                          {'€'.repeat(preview.profile.priceLevel)}
                        </span>
                      )}
                  </div>
                )}

                <dl className="mt-4 space-y-2.5 text-sm">
                  {preview.profile.category && (
                    <div className="flex items-start gap-2.5">
                      <dt>
                        <Tag
                          className="text-muted-foreground mt-0.5 size-4"
                          aria-hidden="true"
                        />
                        <span className="sr-only">{t.categoryLabel}</span>
                      </dt>
                      <dd className="text-foreground">
                        {preview.profile.category}
                      </dd>
                    </div>
                  )}
                  {preview.profile.businessStatus && (
                    <div className="flex items-start gap-2.5">
                      <dt>
                        <Sparkles
                          className="text-muted-foreground mt-0.5 size-4"
                          aria-hidden="true"
                        />
                        <span className="sr-only">{t.statusLabel}</span>
                      </dt>
                      <dd className="text-foreground">
                        {formatBusinessStatus(preview.profile.businessStatus)}
                      </dd>
                    </div>
                  )}
                  {preview.profile.description && (
                    <div className="flex items-start gap-2.5">
                      <dt>
                        <AlignLeft
                          className="text-muted-foreground mt-0.5 size-4"
                          aria-hidden="true"
                        />
                        <span className="sr-only">{t.descriptionLabel}</span>
                      </dt>
                      <dd className="text-muted-foreground line-clamp-4 leading-6">
                        {preview.profile.description}
                      </dd>
                    </div>
                  )}
                  {preview.profile.address && (
                    <div className="flex items-start gap-2.5">
                      <dt>
                        <Navigation
                          className="text-muted-foreground mt-0.5 size-4"
                          aria-hidden="true"
                        />
                        <span className="sr-only">{t.addressLabel}</span>
                      </dt>
                      <dd className="text-foreground">
                        {preview.profile.address}
                      </dd>
                    </div>
                  )}
                  {preview.profile.phone && (
                    <div className="flex items-start gap-2.5">
                      <dt>
                        <PhoneCall
                          className="text-muted-foreground mt-0.5 size-4"
                          aria-hidden="true"
                        />
                        <span className="sr-only">{t.phoneLabel}</span>
                      </dt>
                      <dd className="text-foreground tabular-nums">
                        {preview.profile.phone}
                      </dd>
                    </div>
                  )}
                  {preview.profile.website && (
                    <div className="flex min-w-0 items-start gap-2.5">
                      <dt>
                        <Globe
                          className="text-muted-foreground mt-0.5 size-4"
                          aria-hidden="true"
                        />
                        <span className="sr-only">{t.websiteLabel}</span>
                      </dt>
                      <dd className="text-foreground min-w-0 truncate">
                        {preview.profile.website}
                      </dd>
                    </div>
                  )}
                  {preview.profile.mapsUrl && (
                    <div className="flex items-start gap-2.5">
                      <dt>
                        <MapPin
                          className="text-muted-foreground mt-0.5 size-4"
                          aria-hidden="true"
                        />
                        <span className="sr-only">Google Maps</span>
                      </dt>
                      <dd>
                        <a
                          href={preview.profile.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary inline-flex items-center gap-1 font-medium underline-offset-4 hover:underline"
                        >
                          {t.mapsLabel}
                          <ArrowUpRight
                            className="size-3.5"
                            aria-hidden="true"
                          />
                        </a>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              <div className="space-y-4">
                {/* Services */}
                <div className="ring-border rounded-lg p-4 ring-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Briefcase
                        className="text-muted-foreground size-4"
                        aria-hidden="true"
                      />
                      <p className={sectionLabelClass}>{t.blockServices}</p>
                    </div>
                    {preview.services.length > 0 ? (
                      <span className="text-muted-foreground text-xs tabular-nums">
                        {preview.services.length}
                      </span>
                    ) : null}
                  </div>
                  {preview.services.length > 0 ? (
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {preview.services.map((service) => (
                        <li key={service.name}>
                          <Badge variant="secondary">{service.name}</Badge>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground mt-3 text-xs">
                      {t.noServices}
                    </p>
                  )}
                </div>

                {/* Hours */}
                <div className="ring-border rounded-lg p-4 ring-1">
                  <div className="flex items-center gap-2">
                    <Clock
                      className="text-muted-foreground size-4"
                      aria-hidden="true"
                    />
                    <p className={sectionLabelClass}>{t.blockHours}</p>
                  </div>
                  {preview.hours.length > 0 ? (
                    <dl className="divide-border mt-2 divide-y text-sm">
                      {preview.hours.map((hour) => (
                        <div
                          key={`${hour.day_of_week}-${hour.open_time}-${hour.close_time}`}
                          className="flex items-center justify-between gap-3 py-1.5"
                        >
                          <dt className="text-muted-foreground">
                            {t.days[hour.day_of_week] ?? hour.day_of_week}
                          </dt>
                          <dd
                            className={cn(
                              'tabular-nums',
                              hour.is_closed
                                ? 'text-muted-foreground'
                                : 'text-foreground font-medium'
                            )}
                          >
                            {hour.is_closed
                              ? t.closed
                              : `${hour.open_time ?? '—'} – ${hour.close_time ?? '—'}`}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  ) : (
                    <p className="text-muted-foreground mt-3 text-xs">
                      {t.noHours}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="border-border flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-10 text-center">
            <span className="bg-secondary text-secondary-foreground ring-border mb-3 flex size-10 items-center justify-center rounded-xl ring-1">
              <Sparkles className="size-5" aria-hidden="true" />
            </span>
            <p className="text-foreground text-sm font-medium">{t.noPreview}</p>
            <p className="text-muted-foreground mt-1 max-w-sm text-xs leading-5">
              {t.noPreviewHint}
            </p>
          </div>
        )}
      </div>

      {/* Footer: apply */}
      {preview && !isBusy ? (
        <div className="bg-muted/40 border-border flex flex-col gap-3 border-t px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="text-xs leading-5">
            <p className="text-foreground font-medium" aria-live="polite">
              {t.selectedCount(selectedBlocks.size)}
            </p>
            <p className="text-muted-foreground">{t.applyHint}</p>
          </div>
          <Button
            type="button"
            onClick={handleApply}
            disabled={isApplying || !hasSelectableBlocks || isLimitReached}
            className="shrink-0"
          >
            {isApplying ? (
              <Loader2 className="animate-spin" aria-hidden="true" />
            ) : (
              <Sparkles aria-hidden="true" />
            )}
            {isApplying ? t.applying : t.applyButton}
          </Button>
        </div>
      ) : null}
    </section>
  )
}
