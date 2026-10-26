'use client'

import { useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createCalendarEvent } from '@/lib/backoffice/actions/calendar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, CalendarDays, Loader2, Plus } from 'lucide-react'
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

type CalendarEvent = {
  id: string
  title: string
  type: string
  start_time: string
  end_time: string
}

const surface =
  'bg-card ring-border rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1'

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string
  label: string
  required?: boolean
  error?: string
  children: ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-foreground gap-0.5 text-[13px]">
        {label}
        {required ? (
          <span className="text-destructive" aria-hidden="true">
            *
          </span>
        ) : null}
      </Label>
      {children}
      {error ? (
        <p
          id={`${id}-error`}
          className="text-destructive flex items-center gap-1 text-xs font-medium"
        >
          <AlertCircle className="size-3 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  )
}

export default function CalendarManager({
  businessId,
  readOnly = false,
  events,
  locale,
}: {
  businessId: string
  readOnly?: boolean
  events: CalendarEvent[]
  locale: string
}) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const router = useRouter()
  const currentLocale = locale === 'ca' ? ca : es

  const t = {
    es: {
      title: 'Calendario',
      description:
        'Organiza reuniones internas, tareas y publicaciones de tu negocio.',
      addTitle: 'Nuevo evento',
      eventTitle: 'Título',
      eventTitlePlaceholder: 'Ej. Sesión de fotos del local',
      eventType: 'Tipo',
      typeSuggestions: ['general', 'reunión', 'tarea', 'publicación'],
      start: 'Inicio',
      end: 'Fin',
      noEvents: 'Nada programado este día',
      noEventsHint: 'Usa el formulario de abajo para añadir un evento.',
      noDate: 'Selecciona una fecha para crear eventos.',
      pickDate: 'Selecciona un día en el calendario',
      saveError: 'No se pudo guardar el evento.',
      saved: 'Evento guardado',
      add: 'Crear evento',
      eventsCount: (n: number) => (n === 1 ? '1 evento' : `${n} eventos`),
      errors: {
        title_required: 'El título es obligatorio',
        type_required: 'El tipo es obligatorio',
        time_format: 'Formato no válido',
        time_order: 'El fin debe ser posterior al inicio',
      },
    },
    ca: {
      title: 'Calendari',
      description:
        'Organitza reunions internes, tasques i publicacions del teu negoci.',
      addTitle: 'Nou esdeveniment',
      eventTitle: 'Títol',
      eventTitlePlaceholder: 'Ex. Sessió de fotos del local',
      eventType: 'Tipus',
      typeSuggestions: ['general', 'reunió', 'tasca', 'publicació'],
      start: 'Inici',
      end: 'Fi',
      noEvents: 'Res programat aquest dia',
      noEventsHint: 'Fes servir el formulari de sota per afegir-ne un.',
      noDate: 'Selecciona una data per crear esdeveniments.',
      pickDate: 'Selecciona un dia al calendari',
      saveError: "No s'ha pogut desar l'esdeveniment.",
      saved: 'Esdeveniment desat',
      add: 'Crear esdeveniment',
      eventsCount: (n: number) =>
        n === 1 ? '1 esdeveniment' : `${n} esdeveniments`,
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

  const eventDates = useMemo(
    () => events.map((e) => new Date(e.start_time)),
    [events]
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

  const dayTitle = date
    ? format(date, "EEEE, d 'de' MMMM", { locale: currentLocale })
    : t.pickDate

  return (
    <div className="space-y-5 pb-10">
      <div>
        <h2 className="text-foreground text-base font-semibold tracking-[-0.01em]">
          {t.title}
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">{t.description}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-start">
        {/* Calendar picker */}
        <div className={`${surface} flex justify-center p-3`}>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            locale={currentLocale}
            className="bg-transparent"
            style={{ '--cell-size': '2.25rem' } as CSSProperties}
            modifiers={{ hasEvents: eventDates }}
            modifiersClassNames={{
              hasEvents:
                'after:bg-primary data-[selected=true]:after:bg-primary-foreground after:pointer-events-none after:absolute after:bottom-1 after:left-1/2 after:z-20 after:size-1 after:-translate-x-1/2 after:rounded-full',
            }}
          />
        </div>

        {/* Day panel */}
        <section
          aria-labelledby="calendar-day-title"
          className={`${surface} min-w-0 overflow-hidden`}
        >
          <div className="border-border flex items-center justify-between gap-3 border-b px-5 py-4">
            <div className="min-w-0">
              <h3
                id="calendar-day-title"
                className="text-foreground text-base font-semibold tracking-[-0.01em] first-letter:uppercase"
              >
                {dayTitle}
              </h3>
              {date ? (
                <p className="text-muted-foreground mt-0.5 text-xs tabular-nums">
                  {t.eventsCount(selectedEvents.length)}
                </p>
              ) : null}
            </div>
          </div>

          {/* Events list */}
          {selectedEvents.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-10 text-center">
              <span className="bg-secondary text-secondary-foreground ring-border mb-3 flex size-10 items-center justify-center rounded-xl ring-1">
                <CalendarDays className="size-5" aria-hidden="true" />
              </span>
              <p className="text-foreground text-sm font-medium">
                {t.noEvents}
              </p>
              <p className="text-muted-foreground mt-1 text-sm">
                {t.noEventsHint}
              </p>
            </div>
          ) : (
            <ul className="divide-border divide-y">
              {selectedEvents.map((event) => {
                const start = new Date(event.start_time)
                const end = new Date(event.end_time)
                return (
                  <li
                    key={event.id}
                    className="hover:bg-muted/50 flex items-center gap-4 px-5 py-3.5 transition-colors"
                  >
                    <div className="text-foreground w-14 shrink-0 text-sm font-semibold tabular-nums">
                      <time dateTime={event.start_time}>
                        {format(start, 'HH:mm')}
                      </time>
                      <span className="text-muted-foreground block text-xs font-normal">
                        <span className="sr-only">hasta </span>
                        <time dateTime={event.end_time}>
                          {format(end, 'HH:mm')}
                        </time>
                      </span>
                    </div>
                    <span
                      className="bg-primary/70 h-9 w-0.5 shrink-0 rounded-full"
                      aria-hidden="true"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-foreground truncate text-sm font-medium">
                        {event.title}
                      </p>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {event.type}
                    </Badge>
                  </li>
                )
              })}
            </ul>
          )}

          {/* Add event form */}
          <fieldset disabled={readOnly}>
            {readOnly ? (
              <p className="text-muted-foreground px-6 pt-4 text-sm">
                Tu acceso al calendario es de solo lectura.
              </p>
            ) : null}
            <form
              onSubmit={handleSubmit(onSubmit)}
              aria-labelledby="calendar-add-title"
              className="border-border bg-muted/30 border-t px-5 py-5"
            >
              <h4
                id="calendar-add-title"
                className="text-muted-foreground mb-4 text-xs font-medium"
              >
                {t.addTitle}
              </h4>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_160px_112px_112px]">
                <Field
                  id="event-title"
                  label={t.eventTitle}
                  required
                  error={errors.title ? err(errors.title.message!) : undefined}
                >
                  <Input
                    id="event-title"
                    {...register('title')}
                    placeholder={t.eventTitlePlaceholder}
                    autoComplete="off"
                    aria-required="true"
                    aria-invalid={!!errors.title}
                    aria-describedby={
                      errors.title ? 'event-title-error' : undefined
                    }
                  />
                </Field>
                <Field
                  id="event-type"
                  label={t.eventType}
                  required
                  error={errors.type ? err(errors.type.message!) : undefined}
                >
                  <Input
                    id="event-type"
                    {...register('type')}
                    list="event-type-suggestions"
                    autoComplete="off"
                    aria-required="true"
                    aria-invalid={!!errors.type}
                    aria-describedby={
                      errors.type ? 'event-type-error' : undefined
                    }
                  />
                  <datalist id="event-type-suggestions">
                    {t.typeSuggestions.map((option) => (
                      <option key={option} value={option} />
                    ))}
                  </datalist>
                </Field>
                <Field
                  id="event-start"
                  label={t.start}
                  error={
                    errors.startTime
                      ? err(errors.startTime.message!)
                      : undefined
                  }
                >
                  <Input
                    id="event-start"
                    {...register('startTime')}
                    type="time"
                    aria-invalid={!!errors.startTime}
                    aria-describedby={
                      errors.startTime ? 'event-start-error' : undefined
                    }
                    className="tabular-nums"
                  />
                </Field>
                <Field
                  id="event-end"
                  label={t.end}
                  error={
                    errors.endTime ? err(errors.endTime.message!) : undefined
                  }
                >
                  <Input
                    id="event-end"
                    {...register('endTime')}
                    type="time"
                    aria-invalid={!!errors.endTime}
                    aria-describedby={
                      errors.endTime ? 'event-end-error' : undefined
                    }
                    className="tabular-nums"
                  />
                </Field>
              </div>
              <div className="mt-4 flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" aria-hidden="true" />
                  ) : (
                    <Plus aria-hidden="true" />
                  )}
                  {t.add}
                </Button>
              </div>
            </form>
          </fieldset>
        </section>
      </div>
    </div>
  )
}
