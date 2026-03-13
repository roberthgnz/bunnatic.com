'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createTeamMember, deleteTeamMember } from '@/lib/supabase/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormField } from '@/components/ui/form-field'
import { toast } from 'sonner'
import { Loader2, Trash2, Plus, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const schema = z.object({
  name: z.string().min(2, { message: 'name_min' }),
  role: z.string().min(2, { message: 'role_min' }),
  image_url: z.string().url({ message: 'url_invalid' }).optional().or(z.literal('')),
})

type FormValues = z.infer<typeof schema>

type TeamMember = {
  id: string
  name: string
  role: string
  image_url?: string | null
}

export default function TeamManager({
  businessId,
  initialTeam,
}: {
  businessId: string
  initialTeam: TeamMember[]
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter()

  const t = {
    title: 'Equipo',
    description: 'Añade a los miembros de tu equipo.',
    addTitle: 'Añadir miembro',
    name: 'Nombre',
    role: 'Rol / Cargo',
    imageUrl: 'URL de la foto (opcional)',
    add: 'Añadir',
    delete: 'Eliminar',
    confirmDelete: '¿Eliminar a este miembro?',
    noTeam: 'No hay miembros en el equipo aún.',
    added: 'Miembro añadido',
    removed: 'Miembro eliminado',
    errors: {
      name_min: 'Mínimo 2 caracteres',
      role_min: 'Mínimo 2 caracteres',
      url_invalid: 'URL no válida',
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
          <div className="sm:col-span-4">
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
          <div className="sm:col-span-4">
            <FormField
              label={t.role}
              error={errors.role ? err(errors.role.message!) : undefined}
              required
            >
              <Input
                {...register('role')}
                aria-invalid={!!errors.role}
                className="h-9"
              />
            </FormField>
          </div>
          <div className="sm:col-span-4">
            <FormField
              label={t.imageUrl}
              error={
                errors.image_url ? err(errors.image_url.message!) : undefined
              }
            >
              <Input
                {...register('image_url')}
                aria-invalid={!!errors.image_url}
                className="h-9"
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

      {/* Team list */}
      {initialTeam.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
            <Users className="h-5 w-5 text-slate-400" />
          </div>
          <p className="text-sm text-slate-500">{t.noTeam}</p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {initialTeam.map((member) => (
            <li
              key={member.id}
              className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-slate-50/60"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative h-10 w-10 overflow-hidden rounded-full bg-slate-100">
                  {member.image_url ? (
                    <Image
                      src={member.image_url}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-400">
                      <Users className="h-5 w-5" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {member.name}
                  </p>
                  <p className="text-xs text-slate-500">{member.role}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => handleDelete(member.id)}
                disabled={deletingId === member.id}
                aria-label={`${t.delete} ${member.name}`}
                className="shrink-0 text-slate-400 hover:bg-red-50 hover:text-red-500"
              >
                {deletingId === member.id ? (
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
