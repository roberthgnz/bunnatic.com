import DashboardPricing from '@/components/DashboardPricing'
import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { mapStripePriceIdToGenerationPlan } from '@/lib/businessSourceGeneration'

export const metadata: Metadata = {
  title: 'Subscription - Bunnatic',
  description: 'Manage your subscription plan.',
}

export default async function SubscriptionPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let currentPlan = 'starter'
  let currentPriceId = null

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_price_id')
      .eq('id', user.id)
      .single()

    if (profile?.stripe_price_id) {
      currentPriceId = profile.stripe_price_id
      currentPlan = mapStripePriceIdToGenerationPlan(profile.stripe_price_id)
    }
  }

  return <DashboardPricing currentPlan={currentPlan} currentPriceId={currentPriceId} />
}
