'use client'

import { useState, type ReactNode } from 'react'
import { Globe2 } from 'lucide-react'
import { siteExamples } from '@/lib/siteExamples'
import SitePreview from '@/components/landing/SitePreview'

type LandingHeroPreviewProps = {
  /** Slug from `lib/siteExamples` to show first. Falls back to the first example. */
  initialExample?: string
  /** Optional floating card rendered over the preview (same style as the home hero). */
  status?: ReactNode
}

export default function LandingHeroPreview({
  initialExample,
  status,
}: LandingHeroPreviewProps) {
  const initialIndex = Math.max(
    0,
    siteExamples.findIndex((item) => item.slug === initialExample)
  )
  const [activeExample, setActiveExample] = useState(initialIndex)
  const example = siteExamples[activeExample]

  return (
    <div className="hero-showcase relative min-w-0 pb-9 lg:pt-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-1">
        <div
          className="flex flex-wrap gap-1"
          role="group"
          aria-label="Sector de la web de ejemplo"
        >
          {siteExamples.map((item, index) => (
            <button
              key={item.slug}
              type="button"
              aria-pressed={activeExample === index}
              onClick={() => setActiveExample(index)}
              className={`example-tab ${activeExample === index ? 'example-tab-active' : ''}`}
            >
              {item.sector}
            </button>
          ))}
        </div>
        <span className="flex items-center gap-1.5 text-[10px] text-[#7b8272]">
          <span
            className="size-1.5 rounded-full bg-[#789660]"
            aria-hidden="true"
          />
          Vista de ejemplo
        </span>
      </div>
      <div className="hero-browser">
        <div className="flex h-10 items-center gap-3 border-b border-[#e8e9df] bg-white px-3">
          <div className="flex gap-1" aria-hidden="true">
            <span className="size-1.5 rounded-full bg-[#e0dfd5]" />
            <span className="size-1.5 rounded-full bg-[#e0dfd5]" />
            <span className="size-1.5 rounded-full bg-[#e0dfd5]" />
          </div>
          <span className="flex min-w-0 flex-1 items-center justify-center gap-1.5 truncate text-[9px] text-[#929688]">
            <Globe2 className="size-2.5 shrink-0" aria-hidden="true" />
            {example.name.toLowerCase().replaceAll(' ', '')}.bunnatic.com
          </span>
          <span className="w-8" aria-hidden="true" />
        </div>
        <div aria-live="polite" aria-atomic="true">
          <SitePreview
            example={example}
            priority={activeExample === initialIndex}
          />
        </div>
      </div>
      {status ? <div className="hero-status max-w-[300px]">{status}</div> : null}
    </div>
  )
}
