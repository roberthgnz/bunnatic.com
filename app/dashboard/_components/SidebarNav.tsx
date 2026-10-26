'use client'

import {
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import {
  Building2,
  Home,
  LifeBuoy,
  PlusCircle,
  Settings,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { DashboardContent } from './dashboard-constants'

type NavItem = {
  id: string
  href: string
  icon: typeof Home
  label: string
  active: boolean
  external?: boolean
}

function NavList({ items }: { items: NavItem[] }) {
  return (
    <SidebarMenu className="gap-0.5">
      {items.map((item) => (
        <SidebarMenuItem key={item.id}>
          <SidebarMenuButton
            asChild
            isActive={item.active}
            tooltip={item.label}
            className="text-sidebar-foreground/75 data-[active=true]:bg-card data-[active=true]:text-sidebar-accent-foreground data-[active=true]:ring-sidebar-border h-9 font-medium data-[active=true]:shadow-[0_1px_2px_rgba(0,0,0,0.06)] data-[active=true]:ring-1"
          >
            <Link
              href={item.href}
              aria-current={item.active ? 'page' : undefined}
              {...(item.external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
            >
              <item.icon
                className={
                  item.active ? 'text-primary' : 'text-sidebar-foreground/55'
                }
              />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}

export function SidebarMainItems({ t }: { t: DashboardContent }) {
  const pathname = usePathname() ?? ''

  const items: NavItem[] = [
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
      active: pathname.startsWith(`/dashboard/businesses`),
    },
    {
      id: 'generation',
      href: `/dashboard/generation`,
      icon: Sparkles,
      label: t.menu.generation,
      active: pathname === `/dashboard/generation`,
    },
    {
      id: 'new',
      href: `/dashboard/new`,
      icon: PlusCircle,
      label: t.menu.newBusiness,
      active: pathname === `/dashboard/new`,
    },
  ]

  return (
    <>
      <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs font-medium">
        {t.platform}
      </SidebarGroupLabel>
      <NavList items={items} />
    </>
  )
}

export function SidebarTopItems({ t }: { t: DashboardContent }) {
  const pathname = usePathname() ?? ''

  const items: NavItem[] = [
    {
      id: 'settings',
      href: `/dashboard/settings`,
      icon: Settings,
      label: t.menu.settings,
      active: pathname === `/dashboard/settings`,
    },
    {
      id: 'help',
      href: `mailto:hello@locavo.com?subject=${encodeURIComponent('Ayuda con Locavo')}`,
      icon: LifeBuoy,
      label: t.menu.getHelp,
      active: false,
      external: true,
    },
  ]

  return <NavList items={items} />
}
