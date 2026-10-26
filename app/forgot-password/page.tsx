'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight, Loader2, MailCheck } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthShell } from '@/components/auth/AuthShell'
import { FieldError } from '@/components/auth/FieldError'
import { createClient } from '@/lib/supabase/client'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | undefined>()
  const [submitting, setSubmitting] = useState(false)
  const [sentTo, setSentTo] = useState<string | null>(null)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = email.trim()
    if (!emailPattern.test(value)) {
      setError('Revisa el formato del correo (p. ej. nombre@negocio.com)')
      return
    }
    setError(undefined)
    setSubmitting(true)

    const supabase = createClient()
    const { error: requestError } = await supabase.auth.resetPasswordForEmail(
      value,
      {
        redirectTo: `${window.location.origin}/auth/update-password?next=/dashboard`,
      }
    )
    setSubmitting(false)

    // Rate limits are the only error worth surfacing; for anything else we show
    // the same confirmation so the form can't be used to probe which emails exist.
    if (requestError?.status === 429) {
      setError('Has hecho demasiados intentos. Espera unos minutos.')
      return
    }
    setSentTo(value)
  }

  const backLink = (
    <Link
      href="/signin"
      className="text-primary focus-visible:ring-ring/50 rounded-sm font-semibold underline-offset-4 outline-none hover:underline focus-visible:ring-3"
    >
      Volver a iniciar sesión
    </Link>
  )

  return (
    <AuthShell variant="signin" headerAction={backLink}>
      {sentTo ? (
        <div role="status">
          <span className="bg-secondary text-secondary-foreground ring-border flex size-12 items-center justify-center rounded-xl ring-1">
            <MailCheck className="size-5" aria-hidden="true" />
          </span>
          <h1 className="mt-6 text-[2rem] leading-[1.1] font-semibold tracking-[-0.045em]">
            Revisa tu{' '}
            <span className="font-serif font-normal text-[#52734a] italic">
              correo
            </span>
          </h1>
          <p className="text-muted-foreground mt-3 text-[0.95rem] leading-6">
            Si existe una cuenta con{' '}
            <span className="text-foreground font-medium">{sentTo}</span>,
            recibirás un enlace para crear una contraseña nueva. Caduca en una
            hora.
          </p>
          <p className="text-muted-foreground mt-4 text-sm">
            ¿No llega? Mira en spam o{' '}
            <button
              type="button"
              onClick={() => setSentTo(null)}
              className="text-primary focus-visible:ring-ring/50 rounded-sm font-medium underline-offset-4 outline-none hover:underline focus-visible:ring-3"
            >
              prueba con otro correo
            </button>
            .
          </p>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="mt-8 h-11 w-full"
          >
            <Link href="/signin">
              <ArrowLeft aria-hidden="true" />
              Volver a iniciar sesión
            </Link>
          </Button>
        </div>
      ) : (
        <>
          <h1 className="text-[2rem] leading-[1.1] font-semibold tracking-[-0.045em] sm:text-[2.5rem]">
            Recupera tu{' '}
            <span className="font-serif font-normal text-[#52734a] italic">
              acceso
            </span>
          </h1>
          <p className="text-muted-foreground mt-3 text-[0.95rem] leading-6">
            Escribe el correo de tu cuenta y te enviaremos un enlace para crear
            una contraseña nueva.
          </p>

          <form className="mt-8 space-y-5" onSubmit={onSubmit} noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                autoFocus
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-11 px-3.5"
                placeholder="nombre@tunegocio.com"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'email-error' : undefined}
              />
              <FieldError id="email-error" message={error} />
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={submitting || !email.trim()}
              aria-busy={submitting}
              className="h-11 w-full text-[0.9rem]"
            >
              {submitting ? (
                <>
                  <Loader2
                    className="animate-spin motion-reduce:animate-none"
                    aria-hidden="true"
                  />
                  Enviando…
                </>
              ) : (
                <>
                  Enviar enlace
                  <ArrowRight aria-hidden="true" />
                </>
              )}
            </Button>
          </form>

          <p className="text-muted-foreground mt-8 text-center text-sm sm:hidden">
            {backLink}
          </p>
        </>
      )}
    </AuthShell>
  )
}
