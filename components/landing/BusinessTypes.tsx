import Link from 'next/link'
import {
  ArrowUpRight,
  CarFront,
  Dumbbell,
  Flower2,
  Scissors,
  Stethoscope,
  Utensils,
} from 'lucide-react'

const sectors = [
  { name: 'Restaurantes', slug: 'restaurantes', icon: Utensils },
  { name: 'Peluquerías', slug: 'peluquerias', icon: Scissors },
  { name: 'Clínicas dentales', slug: 'dentistas', icon: Stethoscope },
  { name: 'Estética y bienestar', slug: 'esteticas', icon: Flower2 },
  { name: 'Gimnasios', slug: 'gimnasios', icon: Dumbbell },
  { name: 'Talleres', slug: 'talleres', icon: CarFront },
]

export default function BusinessTypes() {
  return (
    <section
      className="border-y border-[#e5e7dc] bg-[#f5f5ec] py-7"
      aria-label="Webs para negocios locales"
    >
      <div className="landing-container">
        <p className="mb-5 text-center text-[10px] font-medium tracking-[0.16em] text-[#909583] uppercase">
          Para los negocios que dan vida a tu barrio
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 lg:justify-between">
          {sectors.map(({ name, slug, icon: Icon }) => (
            <Link
              key={slug}
              href={`/negocio/${slug}`}
              className="group inline-flex items-center gap-2 text-xs font-medium text-[#707964] transition-colors hover:text-[#244b2c]"
            >
              <Icon className="size-4" strokeWidth={1.5} aria-hidden="true" />
              {name}
              <ArrowUpRight
                className="size-3 opacity-0 transition-opacity group-hover:opacity-100"
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
