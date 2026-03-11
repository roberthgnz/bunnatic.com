import { getBusinesses, getProfile } from '@/lib/supabase/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

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
      noBusinesses: 'Aún no tienes ningún negocio registrado.',
      startNow: 'Empieza ahora creando tu primer negocio.',
      businessName: 'Nombre',
      category: 'Categoría',
      actions: 'Acciones',
      view: 'Ver detalles',
    },
    ca: {
      welcome: `Hola, ${profile?.full_name || 'Usuari'}`,
      subtitle: 'Aquí tens un resum dels teus negocis.',
      createBusiness: 'Crear nou negoci',
      noBusinesses: 'Encara no tens cap negoci registrat.',
      startNow: 'Comença ara creant el teu primer negoci.',
      businessName: 'Nom',
      category: 'Categoria',
      actions: 'Accions',
      view: 'Veure detalls',
    },
  }[locale === 'ca' ? 'ca' : 'es']

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between py-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t.welcome}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>
        <Button asChild>
          <Link href={`/${locale}/onboarding`}>
            <Plus className="mr-2 h-4 w-4" />
            {t.createBusiness}
          </Link>
        </Button>
      </div>

      {businesses.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">{t.noBusinesses}</h3>
            <p className="text-sm text-muted-foreground">{t.startNow}</p>
            <Button asChild className="mt-4">
              <Link href={`/${locale}/onboarding`}>
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
                <p className="text-sm text-muted-foreground line-clamp-2">
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
