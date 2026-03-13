import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-02-25.clover',
})

async function listPrices() {
    console.log('🔍 Fetching all products and prices from Stripe...\n')

    const products = await stripe.products.list({ limit: 100 })

    for (const product of products.data) {
        console.log(`📦 Product: ${product.name}`)
        console.log(`   ID: ${product.id}`)
        console.log(`   Active: ${product.active}`)

        const prices = await stripe.prices.list({
            product: product.id,
            limit: 100,
        })

        if (prices.data.length > 0) {
            console.log('   Prices:')
            for (const price of prices.data) {
                const amount = price.unit_amount
                    ? (price.unit_amount / 100).toFixed(2)
                    : 'N/A'
                const currency = price.currency.toUpperCase()
                const interval = price.recurring?.interval || 'one-time'

                console.log(
                    `     - ${price.id}: ${amount} ${currency} / ${interval} (Active: ${price.active})`
                )
            }
        } else {
            console.log('   No prices found')
        }
        console.log('')
    }

    console.log('✅ Done!')
}

listPrices().catch(console.error)
