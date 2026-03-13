import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import type { PlaceSearchResult } from '../types'

const googleSearchSchema = z.object({
    query: z.string().min(1, { message: 'query_required' }),
})

export type GoogleSearchValues = z.infer<typeof googleSearchSchema>

export function useGoogleSearch(locale: string, errorMessage: string) {
    const [isSearching, setIsSearching] = useState(false)
    const [googleResults, setGoogleResults] = useState<PlaceSearchResult[]>([])

    const form = useForm<GoogleSearchValues>({
        resolver: zodResolver(googleSearchSchema),
        defaultValues: { query: '' },
    })

    const handleSearch = async (values: GoogleSearchValues) => {
        setIsSearching(true)
        setGoogleResults([])

        try {
            const response = await fetch(
                `/api/places/search?q=${encodeURIComponent(values.query.trim())}&lang=${locale}`
            )
            const data = (await response.json()) as {
                results?: PlaceSearchResult[]
                error?: string
            }
            if (!response.ok) throw new Error(data.error || errorMessage)
            setGoogleResults(Array.isArray(data.results) ? data.results : [])
        } catch (error) {
            console.error(error)
            toast.error(errorMessage)
        } finally {
            setIsSearching(false)
        }
    }

    return {
        form,
        isSearching,
        googleResults,
        handleSearch,
        setGoogleResults,
    }
}
