import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

export async function POST(req: Request) {
  console.log('=== WEBHOOK RECEIVED ===')

  const stripe = getStripe()
  const body = await req.text()
  const signature = (await headers()).get('Stripe-Signature') as string

  console.log('Signature:', signature ? 'Present' : 'Missing')

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
    console.log('Event type:', event.type)
    console.log('Event ID:', event.id)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Webhook Error:', message)
    return new NextResponse(`Webhook Error: ${message}`, { status: 400 })
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  if (event.type === 'checkout.session.completed') {
    console.log('Processing checkout.session.completed')

    const session = event.data.object as Stripe.Checkout.Session
    console.log('Session ID:', session.id)
    console.log('Session metadata:', session.metadata)

    const subscriptionId =
      typeof session.subscription === 'string'
        ? session.subscription
        : session.subscription?.id

    console.log('Subscription ID:', subscriptionId)

    if (!subscriptionId) {
      console.error('Subscription ID is missing')
      return new NextResponse(
        'Subscription ID is missing in checkout session',
        {
          status: 400,
        }
      )
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    const firstSubscriptionItem = subscription.items.data[0]

    console.log('Price ID:', firstSubscriptionItem.price.id)
    console.log('Customer ID:', subscription.customer)

    if (!firstSubscriptionItem?.current_period_end) {
      console.error('Subscription period end is missing')
      return new NextResponse('Subscription period end is missing', {
        status: 400,
      })
    }

    if (!session?.metadata?.userId) {
      console.error('User ID is missing in session metadata')
      return new NextResponse('User ID is missing in session metadata', {
        status: 400,
      })
    }

    console.log('Updating profile for user:', session.metadata.userId)

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({
        stripe_subscription_id: subscription.id,
        stripe_customer_id: subscription.customer as string,
        stripe_price_id: firstSubscriptionItem.price.id,
        stripe_current_period_end: new Date(
          firstSubscriptionItem.current_period_end * 1000
        ).toISOString(),
      })
      .eq('id', session.metadata.userId)

    if (error) {
      console.error('Supabase update error:', error)
    } else {
      console.log('Profile updated successfully:', data)
    }
  }

  if (event.type === 'invoice.payment_succeeded') {
    const invoice = event.data.object as Stripe.Invoice
    const subscriptionId =
      typeof invoice.parent?.subscription_details?.subscription === 'string'
        ? invoice.parent.subscription_details.subscription
        : invoice.parent?.subscription_details?.subscription?.id

    if (!subscriptionId) {
      return new NextResponse('Subscription ID is missing in invoice', {
        status: 400,
      })
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    const firstSubscriptionItem = subscription.items.data[0]

    if (!firstSubscriptionItem?.current_period_end) {
      return new NextResponse('Subscription period end is missing', {
        status: 400,
      })
    }

    await supabaseAdmin
      .from('profiles')
      .update({
        stripe_price_id: firstSubscriptionItem.price.id,
        stripe_current_period_end: new Date(
          firstSubscriptionItem.current_period_end * 1000
        ).toISOString(),
      })
      .eq('stripe_subscription_id', subscription.id)
  }

  if (event.type === 'customer.subscription.updated') {
    const subscription = event.data.object as Stripe.Subscription
    const firstSubscriptionItem = subscription.items.data[0]

    if (!firstSubscriptionItem?.current_period_end) {
      return new NextResponse('Subscription period end is missing', {
        status: 400,
      })
    }

    await supabaseAdmin
      .from('profiles')
      .update({
        stripe_price_id: firstSubscriptionItem.price.id,
        stripe_current_period_end: new Date(
          firstSubscriptionItem.current_period_end * 1000
        ).toISOString(),
      })
      .eq('stripe_subscription_id', subscription.id)
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription

    await supabaseAdmin
      .from('profiles')
      .update({
        stripe_subscription_id: null,
        stripe_price_id: null,
        stripe_current_period_end: null,
      })
      .eq('stripe_subscription_id', subscription.id)
  }

  return new NextResponse(null, { status: 200 })
}
