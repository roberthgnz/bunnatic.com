import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from 'sonner'
import { GoogleAnalytics } from '@/components/GoogleAnalytics'
import { CookieConsent } from '@/components/CookieConsent'
import { getOrganizationSchema, getWebSiteSchema } from '@/lib/structured-data'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })
const gaTrackingId = process.env.NEXT_PUBLIC_GA_TRACKING_ID

export const metadata: Metadata = {
  title: {
    default: 'Bunnatic - Crea tu Web con IA en 5 Minutos',
    template: '%s | Bunnatic',
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
  authors: [{ name: 'Bunnatic' }],
  creator: 'Bunnatic',
  publisher: 'Bunnatic',
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
    siteName: 'Bunnatic',
    title: 'Bunnatic - Crea tu Web con IA en 5 Minutos',
    description:
      'Crea una web profesional para tu negocio local con IA en minutos. Optimizada para SEO local y captación de clientes.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bunnatic - Crea tu Web con IA',
    description:
      'Crea una web profesional con IA en minutos. Optimizada para SEO local y captación de clientes.',
    creator: '@bunnatic',
    site: '@bunnatic',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <TooltipProvider>
          {gaTrackingId ? <GoogleAnalytics trackingId={gaTrackingId} /> : null}
          {children}
          <CookieConsent />
          <Toaster position="top-center" richColors />
        </TooltipProvider>
      </body>
    </html>
  )
}
