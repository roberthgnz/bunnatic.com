import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { mapStripePriceIdToGenerationPlan } from '@/lib/businessSourceGeneration'

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, avatar_url, stripe_price_id')
      .eq('id', user.id)
      .single()

    const plan = mapStripePriceIdToGenerationPlan(
      profile?.stripe_price_id ?? null
    )

    return NextResponse.json({
      full_name: profile?.full_name || user.user_metadata?.full_name || null,
      email: user.email,
      avatar_url: profile?.avatar_url || null,
      plan,
    })
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
