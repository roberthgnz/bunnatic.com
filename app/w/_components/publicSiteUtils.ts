import type { CSSProperties } from 'react'

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type PublicHour = {
  day_of_week: number
  open_time: string | null
  close_time: string | null
  is_closed: boolean
}

export type HoursRow = {
  day: number
  label: string
  value: string
  closed: boolean
  isToday: boolean
}

export type OpenStatus = {
  open: boolean
  label: string
  detail: string | null
}

/* ------------------------------------------------------------------ */
/* Palette (scoped to the public site, independent from app tokens)    */
/* ------------------------------------------------------------------ */

type Palette = {
  ink: string
  accent: string
  surface: string
  soft: string
}

const PALETTES: Record<'food' | 'beauty' | 'health' | 'neutral', Palette> = {
  food: {
    ink: '#22342a',
    accent: '#2f4a37',
    surface: '#f4f1e9',
    soft: '#e9e4d6',
  },
  beauty: {
    ink: '#45302a',
    accent: '#684a40',
    surface: '#f6eeea',
    soft: '#ecdfd8',
  },
  health: {
    ink: '#1b3a3e',
    accent: '#24565b',
    surface: '#edf3f2',
    soft: '#dce8e6',
  },
  neutral: {
    ink: '#2b2a26',
    accent: '#3c4a3e',
    surface: '#f5f2ec',
    soft: '#e9e4d9',
  },
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

export function getSitePalette(...hints: Array<string | null | undefined>) {
  const text = normalizeText(hints.filter(Boolean).join(' '))
  let palette = PALETTES.neutral

  if (
    /(restaur|bar\b|cafe|cafeter|panader|bakery|pasteler|cocina|food|pizz|taberna|bodega|tapas|brasa|asador|heladeria|meal)/.test(
      text
    )
  ) {
    palette = PALETTES.food
  } else if (
    /(pelu|hair|beauty|estetic|belleza|barber|unas|nail|spa\b|masaj|maquill|cosmet)/.test(
      text
    )
  ) {
    palette = PALETTES.beauty
  } else if (
    /(clinic|dent|medic|fisio|physio|salud|health|doctor|veterin|psicolog|optic|farmac|podolog|nutri)/.test(
      text
    )
  ) {
    palette = PALETTES.health
  }

  return {
    '--site-ink': palette.ink,
    '--site-accent': palette.accent,
    '--site-surface': palette.surface,
    '--site-soft': palette.soft,
    backgroundColor: palette.surface,
    color: palette.ink,
  } as CSSProperties
}

/* ------------------------------------------------------------------ */
/* Text helpers                                                        */
/* ------------------------------------------------------------------ */

const GOOGLE_TYPE_LABELS: Record<string, string> = {
  restaurant: 'Restaurante',
  cafe: 'Cafetería',
  bar: 'Bar',
  bakery: 'Panadería',
  meal_takeaway: 'Comida para llevar',
  hair_care: 'Peluquería',
  beauty_salon: 'Salón de belleza',
  spa: 'Spa',
  dentist: 'Clínica dental',
  doctor: 'Consulta médica',
  physiotherapist: 'Fisioterapia',
  veterinary_care: 'Clínica veterinaria',
  pharmacy: 'Farmacia',
  gym: 'Gimnasio',
  store: 'Tienda',
  clothing_store: 'Tienda de ropa',
  florist: 'Floristería',
  car_repair: 'Taller mecánico',
  lodging: 'Alojamiento',
  real_estate_agency: 'Inmobiliaria',
  lawyer: 'Despacho de abogados',
}

const GENERIC_TYPES = new Set(['point_of_interest', 'establishment', 'premise'])

/** Turns raw categories (sometimes Google place types) into readable Spanish. */
export function formatCategory(category: string | null | undefined) {
  const value = category?.trim()
  if (!value || GENERIC_TYPES.has(value)) return null
  if (GOOGLE_TYPE_LABELS[value]) return GOOGLE_TYPE_LABELS[value]
  if (/^[a-z]+(_[a-z]+)+$/.test(value)) {
    const words = value.replace(/_/g, ' ')
    return words.charAt(0).toUpperCase() + words.slice(1)
  }
  return value
}

/** Best effort city extraction from a Spanish formatted address. */
export function getCity(
  city: string | null | undefined,
  address: string | null | undefined
) {
  if (city?.trim()) return city.trim()
  if (!address) return null
  const match = address.match(/\b\d{5}\s+([^,]+)/)
  return match?.[1]?.trim() || null
}

/** Splits a description into a short hero lead and the remaining text. */
export function splitDescription(description: string | null | undefined) {
  const text = description?.trim()
  if (!text) return { lead: null, rest: null }
  if (text.length <= 220) return { lead: text, rest: null }

  const paragraphs = text.split(/\n\s*\n/)
  const first = paragraphs[0].trim()
  if (first.length <= 260 && paragraphs.length > 1) {
    return { lead: first, rest: paragraphs.slice(1).join('\n\n').trim() }
  }

  const sentence = text.match(/^.{40,240}?[.!?](\s|$)/s)?.[0]?.trim()
  if (sentence) {
    return { lead: sentence, rest: text.slice(sentence.length).trim() || null }
  }
  return { lead: null, rest: text }
}

/* ------------------------------------------------------------------ */
/* Contact helpers                                                     */
/* ------------------------------------------------------------------ */

export function toTelHref(phone: string | null | undefined) {
  if (!phone) return null
  const cleaned = phone.replace(/[^\d+]/g, '').replace(/(?!^)\+/g, '')
  return cleaned.replace(/\D/g, '').length >= 6 ? `tel:${cleaned}` : null
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

export function safeImageUrl(value: unknown) {
  return typeof value === 'string' && isHttpUrl(value.trim())
    ? value.trim()
    : null
}

function toWhatsAppHref(value: string) {
  const trimmed = value.trim()
  if (isHttpUrl(trimmed)) return trimmed
  let digits = trimmed.replace(/\D/g, '')
  if (digits.length === 9) digits = `34${digits}`
  return digits.length >= 10 ? `https://wa.me/${digits}` : null
}

const SOCIAL_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  twitter: 'X (Twitter)',
  x: 'X',
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
  tripadvisor: 'Tripadvisor',
}

export function parseSocialLinks(raw: unknown) {
  const links: Array<{ label: string; href: string }> = []
  let whatsapp: string | null = null

  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
      if (typeof value !== 'string' || !value.trim()) continue
      const normalizedKey = key.toLowerCase()
      if (normalizedKey === 'whatsapp') {
        whatsapp = toWhatsAppHref(value)
        continue
      }
      if (!isHttpUrl(value.trim())) continue
      links.push({
        label:
          SOCIAL_LABELS[normalizedKey] ??
          normalizedKey.charAt(0).toUpperCase() + normalizedKey.slice(1),
        href: value.trim(),
      })
    }
  }

  return { links, whatsapp }
}

export function getMapsHref(
  name: string,
  address: string,
  placeId: string | null | undefined
) {
  const params = new URLSearchParams({
    api: '1',
    query: `${name}, ${address}`,
  })
  if (placeId) params.set('query_place_id', placeId)
  return `https://www.google.com/maps/search/?${params.toString()}`
}

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */

const priceFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
})

const wholePriceFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export function formatPrice(price: number | string | null | undefined) {
  if (price === null || price === undefined || price === '') return null
  const value = Number(price)
  if (Number.isNaN(value) || value < 0) return null
  if (value === 0) return 'Gratis'
  return Number.isInteger(value)
    ? wholePriceFormatter.format(value)
    : priceFormatter.format(value)
}

export function formatDuration(minutes: number | null | undefined) {
  if (!minutes || minutes <= 0) return null
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (!h) return `${m} min`
  return m ? `${h} h ${m} min` : `${h} h`
}

/* ------------------------------------------------------------------ */
/* Opening hours                                                       */
/* ------------------------------------------------------------------ */

const DAY_NAMES = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
]

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
}

const TIME_ZONE = 'Europe/Madrid'

function toMinutes(time: string | null) {
  if (!time) return null
  const [h, m] = time.split(':').map(Number)
  if (Number.isNaN(h) || Number.isNaN(m)) return null
  return h * 60 + m
}

function formatTime(time: string) {
  return time.slice(0, 5)
}

type Interval = { day: number; start: number; end: number; close: string }

function getIntervals(hours: PublicHour[]): Interval[] {
  const intervals: Interval[] = []
  for (const h of hours) {
    if (h.is_closed) continue
    const start = toMinutes(h.open_time)
    const end = toMinutes(h.close_time)
    if (start === null || end === null || !h.close_time) continue
    intervals.push({
      day: h.day_of_week,
      start,
      // Same open/close time means 24 h; earlier close means past midnight.
      end: end <= start ? end + 24 * 60 : end,
      close: formatTime(h.close_time),
    })
  }
  return intervals
}

function getMadridNow(now: Date) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: TIME_ZONE,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now)
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ''
  return {
    day: WEEKDAY_INDEX[get('weekday')] ?? now.getDay(),
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
  }
}

/** Rows ordered Monday → Sunday (Spanish convention), only days with data. */
export function getHoursRows(hours: PublicHour[], now = new Date()) {
  const today = getMadridNow(now).day
  const order = [1, 2, 3, 4, 5, 6, 0]
  const rows: HoursRow[] = []

  for (const day of order) {
    const entries = hours.filter((h) => h.day_of_week === day)
    if (!entries.length) continue
    const open = entries.filter(
      (h) => !h.is_closed && h.open_time && h.close_time
    )
    const closed = !open.length && entries.some((h) => h.is_closed)
    if (!open.length && !closed) continue

    rows.push({
      day,
      label: DAY_NAMES[day],
      closed,
      isToday: day === today,
      value: closed
        ? 'Cerrado'
        : open
            .map((h) =>
              h.open_time === h.close_time
                ? 'Abierto 24 horas'
                : `${formatTime(h.open_time!)} – ${formatTime(h.close_time!)}`
            )
            .join(' · '),
    })
  }

  return rows
}

export function getOpenStatus(
  hours: PublicHour[],
  now = new Date()
): OpenStatus | null {
  const intervals = getIntervals(hours)
  if (!intervals.length) return null

  const { day, minutes } = getMadridNow(now)
  const minuteOfWeek = day * 1440 + minutes
  const WEEK = 7 * 1440

  // Currently open? (checks today and overnight spill-over from yesterday)
  for (const interval of intervals) {
    for (const offset of [0, -WEEK]) {
      const start = interval.day * 1440 + interval.start + offset
      const end = interval.day * 1440 + interval.end + offset
      if (minuteOfWeek >= start && minuteOfWeek < end) {
        const is24h = interval.end - interval.start >= 1440
        return {
          open: true,
          label: 'Abierto ahora',
          detail: is24h ? 'Abierto 24 horas' : `Cierra a las ${interval.close}`,
        }
      }
    }
  }

  // Next opening within the coming week
  let next: { delta: number; interval: Interval } | null = null
  for (const interval of intervals) {
    let start = interval.day * 1440 + interval.start
    if (start <= minuteOfWeek) start += WEEK
    const delta = start - minuteOfWeek
    if (!next || delta < next.delta) next = { delta, interval }
  }

  if (!next) return { open: false, label: 'Cerrado ahora', detail: null }

  const openAt = `${String(Math.floor(next.interval.start / 60)).padStart(2, '0')}:${String(next.interval.start % 60).padStart(2, '0')}`
  const daysAhead = (next.interval.day - day + 7) % 7
  const when =
    daysAhead === 0 && next.delta < 1440
      ? 'hoy'
      : daysAhead === 1
        ? 'mañana'
        : `el ${DAY_NAMES[next.interval.day].toLowerCase()}`

  return {
    open: false,
    label: 'Cerrado ahora',
    detail: `Abre ${when} a las ${openAt}`,
  }
}
