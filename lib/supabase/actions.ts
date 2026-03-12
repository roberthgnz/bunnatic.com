'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js'

import { generateBusinessContent } from '@/lib/ai'
import {
  buildBusinessSourcePreview as buildBusinessSourcePreviewPayload,
  getGenerationEntitlementFromPlan,
  mapStripePriceIdToGenerationPlan,
  type BusinessSourcePreview,
  type GenerationEntitlement,
  type SourceBlock,
  type SourceType,
} from '@/lib/businessSourceGeneration'
import {
  createCloudflareCustomHostname,
  deleteCloudflareCustomHostname,
  extractOwnershipVerificationRecord,
  findCloudflareCustomHostnameByHostname,
  getCloudflareCustomHostname,
  mapCloudflareStatus,
  type DomainConnectionStatus,
} from '@/lib/domains/cloudflare'
import { getCloudflareCnameTarget, isPlatformHost } from '@/lib/domains/config'
import { normalizeHostname } from '@/lib/domains/hostname'

type BusinessDomainRecord = {
  id: string
  business_id: string
  hostname: string
  status: DomainConnectionStatus
  verification_method: 'txt' | 'http'
  cloudflare_custom_hostname_id: string | null
  cloudflare_ssl_status: string | null
  cloudflare_ssl_method: string | null
  cloudflare_ownership_verification: Record<string, unknown>
  cloudflare_ssl_validation_records: Array<Record<string, unknown>>
  cloudflare_verification_errors: Array<Record<string, unknown>>
  verification_record_name: string | null
  verification_record_value: string | null
  activated_at: string | null
  last_checked_at: string | null
  created_at: string
  updated_at: string
}

function logCloudflareValidationDebug(context: string, hostname: string, cloudflareDomain: any) {
  const sslStatus = cloudflareDomain?.ssl?.status ?? null
  const validationRecords = cloudflareDomain?.ssl?.validation_records ?? []
  const ownership = cloudflareDomain?.ownership_verification ?? null

  console.info('[domains][cloudflare-debug]', {
    context,
    hostname,
    customHostnameId: cloudflareDomain?.id ?? null,
    status: cloudflareDomain?.status ?? null,
    sslStatus,
    sslMethod: cloudflareDomain?.ssl?.method ?? null,
    validationRecordsCount: Array.isArray(validationRecords) ? validationRecords.length : 0,
    validationRecords,
    ownershipVerification: ownership,
    ownershipVerificationHttp: cloudflareDomain?.ownership_verification_http ?? null,
  })

  if (
    sslStatus === 'pending_validation' &&
    (!Array.isArray(validationRecords) || validationRecords.length === 0)
  ) {
    console.warn('[domains][cloudflare-debug] SSL pending_validation without validation_records', {
      context,
      hostname,
      customHostnameId: cloudflareDomain?.id ?? null,
      rawSsl: cloudflareDomain?.ssl ?? null,
      rawDomain: cloudflareDomain,
    })
  }
}

const BUSINESS_DOMAINS_TABLE_MISSING_MESSAGE =
  'Falta la migración de dominios en Supabase. Ejecuta las migraciones y vuelve a intentar.'

function isBusinessDomainsTableMissing(
  error: { code?: string; message?: string } | null | undefined
) {
  if (!error) {
    return false
  }

  return (
    error.code === 'PGRST205' ||
    error.message?.includes("public.business_domains") === true
  )
}

function getDomainQueryErrorMessage(error: { message?: string; code?: string }) {
  if (isBusinessDomainsTableMissing(error)) {
    return BUSINESS_DOMAINS_TABLE_MISSING_MESSAGE
  }

  return error.message || 'Error inesperado gestionando el dominio.'
}

async function getOwnedBusinessBySlug(slug: string, userId: string) {
  const supabase = await createClient()
  const { data: business, error } = await supabase
    .from('businesses')
    .select('id, slug')
    .eq('slug', slug)
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    return { error: error.message }
  }

  if (!business) {
    return { error: 'No tienes permisos para gestionar el dominio de este negocio.' }
  }

  return { business }
}

function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    return null
  }

  return createSupabaseAdminClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

async function findUserIdByEmail(email: string) {
  const admin = createAdminClient()
  if (!admin) {
    return { error: 'No se pudo inicializar el servicio de invitaciones.' }
  }

  let page = 1
  const perPage = 200

  while (page <= 10) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage })
    if (error) {
      return { error: error.message }
    }

    const match = data.users.find((user) => user.email?.toLowerCase() === email)
    if (match?.id) {
      return { userId: match.id }
    }

    if (data.users.length < perPage) break
    page += 1
  }

  return {}
}

function getMonthBoundsIso() {
  const now = new Date()
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
  const nextMonthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1))

  return {
    monthStartIso: monthStart.toISOString(),
    nextMonthStartIso: nextMonthStart.toISOString(),
  }
}

async function getGenerationEntitlementInternal(
  userId: string
): Promise<{ entitlement: GenerationEntitlement } | { error: string }> {
  const supabase = await createClient()
  const { monthStartIso, nextMonthStartIso } = getMonthBoundsIso()

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('stripe_price_id')
    .eq('id', userId)
    .maybeSingle()

  if (profileError) {
    return { error: profileError.message }
  }

  const { count, error: countError } = await supabase
    .from('business_generation_usage')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', monthStartIso)
    .lt('created_at', nextMonthStartIso)

  if (countError) {
    return { error: countError.message }
  }

  const plan = mapStripePriceIdToGenerationPlan(profile?.stripe_price_id ?? null)
  const entitlement = getGenerationEntitlementFromPlan(plan, count ?? 0)
  return { entitlement }
}

export async function generateAndApplyContent(businessId: string, name: string, category: string) {
  const supabase = await createClient()
  
  // 1. Generate content
  const { description, services } = await generateBusinessContent(name, category)

  // 2. Update business description
  const { error: updateError } = await supabase
    .from('businesses')
    .update({ description })
    .eq('id', businessId)

  if (updateError) return { error: updateError.message }

  // 3. Create services if any
  if (services && services.length > 0) {
    const { error: servicesError } = await supabase
      .from('services')
      .insert(services.map(s => ({
        business_id: businessId,
        name: s.name,
        description: s.description,
        price: s.price,
        duration: s.duration
      })))
    
    if (servicesError) return { error: servicesError.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function getGenerationEntitlement(userId?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const targetUserId = userId ?? user.id
  if (targetUserId !== user.id) {
    return { error: 'Unauthorized' }
  }

  return getGenerationEntitlementInternal(targetUserId)
}

export async function buildBusinessSourcePreview(input: {
  sourceType: SourceType
  sourcePayload: unknown
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const preview = buildBusinessSourcePreviewPayload(input)
  return { preview }
}

export async function consumeGenerationQuota(
  userId: string,
  businessId: string,
  sourceType: SourceType
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated', allowed: false as const }
  }

  if (user.id !== userId) {
    return { error: 'Unauthorized', allowed: false as const }
  }

  const { data: business, error: businessError } = await supabase
    .from('businesses')
    .select('id')
    .eq('id', businessId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (businessError) {
    return { error: businessError.message, allowed: false as const }
  }

  if (!business) {
    return { error: 'No tienes permisos sobre este negocio.', allowed: false as const }
  }

  const entitlementResult = await getGenerationEntitlementInternal(user.id)
  if ('error' in entitlementResult) {
    return { error: entitlementResult.error, allowed: false as const }
  }

  const { entitlement } = entitlementResult
  if (entitlement.isLimited && (entitlement.remaining ?? 0) <= 0) {
    return {
      allowed: false as const,
      remaining: 0,
      entitlement,
      limitBlocked: true,
      error: 'Has alcanzado el límite mensual de generaciones de tu plan.',
    }
  }

  const { error: insertError } = await supabase
    .from('business_generation_usage')
    .insert({
      user_id: user.id,
      business_id: businessId,
      source_type: sourceType,
    })

  if (insertError) {
    return { error: insertError.message, allowed: false as const }
  }

  const nextEntitlementResult = await getGenerationEntitlementInternal(user.id)
  if ('error' in nextEntitlementResult) {
    return {
      allowed: true as const,
      remaining: entitlement.remaining,
      entitlement,
    }
  }

  return {
    allowed: true as const,
    remaining: nextEntitlementResult.entitlement.remaining,
    entitlement: nextEntitlementResult.entitlement,
  }
}

export async function applyBusinessSourceGeneration(input: {
  businessId: string
  sourceType: SourceType
  selectedBlocks: SourceBlock[]
  previewPayload: BusinessSourcePreview
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const selectedBlocks = Array.from(new Set(input.selectedBlocks))
  if (selectedBlocks.length === 0) {
    return { error: 'Selecciona al menos un bloque para aplicar.' }
  }

  const { data: business, error: businessError } = await supabase
    .from('businesses')
    .select('id, slug')
    .eq('id', input.businessId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (businessError) {
    return { error: businessError.message }
  }

  if (!business) {
    return { error: 'No tienes permisos sobre este negocio.' }
  }

  const quotaResult = await consumeGenerationQuota(user.id, input.businessId, input.sourceType)
  if (!quotaResult.allowed) {
    return {
      error: quotaResult.error ?? 'No se pudo consumir cuota de generación.',
      limitBlocked: Boolean(quotaResult.limitBlocked),
      entitlement: quotaResult.entitlement,
      remaining: quotaResult.remaining,
    }
  }

  const updatedBlocks: SourceBlock[] = []
  const preview = input.previewPayload

  if (selectedBlocks.includes('profile')) {
    const profileUpdates: Record<string, unknown> = {
      place_data: preview.rawSource ?? {},
      updated_at: new Date().toISOString(),
    }

    if (preview.profile.name) {
      profileUpdates.name = preview.profile.name
    }
    if (preview.profile.category) {
      profileUpdates.category = preview.profile.category
    }
    if (preview.profile.description) {
      profileUpdates.description = preview.profile.description
    }
    if (preview.profile.address) {
      profileUpdates.address = preview.profile.address
    }
    if (preview.profile.phone) {
      profileUpdates.phone = preview.profile.phone
    }
    if (preview.profile.website) {
      profileUpdates.website = preview.profile.website
    }

    if (input.sourceType === 'google' && preview.profile.googlePlaceId) {
      profileUpdates.google_place_id = preview.profile.googlePlaceId
    }

    const { error: profileError } = await supabase
      .from('businesses')
      .update(profileUpdates)
      .eq('id', input.businessId)
      .eq('user_id', user.id)

    if (profileError) {
      return { error: profileError.message }
    }

    updatedBlocks.push('profile')
  }

  if (selectedBlocks.includes('services')) {
    const { error: deleteServicesError } = await supabase
      .from('services')
      .delete()
      .eq('business_id', input.businessId)

    if (deleteServicesError) {
      return { error: deleteServicesError.message }
    }

    if (preview.services.length > 0) {
      const { error: insertServicesError } = await supabase
        .from('services')
        .insert(
          preview.services.map((service) => ({
            business_id: input.businessId,
            name: service.name,
            description: service.description || null,
            price: null,
            duration: null,
          }))
        )

      if (insertServicesError) {
        return { error: insertServicesError.message }
      }
    }

    updatedBlocks.push('services')
  }

  if (selectedBlocks.includes('hours') && preview.hours.length > 0) {
    const { error: hoursError } = await supabase
      .from('working_hours')
      .upsert(
        preview.hours.map((hour) => ({
          business_id: input.businessId,
          day_of_week: hour.day_of_week,
          open_time: hour.is_closed ? null : hour.open_time,
          close_time: hour.is_closed ? null : hour.close_time,
          is_closed: hour.is_closed,
        })),
        { onConflict: 'business_id, day_of_week' }
      )

    if (hoursError) {
      return { error: hoursError.message }
    }

    updatedBlocks.push('hours')
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/businesses')
  revalidatePath(`/dashboard/businesses/${business.slug}`)

  return {
    success: true,
    updatedBlocks,
    entitlement: quotaResult.entitlement,
    remaining: quotaResult.remaining,
  }
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
    ? { ...profile, email: user.email }
    : { id: user.id, full_name: user.user_metadata?.full_name || null, email: user.email }
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const fullName = formData.get('fullName') as string
  const username = formData.get('username') as string
  const website = formData.get('website') as string

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: fullName,
      username,
      website,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/profile')
  return { success: true }
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
}

export async function createBusinessFromGoogle(placeData: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const slug = placeData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.floor(Math.random() * 1000)
  
  // 1. Create Business
  const { data: business, error: businessError } = await supabase
    .from('businesses')
    .insert({
      user_id: user.id,
      name: placeData.name,
      slug: slug,
      description: placeData.editorial_summary?.overview || `Bienvenido a ${placeData.name}`,
      category: placeData.types?.[0] || 'Negocio Local',
      address: placeData.formatted_address,
      phone: placeData.formatted_phone_number,
      website: placeData.website,
      google_place_id: placeData.place_id,
      place_data: placeData,
    })
    .select()
    .single()

  if (businessError) return { error: businessError.message }

  const businessId = business.id

  // 2. Create Sections
  const sections = [
    {
      type: 'hero',
      order_index: 0,
      content: {
        title: placeData.name,
        subtitle: placeData.types?.[0] ? `El mejor servicio de ${placeData.types[0].replace(/_/g, ' ')}` : 'Tu negocio local de confianza',
        ctaText: 'Contactar ahora',
        image: placeData.photos?.[0]?.photo_reference // In real app we would proxy this
      }
    },
    {
      type: 'about',
      order_index: 1,
      content: {
        title: 'Sobre nosotros',
        text: placeData.editorial_summary?.overview || `En ${placeData.name} nos dedicamos a ofrecer el mejor servicio a nuestros clientes.`
      }
    },
    {
      type: 'services',
      order_index: 2,
      content: {
        title: 'Nuestros Servicios',
        services: (placeData.types || []).slice(0, 6).map((t: string) => ({ name: t.replace(/_/g, ' '), description: '' }))
      }
    },
    {
      type: 'reviews',
      order_index: 3,
      content: {
        title: 'Lo que dicen nuestros clientes',
        reviews: (placeData.reviews || []).slice(0, 3)
      }
    },
    {
      type: 'contact',
      order_index: 4,
      content: {
        title: 'Contacta con nosotros',
        address: placeData.formatted_address,
        phone: placeData.formatted_phone_number,
        email: ''
      }
    }
  ]

  const { error: sectionsError } = await supabase
    .from('business_sections')
    .insert(sections.map(s => ({ ...s, business_id: businessId })))

  if (sectionsError) console.error('Error creating sections', sectionsError)

  // 3. Working Hours
  if (placeData.opening_hours?.periods) {
    const hours = placeData.opening_hours.periods.map((p: any) => ({
      business_id: businessId,
      day_of_week: p.open.day,
      open_time: `${p.open.time.slice(0, 2)}:${p.open.time.slice(2)}`,
      close_time: p.close ? `${p.close.time.slice(0, 2)}:${p.close.time.slice(2)}` : null,
      is_closed: false
    }))
    
    // Fill missing days as closed? Or just insert what we have.
    // Let's insert what we have.
    const { error: hoursError } = await supabase
      .from('working_hours')
      .insert(hours)
    
    if (hoursError) console.error('Error creating hours', hoursError)
  }

  const onboardingCompletedAt = new Date().toISOString()
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert(
      {
        id: user.id,
        onboarding_completed: true,
        onboarding_completed_at: onboardingCompletedAt,
        updated_at: onboardingCompletedAt,
      },
      { onConflict: 'id' }
    )

  if (profileError) {
    console.error('Error marking onboarding as completed:', profileError)
  }

  revalidatePath('/dashboard')
  return { success: true, slug }
}

export async function createBusiness(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as string
  const address = (formData.get('address') as string) || null
  const phone = (formData.get('phone') as string) || null
  const website = (formData.get('website') as string) || null
  const googlePlaceId = (formData.get('google_place_id') as string) || null
  const placeDataRaw = (formData.get('place_data') as string) || null

  let placeData: unknown = null
  if (placeDataRaw) {
    try {
      placeData = JSON.parse(placeDataRaw)
    } catch {
      placeData = null
    }
  }

  const { error } = await supabase
    .from('businesses')
    .insert({
      user_id: user.id,
      name,
      slug,
      description,
      category,
      address,
      phone,
      website,
      google_place_id: googlePlaceId,
      place_data: placeData,
    })

  if (error) {
    return { error: error.message }
  }

  const onboardingCompletedAt = new Date().toISOString()
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert(
      {
        id: user.id,
        onboarding_completed: true,
        onboarding_completed_at: onboardingCompletedAt,
        updated_at: onboardingCompletedAt,
      },
      { onConflict: 'id' }
    )

  if (profileError) {
    return { error: profileError.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function getBusinesses() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data: ownedBusinesses } = await supabase
    .from('businesses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const { data: teamMemberships } = await supabase
    .from('team_members')
    .select(`
      businesses!inner (*)
    `)
    .eq('user_id', user.id)
    .eq('status', 'active')

  const teamBusinesses = (teamMemberships || [])
    .map((membership: any) => membership.businesses)
    .filter(Boolean)

  const allBusinesses = [...(ownedBusinesses || []), ...teamBusinesses]
  const deduped = Array.from(new Map(allBusinesses.map((business) => [business.id, business])).values())
  const businessIds = deduped.map((business) => business.id)

  let domainByBusinessId = new Map<
    string,
    { hostname: string; status: DomainConnectionStatus }
  >()

  if (businessIds.length > 0) {
    const { data: domains } = await supabase
      .from('business_domains')
      .select('business_id, hostname, status')
      .in('business_id', businessIds)

    if (domains && Array.isArray(domains)) {
      domainByBusinessId = new Map(
        domains.map((domain: any) => [
          domain.business_id,
          {
            hostname: domain.hostname,
            status: domain.status as DomainConnectionStatus,
          },
        ])
      )
    }
  }

  return deduped
    .map((business) => {
      const domain = domainByBusinessId.get(business.id)
      return {
        ...business,
        custom_domain: domain?.hostname ?? null,
        custom_domain_status: domain?.status ?? null,
      }
    })
    .sort(
    (a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
  )
}

export async function getBusinessBySlug(slug: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!business) {
    return null
  }

  if (business.user_id === user.id) {
    return business
  }

  const { data: membership } = await supabase
    .from('team_members')
    .select('id')
    .eq('business_id', business.id)
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle()

  return membership ? business : null
}

export async function getBusinessDomain(slug: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const business = await getBusinessBySlug(slug)
  if (!business) {
    return null
  }

  const { data: domain, error } = await supabase
    .from('business_domains')
    .select('*')
    .eq('business_id', business.id)
    .maybeSingle()

  if (error) {
    return null
  }

  return (domain as BusinessDomainRecord | null) ?? null
}

export async function getBusinessDomainByBusinessId(businessId: string) {
  const supabase = await createClient()
  const { data: domain, error } = await supabase
    .from('business_domains')
    .select('*')
    .eq('business_id', businessId)
    .maybeSingle()

  if (error) {
    return null
  }

  return (domain as BusinessDomainRecord | null) ?? null
}

function computeActivatedAt(
  currentStatus: DomainConnectionStatus,
  previousActivatedAt: string | null
) {
  if (currentStatus !== 'active') {
    return previousActivatedAt
  }

  return previousActivatedAt ?? new Date().toISOString()
}

export async function connectBusinessDomain(slug: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Debes iniciar sesión para conectar un dominio.' }
  }

  const hostnameInput = String(formData.get('hostname') || '')
  const hostname = normalizeHostname(hostnameInput)
  if (!hostname) {
    return { error: 'Introduce un dominio válido (por ejemplo: www.tunegocio.com).' }
  }

  if (isPlatformHost(hostname)) {
    return { error: 'Ese dominio pertenece a la plataforma y no puede asignarse a un negocio.' }
  }

  const ownedBusiness = await getOwnedBusinessBySlug(slug, user.id)
  if ('error' in ownedBusiness) {
    return { error: ownedBusiness.error }
  }

  const business = ownedBusiness.business

  const { data: collision, error: collisionError } = await supabase
    .from('business_domains')
    .select('id, business_id, hostname')
    .eq('hostname', hostname)
    .neq('business_id', business.id)
    .maybeSingle()

  if (collisionError) {
    return { error: getDomainQueryErrorMessage(collisionError) }
  }

  if (collision) {
    return { error: 'Este dominio ya está conectado a otro negocio.' }
  }

  const { data: existingDomain, error: existingError } = await supabase
    .from('business_domains')
    .select('*')
    .eq('business_id', business.id)
    .maybeSingle()

  if (existingError) {
    return { error: getDomainQueryErrorMessage(existingError) }
  }

  const previousDomain = (existingDomain as BusinessDomainRecord | null) ?? null
  const domainChanged = previousDomain && previousDomain.hostname !== hostname

  try {
    let cloudflareDomain
    try {
      cloudflareDomain = await createCloudflareCustomHostname(hostname)
    } catch (error) {
      const existingInCloudflare = await findCloudflareCustomHostnameByHostname(hostname).catch(() => null)
      if (!existingInCloudflare?.id) {
        throw error
      }
      cloudflareDomain = existingInCloudflare
    }

    if (!cloudflareDomain?.id) {
      const existingInCloudflare = await findCloudflareCustomHostnameByHostname(hostname)
      if (!existingInCloudflare?.id) {
        return { error: 'Cloudflare no devolvió un identificador para el dominio.' }
      }
      cloudflareDomain = existingInCloudflare
    }

    const mappedStatus = mapCloudflareStatus(cloudflareDomain)
    const verificationRecord = extractOwnershipVerificationRecord(cloudflareDomain)
    const verificationMethod = cloudflareDomain.ssl?.method === 'http' ? 'http' : 'txt'
    logCloudflareValidationDebug('connectBusinessDomain', hostname, cloudflareDomain)

    const payload = {
      business_id: business.id,
      hostname,
      status: mappedStatus,
      verification_method: verificationMethod,
      cloudflare_custom_hostname_id: cloudflareDomain.id,
      cloudflare_ssl_status: cloudflareDomain.ssl?.status ?? null,
      cloudflare_ssl_method: cloudflareDomain.ssl?.method ?? null,
      cloudflare_ownership_verification: cloudflareDomain.ownership_verification ?? {},
      cloudflare_ssl_validation_records: cloudflareDomain.ssl?.validation_records ?? [],
      cloudflare_verification_errors: [
        ...(cloudflareDomain.verification_errors ?? []),
        ...(cloudflareDomain.ssl?.validation_errors ?? []),
      ],
      verification_record_name: verificationRecord.name,
      verification_record_value: verificationRecord.value,
      activated_at: computeActivatedAt(mappedStatus, previousDomain?.activated_at ?? null),
      last_checked_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data: domain, error: upsertError } = await supabase
      .from('business_domains')
      .upsert(payload, { onConflict: 'business_id' })
      .select('*')
      .single()

    if (upsertError) {
      return { error: getDomainQueryErrorMessage(upsertError) }
    }

    let cleanupWarning: string | null = null
    if (
      domainChanged &&
      previousDomain?.cloudflare_custom_hostname_id &&
      previousDomain.cloudflare_custom_hostname_id !== cloudflareDomain.id
    ) {
      try {
        await deleteCloudflareCustomHostname(previousDomain.cloudflare_custom_hostname_id)
      } catch (error) {
        cleanupWarning =
          error instanceof Error
            ? error.message
            : 'El nuevo dominio se conectó, pero no se pudo borrar el dominio anterior en Cloudflare.'
      }
    }

    revalidatePath(`/dashboard/businesses/${slug}/settings`)
    revalidatePath(`/dashboard/businesses/${slug}/overview`)
    revalidatePath(`/w/${slug}`)

    return {
      success: true,
      domain: domain as BusinessDomainRecord,
      dnsTarget: getCloudflareCnameTarget(),
      warning: cleanupWarning,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo conectar el dominio en Cloudflare.'
    return { error: message }
  }
}

export async function refreshBusinessDomainStatus(slug: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Debes iniciar sesión para actualizar el estado del dominio.' }
  }

  const ownedBusiness = await getOwnedBusinessBySlug(slug, user.id)
  if ('error' in ownedBusiness) {
    return { error: ownedBusiness.error }
  }

  const business = ownedBusiness.business
  const { data: domain, error: domainError } = await supabase
    .from('business_domains')
    .select('*')
    .eq('business_id', business.id)
    .maybeSingle()

  if (domainError) {
    return { error: getDomainQueryErrorMessage(domainError) }
  }

  const currentDomain = (domain as BusinessDomainRecord | null) ?? null
  if (!currentDomain) {
    return { error: 'Este negocio todavía no tiene un dominio conectado.' }
  }

  try {
    const cloudflareDomain = currentDomain.cloudflare_custom_hostname_id
      ? await getCloudflareCustomHostname(currentDomain.cloudflare_custom_hostname_id)
      : await findCloudflareCustomHostnameByHostname(currentDomain.hostname)

    if (!cloudflareDomain) {
      const { data: updatedDomain, error: updateError } = await supabase
        .from('business_domains')
        .update({
          status: 'error',
          cloudflare_ssl_validation_records: [],
          cloudflare_verification_errors: [{ message: 'Cloudflare no encontró este custom hostname.' }],
          last_checked_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', currentDomain.id)
        .select('*')
        .single()

      if (updateError) {
        return { error: getDomainQueryErrorMessage(updateError) }
      }

      return { success: true, domain: updatedDomain as BusinessDomainRecord }
    }

    const mappedStatus = mapCloudflareStatus(cloudflareDomain)
    const verificationRecord = extractOwnershipVerificationRecord(cloudflareDomain)
    logCloudflareValidationDebug('refreshBusinessDomainStatus', currentDomain.hostname, cloudflareDomain)

    const { data: updatedDomain, error: updateError } = await supabase
      .from('business_domains')
      .update({
        hostname: cloudflareDomain.hostname.toLowerCase(),
        status: mappedStatus,
        cloudflare_custom_hostname_id: cloudflareDomain.id,
        cloudflare_ssl_status: cloudflareDomain.ssl?.status ?? null,
        cloudflare_ssl_method: cloudflareDomain.ssl?.method ?? null,
        cloudflare_ownership_verification: cloudflareDomain.ownership_verification ?? {},
        cloudflare_ssl_validation_records: cloudflareDomain.ssl?.validation_records ?? [],
        cloudflare_verification_errors: [
          ...(cloudflareDomain.verification_errors ?? []),
          ...(cloudflareDomain.ssl?.validation_errors ?? []),
        ],
        verification_record_name: verificationRecord.name,
        verification_record_value: verificationRecord.value,
        activated_at: computeActivatedAt(mappedStatus, currentDomain.activated_at),
        last_checked_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', currentDomain.id)
      .select('*')
      .single()

    if (updateError) {
      return { error: getDomainQueryErrorMessage(updateError) }
    }

    revalidatePath(`/dashboard/businesses/${slug}/settings`)
    revalidatePath(`/dashboard/businesses/${slug}/overview`)
    revalidatePath(`/w/${slug}`)

    return {
      success: true,
      domain: updatedDomain as BusinessDomainRecord,
      dnsTarget: getCloudflareCnameTarget(),
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo consultar el estado en Cloudflare.'
    return { error: message }
  }
}

export async function disconnectBusinessDomain(slug: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Debes iniciar sesión para desconectar un dominio.' }
  }

  const ownedBusiness = await getOwnedBusinessBySlug(slug, user.id)
  if ('error' in ownedBusiness) {
    return { error: ownedBusiness.error }
  }

  const business = ownedBusiness.business

  const { data: domain, error: domainError } = await supabase
    .from('business_domains')
    .select('*')
    .eq('business_id', business.id)
    .maybeSingle()

  if (domainError) {
    return { error: getDomainQueryErrorMessage(domainError) }
  }

  const currentDomain = (domain as BusinessDomainRecord | null) ?? null
  if (!currentDomain) {
    return { success: true }
  }

  if (currentDomain.cloudflare_custom_hostname_id) {
    try {
      await deleteCloudflareCustomHostname(currentDomain.cloudflare_custom_hostname_id)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo eliminar el custom hostname en Cloudflare.'
      return { error: message }
    }
  }

  const { error: deleteError } = await supabase
    .from('business_domains')
    .delete()
    .eq('id', currentDomain.id)

  if (deleteError) {
    return { error: getDomainQueryErrorMessage(deleteError) }
  }

  revalidatePath(`/dashboard/businesses/${slug}/settings`)
  revalidatePath(`/dashboard/businesses/${slug}/overview`)
  revalidatePath(`/w/${slug}`)

  return { success: true }
}

export async function updateBusiness(slug: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as string

  const { error } = await supabase
    .from('businesses')
    .update({
      name,
      description,
      category,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', user.id)
    .eq('slug', slug)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/dashboard/businesses/${slug}`)
  revalidatePath('/dashboard')
  return { success: true }
}

// Services
export async function getServices(businessId: string) {
  const supabase = await createClient()
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: true })
  
  return services || []
}

export async function createService(businessId: string, formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = formData.get('price') as string
  const duration = formData.get('duration') as string

  const { error } = await supabase
    .from('services')
    .insert({
      business_id: businessId,
      name,
      description,
      price: price ? parseFloat(price) : null,
      duration: duration ? parseInt(duration, 10) : null,
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function createServicesBatch(businessId: string, services: any[]) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('services')
    .insert(services.map(s => ({
      business_id: businessId,
      name: s.name,
      description: s.description,
      price: s.price,
      duration: s.duration
    })))

  if (error) return { error: error.message }
  return { success: true }
}

// Calendar
export async function getCalendarEvents(businessId: string) {
  const supabase = await createClient()
  const { data: events } = await supabase
    .from('calendar_events')
    .select('*')
    .eq('business_id', businessId)
    .order('start_time', { ascending: true })
  
  return events || []
}

export async function createCalendarEvent(businessId: string, title: string, start: Date, end: Date, type: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Debes iniciar sesión para crear eventos.' }
  }

  if (!title.trim()) {
    return { error: 'El título del evento es obligatorio.' }
  }

  const { error } = await supabase
    .from('calendar_events')
    .insert({
      business_id: businessId,
      title: title.trim(),
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      type: type.trim() || 'general',
      created_by: user.id
    })

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  return { success: true }
}

// Audit Logs
export async function getAuditLogs(businessId: string) {
  const supabase = await createClient()
  const { data: logs } = await supabase
    .from('audit_logs')
    .select(`
      *,
      profiles:user_id (full_name)
    `)
    .eq('business_id', businessId)
    .order('created_at', { ascending: false })
    .limit(50)
  
  return logs || []
}

// Internal Reviews (Sections)
export async function getSections(businessId: string) {
  const supabase = await createClient()
  const { data: sections } = await supabase
    .from('business_sections')
    .select('*')
    .eq('business_id', businessId)
    .order('order_index', { ascending: true })
  
  return sections || []
}

export async function updateSectionStatus(sectionId: string, status: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase
    .from('business_sections')
    .update({ 
      status,
      last_edited_by: user?.id
    })
    .eq('id', sectionId)

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  return { success: true }
}

// Team Members
export async function getTeamMembers(businessId: string) {
  const supabase = await createClient()
  const { data: members } = await supabase
    .from('team_members')
    .select(`
      *,
      profiles:user_id (full_name, avatar_url)
    `)
    .eq('business_id', businessId)

  return members || []
}

export async function inviteTeamMember(businessId: string, email: string, role: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const normalizedEmail = email.trim().toLowerCase()
  const normalizedRole = role.trim().toLowerCase()
  const allowedRoles = ['admin', 'editor', 'viewer']

  if (!user) {
    return { error: 'Debes iniciar sesión para invitar miembros.' }
  }

  if (!normalizedEmail) {
    return { error: 'El email es obligatorio.' }
  }

  if (!allowedRoles.includes(normalizedRole)) {
    return { error: 'Rol no válido.' }
  }

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('id', businessId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!business) {
    return { error: 'No tienes permisos para invitar miembros en este negocio.' }
  }

  const userLookup = await findUserIdByEmail(normalizedEmail)
  if (userLookup.error) {
    return { error: userLookup.error }
  }

  if (!userLookup.userId) {
    return { error: 'El usuario debe registrarse primero para poder ser añadido al equipo.' }
  }

  const { data: existing } = await supabase
    .from('team_members')
    .select('id, status')
    .eq('business_id', businessId)
    .eq('user_id', userLookup.userId)
    .maybeSingle()

  if (existing?.status === 'active') {
    return { error: 'Este usuario ya forma parte del equipo.' }
  }

  const payload = {
    business_id: businessId,
    user_id: userLookup.userId,
    invited_email: normalizedEmail,
    role: normalizedRole,
    status: 'active',
  }

  const { error } = existing
    ? await supabase.from('team_members').update(payload).eq('id', existing.id)
    : await supabase.from('team_members').insert(payload)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function removeTeamMember(memberId: string) {
  const supabase = await createClient()
  const { data: member } = await supabase
    .from('team_members')
    .select('id, role')
    .eq('id', memberId)
    .maybeSingle()

  if (member?.role === 'owner') {
    return { error: 'No se puede eliminar al propietario del negocio.' }
  }

  const { error } = await supabase.from('team_members').delete().eq('id', memberId)
  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  return { success: true }
}

// Analytics
export async function getAnalyticsSummary(_businessId: string) {
  // Mock data for now as we don't have real events yet
  return {
    visits: Math.floor(Math.random() * 1000),
    unique_visitors: Math.floor(Math.random() * 800),
    avg_duration: '2m 15s',
    bounce_rate: '45%'
  }
}

export async function deleteService(serviceId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('services').delete().eq('id', serviceId)
  if (error) return { error: error.message }
  return { success: true }
}

export async function submitLead(formData: FormData) {
  const supabase = await createClient()
  const businessId = formData.get('businessId') as string
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const message = formData.get('message') as string

  const { error } = await supabase
    .from('leads')
    .insert({
      business_id: businessId,
      name,
      email,
      phone,
      message,
    })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

// Leads
export async function getLeads(businessId: string) {
  const supabase = await createClient()
  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false })
  
  return leads || []
}

// Working Hours
export async function getWorkingHours(businessId: string) {
  const supabase = await createClient()
  const { data: hours } = await supabase
    .from('working_hours')
    .select('*')
    .eq('business_id', businessId)
    .order('day_of_week', { ascending: true })
  
  return hours || []
}

export async function saveWorkingHours(businessId: string, hours: any[]) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('working_hours')
    .upsert(
      hours.map(h => ({
        business_id: businessId,
        day_of_week: h.day_of_week,
        open_time: h.is_closed ? null : h.open_time,
        close_time: h.is_closed ? null : h.close_time,
        is_closed: h.is_closed
      })),
      { onConflict: 'business_id, day_of_week' }
    )

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  return { success: true }
}
