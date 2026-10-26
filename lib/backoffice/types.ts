import type { DomainConnectionStatus } from '@/lib/domains/cloudflare'
import type { BusinessRole } from './policy'

export type BusinessSummary = {
  id: string
  slug: string
  name: string
  category: string | null
  description: string | null
  address: string | null
  phone: string | null
  website: string | null
  created_at: string
  updated_at: string
  role: BusinessRole
  custom_domain: string | null
  custom_domain_status: DomainConnectionStatus | null
}

export type BusinessProfile = {
  id: string
  slug: string
  name: string
  category: string | null
  description: string | null
  address: string | null
  phone: string | null
  email: string | null
  website: string | null
}

export type ServiceInput = {
  name: string
  description?: string | null
  price?: number | null
  duration?: number | null
}
export type WorkingHoursInput = {
  day_of_week: number
  open_time: string
  close_time: string
  is_closed: boolean
}

export type AnalyticsSummary = {
  visits: number
  contacts: number | null
  clicks: number
  daily: { date: string; label: string; visits: number }[]
  periodStart: string
  periodEnd: string
}
