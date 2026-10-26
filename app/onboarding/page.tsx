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
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBusiness } from '@/lib/db/actions'
import { toast } from 'sonner'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleCheck,
  Globe2,
  Loader2,
  Sparkles,
} from 'lucide-react'
import { getLegalSlug } from '@/lib/pageSlugs'
import { trackFunnelEvent } from '@/lib/funnelEvents'

const EMPTY_DRAFT_SNAPSHOT = ''

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-[60svh]" />}>
      <OnboardingContent />
    </Suspense>
  )
}

function OnboardingContent() {
  const language = 'es'
  const searchParams = useSearchParams()
  const router = useRouter()
  const plan = searchParams.get('plan') ?? 'starter'
  const billing =
    searchParams.get('billing') === 'yearly' ? 'yearly' : 'monthly'
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
    params.set('billing', billing)
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
  }, [billing, draftId, plan, publishIntent, source, tempGenerationKey])

  const checkoutStepHref = useMemo(() => {
    const params = new URLSearchParams(businessStepHref.split('?')[1] ?? '')
    params.set('step', 'checkout')
    return `/onboarding?${params.toString()}`
  }, [businessStepHref])

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
      toast.success('Negocio creado correctamente')
      router.push(`/dashboard`)
    }
  }

  const t = {
    title: 'Cuéntanos sobre tu',
    titleAccent: 'negocio',
    subtitle:
      'Con estos datos preparamos tu espacio de trabajo y el punto de partida de tu web.',
    step: 'Paso 2 de 2',
    nameLabel: 'Nombre del negocio',
    namePlaceholder: 'Ej. Restaurante La Plaza',
    categoryLabel: 'Categoría',
    categoryPlaceholder: 'Ej. Restaurante, clínica, taller…',
    categoryHint: 'A qué se dedica tu negocio, en pocas palabras.',
    descLabel: 'Descripción corta',
    descOptional: 'Opcional',
    descPlaceholder: 'Qué ofreces, a quién y qué te hace diferente…',
    back: 'Atrás',
    submit: 'Crear negocio',
    submitting: 'Creando negocio…',
    previewLabel: 'Vista previa',
    previewTitle: 'Tu negocio',
    previewUrl: 'tunegocio.locavo.com',
    previewCta: 'Contactar',
  }

  if (step === 'checkout') {
    const isRecommended = selectedTier.id === 'tier-pro'
    const price =
      billing === 'yearly'
        ? selectedTier.priceYearly
        : selectedTier.priceMonthly
    const includedItems = [
      `14 días de prueba del plan ${selectedTier.name}`,
      `${selectedTier.features[0]?.title ?? ''}${
        selectedTier.features[0]?.detail
          ? ` · ${selectedTier.features[0].detail}`
          : ''
      }`,
      'Sin tarjeta de crédito',
      'Cancela cuando quieras',
    ]

    return (
      <div className="mx-auto max-w-xl px-4 py-10 sm:py-16">
        <div className="text-center">
          <p className="text-primary text-xs font-semibold tracking-[0.12em] uppercase">
            Paso 1 de 2
          </p>
          <h1 className="mt-3 text-[2rem] leading-[1.02] font-medium tracking-[-0.05em] sm:text-[2.75rem]">
            Empieza tu prueba{' '}
            <span className="text-muted-foreground">gratis de 14 días</span>
          </h1>
          <p className="text-muted-foreground mx-auto mt-4 max-w-md text-[0.95rem] leading-6">
            {`Incluye prueba del plan ${selectedTier.name}. Sin tarjeta de crédito.`}
          </p>
        </div>

        <section
          aria-labelledby="selected-plan-name"
          className="bg-accent/40 ring-primary relative mt-8 rounded-2xl p-5 ring-2 sm:p-6"
        >
          <div className="flex items-start gap-3">
            <span
              className="bg-primary text-primary-foreground flex size-10 shrink-0 items-center justify-center rounded-xl text-base font-semibold"
              aria-hidden="true"
            >
              {selectedTier.name.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-muted-foreground text-xs font-medium">
                Plan seleccionado
              </p>
              <div className="mt-0.5 flex flex-wrap items-center gap-2">
                <h2
                  id="selected-plan-name"
                  className="truncate text-lg font-semibold tracking-[-0.02em]"
                >
                  {selectedTier.name}
                </h2>
                {isRecommended ? (
                  <Badge variant="default" className="gap-1">
                    <Sparkles aria-hidden="true" />
                    Recomendado
                  </Badge>
                ) : null}
              </div>
            </div>
            <CircleCheck
              className="fill-primary text-primary-foreground size-6 shrink-0"
              aria-hidden="true"
            />
          </div>

          <p className="text-muted-foreground mt-3 text-sm leading-6">
            {selectedTier.description}
          </p>

          <div className="border-primary/15 mt-5 flex flex-wrap items-end justify-between gap-x-4 gap-y-1 border-t pt-4">
            <p className="flex items-baseline gap-1">
              <span className="text-3xl font-semibold tracking-[-0.04em] tabular-nums">
                {price}
              </span>
              <span className="text-muted-foreground text-sm">/mes</span>
            </p>
            <p className="text-muted-foreground text-xs">
              {billing === 'yearly'
                ? `${selectedTier.annualTotal} con facturación anual tras la prueba`
                : 'Facturación mensual tras la prueba'}
            </p>
          </div>

          {draftData.name && (
            <div className="bg-card ring-border mt-4 flex items-start gap-3 rounded-xl p-3 ring-1">
              <span
                className="bg-secondary text-secondary-foreground flex size-8 shrink-0 items-center justify-center rounded-lg"
                aria-hidden="true"
              >
                <Globe2 className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="text-muted-foreground text-xs">Web para</p>
                <p className="text-sm font-semibold break-words">
                  {draftData.name}
                </p>
                {draftData.sector && (
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    {draftData.sector}
                  </p>
                )}
              </div>
            </div>
          )}
        </section>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {includedItems.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm">
              <span
                className="bg-secondary text-primary mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full"
                aria-hidden="true"
              >
                <Check className="size-3" />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <Button asChild size="lg" className="mt-8 h-11 w-full text-[0.9rem]">
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
            Empezar prueba gratuita
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>

        <p className="text-muted-foreground mt-4 text-center text-xs leading-relaxed">
          Al continuar, aceptas nuestros{' '}
          <Link
            href={legalLinks.terms}
            className="text-foreground underline underline-offset-2 hover:no-underline"
          >
            términos
          </Link>{' '}
          y la{' '}
          <Link
            href={legalLinks.privacy}
            className="text-foreground underline underline-offset-2 hover:no-underline"
          >
            política de privacidad
          </Link>
          .
        </p>
      </div>
    )
  }

  const previewSlug = formData.name
    ? formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + '.locavo.com'
    : t.previewUrl

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:py-16">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-start lg:gap-14">
        <div>
          <p className="text-primary text-xs font-semibold tracking-[0.12em] uppercase">
            {t.step}
          </p>
          <h1 className="mt-3 text-[2rem] leading-[1.02] font-medium tracking-[-0.05em] sm:text-[2.5rem]">
            {t.title}{' '}
            <span className="text-muted-foreground">{t.titleAccent}</span>
          </h1>
          <p className="text-muted-foreground mt-3 max-w-md text-[0.95rem] leading-6">
            {t.subtitle}
          </p>

          <form
            onSubmit={handleSubmit}
            className="bg-card ring-border mt-8 space-y-5 rounded-2xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-16px_rgba(0,0,0,0.12)] ring-1 sm:p-7"
          >
            <div className="space-y-2">
              <Label htmlFor="name">{t.nameLabel}</Label>
              <Input
                id="name"
                name="name"
                required
                autoComplete="organization"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder={t.namePlaceholder}
                className="h-11 px-3.5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">{t.categoryLabel}</Label>
              <Input
                id="category"
                name="category"
                required
                autoComplete="off"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                placeholder={t.categoryPlaceholder}
                aria-describedby="category-hint"
                className="h-11 px-3.5"
              />
              <p id="category-hint" className="text-muted-foreground text-xs">
                {t.categoryHint}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                {t.descLabel}
                <span className="text-muted-foreground font-normal">
                  · {t.descOptional}
                </span>
              </Label>
              <Textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder={t.descPlaceholder}
                className="min-h-24 px-3.5 py-2.5"
              />
            </div>

            <input
              type="hidden"
              name="address"
              value={formData.address}
              readOnly
            />
            <input type="hidden" name="phone" value={formData.phone} readOnly />
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

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <Button asChild variant="ghost" size="lg">
                <Link href={checkoutStepHref}>
                  <ArrowLeft aria-hidden="true" />
                  {t.back}
                </Link>
              </Button>
              <Button
                type="submit"
                size="lg"
                disabled={loading}
                aria-busy={loading}
                className="h-11 sm:min-w-44"
              >
                {loading && (
                  <Loader2
                    className="animate-spin motion-reduce:animate-none"
                    aria-hidden="true"
                  />
                )}
                {loading ? t.submitting : t.submit}
              </Button>
            </div>
          </form>
        </div>

        {/* Live preview (decorative mirror of the form) */}
        <div aria-hidden="true" className="hidden lg:sticky lg:top-24 lg:block">
          <p className="text-muted-foreground mb-3 flex items-center gap-2 text-xs font-medium">
            <span className="bg-success size-1.5 rounded-full" />
            {t.previewLabel}
          </p>
          <div className="bg-card ring-border overflow-hidden rounded-2xl shadow-[0_24px_48px_-24px_rgba(0,0,0,0.25)] ring-1">
            <div className="border-border flex h-9 items-center gap-3 border-b px-3">
              <div className="flex gap-1">
                <span className="bg-border size-2 rounded-full" />
                <span className="bg-border size-2 rounded-full" />
                <span className="bg-border size-2 rounded-full" />
              </div>
              <span className="bg-muted text-muted-foreground flex min-w-0 flex-1 items-center justify-center gap-1.5 truncate rounded-md px-2 py-1 text-[10px]">
                <Globe2 className="size-3 shrink-0" />
                <span className="truncate">{previewSlug}</span>
              </span>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-3">
                <span className="bg-primary text-primary-foreground flex size-10 shrink-0 items-center justify-center rounded-xl text-base font-semibold">
                  {formData.name ? formData.name.charAt(0).toUpperCase() : '?'}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold tracking-[-0.02em]">
                    {formData.name || t.previewTitle}
                  </p>
                  {formData.category ? (
                    <Badge variant="secondary" className="mt-1">
                      {formData.category}
                    </Badge>
                  ) : (
                    <div className="bg-muted mt-1.5 h-2.5 w-20 rounded-full" />
                  )}
                </div>
              </div>

              <div className="bg-primary text-primary-foreground relative mt-5 overflow-hidden rounded-xl p-5">
                <p className="relative font-serif text-xl leading-tight italic">
                  {formData.name || t.previewTitle}
                </p>
                {formData.description ? (
                  <p className="text-primary-foreground/80 relative mt-2 line-clamp-3 text-xs leading-5">
                    {formData.description}
                  </p>
                ) : (
                  <div className="relative mt-3 space-y-1.5">
                    <div className="h-2 w-full rounded-full bg-white/15" />
                    <div className="h-2 w-4/5 rounded-full bg-white/15" />
                  </div>
                )}
                <span className="text-primary relative mt-4 inline-flex rounded-full bg-white px-3 py-1 text-[10px] font-semibold">
                  {t.previewCta}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {[0, 1, 2].map((item) => (
                  <div
                    key={item}
                    className="bg-muted space-y-1.5 rounded-lg p-2.5"
                  >
                    <div className="bg-border h-2 w-3/4 rounded-full" />
                    <div className="bg-border/70 h-1.5 w-full rounded-full" />
                    <div className="bg-border/70 h-1.5 w-2/3 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
