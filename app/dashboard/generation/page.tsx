import { getBusinesses } from '@/lib/supabase/actions'
import GlobalGenerationPanel from './_components/GlobalGenerationPanel'

export default async function GlobalGenerationPage() {
  const businesses = await getBusinesses()
  const locale = 'es' // Default locale, could be fetched from params or user preferences if available

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Generación IA
        </h1>
        <p className="text-slate-500">
          Utiliza la inteligencia artificial para extraer y generar contenido para tus negocios.
        </p>
      </div>

      <GlobalGenerationPanel businesses={businesses} locale={locale} />
    </div>
  )
}
