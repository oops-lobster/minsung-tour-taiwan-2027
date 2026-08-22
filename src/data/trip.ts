import type { PlaceId } from './localTools'

export type StatusTone = 'confirmed' | 'progress' | 'waiting' | 'flexible'

export interface TripStatus {
  label: string
  detail: string
  status: string
  tone: StatusTone
  icon: 'plane' | 'hotel' | 'car' | 'meal' | 'utensils'
  placeId?: PlaceId
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
  keyMealPlaceIds?: PlaceId[]
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
    label: '한국 출발 차량',
    detail: 'Chrysler 300C Stretch Limousine · 조건 재확인 예정',
    status: '검토 중',
    tone: 'progress',
    icon: 'car',
  },
  {
    label: 'Day 1 공항 픽업',
    detail: '奇立租賃 · Lexus ES300h 지정 픽업',
    status: '예약 요청 · 확인 대기',
    tone: 'waiting',
    icon: 'car',
  },
  {
    label: '弄宅咖啡',
    detail: 'Day 1 · 13:30 · 성인 3명',
    status: '예약 확정',
    tone: 'confirmed',
    icon: 'meal',
    placeId: 'alleyhouse',
  },
  {
    label: 'Day 2·4 전용차',
    detail: 'LUMI DRIVE · Toyota New Alphard 40系',
    status: '예약금 송금 승인 대기',
    tone: 'progress',
    icon: 'car',
  },
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
    label: '85TD',
    detail: 'Day 3 메인 디너',
    status: '예약 오픈 대기',
    tone: 'waiting',
    icon: 'meal',
    placeId: '85td',
  },
]

export const days: TripDay[] = [
  {
    id: 'day-1',
    day: 'DAY 1',
    date: '02.20',
    weekday: 'SAT',
    title: '타이베이의 첫인상',
    theme: '전통가옥 · 산 위의 일몰 · 완화의 밤',
    lead: '좋은 점심과 오래된 대만 가옥으로 도시에 들어가, 백석호와 벽산암의 일몰을 보고 완화의 밤으로 하루를 마무리합니다.',
    intensity: '보통',
    walking: '약 7–9천 보 예상',
    transport: '공항 ES300h 픽업 · 택시 · 도보',
    keyPlaces: '린안타이 고택 · 백석호 · 벽산암 · 용산사',
    keyMeal: 'My灶 · 小統一牛排',
    keyMealPlaceIds: ['my-zao', 'xiao-tong-yi'],
    cover: 'longshan.webp',
    schedule: [
      {
        time: '04:20–04:30',
        title: '목동 출발',
        description: '짐을 싣고 인천공항 제2터미널로 출발합니다. 한국 출발 차량은 최종 확정 전까지 기존 검토 상태를 유지합니다.',
        transport: '한국 출발 차량',
        tags: ['검토 중'],
      },
      {
        time: '05:10–05:30',
        title: '인천공항 T2 도착',
        description: '출발층에서 짐을 내리고 비즈니스 체크인 카운터로 이동합니다.',
        transport: '인천공항 제2터미널',
      },
      {
        time: '도착 후',
        title: '비즈니스 체크인 → 보안검색',
        description: '체크인을 마친 뒤 보안검색을 통과해 출국장으로 이동합니다.',
        tags: ['비즈니스'],
      },
      {
        time: '06:00 전후',
        title: '라운지에서 아침과 휴식',
        description: '아침 식사와 휴식을 하며 여유 있게 탑승을 준비합니다.',
        tags: ['라운지'],
      },
      {
        time: '07:10–07:20',
        title: '라운지에서 나와 게이트 이동',
        description: '혼잡을 감안해 여유 있게 탑승 게이트로 이동합니다.',
      },
      {
        time: '08:00',
        title: '인천 출발',
        description: '아시아나항공 비즈니스로 편안하게 여행을 시작합니다.',
        transport: '아시아나항공',
        tags: ['예약 완료'],
      },
      {
        time: '09:50',
        title: '타오위안공항 도착',
        localName: '桃園國際機場 第二航廈',
        description: '아시아나항공 OZ711으로 타오위안공항 T2에 도착합니다. 입국과 수하물 수령을 마친 뒤 피켓을 든 기사님을 만납니다.',
        transport: '아시아나항공 OZ711',
        mapQuery: 'Taoyuan International Airport Terminal 2',
        placeId: 'taoyuan-t2',
      },
      {
        time: '약 10:35–10:55 예상',
        title: '奇立 기사 미팅 · 호텔 이동',
        localName: '奇立租賃 · Lexus ES300h',
        description: '입국과 수하물 수령 뒤 피켓을 든 기사님을 만납니다. 5년 이내 Lexus ES300h 지정 픽업이며 실제 차량과 기사 정보는 이용 2–3일 전에 안내받습니다. 미팅 시각은 입국 상황에 따라 유연하게 달라집니다.',
        transport: '奇立租賃 · Lexus ES300h',
        tags: ['차종 지정', '피켓 미팅', '확인 대기'],
        image: 'lexus-es300h.webp',
        mapQuery: 'Taipei Garden Hotel',
        placeId: 'hotel',
      },
      {
        time: '약 11:20–11:40',
        title: 'Taipei Garden Hotel · 짐 맡기기',
        localName: '台北花園大酒店',
        description: '체크인 전이면 짐만 맡기고 첫 일정을 시작합니다. 실제 도착 시각은 입국과 도로 상황에 따라 달라질 수 있습니다.',
        mapQuery: 'Taipei Garden Hotel',
        placeId: 'hotel',
      },
      {
        time: '11:50 전후',
        title: '택시로 My灶 이동',
        description: '첫날은 대중교통 체험보다 12:10 점심 예약 시간을 안정적으로 맞추는 것을 우선합니다.',
        transport: '택시',
      },
      {
        time: '12:10–13:15',
        title: 'My灶 점심',
        localName: 'My灶',
        description: '예약 메뉴인 과일닭과 참기름 닭밥을 중심으로 먹고, 새우·공심채 등 추가 메뉴는 현장에서 배 상태를 보고 정합니다.',
        tags: ['12:10 예약', '대만 가정식'],
        mapQuery: 'My灶 Taipei',
        placeId: 'my-zao',
      },
      {
        time: '13:30–14:10',
        title: '弄宅咖啡',
        localName: '弄宅咖啡 · Alleyhouse Coffee',
        description: '13:30 성인 3명 예약이 확정된 골목 주택 카페입니다. Plan A와 Plan B 모두 유지하고, 다음 일정에 맞춰 약 40분 쉬어 갑니다.',
        tags: ['13:30 예약 확정', '3인', 'Plan A/B 공통'],
        mapQuery: '弄宅咖啡 Alleyhouse Coffee Taipei',
        placeId: 'alleyhouse',
      },
      {
        time: '14:10–14:25',
        title: '택시로 린안타이 고택 이동',
        description: '카페에서 린안타이 고택까지 택시로 바로 이동합니다.',
        transport: '택시',
      },
      {
        time: '14:25–15:20',
        title: '린안타이 고택',
        localName: '林安泰古厝民俗文物館',
        description: '청대 민남식 전통가옥과 정원을 약 55분 동안 천천히 둘러봅니다. 맑은 날 Plan A의 메인 문화 방문지입니다.',
        tags: ['전통가옥', '정원', 'Plan A'],
        mapQuery: 'Lin An Tai Historical House and Museum',
        placeId: 'lin-an-tai',
      },
      {
        time: '15:20–15:50',
        title: '택시로 백석호 이동',
        description: '린안타이 고택에서 네이후 산 위의 백석호까지 여유를 두고 이동합니다.',
        transport: '택시',
      },
      {
        time: '15:50–16:50',
        title: '백석호 출렁다리·하트연못',
        localName: '白石湖吊橋 · 同心池',
        description: '출렁다리와 하트연못을 묶어 약 한 시간 산책합니다. 부모님 컨디션에 따라 10분 정도 줄여도 좋습니다.',
        tags: ['산책', '시간 조절 가능'],
        mapQuery: 'Baishihu Suspension Bridge Taipei',
        placeId: 'baishihu',
      },
      {
        time: '16:50–17:00',
        title: '벽산암으로 이동',
        description: '백석호 산책을 마치고 벽산암 전망 구역으로 짧게 이동합니다.',
        transport: '택시 · 현장 이동',
      },
      {
        time: '17:00–18:15',
        title: '벽산암 · 일몰과 블루아워',
        localName: '碧山巖開漳聖王廟',
        description: '사원과 타이베이 전망을 천천히 보고 17:50 전후 일몰과 18:15 전후 블루아워를 즐깁니다. 18:05 전후에는 내려갈 택시를 미리 호출합니다.',
        tags: ['17:50 일몰', '18:05 택시 미리 호출', '18:15 탑승 목표'],
        mapQuery: 'Bishanyan Kaizhang Shengwang Temple Taipei',
        placeId: 'bishanyan',
      },
      {
        time: '18:05 호출 · 18:15 탑승 목표',
        title: '미리 부른 택시로 小統一牛排 이동',
        description: '산에서 내려온 뒤 택시를 찾기 시작하지 않도록 18:05 전후 미리 호출합니다. 19:00 예약에 늦지 않게 여유를 둡니다.',
        transport: '택시 · 사전 호출',
        tags: ['운영 메모'],
      },
      {
        time: '19:00–20:15',
        title: '小統一牛排 저녁',
        localName: '小統一牛排館',
        description: '2027년 2월 20일 토요일 19:00, 성인 3명 예약이 확정된 저녁입니다. 대만식 클래식 스테이크와 소고기 코스를 즐깁니다.',
        tags: ['19:00 고정', '3인 예약 확정'],
        mapQuery: '小統一牛排 Taipei',
        placeId: 'xiao-tong-yi',
      },
      {
        time: '20:15–20:45',
        title: '택시로 용산사 이동',
        description: '저녁을 마치고 완화의 오래된 밤거리로 이동합니다.',
        transport: '택시',
      },
      {
        time: '20:45–21:15',
        title: '용산사 야간 관람',
        localName: '艋舺龍山寺',
        description: '조명이 켜진 사찰을 천천히 보고 완화의 밤 산책을 시작합니다.',
        image: 'longshan.webp',
        mapQuery: 'Longshan Temple Taipei',
        placeId: 'longshan',
      },
      {
        time: '21:15 이후',
        title: '화시제·광저우제 야시장',
        localName: '華西街觀光夜市 · 廣州街夜市',
        description: '배를 다시 채우기보다 오래된 시장 골목의 밤 분위기를 짧게 즐깁니다. 피곤하면 바로 줄입니다.',
        image: 'huaxi.webp',
        mapQuery: 'Huaxi Street Night Market',
        placeId: 'huaxi',
        tags: ['야시장', '밤 골목 산책'],
      },
      {
        time: '마무리',
        title: '까르푸 구이린점 → 호텔',
        localName: '家樂福桂林店 → 台北花園大酒店',
        description: '호텔 맞은편 24시간 까르푸에서 과일과 간식을 조금 사고 걸어서 숙소로 돌아갑니다.',
        mapQuery: 'Carrefour Guilin Store Taipei',
        placeId: 'carrefour-guilin',
        tags: ['24시간', '간식·과일'],
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
    transport: 'LUMI DRIVE · Toyota New Alphard 40系',
    keyPlaces: '예류 · 스펀 · 지우펀',
    keyMeal: 'Qiao Yan · 지우펀 현지식',
    keyMealPlaceIds: ['qiao-yan', 'jiufen'],
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
        description: 'LUMI DRIVE의 Toyota New Alphard 40系로 출발해 8시간 이용할 예정입니다. 2024–2026년식 차량 풀에서 신형 차량을 우선 배정받기로 했으며, 실제 차량과 기사 정보는 운행 24시간 전까지 안내받습니다.',
        transport: 'LUMI DRIVE · Toyota New Alphard 40系',
        tags: ['예약금 송금 승인 대기', '8시간 이용'],
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
        transport: 'Toyota New Alphard 40系',
      },
      {
        time: '16:15 전후',
        title: '지우펀 도착 · 전용차 서비스 종료',
        localName: '九份老街',
        description: '08:30 출발 기준 8시간 차량 일정은 지우펀에서 종료합니다. 지우펀 드롭에서 기사님과 작별하는 계획입니다.',
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
        title: '원하는 순간, 호텔로 돌아가기',
        description: '돌아가는 시간은 정하지 않습니다. 저녁 식사와 지우펀의 밤을 충분히 즐긴 뒤, 우리가 가고 싶을 때 현장에서 택시를 불러 호텔로 돌아갑니다.',
        transport: '현장 호출 택시',
        tags: ['사전 픽업 없음'],
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
    transport: '택시 · 그때그때',
    keyPlaces: '고궁 · 용캉제·칭톈제 · Taipei 101',
    keyMeal: '딘타이펑 신생점 · 85TD',
    keyMealPlaceIds: ['din-tai-fung-xinsheng', '85td'],
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
    transport: 'LUMI DRIVE · Toyota New Alphard 40系',
    keyPlaces: '식물원 · 비전옥 · 공항',
    keyMeal: '비전옥 장어덮밥',
    keyMealPlaceIds: ['hizenya'],
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
        description: '짐을 정리하고 체크아웃한 뒤 11:20 전후의 잠정 픽업 시간에 맞춰 로비에서 차량을 만납니다.',
        placeId: 'hotel',
      },
      {
        time: '11:20 전후 · 잠정',
        title: 'LUMI DRIVE Alphard 이용',
        description: 'LUMI DRIVE의 Toyota New Alphard 40系로 호텔 → 비전옥 → 타오위안공항 T2를 이동합니다. 비전옥에서 식사하는 동안 차량이 대기하며 캐리어는 차량에 보관합니다.',
        transport: 'LUMI DRIVE · Toyota New Alphard 40系',
        tags: ['예약금 송금 승인 대기', '약 4시간 이용'],
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
        title: '타오위안공항 T2',
        localName: '桃園國際機場 第二航廈',
        description: '비즈니스 체크인과 라운지를 이용하며 여유 있게 쉬다가 탑승합니다.',
        transport: '전용차',
        mapQuery: 'Taoyuan International Airport Terminal 2',
        placeId: 'taoyuan-t2',
      },
      {
        time: '17:10–20:35',
        title: '타이베이 → 인천',
        description: '아시아나항공 비즈니스로 돌아옵니다. 세 사람이 즐겁게 귀국하면 민성투어의 목표 달성입니다.',
        transport: '아시아나항공',
        tags: ['예약 완료'],
      },
      {
        time: '입국 후',
        title: '택시로 집까지',
        description: '인천공항에서 집까지, 여행의 마지막 이동은 가장 단순하고 편안하게 마무리합니다.',
        transport: 'Taxi',
        tags: ['현장 호출'],
      },
    ],
  },
]

export const principles = [
  '모든 일정은 여행 전에 셋이 함께 확인한다.',
  '가보고 싶은 곳과 먹고 싶은 메뉴는 미리 이야기한다.',
  '관심이 적은 일정은 편하게 빼거나 바꾼다.',
  '편안한 이동과 오래 남을 경험을 중요하게 생각한다.',
  '관광을 위해 걷는 것은 좋지만, 이동 때문에 오래 걷지는 않는다.',
  '일정표보다 부모님 컨디션이 우선이다.',
  '피곤하면 선택 일정은 언제든 삭제한다.',
  '결국 가장 중요한 것은 셋이 함께 있었다는 사실이다.',
]

export interface DriverPlace {
  korean: string
  local: string
  query: string
  placeId?: PlaceId
}

export const driverPlaces: DriverPlace[] = [
  { korean: 'Taipei Garden Hotel', local: '台北花園大酒店', query: 'Taipei Garden Hotel', placeId: 'hotel' },
  { korean: 'My灶', local: 'My灶', query: 'My灶 Taipei', placeId: 'my-zao' },
  { korean: '弄宅咖啡', local: '弄宅咖啡', query: '弄宅咖啡 Alleyhouse Coffee Taipei', placeId: 'alleyhouse' },
  { korean: '린안타이 고택', local: '林安泰古厝民俗文物館', query: 'Lin An Tai Historical House and Museum', placeId: 'lin-an-tai' },
  { korean: '수진박물관 · B2 백업', local: '袖珍博物館', query: 'Miniatures Museum of Taiwan', placeId: 'miniatures' },
  { korean: '백석호 출렁다리', local: '白石湖吊橋', query: 'Baishihu Suspension Bridge Taipei', placeId: 'baishihu' },
  { korean: '벽산암', local: '碧山巖開漳聖王廟', query: 'Bishanyan Kaizhang Shengwang Temple Taipei', placeId: 'bishanyan' },
  { korean: '小統一牛排', local: '小統一牛排館', query: '小統一牛排 Taipei', placeId: 'xiao-tong-yi' },
  { korean: '용산사', local: '艋舺龍山寺', query: 'Longshan Temple Taipei', placeId: 'longshan' },
  { korean: '화시제·광저우제 야시장', local: '華西街觀光夜市 · 廣州街夜市', query: 'Huaxi Street Night Market', placeId: 'huaxi' },
  { korean: '까르푸 구이린점', local: '家樂福桂林店', query: 'Carrefour Guilin Store Taipei', placeId: 'carrefour-guilin' },
  { korean: '예류지질공원', local: '野柳地質公園', query: 'Yehliu Geopark', placeId: 'yehliu' },
  { korean: '스펀 옛거리', local: '十分老街', query: 'Shifen Old Street', placeId: 'shifen-old-street' },
  { korean: '지우펀 옛거리', local: '九份老街', query: 'Jiufen Old Street', placeId: 'jiufen' },
  { korean: '국립고궁박물원', local: '國立故宮博物院', query: 'National Palace Museum Taipei', placeId: 'palace' },
  { korean: '딘타이펑 신생점', local: '鼎泰豐 新生店', query: 'Din Tai Fung Xinsheng Branch Taipei', placeId: 'din-tai-fung-xinsheng' },
  { korean: '용캉제·칭톈제', local: '永康街 · 青田街', query: 'Yongkang Street and Qingtian Street Taipei', placeId: 'yongkang-qingtian' },
  { korean: '타이베이 101', local: '台北101', query: 'Taipei 101', placeId: 'taipei-101' },
  { korean: '비전옥', local: '肥前屋', query: '肥前屋 Taipei', placeId: 'hizenya' },
  { korean: '타오위안공항 T2', local: '桃園國際機場 第二航廈', query: 'Taoyuan International Airport Terminal 2', placeId: 'taoyuan-t2' },
]

export interface MealPlanDay {
  day: string
  breakfast: string
  breakfastPlaceId?: PlaceId
  lunch: string
  lunchPlaceId?: PlaceId
  dinner: string
  dinnerPlaceId?: PlaceId
  extra: string
  extraPlaceId?: PlaceId
}

export const mealPlan: MealPlanDay[] = [
  { day: 'DAY 1', breakfast: '라운지·기내식', lunch: 'My灶 · 과일닭과 참기름 닭밥', lunchPlaceId: 'my-zao', dinner: '小統一牛排 · 대만식 클래식 스테이크', dinnerPlaceId: 'xiao-tong-yi', extra: '용산사·야시장·까르푸 밤 산책', extraPlaceId: 'huaxi' },
  { day: 'DAY 2', breakfast: 'Taipei Garden Hotel 조식', lunch: 'Qiao Yan Seafood / 俏宴', lunchPlaceId: 'qiao-yan', dinner: '지우펀 현지식 + 고량주', dinnerPlaceId: 'jiufen', extra: '지우펀에서 하루 마무리' },
  { day: 'DAY 3', breakfast: '가벼운 맥모닝', lunch: '딘타이펑 신생점', lunchPlaceId: 'din-tai-fung-xinsheng', dinner: '85TD 메인 디너', dinnerPlaceId: '85td', extra: '시먼딩 또는 신이구 이자카야 · 현장 결정' },
  { day: 'DAY 4', breakfast: '현지식 또는 패스 가능', lunch: '肥前屋 / 비전옥 · 장어덮밥', lunchPlaceId: 'hizenya', dinner: '기내식', extra: '라운지에서 휴식' },
]
