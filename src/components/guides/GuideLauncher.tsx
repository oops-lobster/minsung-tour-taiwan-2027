import { BookOpen, ChevronRight } from 'lucide-react'
import { guideById, resolveGuideHref, type GuideId } from '../../data/guides'

export function GuideLauncher({ guideId, compact = false }: { guideId: GuideId; compact?: boolean }) {
  const guide = guideById[guideId]
  return (
    <a className={`guide-launcher ${compact ? 'guide-launcher--compact' : ''}`} href={resolveGuideHref(guide)}>
      <BookOpen size={19} aria-hidden="true" />
      <span><strong>{guide.title}</strong>{!compact && <small>{guide.description}</small>}</span>
      <ChevronRight size={18} aria-hidden="true" />
    </a>
  )
}
