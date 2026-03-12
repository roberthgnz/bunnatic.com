'use client'

import { useMemo, useState } from 'react'
import { createCalendarEvent } from '@/lib/supabase/actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Plus, Loader2 } from 'lucide-react'
import { format, set } from 'date-fns'
import { es, ca } from 'date-fns/locale'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function CalendarManager({
  businessId,
  events,
  locale,
}: {
  businessId: string
  events: any[]
  locale: string
}) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [title, setTitle] = useState('')
  const [type, setType] = useState('general')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const currentLocale = locale === 'ca' ? ca : es

  const t = {
    es: {
      title: 'Calendario compartido',
      description: 'Agenda reuniones internas, tareas y publicaciones.',
      add: 'Añadir evento',
      eventTitle: 'Título',
      eventType: 'Tipo',
      start: 'Inicio',
      end: 'Fin',
      noEvents: 'No hay eventos para este día.',
      noDate: 'Selecciona una fecha para crear eventos.',
      saveError: 'No se pudo guardar el evento.',
      saved: 'Evento guardado',
      invalidTime: 'La hora de fin debe ser posterior al inicio.',
    },
    ca: {
      title: 'Calendari compartit',
      description: 'Agenda reunions internes, tasques i publicacions.',
      add: 'Afegir esdeveniment',
      eventTitle: 'Títol',
      eventType: 'Tipus',
      start: 'Inici',
      end: 'Fi',
      noEvents: 'No hi ha esdeveniments per aquest dia.',
      noDate: 'Selecciona una data per crear esdeveniments.',
      saveError: "No s'ha pogut desar l'esdeveniment.",
      saved: 'Esdeveniment desat',
      invalidTime: "L'hora de finalització ha de ser posterior a la d'inici.",
    },
  }[locale === 'ca' ? 'ca' : 'es']

  const selectedEvents = useMemo(
    () =>
      events.filter((event) => date && new Date(event.start_time).toDateString() === date.toDateString()),
    [date, events]
  )

  async function handleCreateEvent(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!date) {
      toast.error(t.noDate)
      return
    }

    const [startHour, startMinute] = startTime.split(':').map(Number)
    const [endHour, endMinute] = endTime.split(':').map(Number)

    const startDate = set(date, { hours: startHour, minutes: startMinute, seconds: 0, milliseconds: 0 })
    const endDate = set(date, { hours: endHour, minutes: endMinute, seconds: 0, milliseconds: 0 })

    if (endDate <= startDate) {
      toast.error(t.invalidTime)
      return
    }

    setSaving(true)
    const res = await createCalendarEvent(businessId, title.trim(), startDate, endDate, type.trim().toLowerCase())
    if (res?.error) {
      toast.error(res.error || t.saveError)
      setSaving(false)
      return
    }

    toast.success(t.saved)
    setTitle('')
    setType('general')
    setStartTime('09:00')
    setEndTime('10:00')
    setSaving(false)
    router.refresh()
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
      <Card>
        <CardContent className="p-4">
          <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" locale={currentLocale} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {date ? format(date, 'EEEE, d MMMM', { locale: currentLocale }) : t.title}
          </CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <form onSubmit={handleCreateEvent} className="grid gap-3 rounded-md border bg-slate-50/60 p-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t.eventTitle}
                required
              />
            </div>
            <Input value={type} onChange={(e) => setType(e.target.value)} placeholder={t.eventType} required />
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="mb-1 block text-xs text-slate-500">{t.start}</label>
                <Input value={startTime} onChange={(e) => setStartTime(e.target.value)} type="time" required />
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-xs text-slate-500">{t.end}</label>
                <Input value={endTime} onChange={(e) => setEndTime(e.target.value)} type="time" required />
              </div>
            </div>
            <Button type="submit" disabled={saving} className="md:col-span-2 md:justify-self-end">
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.add}
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  {t.add}
                </>
              )}
            </Button>
          </form>

          {selectedEvents.length === 0 ? (
            <div className="flex min-h-32 items-center justify-center rounded-md border border-dashed text-sm text-slate-500">
              {t.noEvents}
            </div>
          ) : (
            <div className="space-y-3">
              {selectedEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-3 rounded-md border border-slate-200 p-4">
                  <div className="flex h-12 w-12 flex-col items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-700">
                    <span className="text-[10px] uppercase leading-none">
                      {format(new Date(event.start_time), 'MMM', { locale: currentLocale })}
                    </span>
                    <span className="text-lg font-semibold leading-none">
                      {format(new Date(event.start_time), 'd')}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-900">{event.title}</p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                      <Badge variant="outline">
                        {format(new Date(event.start_time), 'HH:mm')} - {format(new Date(event.end_time), 'HH:mm')}
                      </Badge>
                      <Badge variant="secondary">{event.type}</Badge>
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
