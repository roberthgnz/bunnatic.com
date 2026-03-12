import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  ExternalLink,
} from 'lucide-react'
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
  const hasPublishedContent = sections.some((section) => section.status === 'published')

  const setupChecklist = [
    hasProfile,
    hasContact,
    hasAddress,
    hasServices,
    hasHours,
    hasPublishedContent,
  ]
  const setupCompletedCount = setupChecklist.filter(Boolean).length
  const setupCompletion = Math.round((setupCompletedCount / setupChecklist.length) * 100)
  const setupStatus = setupCompletion === 100 ? 'complete' : setupCompletion >= 60 ? 'inProgress' : 'early'

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
      <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white">
        <CardContent className="p-4 sm:px-6 sm:py-3 flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
            {/* Left side: Navigation / Name */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-slate-500 hover:text-slate-900 flex-shrink-0">
                <Link href={`/${locale}/dashboard/businesses`}>
                  <ArrowLeft className="h-4 w-4" />
                  <span className="sr-only">{t.back}</span>
                </Link>
              </Button>
              <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-sm sm:text-base font-semibold text-slate-900 tracking-tight leading-none truncate max-w-[200px] sm:max-w-[400px] lg:max-w-xl">
                      {business.name}
                  </h1>
                   {business.category && (
                      <Badge variant="secondary" className="font-normal text-[10px] leading-none px-1.5 py-0.5 rounded-sm">
                          {business.category}
                      </Badge>
                  )}
              </div>
            </div>
            
            {/* Right side: Tools / Setup Progress */}
            <div className="flex items-center gap-4 pl-11 sm:pl-0">
              {/* Micro progress bar */}
              <div className="flex items-center gap-2 hidden sm:flex">
                 <div className="flex flex-col gap-1 w-24">
                   <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-emerald-500 rounded-full transition-all`} 
                        style={{ width: `${setupCompletion}%`}}
                      />
                   </div>
                 </div>
                 <Badge variant="outline" className={`text-[10px] font-medium leading-none px-1.5 py-0.5 rounded-sm border-transparent mix-blend-multiply ${statusClasses}`}>
                    {statusLabel}
                 </Badge>
              </div>

              {/* Public link action */}
              <Button variant="outline" size="sm" asChild className="h-7 text-xs px-2 sm:px-3 text-slate-600 hidden md:flex">
                <Link href={publicHref} target="_blank">
                  {t.viewPublic}
                  <ExternalLink className="ml-1.5 h-3 w-3" />
                </Link>
              </Button>
               {/* Mobile variant */}
               <Button variant="outline" size="icon" asChild className="h-7 w-7 text-slate-600 md:hidden ml-auto">
                <Link href={publicHref} target="_blank">
                  <ExternalLink className="h-3 w-3" />
                  <span className="sr-only">{t.viewPublic}</span>
                </Link>
              </Button>
            </div>
        </CardContent>
      </Card>

      {/* Main Content Area Layout */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Sidebar */}
        <aside className="w-full md:w-56 lg:w-64 shrink-0">
          <BusinessSectionNav locale={locale} slug={slug} />
        </aside>

        {/* Right Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}
