'use client'

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import {
  Building2,
  Home,
  PlusCircle,
  Settings,
  HelpCircle,
  Search,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { DashboardContent } from './dashboard-constants'

export function SidebarMainItems({ t }: { t: DashboardContent }) {
  const pathname = usePathname()

  const mainNavItems = [
    {
      id: 'dashboard',
      href: `/dashboard`,
      icon: Home,
      label: t.menu.dashboard,
      active: pathname === `/dashboard`,
    },
    {
      id: 'businesses',
      href: `/dashboard/businesses`,
      icon: Building2,
      label: t.menu.businesses,
      active:
        pathname === `/dashboard/businesses` ||
        pathname.startsWith(`/dashboard/businesses/`),
    },
    {
      id: 'new',
      href: `/dashboard/new`,
      icon: PlusCircle,
      label: t.menu.newBusiness,
      active: pathname === `/dashboard/new`,
    },
    {
      id: 'generation',
      href: `/dashboard/generation`,
      icon: Sparkles,
      label: t.menu.generation,
      active: pathname === `/dashboard/generation`,
    },
  ]

  return (
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
  )
}

export function SidebarTopItems({ t }: { t: DashboardContent }) {
  const pathname = usePathname()

  const topNavItems = [
    {
      id: 'settings',
      href: `/dashboard/settings`,
      icon: Settings,
      label: t.menu.settings,
      active: pathname === `/dashboard/settings`,
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

  return (
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
  )
}
