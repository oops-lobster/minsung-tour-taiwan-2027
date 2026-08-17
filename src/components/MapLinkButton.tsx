import { ExternalLink, MapPin } from 'lucide-react'
import { googleMapsUrl } from '../lib/paths'

interface MapLinkButtonProps {
  query: string
  label?: string
  compact?: boolean
}

export function MapLinkButton({ query, label = '지도에서 보기', compact = false }: MapLinkButtonProps) {
  return (
    <a
      className={`map-button ${compact ? 'map-button--compact' : ''}`}
      href={googleMapsUrl(query)}
      target="_blank"
      rel="noreferrer"
      aria-label={`${query} ${label} — 새 창`}
    >
      <MapPin size={18} aria-hidden="true" />
      <span>{label}</span>
      <ExternalLink size={15} aria-hidden="true" />
    </a>
  )
}
