import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { de } from './de';
import { en } from './en';
import { fr } from './fr';
import { es } from './es';
import { nl } from './nl';
import { LocaleContext, type Language, type LocaleContextValue } from './LocaleContext';

const dictionaries = { de, en, fr, es, nl };
const storageKey = 'series-creator-locale';

function detectLocale(): Language {
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (stored && Object.hasOwn(dictionaries, stored)) return stored as Language;
  } catch {
    // Fall back to browser language when localStorage is blocked.
  }
  const browserLocale = window.navigator.language.toLowerCase().split('-')[0];
  return Object.hasOwn(dictionaries, browserLocale) ? browserLocale as Language : 'de';
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Language>(detectLocale);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, locale);
    } catch {
      // Locale selection still works for the current render.
    }
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      t: dictionaries[locale],
    }),
    [locale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}
