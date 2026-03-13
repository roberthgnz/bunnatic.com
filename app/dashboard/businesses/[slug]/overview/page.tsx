'use client'

import Link from 'next/link'
import {
  CheckCircle2,
  Circle,
  Globe2,
  MapPin,
  Phone,
  User,
  ExternalLink,
  Settings,
  ChevronRight,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useBusiness } from '../_components/BusinessContext'

export default function BusinessOverviewPage() {
  const { business } = useBusiness()
  const slug = business.slug
  const locale: string = 'es'

  const t = {
    es: {
      profile: 'Perfil del negocio',
      profileDesc:
        'Información principal que verán tus clientes en canales públicos.',
      category: 'Categoría',
      description: 'Descripción',
      contact: 'Contacto',
      contactDesc: 'Canales de contacto para reservas, consultas y soporte.',
      address: 'Dirección',
      phone: 'Teléfono',
      email: 'Email',
      website: 'Sitio web',
      empty: 'Sin definir',
      setup: 'Checklist de configuración',
      setupDesc:
        'Completa estos puntos para tener una operación estable y lista para escalar.',
      configure: 'Ir a configuración',
      done: 'Completado',
      pending: 'Pendiente',
      status: 'Estado',
      ready: 'Activo',
      tasks: {
        category: 'Definir categoría del negocio',
        description: 'Publicar descripción comercial',
        contact: 'Configurar teléfono o email',
        address: 'Añadir dirección',
        website: 'Connectar sitio web',
      },
    },
    ca: {
      profile: 'Perfil del negoci',
      profileDesc:
        'Informació principal que veuran els teus clients en canals públics.',
      category: 'Categoria',
      description: 'Descripció',
      contact: 'Contacte',
      contactDesc: 'Canals de contacte per reserves, consultes i suport.',
      address: 'Adreça',
      phone: 'Telèfon',
      email: 'Email',
      website: 'Lloc web',
      empty: 'Sense definir',
      setup: 'Checklist de configuració',
      setupDesc:
        'Completa aquests punts per tenir una operació estable i preparada per escalar.',
      configure: 'Anar a configuració',
      done: 'Completat',
      pending: 'Pendent',
      status: 'Estat',
      ready: 'Actiu',
      tasks: {
        category: 'Definir categoria del negoci',
        description: 'Publicar descripció comercial',
        contact: 'Configurar telèfon o email',
        address: 'Afegir adreça',
        website: 'Connectar lloc web',
      },
    },
  }[locale === 'ca' ? 'ca' : 'es']

  const setupTasks = [
    {
      key: 'category',
      label: t.tasks.category,
      done: Boolean(business.category?.trim()),
    },
    {
      key: 'description',
      label: t.tasks.description,
      done: Boolean(business.description?.trim()),
    },
    {
      key: 'contact',
      label: t.tasks.contact,
      done: Boolean(business.phone?.trim()) || Boolean(business.email?.trim()),
    },
    {
      key: 'address',
      label: t.tasks.address,
      done: Boolean(business.address?.trim()),
    },
    {
      key: 'website',
      label: t.tasks.website,
      done: Boolean(business.website?.trim()),
    },
  ]

  const recommendationsCount = setupTasks.filter((t) => !t.done).length

  return (
    <div className="flex w-full flex-col gap-6 pb-10">
      {/* Top Section - Production Deployment Style */}
      <Card className="overflow-hidden rounded-xl border-slate-200 shadow-sm">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4 sm:flex-row sm:items-center">
          <div className="font-medium text-slate-900">{t.profile}</div>
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="hidden h-8 text-xs font-medium sm:flex"
            >
              <Link href={`/${locale}/dashboard/businesses/${slug}/settings`}>
                <Settings className="mr-2 h-3.5 w-3.5" />
                {t.configure}
              </Link>
            </Button>
            <Button asChild size="sm" className="h-8 text-xs font-medium">
              <Link href={`/${locale}/w/${slug}`} target="_blank">
                Visit
                <ExternalLink className="ml-2 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Content Split */}
        <div className="flex flex-col bg-white md:flex-row">
          {/* Left Large Area */}
          <div className="flex min-h-[280px] flex-1 flex-col items-center justify-center border-b border-slate-200 bg-slate-50/50 p-8 md:border-r md:border-b-0 md:p-16">
            <h2 className="mb-2 text-center text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
              {business.name || t.profile}
            </h2>
          </div>

          {/* Right Details Area */}
          <div className="flex w-full flex-col justify-center space-y-6 p-6 md:w-96">
            <div>
              <div className="mb-1 text-xs text-slate-500">{t.description}</div>
              <div className="line-clamp-3 text-sm font-medium text-slate-900">
                {business.description || (
                  <span className="font-normal text-slate-400 italic">
                    {t.empty}
                  </span>
                )}
              </div>
            </div>

            <div>
              <div className="mb-1 text-xs text-slate-500">{t.category}</div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                {business.category ? (
                  business.category
                ) : (
                  <span className="font-normal text-slate-400 italic">
                    {t.empty}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div>
                <div className="mb-1 text-xs text-slate-500">{t.status}</div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  {t.ready}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Row */}
        <div className="flex items-center gap-3 border-t border-slate-200 bg-slate-50/50 px-6 py-3">
          <Link
            href={`/${locale}/dashboard/businesses/${slug}/settings`}
            className="flex items-center gap-1 text-sm font-medium text-slate-700 transition-colors hover:text-slate-900"
          >
            <ChevronRight className="h-4 w-4 text-slate-400" />
            {t.configure}
          </Link>
          {recommendationsCount > 0 && (
            <Badge
              variant="secondary"
              className="border-blue-200 bg-blue-50 text-xs font-normal text-blue-700 hover:bg-blue-50"
            >
              {recommendationsCount} Recomendaciones
            </Badge>
          )}
        </div>
      </Card>

      {/* 3 Columns Details */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-xl border-slate-200 shadow-sm transition-colors hover:border-slate-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 px-5 pt-5 pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-900">
              {t.contact}{' '}
              <span className="ml-1 text-xs font-normal text-slate-400">
                24h
              </span>
            </CardTitle>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent className="mt-2 px-5 pb-5">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-slate-400" />
                <div className="flex-1 truncate text-sm text-slate-600">
                  {business.phone || (
                    <span className="text-slate-400 italic">{t.empty}</span>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="mt-0.5 h-4 w-4 text-slate-400" />
                <div className="flex-1 truncate text-sm text-slate-600">
                  {business.email || (
                    <span className="text-slate-400 italic">{t.empty}</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-slate-200 shadow-sm transition-colors hover:border-slate-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 px-5 pt-5 pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-900">
              {t.address}{' '}
              <span className="ml-1 text-xs font-normal text-slate-400">
                6h
              </span>
            </CardTitle>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent className="mt-2 space-y-4 px-5 pb-5">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-slate-400" />
              <div className="line-clamp-2 flex-1 text-sm text-slate-600">
                {business.address || (
                  <span className="text-slate-400 italic">{t.empty}</span>
                )}
              </div>
            </div>
            {/* Fake chart matching Observability vibe */}
            <div className="mt-2 flex h-8 items-end gap-1 px-7 opacity-20">
              <div className="h-[2px] w-full rounded-full bg-blue-500"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-slate-200 shadow-sm transition-colors hover:border-slate-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 px-5 pt-5 pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-900">
              {t.website}{' '}
              <span className="ml-1 text-xs font-normal text-slate-400">
                1w
              </span>
            </CardTitle>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent className="mt-2 px-5 pb-5">
            <div className="flex items-start gap-3">
              <Globe2 className="mt-0.5 h-4 w-4 text-slate-400" />
              <div className="flex-1 truncate text-sm text-slate-600">
                {business.website ? (
                  <a
                    href={
                      business.website.startsWith('http')
                        ? business.website
                        : `https://${business.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-slate-900 hover:underline"
                  >
                    {business.website}
                  </a>
                ) : (
                  <span className="text-slate-400 italic">{t.empty}</span>
                )}
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 pl-7 text-xs text-slate-500">
              <div className="h-2 w-2 rounded-full border border-slate-300"></div>
              0 online
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section - Active Branches Style */}
      <div className="mt-4" id="setup-checklist">
        <h3 className="mb-4 text-lg font-semibold tracking-tight text-slate-900">
          {t.setup}
        </h3>
        <Card className="overflow-hidden rounded-xl border-slate-200 shadow-sm">
          <div className="divide-y divide-slate-100">
            {setupTasks.map((task) => (
              <div
                key={task.key}
                className="flex flex-col justify-between gap-4 bg-white px-5 py-4 transition-colors hover:bg-slate-50/80 sm:flex-row sm:items-center"
              >
                <div className="flex items-center gap-3">
                  <div className="mt-0.5 sm:mt-0">
                    {task.done ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-slate-300" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-900">
                      {task.label}
                    </span>
                    <span className="mt-0.5 text-xs text-slate-500 sm:hidden">
                      {task.done ? t.done : t.pending}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 pl-8 text-sm text-slate-500 sm:pl-0">
                  <Badge
                    variant={task.done ? 'secondary' : 'outline'}
                    className={`hidden sm:inline-flex ${task.done ? 'border-transparent bg-slate-100 text-slate-700 hover:bg-slate-100' : 'text-slate-500'}`}
                  >
                    {task.done ? t.done : t.pending}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden h-8 w-8 p-0 sm:flex"
                    asChild
                  >
                    <Link
                      href={`/${locale}/dashboard/businesses/${slug}/settings`}
                    >
                      <Settings className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
