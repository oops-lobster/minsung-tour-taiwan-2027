export interface RouteCoordinate {
  latitude: number
  longitude: number
}

export const ROUTE_MAP_WIDTH = 640
export const ROUTE_MAP_HEIGHT = 480
export const ROUTE_MAP_ZOOM = 10
const TILE_SIZE = 256
const WORLD_SIZE = TILE_SIZE * 2 ** ROUTE_MAP_ZOOM

// The basemap, markers and route use the SAME Web Mercator transform.
// Do not position markers with CSS percentages over an unrelated outline.
export function toRouteWorldPoint({ latitude, longitude }: RouteCoordinate) {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)
    || Math.abs(latitude) > 85.05112878 || Math.abs(longitude) > 180) {
    throw new RangeError('Invalid route-map coordinate')
  }
  const sine = Math.sin(latitude * Math.PI / 180)
  return {
    x: (longitude + 180) / 360 * WORLD_SIZE,
    y: (0.5 - Math.log((1 + sine) / (1 - sine)) / (4 * Math.PI)) * WORLD_SIZE,
  }
}

export function buildRouteMapLayout(coordinates: readonly RouteCoordinate[]) {
  if (coordinates.length < 2) throw new RangeError('At least two route stops are required')
  const worldPoints = coordinates.map(toRouteWorldPoint)
  const minX = Math.min(...worldPoints.map((point) => point.x))
  const maxX = Math.max(...worldPoints.map((point) => point.x))
  const minY = Math.min(...worldPoints.map((point) => point.y))
  const maxY = Math.max(...worldPoints.map((point) => point.y))
  const scale = Math.min(
    (ROUTE_MAP_WIDTH - 156) / Math.max(1, maxX - minX),
    (ROUTE_MAP_HEIGHT - 176) / Math.max(1, maxY - minY),
  )
  const origin = {
    x: (minX + maxX) / 2 - ROUTE_MAP_WIDTH / scale / 2,
    y: (minY + maxY) / 2 - ROUTE_MAP_HEIGHT / scale / 2,
  }
  const projectWorld = (point: { x: number; y: number }) => ({
    x: (point.x - origin.x) * scale,
    y: (point.y - origin.y) * scale,
  })
  const points = worldPoints.map(projectWorld)
  const tiles: Array<{ column: number; row: number; x: number; y: number; size: number }> = []
  for (let column = Math.floor(origin.x / TILE_SIZE); column < Math.ceil((origin.x + ROUTE_MAP_WIDTH / scale) / TILE_SIZE); column += 1) {
    for (let row = Math.floor(origin.y / TILE_SIZE); row < Math.ceil((origin.y + ROUTE_MAP_HEIGHT / scale) / TILE_SIZE); row += 1) {
      tiles.push({ column, row, ...projectWorld({ x: column * TILE_SIZE, y: row * TILE_SIZE }), size: TILE_SIZE * scale })
    }
  }
  return { points, tiles, scale, origin, routePoints: points.map((point) => `${point.x},${point.y}`).join(' ') }
}
