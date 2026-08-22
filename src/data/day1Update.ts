import { dayRoutes } from './dayRoutes'
import {
  placeCatalog,
  restaurantFallbacks,
  type PlaceId,
  type PlaceInfo,
} from './localTools'
import {
  days,
  driverPlaces,
  mealPlan,
  tripStatuses,
  type TripDay,
} from './trip'

const asPlaceId = (id: string) => id as PlaceId
const mutablePlaces = placeCatalog as Record<string, PlaceInfo>

Object.assign(mutablePlaces, {
  'my-zao': {
    name: 'My灶',
    localName: 'My灶',
    address: '台北市中山區松江路100巷9-1號',
    latitude: 25.0511,
    longitude: 121.5319,
    categoryKo: '대만 가정식',
    specialtyKo: '과일닭·참기름 닭밥',
    displayHintKo: '대만 가정식 · 닭요리',
  },
  alleyhouse: {
    name: '弄宅咖啡 Alleyhouse Coffee',
    localName: '弄宅咖啡',
    address: '台北市中山區松江路150巷18-1號',
    latitude: 25.0537,
    longitude: 121.5327,
    categoryKo: '골목 주택 카페',
    specialtyKo: '커피·디저트',
    displayHintKo: '골목 주택 카페 · 커피·디저트',
  },
  miniatures: {
    name: '수진박물관',
    localName: '袖珍博物館',
    address: '台北市中山區建國北路一段96號B1',
    latitude: 25.05029,
    longitude: 121.53617,
  },
  'itong-siping': {
    name: '이통제·쓰핑거리',
    localName: '伊通街 · 四平街',
    address: '台北市中山區伊通街、四平街周邊',
    latitude: 25.0533,
    longitude: 121.5345,
  },
  baishihu: {
    name: '백석호 출렁다리·하트연못',
    localName: '白石湖吊橋 · 同心池',
    address: '台北市內湖區碧山路24號周邊',
    latitude: 25.099171,
    longitude: 121.587109,
  },
  bishanyan: {
    name: '벽산암',
    localName: '碧山巖開漳聖王廟',
    address: '台北市內湖區碧山路24號',
    latitude: 25.0986,
    longitude: 121.5877,
  },
  'xiao-tong-yi': {
    name: '小統一牛排',
    localName: '小統一牛排館',
    address: '台北市松山區健康路174號',
    latitude: 25.0543,
    longitude: 121.5579,
    categoryKo: '대만식 스테이크',
    specialtyKo: '철판 스테이크 코스',
    displayHintKo: '대만식 스테이크 · 철판 코스',
  },
  'carrefour-guilin': {
    name: '까르푸 구이린점',
    localName: '家樂福桂林店',
    address: '台北市萬華區桂林路1號',
    latitude: 25.0372,
    longitude: 121.5062,
    categoryKo: '대형 마트',
    specialtyKo: '야식·기념품 장보기',
    displayHintKo: '대형 마트 · 야식 장보기',
  },
})

const dayOne: TripDay = {
  id: 'day-1',
  day: 'DAY 1',
  date: '02.20',
  weekday: 'SAT',
  title: '타이베이의 첫인상',
  theme: '백석호·벽산암 일몰 · 완화의 밤',
  lead: '좋은 점심과 작은 박물관으로 도시에 들어가, 산 위의 일몰과 오래된 타이베이의 밤으로 첫날을 마무리합니다.',
  intensity: '보통',
  walking: '약 7–9천 보 예상',
  transport: '奇立 Lexus ES300h · MRT · 택시',
  keyPlaces: '수진박물관 · 백석호 · 벽산암 · 용산사',
  keyMeal: 'My灶 · 小統一牛排',
  keyMealPlaceIds: [asPlaceId('my-zao'), asPlaceId('xiao-tong-yi')],
  cover: 'longshan.webp',
  schedule: [
    {
      time: '04:20–04:30',
      title: '목동 출발',
      description: '짐을 싣고 인천공항으로 출발합니다. 한국 출발 차량은 별도 확정 전까지 기존 계획을 유지합니다.',
      transport: '한국 출발 차량',
      tags: ['검토 중'],
    },
    {
      time: '05:10–05:30',
      title: '인천공항 도착',
      description: '출발층에서 짐을 내리고 비즈니스 체크인 카운터로 이동합니다.',
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
      placeId: asPlaceId('taoyuan-t2'),
    },
    {
      time: '입국·수하물 후',
      title: 'ES300h 픽업으로 호텔 이동',
      localName: '奇立租賃 · Lexus ES300h',
      description: '5년 이내 Lexus ES300h 지정 픽업과 피켓 미팅을 예약 요청했습니다. 차종은 다른 모델로 바뀌지 않으며, 실제 차량과 기사 정보는 이용 2–3일 전에 안내받습니다. 실제 착륙 뒤 90분 대기가 포함됩니다.',
      transport: '奇立租賃 · Lexus ES300h',
      tags: ['차종 지정', '피켓 미팅', '확인 대기'],
      image: 'lexus-es300h.webp',
      mapQuery: 'Taipei Garden Hotel',
      placeId: asPlaceId('hotel'),
    },
    {
      time: '호텔 도착 후',
      title: 'Taipei Garden Hotel · 짐 맡기기',
      localName: '台北花園大酒店',
      description: '체크인 전이면 짐만 맡기고 첫 일정을 시작합니다.',
      mapQuery: 'Taipei Garden Hotel',
      placeId: asPlaceId('hotel'),
    },
    {
      time: '11:35–12:05',
      title: 'MRT로 My灶 이동',
      description: '호텔에서 샤오난먼역으로 걸어가 송산신뎬선으로 송장난징역까지 이동합니다. 첫날 대중교통을 가볍게 경험하는 구간입니다.',
      transport: 'MRT · 환승 없음',
    },
    {
      time: '12:10–13:20',
      title: 'My灶 점심',
      localName: 'My灶',
      description: '예약 메뉴는 水果雞 半隻(과일닭 반 마리)와 麻油雞飯(참기름 닭밥). 현장에서 金沙白蝦, 水耕空心菜, 滷肉飯 1개를 우선 추가하고 菜脯蛋·白飯은 배 상태를 보고 정합니다.',
      tags: ['점심', '예약 메뉴 2종'],
      mapQuery: 'My灶 Taipei',
      placeId: asPlaceId('my-zao'),
    },
    {
      time: '13:30–14:15',
      title: '弄宅咖啡',
      localName: '弄宅咖啡 Alleyhouse Coffee',
      description: '점심이 빨리 끝나면 느긋하게, 늦어지면 30분 안팎으로 줄이는 시간 조절용 카페입니다. 당일 방문은 예약 시스템 주의사항을 확인하고 워크인하며, 입장할 때 신발을 벗으므로 양말을 준비합니다.',
      tags: ['완충 구간'],
      mapQuery: '弄宅咖啡 Alleyhouse Coffee Taipei',
      placeId: asPlaceId('alleyhouse'),
    },
    {
      time: '14:20–15:20',
      title: '수진박물관',
      localName: '袖珍博物館',
      description: '정교한 미니어처 하우스와 장면을 한 시간 정도 둘러봅니다.',
      tags: ['실내 관광'],
      mapQuery: 'Miniatures Museum of Taiwan',
      placeId: asPlaceId('miniatures'),
    },
    {
      time: '15:20–15:40',
      title: '이통제·쓰핑거리 짧은 산책',
      localName: '伊通街 · 四平街',
      description: '박물관 주변 골목을 가볍게 걷고, 시간을 끌지 않은 채 백석호로 출발합니다.',
      mapQuery: 'Yitong Street Siping Street Taipei',
      placeId: asPlaceId('itong-siping'),
    },
    {
      time: '15:40–16:10',
      title: '택시로 백석호 이동',
      description: '도심에서 네이후 산 위의 백석호로 바로 이동합니다.',
      transport: '택시',
    },
    {
      time: '16:10–17:00',
      title: '백석호 출렁다리·하트연못 왕복',
      localName: '白石湖吊橋 · 同心池',
      description: '출렁다리와 하트연못을 묶어 약 50분 산책합니다. 딸기농장 체험은 이번 일정에서는 넣지 않습니다.',
      tags: ['50분 산책', '딸기농장 제외'],
      mapQuery: 'Baishihu Suspension Bridge Taipei',
      placeId: asPlaceId('baishihu'),
    },
    {
      time: '17:05–18:20',
      title: '벽산암 · 일몰과 블루아워',
      localName: '碧山巖開漳聖王廟',
      description: '사원을 천천히 둘러본 뒤 17:50 전후 일몰과 18:15 전후 블루아워를 봅니다. 벽산암 체류는 약 1시간 15분으로 잡습니다.',
      tags: ['17:50 일몰', '18:15 블루아워'],
      mapQuery: 'Bishanyan Kaizhang Shengwang Temple Taipei',
      placeId: asPlaceId('bishanyan'),
    },
    {
      time: '18:20–18:50',
      title: '택시로 小統一牛排 이동',
      description: '산에서 내려와 송산구의 옛날식 고급 대만 스테이크 레스토랑으로 이동합니다.',
      transport: '택시',
    },
    {
      time: '19:00–20:15',
      title: '小統一牛排 저녁',
      localName: '小統一牛排館',
      description: '2027년 2월 20일 토요일 19:00, 성인 3명 예약이 완료된 저녁입니다. 좋은 소고기를 뜨거운 철판과 옛 대만식 양식 코스로 즐깁니다.',
      tags: ['19:00 고정', '3인 예약 완료', '와인 1병'],
      mapQuery: '小統一牛排 Taipei',
      placeId: asPlaceId('xiao-tong-yi'),
    },
    {
      time: '20:15–20:45',
      title: '택시로 용산사 이동',
      description: '저녁을 마치고 올드 타이베이의 밤으로 이동합니다.',
      transport: '택시',
    },
    {
      time: '20:45–21:15',
      title: '용산사 야간 관람',
      localName: '艋舺龍山寺',
      description: '조명이 켜진 사찰을 천천히 보고 완화의 밤 산책을 시작합니다.',
      image: 'longshan.webp',
      mapQuery: 'Longshan Temple Taipei',
      placeId: asPlaceId('longshan'),
    },
    {
      time: '21:15 이후',
      title: '화시제·광저우제 야시장',
      localName: '華西街觀光夜市 · 廣州街夜市',
      description: '배를 다시 채우기보다 구경하며 조금씩 야식을 고릅니다. 피곤하면 짧게 줄이고 호텔 방향으로 걷습니다.',
      image: 'huaxi.webp',
      mapQuery: 'Huaxi Street Night Market',
      placeId: asPlaceId('huaxi'),
      tags: ['밤 산책', '야식 포장'],
    },
    {
      time: '마감 전 가능할 때',
      title: '삼미식당 연어초밥 포장',
      localName: '三味食堂',
      description: '영업 마감과 픽업 가능 시간을 사전에 다시 확인합니다. 동선이 맞을 때만 연어초밥을 포장하고, 시간이 맞지 않으면 미련 없이 패스합니다.',
      mapQuery: '三味食堂 Taipei',
      placeId: asPlaceId('sanwei'),
      tags: ['호텔 야식', '사전 확인 필요'],
      optional: true,
    },
    {
      time: '마무리',
      title: '까르푸 구이린점 → 호텔',
      localName: '家樂福桂林店 → 台北花園大酒店',
      description: '호텔 맞은편 24시간 까르푸에서 음료·과일·간식을 조금 더 사고 걸어서 숙소로 돌아갑니다. 시먼딩 2차는 체력이 남을 때만 선택합니다.',
      mapQuery: 'Carrefour Guilin Store Taipei',
      placeId: asPlaceId('carrefour-guilin'),
      tags: ['24시간', '시먼딩 2차는 선택'],
    },
  ],
}

const dayOneIndex = days.findIndex((day) => day.id === 'day-1')
if (dayOneIndex >= 0) days.splice(dayOneIndex, 1, dayOne)

const pickupStatus = tripStatuses.find((status) => status.label === 'Day 1 공항 픽업')
if (pickupStatus) {
  pickupStatus.detail = '奇立租賃 · Lexus ES300h 지정 픽업'
  pickupStatus.status = '예약 요청 · 확인 대기'
  pickupStatus.tone = 'waiting'
}

dayRoutes['day-1'] = {
  title: '좋은 점심에서 산 위의 일몰과 완화의 밤까지',
  summary: '공항 픽업 뒤 MRT로 도시에 들어가 My灶와 수진박물관을 즐기고, 백석호·벽산암 일몰 뒤 용산사와 야시장으로 마무리합니다.',
  stops: [
    { placeId: asPlaceId('taoyuan-t2'), label: '타오위안공항 T2', note: '대만 도착' },
    { placeId: asPlaceId('hotel'), label: 'Taipei Garden Hotel', note: '짐 맡기기' },
    { placeId: asPlaceId('my-zao'), label: 'My灶', note: '점심' },
    { placeId: asPlaceId('alleyhouse'), label: '弄宅咖啡', note: '시간 조절' },
    { placeId: asPlaceId('miniatures'), label: '수진박물관' },
    { placeId: asPlaceId('itong-siping'), label: '이통제·쓰핑거리', note: '짧은 산책' },
    { placeId: asPlaceId('baishihu'), label: '백석호', note: '출렁다리·하트연못' },
    { placeId: asPlaceId('bishanyan'), label: '벽산암', note: '일몰·블루아워' },
    { placeId: asPlaceId('xiao-tong-yi'), label: '小統一牛排', note: '저녁·와인' },
    { placeId: asPlaceId('longshan'), label: '용산사' },
    { placeId: asPlaceId('huaxi'), label: '화시제·광저우제', note: '야시장' },
    { placeId: asPlaceId('sanwei'), label: '삼미식당', note: '가능할 때 포장' },
    { placeId: asPlaceId('carrefour-guilin'), label: '까르푸 구이린점', note: '밤 산책' },
    { placeId: asPlaceId('hotel'), label: '호텔', note: '야식으로 마무리' },
  ],
}

const mutableFallbacks = restaurantFallbacks
mutableFallbacks.splice(
  0,
  2,
  {
    day: 'DAY 1 · 점심',
    planA: 'My灶',
    planAPlaceId: asPlaceId('my-zao'),
    planB: '송장난징역 인근의 깔끔한 대만식 식당',
    reason: '항공·입국 지연 또는 예약 문제',
  },
  {
    day: 'DAY 1 · 저녁',
    planA: '小統一牛排',
    planAPlaceId: asPlaceId('xiao-tong-yi'),
    planB: '호텔·완화권의 예약 가능한 고급 고기 식당',
    reason: '예약 불가 또는 벽산암 일정 지연',
  },
)

driverPlaces.splice(
  0,
  driverPlaces.length,
  { korean: 'Taipei Garden Hotel', local: '台北花園大酒店', query: 'Taipei Garden Hotel', placeId: asPlaceId('hotel') },
  { korean: 'My灶', local: 'My灶', query: 'My灶 Taipei', placeId: asPlaceId('my-zao') },
  { korean: '弄宅咖啡', local: '弄宅咖啡', query: '弄宅咖啡 Alleyhouse Coffee Taipei', placeId: asPlaceId('alleyhouse') },
  { korean: '수진박물관', local: '袖珍博物館', query: 'Miniatures Museum of Taiwan', placeId: asPlaceId('miniatures') },
  { korean: '백석호 출렁다리', local: '白石湖吊橋', query: 'Baishihu Suspension Bridge Taipei', placeId: asPlaceId('baishihu') },
  { korean: '벽산암', local: '碧山巖開漳聖王廟', query: 'Bishanyan Kaizhang Shengwang Temple Taipei', placeId: asPlaceId('bishanyan') },
  { korean: '小統一牛排', local: '小統一牛排館', query: '小統一牛排 Taipei', placeId: asPlaceId('xiao-tong-yi') },
  { korean: '용산사', local: '艋舺龍山寺', query: 'Longshan Temple Taipei', placeId: asPlaceId('longshan') },
  { korean: '까르푸 구이린점', local: '家樂福桂林店', query: 'Carrefour Guilin Store Taipei', placeId: asPlaceId('carrefour-guilin') },
  { korean: '예류지질공원', local: '野柳地質公園', query: 'Yehliu Geopark', placeId: asPlaceId('yehliu') },
  { korean: '스펀 옛거리', local: '十分老街', query: 'Shifen Old Street', placeId: asPlaceId('shifen-old-street') },
  { korean: '지우펀 옛거리', local: '九份老街', query: 'Jiufen Old Street', placeId: asPlaceId('jiufen') },
  { korean: '국립고궁박물원', local: '國立故宮博物院', query: 'National Palace Museum Taipei', placeId: asPlaceId('palace') },
  { korean: '딘타이펑 신생점', local: '鼎泰豐 新生店', query: 'Din Tai Fung Xinsheng Branch Taipei', placeId: asPlaceId('din-tai-fung-xinsheng') },
  { korean: '용캉제·칭톈제', local: '永康街 · 青田街', query: 'Yongkang Street and Qingtian Street Taipei', placeId: asPlaceId('yongkang-qingtian') },
  { korean: '타이베이 101', local: '台北101', query: 'Taipei 101', placeId: asPlaceId('taipei-101') },
  { korean: '비전옥', local: '肥前屋', query: '肥前屋 Taipei', placeId: asPlaceId('hizenya') },
  { korean: '타오위안공항 T2', local: '桃園國際機場 第二航廈', query: 'Taoyuan International Airport Terminal 2', placeId: asPlaceId('taoyuan-t2') },
)

const mealPlanIndex = mealPlan.findIndex((meal) => meal.day === 'DAY 1')
if (mealPlanIndex >= 0) {
  mealPlan[mealPlanIndex] = {
    day: 'DAY 1',
    breakfast: '라운지·기내식',
    lunch: 'My灶 · 과일닭·참기름 닭밥·새우·공심채',
    lunchPlaceId: asPlaceId('my-zao'),
    dinner: '小統一牛排 · 고급 대만식 스테이크 + 와인',
    dinnerPlaceId: asPlaceId('xiao-tong-yi'),
    extra: '용산사·야시장·삼미·까르푸 야식',
    extraPlaceId: asPlaceId('huaxi'),
  }
}
