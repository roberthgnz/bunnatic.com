import { getBusinessBySlug } from '@/lib/supabase/actions'
import { notFound } from 'next/navigation'
import BusinessSettingsForm from './_components/BusinessSettingsForm'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function BusinessSettingsPage({
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
      title: 'Configuración del negocio',
      subtitle: 'Actualiza la información de tu negocio.',
      back: 'Volver',
    },
    ca: {
      title: 'Configuració del negoci',
      subtitle: 'Actualitza la informació del teu negoci.',
      back: 'Tornar',
    },
  }[locale === 'ca' ? 'ca' : 'es']

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link href={`/${locale}/dashboard/businesses/${slug}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{t.title}</h1>
          <p className="text-sm text-slate-600">{t.subtitle}</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <BusinessSettingsForm business={business} locale={locale} />
      </div>
    </div>
  )
}
