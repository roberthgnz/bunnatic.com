'use client'

import Link from 'next/link'
import { AlertCircle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

/** Also catches failures in the dashboard layout/session, above its local boundary. */
export default function AppError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="bg-background flex min-h-screen items-center justify-center px-5">
      <div
        role="alert"
        className="bg-card ring-border w-full max-w-md rounded-2xl p-8 text-center ring-1"
      >
        <AlertCircle
          className="text-destructive mx-auto size-8"
          aria-hidden="true"
        />
        <h1 className="text-foreground mt-5 text-xl font-semibold">
          No hemos podido abrir esta página
        </h1>
        <p className="text-muted-foreground mt-3 text-sm leading-6">
          El servicio no está disponible en este momento. Vuelve a intentarlo en
          unos instantes.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button onClick={reset}>
            <RotateCcw aria-hidden="true" />
            Reintentar
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Ir al inicio</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
