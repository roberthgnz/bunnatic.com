import Link from 'next/link'
import { BrandLogo } from '@/components/auth/BrandLogo'

type FlowShellProps = {
  /** Optional centre slot in the top bar (e.g. a step indicator). */
  steps?: React.ReactNode
  children: React.ReactNode
}

/**
 * Focused shell for onboarding / checkout / email confirmation:
 * slim top bar (logo, optional steps, help) and a calm paper background.
 */
export function FlowShell({ steps, children }: FlowShellProps) {
  return (
    <div className="bg-background text-foreground relative flex min-h-svh flex-col">
      <header className="border-border/70 bg-background/80 sticky top-0 z-20 border-b backdrop-blur-md">
        <div className="mx-auto grid h-[72px] max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 sm:grid-cols-[1fr_auto_1fr] sm:px-6">
          <BrandLogo />
          <div className="flex justify-center">{steps}</div>
          <p className="text-muted-foreground justify-self-end text-xs sm:text-sm">
            <span className="hidden md:inline">¿Tienes dudas? </span>
            <a
              href="mailto:hello@locavo.com"
              className="text-foreground focus-visible:ring-ring/50 rounded-sm font-medium underline-offset-4 outline-none hover:underline focus-visible:ring-3"
            >
              Escríbenos
            </a>
          </p>
        </div>
      </header>

      <main className="relative flex-1">{children}</main>

      <footer className="text-muted-foreground relative py-6 text-xs">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} Locavo</p>
          <nav aria-label="Enlaces legales" className="flex gap-5">
            <Link
              href="/aviso-legal"
              className="hover:text-foreground transition-colors"
            >
              Aviso legal
            </Link>
            <Link
              href="/politica-privacidad"
              className="hover:text-foreground transition-colors"
            >
              Privacidad
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
