import { redirect } from 'next/navigation'

type CheckoutPageProps = {
  params: Promise<{ locale: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function CheckoutPage({
  params,
  searchParams,
}: CheckoutPageProps) {
  const { locale } = await params
  const qs = await searchParams
  const localePrefix = locale === 'ca' ? '/ca' : ''

  const nextParams = new URLSearchParams()

  for (const [key, value] of Object.entries(qs)) {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item) nextParams.append(key, item)
      })
      continue
    }

    if (value) {
      nextParams.set(key, value)
    }
  }

  if (!nextParams.get('step')) {
    nextParams.set('step', 'checkout')
  }

  redirect(`${localePrefix}/onboarding?${nextParams.toString()}`)
}
