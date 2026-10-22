import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary";

import App from './App.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'
import { LanguageProvider } from './lib/i18n.tsx'

// main.css — единственная точка входа: внутри уже подключены theme.css и index.css.
import "./main.css"

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <LanguageProvider>
      <App />
    </LanguageProvider>
   </ErrorBoundary>
)
