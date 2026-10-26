import { notFound } from 'next/navigation'
import { findBusinessAccessBySlug } from '@/lib/backoffice/access'
import { hasBusinessPermission } from '@/lib/backoffice/policy'
import { EmptyState } from '@/components/dashboard/page-header'
import LeadsViewer from '../_components/LeadsViewer'
import { getBusinessBySlug, getLeads } from '@/lib/backoffice/queries'

export default async function BusinessLeadsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const business = await getBusinessBySlug(slug)
  const access = await findBusinessAccessBySlug(slug)

  if (!business || !access) {
    notFound()
  }
  if (!hasBusinessPermission(access.role, 'leads.read')) return <EmptyState title="Los mensajes los gestiona el propietario" description="Tu acceso compartido permite consultar el negocio, pero no los datos de contacto de sus clientes." />

  const leads = await getLeads(business.id)

  return <LeadsViewer leads={leads.map(lead => ({ ...lead, message: lead.message ?? '' }))} />
}
