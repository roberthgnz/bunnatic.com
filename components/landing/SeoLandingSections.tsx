import type { ReactNode } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Globe2,
  Leaf,
  Quote,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import DemoLinkButton from '@/components/DemoLinkButton'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { content } from '@/lib/content'

/*
 * Shared building blocks for the public SEO landing templates
 * (/alternativa/*, /caracteristicas/*, /negocio/*). They mirror the home
 * landing design language (warm paper, forest green, serif-italic accents).
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
 * Splits a headline into a plain lead and a serif-italic accent, using the
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
      {lead} <span className={`block ${accentClassName}`}>{accent}</span>
    </>
  )
}

/** Page chrome identical to the home landing: skip link, navbar, main, footer. */
export function LandingShell({ children }: { children: ReactNode }) {
  return (
    <div className="landing-page min-h-screen overflow-x-clip bg-[#fafaf5] font-sans text-[#2b3b26] selection:bg-[#dce8c9] selection:text-[#263d21]">
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
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#e7efdf] text-[#4d713c]"
        aria-hidden="true"
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-[#33432b]">{title}</p>
        <p className="mt-0.5 text-[10px] leading-snug text-[#7d8575]">{text}</p>
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
    <section className="landing-hero" aria-labelledby="hero-title">
      <div className="landing-container grid items-center gap-12 py-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14 lg:py-20">
        <div className="min-w-0">
          <p className="mb-7 inline-flex max-w-full items-center gap-2 rounded-full border border-[#dce3d5] bg-[#eef2e7] px-3 py-1.5 text-[11px] font-semibold text-[#496143]">
            <Sparkles className="size-3.5 shrink-0" aria-hidden="true" />
            <span>{badge}</span>
          </p>
          <h1
            id="hero-title"
            className="text-[38px] leading-[1.06] font-semibold tracking-[-0.05em] text-balance text-[#2b3b26] sm:text-5xl lg:text-[54px]"
          >
            <AccentTitle
              title={title}
              accentClassName="font-serif font-normal text-[#52734a] italic"
            />
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-[#687064] sm:text-lg">
            {subtitle}
          </p>
          {urgencyText ? (
            <p className="mt-5 max-w-xl border-l-2 border-[#c9d4b8] pl-3 text-sm leading-6 text-[#727b68]">
              {urgencyText}
            </p>
          ) : null}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <DemoLinkButton
              label="Probar demo gratis"
              className="landing-button w-full sm:w-auto"
              icon={<ArrowRight className="size-4" aria-hidden="true" />}
            />
            <Link
              href="/#pricing"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[7px] border border-[#d6dccb] bg-white px-5 text-[13px] font-medium text-[#344a2e] transition-colors hover:bg-[#f1f4ea] sm:w-auto"
            >
              Ver precios
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          {trustLine ? (
            <p className="mt-5 flex max-w-xl items-start gap-2 text-xs leading-5 text-[#77806e]">
              <Check
                className="mt-0.5 size-3.5 shrink-0 text-[#52734a]"
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
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : ''}>
      <p className="landing-eyebrow">{eyebrow}</p>
      <h2 id={id} className="landing-title text-balance">
        <AccentTitle title={title} />
      </h2>
      {description ? (
        <p
          className={`mt-4 text-sm leading-7 text-[#7a8071] ${align === 'center' ? '' : 'max-w-md'}`}
        >
          {description}
        </p>
      ) : null}
    </div>
  )
}

const CARD_TINTS = [
  'bg-[#eff2e8]',
  'bg-[#f6f1e8]',
  'bg-[#edf2ee]',
  'bg-[#f7f4ed]',
]

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
    <section
      className="landing-section bg-white"
      aria-labelledby="beneficios-title"
    >
      <div className="landing-container">
        <div className="mb-10">
          <SectionHeader
            id="beneficios-title"
            eyebrow={eyebrow}
            title={title}
          />
        </div>
        <ul className="grid gap-4 md:grid-cols-3">
          {items.map((item, index) => (
            <li
              key={item}
              className={`feature-card flex flex-col ${CARD_TINTS[index % CARD_TINTS.length]}`}
            >
              <div className="flex items-center justify-between">
                <span className="feature-icon" aria-hidden="true">
                  {icon}
                </span>
                <span
                  className="font-serif text-2xl text-[#a3b093]"
                  aria-hidden="true"
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <p className="mt-6 text-lg leading-snug font-semibold tracking-tight text-[#34472d]">
                {item}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

const STEP_ICONS = [Search, Sparkles, Globe2]

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
      className="landing-section bg-[#fcfcf7]"
      aria-labelledby="pasos-title"
    >
      <div className="landing-container">
        <SectionHeader
          id="pasos-title"
          eyebrow={eyebrow}
          title={title}
          align="center"
        />
        <ol className="mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
          {steps.map((step, index) => {
            const Icon = STEP_ICONS[index % STEP_ICONS.length]
            return (
              <li key={step.title}>
                <div className="mb-6 flex items-center justify-between border-b border-[#dfe3d5] pb-5">
                  <span
                    className="font-serif text-4xl text-[#9aa989]"
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <Icon
                    className="size-5 text-[#7c8d6c]"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-lg font-semibold tracking-tight text-[#34472d]">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#7b8271]">
                  {step.description}
                </p>
              </li>
            )
          })}
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
      className="landing-section border-t border-[#e5e8dc] bg-white"
      aria-labelledby="faq-title"
    >
      <div className="landing-container grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
        <SectionHeader
          id="faq-title"
          eyebrow="Preguntas frecuentes"
          title={title}
          description="Dar el salto es más fácil cuando sabes qué esperar."
        />
        <Accordion type="single" collapsible>
          {items.map(({ q, a }, index) => (
            <AccordionItem
              key={q}
              value={`question-${index}`}
              className="border-[#e3e7d8]"
            >
              <AccordionTrigger className="py-5 text-left text-sm font-medium text-[#3f5034] hover:no-underline">
                {q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-sm leading-7 text-[#7c8370]">
                {a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

const recommendedTier = content.pricing.tiers.find(
  (tier) => tier.id === 'tier-pro'
)

export function ProofAndPlanSection({
  proofTitle,
  testimonials,
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
      className="landing-section bg-[#f4f4eb]"
      aria-labelledby="experiencias-title"
    >
      <div className="landing-container grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-start lg:gap-12">
        <div className="min-w-0">
          <SectionHeader
            id="experiencias-title"
            eyebrow="Experiencias"
            title={proofTitle}
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {testimonials.map((item) => (
              <figure
                key={item.author}
                className="feature-card flex flex-col bg-white"
              >
                <Quote className="size-5 text-[#a3b093]" aria-hidden="true" />
                <blockquote className="mt-4 flex-1 font-serif text-lg leading-snug text-[#34472d] italic">
                  «{item.quote}»
                </blockquote>
                <figcaption className="mt-6 border-t border-[#ebeee4] pt-4">
                  <span className="block text-xs font-semibold text-[#3f5034]">
                    {item.author}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-[#7d8471]">
                    {item.role}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <aside
          aria-labelledby="plan-title"
          className="relative flex flex-col rounded-2xl border border-[#819768] bg-[#f0f4e7] p-7 shadow-[0_8px_30px_#43572c08]"
        >
          {recommendedTier ? (
            <span className="absolute -top-3 left-6 rounded-full bg-[#4e6d3d] px-3 py-1 text-[9px] font-semibold tracking-wide text-white uppercase">
              Plan {recommendedTier.name}
            </span>
          ) : null}
          <h2
            id="plan-title"
            className="text-lg font-semibold tracking-tight text-[#34452c]"
          >
            {planTitle}
          </h2>
          <p className="mt-5 flex items-baseline gap-1">
            {recommendedTier ? (
              <>
                <span className="text-[42px] font-semibold tracking-[-.06em] text-[#2f4228]">
                  {recommendedTier.priceMonthly}
                </span>
                <span className="text-xs text-[#7e8672]">/mes</span>
              </>
            ) : (
              <span className="text-[42px] font-semibold tracking-[-.06em] text-[#2f4228]">
                {planPrice}
              </span>
            )}
          </p>
          <p className="mt-1 text-[11px] text-[#7d8471]">
            14 días de prueba · Sin permanencia
          </p>
          <ul className="mt-6 space-y-3 border-t border-[#dde4d2] pt-6">
            {planItems.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-sm text-[#495a3e]"
              >
                <Check
                  className="mt-0.5 size-4 shrink-0 text-[#6b8d4c]"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
          <Link href={planHref} className="landing-button mt-7 w-full">
            Crear cuenta y empezar
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link
            href="/#pricing"
            className="mt-4 inline-flex items-center justify-center gap-1.5 self-center rounded text-[11px] font-semibold text-[#5b714c] hover:underline hover:underline-offset-4"
          >
            Comparar todos los planes
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
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
      className="bg-white px-5 pt-4 pb-12 sm:px-10"
      aria-labelledby="cta-title"
    >
      <div className="relative mx-auto max-w-[1240px] overflow-hidden rounded-2xl bg-[#29452e] px-6 py-16 text-center text-white sm:py-20">
        <Leaf
          className="pointer-events-none absolute -top-10 -left-10 size-64 -rotate-12 text-[#90ae6d]/10"
          strokeWidth={0.6}
          aria-hidden="true"
        />
        <Leaf
          className="pointer-events-none absolute -right-10 -bottom-16 size-80 rotate-150 text-[#90ae6d]/10"
          strokeWidth={0.6}
          aria-hidden="true"
        />
        <div className="relative">
          <p className="mb-5 inline-flex items-center gap-2 text-[10px] font-medium tracking-[.16em] text-[#bbce9e] uppercase">
            <Sparkles className="size-3.5" aria-hidden="true" />
            Tu próximo paso
          </p>
          <h2
            id="cta-title"
            className="mx-auto max-w-3xl text-4xl leading-tight font-medium tracking-[-.04em] text-balance sm:text-5xl"
          >
            <AccentTitle
              title={title}
              accentClassName="font-serif font-normal text-[#c8dda6] italic"
            />
          </h2>
          <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[#bfccb3]">
            {subtitle}
          </p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link
              href={primaryHref}
              className="inline-flex min-h-12 items-center justify-center gap-4 rounded-lg bg-[#d6e7b8] px-6 py-3 text-sm font-semibold text-[#344d2a] transition-colors hover:bg-[#e4efcf] focus-visible:outline-[#d6e7b8]!"
            >
              {primaryLabel}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <DemoLinkButton
              label={secondaryLabel}
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-[#d6e7b8]!"
            />
          </div>
          <p className="mt-5 flex items-center justify-center gap-2 text-[10px] text-[#aabc98]">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            Sin tarjeta para empezar · Sin permanencia
          </p>
        </div>
      </div>
    </section>
  )
}
