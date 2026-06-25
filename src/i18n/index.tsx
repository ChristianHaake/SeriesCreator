import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { de, type TranslationKey } from "./de";
import { en } from "./en";

export type Language = 'de' | 'en';

const dictionaries = { de, en };
const storageKey = "series-creator-locale";

function detectLocale(): Language {
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (stored === "de" || stored === "en") return stored;
  } catch {
    // Fall back to browser language when localStorage is blocked.
  }
  return window.navigator.language.toLowerCase().startsWith("en") ? "en" : "de";
}

type LocaleContextValue = {
  locale: Language;
  setLocale: (locale: Language) => void;
  t: Record<TranslationKey, string>;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

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

export function useTranslation() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("LocaleProvider is missing.");
  return context;
}

export { type TranslationKey };
