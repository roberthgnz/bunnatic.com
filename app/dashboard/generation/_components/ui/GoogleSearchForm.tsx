import { ChevronRight, CircleAlert, Loader2, MapPin, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
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
    searchLabel: string
    searchPlaceholder: string
    searchButton: string
    searching: string
    searchHint: string
    searchRequired: string
    resultsTitle: string
    resultsCount: string
    selectResult: string
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
  const hasError = !!form.formState.errors.query
  const describedBy = hasError ? 'google-search-error' : 'google-search-hint'

  return (
    <div className="space-y-5">
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <label
          htmlFor="google-search-query"
          className="text-foreground mb-2 block text-sm font-medium"
        >
          {labels.searchLabel}
        </label>
        <div className="border-input bg-card focus-within:border-ring focus-within:ring-ring/30 has-aria-invalid:border-destructive has-aria-invalid:ring-destructive/20 flex items-center rounded-xl border p-1.5 shadow-[0_4px_16px_-8px_rgba(31,42,28,0.12)] transition-[border-color,box-shadow] focus-within:ring-3">
          <Search
            className="text-muted-foreground ml-2.5 size-4 shrink-0"
            aria-hidden="true"
          />
          <input
            id="google-search-query"
            type="search"
            autoComplete="off"
            {...form.register('query')}
            placeholder={labels.searchPlaceholder}
            aria-invalid={hasError}
            aria-describedby={describedBy}
            className="placeholder:text-muted-foreground text-foreground h-10 min-w-0 flex-1 bg-transparent px-3 text-base outline-none sm:text-sm"
          />
          <Button
            type="submit"
            disabled={isSearching || isBuildingPreview}
            className="shrink-0"
          >
            {isSearching ? (
              <Loader2 className="animate-spin" aria-hidden="true" />
            ) : null}
            {isSearching ? labels.searching : labels.searchButton}
          </Button>
        </div>
        {hasError ? (
          <p
            id="google-search-error"
            role="alert"
            className="text-destructive mt-2 flex items-center gap-1.5 text-xs font-medium"
          >
            <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
            {labels.searchRequired}
          </p>
        ) : (
          <p
            id="google-search-hint"
            className="text-muted-foreground mt-2 text-xs"
          >
            {labels.searchHint}
          </p>
        )}
      </form>

      {isSearching ? (
        <div className="space-y-2" aria-hidden="true">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="ring-border flex items-center gap-3 rounded-xl p-3.5 ring-1"
            >
              <Skeleton className="size-8 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-1/3" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {!isSearching && !isBuildingPreview && googleResults.length > 0 ? (
        <section
          aria-labelledby="google-results-title"
          className="animate-in fade-in space-y-2 duration-200"
        >
          <div className="flex items-baseline justify-between gap-3">
            <h3
              id="google-results-title"
              className="text-foreground text-sm font-medium"
            >
              {labels.resultsTitle}
            </h3>
            <p className="text-muted-foreground text-xs tabular-nums">
              {googleResults.length} {labels.resultsCount}
            </p>
          </div>
          <ul className="space-y-2">
            {googleResults.map((result) => (
              <li key={result.place_id}>
                <button
                  type="button"
                  className="group bg-card ring-border hover:bg-accent/40 hover:ring-ring/50 focus-visible:ring-ring flex w-full items-center gap-3 rounded-xl p-3.5 text-left shadow-[0_1px_2px_rgba(31,42,28,0.04)] ring-1 transition-[background-color,box-shadow] focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50"
                  onClick={() => onSelectResult(result)}
                  disabled={isBuildingPreview}
                >
                  <span className="bg-secondary text-secondary-foreground flex size-8 shrink-0 items-center justify-center rounded-lg">
                    <MapPin className="size-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="text-foreground block truncate text-sm font-semibold">
                      {result.name}
                    </span>
                    <span className="text-muted-foreground block truncate text-xs">
                      {result.formatted_address}
                    </span>
                  </span>
                  <span className="text-primary hidden shrink-0 items-center gap-0.5 text-xs font-medium sm:flex">
                    {labels.selectResult}
                    <ChevronRight
                      className="size-3.5 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                  <ChevronRight
                    className="text-muted-foreground size-4 shrink-0 sm:hidden"
                    aria-hidden="true"
                  />
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
