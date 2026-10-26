import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { siteExamples } from '@/lib/siteExamples'
import SitePreview from './SitePreview'

export default function Examples() {
  return (
    <section id="ejemplos" className="landing-section bg-[#f4f4eb]">
      <div className="landing-container">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="landing-eyebrow">Una idea de lo que puedes crear</p>
            <h2 className="landing-title">
              Negocios diferentes.
              <br />
              <span className="landing-serif">Webs con personalidad.</span>
            </h2>
          </div>
          <Link
            href="/crear-pagina-web-negocio"
            className="mb-1 flex items-center gap-2 text-sm font-medium text-[#4e6642]"
          >
            Ahora imagina la tuya
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid gap-7 md:grid-cols-3">
          {siteExamples.map((example) => (
            <article key={example.slug} className="group min-w-0">
              <div className="overflow-hidden rounded-xl border border-[#dedfd2] shadow-[0_5px_15px_#36412e05] transition-transform duration-300 motion-safe:group-hover:-translate-y-1">
                <div
                  className="flex h-6 items-center gap-1 border-b border-[#e7e7dd] bg-white px-3"
                  aria-hidden="true"
                >
                  <span className="size-1 rounded-full bg-[#dedfd5]" />
                  <span className="size-1 rounded-full bg-[#dedfd5]" />
                  <span className="size-1 rounded-full bg-[#dedfd5]" />
                </div>
                <SitePreview example={example} compact />
              </div>
              <Link
                href={`/ejemplos/${example.slug}`}
                className="mt-5 flex items-center justify-between gap-3 rounded py-1"
              >
                <div>
                  <h3 className="text-sm font-semibold text-[#35442e]">
                    {example.name}
                  </h3>
                  <p className="mt-1 text-xs text-[#8a8f7c]">
                    {example.sector} · Ejemplo de diseño
                  </p>
                </div>
                <span className="flex size-8 items-center justify-center rounded-full border border-[#d7dccd] text-[#647555] transition-colors group-hover:bg-[#e4eadb]">
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </span>
              </Link>
            </article>
          ))}
        </div>
        <p className="mt-8 text-center text-[11px] text-[#8c927e]">
          Negocios ficticios, posibilidades reales. Tu web se crea a partir de
          tu propia información.
        </p>
      </div>
    </section>
  )
}
