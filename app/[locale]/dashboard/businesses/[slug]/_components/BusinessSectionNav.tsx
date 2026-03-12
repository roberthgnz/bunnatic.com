'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ComponentType } from 'react'
import {
  Sparkles,
  LayoutGrid,
  Briefcase,
  Clock,
  MessageSquare,
  BarChart3,
  Users,
  Calendar as CalendarIcon,
  FileCheck,
  ShieldCheck,
  Settings,
} from 'lucide-react'

type SectionItem = {
  key: string
  href: string
  label: string
  icon: ComponentType<{ className?: string }>
  highlight?: boolean
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

  const items: SectionItem[] = [
    {
      key: 'generation',
      href: `${base}/generation`,
      label: isCatalan ? 'Generació IA' : 'Generación IA',
      icon: Sparkles,
      highlight: true,
    },
    { key: 'overview', href: `${base}/overview`, label: isCatalan ? 'Resum' : 'Resumen', icon: LayoutGrid },
    { key: 'services', href: `${base}/services`, label: isCatalan ? 'Serveis' : 'Servicios', icon: Briefcase },
    { key: 'hours', href: `${base}/hours`, label: isCatalan ? 'Horari' : 'Horario', icon: Clock },
    { key: 'leads', href: `${base}/leads`, label: isCatalan ? 'Missatges' : 'Mensajes', icon: MessageSquare },
    { key: 'analytics', href: `${base}/analytics`, label: isCatalan ? 'Analítica' : 'Analítica', icon: BarChart3 },
    { key: 'team', href: `${base}/team`, label: isCatalan ? 'Equip' : 'Equipo', icon: Users },
    { key: 'calendar', href: `${base}/calendar`, label: isCatalan ? 'Calendari' : 'Calendario', icon: CalendarIcon },
    { key: 'reviews', href: `${base}/reviews`, label: isCatalan ? 'Revisions' : 'Revisiones', icon: FileCheck },
    { key: 'audit', href: `${base}/audit`, label: isCatalan ? 'Auditoria' : 'Auditoría', icon: ShieldCheck },
    {
      key: 'settings',
      href: `${base}/settings`,
      label: isCatalan ? 'Configuració' : 'Configuración',
      icon: Settings,
    },
  ]

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex h-auto min-w-max gap-2 bg-transparent p-0">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          const Icon = item.icon
          const baseClasses =
            'inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium transition-colors'
          const classes = item.highlight
            ? `${baseClasses} ${
                isActive
                  ? 'border-emerald-300 bg-emerald-100 text-emerald-900'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`
            : `${baseClasses} ${
                isActive
                  ? 'border-emerald-200 bg-white text-emerald-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`

          return (
            <Link key={item.key} href={item.href} className={classes}>
              <Icon className="mr-2 h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
