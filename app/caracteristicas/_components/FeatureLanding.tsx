import {
  Check,
  Globe,
  MapPin,
  MessageSquare,
  Sparkles,
  Users,
} from 'lucide-react'
import LandingHeroPreview from '@/components/landing/LandingHeroPreview'
import {
  BenefitGrid,
  FaqSection,
  FinalCtaSection,
  HeroStatus,
  LandingShell,
  ProofAndPlanSection,
  SeoHero,
  StepsSection,
} from '@/components/landing/SeoLandingSections'

type Step = {
  title: string
  description: string
}

type Testimonial = {
  quote: string
  author: string
  role: string
}

type Faq = {
  q: string
  a: string
}

type FeatureCopy = {
  badge: string
  title: string
  subtitle: string
  urgencyText: string
  trustLine: string
  outcomesTitle: string
  outcomes: string[]
  processTitle: string
  process: Step[]
  objectionsTitle: string
  objections: Faq[]
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

type FeatureLandingProps = {
  slug: string
  icon: 'Sparkles' | 'MapPin' | 'MessageSquare' | 'Users' | 'Globe'
  copy: FeatureCopy
}

const iconMap = {
  Sparkles,
  MapPin,
  MessageSquare,
  Users,
  Globe,
}

/** Which example site (lib/siteExamples) to show first in the hero preview. */
const previewBySlug: Record<string, string> = {
  'generacion-ia': 'restaurante',
  'seo-local': 'clinica',
  'edicion-asistida': 'peluqueria',
  'formularios-contacto': 'peluqueria',
  'hosting-dominio': 'clinica',
}

export default function FeatureLanding({
  slug,
  icon,
  copy,
}: FeatureLandingProps) {
  const t = copy
  const IconComponent = iconMap[icon] ?? Sparkles
  const signupHref = `/signup?redirect=/checkout&source=feature-${slug}`
  const planHref = `/signup?redirect=/checkout&plan=pro&source=feature-${slug}`

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
              t.outcomes[0] ? (
                <HeroStatus
                  icon={<IconComponent className="size-4" />}
                  title={t.outcomesTitle}
                  text={t.outcomes[0]}
                />
              ) : null
            }
          />
        }
      />

      <BenefitGrid
        eyebrow="Lo que consigues"
        title={t.outcomesTitle}
        items={t.outcomes}
        icon={<Check className="size-5" />}
      />

      <StepsSection
        eyebrow="Paso a paso"
        title={t.processTitle}
        steps={t.process}
      />

      <FaqSection title={t.objectionsTitle} items={t.objections} />

      <ProofAndPlanSection
        proofTitle={t.proofTitle}
        testimonials={t.testimonials}
        planTitle={t.planTitle}
        planPrice={t.planPrice}
        planItems={t.planItems}
        planHref={planHref}
      />

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
