import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { useAppStore } from './store/useAppStore'
import Sidebar from './components/Sidebar'
import NavBar from './components/NavBar'
import About from './pages/About'
import Resume from './pages/Resume'
import Portfolio from './pages/Portfolio'
import Contact from './pages/Contact'
import Icon from './components/Icon'
import profile from './data/profile.json'
import { RESUME_URL } from './resumeUrl'
import type { Tab } from './types'

const PAGES: Record<Tab, React.ReactNode> = {
  about: <About />,
  resume: <Resume />,
  portfolio: <Portfolio />,
  contact: <Contact />,
}

// Matches --bg in index.css so the mobile browser chrome follows the theme.
const THEME_COLOR = { light: '#f5f4ed', dark: '#141413' } as const

// Height of the sticky mobile top bar; the sticky tab nav sits right below it.
const MOBILE_TOPBAR_HEIGHT = 56

// Tabs live in the URL hash so /#resume deep-links and Back/Forward work on GitHub Pages.
function tabFromHash(): Tab {
  const hash = window.location.hash.slice(1)
  return hash in PAGES ? (hash as Tab) : 'about'
}

const FOCUSABLE = 'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'

export default function App() {
  const [tab, setTab] = useState<Tab>(tabFromHash)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { theme } = useAppStore()
  const { t, i18n } = useTranslation()
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)
  const wasOpen = useRef(false)

  useEffect(() => {
    const onHashChange = () => setTab(tabFromHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [tab])

  useEffect(() => {
    document.documentElement.lang = i18n.language?.startsWith('vi') ? 'vi' : 'en'
  }, [i18n.language])

  const changeTab = (next: Tab) => {
    if (next !== tab) window.location.hash = next
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme])
  }, [theme])

  // Mobile drawer: lock scroll, move focus in, trap Tab, close on Escape, restore focus on close.
  useEffect(() => {
    if (!sidebarOpen) {
      document.body.style.overflow = ''
      if (wasOpen.current) menuButtonRef.current?.focus()
      wasOpen.current = false
      return
    }
    wasOpen.current = true
    document.body.style.overflow = 'hidden'
    drawerRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setSidebarOpen(false); return }
      if (e.key !== 'Tab' || !drawerRef.current) return
      const items = [...drawerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)]
      if (!items.length) return
      const first = items[0], last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [sidebarOpen])

  const location = t('sidebar.location', { defaultValue: profile.location })

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <a href="#main" className="skip-link">{t('ui.skipToContent')}</a>

      <div style={{ display: 'none', position: 'sticky', top: 0, zIndex: 100, height: MOBILE_TOPBAR_HEIGHT, background: 'var(--nav-bg)', borderBottom: '1px solid var(--border)', padding: '0 1.25rem', alignItems: 'center', justifyContent: 'space-between' }} className="mobile-topbar">
        <button ref={menuButtonRef} onClick={() => setSidebarOpen(true)} aria-label={t('ui.openMenu')} aria-expanded={sidebarOpen} aria-controls="mobile-drawer"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, marginLeft: -8, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg)' }}>
          <Icon name="menu" size={22} />
        </button>
        <span style={{ fontFamily: "var(--font-serif)", fontSize: '1rem', color: 'var(--fg)' }}>{profile.name}</span>
        <div style={{ width: 32 }} />
      </div>

      <div className="mobile-summary" style={{ display: 'none', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}>
        <div style={{ fontSize: '0.84rem', color: 'var(--fg-2)', minWidth: 0 }}>
          <span style={{ color: 'var(--accent-text)', fontWeight: 600 }}>{t('sidebar.dataEngineer')}</span>
          {' · '}<span style={{ whiteSpace: 'nowrap' }}>{location}</span>
        </div>
        <a href={RESUME_URL} download
          style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.8rem', borderRadius: '9px', background: 'var(--accent-solid)', color: 'var(--on-accent)', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600 }}
        >
          <Icon name="download" size={14} />
          {t('ui.downloadResume')}
        </a>
      </div>

      {sidebarOpen && createPortal(
        <div id="mobile-drawer" ref={drawerRef} role="dialog" aria-modal="true" aria-label={profile.name}>
          <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} />
          <Sidebar mobile onClose={() => setSidebarOpen(false)} />
        </div>,
        document.body
      )}

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '2rem 1.5rem', display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.75rem', alignItems: 'start', width: '100%' }} className="desktop-grid">
        <Sidebar />
        <div style={{ minWidth: 0 }}>
          <NavBar tab={tab} onTabChange={changeTab} />
          <main id="main" tabIndex={-1} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: 'clamp(1.5rem, 4vw, 2.5rem)', boxShadow: '0 1px 8px rgba(0,0,0,0.04)', minHeight: 400, outline: 'none' }}>
            {PAGES[tab]}
          </main>
          <footer style={{ textAlign: 'center', padding: '1.5rem 0 0.5rem', fontSize: '0.78rem', color: 'var(--fg-3)' }}>
            {t('footer.copyright', { year: new Date().getFullYear(), name: profile.name, location })}
          </footer>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-grid { grid-template-columns: 1fr !important; }
          .desktop-grid > aside:first-child { display: none !important; }
          .mobile-topbar { display: flex !important; }
          .mobile-summary { display: flex !important; }
          .desktop-grid { padding-top: 1rem !important; }
          .tab-nav { top: ${MOBILE_TOPBAR_HEIGHT}px !important; border-radius: 0 0 12px 12px !important; margin-left: -0.75rem !important; margin-right: -0.75rem !important; }
        }
        @media (max-width: 540px) {
          .desktop-grid { padding: 0.75rem !important; }
          .tab-nav .tab-btn { font-size: 0.8rem !important; padding: 8px 2px !important; }
          .tab-nav .lang-btn { padding: 0 6px !important; }
        }
      `}</style>
    </div>
  )
}
