'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { updateBusiness } from '@/lib/backoffice/actions/settings'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

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

const DESCRIPTION_MAX = 500

function Field({
  id,
  label,
  hint,
  error,
  required,
  aside,
  className,
  children,
}: {
  id: string
  label: string
  hint?: string
  error?: string
  required?: boolean
  aside?: React.ReactNode
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-baseline justify-between gap-2">
        <Label htmlFor={id} className="text-foreground">
          {label}
          {required ? (
            <span className="text-muted-foreground font-normal">
              <span aria-hidden="true">*</span>
              <span className="sr-only">(obligatorio)</span>
            </span>
          ) : null}
        </Label>
        {aside}
      </div>
      {children}
      {error ? (
        <p
          id={`${id}-error`}
          className="text-destructive flex items-center gap-1 text-xs font-medium"
        >
          <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-muted-foreground text-xs">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

export default function BusinessSettingsForm({
  business,
}: {
  business: Business
}) {
  const router = useRouter()

  const t = {
    heading: 'Información general',
    subheading:
      'Los datos básicos que identifican tu negocio en la web y en Bunnatic.',
    nameLabel: 'Nombre del negocio',
    nameHint: 'Tal y como quieres que aparezca en tu web.',
    categoryLabel: 'Categoría',
    categoryHint: 'Por ejemplo: restaurante, peluquería, fisioterapia…',
    descLabel: 'Descripción',
    descHint:
      'Cuenta en pocas frases qué haces y qué te diferencia. Se usa como texto de presentación.',
    submit: 'Guardar cambios',
    submitting: 'Guardando…',
    unsaved: 'Tienes cambios sin guardar',
    saved: 'Todo guardado',
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
    watch,
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
  const descriptionLength = (watch('description') ?? '').length

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

  const describedBy = (id: string, hasError: boolean) =>
    hasError ? `${id}-error` : `${id}-hint`

  return (
    <section
      aria-labelledby="settings-general-title"
      className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-10"
    >
      <div className="space-y-1">
        <h2
          id="settings-general-title"
          className="text-foreground text-base font-semibold tracking-[-0.01em]"
        >
          {t.heading}
        </h2>
        <p className="text-muted-foreground max-w-xs text-sm leading-6">
          {t.subheading}
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="bg-card ring-border overflow-hidden rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1"
      >
        <div className="space-y-5 p-5 sm:p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              id="business-name"
              label={t.nameLabel}
              hint={t.nameHint}
              error={errors.name ? err(errors.name.message!) : undefined}
              required
            >
              <Input
                id="business-name"
                {...register('name')}
                autoComplete="organization"
                aria-invalid={!!errors.name}
                aria-describedby={describedBy('business-name', !!errors.name)}
              />
            </Field>

            <Field
              id="business-category"
              label={t.categoryLabel}
              hint={t.categoryHint}
              error={
                errors.category ? err(errors.category.message!) : undefined
              }
              required
            >
              <Input
                id="business-category"
                {...register('category')}
                aria-invalid={!!errors.category}
                aria-describedby={describedBy(
                  'business-category',
                  !!errors.category
                )}
              />
            </Field>
          </div>

          <Field
            id="business-description"
            label={t.descLabel}
            hint={t.descHint}
            error={
              errors.description ? err(errors.description.message!) : undefined
            }
            aside={
              <span
                className={cn(
                  'text-xs tabular-nums',
                  descriptionLength > DESCRIPTION_MAX
                    ? 'text-destructive font-medium'
                    : 'text-muted-foreground'
                )}
                aria-live="polite"
              >
                {descriptionLength}/{DESCRIPTION_MAX}
              </span>
            }
          >
            <Textarea
              id="business-description"
              {...register('description')}
              rows={5}
              aria-invalid={!!errors.description}
              aria-describedby={describedBy(
                'business-description',
                !!errors.description
              )}
              className="resize-none"
            />
          </Field>
        </div>

        <div className="bg-muted/40 border-border flex flex-col-reverse gap-3 border-t px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p
            className="text-muted-foreground flex items-center gap-2 text-xs"
            aria-live="polite"
          >
            <span
              aria-hidden="true"
              className={cn(
                'size-1.5 rounded-full',
                isDirty ? 'bg-warning' : 'bg-success'
              )}
            />
            {isDirty ? t.unsaved : t.saved}
          </p>
          <Button
            type="submit"
            disabled={isSubmitting || !isDirty}
            className="sm:w-auto"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" aria-hidden="true" />
            ) : null}
            {isSubmitting ? t.submitting : t.submit}
          </Button>
        </div>
      </form>
    </section>
  )
}
