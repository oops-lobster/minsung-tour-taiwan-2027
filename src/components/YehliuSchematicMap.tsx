import type { KeyboardEvent } from 'react'
import { yehliuRouteDefinitions, yehliuGpsFacilities, type GeoPoint } from '../data/yehliuGpsRoute'
import { yehliuStops, type YehliuRouteId, type YehliuStopId } from '../data/yehliuGuide'

interface YehliuSchematicMapProps {
  routeId: YehliuRouteId
  selectedStop: YehliuStopId
  visited: YehliuStopId[]
  skipped?: YehliuStopId[]
  onSelectStop: (stopId: YehliuStopId) => void
}

const WIDTH = 780
const HEIGHT = 380
const PAD_X = 64
const PAD_Y = 54
const deepPath = yehliuRouteDefinitions.deep.path
const bounds = deepPath.reduce((result, point) => ({
  minLat: Math.min(result.minLat, point.lat),
  maxLat: Math.max(result.maxLat, point.lat),
  minLng: Math.min(result.minLng, point.lng),
  maxLng: Math.max(result.maxLng, point.lng),
}), { minLat: Infinity, maxLat: -Infinity, minLng: Infinity, maxLng: -Infinity })

const plot = (point: GeoPoint) => ({
  x: PAD_X + (point.lng - bounds.minLng) / (bounds.maxLng - bounds.minLng) * (WIDTH - PAD_X * 2),
  y: HEIGHT - PAD_Y - (point.lat - bounds.minLat) / (bounds.maxLat - bounds.minLat) * (HEIGHT - PAD_Y * 2),
})

const polyline = (points: GeoPoint[]) => points.map((point) => {
  const plotted = plot(point)
  return `${plotted.x.toFixed(1)},${plotted.y.toFixed(1)}`
}).join(' ')

export function YehliuSchematicMap({ routeId, selectedStop, visited, skipped = [], onSelectStop }: YehliuSchematicMapProps) {
  const definition = yehliuRouteDefinitions[routeId]
  const activeStops = definition.stopIds.map((id) => yehliuStops.find((stop) => stop.id === id)!).filter(Boolean)
  const outbound = definition.path.slice(0, definition.returnPathStartIndex + 1)
  const returning = definition.path.slice(definition.returnPathStartIndex)

  const handleKeyDown = (event: KeyboardEvent<SVGGElement>, stopId: YehliuStopId) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    onSelectStop(stopId)
  }

  return (
    <div className="yehliu-map-shell">
      <svg className="yehliu-map" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="group" aria-label={`예류 ${routeId} 코스 실좌표 기반 개략 동선. 번호를 누르면 해당 해설로 이동합니다.`}>
        <defs>
          <linearGradient id="yehliu-sea" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#dceef0" />
            <stop offset="1" stopColor="#a9cfd2" />
          </linearGradient>
          <linearGradient id="yehliu-land" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f4e6c4" />
            <stop offset="1" stopColor="#c9d3aa" />
          </linearGradient>
          <filter id="yehliu-shadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#133f48" floodOpacity=".22" />
          </filter>
        </defs>

        <rect width={WIDTH} height={HEIGHT} rx="28" fill="url(#yehliu-sea)" />
        <path className="yehliu-map__grid" d="M0 76H780M0 152H780M0 228H780M0 304H780M130 0V380M260 0V380M390 0V380M520 0V380M650 0V380" />
        <path className="yehliu-map__peninsula" d="M35 352C70 304 104 282 148 250c74-54 86-132 170-153 76-20 124 45 185 6 68-44 102-68 168-47 64 20 91 85 74 154-19 76-93 124-172 143Z" fill="url(#yehliu-land)" />
        <text className="yehliu-map__water-label" x="34" y="42">YEHLIU · REAL ROUTE SHAPE</text>

        <polyline className="yehliu-map__route-shadow" points={polyline(definition.path)} />
        <polyline className={`yehliu-map__route yehliu-map__route--${routeId}`} points={polyline(outbound)} />
        <polyline className="yehliu-map__route yehliu-map__route--return" points={polyline(returning)} />
        <text className="yehliu-map__return-label" x="116" y="318">복귀 동선</text>

        {yehliuGpsFacilities.map((facility) => {
          const point = plot(facility)
          return <g className="yehliu-map__facility" transform={`translate(${point.x} ${point.y})`} aria-label={facility.nameKo} key={facility.id}><rect x="-23" y="-12" width="46" height="24" rx="12" /><text y="5">WC</text></g>
        })}

        {activeStops.map((stop, index) => {
          const point = plot(stop)
          const isSelected = selectedStop === stop.id
          const isVisited = visited.includes(stop.id)
          const isSkipped = skipped.includes(stop.id)
          return (
            <g
              className={`yehliu-map__marker is-route-stop ${isSelected ? 'is-selected' : ''} ${isVisited ? 'is-visited' : ''} ${isSkipped ? 'is-skipped' : ''}`}
              key={stop.id}
              role="button"
              tabIndex={0}
              aria-label={`${index + 1}번 ${stop.title}${isVisited ? ', 관찰 완료' : ''}${isSkipped ? ', 건너뜀' : ''}`}
              aria-pressed={isSelected}
              onClick={() => onSelectStop(stop.id)}
              onKeyDown={(event) => handleKeyDown(event, stop.id)}
              transform={`translate(${point.x} ${point.y})`}
            >
              <circle r={isSelected ? 23 : 19} filter="url(#yehliu-shadow)" />
              {isVisited ? <path className="yehliu-map__marker-check" d="m-8 0 5 5 11-13" /> : <text y="6">{index + 1}</text>}
            </g>
          )
        })}
      </svg>
      <div className="yehliu-map-legend" aria-label="지도 범례">
        <span><i className="is-route" />관찰 동선</span>
        <span><i className="is-return" />차량 복귀</span>
        <span><i className="is-selected" />현재 해설</span>
        <span><i className="is-toilet">WC</i>화장실</span>
      </div>
      <p className="yehliu-map-note">실좌표 관계를 단순화한 자체 제작 개략도입니다. 해안선·통제구역·보행 판단은 현장 공식 지도와 직원 안내가 우선입니다.</p>
    </div>
  )
}
