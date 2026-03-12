'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { ca, es } from 'date-fns/locale'

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
      received: 'Recibido',
    },
    ca: {
      title: 'Leads i Contactes',
      description: 'Persones que han contactat a través del teu web.',
      noLeads: 'No hi ha missatges encara.',
      received: 'Rebut',
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
                <div key={lead.id} className="p-4">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-semibold text-slate-900">{lead.name}</h4>
                      <p className="text-sm text-muted-foreground">{lead.email}</p>
                      {lead.phone && <p className="text-sm text-muted-foreground">{lead.phone}</p>}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {t.received}:{' '}
                      {format(new Date(lead.created_at), 'dd/MM/yyyy HH:mm', {
                        locale: locale === 'ca' ? ca : es,
                      })}
                    </span>
                  </div>
                  <p className="mt-2 rounded-md border bg-slate-50 p-3 text-sm">
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
