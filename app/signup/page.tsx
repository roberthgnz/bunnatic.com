'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
} from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthShell } from '@/components/auth/AuthShell'
import { FieldError } from '@/components/auth/FieldError'
import { GoogleIcon } from '@/components/auth/GoogleIcon'
import {
  createSignupSchema,
  type SignupFormValues,
} from '@/lib/validations/signup'
import { cn } from '@/lib/utils'
import { signup } from '@/lib/supabase/actions'
import { toast } from 'sonner'
import { trackFunnelEvent } from '@/lib/funnelEvents'
import { normalizeInternalRedirect } from '@/lib/authRedirect'

import { createClient } from '@/lib/supabase/client'

const CONTEXT_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'source',
  'plan',
  'billing',
  'planSuggested',
  'sector',
  'draftId',
] as const

const signUpContent = {
  signup: {
    title: 'Crea tu web en',
    titleAccent: 'minutos',
    subtitle: 'Empieza gratis: 14 días de prueba, sin tarjeta de crédito.',
    existingAccountText: 'Inicia sesión',
    or: '¿Ya tienes cuenta?',
    nameLabel: 'Nombre y apellidos',
    namePlaceholder: 'Laura García',
    emailLabel: 'Correo electrónico',
    emailPlaceholder: 'nombre@tunegocio.com',
    passwordLabel: 'Contraseña',
    passwordPlaceholder: 'Crea una contraseña segura',
    showPassword: 'Mostrar contraseña',
    hidePassword: 'Ocultar contraseña',
    requirementsLabel: 'La contraseña debe tener:',
    requirements: {
      min: 'Al menos 8 caracteres',
      uppercase: 'Una mayúscula',
      lowercase: 'Una minúscula',
      number: 'Un número',
    },
    met: 'cumplido',
    notMet: 'pendiente',
    signupButton: 'Crear cuenta gratis',
    signupButtonLoading: 'Creando tu cuenta…',
    securityNote: 'Conexión segura y datos cifrados.',
    socialGoogle: 'Continuar con Google',
    orDivider: 'o con tu correo',
    validation: {
      nameRequired: 'Escribe tu nombre',
      nameMin: 'El nombre debe tener al menos 2 caracteres',
      nameMax: 'El nombre no puede superar los 80 caracteres',
      emailRequired: 'Escribe tu correo electrónico',
      emailInvalid: 'Revisa el formato del correo (p. ej. nombre@negocio.com)',
      passwordRequired: 'Crea una contraseña',
      passwordMin: 'Usa al menos 8 caracteres',
      passwordUppercase: 'Añade al menos una mayúscula',
      passwordLowercase: 'Añade al menos una minúscula',
      passwordNumber: 'Añade al menos un número',
    },
  },
} as const

const REDIRECT_KEYS = new Set(['redirect', 'next', 'returnTo', 'to'])

function normalizeInternalPath(path: string) {
  return normalizeInternalRedirect(path, '/onboarding')
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="bg-background min-h-svh" />}>
      <SignUpContent />
    </Suspense>
  )
}

function SignUpContent() {
  const language = 'es'
  const t = signUpContent
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)

  const flow = useMemo(() => {
    const redirectRaw =
      searchParams.get('redirect') ??
      searchParams.get('next') ??
      searchParams.get('returnTo') ??
      searchParams.get('to') ??
      '/onboarding?step=checkout'

    const [targetPathRaw, targetQueryRaw = ''] = redirectRaw.split('?')
    const safeTargetPath = normalizeInternalPath(targetPathRaw || '/onboarding')
    const normalizedTargetPath =
      safeTargetPath === '/checkout' ? '/onboarding' : safeTargetPath
    const targetQuery = new URLSearchParams(targetQueryRaw)

    for (const [key, value] of searchParams.entries()) {
      if (REDIRECT_KEYS.has(key)) {
        continue
      }
      if (!targetQuery.has(key)) {
        targetQuery.set(key, value)
      }
    }

    const plan = searchParams.get('plan') ?? searchParams.get('planSuggested')
    const source = searchParams.get('source')

    if (normalizedTargetPath === '/onboarding' && !targetQuery.has('step')) {
      targetQuery.set('step', 'checkout')
    }

    if (
      normalizedTargetPath === '/onboarding' &&
      plan &&
      !targetQuery.has('plan')
    ) {
      targetQuery.set('plan', plan)
    }

    const serialized = targetQuery.toString()
    const targetWithQuery = `${normalizedTargetPath}${serialized ? `?${serialized}` : ''}`
    const destination = targetWithQuery

    return { destination, safeTargetPath: normalizedTargetPath, plan, source }
  }, [searchParams])

  const signinHref = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString())
    const qs = params.toString()
    return `/signin${qs ? `?${qs}` : ''}`
  }, [searchParams])

  const schema = useMemo(
    () => createSignupSchema(t.signup.validation),
    [t.signup.validation]
  )

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const passwordValue = useWatch({ control, name: 'password' }) ?? ''
  const passwordChecks = [
    {
      label: t.signup.requirements.min,
      valid: passwordValue.length >= 8,
    },
    {
      label: t.signup.requirements.uppercase,
      valid: /[A-Z]/.test(passwordValue),
    },
    {
      label: t.signup.requirements.lowercase,
      valid: /[a-z]/.test(passwordValue),
    },
    {
      label: t.signup.requirements.number,
      valid: /[0-9]/.test(passwordValue),
    },
  ]

  useEffect(() => {
    trackFunnelEvent('signup_started', {
      locale: language,
      source: flow.source ?? '',
      plan: flow.plan ?? '',
      has_draft: Boolean(searchParams.get('draftId')),
    })
  }, [flow.plan, flow.source, searchParams])

  async function onSubmit(data: SignupFormValues) {
    const formData = new FormData()
    formData.append('email', data.email)
    formData.append('password', data.password)
    formData.append('name', data.name)
    formData.append('redirect', flow.destination)

    const result = await signup(formData)

    if (result?.error) {
      toast.error(result.error)
    } else {
      trackFunnelEvent('signup_completed', {
        locale: language,
        source: flow.source ?? '',
        plan: flow.plan ?? '',
      })
      router.push('/auth/check-email')
    }
  }

  const handleSocialLogin = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(flow.destination)}`,
      },
    })

    if (error) {
      toast.error(error.message)
    }
  }

  const switchLink = (
    <>
      {t.signup.or}{' '}
      <Link
        href={signinHref}
        className="text-primary focus-visible:ring-ring/50 rounded-sm font-semibold underline-offset-4 outline-none hover:underline focus-visible:ring-3"
      >
        {t.signup.existingAccountText}
      </Link>
    </>
  )

  const passwordDescribedBy = [
    'password-requirements',
    errors.password ? 'password-error' : null,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <AuthShell variant="signup" headerAction={switchLink}>
      <div>
        <h1 className="text-[2rem] leading-[1.02] font-medium tracking-[-0.05em] sm:text-[2.5rem]">
          {t.signup.title}{' '}
          <span className="text-muted-foreground">{t.signup.titleAccent}</span>
        </h1>
        <p className="text-muted-foreground mt-3 text-[0.95rem] leading-6">
          {t.signup.subtitle}
        </p>
      </div>

      <Button
        variant="outline"
        size="lg"
        type="button"
        className="mt-8 h-11 w-full gap-3 text-[0.9rem]"
        onClick={handleSocialLogin}
      >
        <GoogleIcon />
        {t.signup.socialGoogle}
      </Button>

      <div className="my-6 flex items-center gap-3" aria-hidden="true">
        <span className="bg-border h-px flex-1" />
        <span className="text-muted-foreground text-xs">
          {t.signup.orDivider}
        </span>
        <span className="bg-border h-px flex-1" />
      </div>

      <form
        className="space-y-5"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        aria-label={t.signup.signupButton}
      >
        <div className="space-y-2">
          <Label htmlFor="name">{t.signup.nameLabel}</Label>
          <Input
            id="name"
            type="text"
            autoComplete="name"
            {...register('name')}
            className="h-11 px-3.5"
            placeholder={t.signup.namePlaceholder}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          <FieldError id="name-error" message={errors.name?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email-address">{t.signup.emailLabel}</Label>
          <Input
            id="email-address"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            {...register('email')}
            className="h-11 px-3.5"
            placeholder={t.signup.emailPlaceholder}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          <FieldError id="email-error" message={errors.email?.message} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">{t.signup.passwordLabel}</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              {...register('password')}
              className="h-11 pr-11 pl-3.5"
              placeholder={t.signup.passwordPlaceholder}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={passwordDescribedBy}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-1.5 -translate-y-1/2 hover:bg-transparent active:-translate-y-1/2"
              aria-label={
                showPassword ? t.signup.hidePassword : t.signup.showPassword
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

          <div id="password-requirements">
            <p className="sr-only">{t.signup.requirementsLabel}</p>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-1">
              {passwordChecks.map((rule) => (
                <li
                  key={rule.label}
                  className={cn(
                    'flex items-center gap-1.5 text-xs transition-colors motion-reduce:transition-none',
                    rule.valid ? 'text-success' : 'text-muted-foreground'
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'flex size-3.5 shrink-0 items-center justify-center rounded-full transition-colors motion-reduce:transition-none',
                      rule.valid
                        ? 'bg-success text-white'
                        : 'border-border bg-card border'
                    )}
                  >
                    {rule.valid ? <Check className="size-2.5" /> : null}
                  </span>
                  {rule.label}
                  <span className="sr-only">
                    {` (${rule.valid ? t.signup.met : t.signup.notMet})`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <FieldError id="password-error" message={errors.password?.message} />
        </div>

        {CONTEXT_KEYS.map((key) => {
          const value = searchParams.get(key)
          if (!value) {
            return null
          }
          return <input key={key} type="hidden" name={key} value={value} />
        })}

        <Button
          type="submit"
          size="lg"
          disabled={!isValid || isSubmitting}
          aria-busy={isSubmitting}
          className="mt-2 h-11 w-full text-[0.9rem]"
        >
          {isSubmitting ? (
            <>
              <Loader2
                className="animate-spin motion-reduce:animate-none"
                aria-hidden="true"
              />
              {t.signup.signupButtonLoading}
            </>
          ) : (
            <>
              {t.signup.signupButton}
              <ArrowRight
                className="transition-transform group-hover/button:translate-x-0.5 motion-reduce:transition-none"
                aria-hidden="true"
              />
            </>
          )}
        </Button>

        <p className="text-muted-foreground flex items-center justify-center gap-1.5 text-xs">
          <LockKeyhole className="size-3.5" aria-hidden="true" />
          {t.signup.securityNote}
        </p>
      </form>

      <p className="text-muted-foreground mt-8 text-center text-sm sm:hidden">
        {switchLink}
      </p>
    </AuthShell>
  )
}
