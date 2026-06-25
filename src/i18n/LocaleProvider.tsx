import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { de } from './de';
import { en } from './en';
import { LocaleContext, type Language, type LocaleContextValue } from './LocaleContext';

const dictionaries = { de, en };
const storageKey = 'series-creator-locale';

function detectLocale(): Language {
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (stored === 'de' || stored === 'en') return stored;
  } catch {
    // Fall back to browser language when localStorage is blocked.
  }
  return window.navigator.language.toLowerCase().startsWith('en') ? 'en' : 'de';
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
