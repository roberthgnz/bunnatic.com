
import { getCurrentUser } from '@/lib/auth/session'
import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/db/server'
import { getStripe } from '@/lib/stripe'

export async function POST(req: Request) {
  try {
    const stripe = getStripe()
    const db = await createClient()
    const user = await getCurrentUser()

    if (!user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { priceId } = await req.json()

    console.log('=== STRIPE CHECKOUT DEBUG ===')
    console.log('Received priceId:', priceId)

    if (!priceId) {
      return new NextResponse('Price ID is required', { status: 400 })
    }

    // Extract base URL from returnUrl or use APP_URL
    const baseUrl = process.env.APP_URL

    // Get user profile to check for existing customer ID
    const { data: profile } = await db
      .from('profiles')
      .select('stripe_customer_id')
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
      const saved = await createAdminClient()
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
      if (saved.error) throw new Error(saved.error.message)
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
