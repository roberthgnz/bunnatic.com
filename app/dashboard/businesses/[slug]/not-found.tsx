import Link from 'next/link'
import { Building2, ArrowLeft } from 'lucide-react'
import { EmptyState } from '@/components/dashboard/page-header'
import { Button } from '@/components/ui/button'

export default function BusinessNotFound() {
  return (
    <EmptyState
      icon={Building2}
      title="Este negocio no está disponible"
      description="Puede que se haya eliminado o que no tengas acceso con esta cuenta."
      action={
        <Button asChild variant="outline">
          <Link href="/dashboard/businesses">
            <ArrowLeft aria-hidden="true" />
            Volver a mis negocios
          </Link>
        </Button>
      }
    />
  )
}
