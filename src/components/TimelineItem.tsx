import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Icon from './Icon'

interface TimelineItemProps {
  title: string
  period: string
  /** Muted line under the title, e.g. "Remote · US-based company". */
  location?: string
  /** Muted "Domains: ..." line; rendered as a subtitle, not a bullet. */
  domains?: string
  defaultOpen?: boolean
  children?: React.ReactNode
}

export default function TimelineItem({ title, period, location, domains, defaultOpen = false, children }: TimelineItemProps) {
  const [open, setOpen] = useState(defaultOpen)
  const { t } = useTranslation()
  const listId = useId()

  return (
    <li style={{ position: 'relative', paddingLeft: '1.5rem', paddingBottom: '1.75rem' }}>
      <div style={{ position: 'absolute', left: 0, top: '6px', width: 10, height: 10, borderRadius: '50%', background: 'var(--accent)', border: '2px solid var(--bg)', boxShadow: '0 0 0 2px var(--accent)' }} />
      <div style={{ position: 'absolute', left: '4px', top: 16, bottom: 0, width: '1px', background: 'var(--border)' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
        <h4 style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--fg)' }}>{title}</h4>
        <span style={{ fontSize: '0.78rem', color: 'var(--accent-text)', fontWeight: 500, whiteSpace: 'nowrap', background: 'var(--tag-bg)', padding: '2px 8px', borderRadius: '99px', border: '1px solid var(--border)' }}>{period}</span>
      </div>
      {location && (
        <div style={{ marginTop: '0.2rem', fontSize: '0.8rem', color: 'var(--fg-3)' }}>{location}</div>
      )}
      {domains && (
        <div style={{ marginTop: '0.2rem', fontSize: '0.8rem', color: 'var(--fg-3)' }}>
          <span style={{ fontWeight: 600 }}>{t('resume.domains')}:</span> {domains}
        </div>
      )}
      {children && (
        <>
          <button onClick={() => setOpen(o => !o)} aria-expanded={open} aria-controls={listId}
            style={{ marginTop: '0.4rem', fontSize: '0.8rem', color: 'var(--fg-3)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0, transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-3)')}
          >
            {open ? t('ui.showLess') : t('ui.showDetails')}
            <Icon name={open ? 'chevronup' : 'chevrondown'} size={13} />
          </button>
          <ul id={listId} hidden={!open} style={{ marginTop: '0.75rem', listStyle: 'none', display: open ? 'flex' : 'none', flexDirection: 'column', gap: '0.35rem' }}>
            {children}
          </ul>
        </>
      )}
    </li>
  )
}
