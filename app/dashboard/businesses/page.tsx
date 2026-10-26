import { getBusinesses } from '@/lib/backoffice/queries'
import { Button } from '@/components/ui/button'
import { Building2, Plus } from 'lucide-react'
import Link from 'next/link'
import { EmptyState, PageHeader } from '@/components/dashboard/page-header'
import BusinessDirectory from '@/components/dashboard/BusinessDirectory'
import { getPlatformHost } from '@/lib/backoffice/platform'

export default async function BusinessesPage() {
  const businesses = await getBusinesses()
  const platformHost = getPlatformHost()

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={`${businesses.length} ${businesses.length === 1 ? 'negocio' : 'negocios'}`}
        title="Mis"
        accent="negocios"
        description="Gestiona cada negocio y su web pública desde un solo lugar."
        actions={
          <Button asChild>
            <Link href="/dashboard/new">
              <Plus aria-hidden="true" />
              Crear negocio
            </Link>
          </Button>
        }
      />

      {businesses.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="Todavía no tienes negocios"
          description="Crea el primero para empezar a configurar servicios, horario y contenido."
          action={
            <Button asChild size="lg">
              <Link href="/dashboard/new">
                <Plus aria-hidden="true" />
                Crear negocio
              </Link>
            </Button>
          }
        />
      ) : (
        <BusinessDirectory
          businesses={businesses}
          platformHost={platformHost}
        />
      )}
    </div>
  )
}
