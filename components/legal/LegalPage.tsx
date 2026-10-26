import Link from 'next/link'
import { CalendarDays } from 'lucide-react'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import type { LegalLocale, LegalPageKey } from '@/lib/legalContent'
import { legalContent } from '@/lib/legalContent'
import { getLegalSlug } from '@/lib/pageSlugs'
import { cn } from '@/lib/utils'

type LegalPageProps = {
  locale: LegalLocale
  pageKey: LegalPageKey
}

const legalPages: LegalPageKey[] = [
  'aviso-legal',
  'politica-privacidad',
  'politica-cookies',
]

function sectionId(title: string, index: number) {
  const slug = title
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `${index + 1}-${slug}`
}

export default function LegalPage({ locale, pageKey }: LegalPageProps) {
  const page = legalContent[locale][pageKey]
  const sections = page.sections.map((section, index) => ({
    ...section,
    id: sectionId(section.title, index),
  }))

  return (
    <div className="landing-page home-page theme-mono min-h-screen font-sans">
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <Navbar />

      <main id="contenido">
        <header className="border-b border-(--home-line)">
          <div className="landing-container py-16 sm:py-24">
            <p className="landing-eyebrow">Legal</p>
            <h1 className="max-w-4xl text-[clamp(40px,5.5vw,80px)] leading-[0.98] font-medium tracking-[-0.05em] text-balance">
              {page.title}
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-pretty text-(--home-muted)">
              {page.intro}
            </p>
            <p className="mt-8 inline-flex items-center gap-2 rounded-full bg-(--home-soft) px-4 py-2 text-sm text-black/75">
              <CalendarDays className="size-3.5" aria-hidden="true" />
              {page.lastUpdatedLabel}: {page.lastUpdatedDate}
            </p>
          </div>
        </header>

        <div className="landing-container grid gap-12 py-12 sm:py-16 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <nav aria-label="Documentos legales">
              <p className="landing-eyebrow mb-3">Documentos</p>
              <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
                {legalPages.map((key) => {
                  const active = key === pageKey
                  return (
                    <li key={key}>
                      <Link
                        href={`/${getLegalSlug(key, locale)}`}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'block rounded-full px-4 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black',
                          active
                            ? 'bg-black font-medium text-white'
                            : 'text-(--home-muted) hover:bg-(--home-soft) hover:text-black'
                        )}
                      >
                        {legalContent[locale][key].title}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>

            {sections.length > 2 ? (
              <nav aria-label="En esta página" className="mt-8 hidden lg:block">
                <p className="landing-eyebrow mb-3">En esta página</p>
                <ol className="space-y-1 border-l border-(--home-line)">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="-ml-px block border-l border-transparent py-1 pl-4 text-[13px] leading-5 text-(--home-muted) transition-colors hover:border-black hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            ) : null}
          </aside>

          <article className="max-w-[68ch] space-y-12">
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                aria-labelledby={`${section.id}-title`}
                className="scroll-mt-28 space-y-4"
              >
                <h2
                  id={`${section.id}-title`}
                  className="text-2xl font-medium tracking-[-0.03em]"
                >
                  {section.title}
                </h2>
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-base leading-7 text-pretty text-black/70"
                  >
                    {paragraph}
                  </p>
                ))}
                {section.bullets ? (
                  <ul className="space-y-2.5 text-base leading-7 text-black/70">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-[11px] size-1.5 shrink-0 rounded-full bg-black"
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}

            <p className="border-t border-(--home-line) pt-8 text-sm text-(--home-muted)">
              ¿Dudas sobre este documento? Escríbenos a{' '}
              <a
                href="mailto:hello@bunnatic.com"
                className="font-medium text-black underline underline-offset-4"
              >
                hello@bunnatic.com
              </a>
              .
            </p>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  )
}
