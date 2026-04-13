interface AKMLogoProps {
  size?: number
  className?: string
}

export function AKMLogo({ size = 48, className = '' }: AKMLogoProps) {
  return (
    <img
      src="/logo.svg"
      alt="Alim Khatoon Medicare Logo"
      width={size}
      height={size}
      className={className}
      style={{ objectFit: 'contain' }}
    />
  )
}
