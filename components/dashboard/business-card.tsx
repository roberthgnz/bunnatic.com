import Link from 'next/link'
import { ArrowUpRight, Globe2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { BusinessMonogram } from '@/components/dashboard/page-header'
import { businessRoleLabels, type BusinessRole } from '@/lib/backoffice/policy'

export type BusinessCardData = {
  id: string
  name: string
  slug: string
  category?: string | null
  description?: string | null
  custom_domain?: string | null
  custom_domain_status?: string | null
  updated_at?: string | null
  created_at?: string | null
  role?: BusinessRole
}

export function formatBusinessDate(value: string | null | undefined) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Europe/Madrid',
  }).format(date)
}

function DomainStatus({ business }: { business: BusinessCardData }) {
  if (!business.custom_domain) {
    return <Badge variant="secondary">Subdominio Locavo</Badge>
  }
  if (business.custom_domain_status === 'active') {
    return (
      <Badge variant="success">
        <span className="bg-success size-1.5 rounded-full" />
        Dominio activo
      </Badge>
    )
  }
  if (business.custom_domain_status === 'error') {
    return <Badge variant="destructive">Revisar dominio</Badge>
  }
  return <Badge variant="warning">Dominio pendiente</Badge>
}

export function BusinessCard({
  business,
  platformHost,
  dateLabel = 'Actualizado',
  date,
}: {
  business: BusinessCardData
  platformHost: string
  dateLabel?: string
  date?: string | null
}) {
  const liveHref =
    business.custom_domain && business.custom_domain_status === 'active'
      ? `https://${business.custom_domain}`
      : `/w/${business.slug}`
  const displayUrl = business.custom_domain
    ? business.custom_domain
    : `${platformHost}/w/${business.slug}`

  return (
    <article className="group bg-card ring-border hover:ring-ring/40 relative flex flex-col rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 transition-[box-shadow] hover:shadow-[0_10px_30px_-16px_rgba(0,0,0,0.35)]">
      <div className="flex items-start gap-3.5">
        <BusinessMonogram name={business.name} className="size-11 text-base" />
        <div className="min-w-0 flex-1">
          <h3 className="text-foreground truncate text-[15px] font-semibold tracking-[-0.01em]">
            <Link
              href={`/dashboard/businesses/${business.slug}`}
              className="focus-visible:ring-ring rounded-sm after:absolute after:inset-0 after:rounded-xl focus-visible:ring-2 focus-visible:outline-none"
            >
              {business.name}
            </Link>
          </h3>
          <p className="text-muted-foreground mt-0.5 flex items-center gap-1.5 truncate text-xs">
            <Globe2 className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{displayUrl}</span>
          </p>
        </div>
        <a
          href={liveHref}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-ring relative z-10 -mt-1 -mr-1 flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors focus-visible:ring-2 focus-visible:outline-none"
          aria-label={`Ver la web de ${business.name}`}
        >
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </a>
      </div>

      <p className="text-muted-foreground mt-4 line-clamp-2 min-h-10 text-sm leading-5">
        {business.description ||
          'Añade una descripción para presentar tu negocio.'}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        <DomainStatus business={business} />
        {business.role && business.role !== 'owner' ? (
          <Badge variant="outline">
            Compartido · {businessRoleLabels[business.role]}
          </Badge>
        ) : null}
        {business.category ? (
          <Badge variant="outline">{business.category}</Badge>
        ) : null}
      </div>

      <div className="border-border mt-5 flex items-center justify-between border-t pt-3.5">
        <p className="text-muted-foreground text-xs">
          {dateLabel} {formatBusinessDate(date ?? business.updated_at)}
        </p>
        <span className="text-primary flex items-center gap-1 text-xs font-medium">
          Abrir panel
          <ArrowUpRight
            className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </span>
      </div>
    </article>
  )
}
