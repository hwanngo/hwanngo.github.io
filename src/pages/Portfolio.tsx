import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import projects from '../data/projects.json'
import Tag from '../components/Tag'
import type { ProjectEntry, ProjectCategory } from '../types'

const projectsData = projects as ProjectEntry[]
type Filter = 'all' | ProjectCategory

export default function Portfolio() {
  const { t } = useTranslation()
  const [filter, setFilter] = useState<Filter>('all')
  const filters: Filter[] = ['all', 'dataEngineering', 'softwareEngineering']
  const filtered = filter === 'all' ? projectsData : projectsData.filter(p => p.category === filter)
  const filterLabel = (f: Filter) => f === 'all' ? t('portfolio.all') : t(`portfolio.filters.${f}`)

  return (
    <div>
      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: '1.65rem', fontWeight: 400, lineHeight: 1.2, color: 'var(--fg)', marginBottom: '1.5rem' }}>
        {t('portfolio.title')}
      </h2>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: '6px 16px', borderRadius: '99px', fontSize: '0.84rem', fontWeight: 500, border: '1px solid ' + (filter === f ? 'var(--accent)' : 'var(--border)'), background: filter === f ? 'var(--accent)' : 'var(--bg-card)', color: filter === f ? '#faf9f5' : 'var(--fg-2)', cursor: 'pointer', transition: 'all 0.18s ease' }}
            onMouseEnter={e => { if (filter !== f) { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' } }}
            onMouseLeave={e => { if (filter !== f) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--fg-2)' } }}
          >{filterLabel(f)}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {filtered.map(p => {
          const tr = t(`projects.${p.id}`, { returnObjects: true }) as { title: string; desc: string }
          return (
            <div key={p.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', transition: 'box-shadow 0.2s, transform 0.2s', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-3px)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 6px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{t(`portfolio.filters.${p.category}`)}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--fg-3)', background: 'var(--tag-bg)', padding: '2px 8px', borderRadius: '99px', border: '1px solid var(--border)' }}>{t('ui.professional')}</span>
              </div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: '1.05rem', fontWeight: 400, color: 'var(--fg)', lineHeight: 1.3 }}>{tr.title}</div>
              <p style={{ fontSize: '0.83rem', color: 'var(--fg-2)', lineHeight: 1.65, flexGrow: 1, textWrap: 'pretty' } as React.CSSProperties}>{tr.desc}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.25rem' }}>
                {p.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
