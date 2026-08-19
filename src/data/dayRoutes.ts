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
    title: '공항에서 노을과 올드 타이베이까지',
    summary: '타오위안공항 T2에서 시작해 중정기념당과 단수이의 노을을 거쳐 타이베이의 밤으로 돌아옵니다.',
    stops: [
      { placeId: 'taoyuan-t2', label: '타오위안공항 T2', note: '대만 도착' },
      { placeId: 'hotel', label: 'Taipei Garden Hotel', note: '짐 맡기기' },
      { placeId: 'chun-shui-tang', label: '춘수당', note: '점심' },
      { placeId: 'chiang-kai-shek', label: '중정기념당' },
      { placeId: 'tamsui-wharf', label: '단수이 위런마터우', note: '일몰' },
      { placeId: 'yuzang', label: '魚藏餐廳', note: '저녁' },
      { placeId: 'longshan', label: '용산사' },
      { placeId: 'huaxi', label: '화시제 야시장', note: '선택' },
      { placeId: 'ximending', label: '시먼딩', note: '마무리' },
    ],
  },
  'day-2': {
    title: '북해안에서 지우펀의 밤까지',
    summary: '전용차로 북해안과 스펀을 잇고, 지우펀의 밤을 충분히 즐긴 뒤 현장 호출 택시로 돌아옵니다.',
    stops: [
      { placeId: 'hotel', label: 'Taipei Garden Hotel', note: '08:30 출발' },
      { placeId: 'yehliu', label: '예류지질공원' },
      { placeId: 'qiao-yan', label: 'Qiao Yan', note: '점심' },
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
