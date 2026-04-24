import { useTranslation } from 'react-i18next'
import clients from '../data/clients.json'
import Icon from '../components/Icon'
import type { ClientEntry } from '../types'

const clientsData = clients as ClientEntry[]
const SERVICE_ICONS: Record<string, string> = { dataEngineering: 'data', softwareDev: 'code' }

function getYearsSince(dateStr: string) {
  const start = new Date(dateStr)
  const now = new Date()
  let years = now.getFullYear() - start.getFullYear()
  const monthDiff = now.getMonth() - start.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < start.getDate())) {
    years--
  }
  return years
}

export default function About() {
  const { t } = useTranslation()
  const services = t('about.services', { returnObjects: true }) as Record<string, { title: string; desc: string }>
  const yearsInIT = getYearsSince('2019-01-01')
  const yearsInDataEng = getYearsSince('2023-01-01')

  return (
    <div>
      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: '1.65rem', fontWeight: 400, lineHeight: 1.2, color: 'var(--fg)', marginBottom: '1.5rem' }}>
        {t('about.title')}
      </h2>
      <p style={{ color: 'var(--fg-2)', lineHeight: 1.75, fontSize: '0.97rem', marginBottom: '2rem', maxWidth: '68ch', textWrap: 'pretty' } as React.CSSProperties}>
        {t('about.bio', { yearsInIT, yearsInDataEng })}
      </p>

      <div style={{ height: '1px', background: 'var(--border)', margin: '2rem 0' }} />

      <h3 style={{ fontFamily: "var(--font-serif)", fontSize: '1.1rem', fontWeight: 400, marginBottom: '1.25rem', color: 'var(--fg)' }}>
        {t('about.whatIDo')}
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        {Object.entries(services).map(([key, service]) => (
          <div key={key} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem 1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start', boxShadow: '0 1px 8px rgba(0,0,0,0.04)', transition: 'box-shadow 0.2s ease, transform 0.2s ease' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <div style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }}>
              <Icon name={SERVICE_ICONS[key] ?? 'code'} size={22} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.3rem', color: 'var(--fg)' }}>{service.title}</div>
              <div style={{ fontSize: '0.84rem', color: 'var(--fg-2)', lineHeight: 1.6 }}>{service.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ height: '1px', background: 'var(--border)', margin: '2rem 0' }} />

      <h3 style={{ fontFamily: "var(--font-serif)", fontSize: '1.1rem', fontWeight: 400, marginBottom: '1.25rem', color: 'var(--fg)' }}>
        {t('about.clients')}
      </h3>
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {clientsData.map(c => (
          <a key={c.id} href={c.href} target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1rem 1.5rem', transition: 'border-color 0.2s ease, box-shadow 0.2s ease', cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 0 0 1px var(--accent)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}
          >
            <img src={c.logo} alt={c.alt} style={{ maxHeight: 44, maxWidth: 120, objectFit: 'contain' }} />
          </a>
        ))}
      </div>
    </div>
  )
}
