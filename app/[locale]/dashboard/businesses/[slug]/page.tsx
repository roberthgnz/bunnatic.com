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
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center gap-4 py-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/${locale}/dashboard`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{business.name}</h1>
          <p className="text-muted-foreground">{business.slug}</p>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/${locale}/w/${business.slug}`} target="_blank">
            <ExternalLink className="mr-2 h-4 w-4" />
            {t.viewPublic}
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <div className="overflow-x-auto pb-2">
          <TabsList className="h-auto flex-wrap justify-start gap-2 bg-transparent p-0">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white border">
              <LayoutGrid className="mr-2 h-4 w-4" />
              {t.tabs.overview}
            </TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:bg-white border">
              <Briefcase className="mr-2 h-4 w-4" />
              {t.tabs.services}
            </TabsTrigger>
            <TabsTrigger value="hours" className="data-[state=active]:bg-white border">
              <Clock className="mr-2 h-4 w-4" />
              {t.tabs.hours}
            </TabsTrigger>
            <TabsTrigger value="leads" className="data-[state=active]:bg-white border">
              <MessageSquare className="mr-2 h-4 w-4" />
              {t.tabs.leads}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-white border">
              <BarChart3 className="mr-2 h-4 w-4" />
              {t.tabs.analytics}
            </TabsTrigger>
            <TabsTrigger value="team" className="data-[state=active]:bg-white border">
              <Users className="mr-2 h-4 w-4" />
              {t.tabs.team}
            </TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-white border">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {t.tabs.calendar}
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-white border">
              <FileCheck className="mr-2 h-4 w-4" />
              {t.tabs.reviews}
            </TabsTrigger>
            <TabsTrigger value="audit" className="data-[state=active]:bg-white border">
              <ShieldCheck className="mr-2 h-4 w-4" />
              {t.tabs.audit}
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-white border">
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
          <CalendarManager events={calendarEvents} locale={locale} />
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
