import assert from 'node:assert/strict'
import test from 'node:test'
import { yehliuGpsRoute, yehliuGpsStops } from '../src/data/yehliuGpsRoute.ts'
import {
  bearingDegrees,
  bearingLabel,
  distanceToRoute,
  formatDistance,
  geolocationErrorMessage,
  gpsSignal,
  hasArrived,
  haversineMeters,
  routeDeviation,
  routeDistanceToIndex,
  walkingMinutes,
} from '../src/lib/yehliuGps.ts'

test('haversine distance is stable for a known short latitude interval', () => {
  const distance = haversineMeters({ lat: 25, lng: 121 }, { lat: 25.001, lng: 121 })
  assert.ok(distance > 110 && distance < 112)
})

test('bearing is simplified to the correct Korean 8-way label', () => {
  const degrees = bearingDegrees({ lat: 25, lng: 121 }, { lat: 25.001, lng: 121.001 })
  assert.equal(bearingLabel(degrees).label, '북동쪽')
})

test('route distance projects onto the active segment and follows the polyline', () => {
  const route = [
    { lat: 25, lng: 121 },
    { lat: 25, lng: 121.001 },
    { lat: 25.001, lng: 121.001 },
  ]
  const result = routeDistanceToIndex({ lat: 25.00002, lng: 121.0005 }, route, 2)
  assert.equal(result.routeBased, true)
  assert.ok(result.distanceMeters > 150 && result.distanceMeters < 170)
})

test('route deviation reduces warning strength for poor GPS accuracy', () => {
  assert.equal(routeDeviation(70, 8), 'off-route')
  assert.equal(routeDeviation(70, 50), 'uncertain')
  assert.equal(routeDeviation(20, 8), 'on-route')
})

test('arrival detection avoids poor-accuracy false positives', () => {
  assert.equal(hasArrived(18, 25, 8), true)
  assert.equal(hasArrived(18, 25, 45), false)
  assert.equal(hasArrived(40, 25, 8), false)
})

test('display helpers use outdoor-friendly rounded values', () => {
  assert.equal(formatDistance(183), '185 m')
  assert.equal(formatDistance(1_240), '1.2 km')
  assert.equal(walkingMinutes(180, 3.5), 4)
  assert.deepEqual(gpsSignal(7), { tone: 'good', label: 'GPS 신호 좋음' })
  assert.match(geolocationErrorMessage(1), /권한/)
})

test('Yehliu GPS data has valid ordered route indices and explicit approximate flags', () => {
  assert.equal(yehliuGpsStops.length, 9)
  assert.ok(yehliuGpsRoute.length > 20)
  for (let index = 1; index < yehliuGpsStops.length; index += 1) {
    assert.ok(yehliuGpsStops[index].order > yehliuGpsStops[index - 1].order)
    assert.ok(yehliuGpsStops[index].routePointIndex >= yehliuGpsStops[index - 1].routePointIndex)
  }
  assert.ok(yehliuGpsStops.some((stop) => stop.approximate))
  assert.ok(distanceToRoute(yehliuGpsStops[0], yehliuGpsRoute) < 1)
})
