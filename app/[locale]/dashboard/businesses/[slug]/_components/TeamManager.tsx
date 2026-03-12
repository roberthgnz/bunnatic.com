'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { inviteTeamMember, removeTeamMember } from '@/lib/supabase/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Trash2, UserPlus, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const schema = z.object({
  email: z.string().email({ message: 'email_invalid' }),
  role: z.enum(['admin', 'editor', 'viewer'], { message: 'role_required' }),
})

type FormValues = z.infer<typeof schema>

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
      description: 'Gestiona quién tiene acceso a este negocio.',
      invite: 'Invitar miembro',
      emailPlaceholder: 'correo@ejemplo.com',
      role: 'Rol',
      send: 'Enviar invitación',
      roles: {
        admin: 'Administrador',
        editor: 'Editor',
        viewer: 'Visualizador',
      },
      pending: 'Pendiente',
      active: 'Activo',
      remove: 'Eliminar',
      confirmRemove: '¿Seguro que quieres eliminar este acceso?',
      noMembers: 'Todavía no hay miembros en el equipo.',
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
      description: 'Gestiona qui té accés a aquest negoci.',
      invite: 'Convidar membre',
      emailPlaceholder: 'correu@exemple.com',
      role: 'Rol',
      send: 'Enviar invitació',
      roles: {
        admin: 'Administrador',
        editor: 'Editor',
        viewer: 'Visualitzador',
      },
      pending: 'Pendent',
      active: 'Actiu',
      remove: 'Eliminar',
      confirmRemove: 'Segur que vols eliminar aquest accés?',
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
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 rounded-lg border bg-slate-50/60 p-4">
          <div className="grid gap-3 md:grid-cols-12">
            <div className="md:col-span-6 space-y-1">
              <Input
                {...register('email')}
                type="email"
                placeholder={t.emailPlaceholder}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-xs text-red-500">
                  {t.errors[errors.email.message as keyof typeof t.errors] ?? errors.email.message}
                </p>
              )}
            </div>

            <div className="md:col-span-3 space-y-1">
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger aria-invalid={!!errors.role}>
                      <SelectValue placeholder={t.role} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">{t.roles.admin}</SelectItem>
                      <SelectItem value="editor">{t.roles.editor}</SelectItem>
                      <SelectItem value="viewer">{t.roles.viewer}</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.role && (
                <p className="text-xs text-red-500">
                  {t.errors[errors.role.message as keyof typeof t.errors] ?? errors.role.message}
                </p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting} className="md:col-span-3">
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <UserPlus className="mr-2 h-4 w-4" />
              )}
              {t.send}
            </Button>
          </div>
        </form>

        <div className="rounded-md border divide-y">
          {initialMembers.length === 0 ? (
            <div className="flex flex-col items-center gap-2 p-8 text-center text-sm text-muted-foreground">
              <Mail className="h-8 w-8 text-slate-300" />
              <p>{t.noMembers}</p>
            </div>
          ) : (
            initialMembers.map((member) => {
              const displayName = member.profiles?.full_name || member.invited_email || t.unknownUser
              const role = t.roles[member.role as keyof typeof t.roles] || member.role
              const status = member.status === 'pending' ? t.pending : t.active

              return (
                <div key={member.id} className="flex items-center justify-between gap-3 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-sm font-semibold text-slate-700">
                      {displayName[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{displayName}</p>
                      <p className="text-xs text-slate-500">{member.invited_email || '-'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700">
                      {role}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600">
                      {status}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(member.id)}
                      disabled={deletingId === member.id}
                      aria-label={`${t.remove} ${displayName}`}
                    >
                      {deletingId === member.id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-red-500" />
                      )}
                    </Button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
