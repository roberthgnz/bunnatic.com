import type { MetadataRoute } from 'next'
import { getBaseUrl } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = getBaseUrl()

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/api/',
                    '/dashboard/',
                    '/auth/',
                    '/checkout/',
                    '/_next/',
                    '/signin',
                    '/signup',
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
