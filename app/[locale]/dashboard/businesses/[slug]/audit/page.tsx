import { notFound } from 'next/navigation'
import AuditLogViewer from '../_components/AuditLogViewer'
import { getAuditLogs, getBusinessBySlug } from '@/lib/supabase/actions'

export default async function BusinessAuditPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const business = await getBusinessBySlug(slug)

  if (!business) {
    notFound()
  }

  const logs = await getAuditLogs(business.id)

  return <AuditLogViewer logs={logs} locale={locale} />
}
