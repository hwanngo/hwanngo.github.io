import Icon from './Icon'

export default function BulletItem({ children }: { children: React.ReactNode }) {
  return (
    <li style={{ fontSize: '0.84rem', color: 'var(--fg-2)', lineHeight: 1.65, display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
      <span style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '5px' }}>
        <Icon name="check" size={12} />
      </span>
      <span style={{ textWrap: 'pretty' } as React.CSSProperties}>{children}</span>
    </li>
  )
}
