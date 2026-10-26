import type { BusinessSummary } from './types'
import { normalizeSearch } from './navigation'

export type BusinessFilter = 'all' | 'attention' | 'shared'
export type BusinessSort = 'recent' | 'name'

export function selectBusinesses(
  businesses: readonly BusinessSummary[],
  query: string,
  filter: BusinessFilter,
  sort: BusinessSort
) {
  const words = normalizeSearch(query).split(/\s+/).filter(Boolean)
  return businesses
    .filter((business) => {
      if (filter === 'shared' && business.role === 'owner') return false
      if (
        filter === 'attention' &&
        !(business.custom_domain && business.custom_domain_status !== 'active')
      )
        return false
      const text = normalizeSearch(
        [
          business.name,
          business.category,
          business.slug,
          business.custom_domain,
          business.description,
        ]
          .filter(Boolean)
          .join(' ')
      )
      return words.every((word) => text.includes(word))
    })
    .sort((a, b) =>
      sort === 'name'
        ? a.name.localeCompare(b.name, 'es')
        : (Date.parse(b.created_at) || 0) - (Date.parse(a.created_at) || 0) ||
          a.name.localeCompare(b.name, 'es')
    )
}
