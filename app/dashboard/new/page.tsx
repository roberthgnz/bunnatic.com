'use client'

import { useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createBusiness } from '@/lib/supabase/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  BusinessMonogram,
  PageHeader,
} from '@/components/dashboard/page-header'
import { ArrowLeft, ArrowRight, Loader2, Lock, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function NewSitePage() {
  const params = useParams<{ locale: string }>()
  const locale = params?.locale === 'ca' ? 'ca' : 'es'
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
  })

  const t = useMemo(
    () =>
      ({
        es: {
          eyebrow: 'Nuevo negocio',
          title: 'Crea tu',
          titleAccent: 'negocio',
          subtitle:
            'Empieza con lo básico. Podrás añadir servicios, horario y contenido cuando quieras.',
          back: 'Volver al panel',
          formTitle: 'Datos básicos',
          formHint: 'Solo necesitamos tres cosas para empezar.',
          nameLabel: 'Nombre del negocio',
          nameHint: 'Así lo verán tus clientes en tu web.',
          namePlaceholder: 'Ej.: Restaurante La Plaza',
          categoryLabel: 'Categoría',
          categoryPlaceholder: 'Ej.: Restaurante, clínica, taller…',
          descLabel: 'Descripción corta',
          optional: 'Opcional',
          descPlaceholder: 'Cuenta en una o dos frases qué ofreces y a quién.',
          cancel: 'Cancelar',
          create: 'Crear negocio',
          creating: 'Creando…',
          createSuccess: 'Negocio creado correctamente',
          previewLabel: 'Vista previa en directo',
          previewTitle: 'Tu negocio',
          previewUrl: 'tunegocio.bunnatic.com',
          previewCta: 'Reservar',
          importTitle: '¿Ya tienes ficha en Google?',
          importDesc:
            'Impórtala con IA y rellenamos perfil, servicios y horario por ti.',
          importCta: 'Importar con IA',
        },
        ca: {
          eyebrow: 'Nou negoci',
          title: 'Crea el teu',
          titleAccent: 'negoci',
          subtitle:
            'Comença pel bàsic. Podràs afegir serveis, horari i contingut quan vulguis.',
          back: 'Tornar al tauler',
          formTitle: 'Dades bàsiques',
          formHint: 'Només necessitem tres coses per començar.',
          nameLabel: 'Nom del negoci',
          nameHint: 'Així el veuran els teus clients al teu web.',
          namePlaceholder: 'Ex.: Restaurant La Plaça',
          categoryLabel: 'Categoria',
          categoryPlaceholder: 'Ex.: Restaurant, clínica, taller…',
          descLabel: 'Descripció curta',
          optional: 'Opcional',
          descPlaceholder:
            'Explica en una o dues frases què ofereixes i a qui.',
          cancel: 'Cancel·lar',
          create: 'Crear negoci',
          creating: 'Creant…',
          createSuccess: 'Negoci creat correctament',
          previewLabel: 'Vista prèvia en directe',
          previewTitle: 'El teu negoci',
          previewUrl: 'elnegoci.bunnatic.com',
          previewCta: 'Reservar',
          importTitle: 'Ja tens fitxa a Google?',
          importDesc:
            'Importa-la amb IA i omplim el perfil, els serveis i l’horari per tu.',
          importCta: 'Importar amb IA',
        },
      })[locale],
    [locale]
  )

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
      toast.success(t.createSuccess)
      router.push(`/dashboard/businesses/${slug}`)
    }
  }

  const previewHost = formData.name
    ? formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + '.bunnatic.com'
    : t.previewUrl
  const isPreviewEmpty =
    !formData.name && !formData.category && !formData.description

  return (
    <div className="space-y-8 pb-10">
      <PageHeader
        eyebrow={t.eyebrow}
        title={t.title}
        accent={t.titleAccent}
        description={t.subtitle}
        actions={
          <Button asChild variant="ghost">
            <Link href="/dashboard">
              <ArrowLeft aria-hidden="true" />
              {t.back}
            </Link>
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-4">
          <form
            onSubmit={handleSubmit}
            aria-labelledby="new-business-form-title"
            className="bg-card ring-border overflow-hidden rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1"
          >
            <div className="space-y-6 p-5 sm:p-8">
              <div className="space-y-1">
                <h2
                  id="new-business-form-title"
                  className="text-foreground text-base font-semibold tracking-[-0.01em]"
                >
                  {t.formTitle}
                </h2>
                <p className="text-muted-foreground text-sm">{t.formHint}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">{t.nameLabel}</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  autoComplete="organization"
                  aria-describedby="name-hint"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder={t.namePlaceholder}
                  className="h-10"
                />
                <p id="name-hint" className="text-muted-foreground text-xs">
                  {t.nameHint}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">{t.categoryLabel}</Label>
                <Input
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder={t.categoryPlaceholder}
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="justify-between">
                  {t.descLabel}
                  <span className="text-muted-foreground text-xs font-normal">
                    {t.optional}
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
                  className="min-h-24"
                />
              </div>
            </div>

            <div className="border-border bg-muted/40 flex flex-col-reverse gap-2 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-8">
              <Button asChild variant="ghost">
                <Link href="/dashboard">{t.cancel}</Link>
              </Button>
              <Button type="submit" size="lg" disabled={loading}>
                {loading ? (
                  <Loader2 className="animate-spin" aria-hidden="true" />
                ) : null}
                {loading ? t.creating : t.create}
              </Button>
            </div>
          </form>

          <Link
            href="/dashboard/generation"
            className="group bg-accent/40 ring-border hover:bg-accent/70 focus-visible:ring-ring flex items-center gap-4 rounded-xl p-4 ring-1 transition-colors focus-visible:ring-2 focus-visible:outline-none sm:p-5"
          >
            <span className="bg-secondary text-secondary-foreground flex size-8 shrink-0 items-center justify-center rounded-lg">
              <Sparkles className="size-4" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="text-foreground block text-sm font-semibold">
                {t.importTitle}
              </span>
              <span className="text-muted-foreground block text-xs leading-5">
                {t.importDesc}
              </span>
            </span>
            <span className="text-primary hidden shrink-0 items-center gap-1 text-sm font-medium sm:flex">
              {t.importCta}
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          </Link>
        </div>

        {/* Live preview */}
        <aside aria-label={t.previewLabel} className="hidden lg:block">
          <div className="sticky top-6 space-y-3">
            <p className="text-muted-foreground text-xs font-medium">
              {t.previewLabel}
            </p>
            <div className="bg-card ring-border overflow-hidden rounded-xl shadow-[0_12px_32px_-18px_rgba(0,0,0,0.35)] ring-1">
              <div className="border-border bg-muted/60 flex items-center gap-3 border-b px-3 py-2.5">
                <span className="flex gap-1.5" aria-hidden="true">
                  <span className="bg-border size-2.5 rounded-full" />
                  <span className="bg-border size-2.5 rounded-full" />
                  <span className="bg-border size-2.5 rounded-full" />
                </span>
                <span className="bg-card text-muted-foreground ring-border flex min-w-0 flex-1 items-center gap-1.5 rounded-md px-2.5 py-1 text-xs ring-1">
                  <Lock className="size-3 shrink-0" aria-hidden="true" />
                  <span className="truncate">{previewHost}</span>
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-3">
                  <BusinessMonogram
                    name={formData.name || '?'}
                    className="size-12 text-lg"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-foreground truncate text-base font-semibold tracking-[-0.01em]">
                      {formData.name || t.previewTitle}
                    </h3>
                    {formData.category ? (
                      <Badge variant="secondary" className="mt-1">
                        {formData.category}
                      </Badge>
                    ) : null}
                  </div>
                </div>

                {formData.description ? (
                  <p className="text-muted-foreground mt-5 text-sm leading-6 break-words">
                    {formData.description}
                  </p>
                ) : (
                  <div className="mt-5 space-y-2.5" aria-hidden="true">
                    <div className="bg-muted h-2.5 w-11/12 rounded-full" />
                    <div className="bg-muted h-2.5 w-full rounded-full" />
                    <div className="bg-muted h-2.5 w-2/3 rounded-full" />
                  </div>
                )}

                <div
                  className="mt-6 flex items-center gap-2"
                  aria-hidden="true"
                >
                  <span
                    className={
                      isPreviewEmpty
                        ? 'bg-muted h-8 w-24 rounded-lg'
                        : 'bg-primary text-primary-foreground flex h-8 items-center rounded-lg px-3.5 text-xs font-medium'
                    }
                  >
                    {isPreviewEmpty ? null : t.previewCta}
                  </span>
                  <span className="bg-muted h-8 w-20 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
