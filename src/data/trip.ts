import type { PlaceId } from './localTools'

export type StatusTone = 'confirmed' | 'progress' | 'waiting' | 'flexible'

export interface TripStatus {
  label: string
  detail: string
  status: string
  tone: StatusTone
  icon: 'plane' | 'hotel' | 'car' | 'meal' | 'utensils'
}

export interface TimelineItem {
  time: string
  title: string
  localName?: string
  description: string
  transport?: string
  tags?: string[]
  image?: string
  mapQuery?: string
  placeId?: PlaceId
  optional?: boolean
}

export interface TripDay {
  id: string
  day: string
  date: string
  weekday: string
  title: string
  theme: string
  lead: string
  intensity: string
  walking: string
  transport: string
  keyPlaces: string
  keyMeal: string
  cover: string
  schedule: TimelineItem[]
}

export const tripMeta = {
  title: '민성투어',
  englishTitle: 'TAIWAN 2027',
  startDate: '2027-02-20',
  endDate: '2027-02-23',
  dateLabel: '2027.02.20 SAT — 02.23 TUE',
  description: '부모님과 함께하는 3박 4일 타이베이 가족여행',
  travelers: '성인 3명',
}

export const tripStatuses: TripStatus[] = [
  {
    label: '아시아나 비즈니스',
    detail: '왕복 3인',
    status: '예약 완료',
    tone: 'confirmed',
    icon: 'plane',
  },
  {
    label: 'Taipei Garden Hotel',
    detail: '3박 · 무료취소',
    status: '예약 완료',
    tone: 'confirmed',
    icon: 'hotel',
  },
  {
    label: 'Day 2 VIP 의전차량',
    detail: '2열 편안함 · 의전 품질 우선',
    status: '최종 비교 중',
    tone: 'progress',
    icon: 'car',
  },
  {
    label: '85TD',
    detail: 'Day 3 메인 디너',
    status: '예약 오픈 대기',
    tone: 'waiting',
    icon: 'meal',
  },
  {
    label: 'Day 4 공항 이동',
    detail: 'Day 2 선정 업체 재이용 방향',
    status: '검토 중',
    tone: 'progress',
    icon: 'car',
  },
  {
    label: '주요 식사',
    detail: '후보와 예정 일정 반영',
    status: '현장 결정 포함',
    tone: 'flexible',
    icon: 'utensils',
  },
]

export const days: TripDay[] = [
  {
    id: 'day-1',
    day: 'DAY 1',
    date: '02.20',
    weekday: 'SAT',
    title: '타이베이의 첫인상',
    theme: '단수이 일몰 · 올드 타이베이의 밤',
    lead: '도시에 천천히 들어가 바다의 노을을 보고, 오래된 골목과 네온의 밤으로 첫날을 마무리합니다.',
    intensity: '보통',
    walking: '약 6–8천 보 예상',
    transport: '공항 MRT + 택시',
    keyPlaces: '중정기념당 · 단수이 · 용산사',
    keyMeal: '춘수당 · 魚藏餐廳',
    cover: 'tamsui.webp',
    schedule: [
      {
        time: '10:00',
        title: '인천 출발',
        description: '아시아나항공 비즈니스로 편안하게 여행을 시작합니다.',
        transport: '아시아나항공',
        tags: ['예약 완료'],
      },
      {
        time: '11:30',
        title: '타오위안공항 도착',
        localName: '桃園國際機場 第一航廈',
        description: '입국과 수하물 수령을 마친 뒤 서두르지 않고 이동합니다.',
        mapQuery: 'Taoyuan International Airport Terminal 1',
        placeId: 'taoyuan-t1',
      },
      {
        time: '12:40–13:30',
        title: 'Airport MRT → 타이베이역',
        description: '이번 여행에서 공항철도를 직접 경험하는 유일한 구간입니다.',
        transport: 'Airport MRT',
      },
      {
        time: '13:30–13:50',
        title: 'Taipei Garden Hotel',
        localName: '台北花園大酒店',
        description: '체크인 전 짐을 맡기고 가볍게 첫 일정을 시작합니다.',
        mapQuery: 'Taipei Garden Hotel',
        placeId: 'hotel',
      },
      {
        time: '14:00–14:50',
        title: '춘수당 중정기념당점',
        localName: '春水堂 中正店',
        description: '공푸면과 버블티로 첫 끼는 가볍게. 비행 뒤 부담 없이 먹는 점심입니다.',
        mapQuery: 'Chun Shui Tang Chiang Kai-shek Memorial Hall Taipei',
        placeId: 'chun-shui-tang',
        tags: ['점심'],
      },
      {
        time: '15:00–15:50',
        title: '중정기념당',
        localName: '中正紀念堂',
        description: '넓은 공간을 전부 돌기보다 핵심 구역만 45–50분 천천히 둘러봅니다.',
        image: 'chiang-kai-shek.webp',
        mapQuery: 'Chiang Kai-shek Memorial Hall',
        placeId: 'chiang-kai-shek',
      },
      {
        time: '16:00 전후',
        title: '택시로 단수이 이동',
        description: '중정기념당에서 단수이 위런마터우까지 편하게 이동합니다.',
        transport: '택시',
      },
      {
        time: '16:30–17:30',
        title: '단수이 위런마터우',
        localName: '淡水漁人碼頭 · 情人橋',
        description: '바닷바람을 맞으며 연인의 다리 주변을 산책하고 일몰을 감상합니다.',
        transport: '택시',
        image: 'tamsui.webp',
        mapQuery: "Tamsui Fisherman's Wharf Lover's Bridge",
        placeId: 'tamsui-wharf',
      },
      {
        time: '17:30–19:30',
        title: '魚藏餐廳',
        description: '단수이에서 대만식 해산물로 여유 있게 저녁을 먹습니다.',
        mapQuery: '魚藏餐廳 淡水',
        placeId: 'yuzang',
        tags: ['저녁'],
      },
      {
        time: '19:30 이후',
        title: '택시로 용산사 이동',
        description: '저녁을 마친 뒤 올드 타이베이의 밤을 보기 위해 용산사로 이동합니다.',
        transport: '택시',
      },
      {
        time: '20:30 전후',
        title: '용산사 야간 관람',
        localName: '艋舺龍山寺',
        description: '조명이 켜진 사찰의 분위기를 보고, 올드 타이베이의 밤으로 이어갑니다.',
        image: 'longshan.webp',
        mapQuery: 'Longshan Temple Taipei',
        placeId: 'longshan',
      },
      {
        time: '이후',
        title: '화시제·광저우제 야시장',
        localName: '華西街觀光夜市 · 廣州街夜市',
        description: '먹방 일정이 아니라 20–30분 정도 밤 골목의 분위기만 봅니다. 피곤하면 바로 줄입니다.',
        image: 'huaxi.webp',
        mapQuery: 'Huaxi Street Night Market',
        placeId: 'huaxi',
        tags: ['선택 일정'],
        optional: true,
      },
      {
        time: '선택 간식',
        title: '삼미식당 연어초밥 포장',
        localName: '三味食堂',
        description: '용산사·야시장 동선에서 상황이 되면 연어초밥을 포장해 호텔 야식으로 먹습니다. 대기가 길거나 시간이 빠듯하면 미련 없이 패스합니다.',
        mapQuery: '三味食堂 Taipei',
        placeId: 'sanwei',
        tags: ['호텔 야식', '대기 길면 패스'],
        optional: true,
      },
      {
        time: '마무리',
        title: '시먼딩과 18일 생맥주',
        localName: '西門町 · 18天台灣生啤酒',
        description: '야시장 이후 시먼딩 방향으로 걸으며 네온의 밤을 즐깁니다. 18일 타이완 생맥주를 마실 정확한 술집은 현장에서 정한 뒤 택시로 호텔에 돌아갑니다.',
        image: 'ximending.webp',
        mapQuery: 'Ximending Taipei',
        placeId: 'ximending',
        tags: ['2차 · 술집 현장 결정'],
        optional: true,
      },
    ],
  },
  {
    id: 'day-2',
    day: 'DAY 2',
    date: '02.21',
    weekday: 'SUN',
    title: '예류 · 스펀 · 지우펀',
    theme: '가장 활동적인 날',
    lead: '여행 중 가장 많이 움직이는 날이지만, 장거리 구간은 전용차에서 충분히 쉬며 이어갑니다.',
    intensity: '높음',
    walking: '약 9천–1.2만 보 예상',
    transport: 'VIP 의전차량 · 최종 비교 중',
    keyPlaces: '예류 · 스펀 · 지우펀',
    keyMeal: 'Qiao Yan · 지우펀 현지식',
    cover: 'jiufen.webp',
    schedule: [
      {
        time: '07:00–07:50',
        title: '호텔 조식',
        description: '활동량이 많은 날이니 호텔에서 든든하게 시작합니다.',
        placeId: 'hotel',
        tags: ['아침'],
      },
      {
        time: '08:30',
        title: '호텔 로비 출발',
        description: '부모님이 이동 중 충분히 쉴 수 있도록 독립 캡틴시트와 리클라이너·오토만·통풍·열선·마사지 기능을 갖춘 VIP 차량을 비교하고 있습니다.',
        transport: 'Toyota Alphard 40 / Lexus LM350h 등',
        tags: ['업체·차량 최종 비교 중'],
      },
      {
        time: '09:20–10:50',
        title: '예류지질공원',
        localName: '野柳地質公園',
        description: '바닷바람을 맞으며 핵심 바위 구역 중심으로 천천히 둘러봅니다.',
        image: 'yehliu.webp',
        mapQuery: 'Yehliu Geopark',
        placeId: 'yehliu',
      },
      {
        time: '11:00–12:00',
        title: 'Qiao Yan Seafood / 俏宴',
        description: '예류 인근의 깔끔한 실내에서 해산물과 스시·사시미 계열 점심을 먹습니다.',
        mapQuery: '俏宴 Yehliu',
        placeId: 'qiao-yan',
        tags: ['점심 · 후보'],
      },
      {
        time: '12:00–13:00',
        title: '스펀 이동',
        description: '차량에서 쉬는 시간입니다. 부모님 컨디션을 확인하고 오후 일정을 조절합니다.',
        transport: '전용차',
      },
      {
        time: '13:00–14:00',
        title: '스펀폭포',
        localName: '十分瀑布',
        description: '날씨가 괜찮다면 폭포 전망 구간을 보고, 비가 계속되면 가장 먼저 생략을 검토합니다.',
        image: 'shifen-waterfall.webp',
        mapQuery: 'Shifen Waterfall',
        placeId: 'shifen-waterfall',
      },
      {
        time: '14:10–15:20',
        title: '스펀 옛거리',
        localName: '十分老街',
        description: '철길 마을을 구경하고 세 사람의 소원을 적은 풍등을 띄웁니다.',
        image: 'shifen-lantern.webp',
        mapQuery: 'Shifen Old Street',
        placeId: 'shifen-old-street',
      },
      {
        time: '15:20 이후',
        title: '지우펀 이동',
        description: '차량에서 쉬면서 지우펀으로 이동합니다. 도착 전 부모님 컨디션을 다시 확인합니다.',
        transport: 'VIP 의전차량',
      },
      {
        time: '16:15 전후',
        title: '지우펀 도착 · VIP 차량 서비스 종료',
        localName: '九份老街',
        description: '지우펀 드롭에서 기사님과 작별합니다. 차량 서비스는 여기에서 종료하는 계획입니다.',
        transport: '전용차 종료',
        placeId: 'jiufen',
        tags: ['중요'],
      },
      {
        time: '16:15 이후',
        title: '지우펀 골목과 야경',
        description: '붉은 등불이 켜지는 골목을 천천히 걷고, 현지식과 고량주로 저녁을 즐깁니다.',
        image: 'jiufen.webp',
        mapQuery: 'Jiufen Old Street',
        placeId: 'jiufen',
        tags: ['저녁'],
      },
      {
        time: '귀환',
        title: '호텔로 바로 돌아가기',
        description: '저녁을 충분히 즐긴 뒤 택시 또는 예약 차량으로 호텔에 돌아갑니다. 별도 야시장·시먼딩 일정은 없습니다.',
        transport: '택시 / 예약 차량',
      },
    ],
  },
  {
    id: 'day-3',
    day: 'DAY 3',
    date: '02.22',
    weekday: 'MON',
    title: '고궁 · 용캉제 · 85TD',
    theme: '여행의 마지막 밤',
    lead: '오전에는 타이완의 보물을 만나고, 오후에 충분히 쉬었다가 여행의 메인 디너를 즐깁니다.',
    intensity: '여유',
    walking: '약 6–8천 보 예상',
    transport: '택시 중심',
    keyPlaces: '고궁 · 용캉제·칭톈제 · Taipei 101',
    keyMeal: '딘타이펑 신생점 · 85TD',
    cover: 'taipei-night.webp',
    schedule: [
      {
        time: '08:00–08:30',
        title: '호텔 인근 가벼운 아침',
        description: '맥모닝 등 익숙하고 가벼운 메뉴로 시작합니다.',
        placeId: 'hotel',
        tags: ['아침'],
      },
      {
        time: '09:00–09:30',
        title: '국립고궁박물원 이동',
        description: '호텔에서 국립고궁박물원까지 택시로 이동합니다.',
        transport: '택시',
      },
      {
        time: '09:30–11:00',
        title: '국립고궁박물원',
        localName: '國立故宮博物院',
        description: '대표 소장품과 핵심 전시 중심으로 1시간 30분. 모든 전시를 보려 욕심내지 않습니다.',
        image: 'palace.webp',
        mapQuery: 'National Palace Museum Taipei',
        placeId: 'palace',
      },
      {
        time: '11:00–11:30',
        title: '딘타이펑 신생점 이동',
        description: '고궁에서 원조 계보의 딘타이펑 신생점까지 택시로 이동합니다.',
        transport: '택시',
      },
      {
        time: '11:30–13:00',
        title: '딘타이펑 신생점',
        localName: '鼎泰豐 新生店',
        description: '원조 계보의 신생점에서 샤오롱바오와 딤섬을 함께 나눠 먹는 점심입니다.',
        image: 'xiaolongbao.webp',
        mapQuery: 'Din Tai Fung Xinsheng Branch Taipei',
        placeId: 'din-tai-fung-xinsheng',
        tags: ['점심'],
      },
      {
        time: '13:00–15:00',
        title: '용캉제·칭톈제 산책과 카페',
        localName: '永康街 · 青田街',
        description: '식사 후 바로 걸어서 골목과 카페거리를 즐깁니다. 부모님 컨디션에 맞춰 카페에서 충분히 쉽니다.',
        mapQuery: 'Yongkang Street and Qingtian Street Taipei',
        placeId: 'yongkang-qingtian',
      },
      {
        time: '15:00–15:30',
        title: '호텔 복귀',
        description: '용캉제·칭톈제에서 택시 한 번으로 호텔에 돌아갑니다.',
        transport: '택시',
      },
      {
        time: '15:30–17:00',
        title: '호텔 휴식 · 옷 갈아입기',
        description: '마지막 저녁을 즐길 체력을 회복하는 시간입니다. 기본적으로 삭제하지 않습니다.',
        placeId: 'hotel',
        tags: ['꼭 쉬기'],
      },
      {
        time: '17:15–17:45',
        title: 'Taipei 101 이동',
        description: '옷을 갈아입고 호텔에서 Taipei 101까지 택시로 이동합니다.',
        transport: '택시',
      },
      {
        time: '18:00–20:30',
        title: '85TD 메인 기념 디너',
        description: '타이베이 야경을 바라보며 세 사람의 여행을 기념하는 저녁입니다. 예약 오픈을 기다리는 중입니다.',
        image: 'taipei-night.webp',
        mapQuery: '85TD Taipei',
        placeId: '85td',
        tags: ['예약 오픈 대기'],
      },
      {
        time: '식사 후',
        title: 'Taipei 101 주변 야경',
        description: '메인 디너 뒤 건물 주변의 야경을 잠깐 감상합니다.',
        placeId: 'taipei-101',
        tags: ['짧게 산책'],
      },
      {
        time: '2차',
        title: '2차 — 현장 결정',
        description: 'A. 시먼딩의 야키토리·사케 이자카야 또는 B. 신이구·Taipei 101 인근 이자카야 중 당일 분위기와 컨디션에 맞춰 정합니다. 특정 가게나 지역은 아직 확정하지 않습니다.',
        tags: ['현장 결정'],
        optional: true,
      },
    ],
  },
  {
    id: 'day-4',
    day: 'DAY 4',
    date: '02.23',
    weekday: 'TUE',
    title: '식물원 · 장어덮밥 · 귀국',
    theme: '마지막까지 편안하게',
    lead: '관광 욕심을 내려놓고 호텔 주변의 초록을 걷고, 따뜻한 장어덮밥으로 여행을 마무리합니다.',
    intensity: '낮음',
    walking: '약 3–5천 보 예상',
    transport: 'VIP 의전차량 재이용 검토 중',
    keyPlaces: '식물원 · 비전옥 · 공항',
    keyMeal: '비전옥 장어덮밥',
    cover: 'botanical.webp',
    schedule: [
      {
        time: '08:00',
        title: '느긋하게 기상',
        description: '마지막 날은 관광 욕심을 내지 않고 천천히 하루를 시작합니다.',
      },
      {
        time: '08:30 전후',
        title: '가벼운 아침',
        description: '현지식을 가볍게 먹거나 컨디션에 따라 생략합니다.',
        tags: ['현지식 또는 패스 가능'],
      },
      {
        time: '09:00–10:20',
        title: '타이베이 식물원',
        localName: '臺北植物園',
        description: '호텔에서 가까운 초록길을 컨디션에 따라 40–80분 산책합니다.',
        image: 'botanical.webp',
        mapQuery: 'Taipei Botanical Garden',
        placeId: 'botanical',
      },
      {
        time: '10:30–11:20',
        title: '호텔 복귀 · 체크아웃',
        description: '짐을 정리하고 로비에서 차량을 만납니다.',
        placeId: 'hotel',
      },
      {
        time: '이후',
        title: 'VIP 의전차량 재이용 검토',
        description: 'Day 2에서 선정한 업체를 다시 이용해 호텔 → 비전옥 → 타오위안공항 T1으로 이동하는 방향을 검토 중입니다. 아직 최종 예약은 아닙니다.',
        transport: 'VIP 의전차량 · 검토 중',
        tags: ['예약 미정'],
      },
      {
        time: '점심',
        title: '肥前屋 비전옥',
        description: '여행의 마지막 식사는 일본식 장어덮밥입니다. 식사하는 약 2시간 동안 차량이 대기하고 캐리어는 차량에 보관합니다.',
        image: 'unadon.webp',
        mapQuery: '肥前屋 Taipei',
        placeId: 'hizenya',
        tags: ['짐은 차량 보관'],
      },
      {
        time: '공항',
        title: '타오위안공항 T1',
        localName: '桃園國際機場 第一航廈',
        description: '비즈니스 체크인과 라운지를 이용하며 여유 있게 쉬다가 탑승합니다.',
        transport: '전용차',
        mapQuery: 'Taoyuan International Airport Terminal 1',
        placeId: 'taoyuan-t1',
      },
      {
        time: '17:10–20:35',
        title: '타이베이 → 인천',
        description: '아시아나항공 비즈니스로 돌아옵니다. 세 사람이 즐겁게 귀국하면 민성투어의 목표 달성입니다.',
        transport: '아시아나항공',
        tags: ['예약 완료'],
      },
    ],
  },
]

export const budget = {
  settled: [
    { label: '아시아나 비즈니스 왕복', status: '예약·정산 완료', note: '성인 3명' },
    { label: 'Taipei Garden Hotel', status: '예약·정산 완료', note: '3박 · 무료취소' },
  ],
  pending: [
    { label: 'VIP 의전차량', status: '최종 비교 중', note: 'Day 2 · Day 4 재이용 방향 검토' },
    { label: '85TD', status: '예약 오픈 대기', note: 'Day 3 메인 기념 디너' },
    { label: '현지 식사·택시', status: '현지비 정리 중', note: '일정과 컨디션에 따라 변동' },
  ],
}

export const principles = [
  '첫날 Airport MRT 한 번은 직접 타본다.',
  '이후에는 이동 편의를 우선한다.',
  '장거리 이동에는 VIP 차량을 적극 활용한다.',
  '관광을 위해 걷는 것은 좋지만, 이동 때문에 오래 걷지는 않는다.',
  '야시장은 먹방보다 분위기를 즐긴다.',
  '식사는 깔끔하고 편안한 곳을 우선한다.',
  '일정표보다 부모님 컨디션이 우선이다.',
  '피곤하면 선택 일정은 언제든 삭제한다.',
]

export const driverPlaces = [
  { korean: 'Taipei Garden Hotel', local: '台北花園大酒店', query: 'Taipei Garden Hotel' },
  { korean: '중정기념당', local: '中正紀念堂', query: 'Chiang Kai-shek Memorial Hall' },
  { korean: '단수이 위런마터우', local: '淡水漁人碼頭', query: "Tamsui Fisherman's Wharf" },
  { korean: '용산사', local: '艋舺龍山寺', query: 'Longshan Temple Taipei' },
  { korean: '예류지질공원', local: '野柳地質公園', query: 'Yehliu Geopark' },
  { korean: '스펀 옛거리', local: '十分老街', query: 'Shifen Old Street' },
  { korean: '지우펀 옛거리', local: '九份老街', query: 'Jiufen Old Street' },
  { korean: '국립고궁박물원', local: '國立故宮博物院', query: 'National Palace Museum Taipei' },
  { korean: '딘타이펑 신생점', local: '鼎泰豐 新生店', query: 'Din Tai Fung Xinsheng Branch Taipei' },
  { korean: '용캉제·칭톈제', local: '永康街 · 青田街', query: 'Yongkang Street and Qingtian Street Taipei' },
  { korean: '타이베이 101', local: '台北101', query: 'Taipei 101' },
  { korean: '비전옥', local: '肥前屋', query: '肥前屋 Taipei' },
  { korean: '타오위안공항 T1', local: '桃園國際機場 第一航廈', query: 'Taoyuan International Airport Terminal 1' },
]

export const mealPlan = [
  { day: 'DAY 1', breakfast: '기내식', lunch: '춘수당 · 공푸면과 버블티', dinner: '魚藏餐廳 · 대만식 해산물', extra: '18일 타이완 생맥주' },
  { day: 'DAY 2', breakfast: 'Taipei Garden Hotel 조식', lunch: 'Qiao Yan Seafood / 俏宴', dinner: '지우펀 현지식 + 고량주', extra: '지우펀에서 하루 마무리' },
  { day: 'DAY 3', breakfast: '가벼운 맥모닝', lunch: '딘타이펑 신생점', dinner: '85TD 메인 디너', extra: '시먼딩 또는 신이구 이자카야 · 현장 결정' },
  { day: 'DAY 4', breakfast: '현지식 또는 패스 가능', lunch: '肥前屋 / 비전옥 · 장어덮밥', dinner: '기내식', extra: '라운지에서 휴식' },
]
