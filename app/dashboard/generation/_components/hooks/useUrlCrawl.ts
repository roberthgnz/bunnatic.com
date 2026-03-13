import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { pollCrawlJob } from './useCrawlJob'

const urlCrawlSchema = z.object({
    url: z.string().url({ message: 'url_invalid' }),
})

export type UrlCrawlValues = z.infer<typeof urlCrawlSchema>

export function useUrlCrawl(locale: string, errorMessage: string) {
    const [isCrawling, setIsCrawling] = useState(false)
    const [crawlJobId, setCrawlJobId] = useState<string | null>(null)
    const [crawlUrl, setCrawlUrl] = useState<string | null>(null)

    const form = useForm<UrlCrawlValues>({
        resolver: zodResolver(urlCrawlSchema),
        defaultValues: { url: '' },
    })

    const handleCrawl = async (
        values: UrlCrawlValues,
        onSuccess: (result: unknown) => Promise<void>
    ) => {
        setIsCrawling(true)

        try {
            const startResponse = await fetch('/api/places/crawl', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: values.url, lang: locale }),
            })
            const startData = (await startResponse.json()) as {
                jobId?: string
                error?: string
            }
            if (!startResponse.ok || !startData.jobId)
                throw new Error(startData.error || errorMessage)

            setCrawlJobId(startData.jobId)
            setCrawlUrl(values.url)

            const crawlResult = await pollCrawlJob(
                startData.jobId,
                values.url,
                errorMessage
            )

            setCrawlJobId(null)
            setCrawlUrl(null)

            await onSuccess(crawlResult)
        } catch (error) {
            console.error(error)
            toast.error(errorMessage)
            setCrawlJobId(null)
            setCrawlUrl(null)
        } finally {
            setIsCrawling(false)
        }
    }

    const resumeCrawl = async (
        jobId: string,
        url: string,
        onSuccess: (result: unknown) => Promise<void>
    ) => {
        setCrawlJobId(jobId)
        setCrawlUrl(url)
        setIsCrawling(true)

        try {
            const crawlResult = await pollCrawlJob(jobId, url, errorMessage)
            await onSuccess(crawlResult)
            setCrawlJobId(null)
            setCrawlUrl(null)
        } catch (error) {
            console.error('Failed to resume crawl:', error)
            toast.error(errorMessage)
            setCrawlJobId(null)
            setCrawlUrl(null)
        } finally {
            setIsCrawling(false)
        }
    }

    return {
        form,
        isCrawling,
        crawlJobId,
        crawlUrl,
        handleCrawl,
        resumeCrawl,
        setCrawlJobId,
        setCrawlUrl,
    }
}
