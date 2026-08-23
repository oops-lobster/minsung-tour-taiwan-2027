import type { PlaceId } from './localTools'

export interface DayRouteStop {
  placeId: PlaceId
  label: string
  note?: string
}

export interface DayRoute {
  title: string
  summary: string
  stops: DayRouteStop[]
}

export const dayRoutes: Record<string, DayRoute> = {
  'day-1': {
    title: '전통가옥에서 산 위의 일몰과 완화의 밤까지',
    summary: '공항 픽업과 좋은 점심으로 시작해 린안타이 고택, 백석호와 벽산암을 잇고 완화의 밤을 즐긴 뒤 호텔로 돌아옵니다.',
    stops: [
      { placeId: 'taoyuan-t2', label: '타오위안공항 T2', note: '대만 도착 · 피켓 미팅' },
      { placeId: 'hotel', label: 'Taipei Garden Hotel', note: '짐 맡기기' },
      { placeId: 'my-zao', label: 'My灶', note: '대만 가정식 · 닭요리' },
      { placeId: 'alleyhouse', label: '弄宅咖啡', note: '골목 주택 카페 · 휴식' },
      { placeId: 'lin-an-tai', label: '린안타이 고택', note: '전통가옥 · 정원' },
      { placeId: 'baishihu', label: '백석호', note: '출렁다리 · 하트연못' },
      { placeId: 'bishanyan', label: '벽산암', note: '사원 · 전망 · 일몰' },
      { placeId: 'xiao-tong-yi', label: '小統一牛排', note: '대만식 클래식 스테이크' },
      { placeId: 'longshan', label: '용산사', note: '야간 사찰' },
      { placeId: 'huaxi', label: '화시제·광저우제', note: '야시장 · 밤 골목' },
      { placeId: 'carrefour-guilin', label: '까르푸 → 호텔', note: '간식 쇼핑 후 숙소' },
    ],
  },
  'day-2': {
    title: '북해안에서 지우펀의 밤까지',
    summary: '전용차로 북해안과 스펀을 잇고, 지우펀의 밤을 충분히 즐긴 뒤 현장 호출 택시로 돌아옵니다.',
    stops: [
      { placeId: 'hotel', label: 'Taipei Garden Hotel', note: '08:30 출발' },
      { placeId: 'yehliu', label: '예류지질공원' },
      { placeId: 'guihou', label: '귀후어항 어시장', note: '현장 선택형 점심' },
      { placeId: 'shifen-waterfall', label: '스펀폭포' },
      { placeId: 'shifen-old-street', label: '스펀 옛거리' },
      { placeId: 'jiufen', label: '지우펀', note: '전용차 종료' },
      { placeId: 'hotel', label: '호텔', note: '현장 호출 택시' },
    ],
  },
  'day-3': {
    title: '타이베이를 가볍게 가로지르는 날',
    summary: '고궁과 용캉제 사이를 택시로 이동하고, 호텔에서 충분히 쉰 뒤 Taipei 101의 마지막 밤을 맞습니다.',
    stops: [
      { placeId: 'hotel', label: 'Taipei Garden Hotel', note: '아침' },
      { placeId: 'palace', label: '국립고궁박물원' },
      { placeId: 'din-tai-fung-xinsheng', label: '딘타이펑 신생점', note: '점심' },
      { placeId: 'yongkang-qingtian', label: '용캉제·칭톈제', note: '산책·카페' },
      { placeId: 'hotel', label: '호텔', note: '휴식' },
      { placeId: 'taipei-101', label: 'Taipei 101', note: '야경' },
      { placeId: '85td', label: '85TD', note: '메인 디너' },
    ],
  },
  'day-4': {
    title: '호텔 주변에서 공항까지',
    summary: '호텔 가까이에서 느긋하게 시작하고, 비전옥에서 마지막 식사를 한 뒤 타오위안공항 T2로 이동합니다.',
    stops: [
      { placeId: 'hotel', label: 'Taipei Garden Hotel', note: '아침' },
      { placeId: 'botanical', label: '타이베이 식물원' },
      { placeId: 'hotel', label: '호텔', note: '체크아웃' },
      { placeId: 'hizenya', label: '비전옥', note: '점심' },
      { placeId: 'taoyuan-t2', label: '타오위안공항 T2', note: '귀국' },
    ],
  },
}
