import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo'

type SignUpLayoutProps = {
  children: React.ReactNode
}

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    locale: 'es',
    title: 'Crear Cuenta Gratis en Bunnatic - Web con IA en 5 Minutos',
    description:
      'Crea tu cuenta gratuita en Bunnatic y genera una web profesional con IA. Sin tarjeta, sin técnicos. Empieza a captar clientes locales hoy mismo.',
    esPath: '/signup',
    caPath: '/signup',
    noindex: true,
  })
}

export default function SignUpLayout({ children }: SignUpLayoutProps) {
  return children
}
