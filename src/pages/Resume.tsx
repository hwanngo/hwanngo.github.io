import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import experience from '../data/experience.json'
import education from '../data/education.json'
import skills from '../data/skills.json'
import certificates from '../data/certificates.json'
import awards from '../data/awards.json'
import Icon from '../components/Icon'
import TimelineItem from '../components/TimelineItem'
import BulletItem from '../components/BulletItem'
import Tag from '../components/Tag'
import type { ExperienceEntry, EducationEntry, SkillCategory, CertificateEntry, AwardEntry } from '../types'

const expData = experience as ExperienceEntry[]
const eduData = education as EducationEntry[]
const skillsData = skills as SkillCategory[]
const certData = certificates as CertificateEntry[]
const awardData = awards as AwardEntry[]

const CERT_ISSUER_ORDER = ['amazon', 'boomi', 'coursera', 'google', 'ibm', 'linkedin', 'microsoft']

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
function formatYearMonth(value?: string): string {
  if (!value) return ''
  const [y, m] = value.split('-')
  const mi = Number(m) - 1
  if (!y || Number.isNaN(mi) || mi < 0 || mi > 11) return value
  return `${MONTHS[mi]} ${y}`
}

function sortByDateDesc<T extends { date?: string; order?: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    if (a.order !== undefined || b.order !== undefined) {
      return (a.order ?? Number.POSITIVE_INFINITY) - (b.order ?? Number.POSITIVE_INFINITY)
    }
    return (b.date ?? '').localeCompare(a.date ?? '')
  })
}

function CertGroup({ issuer, certs }: { issuer: string; certs: CertificateEntry[] }) {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()
  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 1rem', background: 'var(--tag-bg)', border: 'none', cursor: 'pointer', gap: '0.75rem' }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--border)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'var(--tag-bg)')}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Icon name={open ? 'chevronup' : 'chevrondown'} size={14} />
          <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--fg)' }}>{t(`certIssuers.${issuer}`)}</span>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--fg-3)', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '99px', padding: '1px 8px' }}>{certs.length}</span>
      </button>
      {open && (
        <ul style={{ listStyle: 'none', padding: '0.25rem 0' }}>
          {certs.map(cert => (
            <li key={cert.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.45rem 1rem', gap: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, gap: '2px' }}>
                <a href={cert.url || cert.file} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: '0.84rem', color: 'var(--fg-2)', textDecoration: 'none' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-2)')}
                >{t(`certificates.${cert.id}`)}</a>
                {cert.date && (
                  <span style={{ fontSize: '0.72rem', color: 'var(--fg-3)' }}>{formatYearMonth(cert.date)}</span>
                )}
              </div>
              <a href={cert.url || cert.file} target="_blank" rel="noopener noreferrer"
                style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--fg-3)', textDecoration: 'none', padding: '3px 8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-card)', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--accent)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--fg-3)'; e.currentTarget.style.borderColor = 'var(--border)' }}
              >
                <Icon name="external" size={12} /> View
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function Resume() {
  const { t } = useTranslation()
  const certsByIssuer = CERT_ISSUER_ORDER.reduce<Record<string, CertificateEntry[]>>((acc, issuer) => {
    const group = certData.filter(c => c.issuer === issuer && c.show)
    if (group.length) acc[issuer] = sortByDateDesc(group)
    return acc
  }, {})
  const sortedAwards = sortByDateDesc(awardData)

  return (
    <div>
      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: '1.65rem', fontWeight: 400, lineHeight: 1.2, color: 'var(--fg)', marginBottom: '1.5rem' }}>
        {t('resume.title')}
      </h2>

      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <span style={{ color: 'var(--accent)' }}><Icon name="edu" size={18} /></span>
          <h3 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: '1.05rem', color: 'var(--fg)' }}>{t('resume.education')}</h3>
        </div>
        <ul style={{ listStyle: 'none' }}>
          {eduData.map(edu => {
            const tr = t(`education.${edu.id}`, { returnObjects: true }) as { institution: string; bullets: string[]; period?: string }
            return (
              <TimelineItem key={edu.id} title={tr.institution} period={tr.period ?? edu.period}>
                {tr.bullets.map((b, i) => <BulletItem key={i}>{b}</BulletItem>)}
              </TimelineItem>
            )
          })}
        </ul>
      </div>

      <div style={{ height: '1px', background: 'var(--border)', margin: '2rem 0' }} />

      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <span style={{ color: 'var(--accent)' }}><Icon name="brief" size={18} /></span>
          <h3 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: '1.05rem', color: 'var(--fg)' }}>{t('resume.experience')}</h3>
        </div>
        <ul style={{ listStyle: 'none' }}>
          {expData.map(exp => {
            const tr = t(`experience.${exp.id}`, { returnObjects: true }) as { title: string; bullets: string[]; period?: string }
            return (
              <TimelineItem key={exp.id} title={tr.title} period={tr.period ?? exp.period}>
                {tr.bullets.map((b, i) => <BulletItem key={i}>{b}</BulletItem>)}
              </TimelineItem>
            )
          })}
        </ul>
      </div>

      <div style={{ height: '1px', background: 'var(--border)', margin: '2rem 0' }} />

      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <span style={{ color: 'var(--accent)' }}><Icon name="tools" size={18} /></span>
          <h3 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: '1.05rem', color: 'var(--fg)' }}>{t('resume.skills')}</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {skillsData.map(cat => (
            <div key={cat.id}>
              <div style={{ fontSize: '0.77rem', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: '0.5rem' }}>
                {t(`skills.${cat.id}`)}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {cat.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: '1px', background: 'var(--border)', margin: '2rem 0' }} />

      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <span style={{ color: 'var(--accent)' }}><Icon name="cert" size={18} /></span>
          <h3 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: '1.05rem', color: 'var(--fg)' }}>{t('resume.certifications')}</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {Object.entries(certsByIssuer).map(([issuer, certs]) => (
            <CertGroup key={issuer} issuer={issuer} certs={certs} />
          ))}
        </div>
      </div>

      <div style={{ height: '1px', background: 'var(--border)', margin: '2rem 0' }} />

      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <span style={{ color: 'var(--accent)' }}><Icon name="award" size={18} /></span>
          <h3 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: '1.05rem', color: 'var(--fg)' }}>{t('resume.awards')}</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {sortedAwards.map(award => {
            const tr = t(`awards.${award.id}`, { returnObjects: true }) as { title: string; issuerLabel: string }
            const when = formatYearMonth(award.date) || award.year
            return (
              <div key={award.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1rem', border: '1px solid var(--border)', borderRadius: '10px', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ color: 'var(--accent)', flexShrink: 0 }}><Icon name="award" size={18} /></span>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--fg)' }}>{tr.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--fg-3)', marginTop: '2px' }}>{tr.issuerLabel} · {when}</div>
                  </div>
                </div>
                <a href={award.url || award.file} target="_blank" rel="noopener noreferrer"
                  style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--fg-3)', textDecoration: 'none', padding: '3px 8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--tag-bg)', transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--accent)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--fg-3)'; e.currentTarget.style.borderColor = 'var(--border)' }}
                >
                  <Icon name="external" size={12} /> View
                </a>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
