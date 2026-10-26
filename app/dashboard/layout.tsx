import { redirect } from 'next/navigation'
import {
  getBackofficeSession,
  getBackofficeProfile,
} from '@/lib/backoffice/session'
import DashboardShell from './_components/DashboardShell'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await getBackofficeSession()

  if (!user) {
    redirect(`/signin?next=${encodeURIComponent(`/dashboard`)}`)
  }

  const profile = await getBackofficeProfile()

  if (!profile?.onboarding_completed) {
    redirect(`/onboarding?step=checkout`)
  }

  return <DashboardShell>{children}</DashboardShell>
}
