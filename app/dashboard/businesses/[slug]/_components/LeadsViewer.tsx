'use client'

import { format, isThisYear, isToday, isYesterday } from 'date-fns'
import { es } from 'date-fns/locale'
import { Mail, MessageSquare, Phone, Reply } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/dashboard/page-header'

type Lead = {
  id: string
  name: string
  email: string
  phone?: string | null
  message: string
  created_at: string
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  const first = parts[0][0] ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? '') : ''
  return (first + last).toUpperCase()
}

function formatReceived(date: Date) {
  if (isToday(date)) return `Hoy, ${format(date, 'HH:mm')}`
  if (isYesterday(date)) return `Ayer, ${format(date, 'HH:mm')}`
  if (isThisYear(date)) return format(date, "d 'de' MMM", { locale: es })
  return format(date, "d 'de' MMM yyyy", { locale: es })
}

export default function LeadsViewer({ leads }: { leads: Lead[] }) {
  const t = {
    title: 'Mensajes recibidos',
    description: 'Personas que te han escrito desde el formulario de tu web.',
    noLeads: 'Todavía no has recibido mensajes',
    noLeadsHint:
      'Cuando alguien rellene el formulario de contacto de tu web, lo verás aquí.',
    received: 'Recibido el',
    reply: 'Responder',
    new: 'Nuevo',
  }

  const count = leads.length

  return (
    <div className="space-y-5 pb-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-foreground text-base font-semibold tracking-[-0.01em]">
            {t.title}
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">{t.description}</p>
        </div>
        {count > 0 ? (
          <p className="text-muted-foreground text-sm">
            <span className="text-foreground font-semibold tabular-nums">
              {count}
            </span>{' '}
            {count === 1 ? 'mensaje' : 'mensajes'}
          </p>
        ) : null}
      </div>

      {count === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title={t.noLeads}
          description={t.noLeadsHint}
        />
      ) : (
        <ul
          aria-label={t.title}
          className="bg-card ring-border divide-border divide-y overflow-hidden rounded-xl shadow-[0_1px_2px_rgba(31,42,28,0.04)] ring-1"
        >
          {leads.map((lead) => {
            const date = new Date(lead.created_at)
            const isNew = isToday(date) || isYesterday(date)
            const fullDate = format(date, "EEEE d 'de' MMMM yyyy, HH:mm", {
              locale: es,
            })

            return (
              <li key={lead.id}>
                <article
                  aria-labelledby={`lead-${lead.id}-name`}
                  className="hover:bg-muted/50 flex gap-4 px-5 py-4 transition-colors"
                >
                  <span
                    aria-hidden="true"
                    className="bg-secondary text-secondary-foreground ring-border flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ring-1"
                  >
                    {initials(lead.name)}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <h3
                          id={`lead-${lead.id}-name`}
                          className="text-foreground truncate text-sm font-semibold"
                        >
                          {lead.name}
                        </h3>
                        {isNew ? (
                          <Badge variant="success" className="h-5 px-1.5">
                            <span
                              className="bg-success size-1.5 rounded-full"
                              aria-hidden="true"
                            />
                            {t.new}
                          </Badge>
                        ) : null}
                      </div>
                      <time
                        dateTime={lead.created_at}
                        title={fullDate}
                        suppressHydrationWarning
                        className="text-muted-foreground shrink-0 text-xs tabular-nums"
                      >
                        <span className="sr-only">{t.received} </span>
                        {formatReceived(date)}
                      </time>
                    </div>

                    <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                      <a
                        href={`mailto:${lead.email}`}
                        className="hover:text-foreground focus-visible:ring-ring inline-flex min-w-0 items-center gap-1.5 rounded-sm underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:outline-none"
                      >
                        <Mail className="size-3.5 shrink-0" aria-hidden="true" />
                        <span className="truncate">{lead.email}</span>
                      </a>
                      {lead.phone ? (
                        <a
                          href={`tel:${lead.phone.replace(/\s+/g, '')}`}
                          className="hover:text-foreground focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-sm tabular-nums underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:outline-none"
                        >
                          <Phone
                            className="size-3.5 shrink-0"
                            aria-hidden="true"
                          />
                          {lead.phone}
                        </a>
                      ) : null}
                    </div>

                    <p className="text-foreground/90 mt-2.5 text-sm leading-6 break-words whitespace-pre-line">
                      {lead.message}
                    </p>

                    <div className="mt-3">
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={`mailto:${lead.email}?subject=${encodeURIComponent('Re: tu mensaje')}`}
                          aria-label={`${t.reply} a ${lead.name}`}
                        >
                          <Reply aria-hidden="true" />
                          {t.reply}
                        </a>
                      </Button>
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
