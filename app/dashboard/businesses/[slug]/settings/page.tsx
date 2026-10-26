import { getBusinessBySlug, getBusinessDomain } from '@/lib/backoffice/queries'
import { notFound } from 'next/navigation'
import BusinessSettingsForm from './_components/BusinessSettingsForm'
import DomainSettingsCard from './_components/DomainSettingsCard'
import { getCloudflareCnameTarget } from '@/lib/domains/config'
import { findBusinessAccessBySlug } from '@/lib/backoffice/access'
import { hasBusinessPermission } from '@/lib/backoffice/policy'

export default async function BusinessSettingsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const business = await getBusinessBySlug(slug)
  const access = await findBusinessAccessBySlug(slug)
  const domain = await getBusinessDomain(slug)

  if (!business || !access) {
    notFound()
  }

  if (!hasBusinessPermission(access.role, 'settings.write')) {
    return (
      <section className="bg-card ring-border space-y-5 rounded-xl p-6 ring-1">
        <h2 className="font-semibold">Información del negocio</h2>
        <p className="text-muted-foreground text-sm">
          Puedes consultar esta información. La configuración y los dominios los
          gestiona el propietario.
        </p>
        <dl className="space-y-4 text-sm">
          {[
            { label: 'Nombre', value: business.name },
            { label: 'Categoría', value: business.category },
            { label: 'Descripción', value: business.description },
          ].map((row) => (
            <div key={row.label}>
              <dt className="text-muted-foreground text-xs">{row.label}</dt>
              <dd className="mt-1">{row.value || 'Sin definir'}</dd>
            </div>
          ))}
        </dl>
      </section>
    )
  }

  return (
    <div className="divide-border divide-y pb-10">
      <div className="pb-8">
        <BusinessSettingsForm
          business={{
            id: business.id,
            slug: business.slug,
            name: business.name,
            category: business.category ?? '',
            description: business.description,
          }}
        />
      </div>

      <div className="pt-8">
        <DomainSettingsCard
          businessSlug={slug}
          initialDomain={domain}
          dnsTarget={getCloudflareCnameTarget()}
          rootDomain={
            process.env.PLATFORM_ROOT_DOMAIN?.trim().toLowerCase() || null
          }
        />
      </div>
    </div>
  )
}
