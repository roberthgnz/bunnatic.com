'use client'

import { content } from '@/lib/content'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Zap, LogOut, User, Settings, LayoutDashboard, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { getFeatureSlug } from '@/lib/pageSlugs'
import { createClient } from '@/lib/supabase/client'
import { Suspense, useEffect, useState } from 'react'
import { logout } from '@/lib/supabase/actions'
import { toast } from 'sonner'
import { trackFunnelEvent } from '@/lib/funnelEvents'
import type { User as SupabaseUser } from '@supabase/supabase-js'

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
  const t = content
  const pathname = usePathname() ?? '/'
  const searchParams = useSearchParams()
  const router = useRouter()
  const paramsText = searchParams.toString()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
    toast.success('Has cerrado sesión')
    router.refresh()
  }

  const segments = pathname.split('/').filter(Boolean)
  // Logic simplified since we only have one locale (or no locale prefix)
  const isCreatePage =
    segments[0] === 'crear-pagina-web-negocio' || segments[0] === 'crear'
  const targetPath = '/crear-pagina-web-negocio'
  const checkoutPath = '/checkout'
  const homePath = '/'
  const signupPath = '/signup'
  const dashboardPath = '/dashboard'
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
    ? 'Ver en accion'
    : isCreatePage
      ? 'Crear cuenta'
      : t.navbar.cta
  const dashboardLabel = 'Dashboard'
  const profileLabel = 'Perfil'
  const settingsLabel = 'Configuración'
  const logoutLabel = 'Cerrar sesión'

  // Get user initials for avatar
  const getUserInitials = (email: string | undefined) => {
    if (!email) return 'U'
    const parts = email.split('@')[0].split('.')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return email.substring(0, 2).toUpperCase()
  }

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
          <div className="hidden items-center gap-4 lg:flex">
            {t.navbar.coreFeatures.map((feature) => (
              <Link
                key={feature.id}
                href={`/caracteristicas/${getFeatureSlug(feature.id, 'es')}`}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
              >
                {feature.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href={dashboardPath}
                className="hidden rounded-full bg-slate-900 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-slate-800 sm:flex sm:px-5 sm:py-2.5 sm:text-sm"
              >
                {dashboardLabel}
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-9 w-9 rounded-full border-2 border-slate-200 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white transition-all hover:border-slate-300 hover:shadow-md"
                  >
                    <span className="text-sm font-semibold">
                      {getUserInitials(user.email)}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Mi cuenta</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={dashboardPath} className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      {dashboardLabel}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      {profileLabel}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      {settingsLabel}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600 focus:text-red-600"
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
                  locale: 'es',
                })
              }
              className="rounded-full bg-slate-900 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-slate-800 sm:px-5 sm:py-2.5 sm:text-sm"
            >
              {ctaText}
            </Link>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-3">
              {t.navbar.coreFeatures.map((feature) => (
                <Link
                  key={feature.id}
                  href={`/caracteristicas/${getFeatureSlug(feature.id, 'es')}`}
                  className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {feature.label}
                </Link>
              ))}
              {user && (
                <Link
                  href={dashboardPath}
                  className="mt-2 rounded-md bg-slate-900 px-3 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-slate-800 sm:hidden"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {dashboardLabel}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
