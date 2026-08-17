import { useEffect, useState } from 'react'

const targetDate = new Date(2027, 1, 20)

function getCountdown() {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const difference = Math.round((targetDate.getTime() - today.getTime()) / 86_400_000)

  if (difference > 0) return `D-${difference}`
  if (difference === 0) return 'D-DAY'
  return `D+${Math.abs(difference)}`
}

interface CountdownProps {
  compact?: boolean
}

export function Countdown({ compact = false }: CountdownProps) {
  const [countdown, setCountdown] = useState(getCountdown)

  useEffect(() => {
    const timer = window.setInterval(() => setCountdown(getCountdown()), 60 * 60 * 1000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <span className={`countdown ${compact ? 'countdown--compact' : ''}`} aria-label={`여행 출발까지 ${countdown}`}>
      {countdown}
    </span>
  )
}
