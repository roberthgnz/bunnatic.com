'use client'

import { content } from '@/lib/content'
import Link from 'next/link'
import { useState } from 'react'

const slugify = (text: string) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const slugMap: Record<string, string> = {
  peluquerias: 'peluquerias',
  restaurantes: 'restaurantes',
  gimnasios: 'gimnasios',
  farmacias: 'farmacias',
  esteticas: 'esteticas',
  veterinarios: 'veterinarios',
  dentistas: 'dentistas',
  fotografos: 'fotografos',
  inmobiliarias: 'inmobiliarias',
  talleres: 'talleres',
  perruqueries: 'peluquerias',
  restaurants: 'restaurantes',
  gimnasos: 'gimnasios',
  farmacies: 'farmacias',
  estetiques: 'esteticas',
  veterinaris: 'veterinarios',
  dentistes: 'dentistas',
  fotografs: 'fotografos',
  immobiliaries: 'inmobiliarias',
  tallers: 'talleres',
}

const getBusinessSlug = (business: string) => {
  const normalized = slugify(business)
  return slugMap[normalized] ?? normalized
}

export default function Ticker() {
  const t = content
  const [isPaused, setIsPaused] = useState(false)

  return (
    <section className="overflow-hidden border-y border-white/5 bg-[#0a0a0a] py-16 text-white">
      <div className="relative flex w-full flex-col items-center justify-center">
        {/* Gradient Masks for smooth fade out on edges */}
        <div className="pointer-events-none absolute top-0 left-0 z-10 h-full w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent" />
        <div className="pointer-events-none absolute top-0 right-0 z-10 h-full w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent" />

        <div className="flex w-full overflow-hidden whitespace-nowrap">
          <div
            className="flex items-center gap-12 px-4 text-xl font-semibold text-gray-400 sm:text-2xl"
            style={{
              animation: 'ticker-scroll 30s linear infinite',
              animationPlayState: isPaused ? 'paused' : 'running',
            }}
          >
            {/* Duplicate the array to create a seamless loop */}
            {[...t.ticker.businesses, ...t.ticker.businesses].map(
              (business, index) => (
                <Link
                  key={index}
                  href={`/negocio/${getBusinessSlug(business)}`}
                  className="flex-shrink-0 transition-colors hover:text-white"
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                  onFocus={() => setIsPaused(true)}
                  onBlur={() => setIsPaused(false)}
                >
                  {business}
                </Link>
              )
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 px-4 text-center">
          <p className="text-sm font-medium tracking-wide text-gray-400 uppercase">
            {t.ticker.text1}
          </p>
          <p className="max-w-4xl text-xs leading-relaxed font-medium text-gray-600">
            {t.ticker.text2}
          </p>
        </div>
      </div>
      <style jsx>{`
        @keyframes ticker-scroll {
          from {
            transform: translateX(0%);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  )
}
