import type { YehliuRouteId } from './yehliuGuide'

export interface GeoPoint {
  lat: number
  lng: number
}

export interface YehliuGpsStop extends GeoPoint {
  id: string
  order: number
  nameKo: string
  nameZh: string
  nameEn: string
  guideStopId: number
  routePointIndex: number
  arrivalRadiusMeters: number
  routeIds: YehliuRouteId[]
  approximate?: boolean
  restroom?: boolean
  exit?: boolean
  sourceId: string
}

export interface YehliuGpsFacility extends GeoPoint {
  id: string
  nameKo: string
  nameZh: string
  approximate?: boolean
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

const allRoutes: YehliuRouteId[] = ['compact', 'standard', 'deep']
const standardAndDeep: YehliuRouteId[] = ['standard', 'deep']

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

export const yehliuGpsStops: YehliuGpsStop[] = [
  {
    id: 'visitor-center', order: 0, nameKo: '방문자센터', nameZh: '野柳遊客中心', nameEn: 'Visitor Center',
    guideStopId: 0, lat: 25.2053871, lng: 121.6901077, routePointIndex: 0, arrivalRadiusMeters: 25,
    routeIds: allRoutes, restroom: true, sourceId: 'GPS-S2',
  },
  {
    id: 'entrance', order: 1, nameKo: '공원 입구', nameZh: '野柳地質公園入口', nameEn: 'Geopark Entrance',
    guideStopId: 0, lat: 25.2056713, lng: 121.6904145, routePointIndex: 2, arrivalRadiusMeters: 22,
    routeIds: allRoutes, sourceId: 'GPS-S2',
  },
  {
    id: 'candle-rocks', order: 2, nameKo: '촛대바위·항아리구멍', nameZh: '燭臺石・壺穴', nameEn: 'Candle Rocks · Potholes',
    guideStopId: 2, lat: 25.2077330, lng: 121.6908520, routePointIndex: 19, arrivalRadiusMeters: 28,
    routeIds: allRoutes, approximate: true, sourceId: 'GPS-S1',
  },
  {
    id: 'mushroom-rocks', order: 3, nameKo: '버섯바위·귀여운 공주', nameZh: '蕈狀岩群・俏皮公主', nameEn: 'Mushroom Rocks · Cute Princess',
    guideStopId: 3, lat: 25.2079437, lng: 121.6919598, routePointIndex: 22, arrivalRadiusMeters: 28,
    routeIds: allRoutes, sourceId: 'GPS-S2',
  },
  {
    id: 'fossil-zone', order: 4, nameKo: '성게·생흔화석 구간', nameZh: '海膽化石・生痕化石', nameEn: 'Sea Urchin · Trace Fossils',
    guideStopId: 4, lat: 25.2082456, lng: 121.6934581, routePointIndex: 34, arrivalRadiusMeters: 30,
    routeIds: standardAndDeep, approximate: true, sourceId: 'GPS-S1',
  },
  {
    id: 'queens-head', order: 5, nameKo: '여왕머리', nameZh: '女王頭', nameEn: "Queen's Head",
    guideStopId: 6, lat: 25.2088020, lng: 121.6931000, routePointIndex: 50, arrivalRadiusMeters: 25,
    routeIds: allRoutes, sourceId: 'GPS-S3',
  },
  {
    id: 'shape-rocks', order: 6, nameKo: '선녀신발·지구바위·대만바위', nameZh: '仙女鞋・地球石・臺灣石', nameEn: "Fairy's Shoe · Earth · Taiwan Rocks",
    guideStopId: 5, lat: 25.2094273, lng: 121.6933791, routePointIndex: 59, arrivalRadiusMeters: 30,
    routeIds: standardAndDeep, approximate: true, sourceId: 'GPS-S1',
  },
  {
    id: 'queens-bookstore', order: 7, nameKo: 'Queen’s Bookstore', nameZh: '女王的書店', nameEn: "Queen's Head Bookstore",
    guideStopId: 7, lat: 25.2095367, lng: 121.6946279, routePointIndex: 74, arrivalRadiusMeters: 25,
    routeIds: allRoutes, restroom: true, sourceId: 'GPS-S2',
  },
  {
    id: 'exit', order: 8, nameKo: '출구·차량 복귀 방향', nameZh: '出口・停車場方向', nameEn: 'Exit · Vehicle Return',
    guideStopId: 8, lat: 25.2056713, lng: 121.6904145, routePointIndex: 121, arrivalRadiusMeters: 28,
    routeIds: allRoutes, exit: true, sourceId: 'GPS-S1',
  },
]

export const yehliuGpsFacilities: YehliuGpsFacility[] = [
  { id: 'ticket-toilet', nameKo: '매표소·입구 화장실', nameZh: '售票處・入口廁所', lat: 25.2055831, lng: 121.6905325, sourceId: 'GPS-S2' },
  { id: 'visitor-toilet', nameKo: '방문자센터 1층 화장실', nameZh: '遊客中心一樓廁所', lat: 25.2053871, lng: 121.6901077, approximate: true, sourceId: 'GPS-S1' },
  { id: 'bookstore-toilet', nameKo: 'Queen’s Bookstore 옆 화장실', nameZh: '女王的書店旁廁所', lat: 25.2095841, lng: 121.6947121, sourceId: 'GPS-S2' },
]

export const yehliuGpsSources: YehliuGpsSource[] = [
  {
    id: 'GPS-S1', title: '2024 예류지질공원 공식 안내도', organization: '野柳地質公園',
    url: 'https://www.ylgeopark.org.tw/Content/images/VisitInformationView/DigitalResources/Brochure/%E9%87%8E%E6%9F%B3%E5%9C%B0%E8%B3%AA%E5%85%AC%E5%9C%92%E7%B0%A1%E4%BB%8BDM%28%E4%B8%AD%E6%96%87%29.pdf',
    checked: '2026-08-23', note: '구역·관람 순서·출입구·화장실 위치 교차 확인. 정밀 POI가 없는 지점은 위치 근사로 표시.',
  },
  {
    id: 'GPS-S2', title: 'OpenStreetMap 보행로·시설·POI 데이터', organization: 'OpenStreetMap contributors · ODbL',
    url: 'https://www.openstreetmap.org/copyright', checked: '2026-08-23',
    note: 'Visitor Center, entrance, Cute Princess, Fairy’s Shoe, Queen’s Bookstore, toilets와 footway/boardwalk geometry.',
  },
  {
    id: 'GPS-S3', title: 'Queen’s Head 공식 관광 POI', organization: 'Taiwan Tourism Administration',
    url: 'https://eng.taiwan.net.tw/m1.aspx?id=a12-00174&sno=0002016', checked: '2026-08-23',
    note: '공식 표기 좌표 121.69310 / 25.208802 사용.',
  },
  {
    id: 'GPS-S4', title: 'OpenStreetMap Tile Usage Policy', organization: 'OpenStreetMap Foundation',
    url: 'https://operations.osmfoundation.org/policies/tiles/', checked: '2026-08-23',
    note: '온라인 선택 시 현재 화면에 필요한 표준 타일만 로드하고 오프라인 저장·선행 다운로드는 하지 않음.',
  },
]
