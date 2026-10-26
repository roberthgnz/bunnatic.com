export type Profile = {
  id: string
  full_name: string | null
  username: string | null
  avatar_url: string | null
  website: string | null
  updated_at: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  stripe_price_id: string | null
  stripe_current_period_end: string | null
  trial_ends_at: string | null
  onboarding_completed: boolean
  onboarding_completed_at: string | null
}
export type Business = {
  id: string
  user_id: string
  name: string
  slug: string
  description: string | null
  category: string | null
  address: string | null
  phone: string | null
  email: string | null
  website: string | null
  social_links: Record<string, string>
  images: string[]
  google_place_id: string | null
  place_data: Record<string, unknown> | null
  created_at: string
  updated_at: string
}
type BusinessRow = { id: string; business_id: string; created_at: string }
export type Tables = {
  profiles: Profile
  businesses: Business
  services: BusinessRow & {
    name: string
    description: string | null
    price: number | null
    duration: number | null
    image_url: string | null
    updated_at: string
  }
  working_hours: BusinessRow & {
    day_of_week: number
    open_time: string | null
    close_time: string | null
    is_closed: boolean
  }
  business_sections: BusinessRow & {
    type: string
    content: Record<string, unknown>
    order_index: number
    is_visible: boolean
    status: string
    last_edited_by: string | null
    updated_at: string
  }
  team_members: BusinessRow & {
    user_id: string
    role: string
    status: string
    invited_email: string | null
    profiles?: Pick<Profile, 'full_name' | 'avatar_url'> | null
    businesses?: Business
  }
  leads: BusinessRow & {
    name: string
    email: string
    phone: string | null
    message: string | null
    status: string
  }
  calendar_events: BusinessRow & {
    title: string
    start_time: string
    end_time: string
    type: string
    created_by: string | null
  }
  analytics_events: BusinessRow & {
    event_type: string
    path: string | null
    metadata: Record<string, unknown>
  }
  audit_logs: BusinessRow & {
    user_id: string
    action: string
    entity_type: string
    entity_id: string | null
    details: Record<string, unknown> | null
    profiles?: Pick<Profile, 'full_name' | 'avatar_url'> | null
  }
  business_generation_usage: {
    id: string
    user_id: string
    business_id: string | null
    source_type: string
    created_at: string
  }
  subscriptions: {
    id: string
    user_id: string
    stripe_customer_id: string | null
    stripe_subscription_id: string | null
    status: string
    plan_id: string | null
    current_period_end: string | null
    created_at: string
    updated_at: string
  }
  business_domains: BusinessRow & {
    hostname: string
    status: 'pending_dns' | 'pending_ssl' | 'active' | 'moved' | 'error'
    verification_method: 'txt' | 'http'
    cloudflare_custom_hostname_id: string | null
    cloudflare_ssl_status: string | null
    cloudflare_ssl_method: string | null
    cloudflare_ownership_verification: Record<string, unknown>
    cloudflare_ssl_validation_records: Record<string, unknown>[]
    cloudflare_verification_errors: Record<string, unknown>[]
    verification_record_name: string | null
    verification_record_value: string | null
    activated_at: string | null
    last_checked_at: string | null
    updated_at: string
  }
}
