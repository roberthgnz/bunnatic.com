import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowRight,
  Briefcase,
  Check,
  Clock,
  FileText,
  Globe2,
  Mail,
  MapPin,
  Pencil,
  Phone,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatCard } from '@/components/dashboard/page-header'
import { cn } from '@/lib/utils'
import { getBusinessWorkspace } from '@/lib/backoffice/queries'

function EmptyValue() {
  return <span className="text-muted-foreground/70 italic">Sin definir</span>
}

export default async function BusinessOverviewPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const workspace = await getBusinessWorkspace((await params).slug)
  if (!workspace) notFound()
  const {
    business,
    services,
    workingHours,
    sections,
    setupChecklist,
    setupCompletedCount,
    setupCompletion,
  } = workspace
  const base = `/dashboard/businesses/${business.slug}`

  const [
    hasProfile,
    hasContact,
    hasAddress,
    hasServices,
    hasHours,
    hasPublishedContent,
  ] = setupChecklist

  const setupTasks = [
    {
      key: 'profile',
      label: 'Completa el perfil',
      hint: 'Nombre, categoría y una descripción comercial.',
      done: hasProfile,
      href: `${base}/settings`,
    },
    {
      key: 'contact',
      label: 'Añade un canal de contacto',
      hint: 'Teléfono o email para que te escriban.',
      done: hasContact,
      href: `${base}/settings`,
    },
    {
      key: 'address',
      label: 'Indica tu dirección',
      hint: 'Clave para aparecer en búsquedas locales.',
      done: hasAddress,
      href: `${base}/settings`,
    },
    {
      key: 'services',
      label: 'Publica tus servicios',
      hint: 'Precios y duración ayudan a decidir.',
      done: hasServices,
      href: `${base}/services`,
    },
    {
      key: 'hours',
      label: 'Configura el horario',
      hint: 'Tus clientes sabrán cuándo encontrarte.',
      done: hasHours,
      href: `${base}/hours`,
    },
    {
      key: 'content',
      label: 'Publica el contenido de tu web',
      hint: 'Genera y revisa los bloques con IA.',
      done: hasPublishedContent,
      href: `${base}/generation`,
    },
  ]
  const nextTask = setupTasks.find((task) => !task.done)

  const openDays = workingHours.filter((hour) => !hour.is_closed).length
  const publishedSections = sections.filter(
    (section) => section.status === 'published'
  ).length

  const contactRows = [
    { key: 'phone', icon: Phone, label: 'Teléfono', value: business.phone },
    { key: 'email', icon: Mail, label: 'Email', value: business.email },
    {
      key: 'address',
      icon: MapPin,
      label: 'Dirección',
      value: business.address,
    },
    {
      key: 'website',
      icon: Globe2,
      label: 'Sitio web',
      value: business.website,
      href: business.website
        ? business.website.startsWith('http')
          ? business.website
          : `https://${business.website}`
        : undefined,
    },
  ]

  return (
    <div className="grid gap-6 pb-10 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="min-w-0 space-y-6">
        <section className="grid gap-4 sm:grid-cols-3" aria-label="Métricas">
          <StatCard
            label="Servicios"
            value={services.length}
            hint="Gestionar servicios"
            icon={Briefcase}
            href={`${base}/services`}
          />
          <StatCard
            label="Días abiertos"
            value={`${openDays}/7`}
            hint="Editar horario"
            icon={Clock}
            href={`${base}/hours`}
          />
          <StatCard
            label="Bloques publicados"
            value={publishedSections}
            hint="Revisar contenido"
            icon={FileText}
            href={`${base}/generation`}
          />
        </section>

        <section
          aria-labelledby="setup-title"
          className="bg-card ring-border overflow-hidden rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1"
        >
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h2
                id="setup-title"
                className="text-foreground text-base font-semibold tracking-[-0.01em]"
              >
                {setupCompletion === 100
                  ? 'Tu web está lista'
                  : 'Pon tu web a punto'}
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                {setupCompletedCount} de {setupTasks.length} pasos completados
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-muted h-2 w-40 overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full rounded-full transition-[width] duration-700"
                  style={{ width: `${setupCompletion}%` }}
                />
              </div>
              <span className="text-foreground w-10 text-right text-sm font-semibold tabular-nums">
                {setupCompletion}%
              </span>
            </div>
          </div>

          <ol className="border-border divide-border divide-y border-t">
            {setupTasks.map((task) => (
              <li key={task.key}>
                <Link
                  href={task.href}
                  className={cn(
                    'group hover:bg-muted/50 focus-visible:bg-muted/60 flex items-center gap-4 px-5 py-3.5 transition-colors focus-visible:outline-none sm:px-6',
                    task === nextTask && 'bg-accent/40'
                  )}
                >
                  <span
                    className={cn(
                      'flex size-6 shrink-0 items-center justify-center rounded-full ring-1',
                      task.done
                        ? 'bg-primary text-primary-foreground ring-primary'
                        : 'bg-card ring-border text-transparent'
                    )}
                  >
                    <Check className="size-3.5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        'block text-sm font-medium',
                        task.done ? 'text-muted-foreground' : 'text-foreground'
                      )}
                    >
                      {task.label}
                    </span>
                    {!task.done ? (
                      <span className="text-muted-foreground block text-xs">
                        {task.hint}
                      </span>
                    ) : null}
                  </span>
                  <span className="sr-only">
                    {task.done ? 'Completado' : 'Pendiente'}
                  </span>
                  {task === nextTask ? (
                    <span className="text-primary hidden items-center gap-1 text-xs font-medium sm:flex">
                      Siguiente paso
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  ) : (
                    <ArrowRight
                      className="text-muted-foreground/50 size-4 opacity-0 transition-opacity group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <aside className="space-y-6">
        <section
          aria-labelledby="profile-title"
          className="bg-card ring-border rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1"
        >
          <div className="flex items-center justify-between gap-2">
            <h2
              id="profile-title"
              className="text-foreground text-sm font-semibold"
            >
              Perfil público
            </h2>
            <Button variant="ghost" size="icon-sm" asChild>
              <Link href={`${base}/settings`} aria-label="Editar perfil">
                <Pencil aria-hidden="true" />
              </Link>
            </Button>
          </div>
          <dl className="mt-4 space-y-4 text-sm">
            <div>
              <dt className="text-muted-foreground text-xs">Categoría</dt>
              <dd className="text-foreground mt-0.5 font-medium">
                {business.category || <EmptyValue />}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground text-xs">Descripción</dt>
              <dd className="text-foreground mt-0.5 line-clamp-4 leading-6">
                {business.description || <EmptyValue />}
              </dd>
            </div>
          </dl>
        </section>

        <section
          aria-labelledby="contact-title"
          className="bg-card ring-border rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1"
        >
          <div className="flex items-center justify-between gap-2">
            <h2
              id="contact-title"
              className="text-foreground text-sm font-semibold"
            >
              Contacto
            </h2>
            <Button variant="ghost" size="icon-sm" asChild>
              <Link href={`${base}/settings`} aria-label="Editar contacto">
                <Pencil aria-hidden="true" />
              </Link>
            </Button>
          </div>
          <dl className="mt-4 space-y-3.5 text-sm">
            {contactRows.map((row) => (
              <div key={row.key} className="flex items-start gap-3">
                <span className="bg-secondary text-secondary-foreground flex size-8 shrink-0 items-center justify-center rounded-lg">
                  <row.icon className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <dt className="text-muted-foreground text-xs">{row.label}</dt>
                  <dd className="text-foreground truncate font-medium">
                    {row.value ? (
                      row.href ? (
                        <a
                          href={row.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary underline-offset-4 hover:underline"
                        >
                          {row.value}
                        </a>
                      ) : (
                        row.value
                      )
                    ) : (
                      <EmptyValue />
                    )}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </section>
      </aside>
    </div>
  )
}
