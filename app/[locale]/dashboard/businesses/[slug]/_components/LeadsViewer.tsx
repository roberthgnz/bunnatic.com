'use client'

import { format } from 'date-fns'
import { ca, es } from 'date-fns/locale'
import { Mail, MessageSquare, Phone, User } from 'lucide-react'

export default function LeadsViewer({
  leads,
  locale,
}: {
  leads: any[]
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
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-50/60 px-6 py-4">
        <h3 className="text-sm font-semibold text-slate-900">{t.title}</h3>
        <p className="mt-0.5 text-xs text-slate-500">{t.description}</p>
      </div>
      <div>
        {leads.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
              <MessageSquare className="h-5 w-5 text-slate-400" />
            </div>
            <p className="text-sm text-slate-500">{t.noLeads}</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="space-y-3 px-6 py-4 transition-colors hover:bg-slate-50/60"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700">
                        <User className="h-4 w-4" />
                      </div>
                      <h4 className="truncate text-sm font-semibold text-slate-900">
                        {lead.name}
                      </h4>
                    </div>
                    <p className="flex items-center gap-1.5 truncate text-sm text-slate-500">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      {lead.email}
                    </p>
                    {lead.phone && (
                      <p className="flex items-center gap-1.5 text-sm text-slate-500">
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                        {lead.phone}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                    {t.received}:{' '}
                    {format(new Date(lead.created_at), 'dd/MM/yyyy HH:mm', {
                      locale: locale === 'ca' ? ca : es,
                    })}
                  </span>
                </div>
                <p className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                  {lead.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
