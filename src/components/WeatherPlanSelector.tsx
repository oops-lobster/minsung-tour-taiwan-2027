import { CloudOff, CloudRain, MapPin, Sparkles, SunMedium, Wind } from 'lucide-react'
import type { DayPlan } from '../data/weatherPlans'
import type { DayWeatherConfig, WeatherPlanId, WeatherPlanRecommendation } from '../lib/weather'

interface WeatherPlanSelectorProps {
  config: DayWeatherConfig
  plans: DayPlan[]
  recommendation: WeatherPlanRecommendation
  selectedPlanId: WeatherPlanId
  panelId: string
  loading: boolean
  compact?: boolean
  onSelect: (planId: WeatherPlanId) => void
}

const forecastLabel = (date: string) => {
  const [, month, day] = date.split('-')
  return `${Number(month)}월 ${Number(day)}일`
}

const recommendationTitle = (
  recommendation: WeatherPlanRecommendation,
  date: string,
  recommendedLabel: string,
) => {
  if (recommendation.suspended) return '날씨 판정 대기 · 일정은 직접 선택'
  if (recommendation.mode === 'today-preview') return `오늘 같은 날씨라면 ${recommendedLabel}`
  if (recommendation.mode === 'trip-forecast') return `${forecastLabel(date)} 추천 · ${recommendedLabel}`
  if (recommendation.mode === 'trip-day-live') return `오늘 추천 · ${recommendedLabel}`
  return '기본 순서 · PLAN A'
}

const modeCopy = (recommendation: WeatherPlanRecommendation, date: string) => {
  if (recommendation.mode === 'today-preview') {
    return {
      eyebrow: 'TODAY IN TAIWAN',
      note: '아직 여행일의 상세 예보 기간이 아니어서 오늘 현지 날씨를 기준으로 준비된 일정을 미리 보여드리고 있어요.',
    }
  }
  if (recommendation.mode === 'trip-forecast') {
    const [, month, day] = date.split('-')
    const englishMonth = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' })
      .format(new Date(Date.UTC(2027, Number(month) - 1, Number(day))))
      .toUpperCase()
    return {
      eyebrow: `${englishMonth} ${Number(day)} FORECAST`,
      note: '날씨 API에 들어온 실제 여행 날짜의 시간대별 예보를 사용하고 있어요.',
    }
  }
  if (recommendation.mode === 'trip-day-live') {
    return {
      eyebrow: "TODAY'S PLAN",
      note: '여행 당일의 주요 활동 시간대 예보와 현재 강수 여부를 함께 보고 있어요.',
    }
  }
  return {
    eyebrow: 'WEATHER CHECK',
    note: '날씨는 추천만 합니다. 준비된 각 플랜은 언제든 직접 선택할 수 있어요.',
  }
}

export function WeatherPlanSelector({
  config,
  plans,
  recommendation,
  selectedPlanId,
  panelId,
  loading,
  compact = false,
  onSelect,
}: WeatherPlanSelectorProps) {
  const copy = modeCopy(recommendation, config.date)
  const recommendedLabel = plans.find((plan) => plan.id === recommendation.recommendedPlanId)?.label
    ?? (recommendation.recommendedPlanId === 'plan-a' ? 'PLAN A' : 'PLAN B')
  const RecommendedIcon = recommendation.mode === 'fallback'
    ? CloudOff
    : recommendation.recommendedPlanId === 'plan-b' || recommendation.recommendedPlanId === 'plan-c' ? CloudRain : SunMedium
  const orderedPlans = recommendation.suspended
    ? plans
    : [...plans].sort((left, right) => (
      left.id === recommendation.recommendedPlanId ? -1 : right.id === recommendation.recommendedPlanId ? 1 : 0
    ))

  return (
    <section className={`weather-selector weather-selector--${recommendation.strength} ${compact ? 'weather-selector--compact' : ''}`} aria-labelledby="weather-selector-title">
      {compact ? (
        <header className="weather-selector__compact-head" aria-live="polite" aria-busy={loading}>
          <div>
            <small>CHOOSE YOUR DAY</small>
            <h3 id="weather-selector-title">오늘 화면에 표시할 일정</h3>
            <p>{recommendationTitle(recommendation, config.date, recommendedLabel)} · 가족 컨디션에 맞춰 직접 바꿀 수 있어요.</p>
          </div>
          <span><RecommendedIcon size={17} aria-hidden="true" /> 자동 추천 {recommendedLabel}</span>
        </header>
      ) : <div className="weather-selector__summary" aria-live="polite" aria-busy={loading}>
        <span className="weather-selector__icon" aria-hidden="true"><RecommendedIcon size={24} /></span>
        <div className="weather-selector__copy">
          <small>{copy.eyebrow}</small>
          <h3 id="weather-selector-title">{recommendationTitle(recommendation, config.date, recommendedLabel)}</h3>
          <p>{recommendation.reason}</p>
          <span>{copy.note}</span>
        </div>
        <div className="weather-selector__facts" aria-label="날씨 판단 기준">
          <span><MapPin size={15} aria-hidden="true" /> {config.representativeLocation}</span>
          <span><Sparkles size={15} aria-hidden="true" /> {String(config.startHour).padStart(2, '0')}:00–{String(config.endHour).padStart(2, '0')}:00</span>
          {recommendation.rainProbability !== undefined && (
            <span><CloudRain size={15} aria-hidden="true" /> 강수확률 {Math.round(recommendation.rainProbability)}%</span>
          )}
          {recommendation.windGust !== undefined && recommendation.windGust >= 40 && (
            <span><Wind size={15} aria-hidden="true" /> 돌풍 {Math.round(recommendation.windGust)}km/h</span>
          )}
        </div>
      </div>}

      <div className={`weather-selector__plans weather-selector__plans--${Math.min(plans.length, 3)}`} aria-label="날씨 플랜 선택">
        {orderedPlans.map((plan) => {
          const selected = selectedPlanId === plan.id
          const recommended = !recommendation.suspended && recommendation.recommendedPlanId === plan.id
          const PlanIcon = plan.id === 'plan-b2' || plan.id === 'plan-c' ? CloudOff : plan.weatherType === 'rain' ? CloudRain : SunMedium
          return (
            <button
              className={`weather-plan-choice ${selected ? 'is-selected' : ''} ${recommended ? 'is-recommended' : ''}`}
              type="button"
              aria-pressed={selected}
              aria-controls={panelId}
              onClick={() => onSelect(plan.id)}
              key={plan.id}
            >
              <span className="weather-plan-choice__top">
                <span><PlanIcon size={19} aria-hidden="true" /> {plan.label}</span>
                <span className="weather-plan-choice__badges">
                  {recommended && <strong>{recommendation.mode === 'fallback' ? '기본 순서' : '날씨 기준 추천'}</strong>}
                  {plan.id === 'plan-b2' && <em>전시 취향 백업</em>}
                  {plan.id === 'plan-c' && <em>별도 실내안</em>}
                  {plan.status === 'draft' && <em>준비 중</em>}
                </span>
              </span>
              <span className="weather-plan-choice__theme">{plan.theme}</span>
              <span className="weather-plan-choice__summary">{plan.summary}</span>
              <span className="weather-plan-choice__action">{selected ? '보고 있는 일정' : '이 일정 열기'}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
