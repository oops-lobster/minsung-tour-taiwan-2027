export type YehliuRouteId = 'compact' | 'standard' | 'deep'

export type YehliuStopId =
  | 'visitor-center'
  | 'candle-potholes'
  | 'mushroom-rocks'
  | 'fossil-zone'
  | 'queens-head'
  | 'shape-structure-zone'
  | 'queens-bookstore'
  | 'vehicle-return'

export type CoordinateConfidence = 'official-exact' | 'osm-exact' | 'official-map-approx' | 'zone-approx' | 'user-saved'

export interface SourceRef {
  sourceId: string
  pages?: string
  section?: string
  claim: string
}

export interface YehliuRouteMode {
  id: YehliuRouteId
  label: string
  time: string
  targetDurationMinutes: [number, number]
  description: string
  warning?: string
  recommendedToday: boolean
  stopIds: YehliuStopId[]
}

export interface YehliuStop {
  id: YehliuStopId
  title: string
  localName: string
  englishName: string
  zone: '시작' | '제1구역' | '제2구역' | '운영' | '복귀'
  minutes: string
  minimumDwellMinutes: number
  familySummary: string
  science: string
  deepDive: string[]
  observe: string[]
  misconception?: string
  safety?: string
  diagram?: 'structure' | 'candle' | 'mushroom' | 'fossil' | 'queen' | 'shape'
  lat: number
  lng: number
  coordinateConfidence: CoordinateConfidence
  coordinateNote: string
  arrivalRadiusMeters: number
  autoArrival: boolean
  restroom?: boolean
  vehicleReturn?: boolean
  sourceRefs: SourceRef[]
}

export interface YehliuSource {
  id: string
  title: string
  organization: string
  scope: string
  url: string
  checked: string
}

export const yehliuRouteModes: YehliuRouteMode[] = [
  {
    id: 'compact',
    label: 'Compact · 핵심',
    time: '55–65분',
    targetDurationMinutes: [55, 65],
    description: '도착 지연·강풍·비·피로·여왕머리 대기 증가 때 화석과 형상 구간을 설명 stop에서 뺍니다.',
    recommendedToday: false,
    stopIds: ['visitor-center', 'candle-potholes', 'mushroom-rocks', 'queens-head', 'queens-bookstore', 'vehicle-return'],
  },
  {
    id: 'standard',
    label: 'Standard · 오늘 기본',
    time: '80–85분',
    targetDurationMinutes: [80, 85],
    description: '09:20 도착부터 화장실·입장·보행·사진 대기·10:45 차량 합류까지 포함한 가족 기본 코스입니다.',
    recommendedToday: true,
    stopIds: ['visitor-center', 'candle-potholes', 'mushroom-rocks', 'fossil-zone', 'queens-head', 'queens-bookstore', 'vehicle-return'],
  },
  {
    id: 'deep',
    label: 'Deep · 심화',
    time: '95–105분',
    targetDurationMinutes: [95, 105],
    description: '형상·구조 관찰 구간과 더 긴 해설을 더합니다.',
    warning: '오늘 일정에는 원칙적으로 비추천 · 15분 이상 앞서 있을 때만 선택',
    recommendedToday: false,
    stopIds: ['visitor-center', 'candle-potholes', 'mushroom-rocks', 'fossil-zone', 'queens-head', 'shape-structure-zone', 'queens-bookstore', 'vehicle-return'],
  },
]

export const yehliuStops: YehliuStop[] = [
  {
    id: 'visitor-center',
    title: '합류점 저장하고 2천만 년 시작하기',
    localName: '野柳遊客中心',
    englishName: 'Visitor Center',
    zone: '시작',
    minutes: '8분',
    minimumDwellMinutes: 8,
    familySummary: '차가 서 있는 위치를 먼저 저장하고 화장실을 다녀와요. 이 곶은 약 2천만 년 전 얕은 바다의 모래가 굳고, 땅이 올라온 뒤 파도와 소금바람이 깎아 만든 곳입니다.',
    science: '약 2,000만–1,900만 년 전 다랴오층(Daliao Formation, 大寮層)이 얕은 바다에 쌓였습니다. 매몰·압밀·탈수·교결 과정에서 사암이 되고 석회질·철질 결핵이 생겼으며, 약 600만 년 전 펑라이 조산운동으로 융기·경사·절리가 발달했습니다.',
    deepDive: [
      '야류곶의 다랴오층은 동남쪽으로 약 20° 기울어진 단면산(cuesta)입니다.',
      '층리와 절리는 이후 파도·염풍화·빗물이 파고드는 길이 되어 지형의 설계도 역할을 합니다.',
      '약 수만 년 전부터 곶이 해수면 위로 드러났고, 현재도 파랑·반복 건습·비·일사·바람·중력 붕괴가 함께 작용합니다.',
    ],
    observe: ['차량 합류점과 10:45 목표를 기사와 확인', 'Visitor Center 1층 화장실', '바람·젖은 바닥·현장 통제선 확인', '기울어진 층리와 절리 방향'],
    safety: 'GPS보다 현장 직원·표지·통제선이 우선입니다. 합류점을 저장하지 못하면 입구 근사점을 기준으로 복귀합니다.',
    diagram: 'structure',
    lat: 25.2053871,
    lng: 121.6901077,
    coordinateConfidence: 'osm-exact',
    coordinateNote: 'OpenStreetMap node 13890668395 · Visitor Center 건물 POI',
    arrivalRadiusMeters: 25,
    autoArrival: true,
    restroom: true,
    sourceRefs: [
      { sourceId: 'S4', pages: 'PDF pp. 19–20 (보고서 pp. 13–14)', claim: '다랴오층 퇴적·성암·결핵·조산·노출 timeline' },
      { sourceId: 'S4', pages: 'PDF p. 32 (보고서 p. 26)', claim: '동남쪽 약 20° 경사와 단면산' },
      { sourceId: 'S1', section: '화장실·Wi-Fi FAQ', claim: 'Visitor Center 1층 화장실과 무료 Wi-Fi' },
    ],
  },
  {
    id: 'candle-potholes',
    title: '포트홀과 촛대바위, 다른 두 과정',
    localName: '海蝕壺穴・燭臺石',
    englishName: 'Marine potholes · Candle Rocks',
    zone: '제1구역',
    minutes: '9분',
    minimumDwellMinutes: 7,
    familySummary: '둥근 구멍은 바닷물·소금·자갈이 오목한 곳을 오래 넓힌 흔적이에요. 촛대바위는 가운데 단단한 결핵이 남고 주변 사암이 먼저 사라져 생긴, 서로 다른 과정입니다.',
    science: '해식대의 초기 오목부는 해수 침식, 반복 건습, 염결정 풍화와 유입 자갈의 회전 마찰이 겹치며 확대·심화됩니다. 촛대바위는 정상의 원형 석회질 결핵이 주변 사암보다 강해 남고, 결핵 둘레에 환상 홈이 발달한 차별침식 지형입니다.',
    deepDive: [
      '공식 보고서는 촛대바위를 직경 약 0.5–1m의 원추형 지형으로 설명합니다.',
      '모든 둥근 홈이 동일한 메커니즘으로 생겼다고 단정하지 말고, 초기 함몰·절리·자갈 유무를 함께 봅니다.',
    ],
    observe: ['깊이가 다른 초기 함몰', '구멍 안 자갈과 마찰 흔적', '촛대 정상의 원형 결핵', '결핵 주위 환상 홈'],
    misconception: '포트홀과 촛대바위는 함께 보지만 같은 형성과정은 아닙니다.',
    safety: '젖은 해식대와 파도 방향으로 다가가지 않고 관람선 안에서 봅니다.',
    diagram: 'candle',
    lat: 25.2077330,
    lng: 121.6908520,
    coordinateConfidence: 'zone-approx',
    coordinateNote: '2024 공식 안내도와 OSM footway를 교차한 관찰 구간 근사점',
    arrivalRadiusMeters: 38,
    autoArrival: false,
    sourceRefs: [
      { sourceId: 'S4', pages: 'PDF pp. 33–35 (보고서 pp. 27–29)', claim: '해식대·해식구·포트홀 형성' },
      { sourceId: 'S4', pages: 'PDF p. 37 (보고서 p. 31)', claim: '촛대바위 크기·석회질 결핵·환상 홈' },
    ],
  },
  {
    id: 'mushroom-rocks',
    title: '버섯바위의 서로 다른 생애 단계',
    localName: '蕈狀岩群・俏皮公主',
    englishName: 'Mushroom rocks · Cute Princess',
    zone: '제1구역',
    minutes: '10분',
    minimumDwellMinutes: 8,
    familySummary: '여러 바위를 비교하면 목 없음 → 굵은 목 → 가는 목 → 붕괴 단계가 한눈에 보여요. 한 바위가 눈앞에서 빨리 변하는 게 아니라, 서로 다른 바위가 각 단계를 보여주는 겁니다.',
    science: '석회질이 많은 상부 cap은 상대적으로 단단하고 하부 neck은 더 약합니다. 파랑·북동계절풍·일사·염풍화가 복합 작용해 무경→굵은 목→가는 목→목 붕괴로 이어지며, 여왕머리를 이해하는 기준 stop입니다.',
    deepDive: [
      '과거의 1mm/년 침식률·2mm/년 융기율을 이용한 2,000–4,000년 추정은 단순 모델이지 개별 바위의 정밀 절대연대가 아닙니다.',
      'cap과 neck의 색·조직·표면 거칠기를 비교하면 물성 차이와 노출 환경을 함께 읽을 수 있습니다.',
    ],
    observe: ['무경·굵은 목·가는 목 비교', 'cap과 neck의 색·질감 차이', '귀여운 공주 주변의 여러 단계'],
    misconception: '버섯처럼 자라난 것이 아니라 약한 부분이 더 빨리 사라지며 형태가 드러납니다.',
    safety: '바위에 손대거나 기대지 않고 사진 줄의 흐름을 막지 않습니다.',
    diagram: 'mushroom',
    lat: 25.2079437,
    lng: 121.6919598,
    coordinateConfidence: 'osm-exact',
    coordinateNote: 'OpenStreetMap node 13890675029 · Cute Princess POI',
    arrivalRadiusMeters: 28,
    autoArrival: true,
    sourceRefs: [
      { sourceId: 'S3', section: '제1구역·蕈狀岩', claim: '무경·굵은 목·가는 목·단경 단계' },
      { sourceId: 'S4', pages: 'PDF pp. 36–37 (보고서 pp. 30–31)', claim: '석회질 cap과 neck의 차별침식' },
    ],
  },
  {
    id: 'fossil-zone',
    title: '몸의 화석과 행동의 화석 구분하기',
    localName: '海膽化石・生痕化石',
    englishName: 'Sea urchin fossils · Trace fossils',
    zone: '제1구역',
    minutes: '8분',
    minimumDwellMinutes: 6,
    familySummary: '성게 몸체가 남은 실체화석과, 생물이 먹고 기고 숨은 행동이 남은 생흔화석을 구분해 봐요. 둘 다 이곳이 약 2천만 년 전 얕은 바다였다는 증거입니다.',
    science: '야류에는 Echinodiscus yeliuensis(2공)와 Astriclypeus yeliuensis(5공)로 보고된 성게 실체화석이 있고, 별모양 섭식 흔적·절지동물의 굴과 섭식·배설 흔적·escape structure 같은 생흔화석이 있습니다. 보고서는 약 2천만 년 전 수심 약 10–20m 환경을 설명합니다.',
    deepDive: ['균열·산화 띠·풍화무늬도 화석처럼 보일 수 있으므로 형태만으로 확정하지 않습니다.', '정밀 단일 POI가 아니라 설명판과 노출면을 함께 찾는 관찰 zone입니다.'],
    observe: ['2공·5공 성게 형태', '별모양 섭식 흔적', '관 모양 굴과 escape structure', '주변 균열·풍화무늬와 비교'],
    misconception: '바위의 모든 별·선·구멍이 화석은 아닙니다.',
    safety: '화석을 긁거나 떼지 않고 설명판이 있는 관찰면만 봅니다.',
    diagram: 'fossil',
    lat: 25.2082456,
    lng: 121.6934581,
    coordinateConfidence: 'zone-approx',
    coordinateNote: '공식 안내도 기반 fossil observation zone · 정밀 단일 화석 좌표 아님',
    arrivalRadiusMeters: 42,
    autoArrival: false,
    sourceRefs: [{ sourceId: 'S4', pages: 'PDF pp. 35–36 (보고서 pp. 29–30)', claim: '실체·생흔화석, 두 성게 종, 10–20m 얕은 바다' }],
  },
  {
    id: 'queens-head',
    title: '여왕머리, 버섯바위의 현재 장면',
    localName: '女王頭',
    englishName: "Queen's Head",
    zone: '제2구역',
    minutes: '8분',
    minimumDwellMinutes: 6,
    familySummary: '여왕머리도 버섯바위의 한 단계예요. 1962–1963년 무렵 윗부분의 절리가 깨진 뒤 특정 각도에서 여왕의 옆모습을 닮아 이름이 붙었고, 지금도 천천히 변합니다.',
    science: '상부 결핵과 하부 사암의 차별풍화가 만든 가는 목의 버섯바위입니다. 공원은 형태 변화를 3D laser scanning 등으로 기록하지만 정확한 붕괴 시점은 예측할 수 없습니다. 버섯바위 stop에서 본 cap–neck 관계를 실제 대표 사례에 연결합니다.',
    deepDive: ['정면 인증사진 줄이 8–10분 이상이면 줄을 생략하고 측면에서 cap·neck·절리만 관찰합니다.', '이름은 관찰 각도에서 생긴 문화적 해석이며 별도의 암석 종류를 뜻하지 않습니다.'],
    observe: ['cap과 가는 neck', '1960년대 파손 뒤 생긴 실루엣', '주변 세경형 버섯바위', '사진 대기열 시간'],
    misconception: '붕괴 날짜를 단정하거나 여왕머리만 특별한 재료라고 설명하지 않습니다.',
    safety: '대기선·관람선 안내를 따르고 바위에 손대지 않습니다.',
    diagram: 'queen',
    lat: 25.2088020,
    lng: 121.6931000,
    coordinateConfidence: 'official-exact',
    coordinateNote: 'Taiwan Tourism Administration 공식 POI 좌표',
    arrivalRadiusMeters: 25,
    autoArrival: true,
    sourceRefs: [
      { sourceId: 'S3', section: '女王頭', claim: '1962–1963년 결핵 절리 파손과 명명' },
      { sourceId: 'S4', pages: 'PDF pp. 36–37 (보고서 pp. 30–31)', claim: '여왕머리는 버섯바위의 대표 사례' },
    ],
  },
  {
    id: 'shape-structure-zone',
    title: '이름보다 구조를 보는 형상바위 구간',
    localName: '仙女鞋・地球石・臺灣石',
    englishName: 'Shape & structure observation zone',
    zone: '제2구역',
    minutes: '10분',
    minimumDwellMinutes: 8,
    familySummary: '신발·지구·대만처럼 보이는 이름은 모양 설명일 뿐 만들어진 이유는 아니에요. 결핵의 위치, 절리 방향, 소금풍화와 보는 각도가 실루엣을 어떻게 바꾸는지 봅니다.',
    science: '여러 결핵의 형태와 위치, 절리 방향, 표면 다공성, 해식구와 구조적 약대가 함께 윤곽을 만듭니다. 같은 경관명끼리도 형성과정이 같다고 볼 수 없으며, 형상보다 내부 구조와 풍화 증거가 핵심입니다.',
    deepDive: ['풍화는 절리를 따라 진행하고 철 성분의 산화·침전은 대칭적인 녹빛 무늬나 돌출·함몰을 만들 수 있습니다.', 'Deep 코스의 선택 관찰 구간이며 15분 이상 일정이 앞설 때만 권합니다.'],
    observe: ['결핵의 형태·위치', '절리와 해식구 방향', '염풍화·표면 다공성', '보는 각도에 따른 실루엣'],
    misconception: '경관명은 성인을 설명하는 지질학적 분류가 아닙니다.',
    safety: '위치가 근사인 zone입니다. 자동도착을 쓰지 않고 공식 보행로와 표지만 따릅니다.',
    diagram: 'shape',
    lat: 25.2094273,
    lng: 121.6933791,
    coordinateConfidence: 'zone-approx',
    coordinateNote: 'OSM Fairy’s Shoe node 4199791989를 대표점으로 쓴 복수 지형 관찰 zone',
    arrivalRadiusMeters: 45,
    autoArrival: false,
    sourceRefs: [
      { sourceId: 'S3', section: '제2구역 rock list', claim: '선녀신발·지구바위·대만바위 경관명' },
      { sourceId: 'S4', pages: 'PDF pp. 37–39 (보고서 pp. 31–33)', claim: '결핵 형태·절리·풍화무늬' },
    ],
  },
  {
    id: 'queens-bookstore',
    title: '화장실·컨디션·복귀 판단',
    localName: '女王的書店',
    englishName: "Queen's Bookstore · Restroom",
    zone: '운영',
    minutes: '7분',
    minimumDwellMinutes: 7,
    familySummary: '여기는 관광지가 아니라 운영 stop이에요. 화장실을 다녀오고 부모님 컨디션을 확인한 뒤, 10:20–10:25에는 남은 구경보다 차량 복귀를 우선합니다.',
    science: '지질 관찰을 정리하는 지점입니다. 오늘 본 것 중 단단한 결핵이 남은 사례 하나와 옛 바다의 증거 하나를 서로 말해보면 충분합니다.',
    deepDive: ['공식 FAQ와 접근성 안내는 제2구역 Queen’s Bookstore 옆 화장실을 명시합니다.', '현장 혼잡·날씨·보행속도에 따라 복귀 판단을 더 앞당깁니다.'],
    observe: ['Queen’s Bookstore 옆 화장실', '부모님 피로·바람 확인', '10:20–10:25 복귀 시작 판단', '차량 합류점 메모 확인'],
    safety: '차량 합류 예상이 10:45를 넘으면 즉시 복귀합니다.',
    lat: 25.2095367,
    lng: 121.6946279,
    coordinateConfidence: 'osm-exact',
    coordinateNote: 'OpenStreetMap node 4199791996 · Queen’s Bookstore',
    arrivalRadiusMeters: 25,
    autoArrival: true,
    restroom: true,
    sourceRefs: [
      { sourceId: 'S1', section: '園區內有廁所嗎', claim: '공원 화장실 3곳과 Queen’s Bookstore 위치' },
      { sourceId: 'S2', section: '無障礙設施', claim: '제1구역–Bookstore–Queen’s Head 접근 동선' },
    ],
  },
  {
    id: 'vehicle-return',
    title: '저장한 차량 합류점으로 복귀',
    localName: '車輛會合點',
    englishName: 'Saved vehicle meeting point',
    zone: '복귀',
    minutes: '18–23분',
    minimumDwellMinutes: 0,
    familySummary: '마지막 사진보다 세 사람이 함께 약속한 차로 돌아가는 게 먼저예요. 저장한 합류점으로 가고, 저장하지 못했다면 Visitor Center·입구 근사점을 따라갑니다.',
    science: '복귀도 현장 운영의 일부입니다. GPS는 저장한 합류점을 참고하되 공식 퇴장 동선과 직원 안내를 벗어나지 않습니다.',
    deepDive: ['차량 위치·GPS 정확도·주차구역은 현장에서 달라질 수 있어 고정 주차장 좌표로 단정하지 않습니다.'],
    observe: ['가족 세 명 함께 이동', '소지품 확인', '저장한 차량번호·주차 메모 확인', '기사에게 도착 메시지'],
    safety: '지금 차량으로 복귀를 눌러도 남은 관찰 stop은 자동 완료되지 않습니다.',
    lat: 25.2056713,
    lng: 121.6904145,
    coordinateConfidence: 'official-map-approx',
    coordinateNote: '합류점 미저장 시 OSM entrance node 861099512를 근사 fallback으로 사용',
    arrivalRadiusMeters: 30,
    autoArrival: false,
    vehicleReturn: true,
    sourceRefs: [{ sourceId: 'S2', section: '無障礙坡道', claim: '입구·Visitor Center·제1·2구역 접근 동선' }],
  },
]

export const yehliuTimeline = [
  { time: '약 2,000만–1,900만 년 전', title: '다랴오층이 얕은 바다에 쌓이다', description: '모래층에 성게 몸체와 생물의 행동 흔적이 기록됩니다.' },
  { time: '매몰·성암', title: '압밀·탈수·교결과 결핵 형성', description: '모래가 사암이 되고 지하수의 석회질·철질 성분이 침전해 단단한 결핵을 만듭니다.' },
  { time: '약 600만 년 전', title: '펑라이 조산운동', description: '융기·경사·절리가 생기고 동남쪽 약 20° 기울어진 단면산의 틀이 만들어집니다.' },
  { time: '약 수만 년 전', title: '야류곶이 해수면 위로', description: '노출된 암석이 파랑·염풍화·반복 건습·비·일사·바람을 직접 만나기 시작합니다.' },
  { time: '현재', title: '차별침식과 중력 붕괴가 계속되다', description: '완성된 조각상이 아니라 결핵·사암·절리의 차이를 따라 계속 변하는 지형입니다.' },
]

export const yehliuMilestones = [
  ['09:20', '도착 · 합류점 저장 · Visitor Center 화장실'],
  ['09:28', '입장 · 제1구역 이동'],
  ['09:38', '촛대바위·포트홀'],
  ['09:47', '버섯바위·귀여운 공주'],
  ['09:57', '화석 구간'],
  ['10:05', 'Queen’s Head'],
  ['10:13', 'Queen’s Bookstore 화장실'],
  ['10:20–10:25', '무조건 복귀 판단 · 출구 방향 시작'],
  ['10:43', 'Visitor Center·입구 도착 예상'],
  ['10:45', '차량 합류 목표'],
  ['10:50', '절대 마지노선'],
] as const

export const yehliuGlossary = [
  { ko: '다랴오층', zh: '大寮層', en: 'Daliao Formation', description: '약 2,000만–1,900만 년 전 얕은 바다에서 쌓인 야류곶의 주된 지층.' },
  { ko: '단면산', zh: '單面山', en: 'cuesta', description: '한쪽은 완만한 층리면, 반대쪽은 급한 사면을 보이는 기울어진 지형.' },
  { ko: '해식대', zh: '海蝕平臺', en: 'marine abrasion platform', description: '파도가 해안 암반을 깎아 만든 비교적 평평한 바닥.' },
  { ko: '포트홀', zh: '海蝕壺穴', en: 'marine pothole', description: '초기 함몰에 해수·염풍화·자갈 마찰 등이 겹쳐 확대된 구멍.' },
  { ko: '결핵', zh: '結核', en: 'concretion', description: '퇴적암 속 성분이 모여 주변보다 단단하게 굳은 덩어리.' },
  { ko: '차별침식', zh: '差異侵蝕', en: 'differential erosion', description: '단단함과 노출 조건 차이로 암석이 서로 다른 속도로 깎이는 현상.' },
  { ko: '절리', zh: '節理', en: 'joint', description: '암석에 발달한 틈. 물·염분이 들어가고 파손이 진행되는 길이 됩니다.' },
  { ko: '염풍화', zh: '鹽風化', en: 'salt weathering', description: '소금 결정의 성장과 반복 건습이 암석 틈과 표면을 약하게 만드는 풍화.' },
  { ko: '생흔화석', zh: '生痕化石', en: 'trace fossil', description: '굴·섭식·이동·탈출처럼 생물의 행동이 남은 화석.' },
]

export const yehliuQuiz = [
  { question: '포트홀과 촛대바위는 같은 과정일까요?', answer: '아니요. 포트홀은 함몰이 해수·염풍화·자갈 마찰로 커지고, 촛대바위는 단단한 결핵과 주변 사암의 차별침식이 핵심입니다.' },
  { question: '여왕머리는 별도의 특별한 암석일까요?', answer: '아니요. cap과 neck이 다르게 깎인 버섯바위의 대표 사례입니다.' },
  { question: '성게 몸체와 생물의 굴은 같은 화석인가요?', answer: '몸체는 실체화석, 굴·섭식·탈출 흔적은 생흔화석입니다.' },
  { question: 'Deep 코스는 오늘 기본일까요?', answer: '아닙니다. 10:45 차량 합류와 충돌할 수 있어 15분 이상 앞설 때만 선택합니다.' },
]

export const yehliuChecklist = [
  '가이드와 오프라인 점검을 온라인에서 한 번 완료',
  '배터리·보조배터리·미끄럼 방지 신발 확인',
  '09:20 도착 즉시 차량 합류점 저장',
  'Visitor Center 1층 화장실 먼저 이용',
  '10:20–10:25 복귀 시작 · 10:45 합류 · 10:50 절대 마지노선',
  '2027년 운영시간·통제구역·기상·실제 합류점 재확인',
]

export const yehliuSafety = [
  '붉은 경계선·통제선·직원 안내가 이 가이드와 GPS보다 항상 우선입니다.',
  '파도 방향의 젖은 암반, 가장자리, 물이 고인 홈에는 접근하지 않습니다.',
  '암석을 만지거나 올라서거나 화석·조개·돌을 채취하지 않습니다.',
  '강풍·큰 파도·호우·부모님 피로가 있으면 Compact로 줄이고 필요하면 즉시 복귀합니다.',
  '제3구역은 이번 가족 셀프 가이드 범위에서 제외합니다.',
]

export const yehliuSources: YehliuSource[] = [
  { id: 'S1', title: '방문 전 자주 묻는 질문', organization: '野柳地質公園 공식 웹사이트', scope: '제1·2구역 약 1시간, 화장실 3곳, 무료 Wi-Fi, 안전 제한', url: 'https://ylgeopark.org.tw/VisitInformationView/CommonProblem', checked: '2026-08-23' },
  { id: 'S2', title: '무장애 친화 서비스', organization: '野柳地質公園 공식 웹사이트', scope: '입구–제1구역–Queen’s Bookstore–Queen’s Head 동선과 화장실 3곳', url: 'https://www.ylgeopark.org.tw/ServeAndShopView/Accessibility', checked: '2026-08-23' },
  { id: 'S3', title: '천만년 기암 공식 rock list', organization: '野柳地質公園 공식 웹사이트', scope: '구역별 바위, 버섯바위 단계, 여왕머리 1962–1963년 설명', url: 'https://ylgeopark.org.tw/AboutYehliuView/CenturyOldRocks', checked: '2026-08-23' },
  { id: 'S4', title: '신베이시 예류지질공원 자연경관 가치 평가보고서', organization: '농업부 임업 및 자연보전서', scope: '다랴오층·지질 역사·포트홀·화석·결핵·버섯바위·촛대바위·절리', url: 'https://www.forest.gov.tw/file/76536', checked: '2026-08-23' },
  { id: 'S5', title: '2024 예류지질공원 공식 안내도', organization: '野柳地質公園', scope: '구역·관람 순서·출입구·화장실 위치 교차 확인', url: 'https://www.ylgeopark.org.tw/Content/images/VisitInformationView/DigitalResources/Brochure/%E9%87%8E%E6%9F%B3%E5%9C%B0%E8%B3%AA%E5%85%AC%E5%9C%92%E7%B0%A1%E4%BB%8BDM%28%E4%B8%AD%E6%96%87%29.pdf', checked: '2026-08-23' },
]
