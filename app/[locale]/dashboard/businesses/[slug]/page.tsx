import { redirect } from 'next/navigation'

export default async function BusinessDetailsRootPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  redirect(`/${locale}/dashboard/businesses/${slug}/generation`)
}
