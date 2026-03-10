"use client";

import React, {createContext, useContext} from 'react';
import {useLocale} from 'next-intl';
import {usePathname, useRouter} from '@/i18n/navigation';

export type Language = 'es' | 'ca';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({children}: {children: React.ReactNode}) {
  const locale = useLocale() as Language;
  const router = useRouter();
  const pathname = usePathname();

  const setLanguage = (lang: Language) => {
    router.replace(pathname, {locale: lang});
  };

  return (
    <LanguageContext.Provider value={{language: locale, setLanguage}}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  return context;
}
