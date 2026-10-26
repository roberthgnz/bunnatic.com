
import { getCurrentUser } from '@/lib/auth/session'
import { createClient } from '@/lib/db/server'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET() {
  try {
    const db = await createClient()
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: businesses, error } = await db
      .from('businesses')
      .select('id, name, slug')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Businesses fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch businesses' },
        { status: 500 }
      )
    }

    return NextResponse.json(businesses || [])
  } catch (error) {
    console.error('Businesses fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
