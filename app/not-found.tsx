import Link from 'next/link'
import { ArrowLeft, Leaf } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="landing-page home-page flex min-h-svh flex-col items-center justify-center px-5 py-16 text-center">
      <Link href="/" className="mb-16 flex items-center gap-2 rounded-lg">
        <span className="flex size-8 items-center justify-center rounded-lg bg-black">
          <Leaf className="size-4 text-white" aria-hidden="true" />
        </span>
        <span className="text-xl font-semibold tracking-[-0.04em]">
          Locavo
        </span>
      </Link>

      <p className="home-eyebrow">Error 404</p>
      <h1 className="max-w-3xl text-[clamp(48px,8vw,112px)] leading-[0.95] font-medium tracking-[-0.055em] text-balance">
        Esta página no existe.
      </h1>
      <p className="mt-7 max-w-md text-lg leading-relaxed text-(--home-muted)">
        Puede que el enlace esté mal escrito o que la página se haya movido.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="home-button">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Volver al inicio
        </Link>
        <Link href="/dashboard" className="home-button home-button-outline">
          Ir a mi panel
        </Link>
      </div>
    </main>
  )
}
