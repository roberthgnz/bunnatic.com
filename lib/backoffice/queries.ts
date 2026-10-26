import 'server-only'
import { cache } from 'react'
import { requireBackofficeSession } from './session'
import { findBusinessAccessBySlug, requireBusinessAccess } from './access'
import { hasBusinessPermission, resolveBusinessRole } from './policy'
import { throwDataError } from './errors'
import { getBusinessSetup } from './setup'
import type { AnalyticsSummary, BusinessSummary } from './types'

const BUSINESS_LIST_COLUMNS =
  'id, user_id, slug, name, category, description, address, phone, website, created_at, updated_at'

export const getBusinesses = cache(async (): Promise<BusinessSummary[]> => {
  const { supabase, user } = await requireBackofficeSession()
  const [owned, memberships] = await Promise.all([
    supabase
      .from('businesses')
      .select(BUSINESS_LIST_COLUMNS)
      .eq('user_id', user.id),
    supabase
      .from('team_members')
      .select(
        `business_id, user_id, role, status, businesses!inner (${BUSINESS_LIST_COLUMNS})`
      )
      .eq('user_id', user.id)
      .eq('status', 'active'),
  ])
  if (owned.error) throwDataError(owned.error)
  if (memberships.error) throwDataError(memberships.error)
  const byId = new Map<string, BusinessSummary>()
  for (const membership of memberships.data ?? []) {
    const business = membership.businesses as unknown as Omit<
      BusinessSummary,
      'role' | 'custom_domain' | 'custom_domain_status'
    > & { user_id: string }
    const role = resolveBusinessRole(user.id, business, membership)
    if (role)
      byId.set(business.id, {
        ...business,
        role,
        custom_domain: null,
        custom_domain_status: null,
      })
  }
  for (const business of owned.data ?? [])
    byId.set(business.id, {
      ...business,
      role: 'owner',
      custom_domain: null,
      custom_domain_status: null,
    })
  if (byId.size === 0) return []
  const domains = await supabase
    .from('business_domains')
    .select('business_id, hostname, status')
    .in('business_id', [...byId.keys()])
  if (domains.error) throwDataError(domains.error)
  const domainById = new Map(
    (domains.data ?? []).map((domain) => [domain.business_id, domain])
  )
  return [...byId.values()]
    .map((business) => {
      const domain = domainById.get(business.id)
      return {
        ...business,
        custom_domain: domain?.hostname ?? null,
        custom_domain_status: domain?.status ?? null,
      }
    })
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
})

export const getBusinessBySlug = cache(
  async (slug: string) =>
    (await findBusinessAccessBySlug(slug))?.business ?? null
)

export const getServices = cache(async (businessId: string) => {
  const { supabase } = await requireBusinessAccess(businessId)
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: true })
  if (error) throwDataError(error)
  return data ?? []
})

export const getWorkingHours = cache(async (businessId: string) => {
  const { supabase } = await requireBusinessAccess(businessId)
  const { data, error } = await supabase
    .from('working_hours')
    .select('*')
    .eq('business_id', businessId)
    .order('day_of_week', { ascending: true })
  if (error) throwDataError(error)
  return data ?? []
})

export const getSections = cache(async (businessId: string) => {
  const { supabase } = await requireBusinessAccess(businessId)
  const { data, error } = await supabase
    .from('business_sections')
    .select('*')
    .eq('business_id', businessId)
    .order('order_index', { ascending: true })
  if (error) throwDataError(error)
  return data ?? []
})

export const getBusinessDomainByBusinessId = cache(
  async (businessId: string) => {
    const { supabase } = await requireBusinessAccess(businessId)
    const { data, error } = await supabase
      .from('business_domains')
      .select('*')
      .eq('business_id', businessId)
      .maybeSingle()
    if (error) throwDataError(error)
    return data
  }
)

export const getBusinessDomain = cache(async (slug: string) => {
  const business = await getBusinessBySlug(slug)
  return business ? getBusinessDomainByBusinessId(business.id) : null
})

export const getCalendarEvents = cache(async (businessId: string) => {
  const { supabase } = await requireBusinessAccess(businessId)
  const { data, error } = await supabase
    .from('calendar_events')
    .select('*')
    .eq('business_id', businessId)
    .order('start_time', { ascending: true })
  if (error) throwDataError(error)
  return data ?? []
})

export const getLeads = cache(async (businessId: string) => {
  const { supabase } = await requireBusinessAccess(businessId, 'leads.read')
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false })
  if (error) throwDataError(error)
  return data ?? []
})

/** The layout renders this on the server. Raw section content never enters a provider. */
export const getBusinessWorkspace = cache(async (slug: string) => {
  const access = await findBusinessAccessBySlug(slug)
  if (!access) return null
  const business = access.business
  const [services, workingHours, sections, businessDomain] = await Promise.all([
    getServices(business.id),
    getWorkingHours(business.id),
    getSections(business.id),
    getBusinessDomainByBusinessId(business.id),
  ])
  return {
    business,
    role: access.role,
    services,
    workingHours,
    sections,
    businessDomain,
    ...getBusinessSetup(business, services, workingHours, sections),
  }
})

export const getAnalyticsSummary = cache(
  async (businessId: string): Promise<AnalyticsSummary> => {
    const { supabase, role } = await requireBusinessAccess(businessId)
    const canReadLeads = hasBusinessPermission(role, 'leads.read')
    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)
    const days = Array.from({ length: 7 }, (_, index) => {
      const start = new Date(today.getTime() - (6 - index) * 86400000)
      return {
        start: start.toISOString(),
        end: new Date(start.getTime() + 86400000).toISOString(),
      }
    })
    const start = days[0].start
    const end = days[6].end
    const [daily, contacts, clicks] = await Promise.all([
      Promise.all(
        days.map(async (day) => {
          const result = await supabase
            .from('analytics_events')
            .select('id', { count: 'exact', head: true })
            .eq('business_id', businessId)
            .eq('event_type', 'page_view')
            .gte('created_at', day.start)
            .lt('created_at', day.end)
          if (result.error) throwDataError(result.error)
          return {
            date: day.start.slice(0, 10),
            label: new Intl.DateTimeFormat('es-ES', {
              weekday: 'short',
              timeZone: 'UTC',
            }).format(new Date(day.start)),
            visits: result.count ?? 0,
          }
        })
      ),
      canReadLeads
        ? supabase
            .from('leads')
            .select('id', { count: 'exact', head: true })
            .eq('business_id', businessId)
            .gte('created_at', start)
            .lt('created_at', end)
        : Promise.resolve({ count: null, error: null }),
      supabase
        .from('analytics_events')
        .select('id', { count: 'exact', head: true })
        .eq('business_id', businessId)
        .eq('event_type', 'click')
        .gte('created_at', start)
        .lt('created_at', end),
    ])
    if (contacts.error) throwDataError(contacts.error)
    if (clicks.error) throwDataError(clicks.error)
    return {
      visits: daily.reduce((sum, day) => sum + day.visits, 0),
      contacts: canReadLeads ? (contacts.count ?? 0) : null,
      clicks: clicks.count ?? 0,
      daily,
      periodStart: start,
      periodEnd: end,
    }
  }
)
