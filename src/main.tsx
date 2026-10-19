import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AppErrorBoundary } from './components/AppErrorBoundary'
import { LocaleProvider } from './i18n';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LocaleProvider>
      <AppErrorBoundary>
        <App />
      </AppErrorBoundary>
    </LocaleProvider>
  </StrictMode>,
)
