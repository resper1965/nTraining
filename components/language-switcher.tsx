'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const [locale, setLocale] = useState<'pt' | 'en'>('pt')

  useEffect(() => {
    // Get locale from cookie
    const cookieLocale = document.cookie
      .split('; ')
      .find(row => row.startsWith('locale='))
      ?.split('=')[1] as 'pt' | 'en' | undefined
    
    if (cookieLocale) {
      setLocale(cookieLocale)
    }
  }, [])

  const switchLanguage = async (newLocale: 'pt' | 'en') => {
    // Set cookie
    document.cookie = `locale=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}`
    setLocale(newLocale)
    
    // Reload page to apply new language
    router.refresh()
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={locale === 'pt' ? 'default' : 'outline'}
        size="sm"
        onClick={() => switchLanguage('pt')}
        className="min-w-[40px]"
      >
        PT
      </Button>
      <Button
        variant={locale === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => switchLanguage('en')}
        className="min-w-[40px]"
      >
        EN
      </Button>
    </div>
  )
}

