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
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { DashboardContent } from './dashboard-constants'

export function SidebarMainItems({ t }: { t: DashboardContent }) {
  const pathname = usePathname()
  const localePrefix = ''

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
  const localePrefix = ''

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
