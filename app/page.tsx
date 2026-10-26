import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import BusinessTypes from '@/components/landing/BusinessTypes'
import Features from '@/components/landing/Features'
import Examples from '@/components/landing/Examples'
import HowItWorks from '@/components/HowItWorks'
import Pricing from '@/components/Pricing'
import Footer from '@/components/Footer'
import { buildPageMetadata } from '@/lib/seo'

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

export default function Home() {
  return (
    <div className="landing-page min-h-screen bg-[#fafaf5] font-sans text-[#2b3b26] selection:bg-[#dce8c9] selection:text-[#263d21]">
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <Navbar />
      <main id="contenido">
        <Hero />
        <BusinessTypes />
        <Features />
        <HowItWorks />
        <Examples />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
