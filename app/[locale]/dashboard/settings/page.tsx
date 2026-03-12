import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronRight, CreditCard, ShieldCheck, UserCircle } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardSettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  const t = {
    es: {
      title: 'Configuración',
      subtitle: 'Administra preferencias de cuenta, seguridad y facturación.',
      profile: {
        title: 'Perfil',
        description: 'Actualiza tu nombre, usuario y sitio web.',
      },
      subscription: {
        title: 'Suscripción',
        description: 'Revisa tu plan, mejoras y facturación.',
      },
      security: {
        title: 'Seguridad',
        description: 'Gestiona acceso y credenciales desde tu cuenta.',
      },
      goTo: 'Ir',
      profileLink: 'Perfil',
      subscriptionLink: 'Suscripción',
    },
    ca: {
      title: 'Configuració',
      subtitle: 'Administra preferències de compte, seguretat i facturació.',
      profile: {
        title: 'Perfil',
        description: 'Actualitza el teu nom, usuari i lloc web.',
      },
      subscription: {
        title: 'Subscripció',
        description: 'Revisa el teu pla, millores i facturació.',
      },
      security: {
        title: 'Seguretat',
        description: 'Gestiona accés i credencials des del teu compte.',
      },
      goTo: 'Anar',
      profileLink: 'Perfil',
      subscriptionLink: 'Subscripció',
    },
  }[locale === 'ca' ? 'ca' : 'es']

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{t.title}</h1>
        <p className="text-sm text-slate-600">{t.subtitle}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader className="space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-slate-50">
              <UserCircle className="h-5 w-5 text-slate-600" />
            </div>
            <CardTitle className="text-base">{t.profile.title}</CardTitle>
            <CardDescription>{t.profile.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full justify-between">
              <Link href={`/${locale}/dashboard/profile`}>
                {t.profileLink}
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-slate-50">
              <CreditCard className="h-5 w-5 text-slate-600" />
            </div>
            <CardTitle className="text-base">{t.subscription.title}</CardTitle>
            <CardDescription>{t.subscription.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full justify-between">
              <Link href={`/${locale}/dashboard/subscription`}>
                {t.subscriptionLink}
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 xl:col-span-1">
          <CardHeader className="space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-slate-50">
              <ShieldCheck className="h-5 w-5 text-slate-600" />
            </div>
            <CardTitle className="text-base">{t.security.title}</CardTitle>
            <CardDescription>{t.security.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href={`/${locale}/signin`}>{t.goTo}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
