import './i18n'
import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import profile from './data/profile.json'

// Shown while the locale file loads, instead of a blank page.
const loading = <div className="app-loading" role="status">{profile.name}</div>

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={loading}>
      <App />
    </Suspense>
  </StrictMode>
)
