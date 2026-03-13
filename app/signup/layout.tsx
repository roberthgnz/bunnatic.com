import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo'

type SignUpLayoutProps = {
  children: React.ReactNode
}

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    locale: 'es',
    title: 'Crear cuenta | Bunnatic',
    description:
      'Crea tu cuenta de Bunnatic y activa una web preparada para captar clientes locales.',
    esPath: '/signup',
    caPath: '/signup',
    noindex: true,
  })
}

export default function SignUpLayout({ children }: SignUpLayoutProps) {
  return children
}
