import { notFound } from 'next/navigation'
import TeamManager from '../_components/TeamManager'
import { getBusinessBySlug, getTeamMembers } from '@/lib/supabase/actions'

export default async function BusinessTeamPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const business = await getBusinessBySlug(slug)

  if (!business) {
    notFound()
  }

  const members = await getTeamMembers(business.id)

  return <TeamManager businessId={business.id} initialMembers={members} locale={locale} />
}
