import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { getBusinessBySlug } from '@/lib/backoffice/queries'
import SourceGenerationPanel from '../settings/_components/SourceGenerationPanel'
import { findBusinessAccessBySlug } from '@/lib/backoffice/access'
import { hasBusinessPermission } from '@/lib/backoffice/policy'
import { EmptyState } from '@/components/dashboard/page-header'

const steps = [
  {
    title: 'Elige la fuente',
    description: 'Tu ficha de Google o la web que ya tienes.',
  },
  {
    title: 'Revisa la vista previa',
    description:
      'Te mostramos el perfil, los servicios y el horario detectados.',
  },
  {
    title: 'Aplica lo que quieras',
    description: 'Marca solo los bloques que te interesan y guárdalos.',
  },
]

export default async function BusinessGenerationPage({
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
  if (!hasBusinessPermission(access.role, 'content.write'))
    return (
      <EmptyState
        title="La generación la gestiona el propietario"
        description="Puedes consultar el contenido compartido. Para regenerarlo o publicarlo, contacta con el propietario del negocio."
      />
    )

  const base = `/dashboard/businesses/${slug}`
  const editLinks = [
    { href: `${base}/settings`, label: 'Perfil y descripción' },
    { href: `${base}/services`, label: 'Servicios' },
    { href: `${base}/hours`, label: 'Horario' },
  ]

  return (
    <div className="grid gap-6 pb-10 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="min-w-0">
        <SourceGenerationPanel businessId={business.id} locale="es" />
      </div>

      <aside className="space-y-6">
        <section
          aria-labelledby="generation-how-title"
          className="bg-card ring-border rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1"
        >
          <h2
            id="generation-how-title"
            className="text-foreground text-sm font-semibold"
          >
            Cómo funciona
          </h2>
          <ol className="mt-4 space-y-4">
            {steps.map((step, index) => (
              <li key={step.title} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="bg-secondary text-secondary-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums"
                >
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-foreground text-sm font-medium">
                    {step.title}
                  </p>
                  <p className="text-muted-foreground text-xs leading-5">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section
          aria-labelledby="generation-edit-title"
          className="bg-card ring-border overflow-hidden rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1"
        >
          <div className="p-5 pb-3">
            <h2
              id="generation-edit-title"
              className="text-foreground text-sm font-semibold"
            >
              Ajusta los detalles a mano
            </h2>
            <p className="text-muted-foreground mt-1 text-xs leading-5">
              Después de aplicar, puedes editar cualquier dato cuando quieras.
            </p>
          </div>
          <ul className="border-border divide-border divide-y border-t">
            {editLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group text-foreground hover:bg-muted/50 focus-visible:bg-muted/60 flex items-center justify-between gap-3 px-5 py-3 text-sm font-medium transition-colors focus-visible:outline-none"
                >
                  {link.label}
                  <ArrowRight
                    className="text-muted-foreground/60 group-hover:text-primary size-4 transition-[color,transform] group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </aside>
    </div>
  )
}
