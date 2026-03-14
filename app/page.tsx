import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Ticker from '@/components/Ticker'
import HowItWorks from '@/components/HowItWorks'
import Pricing from '@/components/Pricing'
import Comparison from '@/components/Comparison'
import AIDemo from '@/components/AIDemo'
import FAQ from '@/components/FAQ'
import FinalCTA from '@/components/FinalCTA'
import Footer from '@/components/Footer'
import { buildPageMetadata } from '@/lib/seo'

type HomePageProps = {
  searchParams?: Promise<{
    alternative?: string
    alternativeId?: string
  }>
}

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    locale: 'es',
    title: 'Bunnatic | Crea tu Web con IA en 5 Minutos - SEO Local Incluido',
    description:
      'Crea una web profesional para tu negocio local con IA en minutos. Optimizada para SEO local, con formularios de contacto y WhatsApp. Convierte visitas en clientes. Prueba gratis sin tarjeta.',
    esPath: '/',
    caPath: '/',
    keywords: [
      'crear web con IA',
      'web para negocios locales',
      'seo local',
      'captación de clientes',
      'generador de páginas web',
      'web profesional',
      'diseño web automático',
      'web con inteligencia artificial',
    ],
  })
}

export default async function Home({ searchParams }: HomePageProps) {
  const resolvedSearchParams = (await searchParams) ?? {}
  const comparisonAlternative =
    resolvedSearchParams.alternative ?? resolvedSearchParams.alternativeId

  return (
    <main className="min-h-screen bg-white font-sans text-gray-900 selection:bg-emerald-200 selection:text-emerald-900">
      <Navbar />
      <Hero />
      <Ticker />
      <HowItWorks />
      <Pricing />
      <Comparison alternativeId={comparisonAlternative} />
      <AIDemo />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  )
}
