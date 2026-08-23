import assert from 'node:assert/strict'
import test from 'node:test'
import { migrateLegacyYehliuValues } from '../src/lib/useYehliuFieldSession.ts'

test('legacy guide and GPS progress migrate once into canonical stop IDs', () => {
  const session = migrateLegacyYehliuValues({
    guideVisited: [0, 1, 2, 6],
    gpsVisited: ['entrance', 'candle-rocks', 'queens-head'],
    gpsSkipped: ['shape-rocks', 'exit'],
    routeId: 'deep',
    returnTarget: '10:47',
    walkingPace: 'normal',
  })
  assert.deepEqual(session.visitedStopIds, ['visitor-center', 'candle-potholes', 'queens-head'])
  assert.deepEqual(session.skippedStopIds, ['shape-structure-zone', 'vehicle-return'])
  assert.equal(session.routeId, 'deep')
  assert.equal(session.returnTarget, '10:47')
  assert.equal(session.walkingPace, 'normal')
})

test('invalid legacy values fall back safely without phantom stops', () => {
  const session = migrateLegacyYehliuValues({ guideVisited: [99, 'x'], gpsVisited: ['unknown'], routeId: 'full', returnTarget: '88:00' })
  assert.deepEqual(session.visitedStopIds, [])
  assert.deepEqual(session.skippedStopIds, [])
  assert.equal(session.routeId, 'standard')
  assert.equal(session.returnTarget, '10:45')
})
