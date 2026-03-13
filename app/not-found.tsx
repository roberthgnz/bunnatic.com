'use client'

import Link from 'next/link'
import { Zap, ArrowLeft } from 'lucide-react'

const notFoundContent = {
  title: 'Página no encontrada',
  description:
    'Lo sentimos, no hemos podido encontrar la página que estás buscando.',
  back: 'Volver al inicio',
} as const

export default function NotFound() {
  const t = notFoundContent

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
      <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
        <Zap className="h-8 w-8 fill-emerald-600 text-emerald-600" />
      </div>
      <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
        {t.title}
      </h1>
      <p className="mb-8 max-w-md text-center text-lg text-gray-600">
        {t.description}
      </p>
      <Link
        href="/"
        className="flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-800"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.back}
      </Link>
    </main>
  )
}
