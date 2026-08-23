import { useCallback, useEffect, useState } from 'react'
import { yehliuRouteModes, type YehliuRouteId, type YehliuStopId } from '../data/yehliuGuide.ts'

export interface SavedMeetingPoint {
  lat: number
  lng: number
  accuracy: number
  savedAt: string
  note?: string
}

export interface YehliuFieldSession {
  version: 2
  routeId: YehliuRouteId
  visitedStopIds: YehliuStopId[]
  skippedStopIds: YehliuStopId[]
  currentStopId: YehliuStopId
  vehicleMeetingPoint?: SavedMeetingPoint
  returnTarget: string
  walkingPace: 'relaxed' | 'normal'
  returningToVehicle: boolean
  updatedAt: string
}

interface LegacyYehliuValues {
  guideVisited?: unknown
  gpsVisited?: unknown
  gpsSkipped?: unknown
  routeId?: unknown
  returnTarget?: unknown
  walkingPace?: unknown
}

const sessionKey = 'minsung-yehliu-field-session-v2'
const legacyKeys = [
  'minsung-yehliu-visited-v1',
  'minsung-yehliu-gps-visited-v1',
  'minsung-yehliu-gps-skipped-v1',
  'minsung-yehliu-route-v1',
  'minsung-yehliu-return-time-v1',
  'minsung-yehliu-walking-pace-v1',
]

const stopIds = new Set<YehliuStopId>(yehliuRouteModes.find((route) => route.id === 'deep')!.stopIds)
const oldGuideMap: Record<number, YehliuStopId> = {
  0: 'visitor-center',
  1: 'candle-potholes',
  2: 'candle-potholes',
  3: 'mushroom-rocks',
  4: 'fossil-zone',
  5: 'shape-structure-zone',
  6: 'queens-head',
  7: 'queens-bookstore',
  8: 'vehicle-return',
}
const oldGpsMap: Record<string, YehliuStopId> = {
  'visitor-center': 'visitor-center',
  entrance: 'visitor-center',
  'candle-rocks': 'candle-potholes',
  'candle-potholes': 'candle-potholes',
  'mushroom-rocks': 'mushroom-rocks',
  'fossil-zone': 'fossil-zone',
  'queens-head': 'queens-head',
  'shape-rocks': 'shape-structure-zone',
  'shape-structure-zone': 'shape-structure-zone',
  'queens-bookstore': 'queens-bookstore',
  exit: 'vehicle-return',
  'vehicle-return': 'vehicle-return',
}

const uniqueStops = (values: YehliuStopId[]) => [...new Set(values)]

const parseJson = (value: string | null): unknown => {
  try { return JSON.parse(value ?? 'null') } catch { return null }
}

const isRouteId = (value: unknown): value is YehliuRouteId => yehliuRouteModes.some((route) => route.id === value)
const isTime = (value: unknown): value is string => typeof value === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(value)

export function migrateLegacyYehliuValues(values: LegacyYehliuValues): YehliuFieldSession {
  const fromGuide = Array.isArray(values.guideVisited)
    ? values.guideVisited.flatMap((value) => Number.isInteger(value) && oldGuideMap[Number(value)] ? [oldGuideMap[Number(value)]] : [])
    : []
  const fromGps = Array.isArray(values.gpsVisited)
    ? values.gpsVisited.flatMap((value) => typeof value === 'string' && oldGpsMap[value] ? [oldGpsMap[value]] : [])
    : []
  const skipped = Array.isArray(values.gpsSkipped)
    ? values.gpsSkipped.flatMap((value) => typeof value === 'string' && oldGpsMap[value] ? [oldGpsMap[value]] : [])
    : []
  const visitedStopIds = uniqueStops([...fromGuide, ...fromGps]).filter((id) => stopIds.has(id))
  const skippedStopIds = uniqueStops(skipped).filter((id) => stopIds.has(id) && !visitedStopIds.includes(id))

  return {
    version: 2,
    routeId: isRouteId(values.routeId) ? values.routeId : 'standard',
    visitedStopIds,
    skippedStopIds,
    currentStopId: 'visitor-center',
    returnTarget: isTime(values.returnTarget) ? values.returnTarget : '10:45',
    walkingPace: values.walkingPace === 'normal' ? 'normal' : 'relaxed',
    returningToVehicle: false,
    updatedAt: new Date().toISOString(),
  }
}

const isSession = (value: unknown): value is YehliuFieldSession => {
  if (!value || typeof value !== 'object') return false
  const session = value as Partial<YehliuFieldSession>
  return session.version === 2
    && isRouteId(session.routeId)
    && typeof session.currentStopId === 'string'
    && stopIds.has(session.currentStopId as YehliuStopId)
    && Array.isArray(session.visitedStopIds)
    && Array.isArray(session.skippedStopIds)
    && isTime(session.returnTarget)
}

function readInitialSession(): YehliuFieldSession {
  const current = parseJson(window.localStorage.getItem(sessionKey))
  if (isSession(current)) return current

  const migrated = migrateLegacyYehliuValues({
    guideVisited: parseJson(window.localStorage.getItem(legacyKeys[0])),
    gpsVisited: parseJson(window.localStorage.getItem(legacyKeys[1])),
    gpsSkipped: parseJson(window.localStorage.getItem(legacyKeys[2])),
    routeId: window.localStorage.getItem(legacyKeys[3]),
    returnTarget: window.localStorage.getItem(legacyKeys[4]),
    walkingPace: window.localStorage.getItem(legacyKeys[5]),
  })
  window.localStorage.setItem(sessionKey, JSON.stringify(migrated))
  legacyKeys.forEach((key) => window.localStorage.removeItem(key))
  return migrated
}

export function useYehliuFieldSession() {
  const [session, setSession] = useState<YehliuFieldSession>(readInitialSession)

  useEffect(() => {
    window.localStorage.setItem(sessionKey, JSON.stringify(session))
  }, [session])

  const update = useCallback((recipe: (current: YehliuFieldSession) => YehliuFieldSession) => {
    setSession((current) => ({ ...recipe(current), updatedAt: new Date().toISOString() }))
  }, [])

  const setRouteId = useCallback((routeId: YehliuRouteId) => update((current) => {
    const route = yehliuRouteModes.find((item) => item.id === routeId) ?? yehliuRouteModes[1]
    const currentStopId = route.stopIds.includes(current.currentStopId)
      ? current.currentStopId
      : route.stopIds.find((id) => !current.visitedStopIds.includes(id) && !current.skippedStopIds.includes(id)) ?? route.stopIds[0]
    return { ...current, routeId, currentStopId }
  }), [update])

  const setCurrentStopId = useCallback((currentStopId: YehliuStopId) => update((current) => ({ ...current, currentStopId })), [update])

  const markVisited = useCallback((stopId: YehliuStopId) => update((current) => ({
    ...current,
    visitedStopIds: uniqueStops([...current.visitedStopIds, stopId]),
    skippedStopIds: current.skippedStopIds.filter((id) => id !== stopId),
  })), [update])

  const toggleVisited = useCallback((stopId: YehliuStopId) => update((current) => ({
    ...current,
    visitedStopIds: current.visitedStopIds.includes(stopId)
      ? current.visitedStopIds.filter((id) => id !== stopId)
      : uniqueStops([...current.visitedStopIds, stopId]),
    skippedStopIds: current.skippedStopIds.filter((id) => id !== stopId),
  })), [update])

  const skipStop = useCallback((stopId: YehliuStopId) => update((current) => ({
    ...current,
    skippedStopIds: uniqueStops([...current.skippedStopIds, stopId]),
    visitedStopIds: current.visitedStopIds.filter((id) => id !== stopId),
  })), [update])

  const saveMeetingPoint = useCallback((vehicleMeetingPoint: SavedMeetingPoint) => update((current) => ({ ...current, vehicleMeetingPoint })), [update])
  const setReturnTarget = useCallback((returnTarget: string) => update((current) => ({ ...current, returnTarget })), [update])
  const setWalkingPace = useCallback((walkingPace: 'relaxed' | 'normal') => update((current) => ({ ...current, walkingPace })), [update])
  const returnToVehicle = useCallback(() => update((current) => ({ ...current, currentStopId: 'vehicle-return', returningToVehicle: true })), [update])

  const reset = useCallback(() => update((current) => ({
    ...current,
    visitedStopIds: [],
    skippedStopIds: [],
    currentStopId: yehliuRouteModes.find((route) => route.id === current.routeId)?.stopIds[0] ?? 'visitor-center',
    returningToVehicle: false,
  })), [update])

  return {
    session,
    setRouteId,
    setCurrentStopId,
    markVisited,
    toggleVisited,
    skipStop,
    saveMeetingPoint,
    setReturnTarget,
    setWalkingPace,
    returnToVehicle,
    reset,
  }
}
