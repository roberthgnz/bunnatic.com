'use client'

import { Button } from '@/components/ui/button'
import { useLanguage } from '@/components/LanguageProvider'
import { openCookiePreferences } from '@/lib/cookieConsent'
import { Cookie } from 'lucide-react'

export function CookiePreferencesButton() {
  const { language } = useLanguage()

  return (
    <Button
      type="button"
      variant="ghost"
      className="h-auto px-0 text-sm font-medium text-gray-400 hover:bg-transparent hover:text-white"
      onClick={() => openCookiePreferences()}
    >
      <Cookie className="mr-2 h-4 w-4" />
      {language === 'ca'
        ? 'Preferències de cookies'
        : 'Preferencias de cookies'}
    </Button>
  )
}
