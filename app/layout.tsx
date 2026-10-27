import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from 'sonner'
import { GoogleAnalytics } from '@/components/GoogleAnalytics'
import { CookieConsent } from '@/components/CookieConsent'
import { MicrosoftClarity } from '@/components/MicrosoftClarity'
import { ResourcePreload } from '@/components/ResourcePreload'
import { getOrganizationSchema, getWebSiteSchema } from '@/lib/structured-data'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
  preload: true,
})
const gaTrackingId = process.env.NEXT_PUBLIC_GA_TRACKING_ID

export const metadata: Metadata = {
  title: {
    default: 'Crear páginas web para negocios locales | Locavo',
    template: '%s | Locavo',
  },
  description:
    'Crea una web profesional para tu negocio local con IA en minutos. Optimizada para SEO local, con formularios de contacto y WhatsApp. Convierte visitas en clientes.',
  keywords: [
    'crear web con IA',
    'web para negocios locales',
    'seo local',
    'generador de páginas web',
    'diseño web automático',
  ],
  authors: [{ name: 'Locavo' }],
  creator: 'Locavo',
  publisher: 'Locavo',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: 'Locavo',
    title: 'Crear páginas web para negocios locales | Locavo',
    description:
      'Crea una web profesional para tu negocio local con IA en minutos. Optimizada para SEO local y captación de clientes.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Locavo - Crea tu Web con IA',
    description:
      'Crea una web profesional con IA en minutos. Optimizada para SEO local y captación de clientes.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const organizationSchema = getOrganizationSchema()
  const websiteSchema = getWebSiteSchema()

  return (
    <html
      lang="es"
      className={cn('font-sans', geist.variable)}
      suppressHydrationWarning
    >
      <head>
        <ResourcePreload />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema).replace(/</g, '\\u003c'),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema).replace(/</g, '\\u003c'),
          }}
        />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <TooltipProvider>
          {gaTrackingId ? <GoogleAnalytics trackingId={gaTrackingId} /> : null}
          <MicrosoftClarity />
          {children}
          <CookieConsent />
          <Toaster position="top-center" richColors />
        </TooltipProvider>
      </body>
    </html>
  )
}
