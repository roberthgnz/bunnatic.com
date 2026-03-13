'use client'

import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createCalendarEvent } from '@/lib/supabase/actions'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { FormField } from '@/components/ui/form-field'
import { Plus, Loader2, CalendarDays, Clock } from 'lucide-react'
import { format, set } from 'date-fns'
import { es, ca } from 'date-fns/locale'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const schema = z
  .object({
    title: z.string().min(1, { message: 'title_required' }),
    type: z.string().min(1, { message: 'type_required' }),
    startTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'time_format' }),
    endTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'time_format' }),
  })
  .refine((d) => d.endTime > d.startTime, {
    message: 'time_order',
    path: ['endTime'],
  })

type FormValues = z.infer<typeof schema>

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
  const router = useRouter()
  const currentLocale = locale === 'ca' ? ca : es

  const t = {
    es: {
      title: 'Calendario compartido',
      description: 'Agenda reuniones internas, tareas y publicaciones.',
      addTitle: 'Nuevo evento',
      eventTitle: 'Título del evento',
      eventType: 'Tipo',
      start: 'Inicio',
      end: 'Fin',
      noEvents: 'No hay eventos para este día.',
      noDate: 'Selecciona una fecha para crear eventos.',
      saveError: 'No se pudo guardar el evento.',
      saved: 'Evento guardado',
      add: 'Crear evento',
      errors: {
        title_required: 'El título es obligatorio',
        type_required: 'El tipo es obligatorio',
        time_format: 'Formato inválido',
        time_order: 'El fin debe ser posterior al inicio',
      },
    },
    ca: {
      title: 'Calendari compartit',
      description: 'Agenda reunions internes, tasques i publicacions.',
      addTitle: 'Nou esdeveniment',
      eventTitle: "Títol de l'esdeveniment",
      eventType: 'Tipus',
      start: 'Inici',
      end: 'Fi',
      noEvents: 'No hi ha esdeveniments per aquest dia.',
      noDate: 'Selecciona una data per crear esdeveniments.',
      saveError: "No s'ha pogut desar l'esdeveniment.",
      saved: 'Esdeveniment desat',
      add: 'Crear esdeveniment',
      errors: {
        title_required: 'El títol és obligatori',
        type_required: 'El tipus és obligatori',
        time_format: 'Format invàlid',
        time_order: "El final ha de ser posterior a l'inici",
      },
    },
  }[locale === 'ca' ? 'ca' : 'es']

  const err = (key: string) => t.errors[key as keyof typeof t.errors] ?? key

  const selectedEvents = useMemo(
    () =>
      events.filter(
        (e) =>
          date && new Date(e.start_time).toDateString() === date.toDateString()
      ),
    [date, events]
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      type: 'general',
      startTime: '09:00',
      endTime: '10:00',
    },
  })

  async function onSubmit(values: FormValues) {
    if (!date) {
      toast.error(t.noDate)
      return
    }

    const [sh, sm] = values.startTime.split(':').map(Number)
    const [eh, em] = values.endTime.split(':').map(Number)
    const startDate = set(date, {
      hours: sh,
      minutes: sm,
      seconds: 0,
      milliseconds: 0,
    })
    const endDate = set(date, {
      hours: eh,
      minutes: em,
      seconds: 0,
      milliseconds: 0,
    })

    const res = await createCalendarEvent(
      businessId,
      values.title.trim(),
      startDate,
      endDate,
      values.type.trim().toLowerCase()
    )
    if (res?.error) {
      toast.error(res.error || t.saveError)
      return
    }

    toast.success(t.saved)
    reset()
    router.refresh()
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
      {/* Calendar picker */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-slate-50/60 px-4 py-3">
          <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
            {date
              ? format(date, 'MMMM yyyy', { locale: currentLocale })
              : t.title}
          </p>
        </div>
        <div className="p-3">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            locale={currentLocale}
            className="rounded-md"
          />
        </div>
      </div>

      {/* Right panel */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="border-b border-slate-100 bg-slate-50/60 px-6 py-4">
          <h3 className="text-sm font-semibold text-slate-900">
            {date
              ? format(date, 'EEEE, d MMMM', { locale: currentLocale })
              : t.title}
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">{t.description}</p>
        </div>

        {/* Add event form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border-b border-slate-100 px-6 py-5"
        >
          <p className="mb-3 text-xs font-semibold tracking-wider text-slate-400 uppercase">
            {t.addTitle}
          </p>
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField
                label={t.eventTitle}
                error={errors.title ? err(errors.title.message!) : undefined}
                required
              >
                <Input
                  {...register('title')}
                  aria-invalid={!!errors.title}
                  className="h-9"
                />
              </FormField>
              <FormField
                label={t.eventType}
                error={errors.type ? err(errors.type.message!) : undefined}
                required
              >
                <Input
                  {...register('type')}
                  aria-invalid={!!errors.type}
                  className="h-9"
                />
              </FormField>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField
                label={t.start}
                error={
                  errors.startTime ? err(errors.startTime.message!) : undefined
                }
              >
                <Input
                  {...register('startTime')}
                  type="time"
                  aria-invalid={!!errors.startTime}
                  className="h-9"
                />
              </FormField>
              <FormField
                label={t.end}
                error={
                  errors.endTime ? err(errors.endTime.message!) : undefined
                }
              >
                <Input
                  {...register('endTime')}
                  type="time"
                  aria-invalid={!!errors.endTime}
                  className="h-9"
                />
              </FormField>
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <Button type="submit" disabled={isSubmitting} size="sm">
              {isSubmitting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Plus className="h-3.5 w-3.5" />
              )}
              {t.add}
            </Button>
          </div>
        </form>

        {/* Events list */}
        {selectedEvents.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
              <CalendarDays className="h-5 w-5 text-slate-400" />
            </div>
            <p className="text-sm text-slate-500">{t.noEvents}</p>
          </div>
        ) : (
          <ul className="space-y-2 divide-y divide-slate-100 px-6 pt-4 pb-6">
            {selectedEvents.map((event) => (
              <li
                key={event.id}
                className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/40 p-4"
              >
                <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm">
                  <span className="text-[9px] font-semibold tracking-wide text-slate-400 uppercase">
                    {format(new Date(event.start_time), 'MMM', {
                      locale: currentLocale,
                    })}
                  </span>
                  <span className="text-lg leading-none font-bold">
                    {format(new Date(event.start_time), 'd')}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900">
                    {event.title}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="h-3 w-3" />
                      {format(new Date(event.start_time), 'HH:mm')} –{' '}
                      {format(new Date(event.end_time), 'HH:mm')}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600 ring-1 ring-blue-200">
                      {event.type}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
