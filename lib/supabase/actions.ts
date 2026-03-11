'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

import { generateBusinessContent } from '@/lib/ai'

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

  revalidatePath('/account')
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

  const { error } = await supabase
    .from('businesses')
    .insert({
      user_id: user.id,
      name,
      slug,
      description,
      category,
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

  const { data: businesses } = await supabase
    .from('businesses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return businesses || []
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
    .eq('user_id', user.id)
    .eq('slug', slug)
    .single()

  return business
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
      duration: duration ? parseInt(duration) : null,
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/businesses/[slug]', 'page') // Revalidate parent page might be tricky with dynamic params, better to revalidate specific path in UI usage
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
  
  // Upsert allows inserting or updating based on conflict
  const { error } = await supabase
    .from('working_hours')
    .upsert(
      hours.map(h => ({
        business_id: businessId,
        day_of_week: h.day_of_week,
        open_time: h.open_time,
        close_time: h.close_time,
        is_closed: h.is_closed
      })),
      { onConflict: 'business_id, day_of_week' }
    )

  if (error) return { error: error.message }
  return { success: true }
}
