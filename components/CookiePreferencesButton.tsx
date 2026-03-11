'use client';

import {Button} from '@/components/ui/button';
import {useLanguage} from '@/components/LanguageProvider';
import {openCookiePreferences} from '@/lib/cookieConsent';

export function CookiePreferencesButton() {
  const {language} = useLanguage();

  return (
    <Button
      type="button"
      variant="ghost"
      className="h-auto px-0 text-sm font-medium text-gray-400 hover:bg-transparent hover:text-white"
      onClick={() => openCookiePreferences()}
    >
      {language === 'ca' ? 'Configurar cookies' : 'Configurar cookies'}
    </Button>
  );
}
