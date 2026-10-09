import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../store/useAppStore'
import Icon from './Icon'
import type { Tab, Language } from '../types'

const TABS: Tab[] = ['about', 'resume', 'portfolio', 'contact']

const LANGUAGES: { code: Language; label: string; fullName: string }[] = [
  { code: 'en-US', label: 'EN', fullName: 'English (US)' },
  { code: 'vi-VN', label: 'VI', fullName: 'Tiếng Việt' },
]

interface NavBarProps {
  tab: Tab
  onTabChange: (tab: Tab) => void
}

export default function NavBar({ tab, onTabChange }: NavBarProps) {
  const { t, i18n } = useTranslation()
  const { theme, setTheme, language, setLanguage } = useAppStore()
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)
  const langButtonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!langOpen) return
    const close = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setLangOpen(false); langButtonRef.current?.focus() }
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', onKey) }
  }, [langOpen])

  // Move focus into the menu when it opens (keyboard users land on the current language).
  useEffect(() => {
    if (langOpen) menuRef.current?.querySelector<HTMLElement>('[aria-checked="true"]')?.focus()
  }, [langOpen])

  const onMenuKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    e.preventDefault()
    const items = [...(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitemradio"]') ?? [])]
    const i = items.indexOf(document.activeElement as HTMLElement)
    items[(i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length]?.focus()
  }

  const handleLanguageChange = (code: Language) => {
    setLanguage(code)
    i18n.changeLanguage(code)
    setLangOpen(false)
    langButtonRef.current?.focus()
  }

  const currentLang = LANGUAGES.find(l => l.code === language) ?? LANGUAGES[0]

  return (
    <nav className="tab-nav" style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--nav-bg)', border: '1px solid var(--border)', borderRadius: '12px', padding: '4px', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '1.5rem', boxShadow: '0 1px 8px rgba(0,0,0,0.05)' }}>
      {TABS.map(tabKey => (
        <button key={tabKey} className="tab-btn" onClick={() => onTabChange(tabKey)} aria-current={tab === tabKey ? 'page' : undefined}
          style={{
            flex: 1, whiteSpace: 'nowrap', padding: '8px 4px', borderRadius: '9px', border: 'none',
            background: tab === tabKey ? 'var(--bg-card)' : 'transparent',
            color: tab === tabKey ? 'var(--fg)' : 'var(--fg-3)',
            fontWeight: tab === tabKey ? 600 : 400,
            fontSize: '0.86rem', cursor: 'pointer', transition: 'all 0.18s ease',
            boxShadow: tab === tabKey ? '0 1px 4px rgba(0,0,0,0.08), 0 0 0 1px var(--border)' : 'none',
            fontFamily: "'DM Sans', system-ui, sans-serif",
          }}
          onMouseEnter={e => { if (tab !== tabKey) e.currentTarget.style.color = 'var(--fg)' }}
          onMouseLeave={e => { if (tab !== tabKey) e.currentTarget.style.color = 'var(--fg-3)' }}
        >
          {t(`nav.${tabKey}`)}
        </button>
      ))}

      <div style={{ marginLeft: 'auto', paddingLeft: '4px', borderLeft: '1px solid var(--border)', display: 'flex', gap: '2px', alignItems: 'center' }}>
        {/* Language dropdown */}
        <div ref={langRef} style={{ position: 'relative' }}>
          <button ref={langButtonRef} className="lang-btn"
            onClick={() => setLangOpen(o => !o)}
            aria-label={`${t('ui.language')} (${currentLang.label})`}
            aria-haspopup="menu" aria-expanded={langOpen} aria-controls="language-menu"
            style={{ display: 'flex', alignItems: 'center', gap: '4px', height: 36, padding: '0 10px', borderRadius: '8px', background: langOpen ? 'var(--tag-bg)' : 'transparent', border: '1px solid ' + (langOpen ? 'var(--border)' : 'transparent'), cursor: 'pointer', color: langOpen ? 'var(--accent-text)' : 'var(--fg-2)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', fontFamily: "'DM Sans', system-ui, sans-serif", transition: 'all 0.18s' }}
            onMouseEnter={e => { if (!langOpen) { e.currentTarget.style.background = 'var(--tag-bg)'; e.currentTarget.style.color = 'var(--accent-text)' } }}
            onMouseLeave={e => { if (!langOpen) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--fg-2)' } }}
          >
            {currentLang.label}
            <Icon name={langOpen ? 'chevronup' : 'chevrondown'} size={12} />
          </button>

          {langOpen && (
            <div id="language-menu" ref={menuRef} role="menu" aria-label={t('ui.language')} onKeyDown={onMenuKeyDown} style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, minWidth: 148, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', overflow: 'hidden', zIndex: 200 }}>
              {LANGUAGES.map(l => (
                <button
                  key={l.code} role="menuitemradio" aria-checked={l.code === language} lang={l.code} tabIndex={-1}
                  onClick={() => handleLanguageChange(l.code)}
                  style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 16px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.88rem', fontWeight: l.code === language ? 600 : 400, color: l.code === language ? 'var(--accent-text)' : 'var(--fg)', fontFamily: "'DM Sans', system-ui, sans-serif", transition: 'background 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--tag-bg)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                >
                  {l.fullName}
                </button>
              ))}
            </div>
          )}
        </div>

        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label={t('ui.toggleTheme')} aria-pressed={theme === 'dark'}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: '8px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--fg-2)', transition: 'color 0.18s, background 0.18s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--tag-bg)'; e.currentTarget.style.color = 'var(--accent-text)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--fg-2)' }}
        >
          <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={16} />
        </button>
      </div>
    </nav>
  )
}
