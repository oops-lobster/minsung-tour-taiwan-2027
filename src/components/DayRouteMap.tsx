import { useRef, useState } from 'react'
import { ExternalLink, MapPin, MapPinned } from 'lucide-react'
import { dayRoutes } from '../data/dayRoutes'
import { placeCatalog } from '../data/localTools'
import { googleMapsPlaceUrl } from '../lib/paths'

interface DayRouteMapProps {
  dayId: string
  dayLabel: string
}

interface RoutePoint {
  x: number
  y: number
}

const mapWidth = 760
const mapHeight = 286
const horizontalPadding = 70
const routeLanes = [174, 102, 194, 118, 188, 96, 176, 122, 186]

function projectRoute(dayId: string): RoutePoint[] {
  const stops = dayRoutes[dayId].stops
  const usableWidth = mapWidth - horizontalPadding * 2

  return stops.map((_, index) => ({
    x: stops.length === 1
      ? mapWidth / 2
      : horizontalPadding + (index / (stops.length - 1)) * usableWidth,
    y: routeLanes[index % routeLanes.length],
  }))
}

export function DayRouteMap({ dayId, dayLabel }: DayRouteMapProps) {
  const route = dayRoutes[dayId]
  const [activeStop, setActiveStop] = useState<number | null>(null)
  const stopLinks = useRef<Array<HTMLAnchorElement | null>>([])

  if (!route) return null

  const denseRoute = route.stops.length > 10
  const points = projectRoute(dayId)
  const path = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(' ')
  const titleId = `${dayId}-route-title`
  const descriptionId = `${dayId}-route-description`
  const stopId = (index: number) => `${dayId}-route-stop-${index + 1}`

  const jumpToStop = (index: number) => {
    const target = stopLinks.current[index]
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

      <div className={`day-route__map ${denseRoute ? 'day-route__map--dense' : ''}`}>
        <svg
          viewBox={`0 0 ${mapWidth} ${mapHeight}`}
          role="group"
          aria-labelledby={`${titleId} ${descriptionId}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <pattern id={`${dayId}-grid`} width="38" height="38" patternUnits="userSpaceOnUse">
              <path d="M 38 0 L 0 0 0 38" className="day-route__grid-line" />
            </pattern>
            <linearGradient id={`${dayId}-land`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" className="day-route__land-start" />
              <stop offset="100%" className="day-route__land-end" />
            </linearGradient>
            <marker id={`${dayId}-arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 Z" className="day-route__arrow" />
            </marker>
            <filter id={`${dayId}-shadow`} x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.2" />
            </filter>
          </defs>

          <rect width={mapWidth} height={mapHeight} className="day-route__water" />
          <rect width={mapWidth} height={mapHeight} fill={`url(#${dayId}-grid)`} />
          <path
            d="M -20 238 C 94 188 158 222 250 184 C 342 146 397 160 477 118 C 563 73 650 87 790 35 L 790 310 L -20 310 Z"
            fill={`url(#${dayId}-land)`}
            className="day-route__land"
          />
          <path className="day-route__contour" d="M -10 78 C 128 34 210 92 331 61 C 463 27 552 60 770 8" />
          <path className="day-route__contour" d="M -10 258 C 102 213 201 257 307 222 C 435 181 536 226 770 151" />
          <text x="28" y="36" className="day-route__region-label">TAIWAN ROUTE · VISIT ORDER</text>
          <g className="day-route__taiwan-mark" transform="translate(690 25)">
            <path d="M 22 1 C 34 15 33 29 27 43 C 22 57 14 66 8 62 C 1 57 7 46 11 37 C 16 26 13 15 22 1 Z" />
            <text x="20" y="78" textAnchor="middle">TAIWAN</text>
          </g>
          <path d={path} className="day-route__line-shadow" />
          <path d={path} className="day-route__line" markerEnd={`url(#${dayId}-arrow)`} />

          {points.map((point, index) => (
            <a
              className={`day-route__point-link ${activeStop === index ? 'is-active' : ''}`}
              href={`#${stopId(index)}`}
              aria-label={`${index + 1}번 ${route.stops[index].label} 장소 카드로 이동`}
              onClick={(event) => {
                event.preventDefault()
                jumpToStop(index)
              }}
              key={`${route.stops[index].placeId}-${index}`}
            >
              <circle className="day-route__point-hit" cx={point.x} cy={point.y} r={denseRoute ? 22 : 27} />
              <g
                className={`day-route__point ${index === 0 ? 'day-route__point--start' : ''} ${index === points.length - 1 ? 'day-route__point--finish' : ''}`}
                transform={`translate(${point.x} ${point.y})`}
                filter={`url(#${dayId}-shadow)`}
              >
                <circle className="day-route__point-focus" r="23" />
                <circle className="day-route__point-disc" r="17" />
                <text textAnchor="middle" dominantBaseline="central">{index + 1}</text>
              </g>
            </a>
          ))}
          <text x={points[0].x} y={points[0].y + 34} textAnchor="middle" className="day-route__endpoint-label">START</text>
          <text x={points[points.length - 1].x} y={points[points.length - 1].y + 34} textAnchor="middle" className="day-route__endpoint-label">FINISH</text>
        </svg>
      </div>

      <p className="day-route__hint"><MapPin size={16} aria-hidden="true" /> 숫자를 누르면 아래 장소로 이동합니다.</p>

      <ol className="day-route__stops" aria-label={`${dayLabel} 이동 순서`}>
        {route.stops.map((stop, index) => {
          const place = placeCatalog[stop.placeId]

          return (
            <li
              className={activeStop === index ? 'is-active' : ''}
              id={stopId(index)}
              key={`${stop.placeId}-${index}`}
            >
              <span className="day-route__stop-number" aria-hidden="true">{index + 1}</span>
              <div className="day-route__stop-copy">
                <p>
                  <strong>{stop.label}</strong>
                  {stop.note && <small>{stop.note}</small>}
                </p>
                <a
                  className="day-route__stop-link"
                  href={googleMapsPlaceUrl(place.latitude, place.longitude, place.localName)}
                  target="_blank"
                  rel="noreferrer"
                  ref={(node) => { stopLinks.current[index] = node }}
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
      <p className="day-route__note">방문 순서를 한눈에 보기 위한 노선도형 동선 지도입니다. 실제 축척과 도로 경로는 각 장소의 Google 지도를 확인해 주세요.</p>
    </section>
  )
}
