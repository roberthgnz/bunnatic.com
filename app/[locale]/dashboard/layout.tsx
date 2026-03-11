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
import { Building2, Home, LogOut, Settings, User, Zap } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/lib/supabase/actions'

const dashboardContent = {
  es: {
    title: 'Bunnatic',
    menu: {
      dashboard: 'Inicio',
      businesses: 'Mis negocios',
      profile: 'Perfil',
      settings: 'Configuración',
      logout: 'Cerrar sesión',
    },
  },
  ca: {
    title: 'Bunnatic',
    menu: {
      dashboard: 'Inici',
      businesses: 'Els meus negocis',
      profile: 'Perfil',
      settings: 'Configuració',
      logout: 'Tancar sessió',
    },
  },
} as const

import PlanBadge from './_components/PlanBadge'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { language } = useLanguage()
  const t = dashboardContent[language]
  const pathname = usePathname()

  const localePrefix = `/${language}`

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex h-12 items-center gap-2 px-2 text-sidebar-foreground">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
              <Zap className="h-5 w-5 fill-emerald-600 text-emerald-600" />
            </div>
            <span className="truncate font-bold">{t.title}</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === `${localePrefix}/dashboard`}>
                    <Link href={`${localePrefix}/dashboard`}>
                      <Home />
                      <span>{t.menu.dashboard}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname.startsWith(`${localePrefix}/dashboard/businesses`)}>
                    <Link href={`${localePrefix}/dashboard`}>
                      <Building2 />
                      <span>{t.menu.businesses}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>User</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === `${localePrefix}/dashboard/profile`}>
                    <Link href={`${localePrefix}/dashboard/profile`}>
                      <User />
                      <span>{t.menu.profile}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === `${localePrefix}/dashboard/settings`}>
                    <Link href={`${localePrefix}/dashboard/settings`}>
                      <Settings />
                      <span>{t.menu.settings}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
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
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
          </div>
          <div className="flex items-center gap-4">
             <PlanBadge plan="Impulso" />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
