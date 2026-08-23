import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertTriangle, BatteryMedium, Check, ChevronLeft, ChevronRight, CircleStop, Clock3, Compass,
  Crosshair, Map, MapPinned, Maximize2, Navigation, Play, RotateCcw, Save, ShieldAlert, Signal,
  Toilet, Undo2, X,
} from 'lucide-react'
import { yehliuGpsFacilities, yehliuGpsSources, yehliuRouteDefinitions } from '../data/yehliuGpsRoute'
import { yehliuStops, type YehliuStop, type YehliuStopId } from '../data/yehliuGuide'
import {
  bearingDegrees, bearingLabel, estimateFieldSchedule, formatDistance, formatMinuteOfDay, getTaipeiClock,
  gpsSignal, hasArrived, haversineMeters, locationFreshness, nearestRouteProjection, routeDeviation,
  routeDirectionTarget, routeDistanceToIndex, routeDistanceToPoint, timeToMinutes, walkingMinutes,
} from '../lib/yehliuGps'
import { useYehliuGeolocation } from '../lib/useYehliuGeolocation'
import { useYehliuFieldSession } from '../lib/useYehliuFieldSession'
import { YehliuGpsMap } from './YehliuGpsMap'

type NavigatorDisplay = 'launch' | 'full' | 'hidden'
interface YehliuGpsNavigatorProps {
  field: ReturnType<typeof useYehliuFieldSession>
  display: NavigatorDisplay
  onOpenGps: () => void
  onOpenGuide: (stopId: YehliuStopId) => void
}

interface DeviceOrientationWithCompass extends DeviceOrientationEvent { webkitCompassHeading?: number }
interface DeviceOrientationEventConstructorWithPermission { requestPermission?: () => Promise<'granted' | 'denied'> }

const parkCenter = yehliuStops.find((stop) => stop.id === 'visitor-center')!
const isHandled = (stopId: YehliuStopId, visited: YehliuStopId[], skipped: YehliuStopId[]) => visited.includes(stopId) || skipped.includes(stopId)

export function YehliuGpsNavigator({ field, display, onOpenGps, onOpenGuide }: YehliuGpsNavigatorProps) {
  const { session } = field
  const mockEnabled = import.meta.env.DEV && new URLSearchParams(window.location.search).get('gpsMock') === '1'
  const gps = useYehliuGeolocation(mockEnabled)
  const definition = yehliuRouteDefinitions[session.routeId]
  const activeStops = definition.stopIds.map((id) => yehliuStops.find((stop) => stop.id === id)!).filter(Boolean)
  const selectedIndex = Math.max(0, activeStops.findIndex((stop) => stop.id === session.currentStopId))
  const selectedStop = activeStops[selectedIndex] ?? activeStops[0]
  const [arrivalStopId, setArrivalStopId] = useState<YehliuStopId | null>(null)
  const [showRestroom, setShowRestroom] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [online, setOnline] = useState(() => navigator.onLine)
  const [onlineTiles, setOnlineTiles] = useState(() => navigator.onLine)
  const [clock, setClock] = useState(() => Date.now())
  const [mockRouteIndex, setMockRouteIndex] = useState(0)
  const [meetingNote, setMeetingNote] = useState(() => session.vehicleMeetingPoint?.note ?? '')
  const [confirmWeakMeeting, setConfirmWeakMeeting] = useState(false)
  const [resumeDismissed, setResumeDismissed] = useState(false)
  const [compassHeading, setCompassHeading] = useState<number | null>(null)
  const [compassNotice, setCompassNotice] = useState('')
  const fullscreenBackRef = useRef<HTMLButtonElement>(null)
  const lastProjectionSegmentRef = useRef(0)

  const observed = activeStops.filter((stop) => session.visitedStopIds.includes(stop.id)).length
  const handled = activeStops.filter((stop) => isHandled(stop.id, session.visitedStopIds, session.skippedStopIds)).length
  const progress = Math.round(handled / activeStops.length * 100)
  const taipei = getTaipeiClock(clock)
  const ageSeconds = gps.position ? Math.max(0, (clock - gps.position.timestamp) / 1_000) : Number.POSITIVE_INFINITY
  const freshness = gps.position ? locationFreshness(ageSeconds) : 'stale'
  const walkingSpeed = session.walkingPace === 'relaxed' ? 3 : 3.5

  useEffect(() => {
    if (activeStops.some((stop) => stop.id === session.currentStopId)) return
    field.setCurrentStopId(activeStops.find((stop) => !isHandled(stop.id, session.visitedStopIds, session.skippedStopIds))?.id ?? activeStops[0].id)
  }, [activeStops, field, session.currentStopId, session.skippedStopIds, session.visitedStopIds])

  useEffect(() => {
    lastProjectionSegmentRef.current = 0
    setResumeDismissed(false)
    setArrivalStopId(null)
  }, [session.routeId])

  useEffect(() => {
    const handleOnline = () => setOnline(true)
    const handleOffline = () => { setOnline(false); setOnlineTiles(false) }
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => { window.removeEventListener('online', handleOnline); window.removeEventListener('offline', handleOffline) }
  }, [])

  useEffect(() => {
    if (!gps.active && display !== 'full') return
    const timer = window.setInterval(() => setClock(Date.now()), 5_000)
    return () => window.clearInterval(timer)
  }, [display, gps.active])

  useEffect(() => {
    if (!fullscreen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    fullscreenBackRef.current?.focus()
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setFullscreen(false) }
    window.addEventListener('keydown', close)
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener('keydown', close) }
  }, [fullscreen])

  const projection = gps.position ? nearestRouteProjection(gps.position, definition.path, Math.max(0, lastProjectionSegmentRef.current - 3)) : null
  useEffect(() => {
    if (!projection || projection.distanceMeters > Math.max(55, gps.position?.accuracy ?? 0)) return
    lastProjectionSegmentRef.current = Math.max(lastProjectionSegmentRef.current, projection.segmentIndex)
  }, [gps.position?.accuracy, projection])

  const targetPoint = selectedStop.vehicleReturn && session.vehicleMeetingPoint ? session.vehicleMeetingPoint : selectedStop
  const routeMetric = gps.position ? routeDistanceToPoint(gps.position, definition.path, targetPoint, Math.max(0, lastProjectionSegmentRef.current - 3)) : null
  const directDistance = gps.position ? haversineMeters(gps.position, targetPoint) : Number.POSITIVE_INFINITY
  const remainingDistance = routeMetric?.distanceMeters ?? directDistance
  const targetIndex = routeMetric?.targetProjection ? routeMetric.targetProjection.segmentIndex + 1 : definition.path.length - 1
  const directionPoint = routeDirectionTarget(definition.path, routeMetric?.currentProjection ?? null, targetIndex) ?? targetPoint
  const bearing = gps.position ? bearingDegrees(gps.position, directionPoint) : null
  const direction = bearing === null ? null : bearingLabel(bearing)
  const routeGap = projection?.distanceMeters ?? Number.POSITIVE_INFINITY
  const deviation = freshness === 'stale' || !gps.position ? 'uncertain' : routeDeviation(routeGap, gps.position.accuracy)
  const signal = gps.position ? gpsSignal(gps.position.accuracy) : null
  const walkMinutes = walkingMinutes(remainingDistance, walkingSpeed)
  const outsideParkDistance = gps.position ? haversineMeters(gps.position, parkCenter) : 0
  const outsidePark = Boolean(gps.position && outsideParkDistance > 1_000)

  const routeRestrooms = useMemo(() => {
    if (!gps.position) return []
    return yehliuGpsFacilities.map((facility) => {
      const metric = routeDistanceToPoint(gps.position!, definition.path, facility, Math.max(0, lastProjectionSegmentRef.current - 3))
      return { facility, ...metric }
    }).sort((a, b) => a.distanceMeters - b.distanceMeters)
  }, [definition.path, gps.position])
  const closest = routeRestrooms[0]

  const resumeCandidate = useMemo(() => {
    if (!gps.position || freshness === 'stale' || gps.position.accuracy > 35 || handled > 0 || resumeDismissed) return null
    const startSegment = Math.max(0, projection?.segmentIndex ?? 0)
    return activeStops.filter((stop) => !isHandled(stop.id, session.visitedStopIds, session.skippedStopIds)).map((stop) => {
      const stopProjection = nearestRouteProjection(stop, definition.path, Math.max(0, startSegment - 2))
      return { stop, segment: stopProjection?.segmentIndex ?? 0, distance: haversineMeters(gps.position!, stop) }
    }).filter((item) => item.segment + 3 >= startSegment).sort((a, b) => a.distance - b.distance)[0]?.stop ?? null
  }, [activeStops, definition.path, freshness, gps.position, handled, projection?.segmentIndex, resumeDismissed, session.skippedStopIds, session.visitedStopIds])

  useEffect(() => {
    if (!gps.position || arrivalStopId === selectedStop.id) return
    if (hasArrived(directDistance, selectedStop.arrivalRadiusMeters, gps.position.accuracy, { approximate: !selectedStop.autoArrival, ageSeconds })) setArrivalStopId(selectedStop.id)
  }, [ageSeconds, arrivalStopId, directDistance, gps.position, selectedStop])

  const returnPoint = session.vehicleMeetingPoint ?? yehliuStops.find((stop) => stop.id === 'vehicle-return')!
  const bookstore = yehliuStops.find((stop) => stop.id === 'queens-bookstore')!
  const remainingToBookstore = gps.position && !session.returningToVehicle ? routeDistanceToPoint(gps.position, definition.path, bookstore, Math.max(0, lastProjectionSegmentRef.current - 3)).distanceMeters : 0
  const returnWalkMeters = gps.position
    ? session.returningToVehicle
      ? routeDistanceToPoint(gps.position, definition.path, returnPoint, Math.max(0, lastProjectionSegmentRef.current - 3)).distanceMeters
      : routeDistanceToPoint(bookstore, definition.path, returnPoint, definition.returnPathStartIndex).distanceMeters
    : 900
  const remainingDwell = activeStops.filter((stop) => !isHandled(stop.id, session.visitedStopIds, session.skippedStopIds) && !stop.vehicleReturn && stop.id !== 'visitor-center').reduce((total, stop) => total + stop.minimumDwellMinutes, 0)
  const schedule = estimateFieldSchedule({ nowMinute: taipei.minuteOfDay, returnTarget: session.returnTarget, remainingRouteMeters: remainingToBookstore, remainingDwellMinutes: remainingDwell, walkingSpeedKilometersPerHour: walkingSpeed, returnWalkMeters })
  const isTripDay = taipei.year === 2027 && taipei.month === 2 && taipei.day === 21
  const latestTime = formatMinuteOfDay(timeToMinutes(session.returnTarget) + 5)

  const chooseNextUnhandled = (fromIndex: number) => {
    const next = activeStops.slice(fromIndex + 1).find((stop) => !isHandled(stop.id, session.visitedStopIds, session.skippedStopIds)) ?? activeStops.find((stop) => !isHandled(stop.id, session.visitedStopIds, session.skippedStopIds)) ?? activeStops.at(-1)!
    field.setCurrentStopId(next.id)
    setArrivalStopId(null)
  }
  const markVisited = () => { field.markVisited(selectedStop.id); chooseNextUnhandled(selectedIndex) }
  const skipStop = () => { field.skipStop(selectedStop.id); chooseNextUnhandled(selectedIndex) }
  const resetProgress = () => { if (window.confirm('예류의 관찰·건너뜀 기록을 모두 지울까요?')) { field.reset(); lastProjectionSegmentRef.current = 0; setArrivalStopId(null) } }

  const startGps = () => {
    gps.start()
    if (mockEnabled) gps.setMockPosition({ ...definition.path[mockRouteIndex], accuracy: 8, heading: null, timestamp: Date.now() })
  }
  const moveMock = (routeIndex: number, accuracy = 8, ageMs = 0) => {
    const point = definition.path[routeIndex]
    setMockRouteIndex(routeIndex)
    gps.setMockPosition({ ...point, accuracy, heading: null, timestamp: Date.now() - ageMs })
  }

  const saveMeetingPoint = () => {
    if (!gps.position) return
    if (gps.position.accuracy > 40 && !confirmWeakMeeting) { setConfirmWeakMeeting(true); return }
    field.saveMeetingPoint({ lat: gps.position.lat, lng: gps.position.lng, accuracy: gps.position.accuracy, savedAt: new Date().toISOString(), note: meetingNote.trim() || undefined })
    setConfirmWeakMeeting(false)
  }

  const enableCompass = async () => {
    const constructor = DeviceOrientationEvent as unknown as DeviceOrientationEventConstructorWithPermission
    if (constructor.requestPermission && await constructor.requestPermission() !== 'granted') { setCompassNotice('나침반 권한이 허용되지 않았습니다.'); return }
    const update = (event: Event) => {
      const orientation = event as DeviceOrientationWithCompass
      const heading = orientation.webkitCompassHeading ?? (typeof orientation.alpha === 'number' ? (360 - orientation.alpha) % 360 : null)
      if (heading !== null) setCompassHeading(heading)
    }
    window.addEventListener('deviceorientationabsolute', update, { passive: true })
    window.addEventListener('deviceorientation', update, { passive: true })
    setCompassNotice('나침반 보정이 필요하면 휴대폰으로 8자를 그려 주세요.')
  }

  const statusPanel = <>
    {!online && <div className="yehliu-gps-offline" role="status"><Signal aria-hidden="true" /><div><strong>오프라인 GPS 모드</strong><span>지도와 경로는 기기에 저장되어 있습니다.</span></div></div>}
    {gps.errorMessage && <div className="yehliu-gps-error" role="alert"><AlertTriangle aria-hidden="true" /><div><strong>새 위치를 받지 못했어요</strong><p>{gps.errorMessage}{gps.position ? ' 마지막 위치는 지도에 유지합니다.' : ''}</p><button type="button" onClick={gps.refresh}>위치 다시 받기</button><button type="button" onClick={() => onOpenGuide(selectedStop.id)}>GPS 없이 해설 계속</button></div></div>}
    {gps.position && freshness !== 'live' && <div className={`yehliu-gps-stale is-${freshness}`} role="status"><Crosshair aria-hidden="true" /><div><strong>마지막 위치 업데이트 {Math.round(ageSeconds)}초 전</strong><span>{freshness === 'stale' ? '자동 도착과 동선 이탈 판정을 멈췄습니다.' : '위치를 다시 확인하고 있습니다.'}</span></div><button type="button" onClick={gps.refresh}>위치 다시 받기</button></div>}
    {!outsidePark && deviation !== 'on-route' && freshness !== 'stale' && <div className={`yehliu-gps-deviation is-${deviation}`} role="status"><ShieldAlert aria-hidden="true" /><div><strong>{deviation === 'off-route' ? '추천 동선에서 벗어났습니다.' : 'GPS 오차 때문에 동선 이탈 여부가 불확실합니다.'}</strong><span>현장 표지판과 공식 보행로를 확인하세요.</span></div></div>}
    {resumeCandidate && resumeCandidate.id !== 'visitor-center' && <div className="yehliu-gps-resume" role="status"><Navigation aria-hidden="true" /><div><strong>{resumeCandidate.title} 근처에서 시작할까요?</strong><span>위치를 기준으로 제안했으며 자동 변경하지 않았습니다.</span></div><button type="button" onClick={() => { field.setCurrentStopId(resumeCandidate.id); setResumeDismissed(true) }}>현재 위치부터 재개</button><button type="button" onClick={() => setResumeDismissed(true)}>처음부터 유지</button></div>}
    {arrivalStopId === selectedStop.id && <div className="yehliu-gps-arrival" role="status" aria-live="polite"><Check aria-hidden="true" /><div><strong>{selectedStop.title} 근처에 도착했습니다.</strong><span>자동으로 완료하지 않았어요. 현장 표지를 확인해 주세요.</span></div><div className="yehliu-gps-arrival__actions"><button type="button" onClick={() => onOpenGuide(selectedStop.id)}>해설 열기</button><button type="button" onClick={markVisited}>도착 처리</button></div></div>}
  </>

  const metricPanel = <section className="yehliu-gps-metrics" aria-label="다음 포인트 안내">
    <article className="is-next"><span>다음 포인트</span><strong>{selectedStop.title}</strong><small><span lang="zh-Hant">{selectedStop.localName}</span>{!selectedStop.autoArrival ? ' · 근사 구역 · 수동 완료' : ''}</small></article>
    <article><span>남은 거리</span><strong>{gps.position ? formatDistance(remainingDistance) : 'GPS 대기'}</strong><small>{routeMetric?.routeBased ? '선택 코스 보행선 기준' : gps.position ? '직선거리 fallback' : '위치 수신 후 계산'}</small></article>
    <article><span>예상 이동</span><strong>{gps.position ? `약 ${walkMinutes}분` : '—'}</strong><small>관찰 시간 제외</small></article>
    <article><span>다음 보행 방향</span><strong>{direction ? `${direction.arrow} ${direction.label}` : '—'}</strong><small>{routeMetric?.routeBased ? '다음 경로점 기준' : '직선 방향 fallback'}</small>{bearing !== null && compassHeading !== null && <i className="yehliu-gps-compass-arrow" style={{ transform: `rotate(${bearing - compassHeading}deg)` }}>↑</i>}</article>
    <article><span>GPS 정확도</span><strong>{gps.position ? `±${Math.round(gps.position.accuracy)} m` : '—'}</strong><small className={signal ? `is-${signal.tone}` : ''}>{signal?.label ?? 'GPS 시작 전'}</small></article>
    <article><span>추천 동선</span><strong>{gps.position ? deviation === 'on-route' ? '동선 안' : formatDistance(routeGap) : '—'}</strong><small>{freshness === 'stale' ? '판정 일시중지' : deviation === 'off-route' ? '표지판 확인' : deviation === 'uncertain' ? '오차 범위 재확인' : '공식 산책로 유지'}</small></article>
  </section>

  const controls = <div className="yehliu-gps-controls">
    {!gps.active && gps.status !== 'starting' ? <button className="is-primary" type="button" onClick={startGps}><Play aria-hidden="true" /> GPS 시작</button> : gps.status === 'starting' ? <button className="is-primary" type="button" onClick={gps.stop}><Signal className="is-pulsing" aria-hidden="true" /> GPS 수신 중…</button> : <button className="is-danger" type="button" onClick={gps.stop}><CircleStop aria-hidden="true" /> GPS 종료</button>}
    <button type="button" onClick={() => setFullscreen(true)}><Maximize2 aria-hidden="true" /> 지도 크게</button>
    <button type="button" onClick={() => setShowRestroom((value) => !value)} aria-expanded={showRestroom}><Toilet aria-hidden="true" /> 화장실</button>
    <button type="button" onClick={() => setOnlineTiles((value) => online ? !value : false)} disabled={!online} aria-pressed={onlineTiles}><Map aria-hidden="true" /> {onlineTiles ? '지도 배경 끄기' : '지도 배경 켜기'}</button>
    <button type="button" onClick={enableCompass} aria-pressed={compassHeading !== null}><Compass aria-hidden="true" /> {compassHeading === null ? '나침반 켜기' : '나침반 사용 중'}</button>
  </div>

  const navigationBody = (large = false) => <>
    {statusPanel}
    <div className="yehliu-gps-progress" aria-label="GPS 코스 진행률"><div><span>관찰 {observed} · 건너뜀 {handled - observed}</span><strong>{handled} / {activeStops.length} · {progress}%</strong></div><div role="progressbar" aria-valuemin={0} aria-valuemax={activeStops.length} aria-valuenow={handled}><span style={{ width: `${progress}%` }} /></div><button type="button" onClick={resetProgress}><RotateCcw aria-hidden="true" /> 진행 초기화</button></div>
    {metricPanel}{controls}{compassNotice && <p className="yehliu-gps-compass-note">{compassNotice}</p>}
    {showRestroom && <aside className="yehliu-gps-restroom" aria-live="polite"><Toilet aria-hidden="true" /><div><span>현재 동선에서 가장 가까운 화장실</span><strong>{closest?.facility.nameKo ?? '방문자센터 1층 화장실'}</strong><small>{closest ? `${formatDistance(closest.distanceMeters)} · ${closest.routeBased ? '보행 동선 기준' : '직선거리 fallback'}` : 'GPS 시작 후 계산합니다.'}</small></div></aside>}

    <section className="yehliu-meeting-point" aria-labelledby={large ? 'meeting-title-full' : 'meeting-title'}><MapPinned aria-hidden="true" /><div><h3 id={large ? 'meeting-title-full' : 'meeting-title'}>차량 합류점 저장</h3><p>{session.vehicleMeetingPoint ? `저장됨 · ±${Math.round(session.vehicleMeetingPoint.accuracy)}m · ${new Date(session.vehicleMeetingPoint.savedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}` : '차가 서 있는 곳에서 GPS를 켜고 저장하세요.'}</p><label>차량번호·주차구역 메모<input value={meetingNote} onChange={(event) => setMeetingNote(event.target.value)} placeholder="예: 흰색 Alphard · B구역" /></label>{confirmWeakMeeting && <strong>오차가 ±{Math.round(gps.position?.accuracy ?? 0)}m입니다. 그래도 저장하려면 한 번 더 누르세요.</strong>}</div><button type="button" onClick={saveMeetingPoint} disabled={!gps.position || freshness === 'stale'}><Save aria-hidden="true" />이 위치 저장</button><button className="is-return" type="button" onClick={field.returnToVehicle}><Undo2 aria-hidden="true" />지금 차량으로 복귀</button></section>

    {!outsidePark ? <YehliuGpsMap routeId={session.routeId} position={gps.position} meetingPoint={session.vehicleMeetingPoint} nextStopId={selectedStop.id} visited={session.visitedStopIds} skipped={session.skippedStopIds} onlineTiles={onlineTiles && online} onSelectStop={field.setCurrentStopId} large={large} /> : <aside className="yehliu-gps-outside"><MapPinned aria-hidden="true" /><div><strong>현재 위치는 예류공원에서 약 {formatDistance(outsideParkDistance)} 떨어져 있습니다.</strong><p>Day 2 일정에서 이동 중이라면 정상이에요. 공원 도착 후 다시 GPS를 시작해 주세요.</p></div><a href="#schedule/day-2">DAY 2 일정 보기</a></aside>}

    <div className="yehliu-gps-step-actions" aria-label="포인트 이동과 완료"><button type="button" onClick={() => { field.setCurrentStopId(activeStops[Math.max(0, selectedIndex - 1)].id); lastProjectionSegmentRef.current = Math.max(0, lastProjectionSegmentRef.current - 12) }} disabled={selectedIndex === 0}><ChevronLeft aria-hidden="true" /> 이전</button><button type="button" onClick={skipStop}>건너뛰기</button><button type="button" onClick={markVisited}><Check aria-hidden="true" /> 관찰 완료</button><button type="button" onClick={() => field.setCurrentStopId(activeStops[Math.min(activeStops.length - 1, selectedIndex + 1)].id)} disabled={selectedIndex === activeStops.length - 1}>다음 <ChevronRight aria-hidden="true" /></button></div>
    {selectedStop.id === 'queens-head' && <button className="yehliu-queue-skip" type="button" onClick={skipStop}><Clock3 aria-hidden="true" />정면 사진 줄 8–10분 이상 · 줄 생략하고 복귀 흐름 유지</button>}

    <section className="yehliu-gps-settings" aria-labelledby={large ? 'gps-full-settings' : 'gps-settings'}><div><h3 id={large ? 'gps-full-settings' : 'gps-settings'}><BatteryMedium aria-hidden="true" /> GPS와 걷기 설정</h3><fieldset><legend>GPS 정확도</legend><label><input type="radio" name={large ? 'accuracy-full' : 'accuracy'} checked={gps.highAccuracy} onChange={() => gps.changeAccuracyMode(true)} />고정밀</label><label><input type="radio" name={large ? 'accuracy-full' : 'accuracy'} checked={!gps.highAccuracy} onChange={() => gps.changeAccuracyMode(false)} />배터리 절약</label></fieldset><fieldset><legend>부모님 동반 속도</legend><label><input type="radio" name={large ? 'pace-full' : 'pace'} checked={session.walkingPace === 'relaxed'} onChange={() => field.setWalkingPace('relaxed')} />여유롭게 · 3.0km/h</label><label><input type="radio" name={large ? 'pace-full' : 'pace'} checked={session.walkingPace === 'normal'} onChange={() => field.setWalkingPace('normal')} />보통 · 3.5km/h</label></fieldset></div><div className="yehliu-gps-return-time"><Clock3 aria-hidden="true" /><label htmlFor={large ? 'gps-return-time-full' : 'gps-return-time'}>차량 합류 목표<input id={large ? 'gps-return-time-full' : 'gps-return-time'} type="time" value={session.returnTarget} onChange={(event) => field.setReturnTarget(event.target.value)} /></label><strong>{isTripDay ? `${schedule.minutesToTarget > 0 ? schedule.minutesToTarget : 0}분 남음` : '여행 당일 자동 표시'}</strong><small>늦어도 {latestTime}</small></div></section>
    <p className={`yehliu-gps-schedule is-${isTripDay ? schedule.tone : 'normal'}`}><Clock3 aria-hidden="true" />{isTripDay ? schedule.message : '대만 시간 기준으로 여행 당일 예상 복귀 시간을 자동 계산합니다.'}</p>

    {mockEnabled && <details className="yehliu-gps-mock" open><summary>개발용 GPS Mock</summary><label htmlFor={large ? 'gps-mock-route-full' : 'gps-mock-route'}>경로 위치 {mockRouteIndex + 1}/{definition.path.length}</label><input id={large ? 'gps-mock-route-full' : 'gps-mock-route'} type="range" min="0" max={definition.path.length - 1} value={mockRouteIndex} onChange={(event) => moveMock(Number(event.target.value))} /><div><button type="button" onClick={() => gps.setMockPosition({ ...selectedStop, accuracy: 6, heading: null, timestamp: Date.now() })}>포인트 도착</button><button type="button" onClick={() => gps.setMockPosition({ lat: selectedStop.lat, lng: selectedStop.lng - .00075, accuracy: 8, heading: null, timestamp: Date.now() })}>동선 밖 60m</button><button type="button" onClick={() => moveMock(mockRouteIndex, 50)}>정확도 50m</button><button type="button" onClick={() => moveMock(mockRouteIndex, 8, 50_000)}>50초 stale</button><button type="button" onClick={() => gps.setMockError(1)}>권한 거부</button></div></details>}
    <div className="yehliu-gps-privacy"><ShieldAlert aria-hidden="true" /><p><strong>현재 위치는 이 기기 안에서만 사용합니다.</strong>서버·Supabase·분석 도구로 보내거나 GPS 이동 기록을 저장하지 않습니다. 화면이 꺼지면 iPhone Safari와 홈 화면 앱에서 위치 업데이트가 멈출 수 있습니다.</p></div><p className="yehliu-gps-safety"><AlertTriangle aria-hidden="true" />GPS보다 현장 표지판·안전선·직원 안내가 우선입니다. 공식 산책로를 따라 이동하고 젖은 바위나 통제구역으로 향하지 마세요.</p><details className="yehliu-gps-coordinate-sources"><summary>GPS 좌표와 지도 출처</summary>{yehliuGpsSources.map((source) => <p key={source.id}><strong>{source.id} · {source.title}</strong><span>{source.organization} · {source.note}</span><a href={source.url} target="_blank" rel="noreferrer">출처 열기</a></p>)}</details>
  </>

  return <>
    {display === 'launch' && <section className="yehliu-gps-launch" aria-labelledby="gps-launch-title"><div className="yehliu-gps-launch__icon"><Navigation aria-hidden="true" /></div><div><span className="yehliu-section-kicker">GPS LIVE WALK</span><h2 id="gps-launch-title">합류점 저장부터 다음 바위까지</h2><p>경로 기준 거리·방향·화장실과 10:45 복귀 판단을 인터넷 없이 확인합니다.</p></div><div className="yehliu-gps-launch__next"><span>현재 선택</span><strong>{selectedStop.title}</strong><small>{session.vehicleMeetingPoint ? '차량 합류점 저장됨' : '합류점 저장 필요'}</small></div><button type="button" onClick={onOpenGps}><MapPinned aria-hidden="true" /> GPS 내비 열기</button></section>}
    {display === 'full' && <section className="yehliu-gps-panel" id="yehliu-panel-gps" role="tabpanel" aria-labelledby="yehliu-tab-gps"><div className="yehliu-section-heading"><span className="yehliu-section-kicker">LIVE NAVIGATION · OFFLINE FIRST</span><h2 id="yehliu-gps-title">내 위치에서 다음 지질 포인트까지</h2><p>완전한 길안내가 아니라 공식 산책로 위에서 위치와 복귀 판단을 돕는 현장 도구입니다.</p></div>{navigationBody()}</section>}
    {gps.active && display !== 'full' && !fullscreen && <aside className="yehliu-gps-quick" aria-label="빠른 GPS 안내"><Navigation aria-hidden="true" /><div><span>다음 · {selectedStop.title}</span><strong>{formatDistance(remainingDistance)} · 약 {walkMinutes}분</strong><small>{direction ? `${direction.arrow} ${direction.label}` : '위치 계산 중'}</small></div><button type="button" onClick={() => onOpenGuide(selectedStop.id)}>해설 보기</button><button type="button" onClick={() => setFullscreen(true)}>지도</button></aside>}
    {fullscreen && <section className="yehliu-gps-fullscreen" role="dialog" aria-modal="true" aria-labelledby="gps-fullscreen-title"><header><button ref={fullscreenBackRef} type="button" onClick={() => setFullscreen(false)}><ChevronLeft aria-hidden="true" /> 가이드</button><div><span>GPS LIVE</span><h2 id="gps-fullscreen-title">{selectedStop.title}</h2></div><button className="is-close" type="button" aria-label="GPS 전체 화면 닫기" onClick={() => setFullscreen(false)}><X aria-hidden="true" /></button></header><main>{navigationBody(true)}</main></section>}
  </>
}
