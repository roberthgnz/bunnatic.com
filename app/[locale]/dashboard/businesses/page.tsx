import { getBusinesses } from '@/lib/supabase/actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, Plus } from 'lucide-react'
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
    },
    ca: {
      title: 'Els meus negocis',
      subtitle: 'Gestiona cada negoci i el seu web públic des d’un sol lloc.',
      create: 'Crear negoci',
      noData: 'Encara no tens negocis registrats.',
      noDataHint: 'Crea el primer per començar a configurar serveis, horari i contingut.',
      open: 'Obrir panell',
      slug: 'Slug',
    },
  }[locale === 'ca' ? 'ca' : 'es']

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
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {businesses.map((business) => (
            <Card key={business.id}>
              <CardHeader className="space-y-2">
                <CardTitle className="line-clamp-1">{business.name}</CardTitle>
                <CardDescription className="line-clamp-1">{business.category}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="line-clamp-2 text-sm text-slate-600">
                  {business.description || '-'}
                </p>
                <p className="text-xs text-slate-500">
                  {t.slug}: <span className="font-mono">{business.slug}</span>
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/${locale}/dashboard/businesses/${business.slug}`}>{t.open}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
