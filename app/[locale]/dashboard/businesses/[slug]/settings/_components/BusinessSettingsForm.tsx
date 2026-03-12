'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { updateBusiness } from '@/lib/supabase/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

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
  locale,
}: {
  business: Business
  locale: string
}) {
  const router = useRouter()

  const t = {
    es: {
      nameLabel: 'Nombre del negocio',
      categoryLabel: 'Categoría',
      descLabel: 'Descripción',
      submit: 'Guardar cambios',
      submitting: 'Guardando...',
      success: 'Negocio actualizado correctamente',
      errors: {
        name_min: 'El nombre debe tener al menos 2 caracteres',
        category_min: 'La categoría debe tener al menos 2 caracteres',
        description_max: 'La descripción no puede superar los 500 caracteres',
      },
    },
    ca: {
      nameLabel: 'Nom del negoci',
      categoryLabel: 'Categoria',
      descLabel: 'Descripció',
      submit: 'Desar canvis',
      submitting: 'Desant...',
      success: 'Negoci actualitzat correctament',
      errors: {
        name_min: 'El nom ha de tenir almenys 2 caràcters',
        category_min: 'La categoria ha de tenir almenys 2 caràcters',
        description_max: 'La descripció no pot superar els 500 caràcters',
      },
    },
  }[locale === 'ca' ? 'ca' : 'es']

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: business.name,
      category: business.category,
      description: business.description ?? '',
    },
  })

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
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            {t.nameLabel}
          </label>
          <Input
            id="name"
            {...register('name')}
            className="max-w-md"
            aria-invalid={!!errors.name}
          />
          {errors.name && (
            <p className="text-sm text-red-500">
              {t.errors[errors.name.message as keyof typeof t.errors] ?? errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium">
            {t.categoryLabel}
          </label>
          <Input
            id="category"
            {...register('category')}
            className="max-w-md"
            aria-invalid={!!errors.category}
          />
          {errors.category && (
            <p className="text-sm text-red-500">
              {t.errors[errors.category.message as keyof typeof t.errors] ?? errors.category.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            {t.descLabel}
          </label>
          <Textarea
            id="description"
            {...register('description')}
            rows={6}
            className="max-w-2xl"
            aria-invalid={!!errors.description}
          />
          {errors.description && (
            <p className="text-sm text-red-500">
              {t.errors[errors.description.message as keyof typeof t.errors] ?? errors.description.message}
            </p>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? t.submitting : t.submit}
        </Button>
      </form>
    </div>
  )
}
