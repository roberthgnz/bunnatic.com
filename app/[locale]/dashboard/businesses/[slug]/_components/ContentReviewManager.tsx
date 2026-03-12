'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateSectionStatus } from '@/lib/supabase/actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { FileText } from 'lucide-react'

export default function ContentReviewManager({ 
  sections,
  locale 
}: { 
  sections: any[],
  locale: string 
}) {
  const t = {
    es: {
      title: 'Revisiones de Contenido',
      description: 'Gestiona el estado y aprobación de las secciones de tu web.',
      status: {
        draft: 'Borrador',
        review: 'En Revisión',
        published: 'Publicado',
      },
      section: 'Sección',
      actions: 'Acciones',
      update: 'Actualizar estado',
      noSections: 'No hay secciones disponibles para revisar.',
      saved: 'Estado actualizado',
    },
    ca: {
      title: 'Revisions de Contingut',
      description: 'Gestiona l\'estat i aprovació de les seccions de la teva web.',
      status: {
        draft: 'Esborrany',
        review: 'En Revisió',
        published: 'Publicat',
      },
      section: 'Secció',
      actions: 'Accions',
      update: 'Actualitzar estat',
      noSections: 'No hi ha seccions disponibles per revisar.',
      saved: 'Estat actualitzat',
    },
  }[locale === 'ca' ? 'ca' : 'es']
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const router = useRouter()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200'
      case 'review': return 'bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200'
      default: return 'bg-slate-100 text-slate-800 hover:bg-slate-100 border-slate-200'
    }
  }

  async function handleStatusChange(id: string, newStatus: string) {
    setUpdatingId(id)
    const res = await updateSectionStatus(id, newStatus)
    if (res?.error) {
      toast.error(res.error)
    } else {
      toast.success(t.saved)
      router.refresh()
    }
    setUpdatingId(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {sections.length === 0 ? (
          <div className="rounded-md border border-dashed p-8 text-center text-sm text-slate-500">
            {t.noSections}
          </div>
        ) : (
          <div className="space-y-4">
            {sections.map((section) => (
            <div key={section.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-slate-500" />
                </div>
                <div>
                  <h4 className="font-semibold capitalize">{section.type}</h4>
                  <p className="text-sm text-muted-foreground truncate max-w-[300px]">
                    {section.content.title || 'Sin título'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Badge variant="outline" className={getStatusColor(section.status)}>
                  {t.status[section.status as keyof typeof t.status] || section.status}
                </Badge>
                
                <Select
                  defaultValue={section.status} 
                  onValueChange={(val) => handleStatusChange(section.id, val)}
                  disabled={updatingId === section.id}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">{t.status.draft}</SelectItem>
                    <SelectItem value="review">{t.status.review}</SelectItem>
                    <SelectItem value="published">{t.status.published}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
