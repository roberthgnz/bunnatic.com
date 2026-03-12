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
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const localePrefix = locale === 'ca' ? '/ca' : ''
    redirect(`${localePrefix}/signin?next=${encodeURIComponent(`${localePrefix}/dashboard`)}`)
  }

  return <DashboardShell>{children}</DashboardShell>
}
