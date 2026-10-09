import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useAppStore, systemTheme } from '../useAppStore'

describe('useAppStore', () => {
  beforeEach(() => {
    useAppStore.setState({ theme: 'light', language: 'en-US' })
  })

  it('defaults to light theme and en-US language', () => {
    const { theme, language } = useAppStore.getState()
    expect(theme).toBe('light')
    expect(language).toBe('en-US')
  })

  it('setTheme updates theme', () => {
    useAppStore.getState().setTheme('dark')
    expect(useAppStore.getState().theme).toBe('dark')
  })

  it('setLanguage updates language', () => {
    useAppStore.getState().setLanguage('vi-VN')
    expect(useAppStore.getState().language).toBe('vi-VN')
  })
})

describe('systemTheme', () => {
  const original = window.matchMedia
  afterEach(() => { window.matchMedia = original })

  const mockScheme = (dark: boolean) => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: dark && query.includes('dark'), media: query,
      addEventListener: vi.fn(), removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia
  }

  it('returns dark when the OS prefers dark', () => {
    mockScheme(true)
    expect(systemTheme()).toBe('dark')
  })

  it('returns light when the OS prefers light', () => {
    mockScheme(false)
    expect(systemTheme()).toBe('light')
  })
})
