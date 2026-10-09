import i18n from 'i18next'
import HttpBackend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

function readSavedLanguage(): string {
  try {
    const stored = localStorage.getItem('portfolio-storage')
    if (!stored) return 'en-US'
    return (JSON.parse(stored) as { state?: { language?: string } }).state?.language ?? 'en-US'
  } catch {
    // Corrupted or blocked storage must never blank the page.
    return 'en-US'
  }
}

const savedLang = readSavedLanguage()

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: savedLang,
    fallbackLng: 'en-US',
    load: 'currentOnly',
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
    interpolation: {
      escapeValue: false,
    },
    returnObjects: true,
  })

export default i18n
