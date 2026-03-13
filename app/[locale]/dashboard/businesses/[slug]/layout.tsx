import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  getBusinessBySlug,
  getBusinessDomainByBusinessId,
  getSections,
  getWorkingHours,
  getServices,
} from '@/lib/supabase/actions'
import BusinessSectionNav from './_components/BusinessSectionNav'

export default async function BusinessDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const business = await getBusinessBySlug(slug)

  if (!business) {
    notFound()
  }

  const [services, workingHours, sections] = await Promise.all([
    getServices(business.id),
    getWorkingHours(business.id),
    getSections(business.id),
  ])
  const businessDomain = await getBusinessDomainByBusinessId(business.id)
  const publicHref =
    businessDomain?.status === 'active'
      ? `https://${businessDomain.hostname}`
      : `/${locale}/w/${business.slug}`

  const activeDays = workingHours.filter((hour) => !hour.is_closed).length
  const hasProfile = Boolean(
    business.name?.trim() &&
    business.category?.trim() &&
    business.description?.trim()
  )
  const hasContact =
    Boolean(business.phone?.trim()) || Boolean(business.email?.trim())
  const hasAddress = Boolean(business.address?.trim())
  const hasServices = services.length > 0
  const hasHours = activeDays > 0
  // Simplified logic, considering the essentials for minimum readiness. We remove check for team.
  const hasPublishedContent = sections.some(
    (section) => section.status === 'published'
  )

  const setupChecklist = [
    hasProfile,
    hasContact,
    hasAddress,
    hasServices,
    hasHours,
    hasPublishedContent,
  ]
  const setupCompletedCount = setupChecklist.filter(Boolean).length
  const setupCompletion = Math.round(
    (setupCompletedCount / setupChecklist.length) * 100
  )
  const setupStatus =
    setupCompletion === 100
      ? 'complete'
      : setupCompletion >= 60
        ? 'inProgress'
        : 'early'

  const t = {
    es: {
      viewPublic: 'Ver web pública',
      back: 'Volver',
      setupReady: 'Listo para operar',
      setupInProgress: 'En progreso',
      setupEarly: 'Fase inicial',
    },
    ca: {
      viewPublic: 'Veure web pública',
      back: 'Tornar',
      setupReady: 'A punt per operar',
      setupInProgress: 'En progrés',
      setupEarly: 'Fase inicial',
    },
  }[locale === 'ca' ? 'ca' : 'es']

  const statusLabel =
    setupStatus === 'complete'
      ? t.setupReady
      : setupStatus === 'inProgress'
        ? t.setupInProgress
        : t.setupEarly

  const statusClasses =
    setupStatus === 'complete'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
      : setupStatus === 'inProgress'
        ? 'border-amber-200 bg-amber-50 text-amber-700'
        : 'border-slate-200 bg-slate-100 text-slate-700'

  return (
    <div className="space-y-6">
      {/* Slim Header - Navigation & Base Information */}
      <Card className="overflow-hidden rounded-xl border-slate-200 bg-white shadow-sm">
        <CardContent className="flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center sm:px-6 sm:py-3">
          {/* Left side: Navigation / Name */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="h-8 w-8 flex-shrink-0 text-slate-500 hover:text-slate-900"
            >
              <Link href={`/${locale}/dashboard/businesses`}>
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">{t.back}</span>
              </Link>
            </Button>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="max-w-[200px] truncate text-sm leading-none font-semibold tracking-tight text-slate-900 sm:max-w-[400px] sm:text-base lg:max-w-xl">
                {business.name}
              </h1>
              {business.category && (
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1.5 py-0.5 text-[10px] leading-none font-normal"
                >
                  {business.category}
                </Badge>
              )}
            </div>
          </div>

          {/* Right side: Tools / Setup Progress */}
          <div className="flex items-center gap-4 pl-11 sm:pl-0">
            {/* Micro progress bar */}
            <div className="flex hidden items-center gap-2 sm:flex">
              <div className="flex w-24 flex-col gap-1">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full bg-emerald-500 transition-all`}
                    style={{ width: `${setupCompletion}%` }}
                  />
                </div>
              </div>
              <Badge
                variant="outline"
                className={`rounded-sm border-transparent px-1.5 py-0.5 text-[10px] leading-none font-medium mix-blend-multiply ${statusClasses}`}
              >
                {statusLabel}
              </Badge>
            </div>

            {/* Public link action */}
            <Button
              variant="outline"
              size="sm"
              asChild
              className="hidden h-7 px-2 text-xs text-slate-600 sm:px-3 md:flex"
            >
              <Link href={publicHref} target="_blank">
                {t.viewPublic}
                <ExternalLink className="ml-1.5 h-3 w-3" />
              </Link>
            </Button>
            {/* Mobile variant */}
            <Button
              variant="outline"
              size="icon"
              asChild
              className="ml-auto h-7 w-7 text-slate-600 md:hidden"
            >
              <Link href={publicHref} target="_blank">
                <ExternalLink className="h-3 w-3" />
                <span className="sr-only">{t.viewPublic}</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Area Layout */}
      <div className="flex flex-col gap-8 md:flex-row">
        {/* Left Sidebar */}
        <aside className="w-full shrink-0 md:w-56 lg:w-64">
          <BusinessSectionNav locale={locale} slug={slug} />
        </aside>

        {/* Right Content */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}
