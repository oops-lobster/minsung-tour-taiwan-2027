import { MapPinned } from 'lucide-react'
import { dayRoutes } from '../data/dayRoutes'
import { placeCatalog } from '../data/localTools'

interface DayRouteMapProps {
  dayId: string
  dayLabel: string
}

interface RoutePoint {
  x: number
  y: number
}

const mapWidth = 760
const mapHeight = 360
const mapPadding = 58
const minimumLongitudeSpan = 0.11
const minimumLatitudeSpan = 0.085

function projectRoute(dayId: string): RoutePoint[] {
  const stops = dayRoutes[dayId].stops
  const places = stops.map((stop) => placeCatalog[stop.placeId])
  const longitudes = places.map((place) => place.longitude)
  const latitudes = places.map((place) => place.latitude)
  const rawLongitudeSpan = Math.max(...longitudes) - Math.min(...longitudes)
  const rawLatitudeSpan = Math.max(...latitudes) - Math.min(...latitudes)
  const longitudeSpan = Math.max(rawLongitudeSpan, minimumLongitudeSpan)
  const latitudeSpan = Math.max(rawLatitudeSpan, minimumLatitudeSpan)
  const longitudeCenter = (Math.max(...longitudes) + Math.min(...longitudes)) / 2
  const latitudeCenter = (Math.max(...latitudes) + Math.min(...latitudes)) / 2
  const minLongitude = longitudeCenter - longitudeSpan / 2
  const maxLatitude = latitudeCenter + latitudeSpan / 2

  const duplicateCounts = new Map<string, number>()

  return places.map((place) => {
    const key = `${place.latitude}:${place.longitude}`
    const duplicateIndex = duplicateCounts.get(key) ?? 0
    duplicateCounts.set(key, duplicateIndex + 1)
    const duplicateOffset = duplicateIndex * 12

    return {
      x: mapPadding + ((place.longitude - minLongitude) / longitudeSpan) * (mapWidth - mapPadding * 2) + duplicateOffset,
      y: mapPadding + ((maxLatitude - place.latitude) / latitudeSpan) * (mapHeight - mapPadding * 2) + duplicateOffset,
    }
  })
}

export function DayRouteMap({ dayId, dayLabel }: DayRouteMapProps) {
  const route = dayRoutes[dayId]

  if (!route) return null

  const points = projectRoute(dayId)
  const path = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(' ')
  const titleId = `${dayId}-route-title`
  const descriptionId = `${dayId}-route-description`

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

      <div className="day-route__map">
        <svg
          viewBox={`0 0 ${mapWidth} ${mapHeight}`}
          role="img"
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
            <filter id={`${dayId}-shadow`} x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.2" />
            </filter>
          </defs>

          <rect width={mapWidth} height={mapHeight} className="day-route__water" />
          <rect width={mapWidth} height={mapHeight} fill={`url(#${dayId}-grid)`} />
          <path
            d="M 12 302 C 76 224 130 157 209 117 C 300 72 399 61 491 86 C 589 112 661 167 748 232 L 760 360 L 0 360 Z"
            fill={`url(#${dayId}-land)`}
            className="day-route__land"
          />
          <text x="28" y="38" className="day-route__region-label">TAIPEI · NORTH TAIWAN</text>
          <g className="day-route__north" transform="translate(706 28)">
            <path d="M 10 24 L 18 5 L 26 24 L 18 20 Z" />
            <text x="18" y="36" textAnchor="middle">N</text>
          </g>
          <path d={path} className="day-route__line-shadow" />
          <path d={path} className="day-route__line" />

          {points.map((point, index) => (
            <g
              className={`day-route__point ${index === 0 ? 'day-route__point--start' : ''} ${index === points.length - 1 ? 'day-route__point--finish' : ''}`}
              transform={`translate(${point.x} ${point.y})`}
              key={`${route.stops[index].placeId}-${index}`}
              filter={`url(#${dayId}-shadow)`}
            >
              <circle r="16" />
              <text textAnchor="middle" dominantBaseline="central">{index + 1}</text>
            </g>
          ))}
        </svg>
      </div>

      <ol className="day-route__stops" aria-label={`${dayLabel} 이동 순서`}>
        {route.stops.map((stop, index) => (
          <li key={`${stop.placeId}-${index}`}>
            <span aria-hidden="true">{index + 1}</span>
            <p>
              <strong>{stop.label}</strong>
              {stop.note && <small>{stop.note}</small>}
            </p>
          </li>
        ))}
      </ol>
      <p className="day-route__note">장소의 상대적인 방향과 방문 순서를 보여주는 간략 동선도입니다. 실제 도로 경로와는 다를 수 있어요.</p>
    </section>
  )
}
