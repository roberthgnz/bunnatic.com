'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { usePathname } from 'next/navigation'
import { Fragment } from 'react'
import { DashboardContent } from './dashboard-constants'

export function DashboardBreadcrumbs({
  t,
  businesses,
}: {
  t: DashboardContent
  businesses: { name: string; slug: string }[]
}) {
  const pathname = usePathname()
  const localePrefix = ''

  const dashboardRoot = `${localePrefix}/dashboard`
  const currentPath = pathname.startsWith(dashboardRoot)
    ? pathname.slice(dashboardRoot.length)
    : ''
  const segments = currentPath.split('/').filter(Boolean)

  const segmentLabelMap: Record<string, string> = {
    overview: 'Resumen',
    analytics: 'Analítica',
    calendar: 'Calendario',
    settings: t.menu.settings,
    team: 'Equipo',
    leads: 'Mensajes',
    hours: 'Horario',
    services: 'Servicios',
    generation: 'Generación IA',
    profile: t.menu.account,
    subscription: t.menu.billing,
    new: t.menu.newBusiness,
    businesses: t.menu.businesses,
  }

  const formatSegmentLabel = (segment: string) => {
    if (segmentLabelMap[segment]) {
      return segmentLabelMap[segment]
    }

    const business = businesses.find((item) => item.slug === segment)
    if (business) return business.name
    let decoded = segment
    try {
      decoded = decodeURIComponent(segment)
    } catch {
      /* Keep malformed segments printable. */
    }
    return decoded
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase())
  }

  const crumbs =
    segments.length === 0
      ? [{ href: dashboardRoot, label: t.menu.dashboard }]
      : segments.map((segment, index) => ({
          href: `${dashboardRoot}/${segments.slice(0, index + 1).join('/')}`,
          label: formatSegmentLabel(segment),
        }))

  return (
    <Breadcrumb className="min-w-0">
      <BreadcrumbList className="flex-nowrap text-[13px]">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1
          return (
            <Fragment key={crumb.href}>
              {index > 0 ? (
                <BreadcrumbSeparator className="hidden md:block" />
              ) : null}
              <BreadcrumbItem
                className={isLast ? 'min-w-0' : 'hidden md:inline-flex'}
              >
                {isLast ? (
                  <BreadcrumbPage className="truncate font-medium">
                    {crumb.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={crumb.href}>
                    {crumb.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
