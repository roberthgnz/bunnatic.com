/**
 * Script to test Redis generation state persistence
 * 
 * Usage:
 *   npx tsx scripts/test-redis-generation-state.ts
 */

import { Redis } from '@upstash/redis'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function testRedisGenerationState() {
    console.log('🧪 Testing Redis Generation State Persistence...\n')

    const url = process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN

    if (!url || !token) {
        console.error('❌ Missing Redis credentials in .env.local')
        console.error('   Required: UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN')
        process.exit(1)
    }

    const redis = new Redis({ url, token })

    try {
        // Test 1: Set a test state
        console.log('1️⃣  Setting test generation state...')
        const testUserId = 'test-user-123'
        const testKey = `generation_state:${testUserId}`
        const testState = {
            sourceType: 'google',
            googleResults: [
                {
                    place_id: 'test-place-1',
                    name: 'Test Restaurant',
                    formatted_address: '123 Test St, Test City',
                },
            ],
            preview: {
                profile: {
                    name: 'Test Business',
                    category: 'Restaurant',
                    description: 'A test business',
                    address: '123 Test St',
                    phone: '+1234567890',
                    website: 'https://test.com',
                },
                services: [],
                hours: [],
            },
            selectedBlocks: ['profile'],
            selectedBusinessId: 'test-business-id',
            googleQuery: 'test restaurant',
            crawlJobId: null,
            crawlUrl: null,
        }

        await redis.set(testKey, testState, { ex: 60 }) // 60 seconds TTL for test
        console.log('   ✅ State saved successfully')

        // Test 2: Retrieve the state
        console.log('\n2️⃣  Retrieving test generation state...')
        const retrievedState = await redis.get(testKey)

        if (!retrievedState) {
            console.error('   ❌ Failed to retrieve state')
            process.exit(1)
        }

        console.log('   ✅ State retrieved successfully')
        console.log('   📦 Retrieved state:', JSON.stringify(retrievedState, null, 2))

        // Test 3: Verify TTL
        console.log('\n3️⃣  Checking TTL...')
        const ttl = await redis.ttl(testKey)
        console.log(`   ✅ TTL: ${ttl} seconds`)

        // Test 4: Delete the state
        console.log('\n4️⃣  Deleting test generation state...')
        await redis.del(testKey)
        console.log('   ✅ State deleted successfully')

        // Test 5: Verify deletion
        console.log('\n5️⃣  Verifying deletion...')
        const deletedState = await redis.get(testKey)

        if (deletedState === null) {
            console.log('   ✅ State successfully deleted (returns null)')
        } else {
            console.error('   ❌ State still exists after deletion')
            process.exit(1)
        }

        console.log('\n✅ All basic tests passed!')

        // Test 6: Test crawl state persistence
        console.log('\n6️⃣  Testing crawl state persistence...')
        const crawlState = {
            ...testState,
            sourceType: 'url' as const,
            crawlJobId: 'test-job-123',
            crawlUrl: 'https://example.com',
        }

        await redis.set(testKey, crawlState, { ex: 60 })
        const retrievedCrawlState = await redis.get(testKey)

        if (
            retrievedCrawlState &&
            typeof retrievedCrawlState === 'object' &&
            'crawlJobId' in retrievedCrawlState &&
            retrievedCrawlState.crawlJobId === 'test-job-123'
        ) {
            console.log('   ✅ Crawl state persisted correctly')
            console.log(`   📦 JobId: ${retrievedCrawlState.crawlJobId}`)
            console.log(`   📦 URL: ${retrievedCrawlState.crawlUrl}`)
        } else {
            console.error('   ❌ Crawl state not persisted correctly')
            process.exit(1)
        }

        // Cleanup
        await redis.del(testKey)

        console.log('\n✅ All tests passed including crawl persistence!')
    } catch (error) {
        console.error('\n❌ Test failed:', error)
        process.exit(1)
    }
}

testRedisGenerationState()
