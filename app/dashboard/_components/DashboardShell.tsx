'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
  Building2,
  Home,
  PlusCircle,
  Settings,
  HelpCircle,
  Search,
  ChevronDown,
  MessageSquarePlus,
  Bug,
  Lightbulb,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/lib/supabase/actions'
import { useEffect, useState } from 'react'
import { TeamSwitcher } from '@/components/team-switcher'
import { NavUser } from '@/components/nav-user'

const dashboardContent = {
  title: 'Bunnatic',
  enterprise: 'Enterprise',
  platform: 'Plataforma',
  businesses: 'Negocios',
  addBusiness: 'Agregar negocio',
  menu: {
    dashboard: 'Inicio',
    businesses: 'Mis negocios',
    newBusiness: 'Crear negocio',
    settings: 'Configuración',
    getHelp: 'Obtener ayuda',
    search: 'Buscar',
    giveFeedback: 'Dar feedback',
    feedbackIssue: 'Incidencia',
    feedbackIdea: 'Idea',
    account: 'Cuenta',
    billing: 'Facturación',
    notifications: 'Notificaciones',
    logout: 'Cerrar sesión',
  },
  plans: {
    starter: 'Esencial',
    pro: 'Impulso',
    agency: 'Equipo',
    scale: 'Expansión',
  },
} as const

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode
}) {
  const t = dashboardContent
  const pathname = usePathname()
  const [userProfile, setUserProfile] = useState<{
    full_name?: string | null
    email?: string | null
    avatar_url?: string | null
    plan?: string
  } | null>(null)
  const [businesses, setBusinesses] = useState<
    Array<{ id: string; name: string; slug: string }>
  >([])

  const localePrefix = ''

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch('/api/profile')
        if (response.ok) {
          const data = await response.json()
          setUserProfile(data)
        }
      } catch (error) {
        console.error('Failed to load profile:', error)
      }
    }
    loadProfile()
  }, [])

  useEffect(() => {
    async function loadBusinesses() {
      try {
        const response = await fetch('/api/businesses')
        if (response.ok) {
          const data = await response.json()
          setBusinesses(data)
        }
      } catch (error) {
        console.error('Failed to load businesses:', error)
      }
    }
    loadBusinesses()
  }, [])

  const topNavItems = [
    {
      id: 'settings',
      href: `${localePrefix}/dashboard/settings`,
      icon: Settings,
      label: t.menu.settings,
      active: pathname === `${localePrefix}/dashboard/settings`,
    },
    {
      id: 'help',
      href: '#',
      icon: HelpCircle,
      label: t.menu.getHelp,
      active: false,
    },
    {
      id: 'search',
      href: '#',
      icon: Search,
      label: t.menu.search,
      active: false,
    },
  ]

  const mainNavItems = [
    {
      id: 'dashboard',
      href: `${localePrefix}/dashboard`,
      icon: Home,
      label: t.menu.dashboard,
      active: pathname === `${localePrefix}/dashboard`,
    },
    {
      id: 'businesses',
      href: `${localePrefix}/dashboard/businesses`,
      icon: Building2,
      label: t.menu.businesses,
      active:
        pathname === `${localePrefix}/dashboard/businesses` ||
        pathname.startsWith(`${localePrefix}/dashboard/businesses/`),
    },
    {
      id: 'new',
      href: `${localePrefix}/dashboard/new`,
      icon: PlusCircle,
      label: t.menu.newBusiness,
      active: pathname === `${localePrefix}/dashboard/new`,
    },
  ]

  const getPlanName = (planKey: string | undefined) => {
    if (!planKey) return t.plans.starter
    return t.plans[planKey as keyof typeof t.plans] || t.plans.starter
  }

  const teamSwitcherItems =
    businesses.length > 0
      ? businesses.map((business) => ({
          name: business.name,
          logo: Building2,
          plan: getPlanName(userProfile?.plan),
          href: `${localePrefix}/dashboard/businesses/${business.slug}`,
        }))
      : [
          {
            name: t.title,
            logo: Building2,
            plan: t.enterprise,
            href: `${localePrefix}/dashboard/businesses`,
          },
        ]

  const dashboardRoot = `${localePrefix}/dashboard`
  const currentPath = pathname.startsWith(dashboardRoot)
    ? pathname.slice(dashboardRoot.length)
    : ''
  const pathSegments = currentPath
    .split('/')
    .filter(Boolean)
    .filter((segment) => segment !== 'businesses')

  const segmentLabelMap: Record<string, string> = {
    overview: 'Resumen',
    analytics: 'Analytics',
    calendar: 'Calendario',
    settings: t.menu.settings,
    team: 'Equipo',
    leads: 'Leads',
    hours: 'Horarios',
    services: 'Servicios',
    generation: 'Generación',
    profile: t.menu.account,
    subscription: t.menu.billing,
    new: t.menu.newBusiness,
  }

  const formatSegmentLabel = (segment: string) => {
    if (segmentLabelMap[segment]) {
      return segmentLabelMap[segment]
    }

    return decodeURIComponent(segment)
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase())
  }

  const breadcrumbParentLabel =
    pathSegments.length === 0 ? undefined : t.menu.businesses
  const breadcrumbPageLabel =
    pathSegments.length === 0
      ? t.menu.dashboard
      : formatSegmentLabel(pathSegments[pathSegments.length - 1])

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-sidebar-border/70 border-r">
        <SidebarHeader className="border-sidebar-border border-b">
          <TeamSwitcher
            teams={teamSwitcherItems}
            teamLabel={t.businesses}
            addTeamLabel={t.addBusiness}
            addTeamHref={`${localePrefix}/dashboard/new`}
          />
        </SidebarHeader>

        <SidebarContent className="pt-4">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainNavItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
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

          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <SidebarMenu>
                {topNavItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
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

        <SidebarFooter className="border-sidebar-border border-t">
          <NavUser
            user={{
              name: userProfile?.full_name || 'Usuario',
              email: userProfile?.email || '',
              avatar: userProfile?.avatar_url || '',
            }}
            labels={{
              upgrade: 'Mejorar a Pro',
              account: t.menu.account,
              billing: t.menu.billing,
              notifications: t.menu.notifications,
              logout: t.menu.logout,
            }}
            hrefs={{
              upgrade: `${localePrefix}/dashboard/subscription`,
              account: `${localePrefix}/dashboard/profile`,
              billing: `${localePrefix}/dashboard/subscription`,
            }}
            onLogout={logout}
          />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="bg-slate-50/40">
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-white px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-1 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbParentLabel ? (
                  <>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink
                        href={`${localePrefix}/dashboard/businesses`}
                      >
                        {breadcrumbParentLabel}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                  </>
                ) : null}
                <BreadcrumbItem>
                  <BreadcrumbPage>{breadcrumbPageLabel}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1"
                >
                  <MessageSquarePlus className="size-4" />
                  {t.menu.giveFeedback}
                  <ChevronDown className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem asChild>
                  <Link
                    href={`mailto:hello@bunnatic.com?subject=${encodeURIComponent(t.menu.feedbackIssue)}`}
                  >
                    <Bug className="size-4" />
                    {t.menu.feedbackIssue}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={`mailto:hello@bunnatic.com?subject=${encodeURIComponent(t.menu.feedbackIdea)}`}
                  >
                    <Lightbulb className="size-4" />
                    {t.menu.feedbackIdea}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
