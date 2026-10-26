import { NextResponse } from 'next/server'
import { getGenerationStore } from '@/lib/cloudflare/kv'

export const runtime = 'edge'

const TEMP_GENERATION_TTL_SECONDS = 60 * 60 * 24 * 7 // 7 days

type PlaceLikePayload = {
  place_id?: string
  name?: string
  formatted_address?: string
  formatted_phone_number?: string
  website?: string
  types?: string[]
  editorial_summary?: {
    overview?: string
  }
  [key: string]: unknown
}

type TempGeneration = {
  draftId?: string
  sessionId?: string
  source?: string
  placeData: PlaceLikePayload
  createdAt: number
  updatedAt: number
}

function normalizeCategoryFromTypes(types: unknown): string {
  if (!Array.isArray(types) || types.length === 0) return ''
  const first = typeof types[0] === 'string' ? types[0] : ''
  if (!first) return ''
  return first
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export async function POST(request: Request) {
  const store = getGenerationStore()
  if (!store) {
    return NextResponse.json(
      { error: 'Cloudflare KV is not configured' },
      { status: 503 }
    )
  }

  let body: {
    sessionId?: string
    draftId?: string
    source?: string
    placeData?: PlaceLikePayload
  }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!body?.placeData || typeof body.placeData !== 'object') {
    return NextResponse.json(
      { error: 'placeData is required' },
      { status: 400 }
    )
  }

  const now = Date.now()
  const key = crypto.randomUUID()
  const storageKey = `tempgen:${key}`
  const record: TempGeneration = {
    sessionId: body.sessionId,
    draftId: body.draftId,
    source: body.source,
    placeData: body.placeData,
    createdAt: now,
    updatedAt: now,
  }

  await store.set(storageKey, record, { ex: TEMP_GENERATION_TTL_SECONDS })

  return NextResponse.json({ key })
}

export async function GET(request: Request) {
  const store = getGenerationStore()
  if (!store) {
    return NextResponse.json(
      { error: 'Cloudflare KV is not configured' },
      { status: 503 }
    )
  }

  const { searchParams } = new URL(request.url)
  const key = searchParams.get('key')

  if (!key) {
    return NextResponse.json({ error: 'key is required' }, { status: 400 })
  }

  const record = await store.get<TempGeneration>(`tempgen:${key}`)
  if (!record) {
    return NextResponse.json(
      { error: 'Temporary generation not found' },
      { status: 404 }
    )
  }

  const placeData = record.placeData ?? {}
  const mapped = {
    name: typeof placeData.name === 'string' ? placeData.name : '',
    category: normalizeCategoryFromTypes(placeData.types),
    description:
      typeof placeData.editorial_summary?.overview === 'string'
        ? placeData.editorial_summary.overview
        : '',
    address:
      typeof placeData.formatted_address === 'string'
        ? placeData.formatted_address
        : '',
    phone:
      typeof placeData.formatted_phone_number === 'string'
        ? placeData.formatted_phone_number
        : '',
    website: typeof placeData.website === 'string' ? placeData.website : '',
    googlePlaceId:
      typeof placeData.place_id === 'string' ? placeData.place_id : '',
    placeData,
    draftId: record.draftId ?? '',
  }

  return NextResponse.json({ generation: mapped })
}
