import { imagePath } from '../lib/paths'

interface BrandProps {
  light?: boolean
  compact?: boolean
}

export function Brand({ light = false, compact = false }: BrandProps) {
  return (
    <div className={`brand ${light ? 'brand--light' : ''} ${compact ? 'brand--compact' : ''}`}>
      <img className="brand__mark" src={imagePath('brand-logo.webp')} alt="" width="512" height="512" aria-hidden="true" />
      <span className="brand__words">
        <strong>민성투어</strong>
        <small>TAIWAN 2027</small>
      </span>
    </div>
  )
}
