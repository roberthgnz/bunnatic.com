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
    <div className="landing-page min-h-screen bg-[#fafaf5] font-sans text-[#2b3b26] selection:bg-[#dce8c9] selection:text-[#263d21]">
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <Navbar />

      <main id="contenido">
        <header className="border-b border-[#e7e9df]">
          <div className="landing-container py-14 sm:py-20">
            <p className="landing-eyebrow">Legal</p>
            <h1 className="landing-title max-w-3xl text-balance">
              {page.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-pretty text-[#687064]">
              {page.intro}
            </p>
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#dce3d5] bg-white px-3 py-1.5 text-xs font-medium text-[#5b714c]">
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
                          'block rounded-lg px-3 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5a7b3c]',
                          active
                            ? 'bg-[#eef2e7] font-semibold text-[#29492e]'
                            : 'text-[#687064] hover:bg-[#f1f3ea] hover:text-[#29492e]'
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
                <ol className="space-y-1 border-l border-[#e3e6da]">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="-ml-px block border-l border-transparent py-1 pl-4 text-[13px] leading-5 text-[#77806e] transition-colors hover:border-[#29492e] hover:text-[#29492e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5a7b3c]"
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
                  className="text-xl font-semibold tracking-[-0.025em] text-[#2b3b26]"
                >
                  {section.title}
                </h2>
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-[15px] leading-7 text-pretty text-[#55604f]"
                  >
                    {paragraph}
                  </p>
                ))}
                {section.bullets ? (
                  <ul className="space-y-2.5 text-[15px] leading-7 text-[#55604f]">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-[11px] size-1.5 shrink-0 rounded-full bg-[#8aa06f]"
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}

            <p className="border-t border-[#e7e9df] pt-8 text-sm text-[#77806e]">
              ¿Dudas sobre este documento? Escríbenos a{' '}
              <a
                href="mailto:hello@bunnatic.com"
                className="font-medium text-[#29492e] underline-offset-4 hover:underline"
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
