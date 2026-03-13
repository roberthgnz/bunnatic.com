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

type NavItem = {
  key: string
  href: string
  label: string
  icon: ComponentType<{ className?: string }>
}

type NavGroup = {
  key: string
  title: string
  items: NavItem[]
}

export default function BusinessSectionNav({ slug }: { slug: string }) {
  const pathname = usePathname() ?? ''
  const base = `/dashboard/businesses/${slug}`

  const groups: NavGroup[] = [
    {
      key: 'operation',
      title: 'Operación',
      items: [
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
        {
          key: 'hours',
          href: `${base}/hours`,
          label: 'Horario',
          icon: Clock,
        },
      ],
    },
    {
      key: 'growth',
      title: 'Crecimiento',
      items: [
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
      ],
    },
    {
      key: 'control',
      title: 'Control',
      items: [
        {
          key: 'team',
          href: `${base}/team`,
          label: 'Equipo',
          icon: Users,
        },
        {
          key: 'settings',
          href: `${base}/settings`,
          label: 'Configuración',
          icon: Settings,
        },
      ],
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <section key={group.key}>
          <p className="px-3 pb-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">
            {group.title}
          </p>
          <div className="space-y-1">
            {group.items.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`)
              const Icon = item.icon
              const classes = `flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-all border-l-[3px] ${
                isActive
                  ? 'bg-slate-100 text-slate-900 border-slate-900 shadow-sm'
                  : 'border-transparent text-slate-600 hover:bg-slate-100/50 hover:text-slate-900'
              }`

              return (
                <Link key={item.key} href={item.href} className={classes}>
                  <span className="flex items-center gap-3">
                    <Icon
                      className={`h-4 w-4 ${isActive ? 'text-slate-900' : 'text-slate-500'}`}
                    />
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
