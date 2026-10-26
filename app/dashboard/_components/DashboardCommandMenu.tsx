'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUpRight, Building2, Command, Search } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  dashboardRoutes,
  getBusinessNavigation,
  normalizeSearch,
} from '@/lib/backoffice/navigation'
import type { BusinessSummary } from '@/lib/backoffice/types'

export default function DashboardCommandMenu({
  businesses,
}: {
  businesses: Pick<
    BusinessSummary,
    'id' | 'name' | 'slug' | 'category' | 'role'
  >[]
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const input = useRef<HTMLInputElement>(null)
  const results = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen((value) => !value)
        setQuery('')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const activeBusiness = businesses.find(
    (business) =>
      pathname === `/dashboard/businesses/${business.slug}` ||
      pathname.startsWith(`/dashboard/businesses/${business.slug}/`)
  )
  const entries = [
    ...(activeBusiness
      ? getBusinessNavigation(activeBusiness.slug, activeBusiness.role).map(
          (item) => ({
            href: item.href,
            label: item.label,
            description: activeBusiness.name,
            group: 'En este negocio',
          })
        )
      : []),
    ...businesses.map((business) => ({
      href: `/dashboard/businesses/${business.slug}`,
      label: business.name,
      description: business.category || business.slug,
      group: 'Negocios',
    })),
    ...dashboardRoutes.map((item) => ({ ...item, group: 'Plataforma' })),
  ]
    .filter((entry) =>
      normalizeSearch(`${entry.label} ${entry.description}`).includes(
        normalizeSearch(query)
      )
    )
    .slice(0, 20)

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value)
        if (!value) setQuery('')
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          aria-label="Abrir búsqueda rápida"
          className="text-muted-foreground gap-2"
        >
          <Search className="size-4" aria-hidden="true" />
          <span className="hidden md:inline">Buscar en tu espacio</span>
          <kbd className="border-border ml-2 hidden rounded border px-1.5 py-0.5 font-mono text-[10px] lg:inline">
            Ctrl / ⌘ K
          </kbd>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="gap-0 overflow-hidden p-0 sm:max-w-xl"
        onOpenAutoFocus={(event) => {
          event.preventDefault()
          input.current?.focus()
        }}
      >
        <div className="border-border border-b px-5 pt-5 pb-4">
          <DialogTitle className="text-foreground text-sm font-semibold">
            ¿A dónde quieres ir?
          </DialogTitle>
          <DialogDescription className="mt-1 text-xs">
            Encuentra tus negocios y accede a cada herramienta.
          </DialogDescription>
          <div className="mt-4 flex items-center gap-3">
            <Search
              className="text-muted-foreground size-5 shrink-0"
              aria-hidden="true"
            />
            <label htmlFor="workspace-search" className="sr-only">
              Buscar negocios y herramientas
            </label>
            <input
              id="workspace-search"
              ref={input}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Un negocio, servicios, facturación…"
              className="text-foreground min-w-0 flex-1 bg-transparent py-2 text-sm outline-none"
              onKeyDown={(event) => {
                if (event.key === 'ArrowDown') {
                  event.preventDefault()
                  results.current
                    ?.querySelector<HTMLAnchorElement>('a')
                    ?.focus()
                }
              }}
            />
          </div>
        </div>
        <div
          ref={results}
          className="max-h-96 overflow-y-auto p-2"
          onKeyDown={(event) => {
            if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return
            event.preventDefault()
            const links = [
              ...(results.current?.querySelectorAll<HTMLAnchorElement>('a') ??
                []),
            ]
            const current = links.indexOf(
              document.activeElement as HTMLAnchorElement
            )
            const next = current + (event.key === 'ArrowDown' ? 1 : -1)
            if (next < 0) input.current?.focus()
            else links[next % links.length]?.focus()
          }}
        >
          {entries.length ? (
            entries.map((entry, index) => (
              <div key={entry.href}>
                {index === 0 || entries[index - 1].group !== entry.group ? (
                  <p className="text-muted-foreground px-3 pt-3 pb-2 text-[10px] font-semibold tracking-wider uppercase">
                    {entry.group}
                  </p>
                ) : null}
                <Link
                  href={entry.href}
                  onClick={() => setOpen(false)}
                  className="hover:bg-accent focus-visible:bg-accent focus-visible:text-accent-foreground flex items-center gap-3 rounded-lg px-3 py-3 outline-none"
                >
                  <span className="bg-muted text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-lg">
                    {entry.group === 'Negocios' ? (
                      <Building2 className="size-4" aria-hidden="true" />
                    ) : (
                      <Command className="size-4" aria-hidden="true" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="text-foreground block truncate text-sm font-medium">
                      {entry.label}
                    </span>
                    <span className="text-muted-foreground block truncate text-xs">
                      {entry.description}
                    </span>
                  </span>
                  <ArrowUpRight
                    className="text-muted-foreground size-3.5"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            ))
          ) : (
            <div
              role="status"
              className="text-muted-foreground px-6 py-12 text-center text-sm"
            >
              No hay resultados para «{query}».
            </div>
          )}
        </div>
        <div className="border-border text-muted-foreground flex items-center justify-between border-t px-5 py-3 text-[10px]">
          <span>↑ ↓ para navegar · Intro para abrir</span>
          <span>Esc para cerrar</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
