'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createService, deleteService } from '@/lib/supabase/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, Trash2, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Textarea } from '@/components/ui/textarea'

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
  locale,
}: {
  businessId: string
  initialServices: any[]
  locale: string
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter()

  const t = {
    es: {
      title: 'Servicios',
      description: 'Gestiona los servicios que ofrece tu negocio.',
      add: 'Añadir servicio',
      name: 'Nombre del servicio',
      price: 'Precio (€)',
      duration: 'Duración (min)',
      descriptionField: 'Descripción breve (opcional)',
      delete: 'Eliminar',
      confirmDelete: '¿Estás seguro?',
      noServices: 'No hay servicios registrados.',
      added: 'Servicio añadido',
      removed: 'Servicio eliminado',
      errors: {
        name_min: 'El nombre debe tener al menos 2 caracteres',
        price_min: 'El precio no puede ser negativo',
        duration_min: 'La duración debe ser un número entero ≥ 1',
        description_max: 'Máximo 300 caracteres',
      },
    },
    ca: {
      title: 'Serveis',
      description: 'Gestiona els serveis que ofereix el teu negoci.',
      add: 'Afegir servei',
      name: 'Nom del servei',
      price: 'Preu (€)',
      duration: 'Durada (min)',
      descriptionField: 'Descripció breu (opcional)',
      delete: 'Eliminar',
      confirmDelete: 'Estàs segur?',
      noServices: 'No hi ha serveis registrats.',
      added: 'Servei afegit',
      removed: 'Servei eliminat',
      errors: {
        name_min: 'El nom ha de tenir almenys 2 caràcters',
        price_min: 'El preu no pot ser negatiu',
        duration_min: 'La durada ha de ser un nombre enter ≥ 1',
        description_max: 'Màxim 300 caràcters',
      },
    },
  }[locale === 'ca' ? 'ca' : 'es']

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

  const fieldError = (key: keyof typeof t.errors, msg?: string) =>
    msg ? t.errors[key] ?? msg : undefined

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 rounded-lg border bg-slate-50/60 p-4">
            <div className="grid gap-3 md:grid-cols-12">
              <div className="md:col-span-4 space-y-1">
                <Input
                  {...register('name')}
                  placeholder={t.name}
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">
                    {t.errors[errors.name.message as keyof typeof t.errors] ?? errors.name.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2 space-y-1">
                <Input
                  {...register('price')}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder={t.price}
                  aria-invalid={!!errors.price}
                />
                {errors.price && (
                  <p className="text-xs text-red-500">
                    {t.errors[errors.price.message as keyof typeof t.errors] ?? errors.price.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2 space-y-1">
                <Input
                  {...register('duration')}
                  type="number"
                  min="1"
                  placeholder={t.duration}
                  aria-invalid={!!errors.duration}
                />
                {errors.duration && (
                  <p className="text-xs text-red-500">
                    {t.errors[errors.duration.message as keyof typeof t.errors] ?? errors.duration.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-3 space-y-1">
                <Textarea
                  {...register('description')}
                  placeholder={t.descriptionField}
                  rows={1}
                  className="min-h-10 resize-none"
                  aria-invalid={!!errors.description}
                />
                {errors.description && (
                  <p className="text-xs text-red-500">
                    {t.errors[errors.description.message as keyof typeof t.errors] ?? errors.description.message}
                  </p>
                )}
              </div>

              <Button type="submit" disabled={isSubmitting} className="md:col-span-1">
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    {t.add}
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="rounded-md border">
            {initialServices.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                {t.noServices}
              </div>
            ) : (
              <div className="divide-y">
                {initialServices.map((service) => (
                  <div key={service.id} className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {service.duration ? `${service.duration} min` : ''}
                        {service.duration && service.price ? ' • ' : ''}
                        {service.price ? `${service.price}€` : ''}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(service.id)}
                      disabled={deletingId === service.id}
                      aria-label={`${t.delete} ${service.name}`}
                    >
                      {deletingId === service.id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-red-500" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
