interface BadgeProps {
  label: string
  bg: string
  text: string
  size?: 'sm' | 'md'
}

export default function Badge({ label, bg, text, size = 'md' }: BadgeProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: bg,
        color: text,
        borderRadius: 6,
        fontWeight: 600,
        fontSize: size === 'sm' ? 11 : 12,
        padding: size === 'sm' ? '2px 8px' : '3px 10px',
        whiteSpace: 'nowrap',
        letterSpacing: '0.03em',
        border: '1px solid currentColor',
        borderColor: 'color-mix(in srgb, currentColor 20%, transparent)',
      }}
    >
      {label}
    </span>
  )
}
