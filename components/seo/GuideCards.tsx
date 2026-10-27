import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { guides } from '@/lib/blog'

export function GuideCards({ exclude }: { exclude?: string }) {
  return (
    <section
      className="landing-section border-t border-(--home-line)"
      aria-labelledby="guias-title"
    >
      <div className="landing-container">
        <p className="home-eyebrow">Recursos para negocios locales</p>
        <h2 id="guias-title" className="landing-title">
          Decide el siguiente paso de tu web
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-(--home-muted)">
          Guías para preparar tu contenido, entender el SEO local y elegir los
          canales que puedes mantener.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {guides
            .filter((guide) => guide.slug !== exclude)
            .map((guide) => (
              <article
                key={guide.slug}
                className="flex flex-col rounded-3xl bg-(--home-soft) p-8"
              >
                <p className="text-xs font-medium tracking-wider text-(--home-muted) uppercase">
                  {guide.category}
                </p>
                <h3 className="mt-5 text-2xl leading-snug font-medium tracking-tight">
                  <Link
                    href={`/blog/${guide.slug}`}
                    className="underline-offset-4 hover:underline"
                  >
                    {guide.title}
                  </Link>
                </h3>
                <p className="mt-4 flex-1 leading-relaxed text-(--home-muted)">
                  {guide.description}
                </p>
                <Link
                  href={`/blog/${guide.slug}`}
                  className="mt-7 inline-flex min-h-11 items-center gap-2 font-medium underline underline-offset-4"
                >
                  Leer la guía{' '}
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                </Link>
              </article>
            ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-6 text-sm font-medium underline underline-offset-4">
          <Link href="/blog">Todas las guías</Link>
          <Link href="/negocio">Webs por sector</Link>
        </div>
      </div>
    </section>
  )
}
