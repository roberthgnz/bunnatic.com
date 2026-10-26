import { getBusinesses } from '@/lib/backoffice/queries'
import { PageHeader } from '@/components/dashboard/page-header'
import GlobalGenerationPanel from './_components/GlobalGenerationPanel'

export default async function GlobalGenerationPage() {
  const businesses = await getBusinesses()
  const locale = 'es' // Default locale, could be fetched from params or user preferences if available

  return (
    <div className="max-w-4xl space-y-8 pb-10">
      <PageHeader
        eyebrow="Generación con IA"
        title="Importa tu negocio"
        accent="en un minuto"
        description="Busca tu ficha de Google o indica tu web actual. Extraemos perfil, servicios y horario para que no tengas que escribirlos a mano."
      />

      <GlobalGenerationPanel
        businesses={businesses.filter((business) => business.role === 'owner')}
        locale={locale}
      />
    </div>
  )
}
