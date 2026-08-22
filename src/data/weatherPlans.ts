import type { DayRoute } from './dayRoutes'
import { dayRoutes } from './dayRoutes'
import { rainPlans, type PlaceId } from './localTools'
import type { TimelineItem, TripDay } from './trip'
import { RAIN_PLAN_THRESHOLD, type DayWeatherConfig, type WeatherPlanId } from '../lib/weather'

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
}

const asPlaceId = (id: string) => id as PlaceId

export const dayWeatherConfigs: Record<string, DayWeatherConfig> = {
  'day-1': {
    date: '2027-02-20',
    representativeLocation: 'Taipei',
    locations: [{ id: 'taipei', name: 'Taipei', latitude: 25.033, longitude: 121.5654 }],
    startHour: 13,
    endHour: 19,
    rainThreshold: RAIN_PLAN_THRESHOLD,
  },
  'day-2': {
    date: '2027-02-21',
    representativeLocation: 'Taipei · Northern Taiwan',
    locations: [
      { id: 'yehliu', name: 'Yehliu', latitude: 25.2053, longitude: 121.6905 },
      { id: 'shifen', name: 'Shifen', latitude: 25.0434, longitude: 121.775 },
      { id: 'jiufen', name: 'Jiufen', latitude: 25.1099, longitude: 121.8452 },
    ],
    startHour: 9,
    endHour: 18,
    rainThreshold: RAIN_PLAN_THRESHOLD,
  },
  'day-3': {
    date: '2027-02-22',
    representativeLocation: 'Taipei',
    locations: [{ id: 'taipei', name: 'Taipei', latitude: 25.033, longitude: 121.5654 }],
    startHour: 9,
    endHour: 17,
    rainThreshold: RAIN_PLAN_THRESHOLD,
  },
  'day-4': {
    date: '2027-02-23',
    representativeLocation: 'Taipei',
    locations: [{ id: 'taipei', name: 'Taipei', latitude: 25.033, longitude: 121.5654 }],
    startHour: 8,
    endHour: 14,
    rainThreshold: RAIN_PLAN_THRESHOLD,
  },
}

const dayOneRainRoute: DayRoute = {
  title: '현대미술과 대만차로 이어지는 비 오는 타이베이',
  summary: '공항과 호텔을 거쳐 My灶에서 점심을 먹고, 타이베이 시립미술관과 小隱茶庵에서 머문 뒤 예약된 스테이크 저녁으로 이동합니다.',
  stops: [
    { placeId: asPlaceId('taoyuan-t2'), label: '타오위안공항 T2', note: '대만 도착' },
    { placeId: asPlaceId('hotel'), label: 'Taipei Garden Hotel', note: '짐 맡기기' },
    { placeId: asPlaceId('my-zao'), label: 'My灶', note: '12:10 점심' },
    { placeId: 'taipei-fine-arts', label: '타이베이 시립미술관', note: '현대미술' },
    { placeId: 'xiaoyin-dongmen', label: '小隱茶庵', note: '17:00 · 당일 자리 확인' },
    { placeId: asPlaceId('xiao-tong-yi'), label: '小統一牛排', note: '19:00 · 3인 예약' },
    { placeId: asPlaceId('carrefour-guilin'), label: '까르푸 구이린점', note: '비가 강하면 짧게' },
    { placeId: asPlaceId('hotel'), label: '호텔', note: '마무리' },
  ],
}

const dayOneRainSchedule: TimelineItem[] = [
  {
    time: '도착 후–12:05',
    title: '공항 → 호텔 → My灶',
    description: '입국, 호텔 이동과 짐 맡기기, MRT 이동까지는 Plan A와 동일하게 진행합니다.',
    transport: '奇立 Lexus ES300h · MRT',
    tags: ['Plan A/B 공통'],
    placeId: asPlaceId('hotel'),
  },
  {
    time: '12:10–13:20',
    title: 'My灶 점심',
    localName: 'My灶',
    description: '날씨와 관계없이 예약한 메뉴로 첫 점심을 즐깁니다. 이 시간은 Plan A와 Plan B 모두 고정입니다.',
    tags: ['시간 고정', '점심'],
    placeId: asPlaceId('my-zao'),
  },
  {
    time: '13:20–13:40',
    title: '타이베이 시립미술관 이동',
    description: 'My灶에서 미술관까지 택시로 바로 이동합니다.',
    transport: '택시',
  },
  {
    time: '13:40–16:20',
    title: '타이베이 시립미술관',
    localName: '臺北市立美術館',
    description: '비 오는 오후에는 백석호 대신 타이베이 현대미술을 천천히 봅니다. 전시가 좋으면 16:30까지 여유 있게 관람합니다.',
    tags: ['실내 일정', '16:30까지 조절 가능'],
    placeId: 'taipei-fine-arts',
  },
  {
    time: '16:20–17:00',
    title: '동먼 찻집으로 이동',
    description: '미술관 관람을 마치고 동먼의 작은 대만차 찻집으로 이동합니다.',
    transport: '택시',
  },
  {
    time: '17:00–18:30',
    title: '대만차 1순위 · 小隱茶庵',
    localName: '小隱茶庵 東門店',
    description: 'Plan B를 선택한 날 오전에 17:00 자리 가능 여부를 확인하고, 가능하면 당일 예약해 대만차를 천천히 즐깁니다.',
    tags: ['당일 아침 자리 확인', '1순위'],
    placeId: 'xiaoyin-dongmen',
  },
  {
    time: '17:00–18:30 · 만석이면',
    title: '찻집 백업 · 回留',
    localName: '回留',
    description: '小隱茶庵이 만석이면 용캉제의 回留로 바로 전환합니다. 두 찻집을 모두 예약하는 일정은 아닙니다.',
    tags: ['만석일 때만', '백업'],
    placeId: 'huiliu',
    optional: true,
  },
  {
    time: '18:30–18:50',
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
    placeId: asPlaceId('xiao-tong-yi'),
  },
  {
    time: '저녁 이후 · 비가 약해지면',
    title: '용산사와 완화의 밤',
    description: '용산사와 화시제·광저우제 야시장을 짧게 걷고, 가능하면 삼미식당 포장과 까르푸를 거쳐 호텔로 돌아갑니다.',
    tags: ['날씨 기준 추천', '현장 선택'],
    placeId: asPlaceId('longshan'),
    optional: true,
  },
  {
    time: '저녁 이후 · 비가 계속 강하면',
    title: '까르푸만 짧게 → 호텔',
    description: '야외 밤 일정은 미련 없이 줄이고 호텔 가까운 까르푸만 짧게 들른 뒤 숙소로 돌아갑니다.',
    tags: ['날씨 기준 추천', '축소안'],
    placeId: asPlaceId('carrefour-guilin'),
    optional: true,
  },
]

const rainOptionsFor = (day: string) => rainPlans.find((plan) => plan.day === day)?.options ?? []

const dayPlanMeta: Record<string, DayPlanMeta> = {
  'day-1': {
    planATheme: '백석호와 벽산암',
    planASummary: '산 위의 일몰과 오래된 타이베이의 밤',
    planB: {
      theme: '현대미술과 대만차',
      summary: '비 오는 타이베이 · 현대미술, 차 그리고 스테이크',
      status: 'ready',
      schedule: dayOneRainSchedule,
      route: dayOneRainRoute,
    },
  },
  'day-2': {
    planATheme: '예류 → 스펀 → 지우펀',
    planASummary: '전용차로 북해안과 산골 마을을 잇는 하루',
    planB: {
      theme: '북해안 날씨 대응 버전',
      summary: '완전 대체 일정은 준비 중이며, 비의 세기에 따라 야외 구간을 줄입니다.',
      status: 'draft',
      schedule: rainOptionsFor('DAY 2').map((option) => ({
        time: option.condition,
        title: option.condition === '약한 비' ? '원안 유지' : option.condition === '강한 비' ? '스펀폭포 우선 조절' : '기사님과 동선 재판단',
        description: option.action,
        tags: ['날씨 기준 추천', 'Plan B 준비 중'],
      })),
      route: {
        ...dayRoutes['day-2'],
        title: '북해안 우천 대응 동선',
        summary: '아직 완전 대체 일정은 준비 중입니다. 실제 비와 바람을 보고 스펀폭포를 먼저 줄이고, 폭우·강풍에는 기사님과 예류·스펀을 다시 판단합니다.',
      },
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

  return [
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
      label: 'PLAN B',
      weatherType: 'rain',
      ...meta.planB,
    },
  ]
}
