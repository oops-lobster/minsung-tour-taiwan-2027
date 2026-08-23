import type { KeyboardEvent } from 'react'
import { yehliuGpsFacilities, yehliuGpsRoute, yehliuGpsStops, type GeoPoint } from '../data/yehliuGpsRoute'
import type { YehliuRouteId } from '../data/yehliuGuide'
import type { YehliuGpsPosition } from '../lib/useYehliuGeolocation'

interface YehliuGpsMapProps {
  routeId: YehliuRouteId
  position: YehliuGpsPosition | null
  nextStopId: string
  visited: string[]
  skipped: string[]
  onlineTiles: boolean
  onSelectStop: (stopId: string) => void
  large?: boolean
}

const ZOOM = 17
const TILE_SIZE = 256
const WORLD_SIZE = TILE_SIZE * 2 ** ZOOM

const toWorldPoint = ({ lat, lng }: GeoPoint) => {
  const sine = Math.sin(lat * Math.PI / 180)
  return {
    x: (lng + 180) / 360 * WORLD_SIZE,
    y: (0.5 - Math.log((1 + sine) / (1 - sine)) / (4 * Math.PI)) * WORLD_SIZE,
  }
}

const routeWorld = yehliuGpsRoute.map(toWorldPoint)
const routeBounds = routeWorld.reduce((bounds, point) => ({
  minX: Math.min(bounds.minX, point.x),
  minY: Math.min(bounds.minY, point.y),
  maxX: Math.max(bounds.maxX, point.x),
  maxY: Math.max(bounds.maxY, point.y),
}), { minX: Number.POSITIVE_INFINITY, minY: Number.POSITIVE_INFINITY, maxX: Number.NEGATIVE_INFINITY, maxY: Number.NEGATIVE_INFINITY })

const padding = 58
const viewBox = {
  x: routeBounds.minX - padding,
  y: routeBounds.minY - padding,
  width: routeBounds.maxX - routeBounds.minX + padding * 2,
  height: routeBounds.maxY - routeBounds.minY + padding * 2,
}

const tileCoordinates = (() => {
  const tiles: Array<{ x: number; y: number }> = []
  const startX = Math.floor(viewBox.x / TILE_SIZE)
  const endX = Math.floor((viewBox.x + viewBox.width) / TILE_SIZE)
  const startY = Math.floor(viewBox.y / TILE_SIZE)
  const endY = Math.floor((viewBox.y + viewBox.height) / TILE_SIZE)
  for (let x = startX; x <= endX; x += 1) {
    for (let y = startY; y <= endY; y += 1) tiles.push({ x, y })
  }
  return tiles
})()

const metersPerPixel = (latitude: number) => Math.cos(latitude * Math.PI / 180) * 2 * Math.PI * 6_378_137 / WORLD_SIZE

export function YehliuGpsMap({ routeId, position, nextStopId, visited, skipped, onlineTiles, onSelectStop, large = false }: YehliuGpsMapProps) {
  const activeStops = yehliuGpsStops.filter((stop) => stop.routeIds.includes(routeId))
  const currentWorld = position ? toWorldPoint(position) : null
  const accuracyRadius = position ? Math.min(90, Math.max(8, position.accuracy / metersPerPixel(position.lat))) : 0
  const routePoints = routeWorld.map((point) => `${point.x},${point.y}`).join(' ')

  const handleKeyDown = (event: KeyboardEvent<SVGGElement>, stopId: string) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    onSelectStop(stopId)
  }

  return (
    <div className={`yehliu-gps-map-shell ${large ? 'is-large' : ''}`}>
      <div className="yehliu-gps-map-stage" style={{ aspectRatio: `${viewBox.width} / ${viewBox.height}` }}>
        {onlineTiles && (
          <div className="yehliu-gps-map__html-tiles" aria-hidden="true">
            {tileCoordinates.map((tile) => (
              <img
                src={`https://tile.openstreetmap.org/${ZOOM}/${tile.x}/${tile.y}.png`}
                alt=""
                loading="eager"
                referrerPolicy="strict-origin-when-cross-origin"
                style={{
                  left: `${(tile.x * TILE_SIZE - viewBox.x) / viewBox.width * 100}%`,
                  top: `${(tile.y * TILE_SIZE - viewBox.y) / viewBox.height * 100}%`,
                  width: `${TILE_SIZE / viewBox.width * 100}%`,
                  height: `${TILE_SIZE / viewBox.height * 100}%`,
                }}
                key={`${tile.x}-${tile.y}`}
              />
            ))}
            <span />
          </div>
        )}
        <svg
          className="yehliu-gps-map"
          viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
          role="group"
          aria-label={`실제 위도와 경도를 사용한 예류 ${routeId} 코스 지도. 현재 위치와 다음 지점을 표시합니다.`}
        >
        <defs>
          <pattern id="gps-grid" width="64" height="64" patternUnits="userSpaceOnUse">
            <path d="M64 0H0V64" fill="none" stroke="rgba(35,96,105,.1)" strokeWidth="1" />
          </pattern>
          <filter id="gps-dot-shadow" x="-100%" y="-100%" width="300%" height="300%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#082f49" floodOpacity=".28" />
          </filter>
        </defs>

        <rect x={viewBox.x} y={viewBox.y} width={viewBox.width} height={viewBox.height} fill={onlineTiles ? 'transparent' : '#dcecef'} />
        {!onlineTiles && (
          <g aria-hidden="true">
            <rect x={viewBox.x} y={viewBox.y} width={viewBox.width} height={viewBox.height} fill="url(#gps-grid)" />
            <rect className="yehliu-gps-map__offline-ground" x={viewBox.x} y={viewBox.y} width={viewBox.width} height={viewBox.height} />
            <polyline className="yehliu-gps-map__walkway" points={routePoints} />
          </g>
        )}

        <polyline className="yehliu-gps-map__route-shadow" points={routePoints} />
        <polyline className="yehliu-gps-map__route" points={routePoints} />

        {yehliuGpsFacilities.map((facility) => {
          const point = toWorldPoint(facility)
          return (
            <g className="yehliu-gps-map__toilet" transform={`translate(${point.x} ${point.y})`} key={facility.id} aria-label={facility.nameKo}>
              <rect x="-13" y="-10" width="26" height="20" rx="8" />
              <text y="4">WC</text>
            </g>
          )
        })}

        {activeStops.map((stop) => {
          const point = toWorldPoint(stop)
          const isNext = stop.id === nextStopId
          const isVisited = visited.includes(stop.id)
          const isSkipped = skipped.includes(stop.id)
          return (
            <g
              className={`yehliu-gps-map__stop ${isNext ? 'is-next' : ''} ${isVisited ? 'is-visited' : ''} ${isSkipped ? 'is-skipped' : ''} ${stop.approximate ? 'is-approximate' : ''}`}
              transform={`translate(${point.x} ${point.y})`}
              role="button"
              tabIndex={0}
              aria-label={`${stop.order + 1}번 ${stop.nameKo}${isNext ? ', 다음 포인트' : ''}${isVisited ? ', 방문 완료' : ''}${stop.approximate ? ', 위치 근사' : ''}`}
              aria-pressed={isNext}
              onClick={() => onSelectStop(stop.id)}
              onKeyDown={(event) => handleKeyDown(event, stop.id)}
              key={stop.id}
            >
              {isNext && <circle className="yehliu-gps-map__next-ring" r="18" />}
              <circle className="yehliu-gps-map__stop-dot" r="9" />
              <text className="yehliu-gps-map__stop-number" y="3">{isVisited ? '✓' : stop.order + 1}</text>
            </g>
          )
        })}

        {currentWorld && (
          <g className="yehliu-gps-map__current" transform={`translate(${currentWorld.x} ${currentWorld.y})`} aria-label={`내 위치, 정확도 약 ${Math.round(position?.accuracy ?? 0)}미터`}>
            <circle className="yehliu-gps-map__accuracy" r={accuracyRadius} />
            <circle className="yehliu-gps-map__current-ring" r="12" />
            <circle className="yehliu-gps-map__current-dot" r="7" filter="url(#gps-dot-shadow)" />
          </g>
        )}

        <g className="yehliu-gps-map__north" transform={`translate(${viewBox.x + viewBox.width - 28} ${viewBox.y + 34})`} aria-label="북쪽">
          <path d="M0-18 9 8 0 3-9 8Z" />
          <text y="23">N</text>
        </g>
        </svg>
      </div>

      <div className="yehliu-gps-map__legend">
        <span><i className="is-current" />내 위치</span>
        <span><i className="is-next" />다음 포인트</span>
        <span><i className="is-visited" />완료</span>
        <span><i className="is-toilet">WC</i>화장실</span>
      </div>
      {onlineTiles ? (
        <p className="yehliu-gps-map__attribution">지도 배경 © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a> · ODbL</p>
      ) : (
        <p className="yehliu-gps-map__attribution">오프라인 실좌표 보행 동선 · 배경은 해안선이 아닌 현장용 개략도입니다.</p>
      )}
    </div>
  )
}
