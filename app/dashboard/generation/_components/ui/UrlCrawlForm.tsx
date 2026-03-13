import { Globe, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { UseFormReturn } from 'react-hook-form'
import type { UrlCrawlValues } from '../hooks/useUrlCrawl'

type Props = {
    form: UseFormReturn<UrlCrawlValues>
    isCrawling: boolean
    isBuildingPreview: boolean
    onSubmit: (values: UrlCrawlValues) => void
    labels: {
        urlPlaceholder: string
        crawlButton: string
        crawling: string
        errorCrawl: string
    }
}

export function UrlCrawlForm({
    form,
    isCrawling,
    isBuildingPreview,
    onSubmit,
    labels,
}: Props) {
    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-2 sm:flex-row"
        >
            <div className="relative flex-1 space-y-1.5">
                <div className="relative">
                    <Globe className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                        {...form.register('url')}
                        placeholder={labels.urlPlaceholder}
                        aria-invalid={!!form.formState.errors.url}
                        className="h-10 border-slate-200 bg-white pl-9 text-sm focus-visible:ring-blue-500/30"
                    />
                </div>
                {form.formState.errors.url && (
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
                        {labels.errorCrawl}
                    </p>
                )}
            </div>
            <Button type="submit" disabled={isCrawling || isBuildingPreview}>
                {isCrawling ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {labels.crawling}
                    </>
                ) : (
                    <>
                        <Globe className="mr-2 h-4 w-4" />
                        {labels.crawlButton}
                    </>
                )}
            </Button>
        </form>
    )
}
