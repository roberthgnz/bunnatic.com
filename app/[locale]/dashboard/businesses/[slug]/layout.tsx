import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  Briefcase,
  CalendarClock,
  ExternalLink,
  LayoutGrid,
  MessageSquare,
  Sparkles,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  getBusinessBySlug,
  getSections,
  getWorkingHours,
  getServices,
  getLeads,
  getTeamMembers,
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

  const [services, leads, teamMembers, workingHours, sections] = await Promise.all([
    getServices(business.id),
    getLeads(business.id),
    getTeamMembers(business.id),
    getWorkingHours(business.id),
    getSections(business.id),
  ])

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
  const hasTeam = teamMembers.length > 0
  const hasPublishedContent = sections.some((section) => section.status === 'published')

  const setupChecklist = [
    hasProfile,
    hasContact,
    hasAddress,
    hasServices,
    hasHours,
    hasTeam,
    hasPublishedContent,
  ]
  const setupCompletedCount = setupChecklist.filter(Boolean).length
  const setupCompletion = Math.round((setupCompletedCount / setupChecklist.length) * 100)
  const setupStatus = setupCompletion === 100 ? 'complete' : setupCompletion >= 60 ? 'inProgress' : 'early'

  const t = {
    es: {
      viewPublic: 'Ver web pública',
      back: 'Volver',
      workspace: 'Workspace del negocio',
      setup: 'Nivel de configuración',
      setupReady: 'Listo para operar',
      setupInProgress: 'En progreso',
      setupEarly: 'Fase inicial',
      setupHint: 'Completa la base operativa para ofrecer una experiencia consistente a clientes.',
      quickActions: 'Acciones rápidas',
      kpisTitle: 'Estado operacional',
      summary: {
        services: 'Servicios',
        leads: 'Mensajes',
        team: 'Miembros',
        activeDays: 'Días abiertos',
      },
      views: {
        generation: 'Generación IA',
        overview: 'Resumen',
        services: 'Servicios',
        hours: 'Horario',
      },
    },
    ca: {
      viewPublic: 'Veure web pública',
      back: 'Tornar',
      workspace: 'Workspace del negoci',
      setup: 'Nivell de configuració',
      setupReady: 'A punt per operar',
      setupInProgress: 'En progrés',
      setupEarly: 'Fase inicial',
      setupHint: "Completa la base operativa per oferir una experiència consistent a clients.",
      quickActions: 'Accions ràpides',
      kpisTitle: 'Estat operacional',
      summary: {
        services: 'Serveis',
        leads: 'Missatges',
        team: 'Membres',
        activeDays: 'Dies oberts',
      },
      views: {
        generation: 'Generació IA',
        overview: 'Resum',
        services: 'Serveis',
        hours: 'Horari',
      },
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" asChild className="w-fit">
          <Link href={`/${locale}/dashboard/businesses`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.back}
          </Link>
        </Button>
        <Button variant="outline" asChild className="sm:ml-auto">
          <Link href={`/${locale}/w/${business.slug}`} target="_blank">
            <ExternalLink className="mr-2 h-4 w-4" />
            {t.viewPublic}
          </Link>
        </Button>
      </div>

      <Card className="border-slate-200 bg-gradient-to-b from-white via-white to-slate-50/60">
        <CardContent className="space-y-5 p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{t.workspace}</p>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{business.name}</h1>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <Badge variant="outline">{business.slug}</Badge>
                {business.category ? <Badge variant="secondary">{business.category}</Badge> : null}
              </div>
            </div>
            <div className="min-w-[220px] space-y-2 rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{t.setup}</p>
                <Badge variant="outline" className={statusClasses}>
                  {statusLabel}
                </Badge>
              </div>
              <p className="text-2xl font-semibold text-slate-900">{setupCompletion}%</p>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{ width: `${setupCompletion}%` }}
                />
              </div>
              <p className="text-xs text-slate-600">{t.setupHint}</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{t.quickActions}</p>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              <Button variant="outline" asChild className="justify-start">
                <Link href={`/${locale}/dashboard/businesses/${slug}/generation`}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  {t.views.generation}
                </Link>
              </Button>
              <Button variant="outline" asChild className="justify-start">
                <Link href={`/${locale}/dashboard/businesses/${slug}/overview`}>
                  <LayoutGrid className="mr-2 h-4 w-4" />
                  {t.views.overview}
                </Link>
              </Button>
              <Button variant="outline" asChild className="justify-start">
                <Link href={`/${locale}/dashboard/businesses/${slug}/services`}>
                  <Briefcase className="mr-2 h-4 w-4" />
                  {t.views.services}
                </Link>
              </Button>
              <Button variant="outline" asChild className="justify-start">
                <Link href={`/${locale}/dashboard/businesses/${slug}/hours`}>
                  <CalendarClock className="mr-2 h-4 w-4" />
                  {t.views.hours}
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{t.kpisTitle}</p>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">{t.summary.services}</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold text-slate-900">{services.length}</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">{t.summary.leads}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-end justify-between gap-3">
              <span className="text-2xl font-semibold text-slate-900">{leads.length}</span>
              <MessageSquare className="h-4 w-4 text-slate-400" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">{t.summary.team}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-end justify-between gap-3">
              <span className="text-2xl font-semibold text-slate-900">{teamMembers.length}</span>
              <Users className="h-4 w-4 text-slate-400" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">{t.summary.activeDays}</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold text-slate-900">{activeDays}/7</CardContent>
          </Card>
        </div>
      </div>

      <BusinessSectionNav locale={locale} slug={slug} />

      {children}
    </div>
  )
}
