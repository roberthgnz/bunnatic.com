import dynamic from 'next/dynamic'
import { Building2, Check } from 'lucide-react'
import LandingHeroPreview from '@/components/landing/LandingHeroPreview'
import {
  BenefitGrid,
  FinalCtaSection,
  HeroStatus,
  LandingShell,
  ProofAndPlanSection,
  SeoHero,
  StepsSection,
} from '@/components/landing/SeoLandingSections'

const FAQ = dynamic(() => import('@/components/FAQ'), {
  loading: () => <div className="h-96" />,
})

type Step = {
  title: string
  description: string
}

type Testimonial = {
  quote: string
  author: string
  role: string
}

type BusinessCopy = {
  badge: string
  title: string
  subtitle: string
  urgencyText: string
  trustLine: string
  benefitsTitle: string
  benefits: string[]
  processTitle: string
  process: Step[]
  proofTitle: string
  testimonials: Testimonial[]
  planTitle: string
  planPrice: string
  planItems: string[]
  finalTitle: string
  finalSubtitle: string
  ctaPrimary: string
  ctaSecondary: string
}

type BusinessLandingProps = {
  slug: string
  copy: Record<string, BusinessCopy>
}

/** Pick the closest example site (lib/siteExamples) for the hero preview. */
function getPreviewExample(slug: string) {
  if (/restaurant/.test(slug)) return 'restaurante'
  if (/peluquer|estetic/.test(slug)) return 'peluqueria'
  if (/dent|clinic/.test(slug)) return 'clinica'
  return undefined
}

export default function BusinessLanding({ slug, copy }: BusinessLandingProps) {
  const t = copy['es']
  const signupHref = `/signup?redirect=/checkout&source=negocio-${slug}`
  const planHref = `/signup?redirect=/checkout&plan=pro&source=negocio-${slug}`

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
            initialExample={getPreviewExample(slug)}
            status={
              t.benefits[0] ? (
                <HeroStatus
                  icon={<Building2 className="size-4" />}
                  title={t.benefitsTitle}
                  text={t.benefits[0]}
                />
              ) : null
            }
          />
        }
      />

      <BenefitGrid
        eyebrow="Lo que gana tu negocio"
        title={t.benefitsTitle}
        items={t.benefits}
        icon={<Check className="size-5" />}
      />

      <StepsSection
        eyebrow="Paso a paso"
        title={t.processTitle}
        steps={t.process}
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
