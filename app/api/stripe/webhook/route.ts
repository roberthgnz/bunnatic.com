import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

export async function POST(req: Request) {
  const stripe = getStripe()
  const body = await req.text()
  const signature = (await headers()).get('Stripe-Signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const subscriptionId =
      typeof session.subscription === 'string'
        ? session.subscription
        : session.subscription?.id

    if (!subscriptionId) {
      return new NextResponse(
        'Subscription ID is missing in checkout session',
        {
          status: 400,
        }
      )
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    const firstSubscriptionItem = subscription.items.data[0]

    if (!firstSubscriptionItem?.current_period_end) {
      return new NextResponse('Subscription period end is missing', {
        status: 400,
      })
    }

    if (!session?.metadata?.userId) {
      return new NextResponse('User ID is missing in session metadata', {
        status: 400,
      })
    }

    await supabaseAdmin
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

  return new NextResponse(null, { status: 200 })
}
