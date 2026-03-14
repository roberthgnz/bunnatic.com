import type { BusinessSourcePreview, SourceType } from '@/lib/businessSourceGeneration'

export type PlaceSearchResult = {
    place_id: string
    name: string
    formatted_address: string
}

export type BusinessListItem = {
    id: string
    name: string
    slug: string
}

export type GenerationState = {
    sourceType: SourceType
    googleResults: PlaceSearchResult[]
    preview: BusinessSourcePreview | null
    selectedBlocks: string[]
    selectedBusinessId: string
    googleQuery?: string
    urlValue?: string
    crawlJobId?: string | null
    crawlUrl?: string | null
}
