'use client'

import { useState } from 'react'
import { createService, deleteService } from '@/lib/supabase/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, Trash2, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

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
  const router = useRouter()

  const t = {
    es: {
      title: 'Servicios',
      description: 'Gestiona los servicios que ofrece tu negocio.',
      add: 'Añadir servicio',
      name: 'Nombre del servicio',
      price: 'Precio (€)',
      duration: 'Duración (min)',
      delete: 'Eliminar',
      confirmDelete: '¿Estás seguro?',
      noServices: 'No hay servicios registrados.',
    },
    ca: {
      title: 'Serveis',
      description: 'Gestiona els serveis que ofereix el teu negoci.',
      add: 'Afegir servei',
      name: 'Nom del servei',
      price: 'Preu (€)',
      duration: 'Durada (min)',
      delete: 'Eliminar',
      confirmDelete: 'Estàs segur?',
      noServices: 'No hi ha serveis registrats.',
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
      toast.success('Servicio añadido')
      event.currentTarget.reset()
      router.refresh()
    }
    setLoading(false)
  }

  async function handleDelete(id: string) {
    if (!confirm(t.confirmDelete)) return
    const res = await deleteService(id)
    if (res?.error) {
      toast.error(res.error)
    } else {
      toast.success('Servicio eliminado')
      router.refresh()
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="flex gap-4 items-end mb-6 flex-wrap">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Input name="name" placeholder={t.name} required />
            </div>
            <div className="grid w-32 items-center gap-1.5">
              <Input name="price" type="number" step="0.01" placeholder={t.price} />
            </div>
            <div className="grid w-32 items-center gap-1.5">
              <Input name="duration" type="number" placeholder={t.duration} />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
              {t.add}
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
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(service.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
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
