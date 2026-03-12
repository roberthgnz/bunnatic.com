'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js'

import { generateBusinessContent } from '@/lib/ai'

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

  return deduped.sort(
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
