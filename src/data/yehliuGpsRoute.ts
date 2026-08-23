import {
  yehliuRouteModes,
  yehliuStops,
  type CoordinateConfidence,
  type YehliuRouteId,
  type YehliuStop,
  type YehliuStopId,
} from './yehliuGuide.ts'

export interface GeoPoint {
  lat: number
  lng: number
}

export type YehliuGpsStop = YehliuStop

export interface YehliuRouteDefinition {
  id: YehliuRouteId
  stopIds: YehliuStopId[]
  path: GeoPoint[]
  targetDurationMinutes: [number, number]
  recommendedToday: boolean
  returnPathStartIndex: number
}

export interface YehliuGpsFacility extends GeoPoint {
  id: string
  nameKo: string
  nameZh: string
  coordinateConfidence: CoordinateConfidence
  coordinateNote: string
  sourceId: string
}

export interface YehliuGpsSource {
  id: string
  title: string
  organization: string
  url: string
  checked: string
  note: string
}

/**
 * 실제 지리관계를 유지하는 현장용 보행선입니다.
 * OSM footway/boardwalk geometry를 단순화했으며 통제선이나 현장 보행 지시를 대체하지 않습니다.
 * 마지막 구간은 Queen's Bookstore에서 입구로 되돌아오는 공식 퇴장 방향의 개략 복귀선입니다.
 */
export const yehliuGpsRoute: GeoPoint[] = [
  { lat: 25.2053871, lng: 121.6901077 },
  { lat: 25.2054154, lng: 121.6903605 },
  { lat: 25.2056713, lng: 121.6904145 },
  { lat: 25.2058632, lng: 121.6906894 },
  { lat: 25.2062307, lng: 121.6910273 },
  { lat: 25.2064429, lng: 121.6912777 },
  { lat: 25.2065440, lng: 121.6915128 },
  { lat: 25.2067537, lng: 121.6916275 },
  { lat: 25.2069086, lng: 121.6916558 },
  { lat: 25.2071374, lng: 121.6917195 },
  { lat: 25.2072449, lng: 121.6918351 },
  { lat: 25.2073211, lng: 121.6920121 },
  { lat: 25.2074001, lng: 121.6921697 },
  { lat: 25.2074757, lng: 121.6923233 },
  { lat: 25.2075933, lng: 121.6922750 },
  { lat: 25.2075989, lng: 121.6921052 },
  { lat: 25.2078133, lng: 121.6919607 },
  { lat: 25.2080369, lng: 121.6918446 },
  { lat: 25.2076376, lng: 121.6910999 },
  { lat: 25.2076395, lng: 121.6906537 },
  { lat: 25.2076376, lng: 121.6910999 },
  { lat: 25.2080369, lng: 121.6918446 },
  { lat: 25.2079437, lng: 121.6919598 },
  { lat: 25.2075989, lng: 121.6921052 },
  { lat: 25.2075933, lng: 121.6922750 },
  { lat: 25.2074757, lng: 121.6923233 },
  { lat: 25.2075664, lng: 121.6925566 },
  { lat: 25.2076695, lng: 121.6927119 },
  { lat: 25.2077743, lng: 121.6927996 },
  { lat: 25.2078301, lng: 121.6928685 },
  { lat: 25.2079370, lng: 121.6929977 },
  { lat: 25.2080231, lng: 121.6931061 },
  { lat: 25.2081521, lng: 121.6932696 },
  { lat: 25.2081660, lng: 121.6933337 },
  { lat: 25.2082456, lng: 121.6934581 },
  { lat: 25.2084573, lng: 121.6933683 },
  { lat: 25.2085655, lng: 121.6933823 },
  { lat: 25.2086090, lng: 121.6934125 },
  { lat: 25.2086527, lng: 121.6934392 },
  { lat: 25.2086872, lng: 121.6935366 },
  { lat: 25.2086945, lng: 121.6934919 },
  { lat: 25.2087085, lng: 121.6934285 },
  { lat: 25.2087104, lng: 121.6933683 },
  { lat: 25.2086933, lng: 121.6933237 },
  { lat: 25.2086580, lng: 121.6932898 },
  { lat: 25.2086239, lng: 121.6932183 },
  { lat: 25.2085720, lng: 121.6932077 },
  { lat: 25.2086059, lng: 121.6930890 },
  { lat: 25.2086739, lng: 121.6930789 },
  { lat: 25.2087095, lng: 121.6930930 },
  { lat: 25.2087472, lng: 121.6931135 },
  { lat: 25.2087772, lng: 121.6931937 },
  { lat: 25.2089354, lng: 121.6932813 },
  { lat: 25.2089542, lng: 121.6933117 },
  { lat: 25.2089509, lng: 121.6933621 },
  { lat: 25.2089864, lng: 121.6933979 },
  { lat: 25.2089750, lng: 121.6934483 },
  { lat: 25.2089348, lng: 121.6935098 },
  { lat: 25.2089342, lng: 121.6935494 },
  { lat: 25.2094273, lng: 121.6933791 },
  { lat: 25.2089342, lng: 121.6935494 },
  { lat: 25.2089300, lng: 121.6935814 },
  { lat: 25.2089951, lng: 121.6936428 },
  { lat: 25.2090152, lng: 121.6937248 },
  { lat: 25.2088896, lng: 121.6938796 },
  { lat: 25.2089712, lng: 121.6939550 },
  { lat: 25.2090117, lng: 121.6940107 },
  { lat: 25.2091430, lng: 121.6940860 },
  { lat: 25.2093308, lng: 121.6942863 },
  { lat: 25.2094072, lng: 121.6943202 },
  { lat: 25.2094763, lng: 121.6944808 },
  { lat: 25.2094947, lng: 121.6945584 },
  { lat: 25.2094945, lng: 121.6945899 },
  { lat: 25.2095147, lng: 121.6945957 },
  { lat: 25.2095367, lng: 121.6946279 },
  { lat: 25.2094945, lng: 121.6945899 },
  { lat: 25.2094763, lng: 121.6944808 },
  { lat: 25.2094072, lng: 121.6943202 },
  { lat: 25.2093308, lng: 121.6942863 },
  { lat: 25.2091430, lng: 121.6940860 },
  { lat: 25.2090117, lng: 121.6940107 },
  { lat: 25.2089712, lng: 121.6939550 },
  { lat: 25.2088896, lng: 121.6938796 },
  { lat: 25.2088632, lng: 121.6938139 },
  { lat: 25.2088629, lng: 121.6937441 },
  { lat: 25.2088328, lng: 121.6936704 },
  { lat: 25.2087849, lng: 121.6936114 },
  { lat: 25.2087819, lng: 121.6935443 },
  { lat: 25.2087634, lng: 121.6934856 },
  { lat: 25.2087370, lng: 121.6934508 },
  { lat: 25.2087406, lng: 121.6933857 },
  { lat: 25.2087236, lng: 121.6933458 },
  { lat: 25.2086933, lng: 121.6933237 },
  { lat: 25.2087104, lng: 121.6933683 },
  { lat: 25.2087085, lng: 121.6934285 },
  { lat: 25.2086945, lng: 121.6934919 },
  { lat: 25.2086872, lng: 121.6935366 },
  { lat: 25.2086527, lng: 121.6934392 },
  { lat: 25.2086090, lng: 121.6934125 },
  { lat: 25.2085655, lng: 121.6933823 },
  { lat: 25.2084573, lng: 121.6933683 },
  { lat: 25.2082456, lng: 121.6934581 },
  { lat: 25.2081660, lng: 121.6933337 },
  { lat: 25.2081521, lng: 121.6932696 },
  { lat: 25.2080231, lng: 121.6931061 },
  { lat: 25.2079370, lng: 121.6929977 },
  { lat: 25.2078301, lng: 121.6928685 },
  { lat: 25.2077743, lng: 121.6927996 },
  { lat: 25.2076695, lng: 121.6927119 },
  { lat: 25.2075664, lng: 121.6925566 },
  { lat: 25.2074757, lng: 121.6923233 },
  { lat: 25.2074001, lng: 121.6921697 },
  { lat: 25.2073211, lng: 121.6920121 },
  { lat: 25.2072449, lng: 121.6918351 },
  { lat: 25.2071374, lng: 121.6917195 },
  { lat: 25.2069086, lng: 121.6916558 },
  { lat: 25.2067537, lng: 121.6916275 },
  { lat: 25.2065440, lng: 121.6915128 },
  { lat: 25.2064429, lng: 121.6912777 },
  { lat: 25.2062307, lng: 121.6910273 },
  { lat: 25.2058632, lng: 121.6906894 },
  { lat: 25.2056713, lng: 121.6904145 },
]

const routeWithoutShapeDetour = yehliuGpsRoute.filter((_, index) => index !== 59)

export const yehliuRouteDefinitions: Record<YehliuRouteId, YehliuRouteDefinition> = Object.fromEntries(
  yehliuRouteModes.map((mode) => [mode.id, {
    id: mode.id,
    stopIds: mode.stopIds,
    path: mode.id === 'deep' ? yehliuGpsRoute : routeWithoutShapeDetour,
    targetDurationMinutes: mode.targetDurationMinutes,
    recommendedToday: mode.recommendedToday,
    returnPathStartIndex: mode.id === 'deep' ? 74 : 73,
  }]),
) as Record<YehliuRouteId, YehliuRouteDefinition>

/** Guide and GPS use this same canonical array. */
export const yehliuGpsStops = yehliuStops

export const yehliuGpsFacilities: YehliuGpsFacility[] = [
  { id: 'ticket-toilet', nameKo: '매표소·입구 화장실', nameZh: '售票處・入口廁所', lat: 25.2055831, lng: 121.6905325, coordinateConfidence: 'osm-exact', coordinateNote: 'OSM node 6961391735', sourceId: 'GPS-S2' },
  { id: 'visitor-toilet', nameKo: '방문자센터 1층 화장실', nameZh: '遊客中心一樓廁所', lat: 25.2053871, lng: 121.6901077, coordinateConfidence: 'official-map-approx', coordinateNote: '공식 접근성 안내의 건물 내부 시설 · Visitor Center 대표점', sourceId: 'GPS-S1' },
  { id: 'bookstore-toilet', nameKo: 'Queen’s Bookstore 옆 화장실', nameZh: '女王的書店旁廁所', lat: 25.2095841, lng: 121.6947121, coordinateConfidence: 'osm-exact', coordinateNote: 'OSM node 4199792024', sourceId: 'GPS-S2' },
]

export const yehliuGpsSources: YehliuGpsSource[] = [
  {
    id: 'GPS-S1', title: '2024 예류지질공원 공식 안내도', organization: '野柳地質公園',
    url: 'https://www.ylgeopark.org.tw/Content/images/VisitInformationView/DigitalResources/Brochure/%E9%87%8E%E6%9F%B3%E5%9C%B0%E8%B3%AA%E5%85%AC%E5%9C%92%E7%B0%A1%E4%BB%8BDM%28%E4%B8%AD%E6%96%87%29.pdf',
    checked: '2026-08-23', note: '구역·관람 순서·출입구·화장실 위치 교차 확인. 정밀 POI가 없는 지점은 위치 근사로 표시.',
  },
  {
    id: 'GPS-S2', title: 'OpenStreetMap 시설·POI 객체', organization: 'OpenStreetMap contributors · ODbL',
    url: 'https://www.openstreetmap.org/node/13890668395', checked: '2026-08-23',
    note: 'Visitor Center 13890668395 · entrance 861099512 · Cute Princess 13890675029 · Fairy’s Shoe 4199791989 · Bookstore 4199791996 · toilets 6961391735/4199792024.',
  },
  {
    id: 'GPS-S3', title: 'OpenStreetMap 보행로 객체', organization: 'OpenStreetMap contributors · ODbL',
    url: 'https://www.openstreetmap.org/way/72538299', checked: '2026-08-23',
    note: '주요 footway way 72538299, 72538301, 72538304, 207948073, 207948077, 207948084, 368743164, 368743166, 368743167을 2026-08-23 재확인.',
  },
  {
    id: 'GPS-S4', title: 'Queen’s Head 공식 관광 POI', organization: 'Taiwan Tourism Administration',
    url: 'https://eng.taiwan.net.tw/m1.aspx?id=a12-00174&sno=0002016', checked: '2026-08-23',
    note: '공식 표기 좌표 121.69310 / 25.208802 사용.',
  },
  {
    id: 'GPS-S5', title: 'OpenStreetMap Tile Usage Policy', organization: 'OpenStreetMap Foundation',
    url: 'https://operations.osmfoundation.org/policies/tiles/', checked: '2026-08-23',
    note: '온라인 선택 시 현재 화면에 필요한 표준 타일만 로드하고 오프라인 저장·선행 다운로드는 하지 않음.',
  },
]
