import type { GeoPoint } from '../data/yehliuGpsRoute'

const EARTH_RADIUS_METERS = 6_371_008.8

const toRadians = (degrees: number) => degrees * Math.PI / 180
const toDegrees = (radians: number) => radians * 180 / Math.PI

export interface RouteProjection {
  point: GeoPoint
  segmentIndex: number
  fraction: number
  distanceMeters: number
}

export type GpsSignalTone = 'good' | 'medium' | 'weak'
export type RouteDeviation = 'on-route' | 'uncertain' | 'off-route'
export type LocationFreshness = 'live' | 'old' | 'stale'

export function haversineMeters(a: GeoPoint, b: GeoPoint): number {
  const latitudeDelta = toRadians(b.lat - a.lat)
  const longitudeDelta = toRadians(b.lng - a.lng)
  const aLat = toRadians(a.lat)
  const bLat = toRadians(b.lat)
  const value = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(aLat) * Math.cos(bLat) * Math.sin(longitudeDelta / 2) ** 2
  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.min(1, Math.sqrt(value)))
}

export function bearingDegrees(from: GeoPoint, to: GeoPoint): number {
  const fromLat = toRadians(from.lat)
  const toLat = toRadians(to.lat)
  const longitudeDelta = toRadians(to.lng - from.lng)
  const y = Math.sin(longitudeDelta) * Math.cos(toLat)
  const x = Math.cos(fromLat) * Math.sin(toLat) - Math.sin(fromLat) * Math.cos(toLat) * Math.cos(longitudeDelta)
  return (toDegrees(Math.atan2(y, x)) + 360) % 360
}

export function bearingLabel(degrees: number): { arrow: string; label: string } {
  const directions = [
    { arrow: '↑', label: '북쪽' },
    { arrow: '↗', label: '북동쪽' },
    { arrow: '→', label: '동쪽' },
    { arrow: '↘', label: '남동쪽' },
    { arrow: '↓', label: '남쪽' },
    { arrow: '↙', label: '남서쪽' },
    { arrow: '←', label: '서쪽' },
    { arrow: '↖', label: '북서쪽' },
  ]
  const normalized = ((degrees % 360) + 360) % 360
  return directions[Math.round(normalized / 45) % 8]
}

function toLocalMeters(point: GeoPoint, reference: GeoPoint): { x: number; y: number } {
  const latitude = toRadians((point.lat + reference.lat) / 2)
  return {
    x: toRadians(point.lng - reference.lng) * EARTH_RADIUS_METERS * Math.cos(latitude),
    y: toRadians(point.lat - reference.lat) * EARTH_RADIUS_METERS,
  }
}

function fromLocalMeters(x: number, y: number, reference: GeoPoint): GeoPoint {
  const latitude = reference.lat + toDegrees(y / EARTH_RADIUS_METERS)
  const middleLatitude = toRadians((latitude + reference.lat) / 2)
  return {
    lat: latitude,
    lng: reference.lng + toDegrees(x / (EARTH_RADIUS_METERS * Math.cos(middleLatitude))),
  }
}

export function projectToSegment(point: GeoPoint, start: GeoPoint, end: GeoPoint, segmentIndex = 0): RouteProjection {
  const endLocal = toLocalMeters(end, start)
  const pointLocal = toLocalMeters(point, start)
  const lengthSquared = endLocal.x ** 2 + endLocal.y ** 2
  const fraction = lengthSquared === 0
    ? 0
    : Math.max(0, Math.min(1, (pointLocal.x * endLocal.x + pointLocal.y * endLocal.y) / lengthSquared))
  const projectedX = endLocal.x * fraction
  const projectedY = endLocal.y * fraction
  const distanceMeters = Math.hypot(pointLocal.x - projectedX, pointLocal.y - projectedY)
  return { point: fromLocalMeters(projectedX, projectedY, start), segmentIndex, fraction, distanceMeters }
}

export function nearestRouteProjection(
  point: GeoPoint,
  route: GeoPoint[],
  startSegment = 0,
  endSegment = route.length - 2,
): RouteProjection | null {
  if (route.length < 2) return null
  const first = Math.max(0, Math.min(startSegment, route.length - 2))
  const last = Math.max(first, Math.min(endSegment, route.length - 2))
  let nearest: RouteProjection | null = null
  for (let index = first; index <= last; index += 1) {
    const projection = projectToSegment(point, route[index], route[index + 1], index)
    if (!nearest || projection.distanceMeters < nearest.distanceMeters) nearest = projection
  }
  return nearest
}

export function routeDistanceToIndex(
  current: GeoPoint,
  route: GeoPoint[],
  targetPointIndex: number,
  startPointIndex = 0,
): { distanceMeters: number; projection: RouteProjection | null; routeBased: boolean } {
  const targetIndex = Math.max(0, Math.min(targetPointIndex, route.length - 1))
  if (targetIndex === 0 || route.length < 2) {
    return { distanceMeters: haversineMeters(current, route[targetIndex] ?? current), projection: null, routeBased: false }
  }
  const startSegment = Math.max(0, Math.min(startPointIndex, targetIndex - 1))
  const projection = nearestRouteProjection(current, route, startSegment, targetIndex - 1)
  if (!projection) return { distanceMeters: haversineMeters(current, route[targetIndex]), projection: null, routeBased: false }

  let distanceMeters = haversineMeters(projection.point, route[projection.segmentIndex + 1])
  for (let index = projection.segmentIndex + 1; index < targetIndex; index += 1) {
    distanceMeters += haversineMeters(route[index], route[index + 1])
  }
  return { distanceMeters, projection, routeBased: true }
}

export function routeLengthMeters(route: GeoPoint[]): number {
  return route.slice(1).reduce((total, point, index) => total + haversineMeters(route[index], point), 0)
}

export function distanceAlongRoute(route: GeoPoint[], from: RouteProjection, to: RouteProjection): number {
  if (to.segmentIndex < from.segmentIndex || route.length < 2) return Number.POSITIVE_INFINITY
  if (to.segmentIndex === from.segmentIndex) return haversineMeters(from.point, to.point)
  let distance = haversineMeters(from.point, route[from.segmentIndex + 1])
  for (let index = from.segmentIndex + 1; index < to.segmentIndex; index += 1) {
    distance += haversineMeters(route[index], route[index + 1])
  }
  return distance + haversineMeters(route[to.segmentIndex], to.point)
}

export function routeDistanceToPoint(
  current: GeoPoint,
  route: GeoPoint[],
  target: GeoPoint,
  startSegment = 0,
): { distanceMeters: number; routeBased: boolean; currentProjection: RouteProjection | null; targetProjection: RouteProjection | null } {
  const currentProjection = nearestRouteProjection(current, route, startSegment)
  if (!currentProjection) return { distanceMeters: haversineMeters(current, target), routeBased: false, currentProjection: null, targetProjection: null }

  let targetProjection: RouteProjection | null = null
  let bestDistance = Number.POSITIVE_INFINITY
  for (let segment = currentProjection.segmentIndex; segment < route.length - 1; segment += 1) {
    const candidate = projectToSegment(target, route[segment], route[segment + 1], segment)
    const routeDistance = distanceAlongRoute(route, currentProjection, candidate)
    const total = routeDistance + candidate.distanceMeters
    if (total < bestDistance) {
      bestDistance = total
      targetProjection = candidate
    }
  }
  return targetProjection
    ? { distanceMeters: bestDistance, routeBased: true, currentProjection, targetProjection }
    : { distanceMeters: haversineMeters(current, target), routeBased: false, currentProjection, targetProjection: null }
}

export function routeDirectionTarget(route: GeoPoint[], projection: RouteProjection | null, targetPointIndex: number): GeoPoint | null {
  if (!projection || route.length === 0) return null
  const target = Math.max(0, Math.min(targetPointIndex, route.length - 1))
  const nextIndex = Math.min(target, Math.max(projection.segmentIndex + 1, projection.segmentIndex + 2))
  return route[nextIndex] ?? null
}

export function distanceToRoute(point: GeoPoint, route: GeoPoint[]): number {
  return nearestRouteProjection(point, route)?.distanceMeters ?? Number.POSITIVE_INFINITY
}

export function formatDistance(distanceMeters: number): string {
  if (!Number.isFinite(distanceMeters)) return '—'
  if (distanceMeters < 1_000) return `${Math.max(0, Math.round(distanceMeters / 5) * 5)} m`
  return `${(distanceMeters / 1_000).toFixed(1)} km`
}

export function walkingMinutes(distanceMeters: number, speedKilometersPerHour: number): number {
  if (!Number.isFinite(distanceMeters) || speedKilometersPerHour <= 0) return 0
  return Math.max(1, Math.ceil(distanceMeters / (speedKilometersPerHour * 1_000 / 60)))
}

export function gpsSignal(accuracyMeters: number): { tone: GpsSignalTone; label: string } {
  if (accuracyMeters <= 15) return { tone: 'good', label: 'GPS 신호 좋음' }
  if (accuracyMeters <= 30) return { tone: 'medium', label: 'GPS 신호 보통' }
  return { tone: 'weak', label: 'GPS 신호 약함' }
}

export function routeDeviation(distanceMeters: number, accuracyMeters: number, thresholdMeters = 55): RouteDeviation {
  if (!Number.isFinite(distanceMeters) || !Number.isFinite(accuracyMeters) || accuracyMeters > 45) return 'uncertain'
  if (distanceMeters - accuracyMeters > thresholdMeters) return 'off-route'
  if (distanceMeters + accuracyMeters <= thresholdMeters) return 'on-route'
  return 'uncertain'
}

export function locationFreshness(ageSeconds: number): LocationFreshness {
  if (ageSeconds < 15) return 'live'
  if (ageSeconds < 45) return 'old'
  return 'stale'
}

export function hasArrived(
  distanceMeters: number,
  radiusMeters: number,
  accuracyMeters: number,
  options: { approximate?: boolean; ageSeconds?: number } = {},
): boolean {
  if (options.approximate || locationFreshness(options.ageSeconds ?? 0) === 'stale') return false
  return accuracyMeters <= 30 && distanceMeters <= radiusMeters
}

const taipeiFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Taipei',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
})

export interface TaipeiClock {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
  minuteOfDay: number
}

export function getTaipeiClock(timestamp: number): TaipeiClock {
  const parts = Object.fromEntries(taipeiFormatter.formatToParts(new Date(timestamp)).map((part) => [part.type, part.value]))
  const hour = Number(parts.hour)
  const minute = Number(parts.minute)
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour,
    minute,
    second: Number(parts.second),
    minuteOfDay: hour * 60 + minute,
  }
}

export function timeToMinutes(time: string, fallback = 10 * 60 + 45): number {
  const [hour, minute] = time.split(':').map(Number)
  return Number.isFinite(hour) && Number.isFinite(minute) ? hour * 60 + minute : fallback
}

export function formatMinuteOfDay(value: number): string {
  const normalized = (Math.round(value) + 1_440) % 1_440
  return `${String(Math.floor(normalized / 60)).padStart(2, '0')}:${String(normalized % 60).padStart(2, '0')}`
}

export interface FieldScheduleEstimate {
  estimatedMeetingMinute: number
  hardReturnStartMinute: number
  minutesToTarget: number
  tone: 'normal' | 'compact' | 'return-now' | 'late'
  message: string
}

export function estimateFieldSchedule({
  nowMinute,
  returnTarget,
  remainingRouteMeters,
  remainingDwellMinutes,
  walkingSpeedKilometersPerHour,
  returnWalkMeters,
  safetyBufferMinutes = 5,
}: {
  nowMinute: number
  returnTarget: string
  remainingRouteMeters: number
  remainingDwellMinutes: number
  walkingSpeedKilometersPerHour: number
  returnWalkMeters: number
  safetyBufferMinutes?: number
}): FieldScheduleEstimate {
  const targetMinute = timeToMinutes(returnTarget)
  const routeWalk = walkingMinutes(remainingRouteMeters, walkingSpeedKilometersPerHour)
  const returnWalk = walkingMinutes(returnWalkMeters, walkingSpeedKilometersPerHour)
  const estimatedMeetingMinute = nowMinute + routeWalk + remainingDwellMinutes + safetyBufferMinutes
  const hardReturnStartMinute = targetMinute - returnWalk - safetyBufferMinutes
  const minutesToTarget = targetMinute - nowMinute

  if (nowMinute >= targetMinute) return { estimatedMeetingMinute, hardReturnStartMinute, minutesToTarget, tone: 'late', message: `${formatMinuteOfDay(targetMinute)} 차량 합류 목표가 지났습니다. 즉시 기사에게 연락하세요.` }
  if (nowMinute >= hardReturnStartMinute) return { estimatedMeetingMinute, hardReturnStartMinute, minutesToTarget, tone: 'return-now', message: `${formatMinuteOfDay(nowMinute)}입니다. 현재 위치와 관계없이 차량 복귀를 시작하세요.` }
  if (estimatedMeetingMinute > targetMinute) return { estimatedMeetingMinute, hardReturnStartMinute, minutesToTarget, tone: 'compact', message: `현재 코스를 계속하면 차량 합류가 약 ${formatMinuteOfDay(estimatedMeetingMinute)}로 예상됩니다. Compact 전환을 권합니다.` }
  return { estimatedMeetingMinute, hardReturnStartMinute, minutesToTarget, tone: 'normal', message: `${formatMinuteOfDay(targetMinute)} 차량 합류까지 보수적으로 여유가 있습니다.` }
}

export function geolocationErrorMessage(code: number): string {
  if (code === 1) return 'GPS 위치 권한이 꺼져 있습니다. 설정에서 위치 권한을 허용하면 현재 위치를 볼 수 있습니다.'
  if (code === 2) return '현재 위치를 가져올 수 없습니다. 지도와 해설은 계속 사용할 수 있습니다.'
  if (code === 3) return 'GPS 응답 시간이 초과되었습니다. 하늘이 잘 보이는 곳에서 다시 시도해 주세요.'
  return 'GPS를 시작하지 못했습니다. 지도와 해설은 계속 사용할 수 있습니다.'
}
