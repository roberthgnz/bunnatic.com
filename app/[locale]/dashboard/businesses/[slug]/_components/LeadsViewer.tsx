'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'

export default function LeadsViewer({ 
  leads,
  locale 
}: { 
  leads: any[],
  locale: string 
}) {
  const t = {
    es: {
      title: 'Leads y Contactos',
      description: 'Personas que han contactado a través de tu web.',
      noLeads: 'No hay mensajes todavía.',
      name: 'Nombre',
      email: 'Email',
      date: 'Fecha',
      message: 'Mensaje',
    },
    ca: {
      title: 'Leads i Contactes',
      description: 'Persones que han contactat a través del teu web.',
      noLeads: 'No hi ha missatges encara.',
      name: 'Nom',
      email: 'Email',
      date: 'Data',
      message: 'Missatge',
    },
  }[locale === 'ca' ? 'ca' : 'es']

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {leads.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {t.noLeads}
          </div>
        ) : (
          <div className="rounded-md border">
            <div className="grid grid-cols-1 divide-y">
              {leads.map((lead) => (
                <div key={lead.id} className="p-4 hover:bg-muted/50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{lead.name}</h4>
                      <p className="text-sm text-muted-foreground">{lead.email}</p>
                      {lead.phone && <p className="text-sm text-muted-foreground">{lead.phone}</p>}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(lead.created_at), 'dd/MM/yyyy HH:mm')}
                    </span>
                  </div>
                  <p className="text-sm mt-2 bg-slate-50 p-3 rounded-md border">
                    {lead.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
