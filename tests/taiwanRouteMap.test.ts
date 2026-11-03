import assert from 'node:assert/strict'
import test from 'node:test'
import { buildRouteMapLayout, toRouteWorldPoint, ROUTE_MAP_WIDTH, ROUTE_MAP_HEIGHT } from '../src/lib/taiwanRouteMap.ts'

const stops = [
  { latitude: 25.07702, longitude: 121.23198 },
  { latitude: 25.035, longitude: 121.5061 },
  { latitude: 25.2053, longitude: 121.6905 },
  { latitude: 25.0434, longitude: 121.775 },
  { latitude: 25.1099, longitude: 121.8452 },
]

test('north-up geography: Jiufen is northeast of Shifen, airport is west of Taipei', () => {
  const [airport, taipei, yehliu, shifen, jiufen] = buildRouteMapLayout(stops).points
  assert.ok(airport.x < taipei.x)
  assert.ok(airport.y < taipei.y)
  assert.ok(yehliu.y < taipei.y && yehliu.x > taipei.x)
  assert.ok(jiufen.x > shifen.x && jiufen.y < shifen.y)
})

test('all marker circles fit and stay separated at desktop and mobile sizes', () => {
  const { points } = buildRouteMapLayout(stops)
  for (const point of points) {
    assert.ok(point.x > 26 && point.x < ROUTE_MAP_WIDTH - 26)
    assert.ok(point.y > 50 && point.y < ROUTE_MAP_HEIGHT - 60)
  }
  for (const renderedWidth of [264, 320, 375, 480, 640]) {
    for (let i = 0; i < points.length; i += 1) {
      for (let j = i + 1; j < points.length; j += 1) {
        const distance = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y)
        assert.ok((distance - 44) * renderedWidth / ROUTE_MAP_WIDTH > 8)
      }
    }
  }
})

test('route vertices, tiles and markers share the identical projection', () => {
  const layout = buildRouteMapLayout(stops)
  const vertices = layout.routePoints.split(' ').map((point) => point.split(',').map(Number))
  stops.forEach((stop, index) => {
    const world = toRouteWorldPoint(stop)
    assert.equal(layout.points[index].x, (world.x - layout.origin.x) * layout.scale)
    assert.equal(layout.points[index].y, (world.y - layout.origin.y) * layout.scale)
    assert.deepEqual(vertices[index], [layout.points[index].x, layout.points[index].y])
    const tile = layout.tiles.find((item) => item.column === Math.floor(world.x / 256) && item.row === Math.floor(world.y / 256))
    assert.ok(tile)
    assert.ok(Math.abs(tile.x + (world.x / 256 - tile.column) * tile.size - vertices[index][0]) < 1e-8)
    assert.ok(Math.abs(tile.y + (world.y / 256 - tile.row) * tile.size - vertices[index][1]) < 1e-8)
  })
  assert.ok(layout.tiles.length <= 12)
})

test('invalid coordinates fail explicitly instead of drawing a misplaced marker', () => {
  assert.throws(() => toRouteWorldPoint({ latitude: NaN, longitude: 121 }), RangeError)
  assert.throws(() => toRouteWorldPoint({ latitude: 90, longitude: 121 }), RangeError)
  assert.throws(() => buildRouteMapLayout([]), RangeError)
})
