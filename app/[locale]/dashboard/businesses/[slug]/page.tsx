import { getBusinessBySlug, getServices, getLeads, getWorkingHours, getTeamMembers, getAuditLogs, getCalendarEvents, getSections } from '@/lib/supabase/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, ExternalLink, Settings, LayoutGrid, Clock, MessageSquare, Briefcase, BarChart3, Users, Calendar as CalendarIcon, ShieldCheck, FileCheck } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ServicesManager from './_components/ServicesManager'
import HoursManager from './_components/HoursManager'
import LeadsViewer from './_components/LeadsViewer'
import BusinessSettingsForm from './settings/_components/BusinessSettingsForm'
import TeamManager from './_components/TeamManager'
import AnalyticsViewer from './_components/AnalyticsViewer'
import AuditLogViewer from './_components/AuditLogViewer'
import CalendarManager from './_components/CalendarManager'
import ContentReviewManager from './_components/ContentReviewManager'

export default async function BusinessDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const business = await getBusinessBySlug(slug)

  if (!business) {
    notFound()
  }

  const [services, leads, hours, teamMembers, auditLogs, calendarEvents, sections] = await Promise.all([
    getServices(business.id),
    getLeads(business.id),
    getWorkingHours(business.id),
    getTeamMembers(business.id),
    getAuditLogs(business.id),
    getCalendarEvents(business.id),
    getSections(business.id),
  ])

  const t = {
    es: {
      back: 'Volver',
      viewPublic: 'Ver web pública',
      summary: {
        services: 'Servicios',
        leads: 'Mensajes',
        team: 'Miembros',
      },
      tabs: {
        overview: 'Resumen',
        services: 'Servicios',
        hours: 'Horario',
        leads: 'Mensajes',
        analytics: 'Analítica',
        team: 'Equipo',
        calendar: 'Calendario',
        reviews: 'Revisiones',
        audit: 'Auditoría',
        settings: 'Configuración',
      },
      overview: {
        title: 'Información General',
        category: 'Categoría',
        description: 'Descripción',
      }
    },
    ca: {
      back: 'Tornar',
      viewPublic: 'Veure web pública',
      summary: {
        services: 'Serveis',
        leads: 'Missatges',
        team: 'Membres',
      },
      tabs: {
        overview: 'Resum',
        services: 'Serveis',
        hours: 'Horari',
        leads: 'Missatges',
        analytics: 'Analítica',
        team: 'Equip',
        calendar: 'Calendari',
        reviews: 'Revisions',
        audit: 'Auditoria',
        settings: 'Configuració',
      },
      overview: {
        title: 'Informació General',
        category: 'Categoria',
        description: 'Descripció',
      }
    },
  }[locale === 'ca' ? 'ca' : 'es']

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link href={`/${locale}/dashboard`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{business.name}</h1>
          <p className="text-sm text-slate-600">{business.slug}</p>
        </div>
        <Button variant="outline" asChild className="sm:ml-auto">
          <Link href={`/${locale}/w/${business.slug}`} target="_blank">
            <ExternalLink className="mr-2 h-4 w-4" />
            {t.viewPublic}
          </Link>
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
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
          <CardContent className="text-2xl font-semibold text-slate-900">{leads.length}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">{t.summary.team}</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold text-slate-900">{teamMembers.length}</CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <div className="overflow-x-auto pb-2">
          <TabsList className="h-auto min-w-max gap-2 bg-transparent p-0">
            <TabsTrigger value="overview" className="border bg-white data-[state=active]:border-emerald-200 data-[state=active]:text-emerald-700">
              <LayoutGrid className="mr-2 h-4 w-4" />
              {t.tabs.overview}
            </TabsTrigger>
            <TabsTrigger value="services" className="border bg-white data-[state=active]:border-emerald-200 data-[state=active]:text-emerald-700">
              <Briefcase className="mr-2 h-4 w-4" />
              {t.tabs.services}
            </TabsTrigger>
            <TabsTrigger value="hours" className="border bg-white data-[state=active]:border-emerald-200 data-[state=active]:text-emerald-700">
              <Clock className="mr-2 h-4 w-4" />
              {t.tabs.hours}
            </TabsTrigger>
            <TabsTrigger value="leads" className="border bg-white data-[state=active]:border-emerald-200 data-[state=active]:text-emerald-700">
              <MessageSquare className="mr-2 h-4 w-4" />
              {t.tabs.leads}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="border bg-white data-[state=active]:border-emerald-200 data-[state=active]:text-emerald-700">
              <BarChart3 className="mr-2 h-4 w-4" />
              {t.tabs.analytics}
            </TabsTrigger>
            <TabsTrigger value="team" className="border bg-white data-[state=active]:border-emerald-200 data-[state=active]:text-emerald-700">
              <Users className="mr-2 h-4 w-4" />
              {t.tabs.team}
            </TabsTrigger>
            <TabsTrigger value="calendar" className="border bg-white data-[state=active]:border-emerald-200 data-[state=active]:text-emerald-700">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {t.tabs.calendar}
            </TabsTrigger>
            <TabsTrigger value="reviews" className="border bg-white data-[state=active]:border-emerald-200 data-[state=active]:text-emerald-700">
              <FileCheck className="mr-2 h-4 w-4" />
              {t.tabs.reviews}
            </TabsTrigger>
            <TabsTrigger value="audit" className="border bg-white data-[state=active]:border-emerald-200 data-[state=active]:text-emerald-700">
              <ShieldCheck className="mr-2 h-4 w-4" />
              {t.tabs.audit}
            </TabsTrigger>
            <TabsTrigger value="settings" className="border bg-white data-[state=active]:border-emerald-200 data-[state=active]:text-emerald-700">
              <Settings className="mr-2 h-4 w-4" />
              {t.tabs.settings}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>{t.overview.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{business.category}</p>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>{t.overview.description}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{business.description || '-'}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="services">
          <ServicesManager businessId={business.id} initialServices={services} locale={locale} />
        </TabsContent>

        <TabsContent value="hours">
          <HoursManager businessId={business.id} initialHours={hours} locale={locale} />
        </TabsContent>

        <TabsContent value="leads">
          <LeadsViewer leads={leads} locale={locale} />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsViewer businessId={business.id} locale={locale} />
        </TabsContent>

        <TabsContent value="team">
          <TeamManager businessId={business.id} initialMembers={teamMembers} locale={locale} />
        </TabsContent>

        <TabsContent value="calendar">
          <CalendarManager businessId={business.id} events={calendarEvents} locale={locale} />
        </TabsContent>

        <TabsContent value="reviews">
          <ContentReviewManager sections={sections} locale={locale} />
        </TabsContent>

        <TabsContent value="audit">
          <AuditLogViewer logs={auditLogs} locale={locale} />
        </TabsContent>

        <TabsContent value="settings">
          <Card>
             <CardHeader>
               <CardTitle>{t.tabs.settings}</CardTitle>
             </CardHeader>
             <CardContent>
               <BusinessSettingsForm business={business} locale={locale} />
             </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
