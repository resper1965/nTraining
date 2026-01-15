'use client'

import { useState, useEffect, useRef } from 'react'
import { getTranslations, type Locale } from '@/lib/i18n'

export function useTranslations() {
  const [locale, setLocaleState] = useState<Locale>('pt')
  const [mounted, setMounted] = useState(false)
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true
    
    // Get locale from localStorage or default to 'pt'
    // Usar try/catch para evitar erros em SSR
    try {
      const savedLocale = (localStorage.getItem('locale') as Locale) || 'pt'
      if (isMountedRef.current) {
        setLocaleState(savedLocale)
        setMounted(true)
      }
    } catch (error) {
      // localStorage pode não estar disponível em SSR
      if (isMountedRef.current) {
        setMounted(true)
      }
    }
    
    return () => {
      isMountedRef.current = false
    }
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
