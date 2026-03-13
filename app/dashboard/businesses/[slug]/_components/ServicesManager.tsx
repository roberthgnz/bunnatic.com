'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createService, deleteService } from '@/lib/supabase/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FormField } from '@/components/ui/form-field'
import { toast } from 'sonner'
import { Loader2, Trash2, Plus, Package } from 'lucide-react'
import { useRouter } from 'next/navigation'

const schema = z.object({
  name: z.string().min(2, { message: 'name_min' }),
  price: z
    .string()
    .optional()
    .refine((v) => !v || Number(v) >= 0, { message: 'price_min' }),
  duration: z
    .string()
    .optional()
    .refine((v) => !v || (Number.isInteger(Number(v)) && Number(v) >= 1), {
      message: 'duration_min',
    }),
  description: z.string().max(300, { message: 'description_max' }).optional(),
})

type FormValues = z.infer<typeof schema>

export default function ServicesManager({
  businessId,
  initialServices,
}: {
  businessId: string
  initialServices: any[]
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter()

  const t = {
    title: 'Servicios',
    description: 'Gestiona los servicios que ofrece tu negocio.',
    addTitle: 'Añadir servicio',
    name: 'Nombre',
    price: 'Precio (€)',
    duration: 'Duración (min)',
    descriptionField: 'Descripción breve',
    descHint: 'Opcional · máx. 300 caracteres',
    add: 'Añadir',
    delete: 'Eliminar',
    confirmDelete: '¿Eliminar este servicio?',
    noServices: 'No hay servicios registrados aún.',
    added: 'Servicio añadido',
    removed: 'Servicio eliminado',
    errors: {
      name_min: 'Mínimo 2 caracteres',
      price_min: 'El precio no puede ser negativo',
      duration_min: 'Entero ≥ 1',
      description_max: 'Máximo 300 caracteres',
    },
  }

  const err = (key: string) => t.errors[key as keyof typeof t.errors] ?? key

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', price: '', duration: '', description: '' },
  })

  async function onSubmit(values: FormValues) {
    const formData = new FormData()
    formData.set('name', values.name)
    if (values.price) formData.set('price', values.price)
    if (values.duration) formData.set('duration', values.duration)
    if (values.description) formData.set('description', values.description)

    const res = await createService(businessId, formData)
    if (res?.error) {
      toast.error(res.error)
    } else {
      toast.success(t.added)
      reset()
      router.refresh()
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(t.confirmDelete)) return
    setDeletingId(id)
    const res = await deleteService(id)
    if (res?.error) {
      toast.error(res.error)
    } else {
      toast.success(t.removed)
      router.refresh()
    }
    setDeletingId(null)
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-100 bg-slate-50/60 px-6 py-4">
        <h3 className="text-sm font-semibold text-slate-900">{t.title}</h3>
        <p className="mt-0.5 text-xs text-slate-500">{t.description}</p>
      </div>

      {/* Add form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border-b border-slate-100 px-6 py-5"
      >
        <p className="mb-3 text-xs font-semibold tracking-wider text-slate-400 uppercase">
          {t.addTitle}
        </p>
        <div className="grid gap-3 sm:grid-cols-12">
          <div className="sm:col-span-5">
            <FormField
              label={t.name}
              error={errors.name ? err(errors.name.message!) : undefined}
              required
            >
              <Input
                {...register('name')}
                aria-invalid={!!errors.name}
                className="h-9"
              />
            </FormField>
          </div>
          <div className="sm:col-span-2">
            <FormField
              label={t.price}
              error={errors.price ? err(errors.price.message!) : undefined}
            >
              <Input
                {...register('price')}
                type="number"
                step="0.01"
                min="0"
                aria-invalid={!!errors.price}
                className="h-9"
              />
            </FormField>
          </div>
          <div className="sm:col-span-2">
            <FormField
              label={t.duration}
              error={
                errors.duration ? err(errors.duration.message!) : undefined
              }
            >
              <Input
                {...register('duration')}
                type="number"
                min="1"
                aria-invalid={!!errors.duration}
                className="h-9"
              />
            </FormField>
          </div>
          <div className="sm:col-span-3">
            <FormField
              label={t.descriptionField}
              hint={t.descHint}
              error={
                errors.description
                  ? err(errors.description.message!)
                  : undefined
              }
            >
              <Textarea
                {...register('description')}
                rows={1}
                aria-invalid={!!errors.description}
                className="min-h-9 resize-none"
              />
            </FormField>
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <Button type="submit" disabled={isSubmitting} size="sm">
            {isSubmitting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Plus className="h-3.5 w-3.5" />
            )}
            {t.add}
          </Button>
        </div>
      </form>

      {/* Services list */}
      {initialServices.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
            <Package className="h-5 w-5 text-slate-400" />
          </div>
          <p className="text-sm text-slate-500">{t.noServices}</p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {initialServices.map((service) => (
            <li
              key={service.id}
              className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-slate-50/60"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-900">
                  {service.name}
                </p>
                {(service.duration || service.price) && (
                  <p className="mt-0.5 text-xs text-slate-400">
                    {service.duration ? `${service.duration} min` : ''}
                    {service.duration && service.price ? ' · ' : ''}
                    {service.price ? `${service.price}€` : ''}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => handleDelete(service.id)}
                disabled={deletingId === service.id}
                aria-label={`${t.delete} ${service.name}`}
                className="shrink-0 text-slate-400 hover:bg-red-50 hover:text-red-500"
              >
                {deletingId === service.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
