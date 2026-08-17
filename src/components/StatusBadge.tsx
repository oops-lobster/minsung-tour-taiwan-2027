import { CheckCircle2, Clock3, LoaderCircle, MapPin } from 'lucide-react'
import type { StatusTone } from '../data/trip'

interface StatusBadgeProps {
  tone: StatusTone
  children: React.ReactNode
}

const toneIcon = {
  confirmed: CheckCircle2,
  progress: LoaderCircle,
  waiting: Clock3,
  flexible: MapPin,
}

export function StatusBadge({ tone, children }: StatusBadgeProps) {
  const Icon = toneIcon[tone]
  return (
    <span className={`status-badge status-badge--${tone}`}>
      <Icon size={15} aria-hidden="true" />
      {children}
    </span>
  )
}
