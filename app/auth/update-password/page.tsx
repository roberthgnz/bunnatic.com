'use client'


import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { Check, Eye, EyeOff, KeyRound, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthShell } from '@/components/auth/AuthShell'
import { FieldError } from '@/components/auth/FieldError'
import { canUpdatePassword, updatePassword } from '@/lib/auth/actions'
import { normalizeInternalRedirect } from '@/lib/authRedirect'
import { cn } from '@/lib/utils'

const rules = [
  {
    key: 'length',
    label: 'Al menos 8 caracteres',
    test: (v: string) => v.length >= 8,
  },
  {
    key: 'upper',
    label: 'Una mayúscula',
    test: (v: string) => /[A-Z]/.test(v),
  },
  {
    key: 'lower',
    label: 'Una minúscula',
    test: (v: string) => /[a-z]/.test(v),
  },
  { key: 'number', label: 'Un número', test: (v: string) => /\d/.test(v) },
]

type Status = 'verifying' | 'ready' | 'invalid'

export default function UpdatePasswordPage() {
  return (
    <Suspense fallback={<div className="bg-background min-h-svh" />}>
      <UpdatePasswordContent />
    </Suspense>
  )
}

function UpdatePasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tokenHash = searchParams.get('token')
  const next = normalizeInternalRedirect(searchParams.get('next'))

  const [status, setStatus] = useState<Status>('verifying')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | undefined>()
  const [confirmError, setConfirmError] = useState<string | undefined>()

  useEffect(() => {
    let cancelled = false
    async function verify() {
      const allowed = await canUpdatePassword(tokenHash)
      if (!cancelled) setStatus(allowed ? 'ready' : 'invalid')
    }

    verify()
    return () => {
      cancelled = true
    }
  }, [tokenHash])

  const allRulesPass = rules.every((rule) => rule.test(password))

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!allRulesPass) {
      setError('La contraseña no cumple los requisitos.')
      return
    }
    if (password !== confirm) {
      setConfirmError('Las contraseñas no coinciden.')
      return
    }
    setError(undefined)
    setConfirmError(undefined)
    setSubmitting(true)

    const result = await updatePassword(password, tokenHash)
    setSubmitting(false)
    if (result.error) { setError(result.error); return }

    toast.success('Contraseña actualizada')
    router.replace(`/signin?next=${encodeURIComponent(next)}`)
    router.refresh()
  }

  return (
    <AuthShell variant="signin">
      {status === 'verifying' ? (
        <div
          role="status"
          className="text-muted-foreground flex items-center gap-3 text-sm"
        >
          <Loader2
            className="size-4 animate-spin motion-reduce:animate-none"
            aria-hidden="true"
          />
          Comprobando el enlace…
        </div>
      ) : status === 'invalid' ? (
        <div>
          <span className="bg-secondary text-secondary-foreground ring-border flex size-12 items-center justify-center rounded-xl ring-1">
            <KeyRound className="size-5" aria-hidden="true" />
          </span>
          <h1 className="mt-6 text-[2rem] leading-[1.02] font-medium tracking-[-0.05em]">
            Enlace <span className="text-muted-foreground">caducado</span>
          </h1>
          <p className="text-muted-foreground mt-3 text-[0.95rem] leading-6">
            El enlace ya se ha usado o ha caducado. Pide uno nuevo y úsalo en la
            próxima hora.
          </p>
          <Button asChild size="lg" className="mt-8 h-11 w-full">
            <Link href="/forgot-password">Pedir un enlace nuevo</Link>
          </Button>
        </div>
      ) : (
        <>
          <h1 className="text-[2rem] leading-[1.02] font-medium tracking-[-0.05em] sm:text-[2.5rem]">
            Crea una contraseña{' '}
            <span className="text-muted-foreground">nueva</span>
          </h1>
          <p className="text-muted-foreground mt-3 text-[0.95rem] leading-6">
            Elige una contraseña segura que no uses en otros sitios.
          </p>

          <form className="mt-8 space-y-5" onSubmit={onSubmit} noValidate>
            <div className="space-y-2">
              <Label htmlFor="password">Nueva contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  autoFocus
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-11 pr-11 pl-3.5"
                  aria-invalid={Boolean(error)}
                  aria-describedby="password-rules password-error"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-1.5 -translate-y-1/2 hover:bg-transparent active:-translate-y-1/2"
                  aria-label={
                    showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                  }
                  aria-pressed={showPassword}
                  aria-controls="password"
                >
                  {showPassword ? (
                    <EyeOff aria-hidden="true" />
                  ) : (
                    <Eye aria-hidden="true" />
                  )}
                </Button>
              </div>
              <ul
                id="password-rules"
                className="grid grid-cols-2 gap-x-3 gap-y-1.5 pt-1 text-xs"
              >
                {rules.map((rule) => {
                  const ok = rule.test(password)
                  return (
                    <li
                      key={rule.key}
                      className={cn(
                        'flex items-center gap-1.5 transition-colors',
                        ok ? 'text-success' : 'text-muted-foreground'
                      )}
                    >
                      <span
                        className={cn(
                          'flex size-3.5 items-center justify-center rounded-full ring-1',
                          ok
                            ? 'bg-success text-white ring-transparent'
                            : 'ring-border'
                        )}
                      >
                        {ok ? (
                          <Check className="size-2.5" aria-hidden="true" />
                        ) : null}
                      </span>
                      {rule.label}
                      <span className="sr-only">
                        {ok ? '(cumplido)' : '(pendiente)'}
                      </span>
                    </li>
                  )
                })}
              </ul>
              <FieldError id="password-error" message={error} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm">Repite la contraseña</Label>
              <Input
                id="confirm"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={confirm}
                onChange={(event) => setConfirm(event.target.value)}
                className="h-11 px-3.5"
                aria-invalid={Boolean(confirmError)}
                aria-describedby={confirmError ? 'confirm-error' : undefined}
              />
              <FieldError id="confirm-error" message={confirmError} />
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={submitting || !password || !confirm}
              aria-busy={submitting}
              className="h-11 w-full text-[0.9rem]"
            >
              {submitting ? (
                <>
                  <Loader2
                    className="animate-spin motion-reduce:animate-none"
                    aria-hidden="true"
                  />
                  Guardando…
                </>
              ) : (
                'Guardar contraseña'
              )}
            </Button>
          </form>
        </>
      )}
    </AuthShell>
  )
}
