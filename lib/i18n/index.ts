import { cookies } from 'next/headers';
import { translations, type Locale } from './translations';

const defaultLocale: Locale = 'pt';
const supportedLocales: Locale[] = ['pt', 'en'];

export function getLocale(): Locale {
  const cookieStore = cookies();
  const localeCookie = cookieStore.get('locale');
  
  if (localeCookie?.value && supportedLocales.includes(localeCookie.value as Locale)) {
    return localeCookie.value as Locale;
  }
  
  // Try to detect from Accept-Language header
  // For now, default to Portuguese
  return defaultLocale;
}

export function getTranslations(locale: Locale = getLocale()) {
  return translations[locale] || translations[defaultLocale];
}

export function setLocale(locale: Locale) {
  const cookieStore = cookies();
  cookieStore.set('locale', locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });
}

