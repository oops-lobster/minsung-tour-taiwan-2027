import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertTriangle,
  BatteryMedium,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleStop,
  Clock3,
  Map,
  MapPinned,
  Maximize2,
  Navigation,
  Play,
  RotateCcw,
  ShieldAlert,
  Signal,
  Toilet,
  X,
} from 'lucide-react'
import {
  yehliuGpsFacilities,
  yehliuGpsRoute,
  yehliuGpsSources,
  yehliuGpsStops,
  type YehliuGpsStop,
} from '../data/yehliuGpsRoute'
import type { YehliuRouteId } from '../data/yehliuGuide'
import {
  bearingDegrees,
  bearingLabel,
  distanceToRoute,
  formatDistance,
  gpsSignal,
  hasArrived,
  haversineMeters,
  routeDeviation,
  routeDistanceToIndex,
  walkingMinutes,
} from '../lib/yehliuGps'
import { useYehliuGeolocation } from '../lib/useYehliuGeolocation'
import { YehliuGpsMap } from './YehliuGpsMap'

type NavigatorDisplay = 'launch' | 'full' | 'hidden'
type WalkingPace = 'relaxed' | 'normal'

interface YehliuGpsNavigatorProps {
  routeId: YehliuRouteId
  display: NavigatorDisplay
  onOpenGps: () => void
  onOpenGuide: (guideStopId: number) => void
  onMarkGuideVisited: (guideStopId: number) => void
}

const gpsVisitedKey = 'minsung-yehliu-gps-visited-v1'
const gpsSkippedKey = 'minsung-yehliu-gps-skipped-v1'
const returnTimeKey = 'minsung-yehliu-return-time-v1'
const walkingPaceKey = 'minsung-yehliu-walking-pace-v1'

const readStringArray = (key: string) => {
  try {
    const saved = JSON.parse(window.localStorage.getItem(key) ?? '[]')
    return Array.isArray(saved) ? saved.filter((value): value is string => typeof value === 'string') : []
  } catch {
    return []
  }
}

const addMinutesToTime = (time: string, minutes: number) => {
  const [hour, minute] = time.split(':').map(Number)
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return '10:50'
  const total = (hour * 60 + minute + minutes + 1_440) % 1_440
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

const nearestStop = (position: { lat: number; lng: number }, stops: YehliuGpsStop[]) => stops.reduce<{ stop: YehliuGpsStop; distance: number } | null>((nearest, stop) => {
  const distance = haversineMeters(position, stop)
  return !nearest || distance < nearest.distance ? { stop, distance } : nearest
}, null)

export function YehliuGpsNavigator({ routeId, display, onOpenGps, onOpenGuide, onMarkGuideVisited }: YehliuGpsNavigatorProps) {
  const mockEnabled = import.meta.env.DEV && new URLSearchParams(window.location.search).get('gpsMock') === '1'
  const gps = useYehliuGeolocation(mockEnabled)
  const [visited, setVisited] = useState<string[]>(() => readStringArray(gpsVisitedKey))
  const [skipped, setSkipped] = useState<string[]>(() => readStringArray(gpsSkippedKey))
  const [selectedStopId, setSelectedStopId] = useState('visitor-center')
  const [arrivalStopId, setArrivalStopId] = useState('')
  const [showRestroom, setShowRestroom] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [online, setOnline] = useState(() => navigator.onLine)
  const [onlineTiles, setOnlineTiles] = useState(() => navigator.onLine)
  const [walkingPace, setWalkingPace] = useState<WalkingPace>(() => window.localStorage.getItem(walkingPaceKey) === 'normal' ? 'normal' : 'relaxed')
  const [returnTime, setReturnTime] = useState(() => window.localStorage.getItem(returnTimeKey) ?? '10:45')
  const [clock, setClock] = useState(() => Date.now())
  const [mockRouteIndex, setMockRouteIndex] = useState(0)
  const fullscreenBackRef = useRef<HTMLButtonElement>(null)

  const activeStops = useMemo(() => yehliuGpsStops.filter((stop) => stop.routeIds.includes(routeId)), [routeId])
  const selectedIndex = Math.max(0, activeStops.findIndex((stop) => stop.id === selectedStopId))
  const selectedStop = activeStops[selectedIndex] ?? activeStops[0]
  const visitedInRoute = activeStops.filter((stop) => visited.includes(stop.id)).length
  const progress = Math.round(visitedInRoute / activeStops.length * 100)

  useEffect(() => {
    if (activeStops.some((stop) => stop.id === selectedStopId)) return
    const next = activeStops.find((stop) => !visited.includes(stop.id) && !skipped.includes(stop.id)) ?? activeStops[0]
    setSelectedStopId(next.id)
  }, [activeStops, selectedStopId, skipped, visited])

  useEffect(() => window.localStorage.setItem(gpsVisitedKey, JSON.stringify(visited)), [visited])
  useEffect(() => window.localStorage.setItem(gpsSkippedKey, JSON.stringify(skipped)), [skipped])
  useEffect(() => window.localStorage.setItem(returnTimeKey, returnTime), [returnTime])
  useEffect(() => window.localStorage.setItem(walkingPaceKey, walkingPace), [walkingPace])

  useEffect(() => {
    const handleOnline = () => setOnline(true)
    const handleOffline = () => {
      setOnline(false)
      setOnlineTiles(false)
    }
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    if (!gps.active && display !== 'full') return
    const timer = window.setInterval(() => setClock(Date.now()), 30_000)
    return () => window.clearInterval(timer)
  }, [display, gps.active])

  useEffect(() => {
    if (!fullscreen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    fullscreenBackRef.current?.focus()
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setFullscreen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [fullscreen])

  const previousStop = activeStops[Math.max(0, selectedIndex - 1)]
  const routeMetric = gps.position
    ? routeDistanceToIndex(gps.position, yehliuGpsRoute, selectedStop.routePointIndex, selectedIndex > 0 ? previousStop.routePointIndex : 0)
    : null
  const directDistance = gps.position ? haversineMeters(gps.position, selectedStop) : Number.POSITIVE_INFINITY
  const remainingDistance = routeMetric?.distanceMeters ?? directDistance
  const direction = gps.position ? bearingLabel(bearingDegrees(gps.position, selectedStop)) : null
  const walkingSpeed = walkingPace === 'relaxed' ? 3 : 3.5
  const walkMinutes = walkingMinutes(remainingDistance, walkingSpeed)
  const signal = gps.position ? gpsSignal(gps.position.accuracy) : null
  const routeGap = gps.position ? distanceToRoute(gps.position, yehliuGpsRoute) : 0
  const deviation = gps.position ? routeDeviation(routeGap, gps.position.accuracy) : 'on-route'
  const closest = gps.position
    ? yehliuGpsFacilities.reduce<{ facility: typeof yehliuGpsFacilities[number]; distance: number } | null>((nearest, facility) => {
      const distance = haversineMeters(gps.position!, facility)
      return !nearest || distance < nearest.distance ? { facility, distance } : nearest
    }, null)
    : null
  const currentNearest = gps.position ? nearestStop(gps.position, activeStops) : null

  useEffect(() => {
    if (!gps.position || arrivalStopId === selectedStop.id) return
    if (hasArrived(directDistance, selectedStop.arrivalRadiusMeters, gps.position.accuracy)) setArrivalStopId(selectedStop.id)
  }, [arrivalStopId, directDistance, gps.position, selectedStop])

  const chooseNextUnhandled = (fromIndex: number) => {
    const next = activeStops.slice(fromIndex + 1).find((stop) => !visited.includes(stop.id) && !skipped.includes(stop.id))
      ?? activeStops.find((stop) => !visited.includes(stop.id) && !skipped.includes(stop.id))
      ?? activeStops[activeStops.length - 1]
    setSelectedStopId(next.id)
    setArrivalStopId('')
  }

  const markVisited = () => {
    setVisited((current) => current.includes(selectedStop.id) ? current : [...current, selectedStop.id])
    setSkipped((current) => current.filter((id) => id !== selectedStop.id))
    onMarkGuideVisited(selectedStop.guideStopId)
    chooseNextUnhandled(selectedIndex)
  }

  const skipStop = () => {
    setSkipped((current) => current.includes(selectedStop.id) ? current : [...current, selectedStop.id])
    chooseNextUnhandled(selectedIndex)
  }

  const resetProgress = () => {
    if (!window.confirm('GPS 코스의 완료·건너뜀 기록을 모두 지울까요?')) return
    setVisited([])
    setSkipped([])
    setSelectedStopId(activeStops[0].id)
    setArrivalStopId('')
  }

  const startGps = () => {
    gps.start()
    if (mockEnabled) {
      const point = yehliuGpsRoute[mockRouteIndex]
      gps.setMockPosition({ ...point, accuracy: 8, heading: null, timestamp: Date.now() })
    }
  }

  const moveMock = (routeIndex: number, accuracy = 8) => {
    const point = yehliuGpsRoute[routeIndex]
    setMockRouteIndex(routeIndex)
    gps.setMockPosition({ ...point, accuracy, heading: null, timestamp: Date.now() })
  }

  const today = new Date(clock)
  const isTripDay = today.getFullYear() === 2027 && today.getMonth() === 1 && today.getDate() === 21
  const [returnHour = 10, returnMinute = 45] = returnTime.split(':').map(Number)
  const returnTarget = new Date(today)
  returnTarget.setHours(returnHour, returnMinute, 0, 0)
  const minutesToReturn = Math.ceil((returnTarget.getTime() - clock) / 60_000)
  const latestTime = addMinutesToTime(returnTime, 5)
  const returnLabel = !isTripDay
    ? '여행 당일 자동 표시'
    : minutesToReturn > 0
      ? `${Math.floor(minutesToReturn / 60) > 0 ? `${Math.floor(minutesToReturn / 60)}시간 ` : ''}${minutesToReturn % 60}분 남음`
      : `${Math.abs(minutesToReturn)}분 경과`
  const delayAdvice = isTripDay && today.getHours() * 60 + today.getMinutes() >= 10 * 60 + 25 && progress < 65

  const statusPanel = (
    <>
      {!online && (
        <div className="yehliu-gps-offline" role="status">
          <Signal aria-hidden="true" />
          <div><strong>오프라인 GPS 모드</strong><span>지도와 경로는 기기에 저장되어 있습니다.</span></div>
        </div>
      )}

      {gps.errorMessage && (
        <div className="yehliu-gps-error" role="alert">
          <AlertTriangle aria-hidden="true" />
          <div><strong>GPS를 사용할 수 없어요</strong><p>{gps.errorMessage}</p><button type="button" onClick={() => onOpenGuide(selectedStop.guideStopId)}>GPS 없이 가이드 계속</button></div>
        </div>
      )}

      {deviation !== 'on-route' && (
        <div className={`yehliu-gps-deviation is-${deviation}`} role="status">
          <ShieldAlert aria-hidden="true" />
          <div>
            <strong>{deviation === 'off-route' ? '추천 동선에서 조금 벗어났습니다.' : 'GPS 신호가 약해 동선 이탈 여부가 불확실합니다.'}</strong>
            <span>현장 표지판과 공식 보행로를 확인하세요.</span>
          </div>
        </div>
      )}

      {arrivalStopId === selectedStop.id && (
        <div className="yehliu-gps-arrival" role="status" aria-live="polite">
          <Check aria-hidden="true" />
          <div><strong>{selectedStop.nameKo} 근처에 도착했습니다.</strong><span>자동으로 넘기지 않았어요. 위치와 현장 표지를 확인해 주세요.</span></div>
          <div className="yehliu-gps-arrival__actions">
            <button type="button" onClick={() => onOpenGuide(selectedStop.guideStopId)}>해설 열기</button>
            <button type="button" onClick={markVisited}>도착 처리</button>
          </div>
        </div>
      )}
    </>
  )

  const metricPanel = (
    <section className="yehliu-gps-metrics" aria-label="다음 포인트 안내">
      <article className="is-next">
        <span>다음 포인트</span>
        <strong>{selectedStop.nameKo}</strong>
        <small><span lang="zh-Hant">{selectedStop.nameZh}</span>{selectedStop.approximate ? ' · 위치 근사' : ''}</small>
      </article>
      <article><span>남은 거리</span><strong>{gps.position ? formatDistance(remainingDistance) : 'GPS 대기'}</strong><small>{routeMetric?.routeBased ? '추천 동선 기준' : gps.position ? '직선거리 기준' : '위치 수신 후 계산'}</small></article>
      <article><span>예상 이동</span><strong>{gps.position ? `약 ${walkMinutes}분` : '—'}</strong><small>이동시간 참고용</small></article>
      <article><span>방향</span><strong>{direction ? `${direction.arrow} ${direction.label}` : '—'}</strong><small>북쪽 기준</small></article>
      <article><span>GPS 정확도</span><strong>{gps.position ? `±${Math.round(gps.position.accuracy)} m` : '—'}</strong><small className={signal ? `is-${signal.tone}` : ''}>{signal?.label ?? 'GPS 시작 전'}</small></article>
      <article><span>추천 동선</span><strong>{gps.position ? (deviation === 'on-route' ? '동선 안' : formatDistance(routeGap)) : '—'}</strong><small>{deviation === 'off-route' ? '표지판 확인' : deviation === 'uncertain' ? '신호 재확인' : '공식 산책로 유지'}</small></article>
    </section>
  )

  const controls = (
    <div className="yehliu-gps-controls">
      {!gps.active && gps.status !== 'starting' ? (
        <button className="is-primary" type="button" onClick={startGps}><Play aria-hidden="true" /> GPS 시작</button>
      ) : gps.status === 'starting' ? (
        <button className="is-primary" type="button" onClick={gps.stop}><Signal className="is-pulsing" aria-hidden="true" /> GPS 수신 중…</button>
      ) : (
        <button className="is-danger" type="button" onClick={gps.stop}><CircleStop aria-hidden="true" /> GPS 종료</button>
      )}
      <button type="button" onClick={() => setFullscreen(true)}><Maximize2 aria-hidden="true" /> GPS 지도 크게 보기</button>
      <button type="button" onClick={() => setShowRestroom((current) => !current)} aria-expanded={showRestroom}><Toilet aria-hidden="true" /> 가장 가까운 화장실</button>
      <button type="button" onClick={() => setOnlineTiles((current) => online ? !current : false)} disabled={!online} aria-pressed={onlineTiles}>
        <Map aria-hidden="true" /> {onlineTiles ? '지도 배경 끄기' : '지도 배경 켜기'}
      </button>
    </div>
  )

  const navigationBody = (large = false) => (
    <>
      {statusPanel}
      <div className="yehliu-gps-progress" aria-label="GPS 코스 진행률">
        <div><span>코스 진행</span><strong>{visitedInRoute} / {activeStops.length} · {progress}%</strong></div>
        <div role="progressbar" aria-valuemin={0} aria-valuemax={activeStops.length} aria-valuenow={visitedInRoute}><span style={{ width: `${progress}%` }} /></div>
        <button type="button" onClick={resetProgress}><RotateCcw aria-hidden="true" /> 진행 초기화</button>
      </div>

      {metricPanel}
      {controls}
      {showRestroom && (
        <aside className="yehliu-gps-restroom" aria-live="polite">
          <Toilet aria-hidden="true" />
          <div><span>가장 가까운 화장실</span><strong>{closest?.facility.nameKo ?? '방문자센터 1층 화장실'}</strong><small>{closest ? `${formatDistance(closest.distance)} · 직선거리 기준` : 'GPS 시작 후 거리를 계산합니다.'}</small></div>
        </aside>
      )}

      <YehliuGpsMap
        routeId={routeId}
        position={gps.position}
        nextStopId={selectedStop.id}
        visited={visited}
        skipped={skipped}
        onlineTiles={onlineTiles && online}
        onSelectStop={setSelectedStopId}
        large={large}
      />

      <div className="yehliu-gps-step-actions" aria-label="포인트 이동과 완료">
        <button type="button" onClick={() => setSelectedStopId(activeStops[Math.max(0, selectedIndex - 1)].id)} disabled={selectedIndex === 0}><ChevronLeft aria-hidden="true" /> 이전</button>
        <button type="button" onClick={skipStop}>건너뛰기</button>
        <button type="button" onClick={markVisited}><Check aria-hidden="true" /> 완료</button>
        <button type="button" onClick={() => setSelectedStopId(activeStops[Math.min(activeStops.length - 1, selectedIndex + 1)].id)} disabled={selectedIndex === activeStops.length - 1}>다음 <ChevronRight aria-hidden="true" /></button>
      </div>

      <section className="yehliu-gps-settings" aria-labelledby={large ? 'gps-full-settings' : 'gps-settings'}>
        <div>
          <h3 id={large ? 'gps-full-settings' : 'gps-settings'}><BatteryMedium aria-hidden="true" /> GPS와 걷기 설정</h3>
          <fieldset>
            <legend>GPS 정확도</legend>
            <label><input type="radio" name={large ? 'accuracy-full' : 'accuracy'} checked={gps.highAccuracy} onChange={() => gps.changeAccuracyMode(true)} />고정밀</label>
            <label><input type="radio" name={large ? 'accuracy-full' : 'accuracy'} checked={!gps.highAccuracy} onChange={() => gps.changeAccuracyMode(false)} />배터리 절약</label>
          </fieldset>
          <fieldset>
            <legend>부모님 동반 속도</legend>
            <label><input type="radio" name={large ? 'pace-full' : 'pace'} checked={walkingPace === 'relaxed'} onChange={() => setWalkingPace('relaxed')} />여유롭게 · 3.0km/h</label>
            <label><input type="radio" name={large ? 'pace-full' : 'pace'} checked={walkingPace === 'normal'} onChange={() => setWalkingPace('normal')} />보통 · 3.5km/h</label>
          </fieldset>
        </div>
        <div className="yehliu-gps-return-time">
          <Clock3 aria-hidden="true" />
          <label htmlFor={large ? 'gps-return-time-full' : 'gps-return-time'}>오늘 차량 복귀 목표<input id={large ? 'gps-return-time-full' : 'gps-return-time'} type="time" value={returnTime} onChange={(event) => setReturnTime(event.target.value)} /></label>
          <strong>{returnLabel}</strong>
          <small>늦어도 {latestTime}</small>
        </div>
      </section>

      {delayAdvice && <p className="yehliu-gps-delay"><Clock3 aria-hidden="true" />현재 진행이 늦어졌습니다. Deep 대신 Compact 코스로 줄이는 것을 권장합니다.</p>}

      {mockEnabled && (
        <details className="yehliu-gps-mock" open>
          <summary>개발용 GPS Mock</summary>
          <label htmlFor={large ? 'gps-mock-route-full' : 'gps-mock-route'}>경로 위치 {mockRouteIndex + 1}/{yehliuGpsRoute.length}</label>
          <input id={large ? 'gps-mock-route-full' : 'gps-mock-route'} type="range" min="0" max={yehliuGpsRoute.length - 1} value={mockRouteIndex} onChange={(event) => moveMock(Number(event.target.value))} />
          <div>
            <button type="button" onClick={() => gps.setMockPosition({ ...selectedStop, accuracy: 6, heading: null, timestamp: Date.now() })}>포인트 도착</button>
            <button type="button" onClick={() => gps.setMockPosition({ lat: selectedStop.lat, lng: selectedStop.lng - .00075, accuracy: 8, heading: null, timestamp: Date.now() })}>동선 밖 60m</button>
            <button type="button" onClick={() => moveMock(mockRouteIndex, 50)}>정확도 50m</button>
            <button type="button" onClick={() => gps.setMockError(1)}>권한 거부</button>
            <button type="button" onClick={() => gps.setMockError(3)}>시간 초과</button>
            <button type="button" onClick={() => gps.setMockError(2)}>위치 불가</button>
          </div>
        </details>
      )}

      <div className="yehliu-gps-privacy">
        <ShieldAlert aria-hidden="true" />
        <p><strong>현재 위치는 이 기기 안에서만 사용합니다.</strong>서버·Supabase·분석 도구로 보내거나 GPS 이동 기록을 저장하지 않습니다. 화면이 꺼지면 iPhone Safari와 홈 화면 앱에서 위치 업데이트가 멈출 수 있습니다.</p>
      </div>
      <p className="yehliu-gps-safety"><AlertTriangle aria-hidden="true" />GPS보다 현장 표지판·안전선·직원 안내가 우선입니다. 공식 산책로를 따라 이동하고 젖은 바위나 통제구역으로 향하지 마세요.</p>
      <details className="yehliu-gps-coordinate-sources">
        <summary>GPS 좌표와 지도 출처</summary>
        {yehliuGpsSources.map((source) => <p key={source.id}><strong>{source.id} · {source.title}</strong><span>{source.organization} · {source.note}</span><a href={source.url} target="_blank" rel="noreferrer">출처 열기</a></p>)}
      </details>
    </>
  )

  return (
    <>
      {display === 'launch' && (
        <section className="yehliu-gps-launch" aria-labelledby="gps-launch-title">
          <div className="yehliu-gps-launch__icon"><Navigation aria-hidden="true" /></div>
          <div>
            <span className="yehliu-section-kicker">GPS LIVE WALK</span>
            <h2 id="gps-launch-title">현장에서는 내 위치와 다음 바위까지</h2>
            <p>실좌표 지도, 남은 거리, 방향, 화장실을 인터넷 없이도 확인합니다. 위치 권한은 GPS 시작을 누를 때만 요청해요.</p>
          </div>
          <div className="yehliu-gps-launch__next">
            <span>현재 선택</span><strong>{selectedStop.nameKo}</strong><small>{gps.active && currentNearest ? `${currentNearest.stop.nameKo} 근처` : 'GPS 시작 전'}</small>
          </div>
          <button type="button" onClick={onOpenGps}><MapPinned aria-hidden="true" /> GPS 내비 열기</button>
        </section>
      )}

      {display === 'full' && (
        <section className="yehliu-gps-panel" aria-labelledby="yehliu-gps-title">
          <div className="yehliu-section-heading">
            <span className="yehliu-section-kicker">LIVE NAVIGATION · OFFLINE FIRST</span>
            <h2 id="yehliu-gps-title">내 위치에서 다음 지질 포인트까지</h2>
            <p>실제 위도·경도로 거리와 방향을 계산합니다. 완전한 길안내가 아니라 공식 산책로에서 위치를 참고하는 기능입니다.</p>
          </div>
          {navigationBody()}
        </section>
      )}

      {gps.active && display !== 'full' && !fullscreen && (
        <aside className="yehliu-gps-quick" aria-label="빠른 GPS 안내">
          <Navigation aria-hidden="true" />
          <div><span>다음 · {selectedStop.nameKo}</span><strong>{formatDistance(remainingDistance)} · 약 {walkMinutes}분</strong><small>{direction ? `${direction.arrow} ${direction.label}` : '위치 계산 중'}</small></div>
          <button type="button" onClick={() => onOpenGuide(selectedStop.guideStopId)}>해설 보기</button>
          <button type="button" onClick={() => setFullscreen(true)}>지도</button>
        </aside>
      )}

      {fullscreen && (
        <section className="yehliu-gps-fullscreen" role="dialog" aria-modal="true" aria-labelledby="gps-fullscreen-title">
          <header>
            <button ref={fullscreenBackRef} type="button" onClick={() => setFullscreen(false)}><ChevronLeft aria-hidden="true" /> 가이드</button>
            <div><span>GPS LIVE</span><h2 id="gps-fullscreen-title">{selectedStop.nameKo}</h2></div>
            <button className="is-close" type="button" aria-label="GPS 전체 화면 닫기" onClick={() => setFullscreen(false)}><X aria-hidden="true" /></button>
          </header>
          <main>{navigationBody(true)}</main>
        </section>
      )}
    </>
  )
}
