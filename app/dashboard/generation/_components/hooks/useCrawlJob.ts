export async function pollCrawlJob(
    jobId: string,
    url: string,
    errorMessage: string
) {
    const timeoutMs = 90_000
    const intervalMs = 1_200
    const startedAt = Date.now()
    let crawlResult: unknown = null

    while (Date.now() - startedAt < timeoutMs) {
        await new Promise((resolve) => window.setTimeout(resolve, intervalMs))

        try {
            const statusResponse = await fetch(
                `/api/places/crawl?jobId=${encodeURIComponent(jobId)}&url=${encodeURIComponent(url)}`,
                { cache: 'no-store' }
            )
            const statusData = (await statusResponse.json()) as {
                status?: string
                result?: unknown
                error?: string
            }

            if (!statusResponse.ok) {
                throw new Error(statusData.error || errorMessage)
            }

            if (statusData.status === 'completed' && statusData.result) {
                crawlResult = statusData.result
                break
            }
        } catch (error) {
            console.error('Polling error:', error)
            throw error
        }
    }

    if (!crawlResult) {
        throw new Error(errorMessage)
    }

    return crawlResult
}
