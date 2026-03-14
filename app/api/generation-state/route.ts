import { NextRequest, NextResponse } from 'next/server'
import { getUpstashRedis } from '@/lib/upstash'
import { createClient } from '@/lib/supabase/server'

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
        const supabase = await createClient()
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const redis = getUpstashRedis()
        if (!redis) {
            return NextResponse.json(
                { error: 'Redis not configured' },
                { status: 500 }
            )
        }

        const key = `generation_state:${user.id}`
        const state = await redis.get<GenerationState>(key)

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
        const supabase = await createClient()
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const redis = getUpstashRedis()
        if (!redis) {
            return NextResponse.json(
                { error: 'Redis not configured' },
                { status: 500 }
            )
        }

        const state = (await request.json()) as GenerationState

        const key = `generation_state:${user.id}`
        await redis.set(key, state, { ex: GENERATION_STATE_TTL })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Failed to save generation state:', error)
        return NextResponse.json(
            { error: 'Failed to save state' },
            { status: 500 }
        )
    }
}

// DELETE: Clear generation state
export async function DELETE() {
    try {
        const supabase = await createClient()
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const redis = getUpstashRedis()
        if (!redis) {
            return NextResponse.json(
                { error: 'Redis not configured' },
                { status: 500 }
            )
        }

        const key = `generation_state:${user.id}`
        await redis.del(key)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Failed to delete generation state:', error)
        return NextResponse.json(
            { error: 'Failed to delete state' },
            { status: 500 }
        )
    }
}
