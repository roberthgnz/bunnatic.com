import { getBusinesses, getProfile } from '@/lib/supabase/actions'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Building2,
  CheckCircle2,
  CircleDashed,
  ExternalLink,
  Plus,
} from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const businesses = await getBusinesses()
  const profile = await getProfile()

  const t = {
    welcome: `Hola, ${profile?.full_name || 'Usuario'}`,
    subtitle: 'Aquí tienes un resumen de tus negocios.',
    createBusiness: 'Crear nuevo negocio',
    manageBusinesses: 'Gestionar negocios',
    noBusinesses: 'Aún no tienes ningún negocio registrado.',
    startNow: 'Empieza ahora creando tu primer negocio.',
    totalBusinesses: 'Negocios activos',
    customActive: 'Dominios custom activos',
    view: 'Ver detalles',
    viewLive: 'Ver web',
    goBusinesses: 'Ir a mis negocios',
    platformDomain: 'Plataforma',
    customDomain: 'Custom',
    pendingDomain: 'Pendiente',
    errorDomain: 'Revisar',
    noDescription: 'Sin descripción',
    updated: 'Actualizado',
  }

  const platformHost =
    process.env.PLATFORM_ROOT_DOMAIN?.trim().toLowerCase() ||
    (() => {
      try {
        return new URL(process.env.APP_URL || '').host
      } catch {
        return 'bunnatic.com'
      }
    })()

  const activeCustomDomains = businesses.filter(
    (business) =>
      business.custom_domain && business.custom_domain_status === 'active'
  ).length

  const formatBusinessDate = (value: string | null | undefined) => {
    if (!value) return '—'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return '—'
    return new Intl.DateTimeFormat('es-ES', {
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
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {t.welcome}
          </h1>
          <p className="text-sm text-slate-600">{t.subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/businesses`}>
              <Building2 className="mr-2 h-4 w-4" />
              {t.manageBusinesses}
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/dashboard/new`}>
              <Plus className="mr-2 h-4 w-4" />
              {t.createBusiness}
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardDescription>{t.totalBusinesses}</CardDescription>
            <CardTitle className="text-3xl">{businesses.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href={`/dashboard/businesses`}>
                {t.goBusinesses}
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardDescription>{t.customActive}</CardDescription>
            <CardTitle className="text-3xl">{activeCustomDomains}</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href={`/dashboard/businesses`}>
                {t.manageBusinesses}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {businesses.length === 0 ? (
        <div className="flex min-h-72 items-center justify-center rounded-lg border border-dashed bg-white">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-lg font-semibold tracking-tight text-slate-900">
              {t.noBusinesses}
            </h3>
            <p className="text-sm text-slate-600">{t.startNow}</p>
            <Button asChild className="mt-4">
              <Link href={`/dashboard/new`}>{t.createBusiness}</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {businesses.slice(0, 4).map((business) => (
            <Card key={business.id} className="border-slate-200 shadow-sm">
              <CardContent className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                      {business.name?.[0]?.toUpperCase() || 'B'}
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="line-clamp-1 text-lg">
                        {business.name}
                      </CardTitle>
                      <CardDescription className="mt-0.5 line-clamp-1 font-mono text-xs">
                        {business.custom_domain
                          ? business.custom_domain
                          : `${platformHost}/w/${business.slug}`}
                      </CardDescription>
                    </div>
                  </div>

                  {business.custom_domain_status === 'active' ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <CircleDashed className="h-4 w-4 text-slate-400" />
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className="border-slate-200 bg-slate-100 text-slate-700"
                  >
                    {business.custom_domain
                      ? business.custom_domain_status === 'active'
                        ? t.customDomain
                        : business.custom_domain_status === 'error'
                          ? t.errorDomain
                          : t.pendingDomain
                      : t.platformDomain}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-slate-200 bg-slate-100 text-slate-700"
                  >
                    {business.category || '—'}
                  </Badge>
                </div>

                <p className="line-clamp-2 text-sm text-slate-700">
                  {business.description || t.noDescription}
                </p>

                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-slate-500">
                    {t.updated}: {formatBusinessDate(business.updated_at)}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link
                        href={`/dashboard/businesses/${business.slug}`}
                      >
                        {t.view}
                      </Link>
                    </Button>
                    <Button asChild size="sm" variant="ghost">
                      <Link
                        href={
                          business.custom_domain &&
                          business.custom_domain_status === 'active'
                            ? `https://${business.custom_domain}`
                            : `/w/${business.slug}`
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
