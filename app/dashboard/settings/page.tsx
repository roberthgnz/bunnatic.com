import {
  ChevronRight,
  CreditCard,
  ShieldCheck,
  UserCircle,
  type LucideIcon,
} from 'lucide-react'
import Link from 'next/link'
import { PageHeader } from '@/components/dashboard/page-header'

type SettingsItem = {
  key: string
  icon: LucideIcon
  title: string
  description: string
  action: string
  href: string
}

function SettingsGroup({
  id,
  title,
  description,
  items,
}: {
  id: string
  title: string
  description: string
  items: SettingsItem[]
}) {
  return (
    <section
      aria-labelledby={id}
      className="bg-card ring-border overflow-hidden rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1"
    >
      <div className="border-border border-b px-5 py-4">
        <h2
          id={id}
          className="text-foreground text-base font-semibold tracking-[-0.01em]"
        >
          {title}
        </h2>
        <p className="text-muted-foreground mt-1 text-sm">{description}</p>
      </div>
      <ul className="divide-border divide-y">
        {items.map((item) => (
          <li key={item.key}>
            <Link
              href={item.href}
              className="group hover:bg-muted/50 focus-visible:bg-muted/60 focus-visible:ring-ring flex items-center gap-4 px-5 py-4 transition-colors focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset"
            >
              <span className="bg-secondary text-secondary-foreground flex size-9 shrink-0 items-center justify-center rounded-lg">
                <item.icon className="size-4" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="text-foreground block text-sm font-medium">
                  {item.title}
                </span>
                <span className="text-muted-foreground block text-sm">
                  {item.description}
                </span>
              </span>
              <span className="text-muted-foreground group-hover:text-foreground hidden items-center gap-1 text-sm font-medium transition-colors sm:flex">
                {item.action}
              </span>
              <ChevronRight
                className="text-muted-foreground/60 group-hover:text-foreground size-4 shrink-0 transition-[color,transform] group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default async function DashboardSettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  const t = {
    es: {
      eyebrow: 'Cuenta',
      title: 'Configuración',
      accent: 'general',
      subtitle: 'Administra tus datos de cuenta, el acceso y la facturación.',
      account: {
        title: 'Cuenta',
        description: 'Tu información personal y tu plan.',
      },
      securityGroup: {
        title: 'Seguridad',
        description: 'Controla cómo accedes a Locavo.',
      },
      profile: {
        title: 'Perfil',
        description: 'Actualiza tu nombre, usuario y sitio web.',
        action: 'Editar',
      },
      subscription: {
        title: 'Suscripción y facturación',
        description: 'Revisa tu plan, cámbialo o mejóralo.',
        action: 'Gestionar',
      },
      security: {
        title: 'Acceso y credenciales',
        description: 'Vuelve a iniciar sesión o cambia tus credenciales.',
        action: 'Ir',
      },
    },
    ca: {
      eyebrow: 'Compte',
      title: 'Configuració',
      accent: 'general',
      subtitle: "Administra les dades del compte, l'accés i la facturació.",
      account: {
        title: 'Compte',
        description: 'La teva informació personal i el teu pla.',
      },
      securityGroup: {
        title: 'Seguretat',
        description: 'Controla com accedeixes a Locavo.',
      },
      profile: {
        title: 'Perfil',
        description: 'Actualitza el teu nom, usuari i lloc web.',
        action: 'Editar',
      },
      subscription: {
        title: 'Subscripció i facturació',
        description: 'Revisa el teu pla, canvia’l o millora’l.',
        action: 'Gestionar',
      },
      security: {
        title: 'Accés i credencials',
        description: 'Torna a iniciar sessió o canvia les teves credencials.',
        action: 'Anar',
      },
    },
  }[locale === 'ca' ? 'ca' : 'es']

  return (
    <div className="max-w-3xl space-y-8">
      <PageHeader
        eyebrow={t.eyebrow}
        title={t.title}
        accent={t.accent}
        description={t.subtitle}
      />

      <SettingsGroup
        id="settings-account"
        title={t.account.title}
        description={t.account.description}
        items={[
          {
            key: 'profile',
            icon: UserCircle,
            title: t.profile.title,
            description: t.profile.description,
            action: t.profile.action,
            href: '/dashboard/profile',
          },
          {
            key: 'subscription',
            icon: CreditCard,
            title: t.subscription.title,
            description: t.subscription.description,
            action: t.subscription.action,
            href: '/dashboard/subscription',
          },
        ]}
      />

      <SettingsGroup
        id="settings-security"
        title={t.securityGroup.title}
        description={t.securityGroup.description}
        items={[
          {
            key: 'security',
            icon: ShieldCheck,
            title: t.security.title,
            description: t.security.description,
            action: t.security.action,
            href: '/signin',
          },
        ]}
      />
    </div>
  )
}
