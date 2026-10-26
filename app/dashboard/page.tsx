import { getBusinesses } from '@/lib/backoffice/queries'
import { getBackofficeProfile as getProfile } from '@/lib/backoffice/session'
import { getPlatformHost } from '@/lib/backoffice/platform'
import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  Building2,
  Globe2,
  Plus,
  Sparkles,
  Wand2,
} from 'lucide-react'
import Link from 'next/link'
import {
  EmptyState,
  PageHeader,
  StatCard,
} from '@/components/dashboard/page-header'
import { BusinessCard } from '@/components/dashboard/business-card'

function getGreeting() {
  const hour = Number(
    new Intl.DateTimeFormat('es-ES', {
      hour: 'numeric',
      hour12: false,
      timeZone: 'Europe/Madrid',
    }).format(new Date())
  )
  if (hour < 13) return 'Buenos días,'
  if (hour < 21) return 'Buenas tardes,'
  return 'Buenas noches,'
}

export default async function DashboardPage() {
  const [businesses, profile] = await Promise.all([
    getBusinesses(),
    getProfile(),
  ])

  const firstName =
    (profile?.full_name as string | undefined)?.trim().split(/\s+/)[0] ||
    'de nuevo'
  const platformHost = getPlatformHost()
  const today = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'Europe/Madrid',
  }).format(new Date())

  const activeCustomDomains = businesses.filter(
    (business) =>
      business.custom_domain && business.custom_domain_status === 'active'
  ).length
  const withoutDescription = businesses.filter(
    (business) => !business.description?.trim()
  ).length

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow={today}
        title={getGreeting()}
        accent={`${firstName}.`}
        description="Este es el pulso de tus negocios. Mantén tus webs al día y convierte más visitas en clientes."
        actions={
          <Button variant="outline" asChild>
            <Link href="/dashboard/generation">
              <Sparkles aria-hidden="true" />
              Generar con IA
            </Link>
          </Button>
        }
      />

      <section
        aria-label="Resumen"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <StatCard
          label="Negocios activos"
          value={businesses.length}
          hint="Ver todos tus negocios"
          icon={Building2}
          href="/dashboard/businesses"
        />
        <StatCard
          label="Dominios propios activos"
          value={activeCustomDomains}
          hint={
            activeCustomDomains === businesses.length && businesses.length > 0
              ? 'Todo conectado'
              : 'Conecta tu propio dominio'
          }
          icon={Globe2}
          href="/dashboard/businesses"
        />
        <Link
          href="/dashboard/generation"
          className="group bg-primary text-primary-foreground focus-visible:ring-ring relative overflow-hidden rounded-xl p-5 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.7)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:col-span-2 lg:col-span-1"
        >
          <div className="relative flex h-full flex-col">
            <span className="flex size-8 items-center justify-center rounded-lg bg-white/10">
              <Wand2 className="size-4 text-white" aria-hidden="true" />
            </span>
            <p className="mt-4 text-[15px] font-semibold tracking-[-0.01em]">
              Mejora tu web con IA
            </p>
            <p className="mt-1 text-sm leading-5 text-white/70">
              {withoutDescription > 0
                ? `${withoutDescription} ${withoutDescription === 1 ? 'negocio necesita' : 'negocios necesitan'} contenido.`
                : 'Regenera textos y bloques desde Google o tu web actual.'}
            </p>
            <span className="mt-auto flex items-center gap-1.5 pt-4 text-sm font-medium text-white">
              Empezar
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </span>
          </div>
        </Link>
      </section>

      <section aria-labelledby="recent-businesses" className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2
              id="recent-businesses"
              className="text-foreground text-lg font-semibold tracking-[-0.02em]"
            >
              Tus negocios
            </h2>
            <p className="text-muted-foreground text-sm">
              Los más recientes primero.
            </p>
          </div>
          {businesses.length > 4 ? (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/businesses">
                Ver todos
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          ) : null}
        </div>

        {businesses.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="Aún no tienes ningún negocio"
            description="Busca tu negocio en Google o pega tu web actual y la IA creará una página lista para publicar en minutos."
            action={
              <Button asChild size="lg">
                <Link href="/dashboard/new">
                  <Plus aria-hidden="true" />
                  Crear mi primer negocio
                </Link>
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {businesses.slice(0, 4).map((business) => (
              <BusinessCard
                key={business.id}
                business={business}
                platformHost={platformHost}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
