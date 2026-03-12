import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  getBusinessBySlug,
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

  const [services, leads, teamMembers] = await Promise.all([
    getServices(business.id),
    getLeads(business.id),
    getTeamMembers(business.id),
  ])

  const t = {
    es: {
      viewPublic: 'Ver web pública',
      summary: {
        services: 'Servicios',
        leads: 'Mensajes',
        team: 'Miembros',
      },
    },
    ca: {
      viewPublic: 'Veure web pública',
      summary: {
        services: 'Serveis',
        leads: 'Missatges',
        team: 'Membres',
      },
    },
  }[locale === 'ca' ? 'ca' : 'es']

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link href={`/${locale}/dashboard/businesses`}>
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

      <BusinessSectionNav locale={locale} slug={slug} />

      {children}
    </div>
  )
}
