'use client';

import {useEffect, useMemo, useState} from 'react';
import {Link} from '@/i18n/navigation';
import {useLanguage} from '@/components/LanguageProvider';
import {Button} from '@/components/ui/button';
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
    title: 'Tu privacidad primero',
    description:
      'Usamos cookies técnicas para que la web funcione y cookies analíticas solo si las aceptas. Puedes cambiar tu decisión en cualquier momento.',
    accept: 'Aceptar analíticas',
    reject: 'Rechazar',
    configure: 'Configurar',
    policy: 'Política de cookies',
    preferencesTitle: 'Preferencias de cookies',
    preferencesDescription:
      'Las cookies técnicas son necesarias para el funcionamiento básico del sitio. Las analíticas son opcionales y se activan solo con tu consentimiento.',
    necessaryTitle: 'Cookies técnicas',
    necessaryDescription: 'Siempre activas. Mantienen seguridad, sesión y funciones básicas.',
    necessaryEnabled: 'Siempre activas',
    analyticsTitle: 'Cookies analíticas',
    analyticsDescription: 'Miden uso y rendimiento para mejorar el producto. Proveedor: Google Analytics.',
    analyticsEnabled: 'Activadas',
    analyticsDisabled: 'Desactivadas',
    saveSelection: 'Guardar selección',
  },
  ca: {
    badge: 'Cookies',
    title: 'La teva privacitat primer',
    description:
      'Fem servir cookies tècniques perquè el web funcioni i cookies analítiques només si les acceptes. Pots canviar la decisió quan vulguis.',
    accept: 'Acceptar analítiques',
    reject: 'Rebutjar',
    configure: 'Configurar',
    policy: 'Política de cookies',
    preferencesTitle: 'Preferències de cookies',
    preferencesDescription:
      'Les cookies tècniques són necessàries per al funcionament bàsic del lloc. Les analítiques són opcionals i només s\'activen amb el teu consentiment.',
    necessaryTitle: 'Cookies tècniques',
    necessaryDescription: 'Sempre actives. Mantenen seguretat, sessió i funcions bàsiques.',
    necessaryEnabled: 'Sempre actives',
    analyticsTitle: 'Cookies analítiques',
    analyticsDescription: 'Mesuren ús i rendiment per millorar el producte. Proveïdor: Google Analytics.',
    analyticsEnabled: 'Activades',
    analyticsDisabled: 'Desactivades',
    saveSelection: 'Desar selecció',
  },
} as const;

export function CookieConsent() {
  const {language} = useLanguage();
  const t = copy[language];
  const [isMounted, setIsMounted] = useState(false);
  const [hasDecision, setHasDecision] = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const policyHref = useMemo(
    () => `/${getLegalSlug('politica-cookies', language)}`,
    [language],
  );

  useEffect(() => {
    const syncFromCookie = () => {
      const consent = getCookieConsent();
      setHasDecision(Boolean(consent));
      setAnalyticsEnabled(consent?.analytics === true);
      setIsMounted(true);
    };

    const openPreferences = () => {
      setIsDialogOpen(true);
    };

    syncFromCookie();
    window.addEventListener(COOKIE_CONSENT_EVENT, syncFromCookie);
    window.addEventListener(COOKIE_PREFERENCES_EVENT, openPreferences);

    return () => {
      window.removeEventListener(COOKIE_CONSENT_EVENT, syncFromCookie);
      window.removeEventListener(COOKIE_PREFERENCES_EVENT, openPreferences);
    };
  }, []);

  if (!isMounted) {
    return null;
  }

  const handleAccept = () => {
    saveCookieConsent(true);
    setIsDialogOpen(false);
  };

  const handleReject = () => {
    saveCookieConsent(false);
    setIsDialogOpen(false);
  };

  const showBanner = !hasDecision;

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl border-white/10 bg-[#101113] text-white">
          <DialogHeader>
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-400">
              {t.badge}
            </div>
            <DialogTitle className="text-xl">{t.preferencesTitle}</DialogTitle>
            <DialogDescription className="text-sm text-gray-300">
              {t.preferencesDescription}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-white">{t.necessaryTitle}</p>
                  <p className="mt-1 text-sm text-gray-300">{t.necessaryDescription}</p>
                </div>
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                  {t.necessaryEnabled}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-white">{t.analyticsTitle}</p>
                  <p className="mt-1 text-sm text-gray-300">{t.analyticsDescription}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={analyticsEnabled}
                  onClick={() => setAnalyticsEnabled((current) => !current)}
                  className={cn(
                    'relative inline-flex h-7 w-12 items-center rounded-full border transition-colors',
                    analyticsEnabled
                      ? 'border-emerald-400/60 bg-emerald-500/30'
                      : 'border-white/10 bg-white/10',
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
              <p className="mt-3 text-xs font-medium text-gray-400">
                {analyticsEnabled ? t.analyticsEnabled : t.analyticsDisabled}
              </p>
            </div>
          </div>

          <DialogFooter className="bg-transparent p-0 pt-2">
            <Button
              type="button"
              variant="outline"
              className="border-white/15 bg-transparent text-white hover:bg-white/10"
              onClick={handleReject}
            >
              {t.reject}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-white/15 bg-transparent text-white hover:bg-white/10"
              onClick={() => {
                saveCookieConsent(analyticsEnabled);
                setIsDialogOpen(false);
              }}
            >
              {t.saveSelection}
            </Button>
            <Button type="button" className="bg-emerald-500 text-black hover:bg-emerald-400" onClick={handleAccept}>
              {t.accept}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showBanner ? (
        <section className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#0c0d0f]/95 px-4 py-4 text-white shadow-2xl backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-400">
                {t.badge}
              </div>
              <h2 className="mt-2 text-lg font-semibold">{t.title}</h2>
              <p className="mt-2 text-sm leading-6 text-gray-300">
                {t.description}{' '}
                <Link href={policyHref} className="underline underline-offset-4 hover:text-white">
                  {t.policy}
                </Link>
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="border-white/15 bg-transparent text-white hover:bg-white/10"
                onClick={handleReject}
              >
                {t.reject}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border-white/15 bg-transparent text-white hover:bg-white/10"
                onClick={() => openCookiePreferences()}
              >
                {t.configure}
              </Button>
              <Button type="button" className="bg-emerald-500 text-black hover:bg-emerald-400" onClick={handleAccept}>
                {t.accept}
              </Button>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
