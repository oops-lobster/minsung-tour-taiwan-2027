import type { DayRoute } from './dayRoutes'
import { dayRoutes } from './dayRoutes.ts'
import type { TimelineItem, TripDay } from './trip'
import { RAIN_PLAN_THRESHOLD, type DayWeatherConfig, type WeatherPlanId } from '../lib/weather.ts'

export type WeatherPlanStatus = 'ready' | 'draft'

export interface DayPlan {
  id: WeatherPlanId
  label: string
  theme: string
  summary: string
  weatherType: 'fair' | 'rain'
  status: WeatherPlanStatus
  schedule: TimelineItem[]
  route: DayRoute
}

interface DayPlanMeta {
  planATheme: string
  planASummary: string
  planB: Omit<DayPlan, 'id' | 'label' | 'weatherType'>
  planB2?: Omit<DayPlan, 'id' | 'label' | 'weatherType'>
  planC?: Omit<DayPlan, 'id' | 'label' | 'weatherType'>
}

export const dayWeatherConfigs: Record<string, DayWeatherConfig> = {
  'day-1': {
    dayId: 'day-1',
    date: '2027-02-20',
    representativeLocation: 'Taipei',
    locations: [{ id: 'taipei', name: 'Taipei', latitude: 25.033, longitude: 121.5654 }],
    startHour: 13,
    endHour: 19,
    rainThreshold: RAIN_PLAN_THRESHOLD,
  },
  'day-2': {
    dayId: 'day-2',
    date: '2027-02-21',
    representativeLocation: 'Taipei · Northern Taiwan',
    locations: [
      { id: 'yehliu', name: 'Yehliu', latitude: 25.2053, longitude: 121.6905 },
      { id: 'shifen', name: 'Shifen', latitude: 25.0434, longitude: 121.775 },
      { id: 'jiufen', name: 'Jiufen', latitude: 25.1099, longitude: 121.8452 },
    ],
    startHour: 9,
    endHour: 20,
    rainThreshold: RAIN_PLAN_THRESHOLD,
  },
  'day-3': {
    dayId: 'day-3',
    date: '2027-02-22',
    representativeLocation: 'Taipei',
    locations: [{ id: 'taipei', name: 'Taipei', latitude: 25.033, longitude: 121.5654 }],
    startHour: 9,
    endHour: 17,
    rainThreshold: RAIN_PLAN_THRESHOLD,
  },
  'day-4': {
    dayId: 'day-4',
    date: '2027-02-23',
    representativeLocation: 'Taipei',
    locations: [{ id: 'taipei', name: 'Taipei', latitude: 25.033, longitude: 121.5654 }],
    startHour: 8,
    endHour: 14,
    rainThreshold: RAIN_PLAN_THRESHOLD,
  },
}

const dayOneRainRoute: DayRoute = {
  title: 'B1 · 현대미술과 대만차로 이어지는 비 오는 타이베이',
  summary: 'TFAM의 2027년 2월 전시가 가족 취향에 맞을 때 선택합니다. My灶와 弄宅咖啡 뒤 미술관과 小隱茶庵을 거쳐 예약된 저녁으로 이동합니다.',
  stops: [
    { placeId: 'taoyuan-t2', label: '타오위안공항 T2', note: '대만 도착 · 피켓 미팅' },
    { placeId: 'hotel', label: 'Taipei Garden Hotel', note: '짐 맡기기' },
    { placeId: 'my-zao', label: 'My灶', note: '대만 가정식 · 닭요리' },
    { placeId: 'alleyhouse', label: '弄宅咖啡', note: '골목 주택 카페 · 휴식' },
    { placeId: 'taipei-fine-arts', label: '타이베이 시립미술관', note: '현대미술' },
    { placeId: 'xiaoyin-dongmen', label: '小隱茶庵', note: '대만차 · 조용한 찻집' },
    { placeId: 'xiao-tong-yi', label: '小統一牛排', note: '19:00 · 3인 예약' },
    { placeId: 'longshan', label: '용산사', note: '비가 약해지면' },
    { placeId: 'carrefour-guilin', label: '까르푸 → 호텔', note: '비가 강하면 바로' },
  ],
}

const dayOneRainSchedule: TimelineItem[] = [
  {
    time: '09:50',
    title: '타오위안공항 T2 도착',
    localName: '桃園國際機場 第二航廈',
    description: '아시아나항공 OZ711 도착 뒤 입국심사와 수하물 수령을 마치고 피켓 기사님을 만납니다.',
    transport: '아시아나항공 OZ711',
    tags: ['Plan A/B 공통'],
    placeId: 'taoyuan-t2',
  },
  {
    time: '입국·수하물 후',
    title: 'Mercedes 항공의자 차량 → 호텔',
    localName: '宇航富豪 · 賓士航空椅',
    description: '날씨와 관계없이 타오위안공항 T2에서 사진 속 Mercedes-Benz 항공의자 차량을 타고 Taipei Garden Hotel로 이동합니다. 피켓 미팅과 수하물 도움을 받은 뒤 호텔에 짐을 맡기고 예약된 점심으로 이동합니다.',
    transport: '宇航富豪 · Mercedes-Benz 항공의자 차량',
    tags: ['Plan A/B 공통', '예약 확정', '사진 속 차량 지정'],
    image: 'airport-pickup-mercedes-cabin.jpg',
    mapQuery: 'Taoyuan International Airport Terminal 2 to Taipei Garden Hotel',
    placeId: 'taoyuan-t2',
  },
  {
    time: '약 11:20–11:40',
    title: '호텔에 짐 맡기기',
    localName: '台北花園大酒店',
    description: '체크인 전이면 짐만 맡기고 바로 첫 점심으로 이동합니다.',
    placeId: 'hotel',
  },
  {
    time: '11:50 전후',
    title: '택시로 My灶 이동',
    description: '12:10 점심 시간을 안정적으로 맞추기 위해 택시를 이용합니다.',
    transport: '택시',
  },
  {
    time: '12:10–13:15',
    title: 'My灶 점심',
    localName: 'My灶',
    description: '날씨와 관계없이 예약한 메뉴로 첫 점심을 즐깁니다. 이 시간은 Plan A와 Plan B 모두 고정입니다.',
    tags: ['시간 고정', '점심'],
    placeId: 'my-zao',
  },
  {
    time: '13:30–14:10',
    title: '弄宅咖啡',
    localName: '弄宅咖啡 · Alleyhouse Coffee',
    description: '13:30 성인 3명 예약이 확정된 골목 주택 카페에서 약 40분 쉬어 갑니다. Plan A·B1·B2에서 모두 그대로 유지합니다.',
    tags: ['13:30 예약 확정', 'Plan A/B 공통'],
    placeId: 'alleyhouse',
  },
  {
    time: '14:10–14:25',
    title: '타이베이 시립미술관 이동',
    description: '弄宅咖啡에서 타이베이 시립미술관까지 택시로 이동합니다.',
    transport: '택시',
  },
  {
    time: '14:25–16:35',
    title: '타이베이 시립미술관',
    localName: '臺北市立美術館',
    description: '2027년 2월 실제 전시가 가족 취향에 맞을 때만 선택합니다. 설치·영상·개념 중심이거나 휴관·전시 공백이 있으면 B2 수진박물관으로 전환합니다.',
    tags: ['실내 일정', '전시 확인 후 최종 선택'],
    placeId: 'taipei-fine-arts',
  },
  {
    time: '16:35–17:00',
    title: '동먼 찻집으로 이동',
    description: '미술관 관람을 마치고 동먼의 작은 대만차 찻집으로 이동합니다.',
    transport: '택시',
  },
  {
    time: '17:00–18:15',
    title: '대만차 1순위 · 小隱茶庵',
    localName: '小隱茶庵 東門店',
    description: 'Plan B를 선택한 날 오전에 자리 가능 여부를 확인하고, 가능하면 당일 예약해 대만차를 천천히 즐깁니다.',
    tags: ['당일 아침 자리 확인', '1순위'],
    placeId: 'xiaoyin-dongmen',
  },
  {
    time: '같은 시간 · 만석이면',
    title: '찻집 백업 · 回留',
    localName: '回留',
    description: '小隱茶庵이 만석이면 용캉제의 回留로 바로 전환합니다. 두 찻집을 모두 예약하는 일정은 아닙니다.',
    tags: ['만석일 때만', '백업'],
    placeId: 'huiliu',
    optional: true,
  },
  {
    time: '18:15–18:40',
    title: '小統一牛排로 이동',
    description: '찻집에서 나와 예약 시간에 맞춰 스테이크 레스토랑으로 이동합니다.',
    transport: '택시',
  },
  {
    time: '19:00–20:15',
    title: '小統一牛排 저녁',
    localName: '小統一牛排館',
    description: '2027년 2월 20일 토요일 19:00, 성인 3명 예약이 완료된 저녁입니다. 날씨와 관계없이 시간을 바꾸지 않습니다.',
    tags: ['19:00 고정', '3인 예약 완료'],
    placeId: 'xiao-tong-yi',
  },
  {
    time: '저녁 이후 · 비가 약해지면',
    title: '용산사와 완화의 밤',
    description: '용산사와 화시제·광저우제 야시장을 짧게 걷고, 까르푸를 거쳐 호텔로 돌아갑니다.',
    tags: ['날씨 기준 추천', '현장 선택'],
    placeId: 'longshan',
    optional: true,
  },
  {
    time: '저녁 이후 · 비가 계속 강하면',
    title: '까르푸만 짧게 → 호텔',
    description: '야외 밤 일정은 미련 없이 줄이고 호텔 가까운 까르푸만 짧게 들른 뒤 숙소로 돌아갑니다.',
    tags: ['날씨 기준 추천', '축소안'],
    placeId: 'carrefour-guilin',
    optional: true,
  },
]

const dayOneIndoorBackupRoute: DayRoute = {
  title: 'B2 · 미니어처 전시와 대만차로 쉬어 가는 날',
  summary: 'TFAM 전시가 가족 취향에 맞지 않을 때만 선택합니다. 예약된 점심과 카페 뒤 수진박물관, 小隱茶庵과 19:00 저녁으로 이어집니다.',
  stops: [
    { placeId: 'taoyuan-t2', label: '타오위안공항 T2', note: '대만 도착 · 피켓 미팅' },
    { placeId: 'hotel', label: 'Taipei Garden Hotel', note: '짐 맡기기' },
    { placeId: 'my-zao', label: 'My灶', note: '대만 가정식 · 닭요리' },
    { placeId: 'alleyhouse', label: '弄宅咖啡', note: '골목 주택 카페 · 휴식' },
    { placeId: 'miniatures', label: '수진박물관', note: '미니어처 상설 전시' },
    { placeId: 'xiaoyin-dongmen', label: '小隱茶庵', note: '대만차 · 조용한 찻집' },
    { placeId: 'xiao-tong-yi', label: '小統一牛排', note: '19:00 · 3인 예약' },
    { placeId: 'longshan', label: '용산사', note: '비가 약해지면' },
    { placeId: 'carrefour-guilin', label: '까르푸 → 호텔', note: '비가 강하면 바로' },
  ],
}

const dayOneIndoorBackupSchedule: TimelineItem[] = [
  ...dayOneRainSchedule.slice(0, 6),
  {
    time: '14:10–14:20',
    title: '수진박물관 이동',
    description: '弄宅咖啡에서 가까운 수진박물관으로 짧게 이동합니다.',
    transport: '택시 · 짧은 이동',
  },
  {
    time: '14:20–15:40',
    title: 'B2 실내 백업 · 수진박물관',
    localName: '袖珍博物館',
    description: 'TFAM 실제 전시가 가족 취향에 맞지 않을 때만 선택합니다. 미니어처 상설 전시를 약 1시간 20분 둘러봅니다.',
    tags: ['우천 실내 백업', 'TFAM 대신 선택'],
    placeId: 'miniatures',
  },
  {
    time: '15:40–16:10',
    title: '동먼 찻집으로 이동',
    description: '수진박물관에서 小隱茶庵이 있는 동먼으로 택시 이동합니다.',
    transport: '택시',
  },
  {
    time: '16:10–18:15',
    title: '대만차 1순위 · 小隱茶庵',
    localName: '小隱茶庵 東門店',
    description: '저녁 예약 전까지 여유 있게 대만차와 다과를 즐깁니다. 당일 오전에 자리 가능 여부를 확인합니다.',
    tags: ['당일 아침 자리 확인', '1순위'],
    placeId: 'xiaoyin-dongmen',
  },
  {
    time: '같은 시간 · 만석이면',
    title: '찻집 백업 · 回留',
    localName: '回留',
    description: '小隱茶庵이 만석일 때만 回留로 전환합니다. 두 곳을 동시에 예약하지 않습니다.',
    tags: ['만석일 때만', '백업'],
    placeId: 'huiliu',
    optional: true,
  },
  ...dayOneRainSchedule.slice(11),
]

const dayTwoRainRoute: DayRoute = {
  title: '비 오는 이란에서 화산의 LP와 펑후 해산물까지',
  summary: '08:30–16:30에는 LUMI Alphard로 이란과 자오시를 거쳐 화산1914까지 이동하고, 이후에는 택시와 도보로 저녁과 숙소 생활권을 잇습니다.',
  stops: [
    { placeId: 'hotel', label: 'Taipei Garden Hotel', note: '08:30 · LUMI 출발' },
    { placeId: 'yilan-traditional-arts', label: '이란 전통예술센터', note: '공연·공예·옛 거리' },
    { placeId: 'shisong-yilan-main', label: '拾松 이란 본점', note: '점심 1순위 · 예약 전' },
    { placeId: 'nikko-hill', label: '日光山茶屋', note: '차·휴식 · 예약 전' },
    { placeId: 'huashan-1914', label: '화산1914', note: '16:30까지 LUMI 종료' },
    { placeId: 'beihai-hangzhou', label: '北海漁村', note: '18:30 저녁 1순위 · 예약 전' },
    { placeId: 'taihu-driftwood', label: '臺虎西門', note: '선택형 2차' },
    { placeId: 'hotel', label: '호텔', note: '21:30–22:00 목표 · 더 일러도 좋음' },
  ],
}

const dayTwoRainSchedule: TimelineItem[] = [
  {
    time: '08:30',
    title: '호텔 출발 · LUMI 8시간 시작',
    localName: '台北花園大酒店 → 宜蘭',
    description: '호텔 조식을 마치고 LUMI DRIVE의 Toyota New Alphard 40系로 출발합니다. 오늘 차량 시간은 08:30–16:30이 hard stop이며, 화산1914 도착을 위해 14:20 이후 북상 교통을 우선 판단합니다.',
    transport: 'LUMI DRIVE · Toyota New Alphard 40系',
    tags: ['08:30 출발', '16:30 hard stop', 'Plan B'],
    placeId: 'hotel',
  },
  {
    time: '약 09:40–09:50',
    title: '이란 전통예술센터 도착',
    localName: '宜蘭傳藝園區',
    description: '일요일 국도 5호선 상황을 감안한 도착 범위입니다. 비가 분위기의 일부가 되는 전통문화 마을로 들어갑니다.',
    transport: 'LUMI Alphard',
    tags: ['현실적 도착 범위'],
    placeId: 'yilan-traditional-arts',
  },
  {
    time: '09:50–11:50',
    title: '공연 하나와 공예·옛 거리',
    localName: '宜蘭傳藝園區',
    description: '공연 하나를 중심으로 공예 시연과 상점, 옛 대만 거리와 건축을 천천히 봅니다. 긴 전시 설명을 전부 읽기보다 가족이 재미있어하는 장면에 머뭅니다. 2027-02-21 실제 공연 시간표는 여행 직전에 다시 확인합니다.',
    tags: ['공연 1개', '공예·상점', '2027년 2월 직전 재확인'],
    placeId: 'yilan-traditional-arts',
  },
  {
    time: '11:50 출발 · 약 12:10–13:20',
    title: '拾松 이란 본점 · 향토 점심',
    localName: '拾松 宜蘭總店',
    description: '西魯肉·糕渣·卜肉 같은 이란 잔칫상 음식을 여러 접시로 나눠 먹는 점심 1순위입니다. 다른 지점이 아닌 女中路一段303號의 이란 본점이며, 최신 메뉴와 일요일 예약 정책을 확인한 뒤 확정합니다.',
    transport: 'LUMI Alphard',
    tags: ['점심 1순위', '예약 전', '이란 본점 지정', '2027년 2월 직전 재확인'],
    placeId: 'shisong-yilan-main',
  },
  {
    time: '13:20 출발 · 약 13:40–14:25/14:40',
    title: '日光山茶屋 · 부모님 휴식',
    localName: '日光山茶屋 · Nikko Hill Tea House',
    description: '따뜻한 차와 비 내리는 처마·산 분위기 속에서 쉬어 갑니다. 관광지를 더 넣는 시간이 아니라 북상 전 부모님이 편하게 쉬는 완충 구간이며, 현재 1순위이지만 최종 예약은 아직입니다.',
    transport: 'LUMI Alphard',
    tags: ['차와 휴식', '현재 1순위', '예약 전'],
    placeId: 'nikko-hill',
  },
  {
    time: '14:20 이후',
    title: '실시간 교통 확인 · 16:30 보호',
    description: '기사님이 국도 5호선 북상 ETA를 확인합니다. 차 시간을 더 쓰기보다 화산1914 도착과 16:30 LUMI 종료를 지키는 것이 우선이며, 정체가 예상되면 차 시간을 짧게 줄이고 바로 출발합니다.',
    transport: 'LUMI Alphard · 실시간 ETA',
    tags: ['16:30 hard stop 최우선'],
  },
  {
    time: '약 16:00–16:30 도착',
    title: '화산1914 도착 · LUMI 종료',
    localName: '華山1914文化創意產業園區',
    description: '늦어도 16:30에 차량 서비스를 종료합니다. 이 지점부터는 LUMI가 아니라 택시와 도보로 움직입니다.',
    transport: 'LUMI 종료 · 이후 택시·도보',
    tags: ['16:30 차량 종료', '이후 LUMI 사용 안 함'],
    placeId: 'huashan-1914',
  },
  {
    time: '16:30–18:15',
    title: '화산1914 · 디자인·소품·LP',
    localName: '華山1914 · 黑膠咖啡 · 未来市',
    description: 'Vinyl Decision에서 LP를 고르고 음악을 듣는 시간을 가장 우선합니다. 이어 대만·일본 디자인 소품, 목재 선물과 당일 팝업을 골라 보고, 홍차우유는 걸으며 마시는 테이크아웃 정도로 둡니다.',
    tags: ['LP 최우선', '디자인 소품', '팝업은 여행 직전 갱신'],
    placeId: 'huashan-1914',
    guideId: 'huashan',
  },
  {
    time: '18:15 전후 출발 · 18:30–20:00/20:20',
    title: '北海漁村 · 펑후 해산물 저녁',
    localName: '北海漁村海鮮餐廳 台北杭州店',
    description: '1983년 시작한 펑후 해산물 노포에서 오늘 좋은 펑후 생선, 소량 사시미, 中卷/小卷, 새우 또는 당일 좋은 제철 게와 대만 맥주를 나눕니다. 재료의 원맛을 살리는 활기 있는 현지식 저녁이며 18:30 예약은 아직 확정 전입니다.',
    transport: '화산1914 → 택시',
    tags: ['B안 저녁 1순위', '예약 전', '2027년 메뉴·18天生啤酒 재확인'],
    placeId: 'beihai-hangzhou',
    guideId: 'beihai-order',
  },
  {
    time: '20:20 이후 · 약 20:35–20:45 도착',
    title: '臺虎西門 한잔 또는 바로 호텔',
    localName: '臺虎西門 Taihu Driftwood',
    description: '택시로 숙소 생활권에 돌아온 뒤 크래프트 맥주 한잔이 더 당길 때만 들릅니다. 피곤하면 바로 호텔로 가는 것도 계획대로 잘 끝낸 정상적인 선택입니다. 2027년 일요일 영업시간은 직전에 확인합니다.',
    transport: '택시 · 이후 도보 또는 짧은 택시',
    tags: ['선택형 2차', '예약 전', '호텔 직행 정상 선택', '2027년 2월 직전 재확인'],
    placeId: 'taihu-driftwood',
    optional: true,
  },
  {
    time: '21:30–22:00 목표',
    title: '호텔 귀가 · 더 일러도 좋음',
    localName: '台北花園大酒店',
    description: '가족 컨디션에 따라 더 일찍 돌아와도 됩니다. 2차를 생략하는 것은 실패가 아니라 부모님이 편하게 하루를 마치는 정식 선택입니다.',
    transport: '도보 또는 짧은 택시',
    tags: ['컨디션 우선', '정상 종료'],
    placeId: 'hotel',
  },
]

const dayTwoHeavyRainRoute: DayRoute = {
  title: '강한 비에도 운행 가능한 실내안 · 설계 중',
  summary: 'Plan B 일정을 그대로 보여주지 않습니다. 운행과 도로가 안전한 경우에만 타오위안권 실내 문화·식사 동선을 별도로 설계할 예정입니다.',
  stops: [{ placeId: 'hotel', label: 'Taipei Garden Hotel', note: '안전·도로 상황 확인 후 결정' }],
}

const dayTwoHeavyRainSchedule: TimelineItem[] = [{
  time: '별도 설계 중',
  title: 'Plan C · 강한 비지만 운행 가능한 날',
  description: '지속적인 강한 비에도 도로와 공식 운영이 안전할 때 쓰는 실내 중심 대안입니다. Xpark만 단독으로 넣지 않고 타오위안권의 좋은 실내 문화·식사 한 곳을 함께 묶어, Alphard 8시간의 가치가 있는 별도 하루로 설계합니다.',
  tags: ['B안 재사용 아님', '상세 일정 설계 중', '안전 확인 우선'],
  placeId: 'hotel',
}]

const dayPlanMeta: Record<string, DayPlanMeta> = {
  'day-1': {
    planATheme: '린안타이 고택 · 백석호 · 벽산암',
    planASummary: '전통가옥과 산 위의 일몰을 지나 완화의 밤으로',
    planB: {
      theme: 'B1 · TFAM과 대만차',
      summary: '※ TFAM은 2027년 2월 실제 전시 확인 후 최종 선택',
      status: 'ready',
      schedule: dayOneRainSchedule,
      route: dayOneRainRoute,
    },
    planB2: {
      theme: 'B2 · 미니어처 실내 백업',
      summary: 'TFAM 전시가 취향에 맞지 않을 때만 여는 안전한 실내 대안',
      status: 'ready',
      schedule: dayOneIndoorBackupSchedule,
      route: dayOneIndoorBackupRoute,
    },
  },
  'day-2': {
    planATheme: '예류 → 스펀 → 지우펀',
    planASummary: '북해안과 지우펀의 밤을 잇고 21:00 호텔 복귀로 끝나는 맑은 날 확정안',
    planB: {
      theme: '이란 전통문화 · 자오시 차 · 화산 LP · 펑후 해산물',
      summary: '약한 비부터 중간 정도의 꾸준한 비에 여는 독립 일정 · LUMI는 08:30–16:30까지만',
      status: 'ready',
      schedule: dayTwoRainSchedule,
      route: dayTwoRainRoute,
    },
    planC: {
      theme: '강한 비 · 별도 실내안 설계 중',
      summary: '운행은 가능하지만 야외 일정이 어려운 날을 위한 독립안이며, B안 동선을 대신 표시하지 않습니다.',
      status: 'draft',
      schedule: dayTwoHeavyRainSchedule,
      route: dayTwoHeavyRainRoute,
    },
  },
  'day-3': {
    planATheme: '고궁 · 용캉제 · 85TD',
    planASummary: '보물과 골목, 마지막 밤의 기념 디너',
    planB: {
      theme: '고궁 중심의 느린 타이베이',
      summary: '고궁과 식사는 유지하고 골목 산책 대신 실내 체류를 늘립니다.',
      status: 'ready',
      schedule: [
        { time: '09:30–11:00', title: '국립고궁박물원 유지', localName: '國立故宮博物院', description: '비가 와도 고궁 관람은 그대로 진행합니다.', tags: ['실내 일정'], placeId: 'palace' },
        { time: '11:30–13:00', title: '딘타이펑 신생점 유지', localName: '鼎泰豐 新生店', description: '점심 일정은 Plan A와 동일하게 유지합니다.', tags: ['점심'], placeId: 'din-tai-fung-xinsheng' },
        { time: '13:00–15:00', title: '용캉제·칭톈제 산책 축소', localName: '永康街 · 青田街', description: '야외 골목 산책은 짧게 줄이고, 선택한 실내 카페에서 더 오래 쉽니다.', tags: ['카페 체류 확대'], placeId: 'yongkang-qingtian' },
        { time: '15:30–17:00', title: '호텔 휴식 유지', description: '마지막 저녁 전 휴식은 날씨와 관계없이 유지합니다.', tags: ['꼭 쉬기'], placeId: 'hotel' },
        { time: '18:00–20:30', title: '85TD 메인 디너 유지', description: 'Taipei 101 이동과 85TD 저녁은 기존 일정대로 진행합니다.', tags: ['예약 오픈 대기'], placeId: '85td' },
      ],
      route: {
        ...dayRoutes['day-3'],
        title: '고궁과 실내 체류 중심의 느린 동선',
        summary: '고궁과 딘타이펑은 유지하고, 용캉제·칭톈제에서는 야외 산책을 줄여 카페에서 더 오래 머뭅니다.',
      },
    },
  },
  'day-4': {
    planATheme: '식물원 · 장어덮밥 · 귀국',
    planASummary: '호텔 가까운 초록길을 걷고 편안하게 공항으로',
    planB: {
      theme: '마지막 날, 가장 단순하게',
      summary: '식물원은 생략하고 호텔, 비전옥, 공항만 편안하게 잇습니다.',
      status: 'ready',
      schedule: [
        { time: '늦은 아침', title: '호텔에서 여유', description: '식물원은 미련 없이 생략하고 호텔에서 천천히 준비합니다.', tags: ['식물원 생략 가능'], placeId: 'hotel' },
        { time: '10:30–11:20', title: '체크아웃', description: '짐을 정리하고 잠정 픽업 시간에 맞춰 로비에서 차량을 만납니다.', placeId: 'hotel' },
        { time: '11:20 전후 · 잠정', title: 'LUMI DRIVE Alphard 이용', description: '호텔에서 비전옥을 거쳐 타오위안공항 T2로 이동합니다. 식사 중 차량이 대기하고 캐리어는 차에 보관합니다.', transport: 'LUMI DRIVE · Toyota New Alphard 40系' },
        { time: '점심', title: '肥前屋 비전옥', localName: '肥前屋', description: '마지막 식사는 기존 계획대로 장어덮밥을 먹습니다.', tags: ['짐은 차량 보관'], placeId: 'hizenya' },
        { time: '공항', title: '타오위안공항 T2', localName: '桃園國際機場 第二航廈', description: '비즈니스 체크인과 라운지를 이용하며 여유 있게 탑승을 준비합니다.', placeId: 'taoyuan-t2' },
      ],
      route: {
        title: '호텔에서 비전옥을 거쳐 공항까지',
        summary: '비가 오면 식물원을 생략하고 호텔 체크아웃, 비전옥 점심, 타오위안공항 T2만 단순하게 이어갑니다.',
        stops: [
          { placeId: 'hotel', label: 'Taipei Garden Hotel', note: '여유·체크아웃' },
          { placeId: 'hizenya', label: '비전옥', note: '점심' },
          { placeId: 'taoyuan-t2', label: '타오위안공항 T2', note: '귀국' },
        ],
      },
    },
  },
}

export const getDayPlans = (day: TripDay): DayPlan[] => {
  const meta = dayPlanMeta[day.id]
  if (!meta) return []

  const plans: DayPlan[] = [
    {
      id: 'plan-a',
      label: 'PLAN A',
      theme: meta.planATheme,
      summary: meta.planASummary,
      weatherType: 'fair',
      status: 'ready',
      schedule: day.schedule,
      route: dayRoutes[day.id],
    },
    {
      id: 'plan-b',
      label: day.id === 'day-1' ? 'PLAN B1' : 'PLAN B',
      weatherType: 'rain',
      ...meta.planB,
    },
  ]

  if (meta.planB2) {
    plans.push({
      id: 'plan-b2',
      label: 'PLAN B2',
      weatherType: 'rain',
      ...meta.planB2,
    })
  }

  if (meta.planC) {
    plans.push({
      id: 'plan-c',
      label: 'PLAN C',
      weatherType: 'rain',
      ...meta.planC,
    })
  }

  return plans
}
