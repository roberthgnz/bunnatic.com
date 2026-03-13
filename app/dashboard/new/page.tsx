'use client'

import { useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createBusiness } from '@/lib/supabase/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, ArrowLeft } from 'lucide-react'
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
          title: 'Crear negocio',
          subtitle: 'Configura tu negocio para comenzar.',
          back: 'Volver al dashboard',
          nameLabel: 'Nombre del negocio',
          namePlaceholder: 'Ej. Restaurante La Plaza',
          categoryLabel: 'Categoría',
          categoryPlaceholder: 'Ej. Restaurante, Clínica, Taller...',
          descLabel: 'Descripción corta (opcional)',
          descPlaceholder: 'Describe brevemente tu negocio...',
          create: 'Crear negocio',
          creating: 'Creando...',
          createSuccess: 'Negocio creado correctamente',
          previewTitle: 'Vista previa',
          previewUrl: 'tunegocio.bunnatic.com',
        },
        ca: {
          title: 'Crear negoci',
          subtitle: 'Configura el teu negoci per començar.',
          back: 'Tornar al dashboard',
          nameLabel: 'Nom del negoci',
          namePlaceholder: 'Ex. Restaurant La Plaça',
          categoryLabel: 'Categoria',
          categoryPlaceholder: 'Ex. Restaurant, Clínica, Taller...',
          descLabel: 'Descripció curta (opcional)',
          descPlaceholder: 'Descriu breument el teu negoci...',
          create: 'Crear negoci',
          creating: 'Creant...',
          createSuccess: 'Negoci creat correctament',
          previewTitle: 'Vista prèvia',
          previewUrl: 'elnegoci.bunnatic.com',
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

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {t.title}
          </h1>
          <p className="text-sm text-slate-600">{t.subtitle}</p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/dashboard`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.back}
          </Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="grid gap-0 lg:grid-cols-2">
          {/* Left side - Form */}
          <div className="p-6 sm:p-10 lg:p-12">
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

              <Button
                type="submit"
                disabled={loading}
                className="h-11 w-full rounded-lg bg-gray-900 text-sm font-medium text-white transition-colors hover:bg-gray-800"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? t.creating : t.create}
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
