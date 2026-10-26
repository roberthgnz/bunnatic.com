'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ComponentType } from 'react'
import {
  BarChart3,
  Briefcase,
  Calendar as CalendarIcon,
  Clock,
  LayoutGrid,
  MessageSquare,
  Settings,
  Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type NavItem = {
  key: string
  href: string
  label: string
  icon: ComponentType<{ className?: string }>
}

export default function BusinessSectionNav({ slug }: { slug: string }) {
  const pathname = usePathname() ?? ''
  const base = `/dashboard/businesses/${slug}`

  const items: NavItem[] = [
    {
      key: 'overview',
      href: `${base}/overview`,
      label: 'Resumen',
      icon: LayoutGrid,
    },
    {
      key: 'services',
      href: `${base}/services`,
      label: 'Servicios',
      icon: Briefcase,
    },
    { key: 'hours', href: `${base}/hours`, label: 'Horario', icon: Clock },
    {
      key: 'leads',
      href: `${base}/leads`,
      label: 'Mensajes',
      icon: MessageSquare,
    },
    {
      key: 'analytics',
      href: `${base}/analytics`,
      label: 'Analítica',
      icon: BarChart3,
    },
    {
      key: 'calendar',
      href: `${base}/calendar`,
      label: 'Calendario',
      icon: CalendarIcon,
    },
    { key: 'team', href: `${base}/team`, label: 'Equipo', icon: Users },
    {
      key: 'settings',
      href: `${base}/settings`,
      label: 'Configuración',
      icon: Settings,
    },
  ]

  return (
    <nav
      aria-label="Secciones del negocio"
      className="bg-background/85 supports-[backdrop-filter]:bg-background/70 sticky top-14 z-20 -mx-4 border-b px-4 backdrop-blur-md md:-mx-8 md:px-8"
    >
      <ul className="-mb-px flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => {
          const isActive =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`) ||
            (item.key === 'overview' && pathname === base)
          const Icon = item.icon

          return (
            <li key={item.key} className="shrink-0">
              <Link
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'focus-visible:ring-ring relative flex h-11 items-center gap-2 rounded-t-md px-3 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                  'after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full after:transition-colors',
                  isActive
                    ? 'text-foreground after:bg-primary'
                    : 'text-muted-foreground hover:text-foreground after:bg-transparent'
                )}
              >
                <Icon
                  className={cn(
                    'size-4',
                    isActive ? 'text-primary' : 'text-muted-foreground/80'
                  )}
                />
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
