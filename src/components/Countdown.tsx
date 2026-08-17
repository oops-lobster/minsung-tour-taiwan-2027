import { useEffect, useState } from 'react'

const targetDate = new Date(2027, 1, 20)
const progressStart = new Date('2026-08-17T00:00:00+09:00').getTime()
const departureTime = new Date('2027-02-20T10:00:00+09:00').getTime()

function getCountdown() {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const difference = Math.round((targetDate.getTime() - today.getTime()) / 86_400_000)

  if (difference > 0) return `D-${difference}`
  if (difference === 0) return 'D-DAY'
  return `D+${Math.abs(difference)}`
}

function getProgress() {
  const completed = Math.min(100, Math.max(0, ((Date.now() - progressStart) / (departureTime - progressStart)) * 100))
  return { completed, remaining: 100 - completed }
}

function getMilestone(progress: number) {
  if (progress < 30) return { emoji: '✈️', message: '여행 계획이 시작되었습니다' }
  if (progress < 60) return { emoji: '🗺️', message: '일정이 점점 완성되고 있습니다' }
  if (progress < 90) return { emoji: '🎒', message: '출발 준비가 거의 끝나갑니다' }
  return { emoji: '🔥', message: '곧 대만으로 출발합니다' }
}

interface CountdownProps {
  compact?: boolean
}

export function Countdown({ compact = false }: CountdownProps) {
  const [countdown, setCountdown] = useState(getCountdown)
  const [progress, setProgress] = useState(getProgress)
  const [showDetails, setShowDetails] = useState(false)
  const milestone = getMilestone(progress.completed)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown(getCountdown())
      setProgress(getProgress())
    }, 60 * 1000)
    return () => window.clearInterval(timer)
  }, [])

  if (!compact) {
    return (
      <span className="countdown" aria-label={`여행 출발까지 ${countdown}`}>
        {countdown}
      </span>
    )
  }

  return (
    <button
      className="countdown countdown--compact countdown--egg"
      type="button"
      onClick={() => setShowDetails((current) => !current)}
      onKeyDown={(event) => event.key === 'Escape' && setShowDetails(false)}
      aria-expanded={showDetails}
      aria-label={`출국 준비 진행률 ${progress.completed.toFixed(4)}%. ${milestone.message}. 누르면 ${showDetails ? '진행률' : 'D-day'}로 전환`}
      title="이스터 에그: 출국 준비 진행률"
    >
      <span className="countdown__value">{showDetails ? countdown : `${progress.completed.toFixed(4)}%`}</span>
      <span className="countdown__hint">{showDetails ? '퍼센트로' : '누르면 바뀌어요!'}</span>
      {showDetails && (
        <span className="countdown__progress" role="status">
          <small>TRAVEL METER · 2026.08.17 → 2027.02.20</small>
          <strong>{progress.completed.toFixed(4)}%</strong>
          <span className="countdown__milestone"><b aria-hidden="true">{milestone.emoji}</b> {milestone.message}</span>
          <i aria-hidden="true"><b style={{ transform: `scaleX(${progress.completed / 100})` }} /></i>
          <em>{progress.remaining.toFixed(2)}% 뒤면 출국!</em>
        </span>
      )}
    </button>
  )
}
