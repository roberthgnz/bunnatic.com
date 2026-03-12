'use client'

import { useState } from 'react'
import { createService, deleteService } from '@/lib/supabase/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, Trash2, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Textarea } from '@/components/ui/textarea'

export default function ServicesManager({ 
  businessId, 
  initialServices,
  locale 
}: { 
  businessId: string, 
  initialServices: any[],
  locale: string 
}) {
  const [loading, setLoading] = useState(false)
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
    },
  }[locale === 'ca' ? 'ca' : 'es']

  async function handleAdd(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    const formData = new FormData(event.currentTarget)
    
    const res = await createService(businessId, formData)
    if (res?.error) {
      toast.error(res.error)
    } else {
      toast.success(t.added)
      event.currentTarget.reset()
      router.refresh()
    }
    setLoading(false)
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleAdd} className="grid gap-3 rounded-lg border bg-slate-50/60 p-4 md:grid-cols-12">
            <div className="md:col-span-4">
              <Input name="name" placeholder={t.name} required />
            </div>
            <div className="md:col-span-2">
              <Input name="price" type="number" step="0.01" min="0" placeholder={t.price} />
            </div>
            <div className="md:col-span-2">
              <Input name="duration" type="number" min="1" placeholder={t.duration} />
            </div>
            <div className="md:col-span-3">
              <Textarea
                name="description"
                placeholder={t.descriptionField}
                rows={1}
                className="min-h-10 resize-none"
              />
            </div>
            <Button type="submit" disabled={loading} className="md:col-span-1">
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  {t.add}
                </>
              )}
            </Button>
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
