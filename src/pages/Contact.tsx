import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import profile from '../data/profile.json'
import Icon from '../components/Icon'
import type { Profile } from '../types'

const profileData = profile as Profile

interface FormState { fullname: string; email: string; message: string }
type Field = keyof FormState

const FIELDS: Record<Field, { labelKey: string; autoComplete: string; type?: string }> = {
  fullname: { labelKey: 'contact.fullName', autoComplete: 'name', type: 'text' },
  email: { labelKey: 'contact.emailAddress', autoComplete: 'email', type: 'email' },
  message: { labelKey: 'contact.yourMessage', autoComplete: 'off' },
}

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

  const update = (field: Field, value: string) => {
    setForm(f => ({ ...f, [field]: value }))
    // Clear a field's error as soon as the user edits it.
    if (errors[field]) setErrors(({ [field]: _removed, ...rest }) => rest)
  }

  const inputStyle = (field: Field): React.CSSProperties => ({
    width: '100%', padding: '0.7rem 1rem', background: 'var(--bg-card)', color: 'var(--fg)',
    border: `1px solid ${errors[field] ? 'var(--danger)' : 'var(--border)'}`,
    borderRadius: '10px', fontSize: '0.9rem', outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    fontFamily: "'DM Sans', system-ui, sans-serif",
  })

  const focusProps = (field: Field) => ({
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--accent) 15%, transparent)' },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => { e.target.style.borderColor = errors[field] ? 'var(--danger)' : 'var(--border)'; e.target.style.boxShadow = 'none' },
  })

  const fieldProps = (field: Field) => ({
    id: `contact-${field}`,
    name: field,
    autoComplete: FIELDS[field].autoComplete,
    placeholder: t(FIELDS[field].labelKey),
    value: form[field],
    required: true,
    'aria-invalid': errors[field] ? true : undefined,
    'aria-describedby': errors[field] ? `contact-${field}-error` : undefined,
    ...focusProps(field),
  })

  const label = (field: Field) => (
    <label htmlFor={`contact-${field}`} className="sr-only">{t(FIELDS[field].labelKey)}</label>
  )

  const errorText = (field: Field) => errors[field] && (
    <div id={`contact-${field}-error`} role="alert" style={{ fontSize: '0.76rem', color: 'var(--danger)', marginTop: '4px' }}>{errors[field]}</div>
  )

  const contactItems = [
    { icon: 'mail', labelKey: 'contact.email', value: profileData.email, href: `mailto:${profileData.email}` },
    { icon: 'location', labelKey: 'contact.location', value: t('sidebar.location', { defaultValue: profileData.location }), href: null as string | null },
    ...profileData.social.map(s => ({ icon: s.icon, labelKey: `contact.${s.id}`, value: s.href.replace('https://', ''), href: s.href })),
  ]

  const cardStyle: React.CSSProperties = { display: 'flex', gap: '0.85rem', alignItems: 'flex-start', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem 1.25rem', textDecoration: 'none', color: 'inherit', transition: 'border-color 0.2s, box-shadow 0.2s' }

  return (
    <div>
      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: '1.65rem', fontWeight: 400, lineHeight: 1.2, color: 'var(--fg)', marginBottom: '1.5rem' }}>
        {t('contact.title')}
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        {contactItems.map(c => {
          const content = (
            <>
              <span style={{ color: 'var(--accent)', marginTop: 2 }}><Icon name={c.icon} size={18} /></span>
              <div>
                <div style={{ fontSize: '0.73rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--fg-3)', marginBottom: '2px' }}>{t(c.labelKey)}</div>
                <div style={{ fontSize: '0.86rem', color: 'var(--fg-2)' }}>{c.value}</div>
              </div>
            </>
          )
          return c.href ? (
            <a key={c.icon} href={c.href} target={c.href.startsWith('mailto') ? undefined : '_blank'} rel="noopener noreferrer" style={cardStyle}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = '0 0 0 1px var(--accent)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}
            >{content}</a>
          ) : (
            <div key={c.icon} style={cardStyle}>{content}</div>
          )
        })}
      </div>

      <div style={{ height: '1px', background: 'var(--border)', margin: '2rem 0' }} />

      <h3 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: '1.1rem', marginBottom: '1.25rem', color: 'var(--fg)' }}>{t('contact.sendAMessage')}</h3>

      {status === 'success' ? (
        <div role="status" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '2rem', textAlign: 'center' }}>
          <div style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}><Icon name="check" size={28} /></div>
          <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{t('ui.messageSent')}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--fg-2)' }}>{t('ui.thankYou')}</div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            {(['fullname', 'email'] as const).map(field => (
              <div key={field}>
                {label(field)}
                <input type={FIELDS[field].type} {...fieldProps(field)}
                  onChange={e => update(field, e.target.value)}
                  style={inputStyle(field)}
                />
                {errorText(field)}
              </div>
            ))}
          </div>
          <div style={{ marginBottom: '1rem' }}>
            {label('message')}
            <textarea rows={5} {...fieldProps('message')}
              onChange={e => update('message', e.target.value)}
              style={{ ...inputStyle('message'), resize: 'vertical', minHeight: 130 }}
            />
            {errorText('message')}
          </div>
          {status === 'error' && <div role="alert" style={{ fontSize: '0.82rem', color: 'var(--danger)', marginBottom: '0.75rem' }}>{t('ui.somethingWentWrong')}</div>}
          <button type="submit" disabled={submitting}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--accent-solid)', color: 'var(--on-accent)', border: 'none', borderRadius: '10px', padding: '0.7rem 1.5rem', fontSize: '0.9rem', fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1, transition: 'opacity 0.2s, transform 0.2s, background 0.2s', fontFamily: "'DM Sans', system-ui, sans-serif" }}
            onMouseEnter={e => { if (!submitting) { e.currentTarget.style.background = 'var(--accent-hover)'; e.currentTarget.style.transform = 'translateY(-1px)' } }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent-solid)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <Icon name="send" size={15} />
            {submitting ? t('ui.sending') : t('ui.sendMessage')}
          </button>
        </form>
      )}
    </div>
  )
}
