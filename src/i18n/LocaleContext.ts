import { createContext } from 'react';
import type { TranslationKey } from './de';

export type Language = 'de' | 'en';

export type LocaleContextValue = {
  locale: Language;
  setLocale: (locale: Language) => void;
  t: Record<TranslationKey, string>;
};

export const LocaleContext = createContext<LocaleContextValue | null>(null);
