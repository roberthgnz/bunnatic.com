'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Sparkles, Wand2, Building2 } from 'lucide-react'
import {
    applyBusinessSourceGeneration,
    createBusinessFromPreview,
} from '@/lib/supabase/actions'
import { trackFunnelEvent } from '@/lib/funnelEvents'
import { RotatingLoaderText } from '@/app/dashboard/_components/RotatingLoaderText'
import { Button } from '@/components/ui/button'
import type { SourceType, SourceBlock } from '@/lib/businessSourceGeneration'

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

export default function GlobalGenerationPanel({ businesses, locale }: Props) {
    const router = useRouter()
    const t = getTranslations(locale)

    // State management
    const [sourceType, setSourceType] = useState<SourceType>('google')
    const [selectedBlocks, setSelectedBlocks] = useState<Set<SourceBlock>>(new Set())
    const [selectedBusinessId, setSelectedBusinessId] = useState<string>('')
    const [isApplying, setIsApplying] = useState(false)

    // Custom hooks
    const {
        isLoadingState,
        setIsLoadingState,
        saveStateToRedis,
        loadStateFromRedis,
        clearStateFromRedis,
    } = useGenerationState()

    const { entitlement, isLimitReached, quotaLabel, loadEntitlement, setEntitlement } =
        useEntitlement()

    const googleSearch = useGoogleSearch(locale, t.errorSearch)
    const urlCrawl = useUrlCrawl(locale, t.errorCrawl)
    const previewGen = usePreviewGeneration(locale, t.errorPreview)

    // Load initial state
    useEffect(() => {
        const loadState = async () => {
            const savedState = await loadStateFromRedis()
            if (savedState) {
                setSourceType(savedState.sourceType || 'google')
                googleSearch.setGoogleResults(savedState.googleResults || [])
                previewGen.setPreview(savedState.preview || null)
                setSelectedBlocks(new Set(savedState.selectedBlocks || []) as Set<SourceBlock>)
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
                            await previewGen.buildPreview('url', result, (preview) => {
                                setSelectedBlocks(getDefaultSelectedBlocks(preview))
                            })
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

    // Persist state to Redis
    useEffect(() => {
        if (isLoadingState) return

        const timeoutId = setTimeout(() => {
            void saveStateToRedis({
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
        void clearStateFromRedis()
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
            const data = (await response.json()) as { result?: unknown; error?: string }
            if (!response.ok || !data.result) throw new Error(data.error || t.errorDetails)

            await previewGen.buildPreview('google', data.result, (preview) => {
                setSelectedBlocks(getDefaultSelectedBlocks(preview))
            })
        } catch (error) {
            console.error(error)
            toast.error(t.errorDetails)
        }
    }

    const handleCrawlUrl = async (values: { url: string }) => {
        resetGeneratedState()
        await urlCrawl.handleCrawl(values, async (result) => {
            await previewGen.buildPreview('url', result, (preview) => {
                setSelectedBlocks(getDefaultSelectedBlocks(preview))
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
        // Clear Redis state
        await clearStateFromRedis()

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

            if ('error' in result && result.error) {
                if (result.limitBlocked)
                    trackFunnelEvent('limit_blocked', { source_type: sourceType, locale })
                toast.error(result.error)
                if (result.entitlement) setEntitlement(result.entitlement)
                return
            }

            toast.success(t.success)
            trackFunnelEvent('apply_success', {
                source_type: sourceType,
                locale,
                blocks_count: blocks.length,
            })
            if (result.entitlement) setEntitlement(result.entitlement)
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
            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                    <Building2 className="h-6 w-6 text-slate-500" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">{t.noBusinesses}</h3>
                    <p className="text-sm text-slate-500">{t.createBusinessFirst}</p>
                </div>
                <Button onClick={() => router.push('/dashboard/new')}>
                    {t.createBusinessFirst.split(' ')[0]}
                </Button>
            </div>
        )
    }

    const hasSelectableBlocks = selectedBlocks.size > 0

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
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ${isLimitReached
                                ? 'bg-red-900/40 text-red-300 ring-red-700/40'
                                : 'bg-blue-900/30 text-blue-300 ring-blue-700/30'
                                }`}
                        >
                            <Sparkles className="h-3 w-3" />
                            {t.quotaLimited}: {quotaLabel}
                        </div>
                    ) : (
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-900/30 px-3 py-1 text-xs font-medium text-emerald-300 ring-1 ring-emerald-700/30">
                            <Sparkles className="h-3 w-3" />
                            {t.quotaUnlimited}
                        </div>
                    )}
                </div>
            </div>

            {/* Limit warning */}
            {isLimitReached && (
                <div className="flex items-start gap-3 border-b border-amber-200 bg-amber-50 px-6 py-3">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                    <p className="text-sm text-amber-800">
                        {t.limitReached} <span className="font-medium">{t.limitReachedHint}</span>
                    </p>
                </div>
            )}

            <div className="space-y-6 p-6">
                {/* Source toggle */}
                <SourceTypeToggle
                    sourceType={sourceType}
                    onSourceChange={handleSourceChange}
                    labels={{
                        sourceLabel: t.sourceLabel,
                        sourceGoogle: t.sourceGoogle,
                        sourceUrl: t.sourceUrl,
                    }}
                />

                {/* Search / URL input */}
                {sourceType === 'google' ? (
                    <GoogleSearchForm
                        form={googleSearch.form}
                        isSearching={googleSearch.isSearching}
                        isBuildingPreview={previewGen.isBuildingPreview}
                        googleResults={googleSearch.googleResults}
                        onSubmit={handleGoogleSearch}
                        onSelectResult={handleSelectGoogleResult}
                        labels={{
                            searchPlaceholder: t.searchPlaceholder,
                            searchButton: t.searchButton,
                            searching: t.searching,
                            errorSearch: t.errorSearch,
                            selectBusiness: t.selectBusiness,
                            sourceGoogle: t.sourceGoogle,
                        }}
                    />
                ) : (
                    <UrlCrawlForm
                        form={urlCrawl.form}
                        isCrawling={urlCrawl.isCrawling}
                        isBuildingPreview={previewGen.isBuildingPreview}
                        onSubmit={handleCrawlUrl}
                        labels={{
                            urlPlaceholder: t.urlPlaceholder,
                            crawlButton: t.crawlButton,
                            crawling: t.crawling,
                            errorCrawl: t.errorCrawl,
                        }}
                    />
                )}

                {/* Building preview loader */}
                {(previewGen.isBuildingPreview || urlCrawl.isCrawling) && (
                    <div className="animate-in fade-in flex items-center justify-center gap-3 rounded-xl border border-blue-100 bg-blue-50 py-10 duration-300">
                        <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                        <RotatingLoaderText messages={t.generatingMessages} />
                    </div>
                )}

                {/* Preview section */}
                {!previewGen.isBuildingPreview && !urlCrawl.isCrawling && (
                    <>
                        {previewGen.preview ? (
                            <div className="animate-in fade-in slide-in-from-bottom-2 space-y-5 duration-300">
                                <BusinessSelector
                                    businesses={businesses}
                                    selectedBusinessId={selectedBusinessId}
                                    onSelectBusiness={setSelectedBusinessId}
                                    labels={{
                                        targetBusinessLabel: t.targetBusinessLabel,
                                        selectTargetPlaceholder: t.selectTargetPlaceholder,
                                        createNewBusiness: t.createNewBusiness,
                                    }}
                                />

                                <BlockSelector
                                    preview={previewGen.preview}
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
                                    }}
                                />

                                <PreviewCards
                                    preview={previewGen.preview}
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
                                    }}
                                />

                                {/* Apply button */}
                                <div className="pt-1">
                                    <Button
                                        type="button"
                                        onClick={handleApply}
                                        disabled={
                                            isApplying ||
                                            !selectedBusinessId ||
                                            (selectedBusinessId !== 'new' &&
                                                (isLimitReached || !hasSelectableBlocks))
                                        }
                                        className="h-12 w-full"
                                    >
                                        {isApplying ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                {selectedBusinessId === 'new' ? t.createButton : t.applying}
                                            </>
                                        ) : (
                                            <>
                                                {selectedBusinessId === 'new' ? (
                                                    <>
                                                        <Wand2 className="mr-2 h-4 w-4" />
                                                        {t.createButton}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Sparkles className="mr-2 h-4 w-4" />
                                                        {t.applyButton}
                                                    </>
                                                )}
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
                                <p className="text-sm font-medium text-slate-500">{t.noPreview}</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
