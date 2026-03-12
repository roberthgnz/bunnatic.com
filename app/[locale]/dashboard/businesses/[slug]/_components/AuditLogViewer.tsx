'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { FileText, Settings, Users, Activity, ClipboardList } from 'lucide-react'
import { format } from 'date-fns'
import { ca, es } from 'date-fns/locale'

const actionColors: Record<string, string> = {
  create: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  update: 'bg-blue-50 text-blue-700 ring-blue-200',
  delete: 'bg-red-50 text-red-700 ring-red-200',
  publish: 'bg-purple-50 text-purple-700 ring-purple-200',
}

const iconBg: Record<string, string> = {
  section: 'bg-blue-50 text-blue-500',
  service: 'bg-emerald-50 text-emerald-500',
  team: 'bg-purple-50 text-purple-500',
  settings: 'bg-slate-100 text-slate-500',
}

export default function AuditLogViewer({
  logs,
  locale,
}: {
  logs: any[]
  locale: string
}) {
  const t = {
    es: {
      title: 'Auditoría de cambios',
      description: 'Registro de actividad y cambios en el negocio.',
      empty: 'No hay actividad registrada aún.',
      actions: { create: 'Creó', update: 'Actualizó', delete: 'Eliminó', publish: 'Publicó' },
      entities: {
        section: 'una sección',
        service: 'un servicio',
        settings: 'la configuración',
        team: 'un miembro del equipo',
      },
    },
    ca: {
      title: 'Auditoria de canvis',
      description: "Registre d'activitat i canvis en el negoci.",
      empty: "No hi ha activitat registrada encara.",
      actions: { create: 'Va crear', update: 'Va actualitzar', delete: 'Va eliminar', publish: 'Va publicar' },
      entities: {
        section: 'una secció',
        service: 'un servei',
        settings: 'la configuració',
        team: "un membre de l'equip",
      },
    },
  }[locale === 'ca' ? 'ca' : 'es']

  const getIcon = (type: string) => {
    const cls = 'h-4 w-4'
    switch (type) {
      case 'section': return <FileText className={cls} />
      case 'service': return <Activity className={cls} />
      case 'team': return <Users className={cls} />
      case 'settings': return <Settings className={cls} />
      default: return <Activity className={cls} />
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col h-[600px]">
      {/* Header */}
      <div className="shrink-0 border-b border-slate-100 bg-slate-50/60 px-6 py-4">
        <h3 className="text-sm font-semibold text-slate-900">{t.title}</h3>
        <p className="mt-0.5 text-xs text-slate-500">{t.description}</p>
      </div>

      <ScrollArea className="flex-1">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
              <ClipboardList className="h-5 w-5 text-slate-400" />
            </div>
            <p className="text-sm text-slate-500">{t.empty}</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 px-6 pt-3 pb-6">
            {logs.map((log, i) => {
              const actionKey = log.action as keyof typeof t.actions
              const entityKey = log.entity_type as keyof typeof t.entities
              const iconBgCls = iconBg[log.entity_type] ?? 'bg-slate-100 text-slate-500'
              const badgeCls = actionColors[log.action] ?? 'bg-slate-50 text-slate-600 ring-slate-200'

              return (
                <div key={log.id} className="flex gap-4 py-4">
                  {/* Timeline line */}
                  <div className="relative flex flex-col items-center">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ring-1 ring-inset ${iconBgCls} ring-black/5`}>
                      {getIcon(log.entity_type)}
                    </div>
                    {i < logs.length - 1 && (
                      <div className="mt-1 w-px flex-1 bg-slate-100" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 pb-4">
                    <p className="text-sm text-slate-800">
                      <span className="font-semibold">{log.profiles?.full_name || 'Usuario'}</span>
                      {' '}{t.actions[actionKey] || log.action}{' '}
                      {t.entities[entityKey] || log.entity_type}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ${badgeCls}`}>
                        {log.action}
                      </span>
                      <span className="text-xs text-slate-400">
                        {format(new Date(log.created_at), 'dd/MM/yyyy · HH:mm', {
                          locale: locale === 'ca' ? ca : es,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
