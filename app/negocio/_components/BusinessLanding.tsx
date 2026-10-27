import dynamic from 'next/dynamic'
import { Building2, Check } from 'lucide-react'
import { Breadcrumbs } from '@/components/seo/Breadcrumbs'
import { GuideCards } from '@/components/seo/GuideCards'
import { sectorChecklists } from '@/lib/sectorContent'
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
      <div className="landing-container pt-8">
        <Breadcrumbs
          items={[
            { name: 'Inicio', path: '/' },
            { name: 'Sectores', path: '/negocio' },
            { name: t.title, path: `/negocio/${slug}` },
          ]}
        />
      </div>
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

      <section className="landing-section" aria-labelledby="sector-checklist">
        <div className="landing-container">
          <h2 id="sector-checklist" className="landing-title">
            Qué preparar antes de publicar
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-(--home-muted)">
            Una propuesta generada con IA necesita los datos reales de tu
            negocio. Revisa estos contenidos y prueba el contacto antes de
            compartir la web. Una solicitud recibida no equivale a una cita
            confirmada.
          </p>
          <div
            className="mt-8 overflow-x-auto rounded-2xl border border-(--home-line)"
            tabIndex={0}
            role="region"
            aria-label="Contenido del sector"
          >
            <table className="w-full min-w-[500px] text-left leading-relaxed">
              <caption className="p-5 text-left font-medium">
                Contenido que conviene comprobar en este sector
              </caption>
              <thead className="bg-(--home-soft)">
                <tr>
                  <th scope="col" className="p-5">
                    Área
                  </th>
                  <th scope="col" className="p-5">
                    Qué revisar
                  </th>
                </tr>
              </thead>
              <tbody>
                {(sectorChecklists[slug] ?? []).map(([area, detail]) => (
                  <tr key={area} className="border-t border-(--home-line)">
                    <th scope="row" className="p-5 align-top font-medium">
                      {area}
                    </th>
                    <td className="p-5 text-(--home-muted)">{detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <ProofAndPlanSection
        proofTitle={t.proofTitle}
        testimonials={t.testimonials}
        planTitle={t.planTitle}
        planPrice={t.planPrice}
        planItems={t.planItems}
        planHref={planHref}
      />

      <FAQ />
      <GuideCards />

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
