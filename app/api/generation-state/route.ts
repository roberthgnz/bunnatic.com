import { getCurrentUser } from '@/lib/auth/session'
import { NextRequest, NextResponse } from 'next/server'
import { getGenerationStore } from '@/lib/cloudflare/kv'

export const runtime = 'edge'

const GENERATION_STATE_TTL = 60 * 60 * 24 // 24 hours in seconds

type GenerationState = {
  sourceType: 'google' | 'url'
  googleResults: Array<{
    place_id: string
    name: string
    formatted_address: string
  }>
  preview: unknown
  selectedBlocks: string[]
  selectedBusinessId: string
  googleQuery?: string
  urlValue?: string
  crawlJobId?: string | null
  crawlUrl?: string | null
}

// GET: Retrieve generation state
export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const store = getGenerationStore()
    if (!store) {
      return NextResponse.json(
        { error: 'Cloudflare KV not configured' },
        { status: 500 }
      )
    }

    const key = `generation_state:${user.id}`
    const state = await store.get<GenerationState>(key)

    return NextResponse.json({ state: state || null })
  } catch (error) {
    console.error('Failed to get generation state:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve state' },
      { status: 500 }
    )
  }
}

// POST: Save generation state
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const store = getGenerationStore()
    if (!store) {
      return NextResponse.json(
        { error: 'Cloudflare KV not configured' },
        { status: 500 }
      )
    }

    const state = (await request.json()) as GenerationState

    const key = `generation_state:${user.id}`
    await store.set(key, state, { ex: GENERATION_STATE_TTL })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to save generation state:', error)
    return NextResponse.json({ error: 'Failed to save state' }, { status: 500 })
  }
}

// DELETE: Clear generation state
export async function DELETE() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const store = getGenerationStore()
    if (!store) {
      return NextResponse.json(
        { error: 'Cloudflare KV not configured' },
        { status: 500 }
      )
    }

    const key = `generation_state:${user.id}`
    await store.del(key)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete generation state:', error)
    return NextResponse.json(
      { error: 'Failed to delete state' },
      { status: 500 }
    )
  }
}
