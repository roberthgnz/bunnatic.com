import { getBusinesses, getProfile } from '@/lib/supabase/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Plus } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const businesses = await getBusinesses()
  const profile = await getProfile()

  // Simple translation map since we are in a server component and might not have full intl setup perfectly everywhere
  // Ideally use useTranslations or getTranslations if configured
  const t = {
    es: {
      welcome: `Hola, ${profile?.full_name || 'Usuario'}`,
      subtitle: 'Aquí tienes un resumen de tus negocios.',
      createBusiness: 'Crear nuevo negocio',
      manageBusinesses: 'Gestionar negocios',
      noBusinesses: 'Aún no tienes ningún negocio registrado.',
      startNow: 'Empieza ahora creando tu primer negocio.',
      totalBusinesses: 'Negocios activos',
      view: 'Ver detalles',
      goBusinesses: 'Ir a mis negocios',
    },
    ca: {
      welcome: `Hola, ${profile?.full_name || 'Usuari'}`,
      subtitle: 'Aquí tens un resum dels teus negocis.',
      createBusiness: 'Crear nou negoci',
      manageBusinesses: 'Gestionar negocis',
      noBusinesses: 'Encara no tens cap negoci registrat.',
      startNow: 'Comença ara creant el teu primer negoci.',
      totalBusinesses: 'Negocis actius',
      view: 'Veure detalls',
      goBusinesses: 'Anar als meus negocis',
    },
  }[locale === 'ca' ? 'ca' : 'es']

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{t.welcome}</h1>
          <p className="text-sm text-slate-600">{t.subtitle}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/${locale}/dashboard/businesses`}>
              <Building2 className="mr-2 h-4 w-4" />
              {t.manageBusinesses}
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/${locale}/dashboard/new`}>
              <Plus className="mr-2 h-4 w-4" />
              {t.createBusiness}
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>{t.totalBusinesses}</CardDescription>
            <CardTitle className="text-3xl">{businesses.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href={`/${locale}/dashboard/businesses`}>{t.goBusinesses}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {businesses.length === 0 ? (
        <div className="flex min-h-72 items-center justify-center rounded-lg border border-dashed bg-white">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-lg font-semibold tracking-tight text-slate-900">{t.noBusinesses}</h3>
            <p className="text-sm text-slate-600">{t.startNow}</p>
            <Button asChild className="mt-4">
              <Link href={`/${locale}/dashboard/new`}>
                {t.createBusiness}
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {businesses.map((business) => (
            <Card key={business.id}>
              <CardHeader>
                <CardTitle>{business.name}</CardTitle>
                <CardDescription>{business.category}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2 text-sm text-slate-600">
                  {business.description || 'Sin descripción'}
                </p>
                <Button asChild variant="secondary" className="mt-4 w-full">
                  <Link href={`/${locale}/dashboard/businesses/${business.slug}`}>
                    {t.view}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
