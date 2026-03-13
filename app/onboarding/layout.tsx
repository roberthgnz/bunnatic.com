'use client'

import { Zap } from 'lucide-react'
import Link from 'next/link'

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const t = {
    help: '¿Necesitas ayuda?',
    contact: 'Contáctanos',
    copyright: '© 2024 Bunnatic. Todos los derechos reservados.',
    terms: 'Términos',
    privacy: 'Privacidad',
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Simple Navbar */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
                <Zap className="h-5 w-5 fill-emerald-600 text-emerald-600" />
              </div>
              <span className="text-lg font-bold text-gray-900">Bunnatic</span>
            </Link>

            <div className="text-xs text-gray-500 sm:text-sm">
              {t.help}{' '}
              <a
                href="mailto:hello@bunnatic.com"
                className="font-medium text-emerald-600 transition-colors hover:text-emerald-700"
              >
                {t.contact}
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Simple Footer */}
      <footer className="border-t border-gray-200 bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 text-xs text-gray-500 sm:flex-row sm:text-sm">
            <p>{t.copyright}</p>
            <div className="flex gap-4 sm:gap-6">
              <Link
                href="/aviso-legal"
                className="transition-colors hover:text-gray-900"
              >
                {t.terms}
              </Link>
              <Link
                href="/politica-privacidad"
                className="transition-colors hover:text-gray-900"
              >
                {t.privacy}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
