import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardShell from './_components/DashboardShell'

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const localePrefix = locale === 'ca' ? '/ca' : ''
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`${localePrefix}/signin?next=${encodeURIComponent(`${localePrefix}/dashboard`)}`)
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_completed')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile?.onboarding_completed) {
    redirect(`${localePrefix}/onboarding?step=checkout`)
  }

  return <DashboardShell>{children}</DashboardShell>
}
