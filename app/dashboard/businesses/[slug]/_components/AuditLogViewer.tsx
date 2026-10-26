'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  Settings,
  Users,
  Activity,
  Briefcase,
  ClipboardList,
} from 'lucide-react'
import { format } from 'date-fns'
import { ca, es } from 'date-fns/locale'

type BadgeVariant =
  | 'success'
  | 'secondary'
  | 'destructive'
  | 'default'
  | 'outline'

const actionVariants: Record<string, BadgeVariant> = {
  create: 'success',
  update: 'secondary',
  delete: 'destructive',
  publish: 'default',
}

type AuditLogEntry = {
  id: string
  action: string
  entity_type: string
  created_at: string
  profiles?: {
    full_name?: string | null
  } | null
}

export default function AuditLogViewer({
  logs,
  locale,
}: {
  logs: AuditLogEntry[]
  locale: string
}) {
  const t = {
    es: {
      title: 'Historial de cambios',
      description: 'Quién ha cambiado qué en tu negocio, y cuándo.',
      empty: 'Todavía no hay actividad',
      emptyHint: 'Aquí verás cada cambio que se haga en tu negocio.',
      fallbackUser: 'Alguien',
      actions: {
        create: 'ha creado',
        update: 'ha actualizado',
        delete: 'ha eliminado',
        publish: 'ha publicado',
      },
      actionLabels: {
        create: 'Creación',
        update: 'Edición',
        delete: 'Eliminación',
        publish: 'Publicación',
      },
      entities: {
        section: 'una sección',
        service: 'un servicio',
        settings: 'la configuración',
        team: 'un miembro del equipo',
      },
    },
    ca: {
      title: 'Historial de canvis',
      description: 'Qui ha canviat què al teu negoci, i quan.',
      empty: 'Encara no hi ha activitat',
      emptyHint: 'Aquí veuràs cada canvi que es faci al teu negoci.',
      fallbackUser: 'Algú',
      actions: {
        create: 'ha creat',
        update: 'ha actualitzat',
        delete: 'ha eliminat',
        publish: 'ha publicat',
      },
      actionLabels: {
        create: 'Creació',
        update: 'Edició',
        delete: 'Eliminació',
        publish: 'Publicació',
      },
      entities: {
        section: 'una secció',
        service: 'un servei',
        settings: 'la configuració',
        team: "un membre de l'equip",
      },
    },
  }[locale === 'ca' ? 'ca' : 'es']

  const getIcon = (type: string) => {
    const cls = 'size-4'
    switch (type) {
      case 'section':
        return <FileText className={cls} aria-hidden="true" />
      case 'service':
        return <Briefcase className={cls} aria-hidden="true" />
      case 'team':
        return <Users className={cls} aria-hidden="true" />
      case 'settings':
        return <Settings className={cls} aria-hidden="true" />
      default:
        return <Activity className={cls} aria-hidden="true" />
    }
  }

  return (
    <section
      aria-labelledby="audit-log-title"
      className="bg-card ring-border flex h-[600px] flex-col overflow-hidden rounded-xl shadow-[0_1px_2px_rgba(31,42,28,0.04)] ring-1"
    >
      <div className="border-border flex shrink-0 items-start justify-between gap-3 border-b px-5 py-4 sm:px-6">
        <div>
          <h2
            id="audit-log-title"
            className="text-foreground text-base font-semibold tracking-[-0.01em]"
          >
            {t.title}
          </h2>
          <p className="text-muted-foreground mt-0.5 text-sm">
            {t.description}
          </p>
        </div>
        {logs.length > 0 ? (
          <span className="text-muted-foreground text-xs tabular-nums">
            {logs.length}
          </span>
        ) : null}
      </div>

      <ScrollArea className="min-h-0 flex-1">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <span className="bg-secondary text-secondary-foreground ring-border mb-3 flex size-10 items-center justify-center rounded-xl ring-1">
              <ClipboardList className="size-5" aria-hidden="true" />
            </span>
            <p className="text-foreground text-sm font-medium">{t.empty}</p>
            <p className="text-muted-foreground mt-1 max-w-xs text-xs leading-5">
              {t.emptyHint}
            </p>
          </div>
        ) : (
          <ol className="px-5 py-4 sm:px-6">
            {logs.map((log, i) => {
              const actionKey = log.action as keyof typeof t.actions
              const entityKey = log.entity_type as keyof typeof t.entities
              const variant = actionVariants[log.action] ?? 'outline'
              const date = new Date(log.created_at)
              const isLast = i === logs.length - 1

              return (
                <li key={log.id} className="relative flex gap-3.5">
                  {!isLast ? (
                    <span
                      aria-hidden="true"
                      className="bg-border absolute top-9 bottom-0 left-4 w-px -translate-x-1/2"
                    />
                  ) : null}
                  <span className="bg-secondary text-secondary-foreground ring-card relative flex size-8 shrink-0 items-center justify-center rounded-lg ring-4">
                    {getIcon(log.entity_type)}
                  </span>

                  <div
                    className={
                      isLast ? 'min-w-0 flex-1' : 'min-w-0 flex-1 pb-5'
                    }
                  >
                    <p className="text-foreground pt-1.5 text-sm leading-5">
                      <span className="font-medium">
                        {log.profiles?.full_name || t.fallbackUser}
                      </span>{' '}
                      <span className="text-muted-foreground">
                        {t.actions[actionKey] || log.action}
                      </span>{' '}
                      {t.entities[entityKey] || log.entity_type}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      <Badge variant={variant}>
                        {t.actionLabels[actionKey] || log.action}
                      </Badge>
                      <time
                        dateTime={log.created_at}
                        className="text-muted-foreground text-xs tabular-nums"
                      >
                        {format(date, 'dd/MM/yyyy · HH:mm', {
                          locale: locale === 'ca' ? ca : es,
                        })}
                      </time>
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        )}
      </ScrollArea>
    </section>
  )
}
