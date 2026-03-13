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
import { DashboardContent } from './dashboard-constants'

export function DashboardBreadcrumbs({ t }: { t: DashboardContent }) {
  const pathname = usePathname()
  const localePrefix = ''

  const dashboardRoot = `${localePrefix}/dashboard`
  const currentPath = pathname.startsWith(dashboardRoot)
    ? pathname.slice(dashboardRoot.length)
    : ''
  const pathSegments = currentPath
    .split('/')
    .filter(Boolean)
    .filter((segment) => segment !== 'businesses')

  const segmentLabelMap: Record<string, string> = {
    overview: 'Resumen',
    analytics: 'Analytics',
    calendar: 'Calendario',
    settings: t.menu.settings,
    team: 'Equipo',
    leads: 'Leads',
    hours: 'Horarios',
    services: 'Servicios',
    generation: 'Generación',
    profile: t.menu.account,
    subscription: t.menu.billing,
    new: t.menu.newBusiness,
  }

  const formatSegmentLabel = (segment: string) => {
    if (segmentLabelMap[segment]) {
      return segmentLabelMap[segment]
    }

    return decodeURIComponent(segment)
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase())
  }

  const breadcrumbParentLabel =
    pathSegments.length === 0 ? undefined : t.menu.businesses
  const breadcrumbPageLabel =
    pathSegments.length === 0
      ? t.menu.dashboard
      : formatSegmentLabel(pathSegments[pathSegments.length - 1])

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbParentLabel ? (
          <>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href={`${localePrefix}/dashboard/businesses`}>
                {breadcrumbParentLabel}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
          </>
        ) : null}
        <BreadcrumbItem>
          <BreadcrumbPage>{breadcrumbPageLabel}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
