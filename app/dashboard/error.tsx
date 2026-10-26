'use client'

import { AlertCircle, ArrowLeft, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div
      role="alert"
      className="bg-card ring-border mx-auto flex w-full max-w-lg flex-col items-center rounded-2xl px-6 py-14 text-center ring-1"
    >
      <span className="bg-destructive/10 text-destructive mb-5 flex size-12 items-center justify-center rounded-xl">
        <AlertCircle className="size-6" aria-hidden="true" />
      </span>
      <h2 className="text-foreground text-xl font-semibold tracking-tight">
        No hemos podido cargar esta sección
      </h2>
      <p className="text-muted-foreground mt-3 max-w-sm text-sm leading-6">
        Comprueba tu conexión y vuelve a intentarlo. Los cambios que hayas
        guardado se conservan.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-2">
        <Button onClick={reset}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Reintentar
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Volver al inicio
          </Link>
        </Button>
      </div>
    </div>
  )
}
