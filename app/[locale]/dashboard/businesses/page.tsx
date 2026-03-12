import { getBusinesses } from '@/lib/supabase/actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Building2, CheckCircle2, CircleDashed, ExternalLink, Plus } from 'lucide-react'
import Link from 'next/link'

export default async function BusinessesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const businesses = await getBusinesses()

  const t = {
    es: {
      title: 'Mis negocios',
      subtitle: 'Gestiona cada negocio y su web pública desde un solo lugar.',
      create: 'Crear negocio',
      noData: 'Todavía no tienes negocios registrados.',
      noDataHint: 'Crea el primero para empezar a configurar servicios, horario y contenido.',
      open: 'Abrir panel',
      slug: 'Slug',
      domain: 'Dominio',
      customDomain: 'Custom',
      platformDomain: 'Plataforma',
      pendingDomain: 'Pendiente',
      errorDomain: 'Revisar',
      created: 'Creado',
      viewLive: 'Ver web',
    },
    ca: {
      title: 'Els meus negocis',
      subtitle: 'Gestiona cada negoci i el seu web públic des d’un sol lloc.',
      create: 'Crear negoci',
      noData: 'Encara no tens negocis registrats.',
      noDataHint: 'Crea el primer per començar a configurar serveis, horari i contingut.',
      open: 'Obrir panell',
      slug: 'Slug',
      domain: 'Domini',
      customDomain: 'Custom',
      platformDomain: 'Plataforma',
      pendingDomain: 'Pendent',
      errorDomain: 'Revisar',
      created: 'Creat',
      viewLive: 'Veure web',
    },
  }[locale === 'ca' ? 'ca' : 'es']

  const platformHost =
    process.env.PLATFORM_ROOT_DOMAIN?.trim().toLowerCase() ||
    (() => {
      try {
        return new URL(process.env.APP_URL || '').host
      } catch {
        return 'bunnatic.com'
      }
    })()

  const formatBusinessDate = (value: string | null | undefined) => {
    if (!value) return '—'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return '—'
    return new Intl.DateTimeFormat(locale === 'ca' ? 'ca-ES' : 'es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'Europe/Madrid',
    }).format(date)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{t.title}</h1>
          <p className="text-sm text-slate-600">{t.subtitle}</p>
        </div>
        <Button asChild>
          <Link href={`/${locale}/dashboard/new`}>
            <Plus className="mr-2 h-4 w-4" />
            {t.create}
          </Link>
        </Button>
      </div>

      {businesses.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex min-h-56 flex-col items-center justify-center gap-3 py-12 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-md border border-slate-200 bg-slate-50">
              <Building2 className="h-5 w-5 text-slate-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">{t.noData}</h2>
            <p className="max-w-md text-sm text-slate-600">{t.noDataHint}</p>
            <Button asChild className="mt-2">
              <Link href={`/${locale}/dashboard/new`}>{t.create}</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {businesses.map((business) => (
            <Card key={business.id} className="border-slate-200 shadow-sm">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                      {business.name?.[0]?.toUpperCase() || 'B'}
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="line-clamp-1 text-lg">{business.name}</CardTitle>
                      <CardDescription className="line-clamp-1 mt-0.5 font-mono text-xs">
                        {business.custom_domain
                          ? business.custom_domain
                          : `${platformHost}/${locale}/w/${business.slug}`}
                      </CardDescription>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {business.custom_domain_status === 'active' ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <CircleDashed className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="border-slate-200 bg-slate-100 text-slate-700">
                    {business.custom_domain
                      ? business.custom_domain_status === 'active'
                        ? t.customDomain
                        : business.custom_domain_status === 'error'
                          ? t.errorDomain
                          : t.pendingDomain
                      : t.platformDomain}
                  </Badge>
                  <Badge variant="outline" className="border-slate-200 bg-slate-100 text-slate-700">
                    {business.category || '—'}
                  </Badge>
                  <Badge variant="outline" className="border-slate-200 bg-slate-100 text-slate-700 font-mono">
                    {business.slug}
                  </Badge>
                </div>

                <p className="line-clamp-2 text-sm text-slate-700">
                  {business.description || '-'}
                </p>

                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-slate-500">
                    {t.created}: {formatBusinessDate(business.created_at)}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/${locale}/dashboard/businesses/${business.slug}`}>
                        {t.open}
                      </Link>
                    </Button>
                    <Button asChild size="sm" variant="ghost">
                      <Link
                        href={
                          business.custom_domain && business.custom_domain_status === 'active'
                            ? `https://${business.custom_domain}`
                            : `/${locale}/w/${business.slug}`
                        }
                        target="_blank"
                      >
                        {t.viewLive}
                        <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
