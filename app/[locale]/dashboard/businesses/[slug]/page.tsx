import { getBusinessBySlug, getServices, getLeads, getWorkingHours } from '@/lib/supabase/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, ExternalLink, Settings, LayoutGrid, Clock, MessageSquare, Briefcase } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ServicesManager from './_components/ServicesManager'
import HoursManager from './_components/HoursManager'
import LeadsViewer from './_components/LeadsViewer'
import BusinessSettingsForm from './settings/_components/BusinessSettingsForm'

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

  const [services, leads, hours] = await Promise.all([
    getServices(business.id),
    getLeads(business.id),
    getWorkingHours(business.id),
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
        <TabsList>
          <TabsTrigger value="overview">
            <LayoutGrid className="mr-2 h-4 w-4" />
            {t.tabs.overview}
          </TabsTrigger>
          <TabsTrigger value="services">
            <Briefcase className="mr-2 h-4 w-4" />
            {t.tabs.services}
          </TabsTrigger>
          <TabsTrigger value="hours">
            <Clock className="mr-2 h-4 w-4" />
            {t.tabs.hours}
          </TabsTrigger>
          <TabsTrigger value="leads">
            <MessageSquare className="mr-2 h-4 w-4" />
            {t.tabs.leads}
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" />
            {t.tabs.settings}
          </TabsTrigger>
        </TabsList>

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
