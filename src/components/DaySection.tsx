import { useState } from 'react'
import { CarFront, ChevronDown, Footprints, Gauge, Map, UtensilsCrossed } from 'lucide-react'
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
import { MapLinkButton } from './MapLinkButton'
import { PlaceActions } from './PlaceActions'
import { DayRouteMap } from './DayRouteMap'
import { WeatherPlanSelector } from './WeatherPlanSelector'
import { useWeather } from './WeatherProvider'

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
          <details className={`timeline-item ${item.optional ? 'timeline-item--optional' : ''}`} key={`${item.time}-${item.title}`}>
            <summary className="timeline-item__summary">
              <span className="timeline-item__index" aria-hidden="true">{String(itemIndex + 1).padStart(2, '0')}</span>
              <span className="timeline-item__summary-copy">
                <time>{item.time}</time>
                <h3>{item.title}</h3>
                {item.localName && <span className="timeline-item__local" lang="zh-Hant">{item.localName}</span>}
                {placeHint && <span className="timeline-item__place-hint">{placeHint}</span>}
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
  const { dataset, status } = useWeather()
  const [manualPlanId, setManualPlanId] = useState<WeatherPlanId | null>(null)
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
  const recommendation = getWeatherPlanRecommendation({ dataset, status, config: weatherConfig, testMode })
  const selectedPlanId = manualPlanId ?? recommendation.recommendedPlanId
  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId) ?? plans[0]
  const planPanelId = `${day.id}-weather-plan-panel`

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

        <WeatherPlanSelector
          config={weatherConfig}
          plans={plans}
          recommendation={recommendation}
          selectedPlanId={selectedPlan.id}
          panelId={planPanelId}
          loading={status === 'loading' && testMode === null}
          onSelect={setManualPlanId}
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
            {selectedPlan.status === 'draft' && <span>완전 대체 일정 준비 중</span>}
          </header>

          <DayRouteMap
            dayId={day.id}
            dayLabel={`${day.day} · ${selectedPlan.label}`}
            route={selectedPlan.route}
            routeId={`${day.id}-${selectedPlan.id}`}
          />
          <PlanTimeline day={day} plan={selectedPlan} />
        </section>
      </div>
    </section>
  )
}
