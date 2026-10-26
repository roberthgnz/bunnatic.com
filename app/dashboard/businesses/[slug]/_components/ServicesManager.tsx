'use client'

import { useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  createService,
  deleteService,
  updateService,
} from '@/lib/backoffice/actions/services'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { EmptyState } from '@/components/dashboard/page-header'
import { toast } from 'sonner'
import {
  AlertCircle,
  Briefcase,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
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

type Service = {
  id: string
  name: string
  description?: string | null
  price?: number | null
  duration?: number | null
}

const surface =
  'bg-card ring-border rounded-xl shadow-[0_1px_2px_rgba(31,42,28,0.04)] ring-1'

const priceFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

function formatPrice(price: Service['price']) {
  if (price === null || price === undefined || Number.isNaN(Number(price))) {
    return null
  }
  return Number(price) === 0 ? 'Gratis' : priceFormatter.format(Number(price))
}

function formatDuration(duration: Service['duration']) {
  if (!duration) return null
  const minutes = Number(duration)
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest ? `${hours} h ${rest} min` : `${hours} h`
}

function Field({
  id,
  label,
  srLabel,
  required,
  hint,
  error,
  children,
}: {
  id: string
  label: string
  srLabel?: string
  required?: boolean
  hint?: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-foreground gap-0.5 text-[13px]">
        {label}
        {srLabel ? <span className="sr-only">{srLabel}</span> : null}
        {required ? (
          <span className="text-destructive" aria-hidden="true">
            *
          </span>
        ) : null}
      </Label>
      {children}
      {error ? (
        <p
          id={`${id}-error`}
          className="text-destructive flex items-center gap-1 text-xs font-medium"
        >
          <AlertCircle className="size-3 shrink-0" aria-hidden="true" />
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

export default function ServicesManager({
  businessId,
  readOnly = false,
  initialServices,
}: {
  businessId: string
  readOnly?: boolean
  initialServices: Service[]
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const router = useRouter()

  const t = {
    title: 'Servicios',
    description:
      'Lo que ofreces, con su precio y duración. Se muestran en tu web pública.',
    listTitle: 'Tu carta de servicios',
    addTitle: 'Añadir servicio',
    addDescription: 'Solo el nombre es obligatorio.',
    name: 'Nombre',
    namePlaceholder: 'Ej. Corte y peinado',
    price: 'Precio',
    duration: 'Duración',
    descriptionField: 'Descripción breve',
    descriptionPlaceholder: 'Qué incluye, para quién es…',
    descHint: 'Opcional · máx. 300 caracteres',
    add: 'Añadir servicio',
    editTitle: 'Editar servicio',
    editDescription: 'Los cambios se publican al guardar.',
    save: 'Guardar cambios',
    cancel: 'Cancelar',
    edit: 'Editar',
    updated: 'Servicio actualizado',
    delete: 'Eliminar',
    confirmDelete: '¿Eliminar este servicio?',
    noServices: 'Aún no tienes servicios',
    noServicesHint:
      'Añade lo que ofreces con el formulario. Los precios y la duración ayudan a tus clientes a decidir.',
    added: 'Servicio añadido',
    removed: 'Servicio eliminado',
    errors: {
      name_min: 'Mínimo 2 caracteres',
      price_min: 'El precio no puede ser negativo',
      duration_min: 'Debe ser un número entero de minutos (1 o más)',
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

  const emptyValues: FormValues = {
    name: '',
    price: '',
    duration: '',
    description: '',
  }

  function startEditing(service: Service) {
    setEditingId(service.id)
    reset({
      name: service.name,
      price:
        service.price === null || service.price === undefined
          ? ''
          : String(service.price),
      duration: service.duration ? String(service.duration) : '',
      description: service.description ?? '',
    })
    document.getElementById('service-name')?.focus()
  }

  function stopEditing() {
    setEditingId(null)
    reset(emptyValues)
  }

  async function onSubmit(values: FormValues) {
    const formData = new FormData()
    formData.set('name', values.name)
    if (values.price) formData.set('price', values.price)
    if (values.duration) formData.set('duration', values.duration)
    if (values.description) formData.set('description', values.description)

    const res = editingId
      ? await updateService(editingId, formData)
      : await createService(businessId, formData)
    if (res?.error) {
      toast.error(res.error)
    } else {
      toast.success(editingId ? t.updated : t.added)
      setEditingId(null)
      reset(emptyValues)
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
      if (editingId === id) stopEditing()
      toast.success(t.removed)
      router.refresh()
    }
    setDeletingId(null)
  }

  const count = initialServices.length

  return (
    <fieldset disabled={readOnly} className="min-w-0 space-y-3">
      {readOnly ? (
        <p role="status" className="text-muted-foreground text-sm">
          Puedes consultar esta sección. Solo el propietario puede modificar el
          contenido.
        </p>
      ) : null}
      <div className="space-y-5 pb-10">
        <div>
          <h2 className="text-foreground text-base font-semibold tracking-[-0.01em]">
            {t.title}
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">{t.description}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          {/* Services list */}
          <section aria-labelledby="services-list-title" className="min-w-0">
            {count === 0 ? (
              <>
                <h3 id="services-list-title" className="sr-only">
                  {t.listTitle}
                </h3>
                <EmptyState
                  icon={Briefcase}
                  title={t.noServices}
                  description={t.noServicesHint}
                />
              </>
            ) : (
              <div className={`${surface} overflow-hidden`}>
                <div className="border-border flex items-center justify-between gap-3 border-b px-5 py-3.5">
                  <h3
                    id="services-list-title"
                    className="text-foreground text-sm font-medium"
                  >
                    {t.listTitle}
                  </h3>
                  <p className="text-muted-foreground text-xs tabular-nums">
                    {count} {count === 1 ? 'servicio' : 'servicios'}
                  </p>
                </div>
                <table className="w-full text-sm">
                  <thead className="sr-only sm:not-sr-only">
                    <tr className="text-muted-foreground border-border border-b text-left text-[11px] font-semibold tracking-[0.14em] uppercase">
                      <th scope="col" className="px-5 py-2.5 font-semibold">
                        Servicio
                      </th>
                      <th
                        scope="col"
                        className="hidden w-28 px-3 py-2.5 text-right font-semibold sm:table-cell"
                      >
                        Duración
                      </th>
                      <th
                        scope="col"
                        className="hidden w-28 px-3 py-2.5 text-right font-semibold sm:table-cell"
                      >
                        Precio
                      </th>
                      <th scope="col" className="w-24 py-2.5 pr-4">
                        <span className="sr-only">Acciones</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-border divide-y">
                    {initialServices.map((service) => {
                      const price = formatPrice(service.price)
                      const duration = formatDuration(service.duration)
                      const isDeleting = deletingId === service.id
                      return (
                        <tr
                          key={service.id}
                          className={cn(
                            'hover:bg-muted/50 align-middle transition-colors',
                            editingId === service.id && 'bg-accent/50'
                          )}
                        >
                          <td className="min-w-0 px-5 py-3.5">
                            <p className="text-foreground font-medium break-words">
                              {service.name}
                            </p>
                            {service.description ? (
                              <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs leading-5">
                                {service.description}
                              </p>
                            ) : null}
                            {/* Compact meta on small screens */}
                            {price || duration ? (
                              <p className="text-muted-foreground mt-1 flex gap-2 text-xs tabular-nums sm:hidden">
                                {duration ? <span>{duration}</span> : null}
                                {duration && price ? (
                                  <span aria-hidden="true">·</span>
                                ) : null}
                                {price ? (
                                  <span className="text-foreground font-medium">
                                    {price}
                                  </span>
                                ) : null}
                              </p>
                            ) : null}
                          </td>
                          <td className="text-muted-foreground hidden px-3 py-3.5 text-right whitespace-nowrap tabular-nums sm:table-cell">
                            {duration ?? (
                              <span className="text-muted-foreground/60">
                                —
                              </span>
                            )}
                          </td>
                          <td className="text-foreground hidden px-3 py-3.5 text-right font-medium whitespace-nowrap tabular-nums sm:table-cell">
                            {price ?? (
                              <span className="text-muted-foreground/60 font-normal">
                                —
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 pr-4 text-right whitespace-nowrap">
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => startEditing(service)}
                              aria-label={`${t.edit} ${service.name}`}
                              aria-pressed={editingId === service.id}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <Pencil aria-hidden="true" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleDelete(service.id)}
                              disabled={isDeleting}
                              aria-label={`${t.delete} ${service.name}`}
                              className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                            >
                              {isDeleting ? (
                                <Loader2
                                  className="animate-spin"
                                  aria-hidden="true"
                                />
                              ) : (
                                <Trash2 aria-hidden="true" />
                              )}
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Add form */}
          <section
            aria-labelledby="add-service-title"
            className={`${surface} p-5 lg:sticky lg:top-6`}
          >
            <div className="flex items-start gap-3">
              <span className="bg-secondary text-secondary-foreground flex size-8 shrink-0 items-center justify-center rounded-lg">
                {editingId ? (
                  <Pencil className="size-4" aria-hidden="true" />
                ) : (
                  <Plus className="size-4" aria-hidden="true" />
                )}
              </span>
              <div>
                <h3
                  id="add-service-title"
                  className="text-foreground text-sm font-semibold"
                >
                  {editingId ? t.editTitle : t.addTitle}
                </h3>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  {editingId ? t.editDescription : t.addDescription}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
              <Field
                id="service-name"
                label={t.name}
                required
                error={errors.name ? err(errors.name.message!) : undefined}
              >
                <Input
                  id="service-name"
                  {...register('name')}
                  placeholder={t.namePlaceholder}
                  autoComplete="off"
                  aria-required="true"
                  aria-invalid={!!errors.name}
                  aria-describedby={
                    errors.name ? 'service-name-error' : undefined
                  }
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field
                  id="service-price"
                  label={t.price}
                  srLabel=" en euros"
                  error={errors.price ? err(errors.price.message!) : undefined}
                >
                  <div className="relative">
                    <Input
                      id="service-price"
                      {...register('price')}
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      min="0"
                      placeholder="0"
                      aria-invalid={!!errors.price}
                      aria-describedby={
                        errors.price ? 'service-price-error' : undefined
                      }
                      className="pr-8 tabular-nums"
                    />
                    <span
                      className="text-muted-foreground pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm"
                      aria-hidden="true"
                    >
                      €
                    </span>
                  </div>
                </Field>
                <Field
                  id="service-duration"
                  label={t.duration}
                  srLabel=" en minutos"
                  error={
                    errors.duration ? err(errors.duration.message!) : undefined
                  }
                >
                  <div className="relative">
                    <Input
                      id="service-duration"
                      {...register('duration')}
                      type="number"
                      inputMode="numeric"
                      min="1"
                      placeholder="30"
                      aria-invalid={!!errors.duration}
                      aria-describedby={
                        errors.duration ? 'service-duration-error' : undefined
                      }
                      className="pr-11 tabular-nums"
                    />
                    <span
                      className="text-muted-foreground pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm"
                      aria-hidden="true"
                    >
                      min
                    </span>
                  </div>
                </Field>
              </div>

              <Field
                id="service-description"
                label={t.descriptionField}
                hint={t.descHint}
                error={
                  errors.description
                    ? err(errors.description.message!)
                    : undefined
                }
              >
                <Textarea
                  id="service-description"
                  {...register('description')}
                  rows={3}
                  placeholder={t.descriptionPlaceholder}
                  aria-invalid={!!errors.description}
                  aria-describedby={
                    errors.description
                      ? 'service-description-error'
                      : 'service-description-hint'
                  }
                  className="resize-none"
                />
              </Field>

              <div className="flex gap-2">
                {editingId ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={stopEditing}
                    disabled={isSubmitting}
                  >
                    {t.cancel}
                  </Button>
                ) : null}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" aria-hidden="true" />
                  ) : editingId ? null : (
                    <Plus aria-hidden="true" />
                  )}
                  {editingId ? t.save : t.add}
                </Button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </fieldset>
  )
}
