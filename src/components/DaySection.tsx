import { useState } from 'react'
import { CarFront, ChevronDown, Footprints, Gauge, Map, ShieldAlert, UtensilsCrossed } from 'lucide-react'
import type { TimelineItem, TripDay } from '../data/trip'
import { getDayPlans, dayWeatherConfigs, type DayPlan } from '../data/weatherPlans'
import { imageSourceByFile } from '../data/imageSources'
import { getPlaceDisplayHint, placeCatalog } from '../data/localTools'
import { imagePath } from '../lib/paths'
import {
  getWeatherPlanRecommendation,
  readWeatherTestMode,
  type WeatherPlanId,
} from '../lib/weather'
import {
  classifyDay2Weather,
  day2DecisionToPlanRecommendation,
  getDay2ForecastMode,
  type Day2WeatherBundle,
  type Day2WeatherClass,
} from '../lib/day2Weather'
import { MapLinkButton } from './MapLinkButton'
import { PlaceActions } from './PlaceActions'
import { DayRouteMap } from './DayRouteMap'
import { WeatherPlanSelector } from './WeatherPlanSelector'
import { useWeather } from './WeatherProvider'
import { Day2WeatherDecisionCard } from './Day2WeatherDecisionCard'
import { HuashanMiniGuide } from './HuashanMiniGuide'

interface DaySectionProps {
  day: TripDay
  index: number
}

interface PlanTimelineProps {
  day: TripDay
  plan: DayPlan
}

const detailIcons = [Gauge, Footprints, Map, UtensilsCrossed]

function PlanTimeline({ day, plan }: PlanTimelineProps) {
  return (
    <div className="timeline" aria-label={`${day.day} ${plan.label} 상세 일정`}>
      {plan.schedule.map((item: TimelineItem, itemIndex) => {
        const imageSource = item.image ? imageSourceByFile[item.image] : undefined
        const place = item.placeId ? placeCatalog[item.placeId] : undefined
        const placeHint = getPlaceDisplayHint(place)
        return (
          <details
            className={`timeline-item ${item.optional ? 'timeline-item--optional' : ''} ${(item.placeId === 'guihou' || item.guide) ? 'timeline-item--guide-linked' : ''}`}
            open={item.placeId === 'guihou' ? true : item.placeId === 'beihai-hangzhou' ? true : undefined}
            key={`${item.time}-${item.title}`}
          >
            <summary className="timeline-item__summary">
              <span className="timeline-item__index" aria-hidden="true">{String(itemIndex + 1).padStart(2, '0')}</span>
              <span className="timeline-item__summary-copy">
                <time>{item.time}</time>
                <h3>{item.title}</h3>
                {item.localName && <span className="timeline-item__local" lang="zh-Hant">{item.localName}</span>}
                {placeHint && <span className="timeline-item__place-hint">{placeHint}</span>}
                {item.placeId === 'guihou' && <span className="timeline-item__guide-hint">현장 가이드가 바로 연결된 점심 일정</span>}
                {item.guide && <span className="timeline-item__guide-hint">{item.guide.eyebrow ?? '현장 가이드 연결'}</span>}
              </span>
              <span className="timeline-item__expand" aria-hidden="true"><ChevronDown size={20} /></span>
            </summary>
            <div className="timeline-item__details">
              {item.transport && <span className="transport-label">{item.transport}</span>}
              <p className="timeline-item__description">{item.description}</p>
              {item.placeId === 'yehliu' && (
                <div className="yehliu-timeline-actions" aria-label="예류 셀프 가이드">
                  <a className="is-primary" href="#guide/yehliu">민성 해설 열기</a>
                  <a href="#guide/yehliu/offline">오프라인 가이드 준비</a>
                </div>
              )}
              {item.placeId === 'shifen-waterfall' && (
                <div className="yehliu-timeline-actions" aria-label="스펀폭포 설명">
                  <a className="is-primary" href={`${import.meta.env.BASE_URL}shifen-waterfall.html`}>폭포 설명 더보기</a>
                </div>
              )}
              {item.placeId === 'shifen-old-street' && (
                <div className="yehliu-timeline-actions" aria-label="스펀 옛거리 현장 가이드">
                  <a className="is-primary" href={`${import.meta.env.BASE_URL}shifen-old-street.html`}>풍등·간식·카페 가이드</a>
                </div>
              )}
              {item.placeId === 'guihou' && (
                <div className="yehliu-timeline-actions" aria-label="귀후어항 현장 가이드">
                  <a className="is-primary" href="#guide/guihou">① 현장 가이드 바로 시작</a>
                  <a href="#guide/guihou/price">② 가격 계산 바로가기</a>
                </div>
              )}
              {item.detailPanel === 'huashan' && <HuashanMiniGuide />}
              {item.guide && (
                <div className="timeline-field-guide" aria-label={item.guide.label}>
                  {item.guide.eyebrow && <small>{item.guide.eyebrow}</small>}
                  <a href={`${import.meta.env.BASE_URL}${item.guide.href}`}>{item.guide.label}</a>
                </div>
              )}
              {item.tags && (
                <div className="tag-row" aria-label="일정 상태">
                  {item.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
              )}
              {imageSource && item.image && (
                <figure className="timeline-photo">
                  <img
                    src={imagePath(item.image)}
                    alt={imageSource.alt}
                    width="1600"
                    height="1067"
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption>{imageSource.place}</figcaption>
                </figure>
              )}
              {item.placeId ? (
                <PlaceActions place={placeCatalog[item.placeId]} compact />
              ) : (
                item.mapQuery && <MapLinkButton query={item.mapQuery} compact />
              )}
            </div>
          </details>
        )
      })}
    </div>
  )
}

export function DaySection({ day, index }: DaySectionProps) {
  const { dataset, status, day2: day2Weather } = useWeather()
  const [manualPlanId, setManualPlanId] = useState<WeatherPlanId | null>(null)
  const [manualDay2Class, setManualDay2Class] = useState<Day2WeatherClass | null>(null)
  const keyMealHint = day.keyMealPlaceIds
    ?.map((placeId) => getPlaceDisplayHint(placeCatalog[placeId]))
    .filter(Boolean)
    .join(' / ')
  const summaryDetails = [
    { label: '이동 강도', value: day.intensity, hint: undefined },
    { label: '예상 도보', value: day.walking, hint: undefined },
    { label: '핵심 장소', value: day.keyPlaces, hint: undefined },
    { label: '주요 식사', value: day.keyMeal, hint: keyMealHint },
  ]
  const coverSource = imageSourceByFile[day.cover]
  const plans = getDayPlans(day)
  const weatherConfig = dayWeatherConfigs[day.id]
  const testMode = readWeatherTestMode(import.meta.env.DEV, window.location.search)
  const day2FallbackBundle: Day2WeatherBundle = {
    tripDate: dayWeatherConfigs['day-2'].date,
    mode: getDay2ForecastMode(dayWeatherConfigs['day-2'].date),
    weatherByLocation: {},
    failedLocationIds: [],
    marineStatus: 'skipped',
  }
  const day2Decision = day.id === 'day-2'
    ? classifyDay2Weather(day2Weather.bundle ?? day2FallbackBundle)
    : null
  const recommendation = day2Decision
    ? day2DecisionToPlanRecommendation(day2Decision, weatherConfig.date)
    : getWeatherPlanRecommendation({ dataset, status, config: weatherConfig, testMode })
  const selectedPlanId = manualPlanId ?? recommendation.recommendedPlanId
  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId) ?? plans[0]
  const day2SafetyHold = day.id === 'day-2' && day2Decision?.safetyState === 'safety-hold'
  const planPanelId = `${day.id}-weather-plan-panel`
  const handlePlanSelect = (planId: WeatherPlanId) => {
    setManualPlanId(planId)
    if (day.id === 'day-2') {
      setManualDay2Class(planId === 'plan-a' ? 'A' : planId === 'plan-c' ? 'C' : 'B')
    }
  }
  const handleDay2ClassChange = (weatherClass: Day2WeatherClass | null) => {
    setManualDay2Class(weatherClass)
    setManualPlanId(weatherClass
      ? weatherClass === 'A' ? 'plan-a' : weatherClass === 'B' ? 'plan-b' : 'plan-c'
      : null)
  }

  return (
    <section className={`day-section day-section--${index + 1}`} id={day.id} data-day-section={day.id}>
      <div className="day-cover">
        <img
          src={imagePath(day.cover)}
          alt={coverSource.alt}
          width="1600"
          height="1067"
          loading="lazy"
          decoding="async"
        />
        <div className="day-cover__scrim" />
        <div className="day-cover__content page-shell">
          <div className="day-cover__number">
            <span>{day.day}</span>
            <strong>{day.date}</strong>
            <small>{day.weekday}</small>
          </div>
          <div className="day-cover__title">
            <span>{day.theme}</span>
            <h2>{day.title}</h2>
            <p>{day.lead}</p>
          </div>
        </div>
      </div>

      <div className="page-shell day-section__body">
        <div className="day-quick-grid">
          {summaryDetails.map((detail, detailIndex) => {
            const Icon = detailIcons[detailIndex]
            return (
              <div className="day-quick" key={detail.label}>
                <Icon size={21} aria-hidden="true" />
                <span>{detail.label}</span>
                <strong>{detail.value}</strong>
                {detail.hint && <small className="day-quick__hint">{detail.hint}</small>}
              </div>
            )
          })}
          <div className="day-quick day-quick--wide">
            <CarFront size={21} aria-hidden="true" />
            <span>이동수단</span>
            <strong>{day.transport}</strong>
          </div>
        </div>

        {day.id === 'day-2' && selectedPlan.id === 'plan-a' && !day2SafetyHold && (
          <aside className="guihou-day-entry" aria-labelledby="guihou-day-entry-title">
            <UtensilsCrossed aria-hidden="true" />
            <div>
              <small>DAY 2 · 10:55 도착 후</small>
              <h3 id="guihou-day-entry-title">귀후어항에 도착하면 여기부터</h3>
              <p>현장 가이드를 열고 ① 1층 한 바퀴 → ② 가격·조리비 확인 → ③ 2층 식사 순서대로 따라가면 됩니다.</p>
            </div>
            <div>
              <a className="is-primary" href="#guide/guihou">현장 가이드 시작</a>
              <a href="#guide/guihou/price">바로 가격 계산</a>
            </div>
          </aside>
        )}

        {day2Decision && (
          <Day2WeatherDecisionCard
            decision={day2Decision}
            status={day2Weather.status}
            manualClass={manualDay2Class}
            onManualClassChange={handleDay2ClassChange}
            onRefresh={day2Weather.refresh}
          />
        )}

        {day2SafetyHold ? (
          <section className="day2-safety-plan" aria-labelledby="day2-safety-plan-title">
            <ShieldAlert size={30} aria-hidden="true" />
            <div>
              <small>PLAN D · SAFETY FIRST</small>
              <h3 id="day2-safety-plan-title">정상 관광 동선을 표시하지 않습니다</h3>
              <p>공식 경보·도로 통제·관광지 운영 상태와 LUMI 기사님의 운행 판단을 먼저 확인합니다. 안전이 확보되지 않으면 이동을 시작하지 않고, 일부 구간만 안전하면 그때 짧은 실내 동선을 새로 정합니다.</p>
              <span>위험이 해제되기 전에는 A·B·C 수동 전환도 잠깁니다.</span>
            </div>
          </section>
        ) : (
          <>
            <WeatherPlanSelector
              config={weatherConfig}
              plans={plans}
              recommendation={recommendation}
              selectedPlanId={selectedPlan.id}
              panelId={planPanelId}
              loading={(day.id === 'day-2' ? day2Weather.status === 'loading' : status === 'loading' && testMode === null)}
              compact={day.id === 'day-2'}
              onSelect={handlePlanSelect}
            />

            <section
              className={`day-plan-detail day-plan-detail--${selectedPlan.id}`}
              id={planPanelId}
              aria-labelledby={`${day.id}-${selectedPlan.id}-title`}
            >
              <header className="day-plan-detail__heading">
                <div>
                  <small>{selectedPlan.label} · {selectedPlan.weatherType === 'rain' ? '비 오는 날' : '비가 적은 날'}</small>
                  <h3 id={`${day.id}-${selectedPlan.id}-title`}>{selectedPlan.theme}</h3>
                  <p>{selectedPlan.summary}</p>
                </div>
                {selectedPlan.status === 'draft' && <span>별도 일정 설계 중</span>}
              </header>

              <nav className="day-plan-glance" aria-label={`${day.day} ${selectedPlan.label} 핵심 동선`}>
                <small>ROUTE AT A GLANCE</small>
                <ol>
                  {selectedPlan.route.stops.map((stop, stopIndex) => (
                    <li key={`${stop.placeId}-${stopIndex}`}>
                      <span>{stopIndex + 1}</span>
                      <strong>{stop.label}</strong>
                    </li>
                  ))}
                </ol>
              </nav>

              <details className="day-plan-route-drawer">
                <summary>
                  <Map size={21} aria-hidden="true" />
                  <span><small>MAP & PLACES</small><strong>동선 지도와 장소 설명 보기</strong></span>
                  <em>{selectedPlan.route.stops.length}곳</em>
                  <ChevronDown size={20} aria-hidden="true" />
                </summary>
                <DayRouteMap
                  dayId={day.id}
                  dayLabel={`${day.day} · ${selectedPlan.label}`}
                  route={selectedPlan.route}
                  routeId={`${day.id}-${selectedPlan.id}`}
                />
              </details>

              <section className="day-plan-timeline" aria-labelledby={`${day.id}-${selectedPlan.id}-timeline-title`}>
                <header>
                  <small>DAY BY TIME</small>
                  <h4 id={`${day.id}-${selectedPlan.id}-timeline-title`}>시간순 일정</h4>
                  <p>먼저 시간과 장소만 훑고, 필요한 일정만 눌러 설명·지도·현장 가이드를 확인하세요.</p>
                </header>
                <PlanTimeline day={day} plan={selectedPlan} />
              </section>
            </section>
          </>
        )}
      </div>
    </section>
  )
}
