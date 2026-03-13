'use client'

import { content } from '@/lib/content'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, Zap, LogOut, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useLanguage } from './LanguageProvider'
import { getFeatureSlug } from '@/lib/pageSlugs'
import { createClient } from '@/lib/supabase/client'
import { Suspense, useEffect, useState } from 'react'
import { logout } from '@/lib/supabase/actions'
import { toast } from 'sonner'
import { trackFunnelEvent } from '@/lib/funnelEvents'

type NavbarProps = {
  useDemoCta?: boolean
}

export default function Navbar(props: NavbarProps) {
  return (
    <Suspense
      fallback={
        <div className="h-16 w-full border-b border-slate-200 bg-white" />
      }
    >
      <NavbarContent {...props} />
    </Suspense>
  )
}

function NavbarContent({ useDemoCta = false }: NavbarProps) {
  const { language, setLanguage } = useLanguage()
  const t = content[language]
  const pathname = usePathname() ?? '/'
  const searchParams = useSearchParams()
  const router = useRouter()
  const paramsText = searchParams.toString()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const supabase = createClient()
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    await logout()
    toast.success('Has cerrado sesion')
    router.refresh()
  }

  const segments = pathname.split('/').filter(Boolean)
  const locale = segments[0]
  const hasLocale = locale === 'es' || locale === 'ca'
  const isCreatePage = hasLocale
    ? segments[1] === 'crear-pagina-web-negocio' || segments[1] === 'crear'
    : segments[0] === 'crear-pagina-web-negocio' || segments[0] === 'crear'
  const targetPath = hasLocale
    ? `/${locale}/crear-pagina-web-negocio`
    : '/crear-pagina-web-negocio'
  const checkoutPath = hasLocale ? `/${locale}/checkout` : '/checkout'
  const homePath = hasLocale ? `/${locale}` : '/'
  const signupPath = hasLocale ? `/${locale}/signup` : '/signup'
  const dashboardPath = hasLocale ? `/${locale}/dashboard` : '/dashboard'
  const source = `${pathname}${paramsText ? `?${paramsText}` : ''}`
  const demoHref = `${targetPath}?source=${encodeURIComponent(source)}`
  const signupParams = new URLSearchParams(paramsText)
  signupParams.set('redirect', checkoutPath)
  if (!signupParams.get('source')) {
    signupParams.set('source', source)
  }
  const signupFromCreateHref = `${signupPath}?${signupParams.toString()}`
  const ctaHref = useDemoCta
    ? demoHref
    : isCreatePage
      ? signupFromCreateHref
      : targetPath
  const ctaText = useDemoCta
    ? language === 'ca'
      ? 'Provar demo ara'
      : 'Ver en accion'
    : isCreatePage
      ? language === 'ca'
        ? 'Crear compte'
        : 'Crear cuenta'
      : t.navbar.cta
  const dashboardLabel = 'Dashboard'
  const logoutLabel = language === 'ca' ? 'Tancar sessio' : 'Cerrar sesion'

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={homePath} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-100">
            <Zap className="h-5 w-5 fill-emerald-700 text-emerald-700" />
          </div>
          <span className="text-base font-bold tracking-tight text-slate-900 sm:text-xl">
            {t.navbar.logo}
          </span>
        </Link>
        <div className="flex items-center gap-3 sm:gap-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="hidden items-center gap-1 rounded-md px-2 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 sm:flex"
              >
                {t.navbar.coreFeaturesLabel}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-72">
              {t.navbar.coreFeatures.map((feature) => (
                <DropdownMenuItem key={feature.id} asChild>
                  <Link
                    href={`${hasLocale ? `/${locale}` : ''}/caracteristicas/${getFeatureSlug(feature.id, language)}`}
                    className="block rounded-md px-2 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
                  >
                    {feature.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="hidden items-center gap-2 text-sm font-medium text-slate-500 sm:flex">
            <Button
              variant="ghost"
              size="sm"
              className={`hidden transition-colors hover:text-slate-900 sm:flex ${language === 'es' ? 'font-bold text-slate-900' : ''}`}
              onClick={() => setLanguage('es')}
            >
              ES
            </Button>
            <span>|</span>
            <Button
              variant="ghost"
              size="sm"
              className={`hidden transition-colors hover:text-slate-900 sm:flex ${language === 'ca' ? 'font-bold text-slate-900' : ''}`}
              onClick={() => setLanguage('ca')}
            >
              CA
            </Button>
          </div>
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href={dashboardPath}
                className="rounded-full bg-slate-900 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-slate-800 sm:px-5 sm:py-2.5 sm:text-sm"
              >
                {dashboardLabel}
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="disabled text-xs text-gray-500">
                    {user.email}
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={dashboardPath}>{dashboardLabel}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {logoutLabel}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link
              href={ctaHref}
              onClick={() =>
                trackFunnelEvent('landing_cta_click', {
                  placement: 'navbar',
                  locale: language,
                })
              }
              className="rounded-full bg-slate-900 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-slate-800 sm:px-5 sm:py-2.5 sm:text-sm"
            >
              {ctaText}
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
