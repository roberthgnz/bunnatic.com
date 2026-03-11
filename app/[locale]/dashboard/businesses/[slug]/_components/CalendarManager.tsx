'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'
import { Plus } from 'lucide-react'
import { format } from 'date-fns'
import { es, ca } from 'date-fns/locale'

export default function CalendarManager({ 
  events,
  locale 
}: { 
  events: any[],
  locale: string 
}) {
  const [date, setDate] = useState<Date | undefined>(new Date())

  const t = {
    es: {
      title: 'Calendario Compartido',
      description: 'Gestiona eventos, reuniones y fechas clave con tu equipo.',
      add: 'Añadir evento',
      today: 'Hoy',
      noEvents: 'No hay eventos para este día.',
    },
    ca: {
      title: 'Calendari Compartit',
      description: 'Gestiona esdeveniments, reunions i dates clau amb el teu equip.',
      add: 'Afegir esdeveniment',
      today: 'Avui',
      noEvents: 'No hi ha esdeveniments per aquest dia.',
    },
  }[locale === 'ca' ? 'ca' : 'es']

  const selectedEvents = events.filter(e => 
    date && new Date(e.start_time).toDateString() === date.toDateString()
  )

  return (
    <div className="grid md:grid-cols-[300px_1fr] gap-6">
      <Card>
        <CardContent className="p-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border shadow-sm"
            locale={locale === 'ca' ? ca : es}
          />
        </CardContent>
      </Card>

      <Card className="flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>{date ? format(date, 'EEEE, d MMMM', { locale: locale === 'ca' ? ca : es }) : t.title}</CardTitle>
            <CardDescription>{t.description}</CardDescription>
          </div>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            {t.add}
          </Button>
        </CardHeader>
        <CardContent className="flex-1">
          {selectedEvents.length === 0 ? (
            <div className="flex h-40 items-center justify-center text-sm text-muted-foreground border-dashed border-2 rounded-lg m-4">
              {t.noEvents}
            </div>
          ) : (
            <div className="space-y-4 pt-4">
              {selectedEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col items-center justify-center w-14 h-14 bg-emerald-100 rounded-lg text-emerald-700">
                    <span className="text-xs font-bold uppercase">{format(new Date(event.start_time), 'MMM')}</span>
                    <span className="text-xl font-bold">{format(new Date(event.start_time), 'd')}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">{event.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs font-normal">
                        {format(new Date(event.start_time), 'HH:mm')} - {format(new Date(event.end_time), 'HH:mm')}
                      </Badge>
                      <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200">
                        {event.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
