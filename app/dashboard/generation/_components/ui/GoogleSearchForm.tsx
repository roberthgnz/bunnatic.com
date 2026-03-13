import { Search, Loader2, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { UseFormReturn } from 'react-hook-form'
import type { GoogleSearchValues } from '../hooks/useGoogleSearch'
import type { PlaceSearchResult } from '../types'

type Props = {
    form: UseFormReturn<GoogleSearchValues>
    isSearching: boolean
    isBuildingPreview: boolean
    googleResults: PlaceSearchResult[]
    onSubmit: (values: GoogleSearchValues) => void
    onSelectResult: (result: PlaceSearchResult) => void
    labels: {
        searchPlaceholder: string
        searchButton: string
        searching: string
        errorSearch: string
        selectBusiness: string
        sourceGoogle: string
    }
}

export function GoogleSearchForm({
    form,
    isSearching,
    isBuildingPreview,
    googleResults,
    onSubmit,
    onSelectResult,
    labels,
}: Props) {
    return (
        <div className="space-y-3">
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-2 sm:flex-row"
            >
                <div className="relative flex-1 space-y-1.5">
                    <div className="relative">
                        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            {...form.register('query')}
                            placeholder={labels.searchPlaceholder}
                            aria-invalid={!!form.formState.errors.query}
                            className="h-10 border-slate-200 bg-white pl-9 text-sm focus-visible:ring-blue-500/30"
                        />
                    </div>
                    {form.formState.errors.query && (
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
                            {labels.errorSearch}
                        </p>
                    )}
                </div>
                <Button type="submit" disabled={isSearching || isBuildingPreview}>
                    {isSearching ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {labels.searching}
                        </>
                    ) : (
                        <>
                            <Search className="mr-2 h-4 w-4" />
                            {labels.searchButton}
                        </>
                    )}
                </Button>
            </form>

            {googleResults.length > 0 && (
                <div className="animate-in fade-in slide-in-from-top-2 space-y-1 rounded-xl border border-slate-200 bg-slate-50/80 p-2 duration-200">
                    {googleResults.map((result) => (
                        <button
                            key={result.place_id}
                            type="button"
                            className="group flex w-full items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-left transition-all hover:border-blue-200 hover:bg-blue-50/50 disabled:opacity-50"
                            onClick={() => onSelectResult(result)}
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
                            {labels.sourceGoogle}
                        </p>
                        <p className="mt-0.5 max-w-xs text-xs text-slate-400">
                            {labels.selectBusiness}
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
