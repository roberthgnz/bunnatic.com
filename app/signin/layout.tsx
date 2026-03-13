import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo'

type SignInLayoutProps = {
  children: React.ReactNode
}

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    locale: 'es',
    title: 'Iniciar sesión | Bunnatic',
    description:
      'Accede a tu cuenta de Bunnatic para gestionar tu web y captar más clientes.',
    esPath: '/signin',
    caPath: '/signin',
    noindex: true,
  })
}

export default function SignInLayout({ children }: SignInLayoutProps) {
  return children
}
