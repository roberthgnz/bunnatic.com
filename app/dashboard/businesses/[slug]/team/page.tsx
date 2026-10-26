import { findBusinessAccessBySlug } from '@/lib/backoffice/access'
import { hasBusinessPermission } from '@/lib/backoffice/policy'
import { notFound } from 'next/navigation'
import TeamManager from '../_components/TeamManager'
import { getPublicTeamMembers } from '@/lib/supabase/actions'

export default async function BusinessTeamPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const access = await findBusinessAccessBySlug(slug)
  const business = access?.business

  if (!business || !access) {
    notFound()
  }

  const members = await getPublicTeamMembers(business.id)

  return (
    <TeamManager
      readOnly={!hasBusinessPermission(access.role, 'content.write')}
      businessId={business.id}
      initialTeam={members}
    />
  )
}
