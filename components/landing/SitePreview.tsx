import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Leaf, MapPin } from 'lucide-react'
import type { SiteExample } from '@/lib/siteExamples'

type SitePreviewProps = {
  example: SiteExample
  compact?: boolean
  mobile?: boolean
  priority?: boolean
}

export default function SitePreview({
  example,
  compact = false,
  mobile = false,
  priority = false,
}: SitePreviewProps) {
  return (
    <div
      className={`site-preview ${compact ? 'site-preview-compact' : ''} ${mobile ? 'site-preview-mobile' : ''}`}
      style={{ backgroundColor: example.surface, color: example.color }}
    >
      <div className="site-preview-nav">
        <span className="flex items-center gap-1.5 font-serif text-lg font-semibold tracking-tight">
          <Leaf className="size-4" aria-hidden="true" />
          {example.name}
        </span>
        <span className="site-preview-menu">
          Nosotros <span>Servicios</span> Contacto
        </span>
        <span className="rounded-full border border-current px-3 py-1.5 text-[9px] font-medium">
          {example.action}
        </span>
      </div>
      <div className="site-preview-cover">
        <Image
          src={example.image}
          alt={example.imageAlt}
          fill
          sizes={
            compact
              ? '(max-width: 767px) 90vw, 380px'
              : '(max-width: 1023px) 90vw, 640px'
          }
          priority={priority}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />
        <div className="site-preview-copy">
          <span className="mb-3 flex items-center gap-1.5 text-[9px] font-medium tracking-[0.18em] text-white/80 uppercase">
            <MapPin className="size-3" aria-hidden="true" />
            {example.location} · {example.category}
          </span>
          <p className="font-serif text-[2.75rem] leading-[1.04] tracking-tight whitespace-pre-line text-white">
            {example.tagline}
          </p>
          {!compact ? (
            <p className="mt-3 max-w-72 text-[11px] leading-relaxed text-white/85">
              {example.description}
            </p>
          ) : null}
          <Link
            href={`/ejemplos/${example.slug}`}
            className="mt-5 inline-flex items-center gap-5 rounded-full bg-white px-4 py-2.5 text-[10px] font-semibold transition-colors hover:bg-lime-100"
            aria-label={`Explorar la web de ejemplo de ${example.name}`}
          >
            Descubre {example.name}
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
      <div className="site-preview-bottom">
        <span className="font-serif text-lg">
          Hecho con calma.
          <br />
          Pensado para ti.
        </span>
        <p className="max-w-52 text-[10px] leading-relaxed opacity-75">
          {example.services[0].text}
        </p>
        <Leaf className="size-7 opacity-40" aria-hidden="true" />
      </div>
    </div>
  )
}
