import { useContext } from 'react';
import { LocaleContext } from './LocaleContext';

export function useTranslation() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error('LocaleProvider is missing.');
  return context;
}
