import { useRef, useState } from 'react'
import { ExternalLink, MapPin, MapPinned } from 'lucide-react'
import { dayRoutes, type DayRoute } from '../data/dayRoutes'
import { getPlaceDisplayHint, placeCatalog } from '../data/localTools'
import { googleMapsPlaceUrl, imagePath } from '../lib/paths'

interface DayRouteMapProps {
  dayId: string
  dayLabel: string
  route?: DayRoute
  routeId?: string
}

const routeNodeWidth = 154
const routeNodeGap = 20
const routeEdgePadding = 56

export function DayRouteMap({ dayId, dayLabel, route: suppliedRoute, routeId }: DayRouteMapProps) {
  const route = suppliedRoute ?? dayRoutes[dayId]
  const [activeStop, setActiveStop] = useState<number | null>(null)
  const stopCards = useRef<Array<HTMLLIElement | null>>([])

  if (!route) return null

  const mapId = routeId ?? dayId
  const titleId = `${mapId}-route-title`
  const descriptionId = `${mapId}-route-description`
  const stopId = (index: number) => `${mapId}-route-stop-${index + 1}`
  const trackWidth = Math.max(
    760,
    route.stops.length * routeNodeWidth
      + Math.max(0, route.stops.length - 1) * routeNodeGap
      + routeEdgePadding * 2,
  )

  const jumpToStop = (index: number) => {
    const target = stopCards.current[index]
    if (!target) return

    setActiveStop(index)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' })
    target.focus({ preventScroll: true })
  }

  return (
    <section className="day-route" aria-labelledby={titleId}>
      <div className="day-route__heading">
        <span className="day-route__icon" aria-hidden="true"><MapPinned size={22} /></span>
        <div>
          <small>{dayLabel} · ROUTE MAP</small>
          <h3 id={titleId}>{route.title}</h3>
          <p id={descriptionId}>{route.summary}</p>
        </div>
      </div>

      <div
        className={`day-route__map ${dayId === 'day-1' ? 'day-route__map--scenic' : ''}`}
        role="group"
        aria-labelledby={`${titleId} ${descriptionId}`}
      >
        <div className="day-route__scene" style={{ width: `${trackWidth}px` }}>
          {dayId === 'day-1' && (
            <img
              className="day-route__backdrop"
              src={imagePath('day1-route-background.png')}
              alt=""
              width="1774"
              height="887"
              loading="lazy"
              decoding="async"
              aria-hidden="true"
            />
          )}
          <span className="day-route__wash" aria-hidden="true" />
          <span className="day-route__region-label" aria-hidden="true">TAIWAN ROUTE · VISIT ORDER</span>

          <ol className="day-route__track" aria-label={`${dayLabel} 장소 바로가기`}>
            {route.stops.map((stop, index) => {
              const place = placeCatalog[stop.placeId]
              const hint = getPlaceDisplayHint(place)
              const isEndpoint = index === 0 || index === route.stops.length - 1

              return (
                <li key={`${stop.placeId}-${index}`}>
                  <button
                    className={`day-route__node ${isEndpoint ? 'day-route__node--endpoint' : ''} ${index === route.stops.length - 1 ? 'day-route__node--finish' : ''} ${activeStop === index ? 'is-active' : ''}`}
                    type="button"
                    aria-controls={stopId(index)}
                    aria-pressed={activeStop === index}
                    onClick={() => jumpToStop(index)}
                  >
                    <span className="day-route__node-number" aria-hidden="true">{index + 1}</span>
                    <span className="day-route__node-copy">
                      <strong>{stop.label}</strong>
                      <span lang="zh-Hant">{place.localName}</span>
                      <small>{hint ?? stop.note}</small>
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
        </div>
      </div>

      <p className="day-route__hint"><MapPin size={16} aria-hidden="true" /> 장소를 누르면 아래 설명으로 이동합니다. 좌우로 밀어 전체 동선을 볼 수 있어요.</p>

      <ol className="day-route__stops" aria-label={`${dayLabel} 이동 순서와 장소 설명`}>
        {route.stops.map((stop, index) => {
          const place = placeCatalog[stop.placeId]
          const hint = getPlaceDisplayHint(place)

          return (
            <li
              className={activeStop === index ? 'is-active' : ''}
              id={stopId(index)}
              key={`${stop.placeId}-${index}`}
              ref={(node) => { stopCards.current[index] = node }}
              tabIndex={-1}
            >
              <span className="day-route__stop-number" aria-hidden="true">{index + 1}</span>
              <div className="day-route__stop-copy">
                <p>
                  <strong>{stop.label}</strong>
                  <span className="day-route__stop-local" lang="zh-Hant">{place.localName}</span>
                  {hint && <span className="day-route__stop-hint">{hint}</span>}
                  {stop.note && stop.note !== hint && <small>{stop.note}</small>}
                </p>
                {place.descriptionKo && <p className="day-route__stop-description">{place.descriptionKo}</p>}
                <a
                  className="day-route__stop-link"
                  href={googleMapsPlaceUrl(place.latitude, place.longitude, place.localName)}
                  target="_blank"
                  rel="noreferrer"
                  onFocus={() => setActiveStop(index)}
                  onClick={() => setActiveStop(index)}
                  aria-label={`${stop.label} 위치를 Google 지도에서 새 탭으로 열기`}
                >
                  <MapPin size={15} aria-hidden="true" />
                  <span>Google 지도</span>
                  <ExternalLink size={13} aria-hidden="true" />
                </a>
              </div>
            </li>
          )
        })}
      </ol>
      <p className="day-route__note">방문 순서와 장소 성격을 빠르게 보는 노선도입니다. 배경은 여행 분위기를 위한 장식이며, 실제 위치와 도로 경로는 각 장소의 Google 지도를 확인해 주세요.</p>
    </section>
  )
}
