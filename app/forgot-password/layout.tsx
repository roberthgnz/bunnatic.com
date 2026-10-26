import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    locale: 'es',
    title: 'Recuperar contraseña',
    description:
      'Recibe un enlace para crear una contraseña nueva en Locavo.',
    esPath: '/forgot-password',
    caPath: '/forgot-password',
    noindex: true,
  })
}

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
