'use client';

import {useEffect, useMemo, useState} from 'react';
import {Link} from '@/i18n/navigation';
import {useLanguage} from '@/components/LanguageProvider';
import {Button} from '@/components/ui/button';
import {Cookie, Shield} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  COOKIE_CONSENT_EVENT,
  COOKIE_PREFERENCES_EVENT,
  getCookieConsent,
  openCookiePreferences,
  saveCookieConsent,
} from '@/lib/cookieConsent';
import {cn} from '@/lib/utils';
import {getLegalSlug} from '@/lib/pageSlugs';

const copy = {
  es: {
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
    technicalDescription: 'Necesarias para seguridad, sesion y funciones basicas.',
    technicalState: 'Siempre activas',
    analyticsTitle: 'Cookies',
    analyticsDescription: 'Miden uso y rendimiento para mejorar el producto.',
    analyticsProvider: 'Proveedor: Google Analytics',
    analyticsOn: 'Activadas',
    analyticsOff: 'Desactivadas',
    save: 'Guardar preferencias',
    reopen: 'Preferencias de cookies',
  },
  ca: {
    badge: 'Cookies',
    title: 'Cookies i privacitat',
    description:
      'Fem servir cookies tecniques per al funcionament del lloc. Les cookies nomes s activen amb el teu consentiment.',
    policy: 'Politica de cookies',
    acceptAll: 'Acceptar',
    rejectAll: 'Rebutjar',
    configure: 'Configurar',
    preferencesTitle: 'Preferencies de cookies',
    preferencesDescription:
      'Pots activar o desactivar cookies. Les cookies tecniques son obligatories.',
    technicalTitle: 'Cookies tecniques',
    technicalDescription: 'Necessaries per seguretat, sessio i funcions basiques.',
    technicalState: 'Sempre actives',
    analyticsTitle: 'Cookies',
    analyticsDescription: 'Mesuren us i rendiment per millorar el producte.',
    analyticsProvider: 'Proveidor: Google Analytics',
    analyticsOn: 'Activades',
    analyticsOff: 'Desactivades',
    save: 'Desar preferencies',
    reopen: 'Preferencies de cookies',
  },
} as const;

export function CookieConsent() {
  const {language} = useLanguage();
  const t = copy[language];
  const [isMounted, setIsMounted] = useState(false);
  const [hasDecision, setHasDecision] = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const policyHref = useMemo(() => `/${getLegalSlug('politica-cookies', language)}`, [language]);

  useEffect(() => {
    const syncFromCookie = () => {
      const consent = getCookieConsent();
      setHasDecision(Boolean(consent));
      setAnalyticsEnabled(consent?.analytics === true);
      setIsMounted(true);
    };

    const openPreferences = () => setIsDialogOpen(true);

    syncFromCookie();
    window.addEventListener(COOKIE_CONSENT_EVENT, syncFromCookie);
    window.addEventListener(COOKIE_PREFERENCES_EVENT, openPreferences);

    return () => {
      window.removeEventListener(COOKIE_CONSENT_EVENT, syncFromCookie);
      window.removeEventListener(COOKIE_PREFERENCES_EVENT, openPreferences);
    };
  }, []);

  if (!isMounted) return null;

  const handleAccept = () => {
    saveCookieConsent(true);
    setIsDialogOpen(false);
  };

  const handleReject = () => {
    saveCookieConsent(false);
    setIsDialogOpen(false);
  };

  const handleSave = () => {
    saveCookieConsent(analyticsEnabled);
    setIsDialogOpen(false);
  };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[min(640px,calc(100%-1rem))] max-h-[85vh] overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-0 text-white sm:max-w-none shadow-2xl">
          <DialogHeader className="border-b border-slate-800 p-6 sm:p-8">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-300">
              <Cookie className="h-4 w-4" />
              {t.badge}
            </div>
            <DialogTitle className="text-xl font-semibold leading-tight">{t.preferencesTitle}</DialogTitle>
            <DialogDescription className="text-sm leading-relaxed text-slate-300 break-words mt-2">
              {t.preferencesDescription}
            </DialogDescription>
          </DialogHeader>

          <div className="min-w-0 space-y-4 overflow-y-auto p-6 sm:p-8">
            <section className="min-w-0 rounded-xl border border-slate-800 bg-slate-900/50 p-5">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">{t.technicalTitle}</p>
                <p className="mt-1.5 break-words text-sm text-slate-300 leading-relaxed">{t.technicalDescription}</p>
              </div>
              <p className="mt-4 inline-flex rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
                {t.technicalState}
              </p>
            </section>

            <section className="min-w-0 rounded-xl border border-slate-800 bg-slate-900/50 p-5">
              <div className="flex min-w-0 items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">{t.analyticsTitle}</p>
                  <p className="mt-1.5 break-words text-sm text-slate-300 leading-relaxed">{t.analyticsDescription}</p>
                  <p className="mt-1.5 break-words text-xs text-slate-400">{t.analyticsProvider}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={analyticsEnabled}
                  onClick={() => setAnalyticsEnabled((value) => !value)}
                  className={cn(
                    'relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60',
                    analyticsEnabled
                      ? 'border-emerald-300/60 bg-emerald-400/30'
                      : 'border-slate-600 bg-slate-800',
                  )}
                >
                  <span
                    className={cn(
                      'inline-block h-5 w-5 rounded-full bg-white transition-transform',
                      analyticsEnabled ? 'translate-x-6' : 'translate-x-1',
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

          <DialogFooter className="border-t border-slate-800 bg-slate-950 p-6 sm:p-8 mx-0 mb-0">
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
            <Button type="button" className="bg-emerald-400 text-slate-950 hover:bg-emerald-300" onClick={handleAccept}>
              {t.acceptAll}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {!hasDecision ? (
        <section className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4">
          <div className="mx-auto max-w-5xl rounded-xl border border-slate-700 bg-slate-950/80 p-4 text-white shadow-2xl backdrop-blur-md transition-all duration-500 animate-in slide-in-from-bottom-4 fade-in">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0 max-w-3xl">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald-300">
                  <Shield className="h-4 w-4" />
                  {t.badge}
                </div>
                <h2 className="mt-1 text-base font-semibold">{t.title}</h2>
                <p className="mt-2 break-words text-sm leading-6 text-slate-300">{t.description}</p>
                <Link href={policyHref} className="mt-2 inline-block text-sm underline underline-offset-4 text-slate-400 hover:text-emerald-300 transition-colors">
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
                <Button type="button" className="bg-emerald-400 text-slate-950 hover:bg-emerald-300" onClick={handleAccept}>
                  {t.acceptAll}
                </Button>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <button
          type="button"
          onClick={() => openCookiePreferences()}
          className="fixed bottom-4 left-4 z-40 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/85 px-3 py-2 text-xs font-medium text-slate-200 shadow-lg backdrop-blur hover:border-emerald-400/40 hover:text-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
        >
          <Cookie className="h-3.5 w-3.5" />
          {t.reopen}
        </button>
      )}
    </>
  );
}
