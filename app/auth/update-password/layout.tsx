import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    locale: 'es',
    title: 'Nueva contraseña',
    description: 'Crea una contraseña nueva para tu cuenta de Bunnatic.',
    esPath: '/auth/update-password',
    caPath: '/auth/update-password',
    noindex: true,
  })
}

export default function UpdatePasswordLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
