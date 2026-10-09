import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Theme, Language } from '../types'

interface AppState {
  theme: Theme
  language: Language
  setTheme: (theme: Theme) => void
  setLanguage: (lang: Language) => void
}

// First visit (nothing persisted yet): follow the OS colour scheme.
export function systemTheme(): Theme {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: systemTheme(),
      language: 'en-US',
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
    }),
    { name: 'portfolio-storage' }
  )
)
