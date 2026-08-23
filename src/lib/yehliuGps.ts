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
  if (distanceMeters <= thresholdMeters) return 'on-route'
  return accuracyMeters > 30 ? 'uncertain' : 'off-route'
}

export function hasArrived(distanceMeters: number, radiusMeters: number, accuracyMeters: number): boolean {
  return accuracyMeters <= 30 && distanceMeters <= radiusMeters
}

export function geolocationErrorMessage(code: number): string {
  if (code === 1) return 'GPS 위치 권한이 꺼져 있습니다. 설정에서 위치 권한을 허용하면 현재 위치를 볼 수 있습니다.'
  if (code === 2) return '현재 위치를 가져올 수 없습니다. 지도와 해설은 계속 사용할 수 있습니다.'
  if (code === 3) return 'GPS 응답 시간이 초과되었습니다. 하늘이 잘 보이는 곳에서 다시 시도해 주세요.'
  return 'GPS를 시작하지 못했습니다. 지도와 해설은 계속 사용할 수 있습니다.'
}
