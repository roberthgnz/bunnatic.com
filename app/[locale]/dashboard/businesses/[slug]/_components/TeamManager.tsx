'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { inviteTeamMember, removeTeamMember } from '@/lib/supabase/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormField } from '@/components/ui/form-field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Trash2, UserPlus, Mail, Shield } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const schema = z.object({
  email: z.string().email({ message: 'email_invalid' }),
  role: z.enum(['admin', 'editor', 'viewer'], { message: 'role_required' }),
})

type FormValues = z.infer<typeof schema>

const roleColors = {
  admin: 'bg-purple-50 text-purple-700 ring-purple-200',
  editor: 'bg-blue-50 text-blue-700 ring-blue-200',
  viewer: 'bg-slate-50 text-slate-600 ring-slate-200',
}

export default function TeamManager({
  businessId,
  initialMembers,
  locale,
}: {
  businessId: string
  initialMembers: any[]
  locale: string
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter()

  const t = {
    es: {
      title: 'Equipo',
      description: 'Controla quién tiene acceso a este negocio.',
      inviteTitle: 'Invitar miembro',
      emailPlaceholder: 'correo@ejemplo.com',
      role: 'Rol',
      send: 'Enviar invitación',
      roles: { admin: 'Administrador', editor: 'Editor', viewer: 'Solo lectura' },
      pending: 'Pendiente',
      active: 'Activo',
      remove: 'Eliminar',
      confirmRemove: '¿Eliminar acceso de este miembro?',
      noMembers: 'Aún no hay miembros en el equipo.',
      invited: 'Invitación enviada',
      removed: 'Miembro eliminado',
      unknownUser: 'Usuario sin nombre',
      errors: {
        email_invalid: 'Introduce un correo electrónico válido',
        role_required: 'Selecciona un rol',
      },
    },
    ca: {
      title: 'Equip',
      description: 'Controla qui té accés a aquest negoci.',
      inviteTitle: 'Convidar membre',
      emailPlaceholder: 'correu@exemple.com',
      role: 'Rol',
      send: 'Enviar invitació',
      roles: { admin: 'Administrador', editor: 'Editor', viewer: 'Només lectura' },
      pending: 'Pendent',
      active: 'Actiu',
      remove: 'Eliminar',
      confirmRemove: 'Eliminar accés a aquest membre?',
      noMembers: "Encara no hi ha membres a l'equip.",
      invited: 'Invitació enviada',
      removed: 'Membre eliminat',
      unknownUser: 'Usuari sense nom',
      errors: {
        email_invalid: 'Introdueix un correu electrònic vàlid',
        role_required: 'Selecciona un rol',
      },
    },
  }[locale === 'ca' ? 'ca' : 'es']

  const err = (key: string) => t.errors[key as keyof typeof t.errors] ?? key

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', role: 'editor' },
  })

  async function onSubmit(values: FormValues) {
    const res = await inviteTeamMember(businessId, values.email, values.role)
    if (res?.error) {
      toast.error(res.error)
      return
    }
    toast.success(t.invited)
    reset()
    router.refresh()
  }

  async function handleRemove(id: string) {
    if (!confirm(t.confirmRemove)) return
    setDeletingId(id)
    const res = await removeTeamMember(id)
    if (res?.error) {
      toast.error(res.error)
      setDeletingId(null)
      return
    }
    toast.success(t.removed)
    setDeletingId(null)
    router.refresh()
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-100 bg-slate-50/60 px-6 py-4">
        <h3 className="text-sm font-semibold text-slate-900">{t.title}</h3>
        <p className="mt-0.5 text-xs text-slate-500">{t.description}</p>
      </div>

      {/* Invite form */}
      <form onSubmit={handleSubmit(onSubmit)} className="border-b border-slate-100 px-6 py-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          {t.inviteTitle}
        </p>
        <div className="grid gap-3 sm:grid-cols-12">
          <div className="sm:col-span-7">
            <FormField
              label="Email"
              error={errors.email ? err(errors.email.message!) : undefined}
              required
            >
              <Input
                {...register('email')}
                type="email"
                placeholder={t.emailPlaceholder}
                aria-invalid={!!errors.email}
                className="h-9"
              />
            </FormField>
          </div>
          <div className="sm:col-span-5">
            <FormField
              label={t.role}
              error={errors.role ? err(errors.role.message!) : undefined}
              required
            >
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger aria-invalid={!!errors.role} className="h-9">
                      <SelectValue placeholder={t.role} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">
                        <span className="flex items-center gap-2">
                          <Shield className="h-3.5 w-3.5 text-purple-500" />
                          {t.roles.admin}
                        </span>
                      </SelectItem>
                      <SelectItem value="editor">
                        <span className="flex items-center gap-2">
                          <Shield className="h-3.5 w-3.5 text-blue-500" />
                          {t.roles.editor}
                        </span>
                      </SelectItem>
                      <SelectItem value="viewer">
                        <span className="flex items-center gap-2">
                          <Shield className="h-3.5 w-3.5 text-slate-400" />
                          {t.roles.viewer}
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            size="sm"
            className="gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-0 shadow-sm"
          >
            {isSubmitting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <UserPlus className="h-3.5 w-3.5" />
            )}
            {t.send}
          </Button>
        </div>
      </form>

      {/* Members list */}
      {initialMembers.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
            <Mail className="h-5 w-5 text-slate-400" />
          </div>
          <p className="text-sm text-slate-500">{t.noMembers}</p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {initialMembers.map((member) => {
            const displayName = member.profiles?.full_name || member.invited_email || t.unknownUser
            const roleKey = member.role as keyof typeof roleColors
            const roleLabel = t.roles[member.role as keyof typeof t.roles] || member.role
            const status = member.status === 'pending' ? t.pending : t.active
            const initials = displayName[0]?.toUpperCase() || 'U'

            return (
              <li
                key={member.id}
                className="flex items-center justify-between gap-3 px-6 py-3.5 hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-200 to-slate-300 text-xs font-semibold text-slate-700">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{displayName}</p>
                    <p className="text-xs text-slate-400 truncate">{member.invited_email || '—'}</p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${roleColors[roleKey] ?? 'bg-slate-50 text-slate-600 ring-slate-200'}`}
                  >
                    {roleLabel}
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ring-1 ${
                      member.status === 'pending'
                        ? 'bg-amber-50 text-amber-600 ring-amber-200'
                        : 'bg-emerald-50 text-emerald-600 ring-emerald-200'
                    }`}
                  >
                    {status}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleRemove(member.id)}
                    disabled={deletingId === member.id}
                    aria-label={`${t.remove} ${displayName}`}
                    className="text-slate-400 hover:text-red-500 hover:bg-red-50"
                  >
                    {deletingId === member.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
