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
  let hasActiveSubscription = false
  let trialEndsAt = null
  let isTrialActive = false

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_price_id, stripe_subscription_id, trial_ends_at, stripe_current_period_end')
      .eq('id', user.id)
      .single()

    console.log('=== SUBSCRIPTION DEBUG ===')
    console.log('Profile:', profile)

    if (profile?.stripe_price_id) {
      currentPriceId = profile.stripe_price_id
      currentPlan = mapStripePriceIdToGenerationPlan(profile.stripe_price_id)
      hasActiveSubscription = !!profile.stripe_subscription_id

      console.log('currentPriceId:', currentPriceId)
      console.log('Mapped plan:', currentPlan)
      console.log('Has active subscription:', hasActiveSubscription)
    }

    // Check if trial is active
    if (profile?.trial_ends_at) {
      trialEndsAt = profile.trial_ends_at
      const trialEndDate = new Date(profile.trial_ends_at)
      isTrialActive = trialEndDate > new Date()
    }

    // Check if subscription is expired
    if (profile?.stripe_current_period_end) {
      const periodEndDate = new Date(profile.stripe_current_period_end)
      const isExpired = periodEndDate < new Date()

      console.log('Period end:', profile.stripe_current_period_end)
      console.log('Is expired:', isExpired)

      // If subscription expired, treat as no active subscription
      if (isExpired) {
        hasActiveSubscription = false
      }
    }
  }

  return (
    <DashboardPricing
      currentPlan={currentPlan}
      currentPriceId={currentPriceId}
      hasActiveSubscription={hasActiveSubscription}
      isTrialActive={isTrialActive}
      trialEndsAt={trialEndsAt}
    />
  )
}
