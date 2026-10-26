'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { ArrowRight, Eye, EyeOff, Loader2, LockKeyhole } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthShell } from '@/components/auth/AuthShell'
import { FieldError } from '@/components/auth/FieldError'
import { GoogleIcon } from '@/components/auth/GoogleIcon'
import {
  createSigninSchema,
  type SigninFormValues,
} from '@/lib/validations/signin'
import { login } from '@/lib/supabase/actions'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

const signInContent = {
  signin: {
    title: 'Hola de',
    titleAccent: 'nuevo',
    subtitle: 'Inicia sesión para gestionar tu web y tus clientes.',
    newAccountText: 'Crea una gratis',
    or: '¿Aún no tienes cuenta?',
    emailLabel: 'Correo electrónico',
    emailPlaceholder: 'nombre@tunegocio.com',
    passwordLabel: 'Contraseña',
    passwordPlaceholder: 'Tu contraseña',
    showPassword: 'Mostrar contraseña',
    hidePassword: 'Ocultar contraseña',
    forgotPassword: '¿Has olvidado la contraseña?',
    loginButton: 'Iniciar sesión',
    loginButtonLoading: 'Entrando…',
    socialGoogle: 'Continuar con Google',
    orDivider: 'o con tu correo',
    securityNote: 'Conexión segura y datos cifrados.',
    validation: {
      emailRequired: 'Escribe tu correo electrónico',
      emailInvalid: 'Revisa el formato del correo (p. ej. nombre@negocio.com)',
      passwordRequired: 'Escribe tu contraseña',
    },
  },
} as const

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="bg-background min-h-svh" />}>
      <SignInContent />
    </Suspense>
  )
}

function SignInContent() {
  const t = signInContent
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)

  const flow = useMemo(() => {
    const redirectRaw =
      searchParams.get('redirect') ??
      searchParams.get('next') ??
      searchParams.get('returnTo') ??
      searchParams.get('to') ??
      '/dashboard'

    return redirectRaw
  }, [searchParams])

  const signupHref = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString())
    const qs = params.toString()
    return `/signup${qs ? `?${qs}` : ''}`
  }, [searchParams])

  const schema = useMemo(
    () => createSigninSchema(t.signin.validation),
    [t.signin.validation]
  )

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SigninFormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: SigninFormValues) {
    const formData = new FormData()
    formData.append('email', data.email)
    formData.append('password', data.password)

    const result = await login(formData)

    if (result?.error) {
      toast.error(result.error)
    } else {
      router.refresh()
      router.push(flow)
    }
  }

  const handleSocialLogin = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(flow)}`,
      },
    })

    if (error) {
      toast.error(error.message)
    }
  }

  const switchLink = (
    <>
      {t.signin.or}{' '}
      <Link
        href={signupHref}
        className="text-primary focus-visible:ring-ring/50 rounded-sm font-semibold underline-offset-4 outline-none hover:underline focus-visible:ring-3"
      >
        {t.signin.newAccountText}
      </Link>
    </>
  )

  return (
    <AuthShell variant="signin" headerAction={switchLink}>
      <div>
        <h1 className="text-[2rem] leading-[1.1] font-semibold tracking-[-0.045em] sm:text-[2.5rem]">
          {t.signin.title}{' '}
          <span className="font-serif font-normal text-[#52734a] italic">
            {t.signin.titleAccent}
          </span>
        </h1>
        <p className="text-muted-foreground mt-3 text-[0.95rem] leading-6">
          {t.signin.subtitle}
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
        {t.signin.socialGoogle}
      </Button>

      <div className="my-6 flex items-center gap-3" aria-hidden="true">
        <span className="bg-border h-px flex-1" />
        <span className="text-muted-foreground text-xs">
          {t.signin.orDivider}
        </span>
        <span className="bg-border h-px flex-1" />
      </div>

      <form
        className="space-y-5"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        aria-label={t.signin.loginButton}
      >
        <div className="space-y-2">
          <Label htmlFor="email">{t.signin.emailLabel}</Label>
          <Input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            {...register('email')}
            className="h-11 px-3.5"
            placeholder={t.signin.emailPlaceholder}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          <FieldError id="email-error" message={errors.email?.message} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="password">{t.signin.passwordLabel}</Label>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 rounded-sm text-xs font-medium underline-offset-4 outline-none hover:underline focus-visible:ring-3"
            >
              {t.signin.forgotPassword}
            </a>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              {...register('password')}
              className="h-11 pr-11 pl-3.5"
              placeholder={t.signin.passwordPlaceholder}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => setShowPassword((prev) => !prev)}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-1.5 -translate-y-1/2 hover:bg-transparent active:-translate-y-1/2"
              aria-label={
                showPassword ? t.signin.hidePassword : t.signin.showPassword
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
          <FieldError id="password-error" message={errors.password?.message} />
        </div>

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
              {t.signin.loginButtonLoading}
            </>
          ) : (
            <>
              {t.signin.loginButton}
              <ArrowRight
                className="transition-transform group-hover/button:translate-x-0.5 motion-reduce:transition-none"
                aria-hidden="true"
              />
            </>
          )}
        </Button>

        <p className="text-muted-foreground flex items-center justify-center gap-1.5 text-xs">
          <LockKeyhole className="size-3.5" aria-hidden="true" />
          {t.signin.securityNote}
        </p>
      </form>

      <p className="text-muted-foreground mt-8 text-center text-sm sm:hidden">
        {switchLink}
      </p>
    </AuthShell>
  )
}
