'use client'

import { useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { BusinessCard } from './business-card'
import { EmptyState } from './page-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  selectBusinesses,
  type BusinessFilter,
  type BusinessSort,
} from '@/lib/backoffice/directory'
import type { BusinessSummary } from '@/lib/backoffice/types'

const filters = [
  { value: 'all', label: 'Todos' },
  { value: 'attention', label: 'Revisar dominio' },
  { value: 'shared', label: 'Compartidos conmigo' },
] as const

export default function BusinessDirectory({
  businesses,
  platformHost,
}: {
  businesses: BusinessSummary[]
  platformHost: string
}) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<BusinessFilter>('all')
  const [sort, setSort] = useState<BusinessSort>('recent')
  const visible = selectBusinesses(businesses, query, filter, sort)
  const clear = () => {
    setQuery('')
    setFilter('all')
  }

  return (
    <section className="space-y-5" aria-label="Directorio de negocios">
      <div className="bg-card ring-border space-y-4 rounded-xl p-4 ring-1 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <label htmlFor="business-search" className="sr-only">
              Buscar en mis negocios
            </label>
            <Search
              className="text-muted-foreground pointer-events-none absolute top-3 left-3 size-4"
              aria-hidden="true"
            />
            <Input
              id="business-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Busca por nombre, sector o dominio…"
              className="h-10 pl-9"
            />
          </div>
          <div className="text-muted-foreground flex items-center gap-2">
            <SlidersHorizontal className="size-4" aria-hidden="true" />
            <label htmlFor="business-sort" className="sr-only">
              Ordenar negocios
            </label>
            <select
              id="business-sort"
              value={sort}
              onChange={(event) => setSort(event.target.value as BusinessSort)}
              className="border-input bg-background text-foreground focus-visible:ring-ring h-10 rounded-lg border px-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
            >
              <option value="recent">Más recientes</option>
              <option value="name">Nombre: A–Z</option>
            </select>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div
            className="flex flex-wrap gap-1.5"
            role="group"
            aria-label="Filtrar negocios"
          >
            {filters.map((item) => (
              <button
                key={item.value}
                type="button"
                aria-pressed={filter === item.value}
                onClick={() => setFilter(item.value)}
                className={`focus-visible:ring-ring min-h-8 rounded-lg px-3 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none ${filter === item.value ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground'}`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <p
            role="status"
            aria-live="polite"
            className="text-muted-foreground text-xs"
          >
            {visible.length} de {businesses.length} negocios
          </p>
        </div>
      </div>
      {visible.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((business) => (
            <BusinessCard
              key={business.id}
              business={business}
              platformHost={platformHost}
              dateLabel="Creado el"
              date={business.created_at}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title="No encontramos coincidencias"
          description="Prueba otro nombre o elimina los filtros para volver a ver tus negocios."
          action={
            <Button variant="outline" onClick={clear}>
              <X aria-hidden="true" />
              Limpiar búsqueda y filtros
            </Button>
          }
        />
      )}
    </section>
  )
}
