import assert from 'node:assert/strict'
import test from 'node:test'
import { yehliuGpsFacilities, yehliuGpsStops, yehliuRouteDefinitions } from '../src/data/yehliuGpsRoute.ts'
import { yehliuRouteModes, yehliuSources, yehliuStops } from '../src/data/yehliuGuide.ts'
import {
  bearingDegrees, bearingLabel, distanceAlongRoute, estimateFieldSchedule, formatDistance, getTaipeiClock,
  gpsSignal, hasArrived, haversineMeters, locationFreshness, nearestRouteProjection, routeDeviation,
  routeDistanceToIndex, routeDistanceToPoint, routeLengthMeters, walkingMinutes,
} from '../src/lib/yehliuGps.ts'

test('haversine, bearing and outdoor display helpers are stable', () => {
  const distance = haversineMeters({ lat: 25, lng: 121 }, { lat: 25.001, lng: 121 })
  assert.ok(distance > 110 && distance < 112)
  assert.equal(bearingLabel(bearingDegrees({ lat: 25, lng: 121 }, { lat: 25.001, lng: 121.001 })).label, '북동쪽')
  assert.equal(formatDistance(183), '185 m')
  assert.equal(formatDistance(1_240), '1.2 km')
  assert.equal(walkingMinutes(180, 3.5), 4)
  assert.deepEqual(gpsSignal(7), { tone: 'good', label: 'GPS 신호 좋음' })
})

test('route projection follows the active segment instead of direct-distance shortcuts', () => {
  const route = [{ lat: 25, lng: 121 }, { lat: 25, lng: 121.001 }, { lat: 25.001, lng: 121.001 }]
  const result = routeDistanceToIndex({ lat: 25.00002, lng: 121.0005 }, route, 2)
  assert.equal(result.routeBased, true)
  assert.ok(result.distanceMeters > 150 && result.distanceMeters < 170)
  const from = nearestRouteProjection({ lat: 25, lng: 121.0005 }, route)!
  const to = nearestRouteProjection({ lat: 25.0005, lng: 121.001 }, route)!
  assert.ok(distanceAlongRoute(route, from, to) > haversineMeters(from.point, to.point))
})

test('poor accuracy and stale fixes never create false route or arrival confidence', () => {
  assert.equal(routeDeviation(70, 8), 'off-route')
  assert.equal(routeDeviation(70, 50), 'uncertain')
  assert.equal(routeDeviation(20, 8), 'on-route')
  assert.equal(locationFreshness(4), 'live')
  assert.equal(locationFreshness(20), 'old')
  assert.equal(locationFreshness(50), 'stale')
  assert.equal(hasArrived(18, 25, 8), true)
  assert.equal(hasArrived(18, 25, 45), false)
  assert.equal(hasArrived(18, 25, 8, { approximate: true }), false)
  assert.equal(hasArrived(18, 25, 8, { ageSeconds: 50 }), false)
})

test('one canonical stop list drives guide and GPS with resolvable sources', () => {
  assert.strictEqual(yehliuGpsStops, yehliuStops)
  assert.equal(yehliuStops.length, 8)
  assert.equal(new Set(yehliuStops.map((stop) => stop.id)).size, yehliuStops.length)
  const sourceIds = new Set(yehliuSources.map((source) => source.id))
  for (const stop of yehliuStops) {
    assert.ok(stop.sourceRefs.length > 0)
    assert.ok(stop.sourceRefs.every((ref) => sourceIds.has(ref.sourceId)))
    if (!stop.autoArrival) assert.match(stop.coordinateConfidence, /approx|zone/)
  }
})

test('route modes omit optional stops and number only active stops consecutively', () => {
  const compact = yehliuRouteDefinitions.compact
  const standard = yehliuRouteDefinitions.standard
  const deep = yehliuRouteDefinitions.deep
  assert.ok(!compact.stopIds.includes('fossil-zone'))
  assert.ok(!compact.stopIds.includes('shape-structure-zone'))
  assert.ok(standard.stopIds.includes('fossil-zone'))
  assert.ok(!standard.stopIds.includes('shape-structure-zone'))
  assert.ok(deep.stopIds.includes('shape-structure-zone'))
  assert.ok(routeLengthMeters(deep.path) > routeLengthMeters(standard.path))
  for (const mode of yehliuRouteModes) assert.deepEqual(mode.stopIds.map((_, index) => index + 1), Array.from({ length: mode.stopIds.length }, (_, index) => index + 1))
})

test('canonical stops occur in forward route order and return ends at the vehicle fallback', () => {
  for (const definition of Object.values(yehliuRouteDefinitions)) {
    let startSegment = 0
    for (const stopId of definition.stopIds) {
      const stop = yehliuStops.find((item) => item.id === stopId)!
      const projection = nearestRouteProjection(stop, definition.path, Math.max(0, startSegment - 2))
      assert.ok(projection, `${definition.id}:${stopId} has a route projection`)
      assert.ok(projection!.segmentIndex + 2 >= startSegment, `${definition.id}:${stopId} does not move backward unexpectedly`)
      startSegment = Math.max(startSegment, projection!.segmentIndex)
    }
  }
})

test('saved meeting point and restroom distance can be measured along the route', () => {
  const route = yehliuRouteDefinitions.standard.path
  const queen = yehliuStops.find((stop) => stop.id === 'queens-head')!
  const meeting = { lat: 25.20570, lng: 121.69042 }
  const result = routeDistanceToPoint(queen, route, meeting)
  assert.equal(result.routeBased, true)
  assert.ok(result.distanceMeters > 300)
  const restroom = routeDistanceToPoint(queen, route, yehliuGpsFacilities[2])
  assert.equal(restroom.routeBased, true)
  assert.ok(restroom.distanceMeters < result.distanceMeters)
})

test('Asia/Taipei clock is independent from a Korea device timezone', () => {
  const timestamp = Date.UTC(2027, 1, 21, 1, 20, 0)
  assert.deepEqual(getTaipeiClock(timestamp), { year: 2027, month: 2, day: 21, hour: 9, minute: 20, second: 0, minuteOfDay: 560 })
})

test('field schedule escalates from normal to compact, return-now and late', () => {
  const base = { returnTarget: '10:45', walkingSpeedKilometersPerHour: 3, returnWalkMeters: 1_000 }
  assert.equal(estimateFieldSchedule({ ...base, nowMinute: 9 * 60 + 20, remainingRouteMeters: 500, remainingDwellMinutes: 18 }).tone, 'normal')
  assert.equal(estimateFieldSchedule({ ...base, nowMinute: 10 * 60 + 5, remainingRouteMeters: 1_000, remainingDwellMinutes: 20 }).tone, 'compact')
  assert.equal(estimateFieldSchedule({ ...base, nowMinute: 10 * 60 + 20, remainingRouteMeters: 0, remainingDwellMinutes: 0 }).tone, 'return-now')
  assert.equal(estimateFieldSchedule({ ...base, nowMinute: 10 * 60 + 25, remainingRouteMeters: 0, remainingDwellMinutes: 0 }).tone, 'return-now')
  assert.equal(estimateFieldSchedule({ ...base, nowMinute: 10 * 60 + 45, remainingRouteMeters: 0, remainingDwellMinutes: 0 }).tone, 'late')
})
