'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ComponentType } from 'react'
import {
  BarChart3,
  Briefcase,
  Calendar as CalendarIcon,
  Clock,
  FileCheck,
  LayoutGrid,
  MessageSquare,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

type NavItem = {
  key: string
  href: string
  label: string
  icon: ComponentType<{ className?: string }>
  featured?: boolean
}

type NavGroup = {
  key: string
  title: string
  items: NavItem[]
}

export default function BusinessSectionNav({
  locale,
  slug,
}: {
  locale: string
  slug: string
}) {
  const pathname = usePathname() ?? ''
  const isCatalan = locale === 'ca'
  const base = `/${locale}/dashboard/businesses/${slug}`

  const groups: NavGroup[] = [
    {
      key: 'operation',
      title: isCatalan ? 'Operació' : 'Operación',
      items: [
        {
          key: 'generation',
          href: `${base}/generation`,
          label: isCatalan ? 'Generació IA' : 'Generación IA',
          icon: Sparkles,
          featured: true,
        },
        { key: 'overview', href: `${base}/overview`, label: isCatalan ? 'Resum' : 'Resumen', icon: LayoutGrid },
        { key: 'services', href: `${base}/services`, label: isCatalan ? 'Serveis' : 'Servicios', icon: Briefcase },
        { key: 'hours', href: `${base}/hours`, label: isCatalan ? 'Horari' : 'Horario', icon: Clock },
      ],
    },
    {
      key: 'growth',
      title: isCatalan ? 'Creixement' : 'Crecimiento',
      items: [
        { key: 'leads', href: `${base}/leads`, label: isCatalan ? 'Missatges' : 'Mensajes', icon: MessageSquare },
        { key: 'analytics', href: `${base}/analytics`, label: 'Analítica', icon: BarChart3 },
        { key: 'calendar', href: `${base}/calendar`, label: isCatalan ? 'Calendari' : 'Calendario', icon: CalendarIcon },
      ],
    },
    {
      key: 'control',
      title: isCatalan ? 'Control' : 'Control',
      items: [
        { key: 'team', href: `${base}/team`, label: isCatalan ? 'Equip' : 'Equipo', icon: Users },
        { key: 'reviews', href: `${base}/reviews`, label: isCatalan ? 'Revisions' : 'Revisiones', icon: FileCheck },
        { key: 'audit', href: `${base}/audit`, label: isCatalan ? 'Auditoria' : 'Auditoría', icon: ShieldCheck },
        {
          key: 'settings',
          href: `${base}/settings`,
          label: isCatalan ? 'Configuració' : 'Configuración',
          icon: Settings,
        },
      ],
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      {groups.map((group) => (
        <section key={group.key}>
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">{group.title}</p>
          <div className="space-y-1">
            {group.items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              const Icon = item.icon
              const featuredClasses = item.featured
                ? isActive
                  ? 'bg-emerald-100/50 text-emerald-900 border-l-[3px] border-emerald-500 shadow-sm'
                  : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 border-l-[3px] border-transparent'
                : ''
              const classes = item.featured
                ? `flex w-full items-center justify-between rounded-r-lg px-3 py-2 text-sm font-medium transition-all ${featuredClasses}`
                : `flex w-full items-center rounded-r-lg px-3 py-2 text-sm font-medium transition-all border-l-[3px] ${
                    isActive
                      ? 'bg-slate-100 text-slate-900 border-slate-900 shadow-sm'
                      : 'border-transparent text-slate-600 hover:bg-slate-100/50 hover:text-slate-900'
                  }`

              return (
                <Link key={item.key} href={item.href} className={classes}>
                  <span className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isActive && !item.featured ? 'text-slate-900' : 'text-slate-500'}`} />
                    {item.label}
                  </span>
                  {item.featured ? (
                    <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-[10px] text-emerald-700 px-1 py-0 h-4 leading-none">
                      AI
                    </Badge>
                  ) : null}
                </Link>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
