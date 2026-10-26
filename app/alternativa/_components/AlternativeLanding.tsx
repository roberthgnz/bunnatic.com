import dynamic from 'next/dynamic'
import { Check, Leaf, Minus } from 'lucide-react'
import LandingHeroPreview from '@/components/landing/LandingHeroPreview'
import {
  FinalCtaSection,
  HeroStatus,
  LandingShell,
  ProofAndPlanSection,
  SectionHeader,
  SeoHero,
  StepsSection,
} from '@/components/landing/SeoLandingSections'
import { content } from '@/lib/content'

const FAQ = dynamic(() => import('@/components/FAQ'), {
  loading: () => <div className="h-96" />,
})

type Locale = 'es' | 'ca'

type Step = {
  title: string
  description: string
}

type Testimonial = {
  quote: string
  author: string
  role: string
}

type AlternativeCopy = {
  badge: string
  title: string
  subtitle: string
  urgencyText: string
  ctaPrimary: string
  ctaSecondary: string
  trustLine: string
  competitorCardTitle: string
  competitorItems: string[]
  novaCardTitle: string
  novaItems: string[]
  switchTitle: string
  switchSteps: Step[]
  proofTitle: string
  testimonials: Testimonial[]
  planTitle: string
  planPrice: string
  planItems: string[]
  finalTitle: string
  finalSubtitle: string
}

type AlternativeLandingProps = {
  slug: string
  copy: Record<Locale, AlternativeCopy>
}

/** Which example site (lib/siteExamples) to show first in the hero preview. */
const previewBySlug: Record<string, string> = {
  facebook: 'restaurante',
  instagram: 'peluqueria',
  'google-my-business': 'clinica',
  wordpress: 'clinica',
  wix: 'restaurante',
  squarespace: 'peluqueria',
}

function ComparisonTable({
  competitorName,
  competitorTitle,
  competitorItems,
  novaTitle,
  novaItems,
}: {
  competitorName: string
  competitorTitle: string
  competitorItems: string[]
  novaTitle: string
  novaItems: string[]
}) {
  const rows = Array.from(
    { length: Math.max(competitorItems.length, novaItems.length) },
    (_, index) => ({
      competitor: competitorItems[index],
      nova: novaItems[index],
    })
  )

  return (
    <div className="overflow-hidden rounded-3xl border border-(--home-line) bg-white">
      <table className="w-full table-fixed border-collapse text-left">
        <caption className="sr-only">
          Comparativa entre {competitorName} y Locavo
        </caption>
        <thead>
          <tr>
            <th
              scope="col"
              className="w-1/2 border-b border-(--home-line) bg-white px-4 py-5 align-bottom text-sm font-medium text-(--home-muted) sm:px-8 sm:py-6 sm:text-base"
            >
              {competitorTitle}
            </th>
            <th
              scope="col"
              className="w-1/2 border-b border-l border-white/10 bg-[#0b0b0b] px-4 py-5 align-bottom text-sm font-medium text-white sm:px-8 sm:py-6 sm:text-base"
            >
              <span className="flex items-center gap-2">
                <span
                  className="hidden size-6 shrink-0 items-center justify-center rounded-md bg-white sm:flex"
                  aria-hidden="true"
                >
                  <Leaf className="size-3.5 text-black" />
                </span>
                {novaTitle}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={`${row.competitor ?? ''}-${row.nova ?? ''}-${index}`}
              className="border-b border-(--home-line) last:border-b-0"
            >
              <td className="px-4 py-5 align-top text-sm leading-6 break-words text-(--home-muted) sm:px-8 sm:py-6 sm:text-base">
                {row.competitor ? (
                  <span className="flex items-start gap-2.5">
                    <Minus
                      className="mt-1 size-4 shrink-0 text-black/30"
                      aria-hidden="true"
                    />
                    {row.competitor}
                  </span>
                ) : null}
              </td>
              <td className="border-l border-(--home-line) bg-(--home-soft) px-4 py-5 align-top text-sm leading-6 font-medium break-words text-black sm:px-8 sm:py-6 sm:text-base">
                {row.nova ? (
                  <span className="flex items-start gap-2.5">
                    <Check
                      className="mt-1 size-4 shrink-0 text-black"
                      aria-hidden="true"
                    />
                    {row.nova}
                  </span>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function AlternativeLanding({
  slug,
  copy,
}: AlternativeLandingProps) {
  const t = copy.es
  const signupHref = `/signup?redirect=/checkout&source=alternative-${slug}`
  const planHref = `/signup?redirect=/checkout&plan=pro&source=alternative-${slug}`
  const competitorName =
    content.competitors.find((competitor) => competitor.id === slug)?.name ??
    t.competitorCardTitle.replace(/^(solo\s+)?con\s+/i, '')

  return (
    <LandingShell>
      <SeoHero
        badge={t.badge}
        title={t.title}
        subtitle={t.subtitle}
        urgencyText={t.urgencyText}
        trustLine={t.trustLine}
        visual={
          <LandingHeroPreview
            initialExample={previewBySlug[slug]}
            status={
              t.novaItems[0] ? (
                <HeroStatus
                  icon={<Leaf className="size-4" />}
                  title={t.novaCardTitle}
                  text={t.novaItems[0]}
                />
              ) : null
            }
          />
        }
      />

      <section
        id="comparativa"
        className="landing-section"
        aria-labelledby="comparativa-title"
      >
        <div className="landing-container grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:items-start lg:gap-16">
          <SectionHeader
            id="comparativa-title"
            eyebrow="Cara a cara"
            title={`Locavo y ${competitorName}, punto por punto`}
            description="Una comparación directa de lo que cambia en el día a día para que elijas con criterio."
          />
          <ComparisonTable
            competitorName={competitorName}
            competitorTitle={t.competitorCardTitle}
            competitorItems={t.competitorItems}
            novaTitle={t.novaCardTitle}
            novaItems={t.novaItems}
          />
        </div>
      </section>

      <StepsSection
        eyebrow="Cómo dar el salto"
        title={t.switchTitle}
        steps={t.switchSteps}
      />

      <ProofAndPlanSection
        proofTitle={t.proofTitle}
        testimonials={t.testimonials}
        planTitle={t.planTitle}
        planPrice={t.planPrice}
        planItems={t.planItems}
        planHref={planHref}
      />

      <FAQ />

      <FinalCtaSection
        title={t.finalTitle}
        subtitle={t.finalSubtitle}
        primaryHref={signupHref}
        primaryLabel={t.ctaPrimary}
        secondaryLabel={t.ctaSecondary}
      />
    </LandingShell>
  )
}
