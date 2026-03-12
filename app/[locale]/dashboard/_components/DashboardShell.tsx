'use client'

import { useLanguage } from '@/components/LanguageProvider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Building2, CreditCard, Home, LogOut, PlusCircle, Settings, User, Zap } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/lib/supabase/actions'
import PlanBadge from './PlanBadge'

const dashboardContent = {
  es: {
    title: 'Bunnatic',
    platform: 'Plataforma',
    account: 'Cuenta',
    menu: {
      dashboard: 'Inicio',
      businesses: 'Mis negocios',
      newBusiness: 'Crear negocio',
      profile: 'Perfil',
      settings: 'Configuración',
      subscription: 'Suscripción',
      logout: 'Cerrar sesión',
    },
  },
  ca: {
    title: 'Bunnatic',
    platform: 'Plataforma',
    account: 'Compte',
    menu: {
      dashboard: 'Inici',
      businesses: 'Els meus negocis',
      newBusiness: 'Crear negoci',
      profile: 'Perfil',
      settings: 'Configuració',
      subscription: 'Subscripció',
      logout: 'Tancar sessió',
    },
  },
} as const

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode
}) {
  const { language } = useLanguage()
  const t = dashboardContent[language]
  const pathname = usePathname()

  const localePrefix = `/${language}`
  const navItems = [
    {
      href: `${localePrefix}/dashboard`,
      icon: Home,
      label: t.menu.dashboard,
      active: pathname === `${localePrefix}/dashboard`,
    },
    {
      href: `${localePrefix}/dashboard/businesses`,
      icon: Building2,
      label: t.menu.businesses,
      active:
        pathname === `${localePrefix}/dashboard/businesses` ||
        pathname.startsWith(`${localePrefix}/dashboard/businesses/`),
    },
    {
      href: `${localePrefix}/dashboard/new`,
      icon: PlusCircle,
      label: t.menu.newBusiness,
      active: pathname === `${localePrefix}/dashboard/new`,
    },
  ]

  const accountItems = [
    {
      href: `${localePrefix}/dashboard/profile`,
      icon: User,
      label: t.menu.profile,
      active: pathname === `${localePrefix}/dashboard/profile`,
    },
    {
      href: `${localePrefix}/dashboard/settings`,
      icon: Settings,
      label: t.menu.settings,
      active: pathname === `${localePrefix}/dashboard/settings`,
    },
    {
      href: `${localePrefix}/dashboard/subscription`,
      icon: CreditCard,
      label: t.menu.subscription,
      active: pathname === `${localePrefix}/dashboard/subscription`,
    },
  ]

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r border-sidebar-border/70">
        <SidebarHeader>
          <div className="flex h-12 items-center gap-2 px-2 text-sidebar-foreground">
            <div className="flex h-8 w-8 items-center justify-center rounded-md border border-emerald-200 bg-emerald-50">
              <Zap className="h-5 w-5 fill-emerald-600 text-emerald-600" />
            </div>
            <span className="truncate text-sm font-semibold">{t.title}</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>{t.platform}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={item.active}>
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>{t.account}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {accountItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={item.active}>
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => logout()}>
                <LogOut />
                <span>{t.menu.logout}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="bg-slate-50/40">
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-white px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
          </div>
          <div className="flex items-center gap-4">
            <PlanBadge />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
