'use client'

import { Button } from '@/components/ui/button'
import { openCookiePreferences } from '@/lib/cookieConsent'
import { Cookie } from 'lucide-react'

export function CookiePreferencesButton() {
  return (
    <Button
      type="button"
      variant="ghost"
      className="h-auto px-0 text-sm font-medium text-gray-400 hover:bg-transparent hover:text-white"
      onClick={() => openCookiePreferences()}
    >
      <Cookie className="mr-2 h-4 w-4" />
      Preferencias de cookies
    </Button>
  )
}
