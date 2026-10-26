import Link from 'next/link'
import { Leaf } from 'lucide-react'
import { cn } from '@/lib/utils'

type BrandLogoProps = {
  href?: string
  className?: string
}

/** Bunnatic logo, identical to the landing navbar mark. */
export function BrandLogo({ href = '/', className }: BrandLogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        'focus-visible:ring-ring/50 inline-flex items-center gap-2 rounded-lg outline-none focus-visible:ring-3',
        className
      )}
    >
      <span
        className="flex size-8 items-center justify-center rounded-lg bg-[#29492e]"
        aria-hidden="true"
      >
        <Leaf className="size-4 text-[#d8e7b7]" />
      </span>
      <span className="text-xl font-semibold tracking-[-0.04em] text-[#2c3b27]">
        Bunnatic
      </span>
    </Link>
  )
}
