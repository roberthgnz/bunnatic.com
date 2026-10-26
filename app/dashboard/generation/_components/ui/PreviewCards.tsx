import {
  ArrowUpRight,
  Briefcase,
  Clock,
  Globe,
  MapPin,
  Navigation,
  PhoneCall,
  Star,
  type LucideIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { BusinessMonogram } from '@/components/dashboard/page-header'
import type { BusinessSourcePreview } from '@/lib/businessSourceGeneration'

type Props = {
  preview: BusinessSourcePreview
  labels: {
    blockProfile: string
    blockServices: string
    blockHours: string
    ratingLabel: string
    reviewsLabel: string
    priceLabel: string
    statusLabel: string
    mapsLabel: string
    noServices: string
    noHours: string
    addressLabel?: string
    phoneLabel?: string
    websiteLabel?: string
    closedLabel?: string
    dayNames?: readonly string[]
    statusOperational?: string
    statusClosedTemporarily?: string
    statusClosedPermanently?: string
  }
}

const surface =
  'bg-card ring-border rounded-xl shadow-[0_1px_2px_rgba(31,42,28,0.04)] ring-1'

function SectionTitle({
  icon: Icon,
  children,
  count,
}: {
  icon: LucideIcon
  children: ReactNode
  count?: number
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="bg-secondary text-secondary-foreground flex size-8 items-center justify-center rounded-lg">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <h3 className="text-foreground text-sm font-semibold">{children}</h3>
      {typeof count === 'number' && count > 0 ? (
        <Badge variant="secondary" className="ml-auto tabular-nums">
          {count}
        </Badge>
      ) : null}
    </div>
  )
}

function getStatusLabel(
  status: string,
  labels: Props['labels']
): {
  text: string
  variant: 'success' | 'warning' | 'destructive' | 'outline'
} {
  switch (status) {
    case 'OPERATIONAL':
      return { text: labels.statusOperational ?? status, variant: 'success' }
    case 'CLOSED_TEMPORARILY':
      return {
        text: labels.statusClosedTemporarily ?? status,
        variant: 'warning',
      }
    case 'CLOSED_PERMANENTLY':
      return {
        text: labels.statusClosedPermanently ?? status,
        variant: 'destructive',
      }
    default:
      return { text: status, variant: 'outline' }
  }
}

export function PreviewCards({ preview, labels }: Props) {
  const { profile } = preview
  const status = profile.businessStatus
    ? getStatusLabel(profile.businessStatus, labels)
    : null

  const contactRows: Array<{
    key: string
    icon: LucideIcon
    label: string
    value: string
  }> = [
    {
      key: 'address',
      icon: Navigation,
      label: labels.addressLabel ?? '',
      value: profile.address,
    },
    {
      key: 'phone',
      icon: PhoneCall,
      label: labels.phoneLabel ?? '',
      value: profile.phone,
    },
    {
      key: 'website',
      icon: Globe,
      label: labels.websiteLabel ?? '',
      value: profile.website,
    },
  ].filter((row) => row.value)

  return (
    <div className="space-y-4">
      {/* Profile */}
      <section
        aria-label={labels.blockProfile}
        className={`${surface} p-5 sm:p-6`}
      >
        <div className="flex items-start gap-4">
          <BusinessMonogram name={profile.name} className="size-12 text-lg" />
          <div className="min-w-0 flex-1">
            <h3 className="text-foreground truncate text-base font-semibold tracking-[-0.01em]">
              {profile.name || '—'}
            </h3>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              {profile.category ? (
                <Badge variant="outline">{profile.category}</Badge>
              ) : null}
              {status ? (
                <Badge variant={status.variant}>
                  <span className="sr-only">{labels.statusLabel}: </span>
                  {status.text}
                </Badge>
              ) : null}
              {typeof profile.priceLevel === 'number' &&
              profile.priceLevel > 0 ? (
                <Badge variant="secondary">
                  <span className="sr-only">{labels.priceLabel}: </span>
                  {'€'.repeat(profile.priceLevel)}
                </Badge>
              ) : null}
            </div>
          </div>
          {typeof profile.rating === 'number' ? (
            <div className="shrink-0 text-right">
              <p className="text-foreground flex items-center justify-end gap-1 text-lg font-semibold tabular-nums">
                <Star
                  className="text-warning size-4 fill-current"
                  aria-hidden="true"
                />
                <span className="sr-only">{labels.ratingLabel}: </span>
                {profile.rating.toFixed(1)}
              </p>
              {typeof profile.reviewCount === 'number' ? (
                <p className="text-muted-foreground text-xs tabular-nums">
                  {profile.reviewCount} {labels.reviewsLabel.toLowerCase()}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>

        {profile.description ? (
          <p className="text-muted-foreground mt-4 line-clamp-4 text-sm leading-6">
            {profile.description}
          </p>
        ) : null}

        {contactRows.length > 0 || profile.mapsUrl ? (
          <dl className="border-border mt-5 grid gap-x-6 gap-y-3 border-t pt-4 sm:grid-cols-2">
            {contactRows.map(({ key, icon: Icon, label, value }) => (
              <div key={key} className="flex min-w-0 items-start gap-2.5">
                <Icon
                  className="text-muted-foreground mt-0.5 size-4 shrink-0"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  {label ? (
                    <dt className="text-muted-foreground text-xs">{label}</dt>
                  ) : null}
                  <dd className="text-foreground truncate text-sm">{value}</dd>
                </div>
              </div>
            ))}
            {profile.mapsUrl ? (
              <div className="flex min-w-0 items-start gap-2.5">
                <MapPin
                  className="text-muted-foreground mt-0.5 size-4 shrink-0"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <dt className="sr-only">Google Maps</dt>
                  <dd>
                    <a
                      href={profile.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary focus-visible:ring-ring inline-flex items-center gap-1 rounded-sm text-sm font-medium underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:outline-none"
                    >
                      {labels.mapsLabel}
                      <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    </a>
                  </dd>
                </div>
              </div>
            ) : null}
          </dl>
        ) : null}
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Services */}
        <section aria-label={labels.blockServices} className={`${surface} p-5`}>
          <SectionTitle icon={Briefcase} count={preview.services.length}>
            {labels.blockServices}
          </SectionTitle>
          {preview.services.length > 0 ? (
            <ul className="divide-border mt-3 max-h-72 divide-y overflow-y-auto">
              {preview.services.map((service) => (
                <li key={service.name} className="py-2.5 first:pt-1">
                  <p className="text-foreground text-sm font-medium">
                    {service.name}
                  </p>
                  {service.description ? (
                    <p className="text-muted-foreground mt-0.5 line-clamp-2 text-xs leading-5">
                      {service.description}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground mt-3 text-sm">
              {labels.noServices}
            </p>
          )}
        </section>

        {/* Hours */}
        <section aria-label={labels.blockHours} className={`${surface} p-5`}>
          <SectionTitle icon={Clock}>{labels.blockHours}</SectionTitle>
          {preview.hours.length > 0 ? (
            <dl className="mt-3 space-y-1.5">
              {preview.hours.map((hour) => (
                <div
                  key={`${hour.day_of_week}-${hour.open_time}-${hour.close_time}`}
                  className="flex items-center justify-between gap-4 text-sm"
                >
                  <dt className="text-muted-foreground">
                    {labels.dayNames?.[hour.day_of_week] ?? hour.day_of_week}
                  </dt>
                  <dd
                    className={
                      hour.is_closed
                        ? 'text-muted-foreground'
                        : 'text-foreground font-medium tabular-nums'
                    }
                  >
                    {hour.is_closed
                      ? (labels.closedLabel ?? '—')
                      : `${hour.open_time ?? '—'} – ${hour.close_time ?? '—'}`}
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="text-muted-foreground mt-3 text-sm">
              {labels.noHours}
            </p>
          )}
        </section>
      </div>
    </div>
  )
}
