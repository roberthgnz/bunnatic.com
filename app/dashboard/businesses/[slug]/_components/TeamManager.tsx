'use client'

import { useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createTeamMember, deleteTeamMember } from '@/lib/supabase/actions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EmptyState } from '@/components/dashboard/page-header'
import { toast } from 'sonner'
import { AlertCircle, Loader2, Trash2, UserPlus, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const schema = z.object({
  name: z.string().min(2, { message: 'name_min' }),
  role: z.string().min(2, { message: 'role_min' }),
  image_url: z
    .string()
    .url({ message: 'url_invalid' })
    .optional()
    .or(z.literal('')),
})

type FormValues = z.infer<typeof schema>

type TeamMember = {
  id: string
  name: string
  role: string
  image_url?: string | null
}

const surface =
  'bg-card ring-border rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1'

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  const first = parts[0][0] ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? '') : ''
  return (first + last).toUpperCase()
}

function Field({
  id,
  label,
  required,
  hint,
  error,
  children,
}: {
  id: string
  label: string
  required?: boolean
  hint?: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-foreground gap-0.5 text-[13px]">
        {label}
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

export default function TeamManager({
  businessId,
  readOnly = false,
  initialTeam,
}: {
  businessId: string
  readOnly?: boolean
  initialTeam: TeamMember[]
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter()

  const t = {
    title: 'Equipo',
    description:
      'Las personas que atienden tu negocio. Se muestran en la sección de equipo de tu web.',
    listTitle: 'Miembros del equipo',
    addTitle: 'Añadir miembro',
    addDescription: 'Una cara conocida genera confianza.',
    name: 'Nombre',
    namePlaceholder: 'Ej. Laura Martín',
    role: 'Cargo',
    rolePlaceholder: 'Ej. Estilista',
    imageUrl: 'URL de la foto',
    imageHint: 'Opcional · enlace público a una imagen',
    add: 'Añadir miembro',
    delete: 'Eliminar',
    confirmDelete: '¿Eliminar a este miembro?',
    noTeam: 'Aún no has añadido a nadie',
    noTeamHint:
      'Presenta a tu equipo con su nombre, cargo y una foto. Usa el formulario para empezar.',
    added: 'Miembro añadido',
    removed: 'Miembro eliminado',
    errors: {
      name_min: 'Mínimo 2 caracteres',
      role_min: 'Mínimo 2 caracteres',
      url_invalid: 'Introduce una URL válida (https://…)',
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
    defaultValues: { name: '', role: '', image_url: '' },
  })

  async function onSubmit(values: FormValues) {
    const formData = new FormData()
    formData.set('name', values.name)
    formData.set('role', values.role)
    if (values.image_url) formData.set('image_url', values.image_url)

    const res = await createTeamMember(businessId, formData)
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
    const res = await deleteTeamMember(businessId, id)
    if (res?.error) {
      toast.error(res.error)
    } else {
      toast.success(t.removed)
      router.refresh()
    }
    setDeletingId(null)
  }

  const count = initialTeam.length

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
          {/* Team list */}
          <section aria-labelledby="team-list-title" className="min-w-0">
            {count === 0 ? (
              <>
                <h3 id="team-list-title" className="sr-only">
                  {t.listTitle}
                </h3>
                <EmptyState
                  icon={Users}
                  title={t.noTeam}
                  description={t.noTeamHint}
                />
              </>
            ) : (
              <div className={`${surface} overflow-hidden`}>
                <div className="border-border flex items-center justify-between gap-3 border-b px-5 py-3.5">
                  <h3
                    id="team-list-title"
                    className="text-foreground text-sm font-medium"
                  >
                    {t.listTitle}
                  </h3>
                  <p className="text-muted-foreground text-xs tabular-nums">
                    {count} {count === 1 ? 'persona' : 'personas'}
                  </p>
                </div>
                <ul className="divide-border divide-y">
                  {initialTeam.map((member) => {
                    const isDeleting = deletingId === member.id
                    return (
                      <li
                        key={member.id}
                        className="hover:bg-muted/50 flex items-center gap-4 px-5 py-3.5 transition-colors"
                      >
                        <div className="bg-secondary text-secondary-foreground ring-border relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full text-sm font-semibold ring-1">
                          {member.image_url ? (
                            <Image
                              src={member.image_url}
                              alt=""
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          ) : (
                            <span aria-hidden="true">
                              {initials(member.name)}
                            </span>
                          )}
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                          <p className="text-foreground truncate text-sm font-medium">
                            {member.name}
                          </p>
                          {member.role ? (
                            <Badge
                              variant="secondary"
                              className="max-w-full truncate"
                            >
                              {member.role}
                            </Badge>
                          ) : null}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleDelete(member.id)}
                          disabled={isDeleting}
                          aria-label={`${t.delete} a ${member.name}`}
                          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive shrink-0"
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
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </section>

          {/* Add form */}
          <section
            aria-labelledby="add-member-title"
            className={`${surface} p-5 lg:sticky lg:top-6`}
          >
            <div className="flex items-start gap-3">
              <span className="bg-secondary text-secondary-foreground flex size-8 shrink-0 items-center justify-center rounded-lg">
                <UserPlus className="size-4" aria-hidden="true" />
              </span>
              <div>
                <h3
                  id="add-member-title"
                  className="text-foreground text-sm font-semibold"
                >
                  {t.addTitle}
                </h3>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  {t.addDescription}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
              <Field
                id="member-name"
                label={t.name}
                required
                error={errors.name ? err(errors.name.message!) : undefined}
              >
                <Input
                  id="member-name"
                  {...register('name')}
                  placeholder={t.namePlaceholder}
                  autoComplete="off"
                  aria-required="true"
                  aria-invalid={!!errors.name}
                  aria-describedby={
                    errors.name ? 'member-name-error' : undefined
                  }
                />
              </Field>
              <Field
                id="member-role"
                label={t.role}
                required
                error={errors.role ? err(errors.role.message!) : undefined}
              >
                <Input
                  id="member-role"
                  {...register('role')}
                  placeholder={t.rolePlaceholder}
                  autoComplete="off"
                  aria-required="true"
                  aria-invalid={!!errors.role}
                  aria-describedby={
                    errors.role ? 'member-role-error' : undefined
                  }
                />
              </Field>
              <Field
                id="member-image"
                label={t.imageUrl}
                hint={t.imageHint}
                error={
                  errors.image_url ? err(errors.image_url.message!) : undefined
                }
              >
                <Input
                  id="member-image"
                  {...register('image_url')}
                  inputMode="url"
                  placeholder="https://"
                  autoComplete="off"
                  aria-invalid={!!errors.image_url}
                  aria-describedby={
                    errors.image_url
                      ? 'member-image-error'
                      : 'member-image-hint'
                  }
                />
              </Field>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? (
                  <Loader2 className="animate-spin" aria-hidden="true" />
                ) : (
                  <UserPlus aria-hidden="true" />
                )}
                {t.add}
              </Button>
            </form>
          </section>
        </div>
      </div>
    </fieldset>
  )
}
