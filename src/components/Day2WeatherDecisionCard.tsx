import {
  AlertTriangle,
  CheckCircle2,
  CloudRain,
  CloudSun,
  MapPin,
  RefreshCw,
  ShieldAlert,
  Waves,
  Wind,
} from 'lucide-react'
import {
  TAIPEI_TIME_ZONE,
  type WeatherLoadStatus,
} from '../lib/weather'
import type {
  Day2Confidence,
  Day2ForecastMode,
  Day2LocationAssessment,
  Day2WeatherClass,
  Day2WeatherDecision,
} from '../lib/day2Weather'

interface Day2WeatherDecisionCardProps {
  decision: Day2WeatherDecision
  status: WeatherLoadStatus
  manualClass: Day2WeatherClass | null
  onManualClassChange: (weatherClass: Day2WeatherClass | null) => void
  onRefresh: () => Promise<void>
}

const classCopy: Record<Day2WeatherClass, { title: string; short: string }> = {
  A: { title: '정상 야외 일정', short: '기존 일정 진행' },
  B: { title: '비가 있지만 이동 가능', short: '우천 대비' },
  C: { title: '야외 일정 적극 조정 권고', short: '동선 재검토' },
}

const modeCopy: Record<Day2ForecastMode, string> = {
  OUT_OF_RANGE: '오늘 기준 · 여행일 예보 아님',
  PREVIEW: '예비 판정',
  NEAR_TERM: '여행일 예보',
  LIVE: '실시간 + 시간별 예보',
}

const confidenceCopy: Record<Day2Confidence, string> = {
  high: '신뢰도 높음',
  medium: '신뢰도 보통',
  low: '신뢰도 낮음',
  unavailable: '판정 자료 없음',
}

const riskCopy = {
  good: 'GOOD · 진행 가능',
  caution: 'CAUTION · 주의',
  poor: 'POOR · 적극 조정',
} as const

const formatMetric = (value: number | undefined, suffix: string, digits = 0) => (
  value === undefined ? '—' : `${value.toFixed(digits)}${suffix}`
)

const formatUpdatedAt = (fetchedAt: number | undefined) => {
  if (!fetchedAt) return '업데이트 전'
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: TAIPEI_TIME_ZONE,
  }).format(new Date(fetchedAt))
}

function LocationWeatherCard({ location }: { location: Day2LocationAssessment }) {
  const RiskIcon = !location.available
    ? AlertTriangle
    : location.risk === 'good' ? CheckCircle2 : location.risk === 'poor' ? ShieldAlert : CloudRain
  return (
    <article className={`day2-weather-location day2-weather-location--${location.risk ?? 'unavailable'}`}>
      <header>
        <div>
          <small>{location.localName} · {location.windowLabel}</small>
          <h4><MapPin size={16} aria-hidden="true" /> {location.koreanName}</h4>
        </div>
        <span><RiskIcon size={15} aria-hidden="true" /> {location.available && location.risk ? riskCopy[location.risk] : 'DATA 없음'}</span>
      </header>

      <dl>
        <div><dt>강수확률</dt><dd>{formatMetric(location.precipitationProbability, '%')}</dd></div>
        <div><dt>최대 강수</dt><dd>{formatMetric(location.maxHourlyPrecipitation, 'mm/h', 1)}</dd></div>
        <div><dt>바람 / 돌풍</dt><dd>{formatMetric(location.windSpeed, '', 0)} / {formatMetric(location.windGust, 'km/h')}</dd></div>
        {location.locationId === 'yehliu' && (
          <div><dt>파고 / 주기</dt><dd>{formatMetric(location.waveHeight, 'm', 1)} / {formatMetric(location.wavePeriod, 's', 1)}</dd></div>
        )}
      </dl>
      <p>{location.note}</p>
    </article>
  )
}

export function Day2WeatherDecisionCard({
  decision,
  status,
  manualClass,
  onManualClassChange,
  onRefresh,
}: Day2WeatherDecisionCardProps) {
  const safetyHold = decision.safetyState === 'safety-hold'
  const todayPreview = decision.mode === 'OUT_OF_RANGE'
  const effectiveClass = safetyHold ? null : manualClass ?? decision.weatherClass
  const tone = safetyHold ? 'safety' : effectiveClass?.toLowerCase() ?? 'waiting'
  const HeadingIcon = safetyHold
    ? ShieldAlert
    : effectiveClass === 'A' ? CloudSun : effectiveClass ? CloudRain : AlertTriangle
  const title = safetyHold
    ? todayPreview ? '오늘 같은 날씨라면 · 안전 확인 필요' : '안전 확인 필요 · 일반 일정 판정 중지'
    : effectiveClass
      ? `${todayPreview ? '오늘 같은 날씨라면 ' : ''}${effectiveClass} · ${classCopy[effectiveClass].title}`
      : status === 'loading' ? '북부 대만 기상 자료를 확인하는 중' : '오늘 날씨 미리보기를 불러오지 못했습니다'
  const decisionStatus = manualClass
    ? `${todayPreview ? '오늘 기준 ' : ''}자동 판정은 ${decision.weatherClass ?? '대기'} · 현재 수동으로 ${manualClass} 표시 중`
    : decision.weatherClass ? `${todayPreview ? '오늘 기준 ' : ''}자동 ${decision.weatherClass} ${todayPreview ? '미리보기' : '추천'}` : '자동 판정 대기'

  return (
    <section
      className={`day2-weather-decision day2-weather-decision--${tone}`}
      aria-labelledby="day2-weather-decision-title"
      aria-live="polite"
      aria-busy={status === 'loading'}
    >
      <header className="day2-weather-decision__header">
        <span className="day2-weather-decision__icon" aria-hidden="true"><HeadingIcon size={25} /></span>
        <div>
          <small>DAY 2 WEATHER DECISION</small>
          <h3 id="day2-weather-decision-title">{title}</h3>
          <p>{safetyHold
            ? '관광지 공식 운영상태와 도로·기상 경보를 확인하고, 실제 운행은 기사님과 당국 판단을 우선합니다.'
            : decisionStatus}</p>
        </div>
        <button
          className="day2-weather-decision__refresh"
          type="button"
          disabled={status === 'loading'}
          onClick={() => void onRefresh()}
        >
          <RefreshCw size={17} aria-hidden="true" />
          <span>{status === 'loading' ? '확인 중' : '새로고침'}</span>
        </button>
      </header>

      <div className="day2-weather-decision__meta" aria-label="예보 상태">
        <span>{modeCopy[decision.mode]}</span>
        <span>{confidenceCopy[decision.confidence]}</span>
        <span>{formatUpdatedAt(decision.fetchedAt)}</span>
        <span>Open-Meteo Forecast + Marine</span>
      </div>

      {todayPreview && (
        <p className="day2-weather-decision__preview" role="note">
          지금은 오늘의 예류·스펀·지우펀 날씨를 같은 시간대에 대입한 참고 화면입니다. 2027년 2월 14일부터 2월 21일 여행일 예보로 자동 전환됩니다.
        </p>
      )}

      {(decision.degraded || status === 'error') && (
        <p className="day2-weather-decision__degraded" role="status">
          <AlertTriangle size={17} aria-hidden="true" />
          일부 자료가 없어 낮은 신뢰도로 표시합니다. 없는 값은 ‘—’로 남기고 확인된 기상·바람만 사용합니다.
        </p>
      )}

      <div className="day2-weather-decision__locations">
        {decision.locations.map((location) => <LocationWeatherCard location={location} key={location.locationId} />)}
      </div>

      <div className="day2-weather-decision__reason">
        <div>
          <small>{safetyHold ? 'SAFETY OVERRIDE' : 'WHY THIS DECISION'}</small>
          <h4>{safetyHold ? '왜 일반 판정을 멈췄나요?' : '왜 이렇게 판단했나요?'}</h4>
        </div>
        <ul>
          {decision.reasons.map((reason) => <li key={reason}>{reason}</li>)}
        </ul>
      </div>

      <div className="day2-weather-decision__controls">
        <div>
          <strong>표시할 플랜</strong>
          <small>자동 판정과 가족의 최종 선택은 분리해 기억합니다.</small>
        </div>
        <div role="group" aria-label="Day 2 날씨 플랜 수동 선택">
          <button
            type="button"
            aria-pressed={manualClass === null}
            className={manualClass === null ? 'is-selected' : ''}
            onClick={() => onManualClassChange(null)}
          >자동 {decision.weatherClass ?? '대기'}</button>
          {(['A', 'B', 'C'] as Day2WeatherClass[]).map((weatherClass) => (
            <button
              type="button"
              aria-pressed={manualClass === weatherClass}
              className={manualClass === weatherClass ? 'is-selected' : ''}
              disabled={safetyHold}
              title={safetyHold ? '안전 확인 전에는 일반 플랜으로 전환할 수 없습니다.' : classCopy[weatherClass].short}
              onClick={() => onManualClassChange(weatherClass)}
              key={weatherClass}
            >{weatherClass}</button>
          ))}
        </div>
        {(effectiveClass === 'B' || effectiveClass === 'C') && (
          <p><Waves size={16} aria-hidden="true" /> Plan B/C 상세 동선은 아직 설계 전입니다. 아래에는 현재 준비 중인 우천 대응 안내만 표시됩니다.</p>
        )}
        {safetyHold && <p><Wind size={16} aria-hidden="true" /> 안전 확인이 끝날 때까지 A/B/C 자동 추천과 수동 전환을 중지합니다.</p>}
      </div>
    </section>
  )
}
