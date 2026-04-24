import { describe, it, expect, beforeEach } from 'vitest'
import { useAppStore } from '../useAppStore'

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
