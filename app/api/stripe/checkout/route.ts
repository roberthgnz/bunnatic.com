import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe'

export async function POST(req: Request) {
  try {
    const stripe = getStripe()
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { priceId, returnUrl } = await req.json()

    console.log('=== STRIPE CHECKOUT DEBUG ===')
    console.log('Received priceId:', priceId)
    console.log('Received returnUrl:', returnUrl)

    if (!priceId) {
      return new NextResponse('Price ID is required', { status: 400 })
    }

    // Extract base URL from returnUrl or use APP_URL
    const baseUrl = returnUrl
      ? new URL(returnUrl).origin
      : process.env.APP_URL

    // Get user profile to check for existing customer ID
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, email')
      .eq('id', user.id)
      .single()

    let customerId = profile?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email || undefined,
        metadata: {
          userId: user.id,
        },
      })
      customerId = customer.id

      // Update profile with customer ID
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
    }

    console.log('Creating Stripe session with priceId:', priceId)
    console.log('Customer ID:', customerId)
    console.log('Base URL:', baseUrl)

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${baseUrl}/dashboard?success=true`,
      cancel_url: `${baseUrl}/dashboard?canceled=true`,
      subscription_data: {
        metadata: {
          userId: user.id,
        },
      },
      metadata: {
        userId: user.id,
      },
    })

    console.log('Session created successfully:', session.id)

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
