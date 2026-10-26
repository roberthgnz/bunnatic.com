import Link from 'next/link'
import { ArrowLeft, Leaf } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="landing-page landing-hero flex min-h-svh flex-col items-center justify-center px-5 py-16 text-center text-[#2b3b26]">
      <Link
        href="/"
        className="mb-12 flex items-center gap-2 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5a7b3c]"
      >
        <span className="flex size-8 items-center justify-center rounded-lg bg-[#29492e]">
          <Leaf className="size-4 text-[#d8e7b7]" aria-hidden="true" />
        </span>
        <span className="text-xl font-semibold tracking-[-0.04em]">
          Bunnatic
        </span>
      </Link>

      <p className="landing-eyebrow">Error 404</p>
      <h1 className="text-[clamp(40px,7vw,64px)] leading-[1.05] font-semibold tracking-[-0.05em]">
        Esta página{' '}
        <span className="font-serif font-normal text-[#52734a] italic">
          no existe.
        </span>
      </h1>
      <p className="mt-5 max-w-md text-base leading-7 text-[#687064]">
        Puede que el enlace esté mal escrito o que la página se haya movido.
      </p>

      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="landing-button">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Volver al inicio
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex min-h-11 items-center rounded-[7px] border border-[#dce0d1] bg-white px-5 text-[13px] font-medium text-[#2b3b26] transition-colors hover:bg-[#f3f5ee] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5a7b3c]"
        >
          Ir a mi panel
        </Link>
      </div>
    </main>
  )
}
