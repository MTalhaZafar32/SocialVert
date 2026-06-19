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
        borderRadius: 999,
        fontWeight: 500,
        fontSize: size === 'sm' ? 11 : 12,
        padding: size === 'sm' ? '2px 8px' : '3px 10px',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  )
}
