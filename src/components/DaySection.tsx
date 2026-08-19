import { CarFront, ChevronDown, Footprints, Gauge, Map, UtensilsCrossed } from 'lucide-react'
import type { TripDay } from '../data/trip'
import { imageSourceByFile } from '../data/imageSources'
import { placeCatalog, rainPlans } from '../data/localTools'
import { imagePath } from '../lib/paths'
import { MapLinkButton } from './MapLinkButton'
import { PlaceActions } from './PlaceActions'
import { DayRouteMap } from './DayRouteMap'

interface DaySectionProps {
  day: TripDay
  index: number
}

const detailIcons = [Gauge, Footprints, Map, UtensilsCrossed]

export function DaySection({ day, index }: DaySectionProps) {
  const summaryDetails = [
    { label: '이동 강도', value: day.intensity },
    { label: '예상 도보', value: day.walking },
    { label: '핵심 장소', value: day.keyPlaces },
    { label: '주요 식사', value: day.keyMeal },
  ]
  const coverSource = imageSourceByFile[day.cover]
  const rainPlan = rainPlans.find((plan) => plan.day === day.day)

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
              </div>
            )
          })}
          <div className="day-quick day-quick--wide">
            <CarFront size={21} aria-hidden="true" />
            <span>이동수단</span>
            <strong>{day.transport}</strong>
          </div>
        </div>

        <DayRouteMap dayId={day.id} dayLabel={day.day} />

        <div className="timeline" aria-label={`${day.day} 상세 일정`}>
          {day.schedule.map((item, itemIndex) => {
            const imageSource = item.image ? imageSourceByFile[item.image] : undefined
            return (
              <details className={`timeline-item ${item.optional ? 'timeline-item--optional' : ''}`} key={`${item.time}-${item.title}`}>
                <summary className="timeline-item__summary">
                  <span className="timeline-item__index" aria-hidden="true">{String(itemIndex + 1).padStart(2, '0')}</span>
                  <span className="timeline-item__summary-copy">
                    <time>{item.time}</time>
                    <h3>{item.title}</h3>
                    {item.localName && <span className="timeline-item__local">{item.localName}</span>}
                  </span>
                  <span className="timeline-item__expand" aria-hidden="true"><ChevronDown size={20} /></span>
                </summary>
                <div className="timeline-item__details">
                  {item.transport && <span className="transport-label">{item.transport}</span>}
                  <p className="timeline-item__description">{item.description}</p>
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

        {rainPlan && (
          <details className="weather-plan">
            <summary>
              <span>
                <small>WEATHER PLAN B</small>
                <strong>{rainPlan.title}</strong>
              </span>
              <span className="weather-plan__toggle">대안 보기</span>
            </summary>
            <div className="weather-plan__body">
              {rainPlan.options.map((option) => (
                <div key={option.condition}>
                  <strong>{option.condition}</strong>
                  <p>{option.action}</p>
                </div>
              ))}
            </div>
            <p className="weather-plan__note">이 카드는 확정 일정이 아닌 비상 대안입니다. 여행 직전 예보와 부모님 컨디션을 기준으로 결정합니다.</p>
          </details>
        )}
      </div>
    </section>
  )
}
