import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Highlights from '@/components/landing/Highlights'
import Features from '@/components/landing/Features'
import TemplateShowcase from '@/components/landing/TemplateShowcase'
import Examples from '@/components/landing/Examples'
import HowItWorks from '@/components/HowItWorks'
import Pricing from '@/components/Pricing'
import Footer from '@/components/Footer'
import { buildPageMetadata } from '@/lib/seo'
import { GuideCards } from '@/components/seo/GuideCards'
import { StructuredData } from '@/components/seo/StructuredData'
import { getProductSchema } from '@/lib/structured-data'

// Lazy load components below the fold
const FAQ = dynamic(() => import('@/components/FAQ'), {
  loading: () => <div className="h-96" />,
})
const FinalCTA = dynamic(() => import('@/components/FinalCTA'), {
  loading: () => <div className="h-64" />,
})

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    locale: 'es',
    title: 'Crear páginas web para negocios locales con IA',
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

export default function Home() {
  return (
    <div className="landing-page home-page min-h-screen font-sans">
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <Navbar />
      <main id="contenido">
        <StructuredData data={getProductSchema()} />
        <Hero />
        <Highlights />
        <Features />
        <TemplateShowcase />
        <Examples />
        <HowItWorks />
        <GuideCards />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
