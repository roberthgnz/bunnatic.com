import { getBusinesses } from '@/lib/supabase/actions'
import { Button } from '@/components/ui/button'
import { Building2, Plus } from 'lucide-react'
import Link from 'next/link'
import { EmptyState, PageHeader } from '@/components/dashboard/page-header'
import {
  BusinessCard,
  getPlatformHost,
} from '@/components/dashboard/business-card'

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
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {businesses.map((business) => (
            <BusinessCard
              key={business.id}
              business={business}
              platformHost={platformHost}
              dateLabel="Creado el"
              date={business.created_at}
            />
          ))}
          <Link
            href="/dashboard/new"
            className="border-border text-muted-foreground hover:border-ring/50 hover:bg-card hover:text-foreground focus-visible:ring-ring flex min-h-56 flex-col items-center justify-center gap-3 rounded-xl border border-dashed transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            <span className="bg-secondary text-secondary-foreground flex size-10 items-center justify-center rounded-xl">
              <Plus className="size-5" aria-hidden="true" />
            </span>
            <span className="text-sm font-medium">Añadir otro negocio</span>
          </Link>
        </div>
      )}
    </div>
  )
}
