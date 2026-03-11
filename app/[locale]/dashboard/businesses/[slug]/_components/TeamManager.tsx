'use client'

import { useState } from 'react'
import { inviteTeamMember, removeTeamMember } from '@/lib/supabase/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, Plus, Trash2, UserPlus, Mail } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function TeamManager({ 
  businessId, 
  initialMembers,
  locale 
}: { 
  businessId: string, 
  initialMembers: any[],
  locale: string 
}) {
  const [loading, setLoading] = useState(false)
  
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
        viewer: 'Visualizador'
      },
      pending: 'Pendiente',
      remove: 'Eliminar',
      confirmRemove: '¿Estás seguro de que quieres eliminar a este usuario?',
      noMembers: 'Aún no hay miembros en el equipo.',
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
        viewer: 'Visualitzador'
      },
      pending: 'Pendent',
      remove: 'Eliminar',
      confirmRemove: 'Estàs segur que vols eliminar aquest usuari?',
      noMembers: 'Encara no hi ha membres a l\'equip.',
    },
  }[locale === 'ca' ? 'ca' : 'es']

  async function handleInvite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    const formData = new FormData(event.currentTarget)
    const email = formData.get('email') as string
    const role = formData.get('role') as string
    
    const res = await inviteTeamMember(businessId, email, role)
    if (res?.error) {
      toast.error(res.error)
    } else {
      toast.success('Invitación enviada (simulada)')
      ;(event.target as HTMLFormElement).reset()
    }
    setLoading(false)
  }

  async function handleRemove(id: string) {
    if (!confirm(t.confirmRemove)) return
    const res = await removeTeamMember(id)
    if (res?.error) {
      toast.error(res.error)
    } else {
      toast.success('Miembro eliminado')
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t.invite}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInvite} className="flex gap-4 items-end mb-6 flex-wrap">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Input name="email" type="email" placeholder={t.emailPlaceholder} required />
            </div>
            <div className="grid w-40 items-center gap-1.5">
              <Select name="role" defaultValue="editor">
                <SelectTrigger>
                  <SelectValue placeholder={t.role} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">{t.roles.admin}</SelectItem>
                  <SelectItem value="editor">{t.roles.editor}</SelectItem>
                  <SelectItem value="viewer">{t.roles.viewer}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4 mr-2" />}
              {t.send}
            </Button>
          </form>

          <div className="rounded-md border divide-y">
            {initialMembers.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-2">
                <Mail className="h-8 w-8 text-gray-300" />
                <p>{t.noMembers}</p>
              </div>
            ) : (
              initialMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                      {member.invited_email?.[0]?.toUpperCase() || member.profiles?.full_name?.[0] || 'U'}
                    </div>
                    <div>
                      <p className="font-medium">{member.profiles?.full_name || member.invited_email}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground bg-slate-100 px-2 py-0.5 rounded-full">
                          {t.roles[member.role as keyof typeof t.roles] || member.role}
                        </span>
                        {member.status === 'pending' && (
                          <span className="text-xs text-amber-600 font-medium">{t.pending}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleRemove(member.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
