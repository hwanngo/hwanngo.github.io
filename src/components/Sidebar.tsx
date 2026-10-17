import { useTranslation } from 'react-i18next'
import profile from '../data/profile.json'
import Icon from './Icon'
import { RESUME_URL, SHOW_RESUME_DOWNLOAD } from '../resumeUrl'
import type { Profile } from '../types'

const profileData = profile as Profile

interface SidebarProps {
  mobile?: boolean
  onClose?: () => void
}

export default function Sidebar({ mobile = false, onClose }: SidebarProps) {
  const { t } = useTranslation()
  // Optional per-locale overrides; profile.json stays the source of truth (the CV reads it).
  const quote = profileData.quote ? t('sidebar.quote', { defaultValue: profileData.quote }) : ''
  const location = t('sidebar.location', { defaultValue: profileData.location })
  // The desktop sidebar carries the page's only <h1>; the mobile drawer copy is a plain heading-less name.
  const NameTag = mobile ? 'p' : 'h1'

  return (
    <aside style={{
      background: 'var(--sidebar-bg)',
      border: mobile ? 'none' : '1px solid var(--border)',
      borderRadius: mobile ? 0 : '16px',
      padding: '2rem',
      display: 'flex', flexDirection: 'column', gap: '1.5rem',
      position: mobile ? 'fixed' : 'sticky',
      top: mobile ? 0 : '2rem',
      left: mobile ? 0 : 'auto',
      zIndex: mobile ? 9999 : 'auto',
      width: mobile ? '280px' : 'auto',
      height: mobile ? '100vh' : 'auto',
      overflowY: mobile ? 'auto' : 'visible',
      boxShadow: mobile ? '4px 0 24px rgba(0,0,0,0.15)' : '0 1px 8px rgba(0,0,0,0.04)',
    }}>
      {mobile && (
        <button onClick={onClose} aria-label={t('ui.closeMenu')}
          style={{ alignSelf: 'flex-end', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-2)', marginBottom: '-0.5rem' }}>
          <Icon name="close" size={20} />
        </button>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.75rem' }}>
        <div style={{ width: 88, height: 88, borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--border)', boxShadow: '0 0 0 3px var(--bg), 0 0 0 5px var(--accent)', flexShrink: 0 }}>
          <img src={profileData.avatar} alt={profileData.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div>
          <NameTag style={{ fontFamily: "var(--font-serif)", fontSize: '1.2rem', fontWeight: 400, color: 'var(--fg)', lineHeight: 1.2, marginBottom: '0.4rem' }}>
            {profileData.name}
          </NameTag>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-text)', fontWeight: 500, letterSpacing: '0.04em' }}>{t('sidebar.dataEngineer')}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-text)', fontWeight: 500, letterSpacing: '0.04em' }}>{t('sidebar.softwareEngineer')}</div>
        </div>
        {quote && (
          <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '0.82rem', color: 'var(--fg-3)', lineHeight: 1.4, marginTop: '0.25rem' }}>
            {quote}
          </p>
        )}
      </div>

      <div style={{ height: '1px', background: 'var(--border)' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {[
          { icon: 'mail', labelKey: 'contact.email', value: profileData.email, href: `mailto:${profileData.email}` },
          ...(profileData.phone ? [{ icon: 'phone', labelKey: 'contact.phone', value: profileData.phone, href: `tel:${profileData.phone}` }] : []),
          { icon: 'location', labelKey: 'contact.location', value: location, href: null as string | null },
        ].map(c => (
          <div key={c.icon} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <div style={{ color: 'var(--accent)', flexShrink: 0, background: 'var(--tag-bg)', padding: '6px', borderRadius: '8px', marginTop: '1px' }}>
              <Icon name={c.icon} size={14} />
            </div>
            <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>{t(c.labelKey)}</div>
              {c.href ? (
                <a href={c.href} style={{ fontSize: '0.82rem', color: 'var(--fg-2)', textDecoration: 'none', overflowWrap: 'break-word' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-text)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-2)')}
                >{c.value}</a>
              ) : (
                <div style={{ fontSize: '0.82rem', color: 'var(--fg-2)' }}>{c.value}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ height: '1px', background: 'var(--border)' }} />

      <div style={{ display: 'flex', gap: '0.6rem' }}>
        {profileData.social.map(s => (
          <a key={s.id} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: '8px', background: 'var(--bg-card2)', border: '1px solid var(--border)', color: 'var(--fg-2)', textDecoration: 'none', transition: 'all 0.18s ease' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-solid)'; e.currentTarget.style.color = 'var(--on-accent)'; e.currentTarget.style.borderColor = 'var(--accent-solid)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card2)'; e.currentTarget.style.color = 'var(--fg-2)'; e.currentTarget.style.borderColor = 'var(--border)' }}
          >
            <Icon name={s.icon} size={16} />
          </a>
        ))}
      </div>

      {SHOW_RESUME_DOWNLOAD && (
      <a href={RESUME_URL} download
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.7rem 1rem', borderRadius: '10px', background: 'var(--accent-solid)', color: 'var(--on-accent)', border: '1px solid var(--accent-solid)', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600, boxShadow: '0 1px 6px rgba(0,0,0,0.08)', transition: 'background 0.18s ease, transform 0.18s ease' }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-hover)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent-solid)'; e.currentTarget.style.transform = 'translateY(0)' }}
      >
        <Icon name="download" size={15} />
        {t('ui.downloadResume')}
      </a>
      )}
    </aside>
  )
}
