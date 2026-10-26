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
  navbar: {
    logo: 'Bunnatic',
  },
  crear: {
    back: 'Volver',
  },
  signup: {
    title: 'Crear cuenta',
    subtitle: 'Empieza a gestionar tu negocio online.',
    existingAccountText: 'Iniciar sesión',
    or: '¿Ya tienes cuenta?',
    nameLabel: 'Nombre completo',
    emailLabel: 'Correo electrónico',
    passwordLabel: 'Contraseña',
    showPassword: 'Mostrar contraseña',
    hidePassword: 'Ocultar contraseña',
    nameHint: 'Tu nombre real.',
    emailHint: 'Para notificaciones importantes.',
    passwordHint: '8+ caracteres, mayúscula y número.',
    signupButton: 'Crear cuenta',
    signupButtonLoading: 'Creando...',
    securityNote: 'Datos seguros y cifrados.',
    stepBadge: 'Registro',
    socialGoogle: 'Continuar con Google',
    orDivider: 'O regístrate con correo',
    validation: {
      nameRequired: 'Requerido',
      nameMin: 'Mínimo 2 caracteres',
      nameMax: 'Máximo 80 caracteres',
      emailRequired: 'Requerido',
      emailInvalid: 'Correo inválido',
      passwordRequired: 'Requerida',
      passwordMin: 'Mínimo 8 caracteres',
      passwordUppercase: 'Falta mayúscula',
      passwordLowercase: 'Falta minúscula',
      passwordNumber: 'Falta número',
    },
  },
} as const

const REDIRECT_KEYS = new Set(['redirect', 'next', 'returnTo', 'to'])

function normalizeInternalPath(path: string) {
  return normalizeInternalRedirect(path, '/onboarding')
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
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

  const homeHref = '/'

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
      label: t.signup.validation.passwordMin,
      valid: passwordValue.length >= 8,
    },
    {
      label: t.signup.validation.passwordUppercase,
      valid: /[A-Z]/.test(passwordValue),
    },
    {
      label: t.signup.validation.passwordLowercase,
      valid: /[a-z]/.test(passwordValue),
    },
    {
      label: t.signup.validation.passwordNumber,
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

