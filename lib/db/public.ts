import { createClient } from '@/lib/db/server'
import { normalizeHostname } from '@/lib/domains/hostname'

export async function getPublicBusinessBySlug(slug: string) {
  const db = await createClient()

  const { data: business } = await db
    .from('businesses')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  return business ?? null
}

export async function getPublicBusinessByHostname(hostnameInput: string) {
  const hostname = normalizeHostname(hostnameInput)
  if (!hostname) {
    return null
  }

  const db = await createClient()

  const { data: domain } = await db
    .from('business_domains')
    .select('business_id, status')
    .eq('hostname', hostname)
    .eq('status', 'active')
    .maybeSingle()

  if (!domain) {
    return null
  }

  const { data: business } = await db
    .from('businesses')
    .select('*')
    .eq('id', domain.business_id)
    .maybeSingle()

  return business ?? null
}

/** Public site data: D1 query scopes allow anonymous reads of services and hours. */
export async function getPublicServices(businessId: string) {
  const db = await createClient()
  const { data } = await db
    .from('services')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: true })

  return data ?? []
}

export async function getPublicWorkingHours(businessId: string) {
  const db = await createClient()
  const { data } = await db
    .from('working_hours')
    .select('*')
    .eq('business_id', businessId)
    .order('day_of_week', { ascending: true })

  return data ?? []
}
