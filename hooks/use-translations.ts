'use client'

import { useState, useEffect } from 'react'
import { getTranslations, type Locale } from '@/lib/i18n'

export function useTranslations() {
  const [locale, setLocaleState] = useState<Locale>('pt')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Get locale from localStorage or default to 'pt'
    const savedLocale = (localStorage.getItem('locale') as Locale) || 'pt'
    setLocaleState(savedLocale)
    setMounted(true)
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('locale', newLocale)
    // Reload page to apply translations
    window.location.reload()
  }

  const t = getTranslations(locale)

  return {
    locale,
    setLocale,
    t,
    mounted,
  }
}
