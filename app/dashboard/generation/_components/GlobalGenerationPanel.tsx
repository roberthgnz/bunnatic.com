'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  Loader2,
  Plus,
  Sparkles,
  TriangleAlert,
  Wand2,
} from 'lucide-react'
import {
  applyBusinessSourceGeneration,
  createBusinessFromPreview,
} from '@/lib/db/actions'
import { trackFunnelEvent } from '@/lib/funnelEvents'
import { RotatingLoaderText } from '@/app/dashboard/_components/RotatingLoaderText'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/dashboard/page-header'
import { cn } from '@/lib/utils'
import type {
  SourceType,
  SourceBlock,
  BusinessSourcePreview,
} from '@/lib/businessSourceGeneration'

// Hooks
import { useGenerationState } from './hooks/useGenerationState'
import { useEntitlement } from './hooks/useEntitlement'
import { useGoogleSearch } from './hooks/useGoogleSearch'
import { useUrlCrawl } from './hooks/useUrlCrawl'
import { usePreviewGeneration } from './hooks/usePreviewGeneration'

// UI Components
import { SourceTypeToggle } from './ui/SourceTypeToggle'
import { GoogleSearchForm } from './ui/GoogleSearchForm'
import { UrlCrawlForm } from './ui/UrlCrawlForm'
import { BusinessSelector } from './ui/BusinessSelector'
import { BlockSelector } from './ui/BlockSelector'
import { PreviewCards } from './ui/PreviewCards'

// Utils & Types
import { getTranslations } from './translations'
import { getDefaultSelectedBlocks } from './utils'
import type { BusinessListItem, PlaceSearchResult } from './types'

type Props = {
  businesses: BusinessListItem[]
  locale: string
}

type StepId = 1 | 2 | 3

const surface =
  'bg-card ring-border rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1'

function Stepper({
  steps,
  current,
  label,
  stepWord,
}: {
  steps: string[]
  current: StepId
  label: string
  stepWord: string
}) {
  return (
    <nav aria-label={label}>
      <ol className="flex items-center gap-2 sm:gap-3">
        {steps.map((step, index) => {
          const number = index + 1
          const isDone = number < current
          const isActive = number === current
          return (
            <li key={step} className="flex items-center gap-2 sm:gap-3">
              {index > 0 ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    'h-px w-5 sm:w-8',
                    isDone || isActive ? 'bg-primary/40' : 'bg-border'
                  )}
                />
              ) : null}
              <span
                aria-current={isActive ? 'step' : undefined}
                className="flex items-center gap-2"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums transition-colors',
                    isActive &&
                      'bg-primary text-primary-foreground ring-primary/15 ring-4',
                    isDone &&
                      'bg-secondary text-primary ring-primary/20 ring-1',
                    !isActive &&
                      !isDone &&
                      'bg-card text-muted-foreground ring-border ring-1'
                  )}
                >
                  {isDone ? <Check className="size-3.5" /> : number}
                </span>
                <span
                  className={cn(
                    'text-sm',
                    isActive
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground hidden sm:inline'
                  )}
                >
                  <span className="sr-only">
                    {stepWord} {number}:{' '}
                  </span>
                  {step}
                </span>
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

function StepHeading({
  step,
  total,
  stepWord,
  title,
  description,
}: {
  step: StepId
  total: number
  stepWord: string
  title: string
  description?: string
}) {
  return (
    <div className="mb-6 space-y-1">
      <p
        aria-hidden="true"
        className="text-muted-foreground text-xs font-medium"
      >
        {stepWord} {step}/{total}
      </p>
      <h2
        id="generation-step-title"
        className="text-foreground text-lg font-semibold tracking-[-0.02em]"
      >
        {title}
      </h2>
      {description ? (
        <p className="text-muted-foreground max-w-2xl text-sm leading-6">
          {description}
        </p>
      ) : null}
    </div>
  )
}

export default function GlobalGenerationPanel({ businesses, locale }: Props) {
  const router = useRouter()
  const t = getTranslations(locale)

  // State management
  const [sourceType, setSourceType] = useState<SourceType>('google')
  const [selectedBlocks, setSelectedBlocks] = useState<Set<SourceBlock>>(
    new Set()
  )
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>('')
  const [isApplying, setIsApplying] = useState(false)
  // Presentation only: which wizard step is shown for the current preview.
  const [stepView, setStepView] = useState<{
    step: StepId
    preview: BusinessSourcePreview | null
  }>({ step: 1, preview: null })

  // Custom hooks
  const {
    isLoadingState,
    setIsLoadingState,
    saveStateToStore,
    loadStateFromStore,
    clearStateFromStore,
  } = useGenerationState()

  const {
    entitlement,
    isLimitReached,
    quotaLabel,
    loadEntitlement,
    setEntitlement,
  } = useEntitlement()

  const googleSearch = useGoogleSearch(locale, t.errorSearch)
  const urlCrawl = useUrlCrawl(locale, t.errorCrawl)
  const previewGen = usePreviewGeneration(locale, t.errorPreview)

  // Load initial state
  useEffect(() => {
    const loadState = async () => {
      const savedState = await loadStateFromStore()
      if (savedState) {
        setSourceType(savedState.sourceType || 'google')
        googleSearch.setGoogleResults(savedState.googleResults || [])
        previewGen.setPreview(savedState.preview || null)
        setSelectedBlocks(
          new Set(savedState.selectedBlocks || []) as Set<SourceBlock>
        )
        setSelectedBusinessId(savedState.selectedBusinessId || '')

        if (savedState.googleQuery) {
          googleSearch.form.setValue('query', savedState.googleQuery)
        }
        if (savedState.urlValue) {
          urlCrawl.form.setValue('url', savedState.urlValue)
        }

        // Resume crawl if pending
        if (savedState.crawlJobId && savedState.crawlUrl) {
          await urlCrawl.resumeCrawl(
            savedState.crawlJobId,
            savedState.crawlUrl,
            async (result) => {
              await previewGen.buildPreview(
                'url',
                result,
                (preview, entitlement) => {
                  if (entitlement) {
                    setEntitlement(entitlement)
                  }
                  if (preview) {
                    setSelectedBlocks(getDefaultSelectedBlocks(preview))
                  }
                }
              )
            }
          )
        }
      }
      setIsLoadingState(false)
    }
    void loadState()
  }, [])

  // Pre-select first business
  useEffect(() => {
    if (businesses.length > 0 && !selectedBusinessId) {
      setSelectedBusinessId(businesses[0].id)
    }
  }, [businesses, selectedBusinessId])

  // Persist state to Cloudflare KV
  useEffect(() => {
    if (isLoadingState) return

    const timeoutId = setTimeout(() => {
      void saveStateToStore({
        sourceType,
        googleResults: googleSearch.googleResults,
        preview: previewGen.preview,
        selectedBlocks: Array.from(selectedBlocks),
        selectedBusinessId,
        googleQuery: googleSearch.form.getValues('query'),
        urlValue: urlCrawl.form.getValues('url'),
        crawlJobId: urlCrawl.crawlJobId,
        crawlUrl: urlCrawl.crawlUrl,
      })
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [
    sourceType,
    googleSearch.googleResults,
    previewGen.preview,
    selectedBlocks,
    selectedBusinessId,
    urlCrawl.crawlJobId,
    urlCrawl.crawlUrl,
    isLoadingState,
  ])

  const resetGeneratedState = () => {
    previewGen.resetPreview()
    setSelectedBlocks(new Set())
    urlCrawl.setCrawlJobId(null)
    urlCrawl.setCrawlUrl(null)
    void clearStateFromStore()
  }

  const handleSourceChange = (nextSource: SourceType) => {
    if (sourceType === nextSource) return
    setSourceType(nextSource)
    googleSearch.setGoogleResults([])
    resetGeneratedState()
    trackFunnelEvent('source_selected', {
      source_type: nextSource,
      locale,
    })
  }

  const handleGoogleSearch = async (values: { query: string }) => {
    resetGeneratedState()
    await googleSearch.handleSearch(values)
  }

  const handleSelectGoogleResult = async (result: PlaceSearchResult) => {
    try {
      const response = await fetch(
        `/api/places/details?place_id=${encodeURIComponent(result.place_id)}&lang=${locale}`
      )
      const data = (await response.json()) as {
        result?: unknown
        error?: string
      }
      if (!response.ok || !data.result)
        throw new Error(data.error || t.errorDetails)

      await previewGen.buildPreview(
        'google',
        data.result,
        (preview, entitlement) => {
          if (entitlement) {
            setEntitlement(entitlement)
          }
          if (preview) {
            setSelectedBlocks(getDefaultSelectedBlocks(preview))
          }
        }
      )
    } catch (error) {
      console.error(error)
      toast.error(t.errorDetails)
    }
  }

  const handleCrawlUrl = async (values: { url: string }) => {
    resetGeneratedState()
    await urlCrawl.handleCrawl(values, async (result) => {
      await previewGen.buildPreview('url', result, (preview, entitlement) => {
        if (entitlement) {
          setEntitlement(entitlement)
        }
        if (preview) {
          setSelectedBlocks(getDefaultSelectedBlocks(preview))
        }
      })
    })
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

  const clearAllState = async () => {
    // Clear Cloudflare KV state
    await clearStateFromStore()

    // Clear local component state
    previewGen.resetPreview()
    setSelectedBlocks(new Set())
    setSelectedBusinessId(businesses.length > 0 ? businesses[0].id : '')
    googleSearch.setGoogleResults([])
    urlCrawl.setCrawlJobId(null)
    urlCrawl.setCrawlUrl(null)
  }

  const handleApply = async () => {
    if (!previewGen.preview || !selectedBusinessId) return

    if (selectedBusinessId === 'new') {
      setIsApplying(true)
      try {
        const result = await createBusinessFromPreview({
          sourceType,
          preview: previewGen.preview,
        })
        if ('error' in result) {
          toast.error(result.error)
          return
        }

        toast.success(t.success)

        // Clear all state after successful creation
        await clearAllState()

        if (result.slug) {
          router.push(`/dashboard/businesses/${result.slug}`)
        } else {
          router.push('/dashboard')
        }
      } catch (error) {
        console.error(error)
        toast.error(t.errorPreview)
      } finally {
        setIsApplying(false)
      }
      return
    }

    if (isLimitReached) {
      trackFunnelEvent('limit_blocked', { source_type: sourceType, locale })
      toast.error(t.limitReached)
      return
    }

    const blocks = Array.from(selectedBlocks)
    if (blocks.length === 0) return

    setIsApplying(true)
    trackFunnelEvent('apply_submitted', {
      source_type: sourceType,
      locale,
      blocks_count: blocks.length,
    })

    try {
      const result = await applyBusinessSourceGeneration({
        businessId: selectedBusinessId,
        sourceType,
        selectedBlocks: blocks,
        previewPayload: previewGen.preview,
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
        locale,
        blocks_count: blocks.length,
      })
      if ('entitlement' in result && result.entitlement)
        setEntitlement(result.entitlement)
      else await loadEntitlement()

      // Clear all state after successful application
      await clearAllState()

      const business = businesses.find((b) => b.id === selectedBusinessId)
      if (business) {
        router.push(`/dashboard/businesses/${business.slug}/overview`)
      } else {
        router.refresh()
      }
    } catch (error) {
      console.error(error)
      toast.error(t.errorPreview)
    } finally {
      setIsApplying(false)
    }
  }

  // No businesses state
  if (businesses.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title={t.noBusinesses}
        description={t.createBusinessFirst}
        action={
          <Button size="lg" onClick={() => router.push('/dashboard/new')}>
            <Plus aria-hidden="true" />
            {t.createButton}
          </Button>
        }
      />
    )
  }

  const hasSelectableBlocks = selectedBlocks.size > 0
  const preview = previewGen.preview
  const isWorking = previewGen.isBuildingPreview || urlCrawl.isCrawling
  const currentStep: StepId =
    !preview || isWorking ? 1 : stepView.preview === preview ? stepView.step : 2
  const goToStep = (step: StepId) => setStepView({ step, preview })
  const isNewBusiness = selectedBusinessId === 'new'
  const isApplyDisabled =
    isApplying ||
    !selectedBusinessId ||
    (selectedBusinessId !== 'new' && (isLimitReached || !hasSelectableBlocks))

  const blockLabels: Record<SourceBlock, string> = {
    profile: t.blockProfile,
    services: t.blockServices,
    hours: t.blockHours,
  }
  const stepTitles = [t.stepSource, t.stepReview, t.stepApply]

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Stepper
          steps={stepTitles}
          current={currentStep}
          label={t.stepsLabel}
          stepWord={t.stepOf}
        />
        {entitlement ? (
          entitlement.isLimited ? (
            <Badge
              variant={isLimitReached ? 'destructive' : 'secondary'}
              className="h-7 px-2.5 tabular-nums"
            >
              <Sparkles aria-hidden="true" />
              {t.quotaLimited}: {quotaLabel}
            </Badge>
          ) : (
            <Badge variant="success" className="h-7 px-2.5">
              <Sparkles aria-hidden="true" />
              {t.quotaUnlimited}
            </Badge>
          )
        ) : null}
      </div>

      {/* Limit warning */}
      {isLimitReached && (
        <div
          role="status"
          className="bg-warning/10 ring-warning/25 flex items-start gap-3 rounded-xl px-4 py-3 ring-1"
        >
          <TriangleAlert
            className="text-warning mt-0.5 size-4 shrink-0"
            aria-hidden="true"
          />
          <p className="text-foreground text-sm">
            {t.limitReached}{' '}
            <span className="font-medium">{t.limitReachedHint}</span>
          </p>
        </div>
      )}

      <section
        aria-labelledby="generation-step-title"
        className={cn(surface, 'p-5 sm:p-8')}
      >
        {currentStep === 1 && (
          <div className="animate-in fade-in duration-200">
            <StepHeading
              step={1}
              total={3}
              stepWord={t.stepOf}
              title={t.stepSource}
            />

            <SourceTypeToggle
              sourceType={sourceType}
              onSourceChange={handleSourceChange}
              labels={{
                sourceLabel: t.sourceLabel,
                sourceGoogle: t.sourceGoogle,
                sourceUrl: t.sourceUrl,
                sourceGoogleDesc: t.sourceGoogleDesc,
                sourceUrlDesc: t.sourceUrlDesc,
              }}
            />

            <div className="mt-7">
              {sourceType === 'google' ? (
                <GoogleSearchForm
                  form={googleSearch.form}
                  isSearching={googleSearch.isSearching}
                  isBuildingPreview={previewGen.isBuildingPreview}
                  googleResults={googleSearch.googleResults}
                  onSubmit={handleGoogleSearch}
                  onSelectResult={handleSelectGoogleResult}
                  labels={{
                    searchLabel: t.searchLabel,
                    searchPlaceholder: t.searchPlaceholder,
                    searchButton: t.searchButton,
                    searching: t.searching,
                    searchHint: t.searchHint,
                    searchRequired: t.searchRequired,
                    resultsTitle: t.resultsTitle,
                    resultsCount: t.resultsCount,
                    selectResult: t.selectResult,
                  }}
                />
              ) : (
                <UrlCrawlForm
                  form={urlCrawl.form}
                  isCrawling={urlCrawl.isCrawling}
                  isBuildingPreview={previewGen.isBuildingPreview}
                  onSubmit={handleCrawlUrl}
                  labels={{
                    urlLabel: t.urlLabel,
                    urlPlaceholder: t.urlPlaceholder,
                    urlHint: t.urlHint,
                    urlInvalid: t.urlInvalid,
                    crawlButton: t.crawlButton,
                    crawling: t.crawling,
                  }}
                />
              )}
            </div>

            {/* Building preview loader */}
            {isWorking && (
              <div className="bg-muted/40 ring-border animate-in fade-in mt-6 flex flex-col items-center gap-4 rounded-xl px-6 py-8 text-center ring-1 duration-300">
                <span className="bg-secondary text-secondary-foreground flex size-10 items-center justify-center rounded-xl">
                  <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                </span>
                <div className="flex w-full flex-col items-center gap-1">
                  <p className="text-foreground text-sm font-medium">
                    {t.generatingTitle}
                  </p>
                  <RotatingLoaderText messages={t.generatingMessages} />
                </div>
                <div
                  className="w-full max-w-md space-y-2.5 pt-2"
                  aria-hidden="true"
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-10 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3.5 w-1/2" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  </div>
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                </div>
              </div>
            )}

            {/* A preview is already available (user stepped back) */}
            {!isWorking && preview && (
              <div className="bg-accent/40 ring-border mt-6 flex flex-col gap-3 rounded-xl px-4 py-3.5 ring-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-foreground text-sm">
                  {t.resumePreview}{' '}
                  <span className="font-semibold">
                    {preview.profile.name || '—'}
                  </span>
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => goToStep(2)}
                >
                  {t.resumeButton}
                  <ArrowRight aria-hidden="true" />
                </Button>
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && preview && (
          <div className="animate-in fade-in slide-in-from-bottom-1 duration-200">
            <StepHeading
              step={2}
              total={3}
              stepWord={t.stepOf}
              title={t.previewTitle}
              description={t.previewSubtitle}
            />

            <div className="space-y-6">
              <BlockSelector
                preview={preview}
                selectedBlocks={selectedBlocks}
                onToggleBlock={toggleBlock}
                labels={{
                  blocksTitle: t.blocksTitle,
                  blockProfile: t.blockProfile,
                  blockProfileDesc: t.blockProfileDesc,
                  blockServices: t.blockServices,
                  blockServicesDesc: t.blockServicesDesc,
                  blockHours: t.blockHours,
                  blockHoursDesc: t.blockHoursDesc,
                  blockUnavailable: t.blockUnavailable,
                }}
              />

              <PreviewCards
                preview={preview}
                labels={{
                  blockProfile: t.blockProfile,
                  blockServices: t.blockServices,
                  blockHours: t.blockHours,
                  ratingLabel: t.ratingLabel,
                  reviewsLabel: t.reviewsLabel,
                  priceLabel: t.priceLabel,
                  statusLabel: t.statusLabel,
                  mapsLabel: t.mapsLabel,
                  noServices: t.noServices,
                  noHours: t.noHours,
                  addressLabel: t.addressLabel,
                  phoneLabel: t.phoneLabel,
                  websiteLabel: t.websiteLabel,
                  closedLabel: t.closedLabel,
                  dayNames: t.dayNames,
                  statusOperational: t.statusOperational,
                  statusClosedTemporarily: t.statusClosedTemporarily,
                  statusClosedPermanently: t.statusClosedPermanently,
                }}
              />
            </div>

            <div className="border-border mt-8 flex flex-col-reverse gap-2 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
              <Button type="button" variant="ghost" onClick={() => goToStep(1)}>
                <ArrowLeft aria-hidden="true" />
                {t.changeSource}
              </Button>
              <Button type="button" size="lg" onClick={() => goToStep(3)}>
                {t.continueButton}
                <ArrowRight aria-hidden="true" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 3 && preview && (
          <div className="animate-in fade-in slide-in-from-bottom-1 duration-200">
            <StepHeading
              step={3}
              total={3}
              stepWord={t.stepOf}
              title={t.stepApply}
            />

            <BusinessSelector
              businesses={businesses}
              selectedBusinessId={selectedBusinessId}
              onSelectBusiness={setSelectedBusinessId}
              labels={{
                targetBusinessLabel: t.targetBusinessLabel,
                targetBusinessHint: t.targetBusinessHint,
                selectTargetPlaceholder: t.selectTargetPlaceholder,
                createNewBusiness: t.createNewBusiness,
                createNewBusinessDesc: t.createNewBusinessDesc,
              }}
            />

            {/* Summary of what will be applied */}
            <div className="bg-muted/40 ring-border mt-6 rounded-xl px-4 py-3.5 ring-1">
              <p className="text-muted-foreground text-xs font-medium">
                {t.summaryTitle}
              </p>
              {isNewBusiness ? (
                <p className="text-foreground mt-1.5 text-sm">{t.summaryNew}</p>
              ) : hasSelectableBlocks ? (
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {Array.from(selectedBlocks).map((block) => (
                    <li key={block}>
                      <Badge variant="secondary">
                        <Check aria-hidden="true" />
                        {blockLabels[block]}
                      </Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-warning mt-1.5 flex items-center gap-1.5 text-sm font-medium">
                  <TriangleAlert
                    className="size-4 shrink-0"
                    aria-hidden="true"
                  />
                  {t.noBlocksSelected}
                </p>
              )}
            </div>

            <div className="border-border mt-8 flex flex-col-reverse gap-2 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={() => goToStep(2)}
                disabled={isApplying}
              >
                <ArrowLeft aria-hidden="true" />
                {t.backButton}
              </Button>
              <Button
                type="button"
                size="lg"
                onClick={handleApply}
                disabled={isApplyDisabled}
              >
                {isApplying ? (
                  <>
                    <Loader2 className="animate-spin" aria-hidden="true" />
                    {isNewBusiness ? t.creating : t.applying}
                  </>
                ) : isNewBusiness ? (
                  <>
                    <Wand2 aria-hidden="true" />
                    {t.createButton}
                  </>
                ) : (
                  <>
                    <Sparkles aria-hidden="true" />
                    {t.applyButton}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
