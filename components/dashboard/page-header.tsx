import * as React from 'react'
import Link from 'next/link'
import { ArrowUpRight, type LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

export function PageHeader({
  eyebrow,
  title,
  accent,
  description,
  actions,
  className,
}: {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  /** Rendered after the title as a muted second tone. */
  accent?: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between',
        className
      )}
    >
      <div className="min-w-0 space-y-1.5">
        {eyebrow ? (
          <p className="text-muted-foreground text-[13px] font-medium">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-foreground text-[28px] leading-[1.05] font-medium tracking-[-0.045em] text-balance sm:text-4xl">
          {title}
          {accent ? (
            <>
              {' '}
              <span className="text-muted-foreground">{accent}</span>
            </>
          ) : null}
        </h1>
        {description ? (
          <p className="text-muted-foreground max-w-2xl text-sm leading-6 text-pretty">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      ) : null}
    </div>
  )
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  href,
  className,
}: {
  label: React.ReactNode
  value: React.ReactNode
  hint?: React.ReactNode
  icon?: LucideIcon
  href?: string
  className?: string
}) {
  const body = (
    <>
      <div className="flex items-center justify-between gap-3">
        <p className="text-muted-foreground text-xs font-medium">{label}</p>
        {Icon ? (
          <span className="bg-secondary text-secondary-foreground flex size-8 items-center justify-center rounded-lg">
            <Icon className="size-4" aria-hidden="true" />
          </span>
        ) : null}
      </div>
      <p className="text-foreground mt-3 text-4xl font-medium tracking-[-0.05em] tabular-nums">
        {value}
      </p>
      {hint ? (
        <p className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
          {hint}
          {href ? (
            <ArrowUpRight
              className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          ) : null}
        </p>
      ) : null}
    </>
  )

  const classes = cn(
    'group bg-card ring-border relative block rounded-xl p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 transition-shadow',
    href &&
      'hover:ring-ring/40 focus-visible:ring-ring hover:shadow-[0_6px_20px_-10px_rgba(0,0,0,0.2)] focus-visible:ring-2 focus-visible:outline-none',
    className
  )

  if (href) {
    return (
      <Link href={href} className={classes}>
        {body}
      </Link>
    )
  }

  return <div className={classes}>{body}</div>
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon?: LucideIcon
  title: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'border-border bg-card/60 flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed px-6 py-12 text-center',
        className
      )}
    >
      {Icon ? (
        <span className="bg-secondary text-secondary-foreground ring-border mb-4 flex size-11 items-center justify-center rounded-xl ring-1">
          <Icon className="size-5" aria-hidden="true" />
        </span>
      ) : null}
      <h2 className="text-foreground text-base font-semibold tracking-[-0.01em]">
        {title}
      </h2>
      {description ? (
        <p className="text-muted-foreground mt-1.5 max-w-sm text-sm leading-6 text-pretty">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}

const monogramPalette = [
  'bg-[#0b0b0b] text-white',
  'bg-[#3a3a37] text-white',
  'bg-[#6b6b66] text-white',
  'bg-[#e6e6e1] text-[#0b0b0b]',
  'bg-[#f3f3ef] text-[#0b0b0b] ring-1 ring-[#e6e6e1]',
]

export function BusinessMonogram({
  name,
  className,
}: {
  name: string | null | undefined
  className?: string
}) {
  const label = name?.trim() || 'B'
  const hash = Array.from(label).reduce((sum, ch) => sum + ch.charCodeAt(0), 0)
  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex size-10 shrink-0 items-center justify-center rounded-lg text-sm font-semibold',
        monogramPalette[hash % monogramPalette.length],
        className
      )}
    >
      {label[0]?.toUpperCase()}
    </span>
  )
}
