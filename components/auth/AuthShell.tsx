import Image from 'next/image'
import Link from 'next/link'
import { Check, Globe2 } from 'lucide-react'
import { siteExamples } from '@/lib/siteExamples'
import { BrandLogo } from '@/components/auth/BrandLogo'

type AuthVariant = 'signin' | 'signup'

type AuthShellProps = {
  variant: AuthVariant
  /** Small link shown top-right of the form column (e.g. switch to signup). */
  headerAction?: React.ReactNode
  children: React.ReactNode
}

/**
 * Split auth layout: form column on the left, brand panel on the right (lg+).
 * On mobile only the form column is rendered.
 */
export function AuthShell({ variant, headerAction, children }: AuthShellProps) {
  return (
    <div className="bg-background text-foreground grid min-h-svh lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <div className="flex min-h-svh flex-col px-5 py-5 sm:px-10 sm:py-7 lg:px-14 xl:px-20">
        <header className="flex items-center justify-between gap-4">
          <BrandLogo />
          {headerAction ? (
            <div className="text-muted-foreground hidden text-sm sm:block">
              {headerAction}
            </div>
          ) : null}
        </header>

        <main className="flex flex-1 items-center py-10 sm:py-14">
          <div className="mx-auto w-full max-w-[400px]">{children}</div>
        </main>

        <footer className="text-muted-foreground flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-xs">
          <p>© {new Date().getFullYear()} Bunnatic</p>
          <nav aria-label="Enlaces legales" className="flex gap-5">
            <Link
              href="/aviso-legal"
              className="hover:text-foreground rounded-sm transition-colors"
            >
              Aviso legal
            </Link>
            <Link
              href="/politica-privacidad"
              className="hover:text-foreground rounded-sm transition-colors"
            >
              Privacidad
            </Link>
          </nav>
        </footer>
      </div>

      <AuthBrandPanel variant={variant} />
    </div>
  )
}

const panelCopy: Record<
  AuthVariant,
  {
    eyebrow: string
    title: string
    accent: string
    text: string
    benefits: string[]
  }
> = {
  signin: {
    eyebrow: 'Tu web, siempre al día',
    title: 'Todo tu negocio online,',
    accent: 'en un solo lugar.',
    text: 'Actualiza textos y fotos, revisa los contactos que te llegan y publica cambios en segundos.',
    benefits: [
      'Edita tu web sin saber programar',
      'Contactos de clientes en tu panel',
      'SEO local para que te encuentren cerca',
    ],
  },
  signup: {
    eyebrow: 'Pequeños negocios. Grandes posibilidades.',
    title: 'Tú pones el negocio.',
    accent: 'La IA pone la web.',
    text: 'Cuéntanos a qué te dedicas y prepararemos una web profesional para tu negocio en minutos.',
    benefits: [
      'Tu web lista en minutos, creada con IA',
      '14 días de prueba, sin tarjeta',
      'Dominio, SSL y analítica incluidos',
    ],
  },
}

function AuthBrandPanel({ variant }: { variant: AuthVariant }) {
  const copy = panelCopy[variant]
  const example = siteExamples[0]
  const domain = `${example.name.toLowerCase().replaceAll(' ', '')}.bunnatic.com`

  return (
    <aside
      aria-label="Por qué Bunnatic"
      className="relative hidden p-3 lg:block"
    >
      <div className="bg-primary text-primary-foreground sticky top-3 flex h-[calc(100svh-1.5rem)] flex-col overflow-hidden rounded-[28px] px-10 py-10 xl:px-14 xl:py-12">
        <div className="relative">
          <p className="text-sm font-medium text-white/55">{copy.eyebrow}</p>
          <h2 className="mt-6 max-w-md text-[2.75rem] leading-[1] font-medium tracking-[-0.05em] xl:text-[3.5rem]">
            {copy.title} <span className="text-white/45">{copy.accent}</span>
          </h2>
          <p className="text-primary-foreground/75 mt-5 max-w-md text-[0.95rem] leading-7">
            {copy.text}
          </p>
        </div>

        {/* Mock of a generated site */}
        <div
          aria-hidden="true"
          className="relative my-auto py-8 [@media(max-height:820px)]:hidden"
        >
          <div className="mx-auto max-w-[440px] rotate-[-1.5deg] overflow-hidden rounded-2xl bg-white text-[#1f2a1c] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] ring-1 ring-black/5">
            <div className="flex h-8 items-center gap-3 border-b border-[#e8e9df] px-3">
              <div className="flex gap-1">
                <span className="size-1.5 rounded-full bg-[#e0dfd5]" />
                <span className="size-1.5 rounded-full bg-[#e0dfd5]" />
                <span className="size-1.5 rounded-full bg-[#e0dfd5]" />
              </div>
              <span className="flex flex-1 items-center justify-center gap-1.5 text-[9px] text-[#929688]">
                <Globe2 className="size-2.5" />
                {domain}
              </span>
              <span className="w-6" />
            </div>
            <div className="relative h-36">
              <Image
                src={example.image}
                alt=""
                fill
                sizes="440px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
              <div className="absolute inset-x-4 bottom-3 text-white">
                <p className="text-[9px] tracking-[0.14em] uppercase opacity-80">
                  {example.category} · {example.location}
                </p>
                <p className="mt-1 font-serif text-xl leading-tight whitespace-pre-line italic">
                  {example.tagline}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 p-3">
              {example.services.map((service) => (
                <div
                  key={service.title}
                  className="rounded-lg bg-[#f4f1e9] p-2.5"
                >
                  <p className="text-[9px] font-semibold">{service.title}</p>
                  <p className="mt-1 line-clamp-2 text-[8px] leading-snug text-[#6a7263]">
                    {service.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute bottom-3 left-2 flex items-center gap-2.5 rounded-2xl bg-white px-3 py-2.5 text-black shadow-lg ring-1 ring-black/5 xl:left-6">
            <span className="flex size-7 items-center justify-center rounded-full bg-black text-white">
              <Check className="size-3.5" />
            </span>
            <div>
              <p className="text-[11px] font-semibold">Web publicada</p>
              <p className="text-[10px] text-black/55">{domain}</p>
            </div>
          </div>
        </div>

        <ul className="relative mt-auto grid gap-3 border-t border-white/10 pt-6 text-sm">
          {copy.benefits.map((benefit) => (
            <li key={benefit} className="flex items-center gap-3">
              <span
                className="flex size-5 shrink-0 items-center justify-center rounded-full bg-white text-black"
                aria-hidden="true"
              >
                <Check className="size-3" />
              </span>
              <span className="text-primary-foreground/90">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
