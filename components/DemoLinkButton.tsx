'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { cn } from '@/lib/utils'
import { trackFunnelEvent } from '@/lib/funnelEvents'

type DemoLinkButtonProps = {
  className?: string
  label?: string
}

export default function DemoLinkButton(props: DemoLinkButtonProps) {
  return (
    <Suspense
      fallback={
        <span className={cn(props.className)}>{props.label ?? ''}</span>
      }
    >
      <DemoLinkButtonContent {...props} />
    </Suspense>
  )
}

function DemoLinkButtonContent({ className, label }: DemoLinkButtonProps) {
  const pathname = usePathname() ?? '/'
  const searchParams = useSearchParams()
  const paramsText = searchParams.toString()

  const segments = pathname.split('/').filter(Boolean)
  const locale = segments[0]
  const hasLocale = locale === 'es' || locale === 'ca'
  const targetPath = hasLocale
    ? `/${locale}/crear-pagina-web-negocio`
    : '/crear-pagina-web-negocio'
  const source = `${pathname}${paramsText ? `?${paramsText}` : ''}`
  const defaultLabel =
    locale === 'ca' ? 'Provar demo gratuïta' : 'Probar demo gratis'

  return (
    <Link
      href={`${targetPath}?source=${encodeURIComponent(source)}`}
      onClick={() =>
        trackFunnelEvent('landing_cta_click', {
          placement: 'demo_link_button',
          locale: hasLocale ? locale : 'es',
        })
      }
      className={cn(className)}
    >
      {label ?? defaultLabel}
    </Link>
  )
}
