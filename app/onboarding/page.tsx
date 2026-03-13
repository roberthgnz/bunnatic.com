'use client'

import Link from 'next/link'
import {
  Suspense,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react'
import { content } from '@/lib/content'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBusiness } from '@/lib/supabase/actions'
import { toast } from 'sonner'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { getLegalSlug } from '@/lib/pageSlugs'
import { trackFunnelEvent } from '@/lib/funnelEvents'

const EMPTY_DRAFT_SNAPSHOT = ''

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <OnboardingContent />
    </Suspense>
  )
}

function OnboardingContent() {
  const language = 'es'
  const searchParams = useSearchParams()
  const router = useRouter()
  const plan = searchParams.get('plan') ?? 'starter'
  const step = searchParams.get('step') === 'business' ? 'business' : 'checkout'
  const source = searchParams.get('source')
  const draftId = searchParams.get('draftId')
  const publishIntent = searchParams.get('publishIntent') === '1'
  const tempGenerationKey = searchParams.get('tempGenerationKey')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    address: '',
    phone: '',
    website: '',
    googlePlaceId: '',
    placeData: '',
  })
  const languageKey = 'es'

  const selectedTier = useMemo(() => {
    const tiers = content.pricing.tiers
    return tiers.find((tier) => tier.id === `tier-${plan}`) ?? tiers[0]
  }, [plan])

  const legalLinks = useMemo(() => {
    const lang = 'es'
    return {
      terms: `/${getLegalSlug('aviso-legal', lang)}`,
      privacy: `/${getLegalSlug('politica-privacidad', lang)}`,
    }
  }, [])

  const businessStepHref = useMemo(() => {
    const params = new URLSearchParams()
    params.set('step', 'business')
    params.set('plan', plan)
    if (draftId) {
      params.set('draftId', draftId)
    }
    if (source) {
      params.set('source', source)
    }
    if (publishIntent) {
      params.set('publishIntent', '1')
    }
    if (tempGenerationKey) {
      params.set('tempGenerationKey', tempGenerationKey)
    }
    return `/onboarding?${params.toString()}`
  }, [draftId, plan, publishIntent, source, tempGenerationKey])

  const draftSnapshot = useSyncExternalStore(
    (callback) => {
      if (typeof window === 'undefined') return () => {}
      window.addEventListener('storage', callback)
      return () => window.removeEventListener('storage', callback)
    },
    () => {
      if (!draftId || typeof window === 'undefined') return EMPTY_DRAFT_SNAPSHOT
      return (
        window.localStorage.getItem(`draft:${draftId}`) ?? EMPTY_DRAFT_SNAPSHOT
      )
    },
    () => EMPTY_DRAFT_SNAPSHOT
  )

  const draftData = useMemo(() => {
    if (!draftSnapshot) return { name: '', sector: '' }
    try {
      const parsed = JSON.parse(draftSnapshot) as {
        name?: string
        sector?: string
      }
      return {
        name: parsed.name ?? '',
        sector: parsed.sector ?? '',
      }
    } catch {
      return { name: '', sector: '' }
    }
  }, [draftSnapshot])

  useEffect(() => {
    if (step !== 'checkout') return

    trackFunnelEvent('checkout_started', {
      locale: language,
      plan,
      has_draft: Boolean(draftId),
    })
  }, [draftId, language, plan, step])

  useEffect(() => {
    if (step !== 'business' || !publishIntent || !tempGenerationKey) return

    let cancelled = false

    const hydrateFromTempGeneration = async () => {
      try {
        const response = await fetch(
          `/api/temp-generation?key=${encodeURIComponent(tempGenerationKey)}`
        )
        if (!response.ok) return

        const data = await response.json()
        const generation = data?.generation
        if (!generation || cancelled) return

        setFormData((prev) => ({
          ...prev,
          name: prev.name || (generation.name ?? ''),
          category: prev.category || (generation.category ?? ''),
          description: prev.description || (generation.description ?? ''),
          address: generation.address ?? '',
          phone: generation.phone ?? '',
          website: generation.website ?? '',
          googlePlaceId: generation.googlePlaceId ?? '',
          placeData: generation.placeData
            ? JSON.stringify(generation.placeData)
            : '',
        }))
      } catch (error) {
        console.error('Error hydrating onboarding from temp generation:', error)
      }
    }

    hydrateFromTempGeneration()

    return () => {
      cancelled = true
    }
  }, [publishIntent, step, tempGenerationKey])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const data = new FormData(event.currentTarget)

    // Generate a simple slug from name
    const name = data.get('name') as string
    const slug =
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') +
      '-' +
      Math.floor(Math.random() * 1000)
    data.append('slug', slug)

    const result = await createBusiness(data)

    if (result?.error) {
      toast.error(result.error)
      setLoading(false)
    } else {
      toast.success(
        'Negocio creado correctamente'
      )
      router.push(`/dashboard`)
    }
  }

  const t = {
    title: 'Crea tu espacio de trabajo',
    subtitle: 'Configura tu negocio para comenzar.',
    step: '2/2',
    nameLabel: 'Nombre del negocio',
    namePlaceholder: 'Ej. Restaurante La Plaza',
    categoryLabel: 'Categoría',
    categoryPlaceholder: 'Ej. Restaurante, Clínica, Taller...',
    descLabel: 'Descripción corta (opcional)',
    descPlaceholder: 'Describe brevemente tu negocio...',
    submit: 'Crear negocio',
    submitting: 'Creando...',
    previewTitle: 'Tu negocio',
    previewUrl: 'tunegocio.bunnatic.com',
  }

  if (step === 'checkout') {
    return (
      <div className="mx-auto max-w-2xl px-4 py-6 sm:py-12 lg:py-16">
        <div className="mb-6 text-center sm:mb-10">
          <p className="mb-2 text-xs font-semibold tracking-wide text-emerald-700 uppercase">
            Paso 1 de 2
          </p>
          <h1 className="mb-3 text-2xl font-extrabold text-gray-900 sm:text-4xl">
            Comienza tu prueba
            <br />
            <span className="text-emerald-700">
              gratuita de 14 días
            </span>
          </h1>

          <p className="mx-auto max-w-lg text-sm text-gray-600 sm:text-base">
            {`Incluye prueba del plan ${selectedTier.name}. Sin tarjeta de crédito.`}
          </p>
        </div>

        <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-emerald-100 bg-emerald-50 p-4 sm:p-6">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-700 text-lg font-bold text-white">
                {plan.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-emerald-600 uppercase">
                  Plan
                </p>
                <h2 className="truncate text-xl font-bold text-gray-900">
                  {selectedTier.name}
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  {selectedTier.description}
                </p>
              </div>
            </div>

            {draftData.name && (
              <div className="rounded-lg border border-emerald-100 bg-white p-3">
                <p className="mb-1 text-xs text-gray-600">
                  Web para:
                </p>
                <p className="text-sm font-semibold break-words text-gray-900">
                  {draftData.name}
                </p>
                {draftData.sector && (
                  <p className="mt-1 text-xs text-gray-600">
                    {draftData.sector}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-3 p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              </div>
              <span className="text-sm text-gray-700">
                {`14 días de prueba del plan ${selectedTier.name}`}
              </span>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              </div>
              <span className="text-sm text-gray-700">
                {selectedTier.features[0]?.title}
                {selectedTier.features[0]?.detail
                  ? ` · ${selectedTier.features[0].detail}`
                  : ''}
              </span>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              </div>
              <span className="text-sm text-gray-700">
                Sin tarjeta de crédito
              </span>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              </div>
              <span className="text-sm text-gray-700">
                Cancela cuando quieras
              </span>
            </div>
          </div>

          <div className="p-4 pt-0 sm:p-6">
            <Button
              asChild
              className="h-12 w-full rounded-full bg-slate-900 text-sm font-bold text-white transition-colors hover:bg-slate-800 sm:h-14 sm:text-base"
            >
              <Link
                href={businessStepHref}
                onClick={() =>
                  trackFunnelEvent('checkout_completed', {
                    locale: language,
                    plan,
                    has_draft: Boolean(draftId),
                  })
                }
              >
                Empezar
              </Link>
            </Button>

            <p className="mt-4 text-center text-xs leading-relaxed text-gray-500">
              <>
                Al continuar, aceptas nuestros{' '}
                <Link
                  href={legalLinks.terms}
                  className="text-emerald-600 underline hover:text-emerald-700"
                >
                  términos
                </Link>{' '}
                y{' '}
                <Link
                  href={legalLinks.privacy}
                  className="text-emerald-600 underline hover:text-emerald-700"
                >
                  privacidad
                </Link>
                .
              </>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-16">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="grid gap-0 lg:grid-cols-2">
          {/* Left side - Form */}
          <div className="p-6 sm:p-10 lg:p-12">
            <div className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  {t.title}
                </h1>
                <span className="text-sm font-medium text-gray-500">
                  {t.step}
                </span>
              </div>
              <p className="text-sm text-gray-600">{t.subtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-900"
                >
                  {t.nameLabel}
                </label>
                <Input
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder={t.namePlaceholder}
                  className="h-11 rounded-lg border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-900"
                >
                  {t.categoryLabel}
                </label>
                <Input
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder={t.categoryPlaceholder}
                  className="h-11 rounded-lg border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-900"
                >
                  {t.descLabel}
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder={t.descPlaceholder}
                  className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <input
                type="hidden"
                name="address"
                value={formData.address}
                readOnly
              />
              <input
                type="hidden"
                name="phone"
                value={formData.phone}
                readOnly
              />
              <input
                type="hidden"
                name="website"
                value={formData.website}
                readOnly
              />
              <input
                type="hidden"
                name="google_place_id"
                value={formData.googlePlaceId}
                readOnly
              />
              <input
                type="hidden"
                name="place_data"
                value={formData.placeData}
                readOnly
              />

              <Button
                type="submit"
                disabled={loading}
                className="h-11 w-full rounded-lg bg-gray-900 text-sm font-medium text-white transition-colors hover:bg-gray-800"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? t.submitting : t.submit}
              </Button>
            </form>
          </div>

          {/* Right side - Preview */}
          <div className="hidden items-center justify-center border-l border-gray-200 bg-gray-100 p-12 lg:flex">
            <div className="w-full max-w-sm">
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-700 text-lg font-bold text-white">
                    {formData.name
                      ? formData.name.charAt(0).toUpperCase()
                      : '?'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-gray-900">
                      {formData.name || t.previewTitle}
                    </h3>
                    <p className="truncate text-xs text-gray-500">
                      {formData.name
                        ? formData.name
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/(^-|-$)/g, '') + '.bunnatic.com'
                        : t.previewUrl}
                    </p>
                  </div>
                </div>

                {formData.category && (
                  <div className="mb-3">
                    <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                      {formData.category}
                    </span>
                  </div>
                )}

                {formData.description && (
                  <p className="text-sm leading-relaxed text-gray-600">
                    {formData.description}
                  </p>
                )}

                {!formData.name &&
                  !formData.category &&
                  !formData.description && (
                    <div className="space-y-3">
                      <div className="h-3 w-3/4 rounded bg-gray-100"></div>
                      <div className="h-3 w-full rounded bg-gray-100"></div>
                      <div className="h-3 w-5/6 rounded bg-gray-100"></div>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
