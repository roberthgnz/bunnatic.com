'use client'

import { useRef, useState, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Lock,
  MapPin,
  MessageCircle,
  Search,
  Sparkles,
  Star,
} from 'lucide-react'

const sectors = [
  { name: 'Restaurantes', slug: 'restaurantes' },
  { name: 'Peluquerías', slug: 'peluquerias' },
  { name: 'Clínicas dentales', slug: 'dentistas' },
  { name: 'Estética y bienestar', slug: 'esteticas' },
  { name: 'Gimnasios', slug: 'gimnasios' },
  { name: 'Talleres', slug: 'talleres' },
  { name: 'Veterinarios', slug: 'veterinarios' },
  { name: 'Fotógrafos', slug: 'fotografos' },
  { name: 'Inmobiliarias', slug: 'inmobiliarias' },
  { name: 'Farmacias', slug: 'farmacias' },
]

type Feature = {
  title: string
  text: string
  idealFor: string
  href: string
  cta: string
  visual: ReactNode
}

const features: Feature[] = [
  {
    title: 'Crea tu web con IA',
    text: 'La IA convierte la información de tu negocio en textos, servicios y un diseño con tu personalidad.',
    idealFor: 'negocios que empiezan · quien no tiene tiempo',
    href: '/caracteristicas/generacion-ia',
    cta: 'Conoce la generación con IA',
    visual: (
      <PhotoVisual src="/images/restaurant.jpg">
        <div className="rounded-2xl bg-white p-4 text-black shadow-xl">
          <p className="flex items-center gap-2 text-xs font-medium">
            <Sparkles className="size-3.5" />
            Preparando tu web
          </p>
          {[
            'Tu historia, bien contada',
            'Tus servicios, organizados',
            'Tu estilo, en cada detalle',
          ].map((item) => (
            <p
              key={item}
              className="mt-3 flex items-center gap-2 border-t border-black/10 pt-3 text-xs text-black/70"
            >
              <Check className="size-3.5" />
              {item}
            </p>
          ))}
        </div>
      </PhotoVisual>
    ),
  },
  {
    title: 'Aparece en Google',
    text: 'SEO local y contenido estructurado para que Google entienda qué haces y dónde estás.',
    idealFor: 'comercios de barrio · servicios a domicilio',
    href: '/caracteristicas/seo-local',
    cta: 'Más visibilidad local',
    visual: (
      <PanelVisual className="bg-[#e9ece4]">
        <div className="w-full rounded-2xl bg-white p-4 text-black shadow-xl">
          <p className="flex items-center gap-2 rounded-full border border-black/10 px-3 py-2 text-xs text-black/60">
            <Search className="size-3.5" />
            peluquería cerca de mí
          </p>
          <div className="mt-4">
            <p className="text-[11px] text-black/50">studioalma.es</p>
            <p className="mt-0.5 text-sm font-medium text-[#1a0dab]">
              Studio Alma · Peluquería en Madrid
            </p>
            <p className="mt-1 flex items-center gap-1 text-[11px] text-black/60">
              <Star className="size-3 fill-current" />
              Abierto ahora · Cortes y color
            </p>
          </div>
          <p className="mt-4 flex items-center gap-1.5 text-[11px] text-black/50">
            <MapPin className="size-3" />
            Tu dirección · Tus servicios · Tu web
          </p>
        </div>
      </PanelVisual>
    ),
  },
  {
    title: 'Edítala cuando quieras',
    text: 'Actualiza un horario, añade un servicio o mejora un texto con ayuda de IA. Tú tienes el control.',
    idealFor: 'menús de temporada · horarios que cambian',
    href: '/caracteristicas/edicion-asistida',
    cta: 'Así de fácil se edita',
    visual: (
      <PanelVisual className="bg-[#f1ece3]">
        <div className="w-full space-y-3 rounded-2xl bg-white p-4 text-black shadow-xl">
          {[
            ['Horario', 'L–V · 9:00 a 20:00'],
            ['Servicio nuevo', 'Menú de mediodía'],
            ['Texto de portada', 'Las cosas buenas, a fuego lento.'],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-[10px] font-medium tracking-wide text-black/45 uppercase">
                {label}
              </p>
              <p className="mt-1 rounded-lg border border-black/10 px-3 py-2 text-xs">
                {value}
              </p>
            </div>
          ))}
          <p className="flex items-center justify-center gap-2 rounded-full bg-black py-2.5 text-xs font-medium text-white">
            <Sparkles className="size-3.5" />
            Mejorar con IA
          </p>
        </div>
      </PanelVisual>
    ),
  },
  {
    title: 'Recibe más contactos',
    text: 'WhatsApp, llamadas y formularios para que el próximo cliente esté a un solo clic.',
    idealFor: 'reservas · citas · presupuestos',
    href: '/caracteristicas/formularios-contacto',
    cta: 'Abre la conversación',
    visual: (
      <PhotoVisual src="/images/salon.jpg">
        <div className="space-y-2 text-xs">
          <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-[#dcf8c6] px-3 py-2 text-black shadow-lg">
            Hola, ¿tenéis hueco el sábado por la mañana?
          </p>
          <p className="w-fit max-w-[85%] rounded-2xl rounded-bl-sm bg-white px-3 py-2 text-black shadow-lg">
            ¡Claro! ¿Te va bien a las 10:30?
          </p>
          <p className="mt-3 flex w-fit items-center gap-2 rounded-full bg-white px-3 py-2 font-medium text-black shadow-lg">
            <MessageCircle className="size-3.5" />
            Escríbenos por WhatsApp
          </p>
        </div>
      </PhotoVisual>
    ),
  },
  {
    title: 'Dominio y hosting incluidos',
    text: 'Alojamiento, conexión de dominio y certificado HTTPS. Todo en un mismo lugar.',
    idealFor: 'quien no quiere líos técnicos',
    href: '/caracteristicas/hosting-dominio',
    cta: 'Conoce qué incluye',
    visual: (
      <PhotoVisual src="/images/clinic.jpg">
        <div className="rounded-2xl bg-white p-4 text-black shadow-xl">
          <p className="flex items-center gap-2 rounded-full bg-black/5 px-3 py-2 text-xs">
            <Lock className="size-3.5" />
            clinicaserena.es
          </p>
          <p className="mt-4 flex items-center justify-between text-xs">
            Certificado HTTPS
            <span className="font-medium">Activo</span>
          </p>
          <p className="mt-2 flex items-center justify-between border-t border-black/10 pt-2 text-xs">
            Dominio conectado
            <Check className="size-3.5" />
          </p>
        </div>
      </PhotoVisual>
    ),
  },
]

function PhotoVisual({ src, children }: { src: string; children: ReactNode }) {
  return (
    <div className="relative flex aspect-[4/5] items-end overflow-hidden rounded-3xl p-6">
      <Image
        src={src}
        alt=""
        fill
        sizes="(max-width: 767px) 82vw, 380px"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative w-full">{children}</div>
    </div>
  )
}

function PanelVisual({
  className,
  children,
}: {
  className: string
  children: ReactNode
}) {
  return (
    <div
      className={`flex aspect-[4/5] items-center overflow-hidden rounded-3xl p-6 ${className}`}
    >
      {children}
    </div>
  )
}

const arrowButton =
  'flex size-12 items-center justify-center rounded-full border border-black/15 transition-colors hover:bg-black hover:text-white disabled:pointer-events-none disabled:opacity-30'

export default function Features() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [edges, setEdges] = useState({ start: true, end: false })

  function updateEdges() {
    const track = trackRef.current
    if (!track) return
    setEdges({
      start: track.scrollLeft <= 4,
      end: track.scrollLeft + track.clientWidth >= track.scrollWidth - 4,
    })
  }

  function scrollByCard(direction: 1 | -1) {
    const track = trackRef.current
    const card = track?.firstElementChild as HTMLElement | null
    if (!track || !card) return
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    track.scrollBy({
      left: direction * (card.offsetWidth + gap),
      behavior: reduceMotion ? 'auto' : 'smooth',
    })
  }

  return (
    <section id="caracteristicas" className="home-section overflow-hidden">
      <div className="home-container">
        <p className="home-eyebrow">Haz crecer tu negocio</p>
        <h2 className="home-title max-w-4xl">
          Te mereces una web que haga todo lo que necesitas.
        </h2>
        <ul className="mt-10 flex flex-wrap gap-2" aria-label="Webs por sector">
          {sectors.map(({ name, slug }) => (
            <li key={slug}>
              <Link href={`/negocio/${slug}`} className="home-pill">
                {name}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-16 flex items-end justify-between gap-6">
          <p className="max-w-md text-lg text-(--home-muted)">
            Diseño, visibilidad y contacto en una herramienta que sí entiendes.
          </p>
          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              aria-label="Anterior"
              aria-controls="features-track"
              disabled={edges.start}
              onClick={() => scrollByCard(-1)}
              className={arrowButton}
            >
              <ArrowLeft className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Siguiente"
              aria-controls="features-track"
              disabled={edges.end}
              onClick={() => scrollByCard(1)}
              className={arrowButton}
            >
              <ArrowRight className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
      <div
        id="features-track"
        ref={trackRef}
        onScroll={updateEdges}
        className="home-carousel mt-8"
      >
        {features.map((feature) => (
          <article key={feature.href} className="group flex flex-col">
            <div aria-hidden="true">{feature.visual}</div>
            <h3 className="mt-6 text-2xl font-medium tracking-[-0.03em]">
              {feature.title}
            </h3>
            <p className="mt-2 text-base leading-relaxed text-(--home-muted)">
              {feature.text}
            </p>
            <p className="mt-3 text-sm text-black/80">
              <span className="font-medium">Ideal para:</span>{' '}
              {feature.idealFor}
            </p>
            <Link
              href={feature.href}
              className="mt-5 inline-flex w-fit items-center gap-2 text-sm font-medium underline decoration-black/25 underline-offset-4 hover:decoration-black"
            >
              {feature.cta}
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
