export default function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      background: 'var(--tag-bg)', color: 'var(--tag-fg)',
      fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.04em',
      padding: '3px 9px', borderRadius: '99px',
      border: '1px solid var(--border)', whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  )
}
