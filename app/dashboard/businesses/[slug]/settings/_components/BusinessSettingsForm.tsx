'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { updateBusiness } from '@/lib/supabase/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FormField } from '@/components/ui/form-field'
import { toast } from 'sonner'
import { Loader2, Save } from 'lucide-react'

interface Business {
  id: string
  name: string
  slug: string
  category: string
  description: string | null
}

const schema = z.object({
  name: z.string().min(2, { message: 'name_min' }),
  category: z.string().min(2, { message: 'category_min' }),
  description: z.string().max(500, { message: 'description_max' }).optional(),
})

type FormValues = z.infer<typeof schema>

export default function BusinessSettingsForm({
  business,
}: {
  business: Business
}) {
  const router = useRouter()

  const t = {
    heading: 'Información general',
    subheading: 'Datos básicos que identifican tu negocio en Bunnatic.',
    nameLabel: 'Nombre del negocio',
    nameHint: 'Tal como aparecerá en tu perfil público.',
    categoryLabel: 'Categoría',
    categoryHint: 'Ej: Restaurante, Peluquería, Fisioterapia…',
    descLabel: 'Descripción',
    descHint: 'Máximo 500 caracteres.',
    submit: 'Guardar cambios',
    submitting: 'Guardando…',
    success: 'Negocio actualizado correctamente',
    errors: {
      name_min: 'El nombre debe tener al menos 2 caracteres',
      category_min: 'La categoría debe tener al menos 2 caracteres',
      description_max: 'La descripción no puede superar los 500 caracteres',
    },
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: business.name,
      category: business.category,
      description: business.description ?? '',
    },
  })

  const err = (key: string) => t.errors[key as keyof typeof t.errors] ?? key

  async function onSubmit(values: FormValues) {
    const formData = new FormData()
    formData.set('name', values.name)
    formData.set('category', values.category)
    formData.set('description', values.description ?? '')

    const result = await updateBusiness(business.slug, formData)

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success(t.success)
      router.refresh()
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-100 bg-slate-50/60 px-6 py-4">
        <h3 className="text-sm font-semibold text-slate-900">{t.heading}</h3>
        <p className="mt-0.5 text-xs text-slate-500">{t.subheading}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-5 px-6 py-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              label={t.nameLabel}
              hint={t.nameHint}
              error={errors.name ? err(errors.name.message!) : undefined}
              required
            >
              <Input
                {...register('name')}
                aria-invalid={!!errors.name}
                className="h-9"
              />
            </FormField>

            <FormField
              label={t.categoryLabel}
              hint={t.categoryHint}
              error={
                errors.category ? err(errors.category.message!) : undefined
              }
              required
            >
              <Input
                {...register('category')}
                aria-invalid={!!errors.category}
                className="h-9"
              />
            </FormField>
          </div>

          <FormField
            label={t.descLabel}
            hint={t.descHint}
            error={
              errors.description ? err(errors.description.message!) : undefined
            }
          >
            <Textarea
              {...register('description')}
              rows={5}
              aria-invalid={!!errors.description}
              className="resize-none"
            />
          </FormField>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/40 px-6 py-3">
          <p className="text-xs text-slate-400">
            {isDirty ? '● Cambios sin guardar' : ''}
          </p>
          <Button type="submit" disabled={isSubmitting || !isDirty} size="sm">
            {isSubmitting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            {isSubmitting ? t.submitting : t.submit}
          </Button>
        </div>
      </form>
    </div>
  )
}
