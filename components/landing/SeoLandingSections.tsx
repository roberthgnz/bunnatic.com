import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react'
import DemoLinkButton from '@/components/DemoLinkButton'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import { content } from '@/lib/content'

/*
 * Shared building blocks for the public SEO landing templates
 * (/alternativa/*, /caracteristicas/*, /negocio/*). They mirror the home
 * landing design language (monochrome, large sans headlines, pill buttons).
 */

type Step = { title: string; description: string }
type Testimonial = { quote: string; author: string; role: string }
type Faq = { q: string; a: string }

const ACCENT_CONNECTORS = [
  ': ',
  ', ',
  ' para ',
  ' que ',
  ' orientada ',
  ' enfocada ',
  ' con ',
]

/**
 * Splits a headline into a plain lead and a muted accent, using the
 * first natural connector ("para", "que", "con", a comma…) that leaves at
 * least two words on each side. Returns `accent: null` when no split fits.
 */
export function splitAccentTitle(title: string): {
  lead: string
  accent: string | null
} {
  const wordCount = (text: string) => text.trim().split(/\s+/).length
  let best: { lead: string; accent: string } | null = null
  let bestIndex = Infinity

  for (const connector of ACCENT_CONNECTORS) {
    let index = title.indexOf(connector)
    while (index !== -1) {
      const keepsPunctuation =
        connector.startsWith(':') || connector.startsWith(',')
      const lead = title.slice(0, keepsPunctuation ? index + 1 : index)
      const accent = title.slice(index + (keepsPunctuation ? 2 : 1))
      if (wordCount(lead) >= 2 && wordCount(accent) >= 2) {
        if (index < bestIndex) {
          best = { lead, accent }
          bestIndex = index
        }
        break
      }
      index = title.indexOf(connector, index + 1)
    }
  }

  if (best) return best

  // "La alternativa a depender solo de Google My Business" → accent the last noun phrase.
  const lastDe = title.lastIndexOf(' de ')
  if (lastDe > 8 && wordCount(title.slice(lastDe + 4)) >= 2) {
    return { lead: title.slice(0, lastDe + 3), accent: title.slice(lastDe + 4) }
  }

  return { lead: title, accent: null }
}

function AccentTitle({
  title,
  accentClassName = 'landing-serif',
}: {
  title: string
  accentClassName?: string
}) {
  const { lead, accent } = splitAccentTitle(title)
  if (!accent) return <>{title}</>
  return (
    <>
      {lead} <span className={accentClassName}>{accent}</span>
    </>
  )
}

/** Page chrome identical to the home landing: skip link, navbar, main, footer. */
export function LandingShell({ children }: { children: ReactNode }) {
  return (
    <div className="landing-page home-page min-h-screen overflow-x-clip font-sans">
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <Navbar useDemoCta />
      <main id="contenido">{children}</main>
      <Footer />
    </div>
  )
}

/** Small floating card used over the hero preview (same look as the home hero). */
export function HeroStatus({
  icon,
  title,
  text,
}: {
  icon: ReactNode
  title: string
  text: string
}) {
  return (
    <>
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-black text-white"
        aria-hidden="true"
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-black">{title}</p>
        <p className="mt-0.5 text-[11px] leading-snug text-(--home-muted)">
          {text}
        </p>
      </div>
    </>
  )
}

type SeoHeroProps = {
  badge: string
  title: string
  subtitle: string
  urgencyText?: string
  trustLine?: string
  visual: ReactNode
}

export function SeoHero({
  badge,
  title,
  subtitle,
  urgencyText,
  trustLine,
  visual,
}: SeoHeroProps) {
  return (
    <section
      className="border-b border-(--home-line)"
      aria-labelledby="hero-title"
    >
      <div className="landing-container grid items-center gap-14 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16 lg:py-24">
        <div className="min-w-0">
          <p className="home-eyebrow">{badge}</p>
          <h1
            id="hero-title"
            className="text-[clamp(40px,5.2vw,76px)] leading-[0.98] font-medium tracking-[-0.05em] text-balance"
          >
            <AccentTitle title={title} />
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-(--home-muted) sm:text-xl">
            {subtitle}
          </p>
          {urgencyText ? (
            <p className="mt-5 max-w-xl border-l-2 border-black pl-4 text-base leading-7 text-black/75">
              {urgencyText}
            </p>
          ) : null}
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <DemoLinkButton
              label="Probar demo gratis"
              className="home-button w-full sm:w-auto"
              icon={<ArrowRight className="size-4" aria-hidden="true" />}
            />
            <Link
              href="/#pricing"
              className="home-button home-button-outline w-full sm:w-auto"
            >
              Ver precios
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          {trustLine ? (
            <p className="mt-6 flex max-w-xl items-start gap-2 text-sm leading-6 text-(--home-muted)">
              <Check
                className="mt-1 size-4 shrink-0 text-black"
                aria-hidden="true"
              />
              {trustLine}
            </p>
          ) : null}
        </div>
        {visual}
      </div>
    </section>
  )
}

type SectionHeaderProps = {
  id: string
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center'
}

export function SectionHeader({
  id,
  eyebrow,
  title,
  description,
  align = 'left',
}: SectionHeaderProps) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : ''}>
      <p className="landing-eyebrow">{eyebrow}</p>
      <h2 id={id} className="landing-title">
        <AccentTitle title={title} />
      </h2>
      {description ? (
        <p
          className={`mt-5 text-lg leading-relaxed text-(--home-muted) ${align === 'center' ? '' : 'max-w-md'}`}
        >
          {description}
        </p>
      ) : null}
    </div>
  )
}

export function BenefitGrid({
  eyebrow,
  title,
  items,
  icon,
}: {
  eyebrow: string
  title: string
  items: string[]
  icon: ReactNode
}) {
  return (
    <section className="landing-section" aria-labelledby="beneficios-title">
      <div className="landing-container">
        <div className="mb-14 max-w-4xl">
          <SectionHeader
            id="beneficios-title"
            eyebrow={eyebrow}
            title={title}
          />
        </div>
        <ul className="grid gap-5 md:grid-cols-3">
          {items.map((item, index) => (
            <li
              key={item}
              className="flex min-h-56 flex-col rounded-3xl bg-(--home-soft) p-8"
            >
              <div className="flex items-center justify-between">
                <span className="feature-icon" aria-hidden="true">
                  {icon}
                </span>
                <span
                  className="text-sm font-medium text-black/35 tabular-nums"
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <p className="mt-auto pt-10 text-xl leading-snug font-medium tracking-[-0.02em]">
                {item}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function StepsSection({
  eyebrow,
  title,
  steps,
}: {
  eyebrow: string
  title: string
  steps: Step[]
}) {
  return (
    <section
      id="como-funciona"
      className="landing-section bg-(--home-soft)"
      aria-labelledby="pasos-title"
    >
      <div className="landing-container grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeader id="pasos-title" eyebrow={eyebrow} title={title} />
        </div>
        <ol>
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="grid grid-cols-[3.5rem_1fr] gap-4 border-t border-black/15 py-10 first:border-t-0 first:pt-0 sm:grid-cols-[5rem_1fr] lg:first:border-t lg:first:pt-10"
            >
              <span className="text-lg font-medium text-black/35 tabular-nums">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="text-2xl font-medium tracking-[-0.03em] sm:text-3xl">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-lg text-base leading-relaxed text-(--home-muted)">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function FaqSection({ title, items }: { title: string; items: Faq[] }) {
  if (items.length === 0) return null
  return (
    <section
      id="preguntas"
      className="landing-section"
      aria-labelledby="faq-title"
    >
      <div className="landing-container grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
        <SectionHeader
          id="faq-title"
          eyebrow="Preguntas frecuentes"
          title={title}
          description="Dar el salto es más fácil cuando sabes qué esperar."
        />
        <div className="border-t border-black/15">
          {items.map(({ q, a }) => (
            <details key={q} className="border-b border-black/15">
              <summary className="cursor-pointer py-7 text-left text-lg font-medium tracking-[-0.01em] sm:text-xl">
                {q}
              </summary>
              <p className="max-w-2xl pb-7 text-base leading-relaxed text-(--home-muted)">
                {a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

const recommendedTier = content.pricing.tiers.find(
  (tier) => tier.id === 'tier-pro'
)

export function ProofAndPlanSection({
  planTitle,
  planPrice,
  planItems,
  planHref,
}: {
  proofTitle: string
  testimonials: Testimonial[]
  planTitle: string
  planPrice: string
  planItems: string[]
  planHref: string
}) {
  return (
    <section
      className="landing-section border-t border-(--home-line)"
      aria-labelledby="revision-title"
    >
      <div className="landing-container grid gap-12 lg:grid-cols-[1.35fr_0.65fr] lg:items-start lg:gap-16">
        <div className="min-w-0">
          <SectionHeader
            id="revision-title"
            eyebrow="Antes de empezar"
            title="Una propuesta que debes revisar con los datos de tu negocio"
          />
          <ul className="mt-10 space-y-5 text-lg leading-relaxed text-(--home-muted)">
            <li>
              Confirma los servicios, horarios y condiciones antes de publicar.
            </li>
            <li>
              Prueba el teléfono y los canales de contacto desde un móvil.
            </li>
            <li>
              Comprueba la disponibilidad de las funciones e integraciones que
              necesitas.
            </li>
          </ul>
          <Link
            href="/blog/como-crear-web-negocio-local"
            className="mt-8 inline-flex min-h-11 items-center font-medium underline underline-offset-4"
          >
            Ver la guía de preparación
          </Link>
        </div>

        <aside
          aria-labelledby="plan-title"
          className="home-dark flex flex-col rounded-3xl bg-[#0b0b0b] p-8 text-white sm:p-10"
        >
          <div className="flex items-center justify-between gap-3">
            <h2
              id="plan-title"
              className="text-2xl font-medium tracking-[-0.03em]"
            >
              {planTitle}
            </h2>
            {recommendedTier ? (
              <span className="shrink-0 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-black">
                Plan {recommendedTier.name}
              </span>
            ) : null}
          </div>
          <p className="mt-8 flex items-baseline gap-1.5">
            <span className="text-6xl font-medium tracking-[-0.06em]">
              {recommendedTier ? recommendedTier.priceMonthly : planPrice}
            </span>
            {recommendedTier ? (
              <span className="text-sm text-white/60">/mes</span>
            ) : null}
          </p>
          <p className="mt-2 text-sm text-white/55">
            14 días de prueba · Sin permanencia
          </p>
          <ul className="mt-8 space-y-4 border-t border-white/15 pt-8">
            {planItems.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm">
                <Check className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
          <Link
            href={planHref}
            className="home-button home-button-light mt-10 w-full"
          >
            Crear cuenta y empezar
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link
            href="/#pricing"
            className="mt-5 inline-flex items-center justify-center gap-1.5 self-center rounded text-sm font-medium text-white/75 underline decoration-white/30 underline-offset-4 hover:text-white"
          >
            Comparar todos los planes
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </aside>
      </div>
    </section>
  )
}

export function FinalCtaSection({
  title,
  subtitle,
  primaryHref,
  primaryLabel,
  secondaryLabel,
}: {
  title: string
  subtitle: string
  primaryHref: string
  primaryLabel: string
  secondaryLabel: string
}) {
  return (
    <section
      className="home-dark bg-[#0b0b0b] text-white"
      aria-labelledby="cta-title"
    >
      <div className="landing-container flex min-h-[70svh] flex-col items-center justify-center py-28 text-center">
        <h2
          id="cta-title"
          className="max-w-5xl text-[clamp(40px,6vw,92px)] leading-[0.97] font-medium tracking-[-0.055em] text-balance"
        >
          <AccentTitle title={title} accentClassName="text-white/45" />
        </h2>
        <p className="mx-auto mt-7 max-w-lg text-lg leading-relaxed text-white/65">
          {subtitle}
        </p>
        <div className="mt-12 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
          <Link href={primaryHref} className="home-button home-button-light">
            {primaryLabel}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <DemoLinkButton
            label={secondaryLabel}
            className="home-button home-button-outline"
          />
        </div>
        <p className="mt-6 text-sm text-white/55">
          Sin tarjeta para empezar · Sin permanencia
        </p>
      </div>
    </section>
  )
}
