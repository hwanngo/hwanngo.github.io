import { useTranslation } from 'react-i18next'
import profile from '../data/profile.json'
import Icon from './Icon'
import type { Profile } from '../types'

const profileData = profile as Profile

interface SidebarProps {
  mobile?: boolean
  onClose?: () => void
}

export default function Sidebar({ mobile = false, onClose }: SidebarProps) {
  const { t } = useTranslation()

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
        <button onClick={onClose} style={{ alignSelf: 'flex-end', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--fg-2)', marginBottom: '-0.5rem' }}>
          <Icon name="close" size={20} />
        </button>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.75rem' }}>
        <div style={{ width: 88, height: 88, borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--border)', boxShadow: '0 0 0 3px var(--bg), 0 0 0 5px var(--accent)', flexShrink: 0 }}>
          <img src={profileData.avatar} alt={profileData.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: '1.2rem', fontWeight: 400, color: 'var(--fg)', lineHeight: 1.2, marginBottom: '0.4rem' }}>
            {profileData.name}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 500, letterSpacing: '0.04em' }}>{t('sidebar.dataEngineer')}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--fg-3)', fontWeight: 400, letterSpacing: '0.04em' }}>{t('sidebar.softwareEngineer')}</div>
        </div>
        {profileData.quote && (
          <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '0.82rem', color: 'var(--fg-3)', lineHeight: 1.4, marginTop: '0.25rem' }}>
            "{profileData.quote}"
          </div>
        )}
      </div>

      <div style={{ height: '1px', background: 'var(--border)' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {[
          { icon: 'mail', labelKey: 'contact.email', value: profileData.email, href: `mailto:${profileData.email}` },
          ...(profileData.phone ? [{ icon: 'phone', labelKey: 'contact.phone', value: profileData.phone, href: `tel:${profileData.phone}` }] : []),
          { icon: 'location', labelKey: 'contact.location', value: profileData.location, href: null as string | null },
        ].map(c => (
          <div key={c.icon} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <div style={{ color: 'var(--accent)', flexShrink: 0, background: 'var(--tag-bg)', padding: '6px', borderRadius: '8px', marginTop: '1px' }}>
              <Icon name={c.icon} size={14} />
            </div>
            <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-3)' }}>{t(c.labelKey)}</div>
              {c.href ? (
                <a href={c.href} style={{ fontSize: '0.82rem', color: 'var(--fg-2)', textDecoration: 'none', overflowWrap: 'break-word' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
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
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = '#faf9f5'; e.currentTarget.style.borderColor = 'var(--accent)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card2)'; e.currentTarget.style.color = 'var(--fg-2)'; e.currentTarget.style.borderColor = 'var(--border)' }}
          >
            <Icon name={s.icon} size={16} />
          </a>
        ))}
      </div>

      <a href="/assets/cv.pdf" download
        style={{ display: 'none', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.6rem 1rem', borderRadius: '10px', background: 'var(--tag-bg)', color: 'var(--fg-2)', border: '1px solid var(--border)', textDecoration: 'none', fontSize: '0.84rem', fontWeight: 500, transition: 'all 0.18s ease' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--fg-2)' }}
      >
        <Icon name="download" size={15} />
        {t('ui.downloadCv')}
      </a>
    </aside>
  )
}
