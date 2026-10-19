import type { ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { useTranslation } from '../i18n';

/**
 * Thin wrapper so the class boundary can be given localized copy — it sits
 * inside LocaleProvider but cannot use hooks itself.
 */
export function AppErrorBoundary({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  return (
    <ErrorBoundary title={t.errorTitle} body={t.errorBody} reloadLabel={t.errorReload}>
      {children}
    </ErrorBoundary>
  );
}
