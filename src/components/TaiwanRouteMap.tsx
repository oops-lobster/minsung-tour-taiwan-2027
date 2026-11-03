import { useEffect, useRef, useState } from 'react'
import { placeCatalog } from '../data/localTools'
import { googleMapsPlaceUrl } from '../lib/paths'
import { buildRouteMapLayout, ROUTE_MAP_HEIGHT, ROUTE_MAP_WIDTH, ROUTE_MAP_ZOOM } from '../lib/taiwanRouteMap'
import '../styles/views/taiwan-route-map.css'

const mapSourceUrl = 'https://commons.wikimedia.org/wiki/File:Taiwan_mainland_curve.svg'
const mapImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Taiwan_mainland_curve.svg'

const routeStops = [
  { no: '01', placeId: 'taoyuan-t2', label: '타오위안공항', sub: 'TPE · 여행의 시작', labelY: 47 },
  { no: '02', placeId: 'hotel', label: '타이베이', sub: 'Taipei Garden Hotel · 여행의 베이스', labelY: 47 },
  { no: '03', placeId: 'yehliu', label: '예류', sub: 'DAY 2 · 북해안', labelY: -34 },
  { no: '04', placeId: 'shifen-old-street', label: '스펀', sub: '옛거리 기준 · 폭포는 인근', labelY: 47 },
  { no: '05', placeId: 'jiufen', label: '지우펀', sub: '산성 마을 · 저녁', labelY: -34 },
] as const

// Reuse the exact coordinates used by the itinerary's Google Maps buttons.
const mapLayout = buildRouteMapLayout(routeStops.map((stop) => placeCatalog[stop.placeId]))
const mapStops = routeStops.map((stop, index) => ({ ...stop, point: mapLayout.points[index], place: placeCatalog[stop.placeId] }))

const dayRoutes = [
  { day: 'DAY 1', title: '타이베이 도심', copy: '호텔 · My灶 · 용산사 · 시먼딩' },
  { day: 'DAY 2', title: '북해안 루트', copy: '예류 · 귀후어항 · 스펀 · 지우펀' },
  { day: 'DAY 3', title: '타이베이 동부', copy: '고궁 · 용캉제 · 신이 · 101' },
  { day: 'DAY 4', title: '마지막 반나절', copy: '식물원 · 비전옥 · 타오위안공항' },
]

export function TaiwanRouteMap() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [showTiles, setShowTiles] = useState(false)
  const [tileError, setTileError] = useState(false)

  // Only request the visible viewport, not off-screen tiles or offline packs.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (!('IntersectionObserver' in window)) {
      setShowTiles(true)
      return
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setShowTiles(true)
        observer.disconnect()
      }
    })
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="taiwan-route section-pad" aria-labelledby="taiwan-route-title">
      <div className="page-shell">
        <div className="taiwan-route__heading">
          <div>
            <span className="section-header__eyebrow">OUR ROUTE IN TAIWAN</span>
            <h2 id="taiwan-route-title">대만 북부에서 보내는 네 날</h2>
          </div>
          <p>북부를 확대해 다섯 거점의 실제 위치를 표시했습니다. 핀을 누르면 해당 장소의 Google 지도가 열립니다.</p>
        </div>

        <div className="taiwan-route__layout">
          <figure className="taiwan-route__map-card">
            <div className="taiwan-route__geo-heading">
              <div>
                <small>TAIWAN · NORTH</small>
                <strong>우리 여행의 다섯 거점</strong>
                <p>북부 확대 · 위도와 경도 기준</p>
              </div>
              <div className="taiwan-route__geo-overview">
                <img src={mapImageUrl} alt="대만 본섬 전체 윤곽" width="40" height="76" loading="lazy" decoding="async" />
                <span>대만 전체</span>
              </div>
            </div>

            <div className="taiwan-route__geo-canvas" ref={canvasRef}>
              <svg className="taiwan-route__geo-svg" viewBox={`0 0 ${ROUTE_MAP_WIDTH} ${ROUTE_MAP_HEIGHT}`} width={ROUTE_MAP_WIDTH} height={ROUTE_MAP_HEIGHT} role="group" aria-labelledby="taiwan-route-map-label taiwan-route-map-description">
                <title id="taiwan-route-map-label">대만 북부 여행 지도</title>
                <desc id="taiwan-route-map-description">1 타오위안공항, 2 타이베이 가든 호텔, 3 예류, 4 스펀 옛거리, 5 지우펀. 핀과 배경은 같은 지도 좌표를 사용합니다. 점선은 방문 순서이며 실제 도로가 아닙니다.</desc>
                <rect width={ROUTE_MAP_WIDTH} height={ROUTE_MAP_HEIGHT} fill="#e8eeea" />
                {showTiles && !tileError && (
                  <g className="taiwan-route__geo-tiles" aria-hidden="true">
                    {mapLayout.tiles.map((tile) => (
                      <image key={`${tile.column}-${tile.row}`} href={`https://tile.openstreetmap.org/${ROUTE_MAP_ZOOM}/${tile.column}/${tile.row}.png`} x={tile.x} y={tile.y} width={tile.size} height={tile.size} preserveAspectRatio="none" onError={() => setTileError(true)} />
                    ))}
                  </g>
                )}
                <polyline className="taiwan-route__geo-route-halo" points={mapLayout.routePoints} aria-hidden="true" />
                <polyline className="taiwan-route__geo-route" points={mapLayout.routePoints} aria-hidden="true" />
                {mapStops.map((stop, index) => (
                  <a className={`taiwan-route__geo-stop${index > 1 ? ' is-day2' : ''}`} key={stop.no} href={googleMapsPlaceUrl(stop.place.latitude, stop.place.longitude, stop.place.localName)} target="_blank" rel="noreferrer" aria-label={`${stop.no} ${stop.label} 위치를 Google 지도에서 새 탭으로 열기`}>
                    <title>{stop.label} · {stop.sub}</title>
                    <g transform={`translate(${stop.point.x} ${stop.point.y})`}>
                      <circle className="taiwan-route__geo-focus-ring" r="26" />
                      <circle className="taiwan-route__geo-stop-circle" r="20" />
                      <text className="taiwan-route__geo-stop-number" y="0">{index + 1}</text>
                      <text className="taiwan-route__geo-stop-label" y={stop.labelY}>{stop.label}</text>
                    </g>
                  </a>
                ))}
                <g className="taiwan-route__geo-north" transform="translate(604 38)" aria-hidden="true">
                  <rect x="-20" y="-24" width="40" height="68" rx="18" fill="#fffaf0" opacity=".92" />
                  <path d="M0 -13 L7 8 L0 3 L-7 8 Z" />
                  <text y="31">N</text>
                </g>
              </svg>
              <small className="taiwan-route__geo-attribution">© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a></small>
            </div>
            <p className="taiwan-route__geo-note">
              번호는 방문 순서, 점선은 거점 사이의 연결입니다. 실제 도로 경로는 각 핀의 Google 지도에서 확인해 주세요.
              {tileError && <span className="taiwan-route__geo-warning" role="status">배경 지도를 불러오지 못했습니다. 핀의 실제 위치와 지도 링크는 유지됩니다.</span>}
            </p>
            <figcaption>
              <span>TAIWAN · NORTH</span>
              <small>작은 대만 윤곽: Wikimedia Commons · CC BY-SA 4.0</small>
              <a href={mapSourceUrl} target="_blank" rel="noreferrer">윤곽 원본</a>
            </figcaption>
          </figure>

          <div className="taiwan-route__story">
            <ol className="taiwan-route__stops">
              {mapStops.map((stop) => (
                <li key={stop.no}>
                  <span>{stop.no}</span>
                  <a className="taiwan-route__geo-list-link" href={googleMapsPlaceUrl(stop.place.latitude, stop.place.longitude, stop.place.localName)} target="_blank" rel="noreferrer" aria-label={`${stop.label} 위치를 Google 지도에서 새 탭으로 열기`}>
                    <strong>{stop.label}</strong>
                    <small>{stop.sub}</small>
                  </a>
                </li>
              ))}
            </ol>
            <div className="taiwan-route__days" aria-label="날짜별 여행 지역">
              {dayRoutes.map((route) => (
                <a href={`#schedule/day-${Number(route.day.replace('DAY ', ''))}`} key={route.day}>
                  <span>{route.day}</span>
                  <strong>{route.title}</strong>
                  <small>{route.copy}</small>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
