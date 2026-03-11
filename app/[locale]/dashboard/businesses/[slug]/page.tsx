import { getBusinessBySlug } from '@/lib/supabase/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, ExternalLink, Settings } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

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

  const t = {
    es: {
      back: 'Volver al dashboard',
      viewPublic: 'Ver página pública',
      settings: 'Configuración',
      category: 'Categoría',
      description: 'Descripción',
      created: 'Creado el',
    },
    ca: {
      back: 'Tornar al dashboard',
      viewPublic: 'Veure pàgina pública',
      settings: 'Configuració',
      category: 'Categoria',
      description: 'Descripció',
      created: 'Creat el',
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
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/${locale}/negocio/${business.slug}`} target="_blank">
              <ExternalLink className="mr-2 h-4 w-4" />
              {t.viewPublic}
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/${locale}/dashboard/businesses/${slug}/settings`}>
              <Settings className="mr-2 h-4 w-4" />
              {t.settings}
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{t.category}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{business.category}</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t.description}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{business.description || '-'}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
