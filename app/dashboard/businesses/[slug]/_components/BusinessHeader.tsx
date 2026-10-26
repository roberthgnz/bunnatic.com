'use client'

import Link from 'next/link'
import { ArrowUpRight, Globe2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BusinessMonogram } from '@/components/dashboard/page-header'
import { useBusiness } from './BusinessContext'

export default function BusinessHeader() {
  const { business, businessDomain, sections, setupCompletion } = useBusiness()
  const isPublished = sections.some((section) => section.status === 'published')
  const slug = business.slug

  const hasLiveDomain = businessDomain?.status === 'active'
  const liveHref = hasLiveDomain
    ? `https://${businessDomain.hostname}`
    : `/w/${slug}`
  const displayUrl = hasLiveDomain ? businessDomain.hostname : `/w/${slug}`

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <BusinessMonogram
          name={business.name}
          className="size-14 rounded-xl text-xl"
        />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h1 className="text-foreground truncate text-2xl font-semibold tracking-[-0.035em]">
              {business.name}
            </h1>
            {isPublished ? (
              <span className="bg-success/10 text-success inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium">
                <span className="relative flex size-1.5">
                  <span className="bg-success absolute inset-0 animate-ping rounded-full opacity-60 motion-reduce:animate-none" />
                  <span className="bg-success relative size-1.5 rounded-full" />
                </span>
                Publicada
              </span>
            ) : (
              <span className="bg-warning/10 text-warning inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium">
                <span className="bg-warning size-1.5 rounded-full" />
                Contenido en borrador
              </span>
            )}
          </div>
          <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <a
              href={liveHref}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground flex items-center gap-1.5 truncate transition-colors"
            >
              <Globe2 className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{displayUrl}</span>
            </a>
            {business.category ? <span>{business.category}</span> : null}
            <span className="flex items-center gap-2">
              <span
                className="bg-muted h-1.5 w-16 overflow-hidden rounded-full"
                role="progressbar"
                aria-valuenow={setupCompletion}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Configuración completada"
              >
                <span
                  className="bg-primary block h-full rounded-full"
                  style={{ width: `${setupCompletion}%` }}
                />
              </span>
              <span className="tabular-nums">{setupCompletion}% listo</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button variant="outline" asChild>
          <a href={liveHref} target="_blank" rel="noopener noreferrer">
            Ver web
            <ArrowUpRight aria-hidden="true" />
          </a>
        </Button>
        <Button asChild>
          <Link href={`/dashboard/businesses/${slug}/generation`}>
            <Sparkles aria-hidden="true" />
            Generar con IA
          </Link>
        </Button>
      </div>
    </div>
  )
}
