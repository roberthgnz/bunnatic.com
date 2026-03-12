import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getBusinessBySlug } from '@/lib/supabase/actions'

export default async function BusinessOverviewPage({
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
      category: 'Categoría',
      description: 'Descripción',
    },
    ca: {
      category: 'Categoria',
      description: 'Descripció',
    },
  }[locale === 'ca' ? 'ca' : 'es']

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>{t.category}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{business.category || '-'}</p>
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
  )
}
