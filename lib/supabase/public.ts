import { createClient } from '@/lib/supabase/server'
import { normalizeHostname } from '@/lib/domains/hostname'

export async function getPublicBusinessBySlug(slug: string) {
  const supabase = await createClient()

  const { data: business } = await supabase
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

  const supabase = await createClient()

  const { data: domain } = await supabase
    .from('business_domains')
    .select('business_id, status')
    .eq('hostname', hostname)
    .eq('status', 'active')
    .maybeSingle()

  if (!domain) {
    return null
  }

  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', domain.business_id)
    .maybeSingle()

  return business ?? null
}
