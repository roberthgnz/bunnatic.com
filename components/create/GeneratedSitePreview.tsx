'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  Check,
  Clock,
  Globe2,
  Leaf,
  MapPin,
  Monitor,
  Phone,
  Smartphone,
  Star,
} from 'lucide-react'
import { siteExamples } from '@/lib/siteExamples'
import { cn } from '@/lib/utils'

export type GeneratedSitePreviewCopy = {
  contactNow: string
  aboutUs: string
  contactInfo: string
  website: string
  schedule: string
  openNow: string
  closedNow: string
  servicesTitle: string
  servicesSubtitle: string
  whatClientsSay: string
}

type PreviewReview = {
  text: string
  rating?: number
  author_name?: string
}

type GeneratedSitePreviewProps = {
  name: string
  host: string
  types?: string[]
  address?: string
  phone?: string
  website?: string
  openNow?: boolean
  city?: string | null
  categoryLabel?: string | null
  heroText: string
  aboutText: string
  services: string[]
  reviews: PreviewReview[]
  copy: GeneratedSitePreviewCopy
}

const FOOD_TYPES = ['restaurant', 'cafe', 'bar', 'bakery', 'meal_takeaway']
const SALON_TYPES = ['hair_care', 'beauty_salon', 'spa']
const CLINIC_TYPES = [
  'dentist',
  'doctor',
  'physiotherapist',
  'hospital',
  'health',
]

const DEFAULT_THEME = {
  image: null as string | null,
  color: '#263d2d',
  surface: '#f4f1e9',
}

/** Picks a palette (and a sample photo when we have one) for the sector. */
function themeForTypes(types: string[] = []) {
  const pick = (slug: string) => {
    const example = siteExamples.find((item) => item.slug === slug)
    return example
      ? {
          image: example.image as string | null,
          color: example.color as string,
          surface: example.surface as string,
        }
      : DEFAULT_THEME
  }
  if (types.some((type) => FOOD_TYPES.includes(type)))
    return pick('restaurante')
  if (types.some((type) => SALON_TYPES.includes(type)))
    return pick('peluqueria')
  if (types.some((type) => CLINIC_TYPES.includes(type))) return pick('clinica')
  return DEFAULT_THEME
}

/**
 * Browser-framed preview of the site generated from the business data,
 * in the spirit of the landing `SitePreview`.
 */
export default function GeneratedSitePreview({
  name,
  host,
  types,
  address,
  phone,
  website,
  openNow,
  city,
  categoryLabel,
  heroText,
  aboutText,
  services,
  reviews,
  copy,
}: GeneratedSitePreviewProps) {
  const [mobile, setMobile] = useState(false)
  const theme = themeForTypes(types)
  const eyebrow = [city, categoryLabel].filter(Boolean).join(' · ')

  return (
    <div
      className={cn(
        'mx-auto w-full overflow-hidden rounded-xl border border-[#d9dfcf] bg-white shadow-[0_22px_55px_-28px_#425a3e40] motion-safe:transition-[max-width] motion-safe:duration-300',
        mobile ? 'max-w-[360px]' : 'max-w-none'
      )}
    >
      <div className="flex h-10 items-center gap-3 border-b border-[#e8e9df] bg-white px-3">
        <div className="flex gap-1" aria-hidden="true">
          <span className="size-1.5 rounded-full bg-[#e0dfd5]" />
          <span className="size-1.5 rounded-full bg-[#e0dfd5]" />
          <span className="size-1.5 rounded-full bg-[#e0dfd5]" />
        </div>
        <span className="flex min-w-0 flex-1 items-center justify-center gap-1.5 text-[10px] text-[#929688]">
          <Globe2 className="size-2.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{host}</span>
        </span>
        <div
          className="flex gap-0.5"
          role="group"
          aria-label="Dispositivo de vista previa"
        >
          <button
            type="button"
            aria-label="Vista de escritorio"
            aria-pressed={!mobile}
            onClick={() => setMobile(false)}
            className={cn(
              'rounded p-1.5',
              !mobile ? 'bg-[#edf1e7] text-[#3c5633]' : 'text-[#9c9f94]'
            )}
          >
            <Monitor className="size-3" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Vista de móvil"
            aria-pressed={mobile}
            onClick={() => setMobile(true)}
            className={cn(
              'rounded p-1.5',
              mobile ? 'bg-[#edf1e7] text-[#3c5633]' : 'text-[#9c9f94]'
            )}
          >
            <Smartphone className="size-3" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        role="region"
        aria-label={`Vista previa de la web de ${name}`}
        tabIndex={0}
        className="@container h-[460px] overflow-y-auto overscroll-contain focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#5a7b3c] sm:h-[560px] lg:h-[640px]"
        style={{ backgroundColor: theme.surface, color: theme.color }}
      >
        {/* Site nav */}
        <div className="flex min-h-14 items-center justify-between gap-3 px-4 py-3 @xl:px-6">
          <span className="flex min-w-0 items-center gap-1.5 font-serif text-base font-semibold tracking-tight @xl:text-lg">
            <Leaf className="size-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{name}</span>
          </span>
          <span
            className="hidden gap-4 text-[10px] @xl:flex"
            aria-hidden="true"
          >
            <span>Nosotros</span>
            {services.length > 0 ? <span>Servicios</span> : null}
            <span>Contacto</span>
          </span>
          <span className="shrink-0 rounded-full border border-current px-3 py-1.5 text-[10px] font-medium">
            {copy.contactNow}
          </span>
        </div>

        {/* Cover */}
        <div
          className="relative flex min-h-[320px] flex-col justify-end overflow-hidden @xl:min-h-[380px]"
          style={theme.image ? undefined : { backgroundColor: '#29452e' }}
        >
          {theme.image ? (
            <>
              <Image
                src={theme.image}
                alt=""
                fill
                sizes="(max-width: 1023px) 92vw, 760px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
              <span className="absolute top-3 right-3 rounded-full bg-black/35 px-2 py-0.5 text-[9px] text-white/85 backdrop-blur-sm">
                Foto de ejemplo
              </span>
            </>
          ) : (
            <Leaf
              className="pointer-events-none absolute -right-12 -bottom-16 size-72 rotate-150 text-[#90ae6d]/15"
              strokeWidth={0.6}
              aria-hidden="true"
            />
          )}
          <div className="relative px-5 pt-14 pb-8 @xl:px-8 @xl:pt-20 @xl:pb-10">
            {eyebrow ? (
              <span className="mb-3 flex items-center gap-1.5 text-[10px] font-medium tracking-[0.16em] text-white/80 uppercase">
                <MapPin className="size-3 shrink-0" aria-hidden="true" />
                {eyebrow}
              </span>
            ) : null}
            <p className="font-serif text-[2.2rem] leading-[1.05] tracking-tight break-words text-white @xl:text-5xl">
              {name}
            </p>
            <p className="mt-3 max-w-md text-xs leading-relaxed text-white/85 @xl:text-sm">
              {heroText}
            </p>
            <span className="mt-6 inline-flex items-center rounded-full bg-white px-4 py-2.5 text-[11px] font-semibold text-[#263d2d]">
              {copy.contactNow}
            </span>
          </div>
        </div>

        {/* About + contact */}
        <div className="grid gap-6 px-5 py-10 @xl:grid-cols-[1.2fr_1fr] @xl:gap-8 @xl:px-8 @xl:py-14">
          <div>
            <h3 className="font-serif text-2xl tracking-tight">
              {copy.aboutUs}
            </h3>
            <p className="mt-3 text-sm leading-6 opacity-80">{aboutText}</p>
          </div>
          <div className="rounded-xl border border-current/10 bg-white/60 p-4 @xl:p-5">
            <h4 className="text-sm font-semibold">{copy.contactInfo}</h4>
            <ul className="mt-3 space-y-2.5 text-xs leading-5 opacity-85 @xl:text-[13px]">
              {address ? (
                <li className="flex items-start gap-2">
                  <MapPin
                    className="mt-0.5 size-3.5 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="min-w-0 break-words">{address}</span>
                </li>
              ) : null}
              {phone ? (
                <li className="flex items-center gap-2">
                  <Phone className="size-3.5 shrink-0" aria-hidden="true" />
                  {phone}
                </li>
              ) : null}
              {website ? (
                <li className="flex items-center gap-2">
                  <Globe2 className="size-3.5 shrink-0" aria-hidden="true" />
                  <a
                    href={website}
                    target="_blank"
                    rel="noreferrer"
                    className="underline decoration-current/30 underline-offset-2"
                  >
                    {copy.website}
                    <span className="sr-only"> (se abre en otra pestaña)</span>
                  </a>
                </li>
              ) : null}
              {typeof openNow === 'boolean' ? (
                <li className="flex items-center gap-2">
                  <Clock className="size-3.5 shrink-0" aria-hidden="true" />
                  {copy.schedule}: {openNow ? copy.openNow : copy.closedNow}
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        {/* Services */}
        {services.length > 0 ? (
          <div className="border-t border-current/10 px-5 py-10 @xl:px-8 @xl:py-12">
            <h3 className="font-serif text-2xl tracking-tight">
              {copy.servicesTitle}
            </h3>
            <p className="mt-1 text-xs opacity-70">{copy.servicesSubtitle}</p>
            <ul className="mt-5 grid gap-2 @md:grid-cols-2">
              {services.map((service) => (
                <li
                  key={service}
                  className="flex items-center gap-2 rounded-lg border border-current/10 bg-white/60 px-3 py-2.5 text-xs font-medium @xl:text-[13px]"
                >
                  <Check className="size-3.5 shrink-0" aria-hidden="true" />
                  <span className="min-w-0 break-words">{service}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* Reviews */}
        {reviews.length > 0 ? (
          <div className="border-t border-current/10 bg-white/50 px-5 py-10 @xl:px-8 @xl:py-12">
            <h3 className="font-serif text-2xl tracking-tight">
              {copy.whatClientsSay}
            </h3>
            <div className="mt-5 grid gap-3 @xl:grid-cols-2">
              {reviews.map((review, index) => (
                <figure
                  key={index}
                  className="rounded-xl border border-current/10 bg-white p-4"
                >
                  {typeof review.rating === 'number' && review.rating > 0 ? (
                    <div
                      className="mb-2 flex gap-0.5"
                      role="img"
                      aria-label={`${review.rating} de 5 estrellas`}
                    >
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="size-3 fill-[#c9a15a] text-[#c9a15a]"
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  ) : null}
                  <blockquote className="line-clamp-4 text-xs leading-5 whitespace-pre-line opacity-85">
                    «{review.text}»
                  </blockquote>
                  {review.author_name ? (
                    <figcaption className="mt-3 text-xs font-semibold">
                      {review.author_name}
                    </figcaption>
                  ) : null}
                </figure>
              ))}
            </div>
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-3 border-t border-current/10 px-5 py-5 text-[10px] opacity-70 @xl:px-8">
          <span className="truncate">© {name}</span>
          <span className="shrink-0">Hecho con Bunnatic</span>
        </div>
      </div>
    </div>
  )
}
