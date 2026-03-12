import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CheckCircle2, Circle, Globe2, MapPin, Phone, User } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getBusinessBySlug } from '@/lib/supabase/actions'

export default async function BusinessOverviewPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const business = await getBusinessBySlug(slug)

  if (!business) {
    notFound()
  }

  const t = {
    es: {
      profile: 'Perfil del negocio',
      profileDesc: 'Información principal que verán tus clientes en canales públicos.',
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
      setupDesc: 'Completa estos puntos para tener una operación estable y lista para escalar.',
      configure: 'Ir a configuración',
      done: 'Completado',
      pending: 'Pendiente',
      tasks: {
        category: 'Definir categoría del negocio',
        description: 'Publicar descripción comercial',
        contact: 'Configurar teléfono o email',
        address: 'Añadir dirección',
        website: 'Conectar sitio web',
      },
    },
    ca: {
      profile: 'Perfil del negoci',
      profileDesc: 'Informació principal que veuran els teus clients en canals públics.',
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
      setupDesc: 'Completa aquests punts per tenir una operació estable i preparada per escalar.',
      configure: 'Anar a configuració',
      done: 'Completat',
      pending: 'Pendent',
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
    { key: 'category', label: t.tasks.category, done: Boolean(business.category?.trim()) },
    { key: 'description', label: t.tasks.description, done: Boolean(business.description?.trim()) },
    {
      key: 'contact',
      label: t.tasks.contact,
      done: Boolean(business.phone?.trim()) || Boolean(business.email?.trim()),
    },
    { key: 'address', label: t.tasks.address, done: Boolean(business.address?.trim()) },
    { key: 'website', label: t.tasks.website, done: Boolean(business.website?.trim()) },
  ]

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle>{t.profile}</CardTitle>
          <CardDescription>{t.profileDesc}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{t.category}</p>
            <p className="text-sm font-medium text-slate-900">{business.category || t.empty}</p>
          </div>

          <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{t.description}</p>
            <p className="whitespace-pre-wrap text-sm text-slate-700">{business.description || t.empty}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.contact}</CardTitle>
          <CardDescription>{t.contactDesc}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700">
            <MapPin className="h-4 w-4 text-slate-500" />
            {business.address || t.empty}
          </div>
          <div className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700">
            <Phone className="h-4 w-4 text-slate-500" />
            {business.phone || t.empty}
          </div>
          <div className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700">
            <User className="h-4 w-4 text-slate-500" />
            {business.email || t.empty}
          </div>
          <div className="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700">
            <Globe2 className="h-4 w-4 text-slate-500" />
            {business.website || t.empty}
          </div>
        </CardContent>
      </Card>

      <Card className="xl:col-span-3">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>{t.setup}</CardTitle>
            <CardDescription>{t.setupDesc}</CardDescription>
          </div>
          <Button asChild variant="outline" className="w-fit">
            <Link href={`/${locale}/dashboard/businesses/${slug}/settings`}>{t.configure}</Link>
          </Button>
        </CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {setupTasks.map((task) => (
            <div key={task.key} className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2">
              <div className="flex items-center gap-2 text-sm text-slate-700">
                {task.done ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <Circle className="h-4 w-4 text-slate-400" />
                )}
                <span>{task.label}</span>
              </div>
              <Badge variant={task.done ? 'secondary' : 'outline'}>
                {task.done ? t.done : t.pending}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
