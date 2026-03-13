import { notFound } from 'next/navigation'
import { getBusinessBySlug } from '@/lib/supabase/actions'
import SourceGenerationPanel from '../settings/_components/SourceGenerationPanel'

export default async function BusinessGenerationPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const business = await getBusinessBySlug(slug)

  if (!business) {
    notFound()
  }

  return <SourceGenerationPanel businessId={business.id}  />
}
