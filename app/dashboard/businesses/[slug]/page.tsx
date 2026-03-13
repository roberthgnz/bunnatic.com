import { redirect } from 'next/navigation'

export default async function BusinessDetailsRootPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  redirect(`/${locale}/dashboard/businesses/${slug}/overview`)
}
