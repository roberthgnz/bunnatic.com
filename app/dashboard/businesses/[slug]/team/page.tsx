import { notFound } from 'next/navigation'
import TeamManager from '../_components/TeamManager'
import { getBusinessBySlug, getPublicTeamMembers } from '@/lib/supabase/actions'

export default async function BusinessTeamPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const business = await getBusinessBySlug(slug)

  if (!business) {
    notFound()
  }

  const members = await getPublicTeamMembers(business.id)

  return (
    <TeamManager
      businessId={business.id}
      initialTeam={members}
    />
  )
}
