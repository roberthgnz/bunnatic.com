'use client'

import { content } from '@/lib/content'
import { Check, X } from 'lucide-react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

type ComparisonConfig = {
  title: string
  caption: string
  cards: {
    facebook: {
      title: string
      items: string[]
    }
    novaweb: {
      title: string
      items: string[]
    }
  }
}

type ComparisonProps = {
  alternativeId?: string
}

const logoByCompetitorId = {
  facebook: '/logos/facebook.svg',
  instagram: '/logos/instagram.svg',
  'google-my-business': '/logos/google-my-business.svg',
  wordpress: '/logos/wordpress.svg',
  wix: '/logos/wix.svg',
  squarespace: '/logos/squarespace.svg',
} as const

export default function Comparison({ alternativeId }: ComparisonProps) {
  const t = content
  const pathname = usePathname()

  const normalizedName = (name: string) =>
    name
      .replace(/\sPages$/i, '')
      .replace(/^Con\s+/i, '')
      .replace(/^Solo con\s+/i, '')
      .replace(/^Només amb\s+/i, '')
      .trim()

  const pathSegments = pathname?.split('/').filter(Boolean) ?? []
  const alternativaIndex = pathSegments.findIndex(
    (segment) => segment === 'alternativa'
  )
  const inferredAlternativeId =
    alternativaIndex >= 0 ? pathSegments[alternativaIndex + 1] : undefined

  const activeAlternative = alternativeId ?? inferredAlternativeId
  const competitors = t.competitors
  const [manualSelectedCompetitorId, setManualSelectedCompetitorId] = useState(
    competitors[0]?.id ?? ''
  )
  const selectedCompetitorId = activeAlternative ?? manualSelectedCompetitorId

  const competitor = useMemo(() => {
    return (
      competitors.find((item) => item.id === selectedCompetitorId) ??
      competitors[0]
    )
  }, [competitors, selectedCompetitorId])

  const comparatorLabel = 'Con solo'
  const versusLabel = 'Bunnatic'
  const contextualCaption = (platformName: string) =>
    `${platformName} ayuda, pero tu web es la que convierte visitas en clientes.`

  const comparison: ComparisonConfig = competitor
    ? {
        title: competitor.description,
        cards: {
          facebook: {
            title: `${comparatorLabel} ${normalizedName(competitor.name)}`,
            items: competitor.comparison.competitor.items,
          },
          novaweb: {
            title: competitor.comparison.novaweb.title,
            items: competitor.comparison.novaweb.items,
          },
        },
        caption: contextualCaption(normalizedName(competitor.name)),
      }
    : t.comparison

  const comparisonKey = competitor?.id ?? 'default'
  const isLockedByRoute = Boolean(activeAlternative)

  return (
    <section className="border-b border-slate-200 bg-white py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl lg:max-w-none">
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
            {competitors.map((item) => {
              const logoSrc =
                logoByCompetitorId[item.id as keyof typeof logoByCompetitorId]
              const isActive = item.id === comparisonKey

              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={isLockedByRoute}
                  onClick={() => setManualSelectedCompetitorId(item.id)}
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-full border px-2.5 py-2 text-xs font-semibold transition-colors sm:w-auto sm:px-3 sm:py-1.5 sm:text-sm sm:font-medium ${
                    isActive
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                  } ${isLockedByRoute ? 'cursor-default' : ''}`}
                >
                  {logoSrc ? (
                    <Image
                      src={logoSrc}
                      alt={normalizedName(item.name)}
                      width={16}
                      height={16}
                      className="h-3.5 w-3.5 object-contain sm:h-4 sm:w-4"
                    />
                  ) : null}
                  <span className="truncate">{normalizedName(item.name)}</span>
                </button>
              )
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2 sm:mt-8 sm:gap-3">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 sm:text-sm">
              {versusLabel}
            </span>
            <span className="text-sm font-bold tracking-wide text-slate-400 uppercase sm:text-base">
              VS
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 sm:text-sm">
              {competitor ? normalizedName(competitor.name) : 'Competidor'}
            </span>
          </div>

          <div key={comparisonKey}>
            <h2 className="mt-6 text-2xl leading-[1.15] font-extrabold tracking-tight text-slate-900 sm:mt-8 sm:text-4xl sm:whitespace-pre-line md:text-5xl">
              {comparison.title}
            </h2>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:gap-6 lg:mt-16 lg:grid-cols-2 lg:gap-8">
              <Card className="rounded-2xl border border-slate-200 bg-slate-50 p-0 shadow-sm">
                <CardHeader className="px-5 pt-5 pb-4 sm:px-8 sm:pt-8 sm:pb-6 lg:px-10">
                  <h3 className="flex items-center gap-2.5 text-lg font-bold text-slate-900 sm:gap-3 sm:text-2xl">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100 sm:h-8 sm:w-8">
                      <X className="h-4 w-4 text-red-700 sm:h-5 sm:w-5" />
                    </span>
                    {comparison.cards.facebook.title}
                  </h3>
                </CardHeader>
                <CardContent className="px-5 pb-6 sm:px-8 sm:pb-8 lg:px-10 lg:pb-10">
                  <ul className="space-y-4 sm:space-y-5 lg:space-y-6">
                    {comparison.cards.facebook.items.map((item, i) => (
                      <li
                        key={i}
                        className="flex gap-3 text-sm text-slate-600 sm:gap-4 sm:text-base"
                      >
                        <X className="h-5 w-5 flex-shrink-0 text-red-500 sm:h-6 sm:w-6" />
                        <span className="leading-relaxed sm:leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border border-emerald-300 bg-white p-0 shadow-sm">
                <CardHeader className="px-5 pt-5 pb-4 sm:px-8 sm:pt-8 sm:pb-6 lg:px-10">
                  <h3 className="flex items-center gap-2.5 text-lg font-bold text-slate-900 sm:gap-3 sm:text-2xl">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 sm:h-8 sm:w-8">
                      <Check className="h-4 w-4 text-emerald-700 sm:h-5 sm:w-5" />
                    </span>
                    {comparison.cards.novaweb.title}
                  </h3>
                </CardHeader>
                <CardContent className="px-5 pb-6 sm:px-8 sm:pb-8 lg:px-10 lg:pb-10">
                  <ul className="space-y-4 sm:space-y-5 lg:space-y-6">
                    {comparison.cards.novaweb.items.map((item, i) => (
                      <li
                        key={i}
                        className="flex gap-3 text-sm text-slate-900 sm:gap-4 sm:text-base"
                      >
                        <Check className="h-5 w-5 flex-shrink-0 text-emerald-700 sm:h-6 sm:w-6" />
                        <span className="leading-relaxed font-medium sm:leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <p className="mt-8 text-center text-sm font-medium text-slate-500 sm:mt-12 sm:text-base">
              {comparison.caption}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
