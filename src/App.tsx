import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useAppStore } from './store/useAppStore'
import Sidebar from './components/Sidebar'
import NavBar from './components/NavBar'
import About from './pages/About'
import Resume from './pages/Resume'
import Portfolio from './pages/Portfolio'
import Contact from './pages/Contact'
import type { Tab } from './types'

const PAGES: Record<Tab, React.ReactNode> = {
  about: <About />,
  resume: <Resume />,
  portfolio: <Portfolio />,
  contact: <Contact />,
}

export default function App() {
  const [tab, setTab] = useState<Tab>('about')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { theme } = useAppStore()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'none', position: 'sticky', top: 0, zIndex: 100, background: 'var(--nav-bg)', borderBottom: '1px solid var(--border)', padding: '0.75rem 1.25rem', alignItems: 'center', justifyContent: 'space-between' }} className="mobile-topbar">
        <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg)', fontSize: '1.2rem' }}>☰</button>
        <span style={{ fontFamily: "var(--font-serif)", fontSize: '1rem', color: 'var(--fg)' }}>Hoan Ngo</span>
        <div style={{ width: 24 }} />
      </div>

      {sidebarOpen && createPortal(
        <>
          <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} />
          <Sidebar mobile onClose={() => setSidebarOpen(false)} />
        </>,
        document.body
      )}

      <div style={{ maxWidth: 1120, margin: '0 auto', padding: '2rem 1.5rem', display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.75rem', alignItems: 'start', width: '100%' }} className="desktop-grid">
        <Sidebar />
        <div style={{ minWidth: 0 }}>
          <NavBar tab={tab} onTabChange={setTab} />
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: 'clamp(1.5rem, 4vw, 2.5rem)', boxShadow: '0 1px 8px rgba(0,0,0,0.04)', minHeight: 400 }}>
            {PAGES[tab]}
          </div>
          <div style={{ textAlign: 'center', padding: '1.5rem 0 0.5rem', fontSize: '0.78rem', color: 'var(--fg-3)' }}>
            © {new Date().getFullYear()} Hoan Ngo · Hanoi, Vietnam
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-grid { grid-template-columns: 1fr !important; }
          .desktop-grid > aside:first-child { display: none !important; }
          .mobile-topbar { display: flex !important; }
          .desktop-grid { padding-top: 1rem !important; }
          .tab-nav { top: 3rem !important; border-radius: 0 0 12px 12px !important; margin-left: -0.75rem !important; margin-right: -0.75rem !important; }
        }
        @media (max-width: 540px) {
          .desktop-grid { padding: 0.75rem !important; }
        }
      `}</style>
    </div>
  )
}
