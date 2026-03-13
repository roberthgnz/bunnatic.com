'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Cookie, Shield } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  COOKIE_CONSENT_EVENT,
  COOKIE_PREFERENCES_EVENT,
  getCookieConsent,
  openCookiePreferences,
  saveCookieConsent,
} from '@/lib/cookieConsent'
import { cn } from '@/lib/utils'
import { getLegalSlug } from '@/lib/pageSlugs'

const t = {
  badge: 'Cookies',
  title: 'Cookies y privacidad',
  description:
    'Usamos cookies tecnicas para el funcionamiento del sitio. Las cookies se activan solo con tu consentimiento.',
  policy: 'Politica de cookies',
  acceptAll: 'Aceptar',
  rejectAll: 'Rechazar',
  configure: 'Configurar',
  preferencesTitle: 'Preferencias de cookies',
  preferencesDescription:
    'Puedes activar o desactivar cookies. Las cookies tecnicas son obligatorias.',
  technicalTitle: 'Cookies tecnicas',
  technicalDescription:
    'Necesarias para seguridad, sesion y funciones basicas.',
  technicalState: 'Siempre activas',
  analyticsTitle: 'Cookies',
  analyticsDescription: 'Miden uso y rendimiento para mejorar el producto.',
  analyticsProvider: 'Proveedor: Google Analytics',
  analyticsOn: 'Activadas',
  analyticsOff: 'Desactivadas',
  save: 'Guardar preferencias',
} as const

export function CookieConsent() {
  const [isMounted, setIsMounted] = useState(false)
  const [hasDecision, setHasDecision] = useState(true)
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Use 'es' directly or just the slug since we are removing i18n
  const policyHref = `/${getLegalSlug('politica-cookies', 'es')}`

  useEffect(() => {
    const syncFromCookie = () => {
      const consent = getCookieConsent()
      setHasDecision(Boolean(consent))
      setAnalyticsEnabled(consent?.analytics === true)
      setIsMounted(true)
    }

    const openPreferences = () => setIsDialogOpen(true)

    syncFromCookie()
    window.addEventListener(COOKIE_CONSENT_EVENT, syncFromCookie)
    window.addEventListener(COOKIE_PREFERENCES_EVENT, openPreferences)

    return () => {
      window.removeEventListener(COOKIE_CONSENT_EVENT, syncFromCookie)
      window.removeEventListener(COOKIE_PREFERENCES_EVENT, openPreferences)
    }
  }, [])

  if (!isMounted) return null

  const handleAccept = () => {
    saveCookieConsent(true)
    setIsDialogOpen(false)
  }

  const handleReject = () => {
    saveCookieConsent(false)
    setIsDialogOpen(false)
  }

  const handleSave = () => {
    saveCookieConsent(analyticsEnabled)
    setIsDialogOpen(false)
  }

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[85vh] w-[min(640px,calc(100%-1rem))] overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-0 text-white shadow-2xl sm:max-w-none">
          <DialogHeader className="border-b border-slate-800 p-6 sm:p-8">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-emerald-300 uppercase">
              <Cookie className="h-4 w-4" />
              {t.badge}
            </div>
            <DialogTitle className="text-xl leading-tight font-semibold">
              {t.preferencesTitle}
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm leading-relaxed break-words text-slate-300">
              {t.preferencesDescription}
            </DialogDescription>
          </DialogHeader>

          <div className="min-w-0 space-y-4 overflow-y-auto p-6 sm:p-8">
            <section className="min-w-0 rounded-xl border border-slate-800 bg-slate-900/50 p-5">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">
                  {t.technicalTitle}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed break-words text-slate-300">
                  {t.technicalDescription}
                </p>
              </div>
              <p className="mt-4 inline-flex rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
                {t.technicalState}
              </p>
            </section>

            <section className="min-w-0 rounded-xl border border-slate-800 bg-slate-900/50 p-5">
              <div className="flex min-w-0 items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">
                    {t.analyticsTitle}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed break-words text-slate-300">
                    {t.analyticsDescription}
                  </p>
                  <p className="mt-1.5 text-xs break-words text-slate-400">
                    {t.analyticsProvider}
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={analyticsEnabled}
                  onClick={() => setAnalyticsEnabled((value) => !value)}
                  className={cn(
                    'relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-colors focus-visible:ring-2 focus-visible:ring-emerald-400/60 focus-visible:outline-none',
                    analyticsEnabled
                      ? 'border-emerald-300/60 bg-emerald-400/30'
                      : 'border-slate-600 bg-slate-800'
                  )}
                >
                  <span
                    className={cn(
                      'inline-block h-5 w-5 rounded-full bg-white transition-transform',
                      analyticsEnabled ? 'translate-x-6' : 'translate-x-1'
                    )}
                  />
                  <span className="sr-only">{t.analyticsTitle}</span>
                </button>
              </div>
              <p className="mt-4 text-xs font-medium text-slate-400">
                {analyticsEnabled ? t.analyticsOn : t.analyticsOff}
              </p>
            </section>
          </div>

          <DialogFooter className="mx-0 mb-0 border-t border-slate-800 bg-slate-950 p-6 sm:p-8">
            <Button
              type="button"
              variant="outline"
              className="border-slate-600 bg-transparent text-white hover:bg-slate-800"
              onClick={handleReject}
            >
              {t.rejectAll}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-slate-600 bg-transparent text-white hover:bg-slate-800"
              onClick={handleSave}
            >
              {t.save}
            </Button>
            <Button
              type="button"
              className="bg-emerald-400 text-slate-950 hover:bg-emerald-300"
              onClick={handleAccept}
            >
              {t.acceptAll}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {!hasDecision ? (
        <section className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4">
          <div className="animate-in slide-in-from-bottom-4 fade-in mx-auto max-w-5xl rounded-xl border border-slate-700 bg-slate-950/80 p-4 text-white shadow-2xl backdrop-blur-md transition-all duration-500">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl min-w-0">
                <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-emerald-300 uppercase">
                  <Shield className="h-4 w-4" />
                  {t.badge}
                </div>
                <h2 className="mt-1 text-base font-semibold">{t.title}</h2>
                <p className="mt-2 text-sm leading-6 break-words text-slate-300">
                  {t.description}
                </p>
                <Link
                  href={policyHref}
                  className="mt-2 inline-block text-sm text-slate-400 underline underline-offset-4 transition-colors hover:text-emerald-300"
                >
                  {t.policy}
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <Button
                  type="button"
                  variant="outline"
                  className="border-slate-600 bg-transparent text-white hover:bg-slate-800"
                  onClick={handleReject}
                >
                  {t.rejectAll}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border-slate-600 bg-transparent text-white hover:bg-slate-800"
                  onClick={() => openCookiePreferences()}
                >
                  {t.configure}
                </Button>
                <Button
                  type="button"
                  className="bg-emerald-400 text-slate-950 hover:bg-emerald-300"
                  onClick={handleAccept}
                >
                  {t.acceptAll}
                </Button>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}
