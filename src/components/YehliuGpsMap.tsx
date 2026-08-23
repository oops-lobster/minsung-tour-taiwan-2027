import { useMemo, useState, type KeyboardEvent } from 'react'
import { Crosshair, Map, MapPin } from 'lucide-react'
import { yehliuGpsFacilities, yehliuRouteDefinitions, type GeoPoint } from '../data/yehliuGpsRoute'
import { yehliuStops, type YehliuRouteId, type YehliuStopId } from '../data/yehliuGuide'
import type { SavedMeetingPoint } from '../lib/useYehliuFieldSession'
import type { YehliuGpsPosition } from '../lib/useYehliuGeolocation'

interface YehliuGpsMapProps {
  routeId: YehliuRouteId
  position: YehliuGpsPosition | null
  meetingPoint?: SavedMeetingPoint
  nextStopId: YehliuStopId
  visited: YehliuStopId[]
  skipped: YehliuStopId[]
  onlineTiles: boolean
  onSelectStop: (stopId: YehliuStopId) => void
  large?: boolean
}

type MapView = 'route' | 'current' | 'meeting'
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

const boundsFor = (points: Array<{ x: number; y: number }>, padding = 58) => {
  const bounds = points.reduce((result, point) => ({
    minX: Math.min(result.minX, point.x), minY: Math.min(result.minY, point.y),
    maxX: Math.max(result.maxX, point.x), maxY: Math.max(result.maxY, point.y),
  }), { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity })
  return { x: bounds.minX - padding, y: bounds.minY - padding, width: bounds.maxX - bounds.minX + padding * 2, height: bounds.maxY - bounds.minY + padding * 2 }
}

const pointView = (point: { x: number; y: number }) => ({ x: point.x - 150, y: point.y - 105, width: 300, height: 210 })
const metersPerPixel = (latitude: number) => Math.cos(latitude * Math.PI / 180) * 2 * Math.PI * 6_378_137 / WORLD_SIZE

export function YehliuGpsMap({ routeId, position, meetingPoint, nextStopId, visited, skipped, onlineTiles, onSelectStop, large = false }: YehliuGpsMapProps) {
  const [mapView, setMapView] = useState<MapView>('route')
  const definition = yehliuRouteDefinitions[routeId]
  const activeStops = definition.stopIds.map((id) => yehliuStops.find((stop) => stop.id === id)!).filter(Boolean)
  const routeWorld = useMemo(() => definition.path.map(toWorldPoint), [definition.path])
  const currentWorld = position ? toWorldPoint(position) : null
  const meetingWorld = meetingPoint ? toWorldPoint(meetingPoint) : null
  const routeViewBox = useMemo(() => boundsFor(routeWorld), [routeWorld])
  const viewBox = mapView === 'current' && currentWorld ? pointView(currentWorld) : mapView === 'meeting' && meetingWorld ? pointView(meetingWorld) : routeViewBox
  const accuracyRadius = position ? Math.min(90, Math.max(8, position.accuracy / metersPerPixel(position.lat))) : 0
  const routePoints = routeWorld.map((point) => `${point.x},${point.y}`).join(' ')
  const tiles = useMemo(() => {
    const result: Array<{ x: number; y: number }> = []
    for (let x = Math.floor(viewBox.x / TILE_SIZE); x <= Math.floor((viewBox.x + viewBox.width) / TILE_SIZE); x += 1) {
      for (let y = Math.floor(viewBox.y / TILE_SIZE); y <= Math.floor((viewBox.y + viewBox.height) / TILE_SIZE); y += 1) result.push({ x, y })
    }
    return result
  }, [viewBox.height, viewBox.width, viewBox.x, viewBox.y])

  const handleKeyDown = (event: KeyboardEvent<SVGGElement>, stopId: YehliuStopId) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    onSelectStop(stopId)
  }

  return (
    <div className={`yehliu-gps-map-shell ${large ? 'is-large' : ''}`}>
      <div className="yehliu-gps-map__view-controls" aria-label="지도 보기 범위">
        <button type="button" className={mapView === 'route' ? 'is-active' : ''} onClick={() => setMapView('route')}><Map aria-hidden="true" />전체 동선</button>
        <button type="button" className={mapView === 'current' ? 'is-active' : ''} onClick={() => setMapView('current')} disabled={!currentWorld}><Crosshair aria-hidden="true" />내 위치</button>
        <button type="button" className={mapView === 'meeting' ? 'is-active' : ''} onClick={() => setMapView('meeting')} disabled={!meetingWorld}><MapPin aria-hidden="true" />합류점</button>
      </div>
      <div className="yehliu-gps-map-stage" style={{ aspectRatio: `${viewBox.width} / ${viewBox.height}` }}>
        {onlineTiles && <div className="yehliu-gps-map__html-tiles" aria-hidden="true">
          {tiles.map((tile) => <img src={`https://tile.openstreetmap.org/${ZOOM}/${tile.x}/${tile.y}.png`} alt="" loading="eager" referrerPolicy="strict-origin-when-cross-origin" style={{ left: `${(tile.x * TILE_SIZE - viewBox.x) / viewBox.width * 100}%`, top: `${(tile.y * TILE_SIZE - viewBox.y) / viewBox.height * 100}%`, width: `${TILE_SIZE / viewBox.width * 100}%`, height: `${TILE_SIZE / viewBox.height * 100}%` }} key={`${tile.x}-${tile.y}`} />)}
          <span />
        </div>}
        <svg className="yehliu-gps-map" viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`} role="group" aria-label={`실제 위도와 경도를 사용한 예류 ${routeId} 코스 지도. 현재 위치, 다음 지점과 차량 합류점을 표시합니다.`}>
          <defs>
            <pattern id="gps-grid" width="64" height="64" patternUnits="userSpaceOnUse"><path d="M64 0H0V64" fill="none" stroke="rgba(35,96,105,.1)" strokeWidth="1" /></pattern>
            <filter id="gps-dot-shadow" x="-100%" y="-100%" width="300%" height="300%"><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#082f49" floodOpacity=".28" /></filter>
          </defs>
          <rect x={viewBox.x} y={viewBox.y} width={viewBox.width} height={viewBox.height} fill={onlineTiles ? 'transparent' : '#dcecef'} />
          {!onlineTiles && <g aria-hidden="true"><rect x={viewBox.x} y={viewBox.y} width={viewBox.width} height={viewBox.height} fill="url(#gps-grid)" /><rect className="yehliu-gps-map__offline-ground" x={viewBox.x} y={viewBox.y} width={viewBox.width} height={viewBox.height} /><polyline className="yehliu-gps-map__walkway" points={routePoints} /></g>}
          <polyline className="yehliu-gps-map__route-shadow" points={routePoints} />
          <polyline className="yehliu-gps-map__route" points={routePoints} />

          {yehliuGpsFacilities.map((facility) => {
            const point = toWorldPoint(facility)
            return <g className="yehliu-gps-map__toilet" transform={`translate(${point.x} ${point.y})`} key={facility.id} aria-label={facility.nameKo}><rect x="-13" y="-10" width="26" height="20" rx="8" /><text y="4">WC</text></g>
          })}

          {activeStops.map((stop, index) => {
            const point = toWorldPoint(stop)
            const isNext = stop.id === nextStopId
            const isVisited = visited.includes(stop.id)
            const isSkipped = skipped.includes(stop.id)
            return <g className={`yehliu-gps-map__stop ${isNext ? 'is-next' : ''} ${isVisited ? 'is-visited' : ''} ${isSkipped ? 'is-skipped' : ''} ${!stop.autoArrival ? 'is-approximate' : ''}`} transform={`translate(${point.x} ${point.y})`} role="button" tabIndex={0} aria-label={`${index + 1}번 ${stop.title}${isNext ? ', 다음 포인트' : ''}${isVisited ? ', 완료' : ''}${!stop.autoArrival ? ', 위치 근사' : ''}`} aria-pressed={isNext} onClick={() => onSelectStop(stop.id)} onKeyDown={(event) => handleKeyDown(event, stop.id)} key={stop.id}>
              {isNext && <circle className="yehliu-gps-map__next-ring" r="18" />}<circle className="yehliu-gps-map__stop-dot" r="9" /><text className="yehliu-gps-map__stop-number" y="3">{isVisited ? '✓' : index + 1}</text>{isNext && <text className="yehliu-gps-map__stop-label" x="14" y="-12">다음 · {stop.title}</text>}
            </g>
          })}

          {meetingWorld && <g className="yehliu-gps-map__meeting" transform={`translate(${meetingWorld.x} ${meetingWorld.y})`} aria-label="저장한 차량 합류점"><path d="M0-14C-8-14-13-8-13-1c0 10 13 22 13 22S13 9 13-1C13-8 8-14 0-14Z" /><circle cy="-2" r="4" /><text x="16" y="3">차량 합류점</text></g>}
          {currentWorld && <g className="yehliu-gps-map__current" transform={`translate(${currentWorld.x} ${currentWorld.y})`} aria-label={`내 위치, 정확도 약 ${Math.round(position?.accuracy ?? 0)}미터`}><circle className="yehliu-gps-map__accuracy" r={accuracyRadius} /><circle className="yehliu-gps-map__current-ring" r="12" /><circle className="yehliu-gps-map__current-dot" r="7" filter="url(#gps-dot-shadow)" /></g>}
          <g className="yehliu-gps-map__north" transform={`translate(${viewBox.x + viewBox.width - 28} ${viewBox.y + 34})`} aria-label="북쪽"><path d="M0-18 9 8 0 3-9 8Z" /><text y="23">N</text></g>
        </svg>
      </div>
      <div className="yehliu-gps-map__legend"><span><i className="is-current" />내 위치</span><span><i className="is-next" />다음 포인트</span><span><i className="is-meeting" />차량 합류점</span><span><i className="is-toilet">WC</i>화장실</span></div>
      {onlineTiles ? <p className="yehliu-gps-map__attribution">지도 배경 © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a> · ODbL</p> : <p className="yehliu-gps-map__attribution">오프라인 실좌표 보행 동선 · 배경은 해안선이 아닌 현장용 개략도입니다.</p>}
    </div>
  )
}
