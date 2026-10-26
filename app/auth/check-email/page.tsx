import { Suspense } from 'react'
import { ArrowLeft, Inbox, MailCheck } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FlowShell } from '@/components/auth/FlowShell'

const nextSteps = [
  {
    title: 'Abre el correo de Bunnatic',
    text: 'Lo acabamos de enviar a la dirección con la que te has registrado.',
  },
  {
    title: 'Pulsa el enlace de confirmación',
    text: 'Así verificamos que el correo es tuyo y activamos tu cuenta.',
  },
  {
    title: 'Sigue donde lo dejaste',
    text: 'Te llevaremos de vuelta para terminar de configurar tu web.',
  },
]

export default function CheckEmailPage() {
  return (
    <Suspense fallback={<div className="bg-background min-h-svh" />}>
      <CheckEmailContent />
    </Suspense>
  )
}

function CheckEmailContent() {
  return (
    <FlowShell>
      <div className="mx-auto flex w-full max-w-md flex-col px-4 py-12 sm:py-20">
        <div className="bg-card ring-border rounded-2xl p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-16px_rgba(0,0,0,0.12)] ring-1 sm:p-8">
          <span
            className="bg-accent text-primary ring-primary/10 flex size-12 items-center justify-center rounded-xl ring-1"
            aria-hidden="true"
          >
            <MailCheck className="size-6" />
          </span>

          <h1 className="mt-6 text-[1.75rem] leading-tight font-medium tracking-[-0.045em]">
            Revisa tu <span className="text-muted-foreground">correo</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            Te hemos enviado un enlace para confirmar tu cuenta. Solo te llevará
            un momento.
          </p>

          <ol className="mt-6 space-y-4">
            {nextSteps.map((step, index) => (
              <li key={step.title} className="flex gap-3">
                <span
                  className="border-border bg-background text-foreground flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold tabular-nums"
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-medium">{step.title}</p>
                  <p className="text-muted-foreground mt-0.5 text-xs leading-5">
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="bg-muted mt-6 flex gap-3 rounded-xl p-4">
            <Inbox
              className="text-muted-foreground mt-0.5 size-4 shrink-0"
              aria-hidden="true"
            />
            <p className="text-muted-foreground text-xs leading-5">
              <strong className="text-foreground font-medium">
                ¿No lo encuentras?
              </strong>{' '}
              Mira en la carpeta de spam o promociones. A veces tarda unos
              minutos en llegar.
            </p>
          </div>

          <Button asChild variant="outline" size="lg" className="mt-6 w-full">
            <Link href="/signin">
              <ArrowLeft aria-hidden="true" />
              Volver a iniciar sesión
            </Link>
          </Button>
        </div>

        <p className="text-muted-foreground mt-6 text-center text-xs">
          ¿Necesitas ayuda?{' '}
          <a
            href="mailto:hello@bunnatic.com"
            className="text-foreground font-medium underline-offset-4 hover:underline"
          >
            Escribe a soporte
          </a>
        </p>
      </div>
    </FlowShell>
  )
}
