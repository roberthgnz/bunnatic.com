import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { siteExamples } from '@/lib/siteExamples'
import SitePreview from './SitePreview'

export default function Examples() {
  return (
    <section id="ejemplos" className="home-section">
      <div className="home-container">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <p className="home-eyebrow">Una idea de lo que puedes crear</p>
            <h2 className="home-title">
              Negocios diferentes. Webs con personalidad.
            </h2>
          </div>
          <Link
            href="/crear-pagina-web-negocio"
            className="home-button home-button-outline shrink-0"
          >
            Ahora imagina la tuya
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-16 grid gap-x-6 gap-y-14 md:grid-cols-3">
          {siteExamples.map((example) => (
            <article key={example.slug} className="group relative min-w-0">
              <div
                className="flex aspect-[4/5] items-center overflow-hidden rounded-3xl px-6 sm:px-8"
                style={{ backgroundColor: example.surface }}
              >
                <div className="w-full overflow-hidden rounded-xl shadow-[0_30px_60px_-25px_#0006] transition-transform duration-500 motion-safe:group-hover:-translate-y-2">
                  <SitePreview example={example} compact />
                </div>
              </div>
              <div className="mt-6 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-medium tracking-[-0.02em]">
                    <Link
                      href={`/ejemplos/${example.slug}`}
                      className="after:absolute after:inset-0"
                    >
                      {example.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-(--home-muted)">
                    {example.sector} · {example.location}
                  </p>
                </div>
                <ArrowUpRight
                  className="mt-1 size-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </div>
            </article>
          ))}
        </div>
        <p className="mt-14 text-sm text-(--home-muted)">
          Negocios ficticios, posibilidades reales. Tu web se crea a partir de
          tu propia información.
        </p>
      </div>
    </section>
  )
}
