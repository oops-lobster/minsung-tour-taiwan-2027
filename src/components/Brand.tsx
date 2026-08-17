interface BrandProps {
  light?: boolean
  compact?: boolean
}

export function Brand({ light = false, compact = false }: BrandProps) {
  return (
    <div className={`brand ${light ? 'brand--light' : ''} ${compact ? 'brand--compact' : ''}`}>
      <span className="brand__mark" aria-hidden="true">
        <span>M</span>
        <i />
      </span>
      <span className="brand__words">
        <strong>민성투어</strong>
        <small>TAIWAN 2027</small>
      </span>
    </div>
  )
}
