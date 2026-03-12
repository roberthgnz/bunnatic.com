'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FileText, Settings, Users, Activity } from 'lucide-react'
import { format } from 'date-fns'
import { ca, es } from 'date-fns/locale'

export default function AuditLogViewer({ 
  logs,
  locale 
}: { 
  logs: any[],
  locale: string 
}) {
  const t = {
    es: {
      title: 'Auditoría de Cambios',
      description: 'Registro de actividad y cambios en el negocio.',
      empty: 'No hay actividad registrada.',
      actions: {
        create: 'Creó',
        update: 'Actualizó',
        delete: 'Eliminó',
        publish: 'Publicó',
      },
      entities: {
        section: 'una sección',
        service: 'un servicio',
        settings: 'la configuración',
        team: 'un miembro del equipo',
      }
    },
    ca: {
      title: 'Auditoria de Canvis',
      description: 'Registre d\'activitat i canvis en el negoci.',
      empty: 'No hi ha activitat registrada.',
      actions: {
        create: 'Va crear',
        update: 'Va actualitzar',
        delete: 'Va eliminar',
        publish: 'Va publicar',
      },
      entities: {
        section: 'una secció',
        service: 'un servei',
        settings: 'la configuració',
        team: 'un membre de l\'equip',
      }
    },
  }[locale === 'ca' ? 'ca' : 'es']

  const getIcon = (type: string) => {
    switch (type) {
      case 'section': return <FileText className="h-4 w-4" />
      case 'service': return <Activity className="h-4 w-4" />
      case 'team': return <Users className="h-4 w-4" />
      case 'settings': return <Settings className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full px-6">
          {logs.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              {t.empty}
            </div>
          ) : (
            <div className="space-y-6 pb-6">
              {logs.map((log) => (
                <div key={log.id} className="flex gap-4">
                  <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full border bg-muted">
                    {getIcon(log.entity_type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      <span className="font-bold">{log.profiles?.full_name || 'Usuario'}</span>
                      {' '}
                      {t.actions[log.action as keyof typeof t.actions] || log.action}
                      {' '}
                      {t.entities[log.entity_type as keyof typeof t.entities] || log.entity_type}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="secondary" className="font-normal text-[10px]">
                        {log.action.toUpperCase()}
                      </Badge>
                      <span>
                        {format(new Date(log.created_at), 'dd/MM/yyyy HH:mm', {
                          locale: locale === 'ca' ? ca : es,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
