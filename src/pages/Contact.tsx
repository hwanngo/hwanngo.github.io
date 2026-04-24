import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import profile from '../data/profile.json'
import Icon from '../components/Icon'
import type { Profile } from '../types'

const profileData = profile as Profile

interface FormState { fullname: string; email: string; message: string }

export default function Contact() {
  const { t } = useTranslation()
  const [form, setForm] = useState<FormState>({ fullname: '', email: '', message: '' })
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [status, setStatus] = useState<'' | 'success' | 'error'>('')
  const [submitting, setSubmitting] = useState(false)

  const validate = (): Partial<FormState> => {
    const e: Partial<FormState> = {}
    if (!form.fullname.trim()) e.fullname = t('contact.validation.nameRequired')
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = t('contact.validation.emailRequired')
    if (!form.message.trim()) e.message = t('contact.validation.messageRequired')
    return e
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setSubmitting(true)
    try {
      const data = new FormData()
      Object.entries(form).forEach(([k, v]) => data.append(k, v))
      const res = await fetch(`https://formspree.io/f/${profileData.formspreeId}`, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      setStatus(res.ok ? 'success' : 'error')
      if (res.ok) setForm({ fullname: '', email: '', message: '' })
    } catch { setStatus('error') }
    setSubmitting(false)
  }

  const inputStyle = (field: keyof FormState): React.CSSProperties => ({
    width: '100%', padding: '0.7rem 1rem', background: 'var(--bg-card)', color: 'var(--fg)',
    border: `1px solid ${errors[field] ? '#b53333' : 'var(--border)'}`,
    borderRadius: '10px', fontSize: '0.9rem', outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    fontFamily: "'DM Sans', system-ui, sans-serif",
  })

  const contactItems = [
    { icon: 'mail', labelKey: 'contact.email', value: profileData.email, href: `mailto:${profileData.email}` },
    { icon: 'location', labelKey: 'contact.location', value: profileData.location, href: null as string | null },
    ...profileData.social.map(s => ({ icon: s.icon, labelKey: `contact.${s.id}`, value: s.href.replace('https://', ''), href: s.href })),
  ]

  return (
    <div>
      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: '1.65rem', fontWeight: 400, lineHeight: 1.2, color: 'var(--fg)', marginBottom: '1.5rem' }}>
        {t('contact.title')}
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        {contactItems.map(c => (
          <a key={c.icon} href={c.href ?? undefined} target={c.href && !c.href.startsWith('mailto') ? '_blank' : undefined} rel="noopener noreferrer"
            style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem 1.25rem', textDecoration: 'none', color: 'inherit', transition: 'border-color 0.2s, box-shadow 0.2s' }}
            onMouseEnter={e => { if (c.href) { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 0 0 1px var(--accent)' } }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}
          >
            <span style={{ color: 'var(--accent)', marginTop: 2 }}><Icon name={c.icon} size={18} /></span>
            <div>
              <div style={{ fontSize: '0.73rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: '2px' }}>{t(c.labelKey)}</div>
              <div style={{ fontSize: '0.86rem', color: 'var(--fg-2)' }}>{c.value}</div>
            </div>
          </a>
        ))}
      </div>

      <div style={{ height: '1px', background: 'var(--border)', margin: '2rem 0' }} />

      <h3 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: '1.1rem', marginBottom: '1.25rem', color: 'var(--fg)' }}>{t('contact.sendAMessage')}</h3>

      {status === 'success' ? (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '2rem', textAlign: 'center' }}>
          <div style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}><Icon name="check" size={28} /></div>
          <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{t('ui.messageSent')}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--fg-2)' }}>{t('ui.thankYou')}</div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            {(['fullname', 'email'] as const).map(field => (
              <div key={field}>
                <input type={field === 'email' ? 'email' : 'text'}
                  placeholder={t(field === 'fullname' ? 'contact.fullName' : 'contact.emailAddress')}
                  value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                  style={inputStyle(field)}
                  onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--accent) 15%, transparent)' }}
                  onBlur={e => { e.target.style.borderColor = errors[field] ? '#b53333' : 'var(--border)'; e.target.style.boxShadow = 'none' }}
                />
                {errors[field] && <div style={{ fontSize: '0.76rem', color: '#b53333', marginTop: '4px' }}>{errors[field]}</div>}
              </div>
            ))}
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <textarea placeholder={t('contact.yourMessage')} value={form.message} rows={5}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              style={{ ...inputStyle('message'), resize: 'vertical', minHeight: 130 }}
              onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--accent) 15%, transparent)' }}
              onBlur={e => { e.target.style.borderColor = errors.message ? '#b53333' : 'var(--border)'; e.target.style.boxShadow = 'none' }}
            />
            {errors.message && <div style={{ fontSize: '0.76rem', color: '#b53333', marginTop: '4px' }}>{errors.message}</div>}
          </div>
          {status === 'error' && <div style={{ fontSize: '0.82rem', color: '#b53333', marginBottom: '0.75rem' }}>{t('ui.somethingWentWrong')}</div>}
          <button type="submit" disabled={submitting}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--accent)', color: '#faf9f5', border: 'none', borderRadius: '10px', padding: '0.7rem 1.5rem', fontSize: '0.9rem', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1, transition: 'opacity 0.2s, transform 0.2s, background 0.2s', fontFamily: "'DM Sans', system-ui, sans-serif" }}
            onMouseEnter={e => { if (!submitting) { e.currentTarget.style.background = 'var(--accent-hover)'; e.currentTarget.style.transform = 'translateY(-1px)' } }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <Icon name="send" size={15} />
            {submitting ? t('ui.sending') : t('ui.sendMessage')}
          </button>
        </form>
      )}
    </div>
  )
}
