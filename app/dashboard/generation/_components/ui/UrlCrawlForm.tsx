import { CircleAlert, Globe, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { UseFormReturn } from 'react-hook-form'
import type { UrlCrawlValues } from '../hooks/useUrlCrawl'

type Props = {
  form: UseFormReturn<UrlCrawlValues>
  isCrawling: boolean
  isBuildingPreview: boolean
  onSubmit: (values: UrlCrawlValues) => void
  labels: {
    urlLabel: string
    urlPlaceholder: string
    urlHint: string
    urlInvalid: string
    crawlButton: string
    crawling: string
  }
}

export function UrlCrawlForm({
  form,
  isCrawling,
  isBuildingPreview,
  onSubmit,
  labels,
}: Props) {
  const hasError = !!form.formState.errors.url
  const describedBy = hasError ? 'url-crawl-error' : 'url-crawl-hint'

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <label
        htmlFor="url-crawl-input"
        className="text-foreground mb-2 block text-sm font-medium"
      >
        {labels.urlLabel}
      </label>
      <div className="border-input bg-card focus-within:border-ring focus-within:ring-ring/30 has-aria-invalid:border-destructive has-aria-invalid:ring-destructive/20 flex items-center rounded-xl border p-1.5 shadow-[0_4px_16px_-8px_rgba(31,42,28,0.12)] transition-[border-color,box-shadow] focus-within:ring-3">
        <Globe
          className="text-muted-foreground ml-2.5 size-4 shrink-0"
          aria-hidden="true"
        />
        <input
          id="url-crawl-input"
          type="url"
          inputMode="url"
          autoComplete="url"
          {...form.register('url')}
          placeholder={labels.urlPlaceholder}
          aria-invalid={hasError}
          aria-describedby={describedBy}
          className="placeholder:text-muted-foreground text-foreground h-10 min-w-0 flex-1 bg-transparent px-3 text-base outline-none sm:text-sm"
        />
        <Button
          type="submit"
          disabled={isCrawling || isBuildingPreview}
          className="shrink-0"
        >
          {isCrawling ? (
            <Loader2 className="animate-spin" aria-hidden="true" />
          ) : null}
          {isCrawling ? labels.crawling : labels.crawlButton}
        </Button>
      </div>
      {hasError ? (
        <p
          id="url-crawl-error"
          role="alert"
          className="text-destructive mt-2 flex items-center gap-1.5 text-xs font-medium"
        >
          <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
          {labels.urlInvalid}
        </p>
      ) : (
        <p id="url-crawl-hint" className="text-muted-foreground mt-2 text-xs">
          {labels.urlHint}
        </p>
      )}
    </form>
  )
}
