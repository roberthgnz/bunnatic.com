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

        const { priceId } = await req.json()

        if (!priceId) {
            return new NextResponse('Price ID is required', { status: 400 })
        }

        // Get user profile with subscription info
        const { data: profile } = await supabase
            .from('profiles')
            .select('stripe_customer_id, stripe_subscription_id')
            .eq('id', user.id)
            .single()

        if (!profile?.stripe_customer_id) {
            return new NextResponse('No customer found', { status: 404 })
        }

        if (!profile?.stripe_subscription_id) {
            return new NextResponse('No active subscription found', { status: 404 })
        }

        // Get the current subscription
        const subscription = await stripe.subscriptions.retrieve(
            profile.stripe_subscription_id
        )

        if (!subscription || subscription.status !== 'active') {
            return new NextResponse('No active subscription found', { status: 404 })
        }

        // Update the subscription with the new price
        const updatedSubscription = await stripe.subscriptions.update(
            profile.stripe_subscription_id,
            {
                items: [
                    {
                        id: subscription.items.data[0].id,
                        price: priceId,
                    },
                ],
                proration_behavior: 'create_prorations', // Prorate the charges
            }
        )

        console.log('Subscription updated successfully:', updatedSubscription.id)

        return NextResponse.json({
            success: true,
            subscription: updatedSubscription,
        })
    } catch (error) {
        console.error('Error updating subscription:', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
