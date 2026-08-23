import { days, driverPlaces, mealPlan } from './trip'

const day2 = days.find((day) => day.id === 'day-2')

if (day2) {
  day2.keyMeal = '귀후어항 해산물 · 阿理廚坊 · Golden Bar'
  day2.keyMealPlaceIds = ['guihou', 'jiufen']

  const lunchIndex = day2.schedule.findIndex((item) => item.title.includes('Qiao Yan') || item.localName === '俏宴')
  if (lunchIndex >= 0) {
    day2.schedule[lunchIndex] = {
      time: '10:55–12:10',
      title: '귀후어항 어시장 점심',
      localName: '龜吼漁夫市集',
      description: '예류에서 약 10분 이동해 1층에서 당일 좋은 해산물을 직접 고르고, 단가·무게·재료값과 2층 조리비·총액을 확인한 뒤 바다를 보며 먹습니다. 기본 구성은 연어를 뺀 제철 모둠 사시미, 가능하면 니기리 6–10피스, 상태와 가격이 좋을 때 花蟹 1마리 清蒸, 당일 좋은 흰살생선 1마리 찜 또는 소금구이, 小卷/透抽 또는 야생새우, 채소·국입니다. 랍스터와 고가 갑각류는 Day 3 고급 디너로 남깁니다.',
      transport: '전용차 · 예류에서 약 10분',
      placeId: 'guihou',
      mapQuery: '龜吼漁夫市集',
      tags: ['현장 선택형', '사시미·니기리', '바다뷰', '가격·조리비 먼저 확인'],
    }
  }

  const shifenMoveIndex = day2.schedule.findIndex((item) => item.title === '스펀 이동')
  if (shifenMoveIndex >= 0) {
    day2.schedule[shifenMoveIndex] = {
      ...day2.schedule[shifenMoveIndex],
      time: '12:10–13:00',
      title: '스펀 이동 · 차량에서 휴식',
      description: '귀후어항 점심을 마치고 전용차에서 쉬면서 스펀으로 이동합니다. 부모님 컨디션을 확인하고 오후 일정은 필요하면 현장에서 줄입니다.',
      transport: 'Toyota New Alphard 40系',
    }
  }

  const waterfallIndex = day2.schedule.findIndex((item) => item.placeId === 'shifen-waterfall')
  if (waterfallIndex >= 0) {
    const waterfall = day2.schedule[waterfallIndex]
    day2.schedule[waterfallIndex] = {
      ...waterfall,
      description: '날씨가 괜찮다면 폭포 전망 구간을 보고 사진을 찍습니다. 실제 핵심 관람은 40–50분 정도로 보고, 나머지 시간은 출구 이동과 十分遊客中心 화장실에 씁니다. 스펀 옛거리로 이동하기 전에 부모님까지 함께 화장실을 이용하는 것을 기본 동선으로 둡니다.',
      tags: Array.from(new Set([...(waterfall.tags ?? []), '핵심 관람 40–50분', '폭포 후 Visitor Center 화장실', '옛거리 가기 전 WC'])),
    }
  }

  const oldStreetIndex = day2.schedule.findIndex((item) => item.placeId === 'shifen-old-street')
  if (oldStreetIndex >= 0) {
    const oldStreet = day2.schedule[oldStreetIndex]
    day2.schedule[oldStreetIndex] = {
      ...oldStreet,
      description: '철길 마을을 천천히 보고 세 사람이 풍등 한 개를 함께 띄웁니다. 2026 현장 참고가는 단색 약 NT$200, 인기 있는 4색 풍등은 약 NT$250–300입니다. 귀후어항에서 식사를 충분히 했으므로 간식은 맛보기만: 땅콩 아이스크림롤 약 NT$50, 닭날개 볶음밥 약 NT$75 수준을 참고합니다. 커피가 당기면 Tag Cafe 또는 十分柑ma店에서 15–20분 쉬거나 테이크아웃합니다. 15:20 전후에는 지우펀 이동을 우선합니다.',
      tags: Array.from(new Set([...(oldStreet.tags ?? []), '4색 풍등 1개 추천', '간식은 맛보기', '커피 15–20분 가능', '15:20 출발 우선'])),
    }
  }

  const jiufenArrivalIndex = day2.schedule.findIndex((item) => item.title === '지우펀 도착 · 전용차 서비스 종료')
  if (jiufenArrivalIndex >= 0) {
    day2.schedule.splice(jiufenArrivalIndex + 1, day2.schedule.length - jiufenArrivalIndex - 1,
      {
        time: '16:15–17:20',
        title: '지우펀 홍등 포토워크',
        localName: '九份老街 · 基山街 · 豎崎路',
        description: '기사님과 작별한 뒤 지산제 골목 → 승평극장 → 수치루 홍등계단 → 아메이차루 외관과 주변 전망 순으로 천천히 걷습니다. 시간이 맞으면 집과 집 사이를 관통하는 좁은 골목 구조도 봅니다. 맑으면 산·바다 전망을, 약한 비나 안개면 젖은 돌계단과 홍등 반사를 사진의 주제로 바꿉니다. 폭우면 승평극장과 핵심 홍등계단 위주로 35–45분으로 압축합니다.',
        image: 'jiufen.webp',
        mapQuery: 'Jiufen Old Street',
        placeId: 'jiufen',
        tags: ['포토워크', '홍등', '승평극장', '수치루', '약한 비도 진행'],
      },
      {
        time: '17:30–18:45',
        title: '阿理廚坊 1차 · 대만요리 + 고량주',
        localName: '阿理廚坊 · A Li Kitchen',
        description: 'Day 2의 제대로 된 저녁 본진. 백참계·삼배오징어·생선·새우·볶음밥 등 대만식 요리를 여러 접시 나눠 먹고 고량주를 곁들입니다. 예약 전 3인 창가/야경 자리와 金門高粱 판매 여부, 없을 경우 외부 고량주 반입 및 코키지 여부를 확인합니다.',
        mapQuery: '阿理廚坊 九份',
        tags: ['1차', '맛 우선', '고량주', '창가 자리 문의', '예약 문의 예정'],
      },
      {
        time: '18:45–19:05',
        title: '완전히 어두워진 홍등 골목 산책',
        description: '아리주방에서 나온 뒤 낮과 다른 지우펀의 밤을 짧게 다시 걷습니다. 붉은 홍등과 젖은 돌계단, 산 아래 불빛을 보며 Golden Bar로 이동합니다.',
        transport: '도보',
        tags: ['야간 포토워크', '2차 이동'],
      },
      {
        time: '19:05–20:15',
        title: 'Golden Bar 2차 · 대만 크래프트 맥주',
        localName: '逸茶酒室 Golden Bar',
        description: '1차의 고량주와 성격을 바꿔 대만 크래프트 맥주를 넉넉히 즐깁니다. 음식은 가벼운 안주만 추가하고, 산과 바다 야경이 잘 보이는 1층 창가 또는 2층 전망석 예약 가능 여부를 미리 문의합니다.',
        mapQuery: '逸茶酒室 Golden Bar 九份',
        tags: ['2차', '크래프트 맥주', '야경', '전망석 문의', '예약 문의 예정'],
      },
      {
        time: '20:15–21:00',
        title: '택시로 Taipei Garden Hotel 복귀',
        localName: '九份 → 台北花園大酒店',
        description: 'Golden Bar에서 하루 본편을 끝내고 55688 등으로 택시를 호출해 호텔로 바로 돌아갑니다. 20:15 전후 탑승, 21:00 전후 호텔 도착을 목표로 합니다. 23:00 이전 탑승이라 일반 야간 할증 시간대는 피합니다.',
        transport: '현장 호출 택시',
        mapQuery: 'Taipei Garden Hotel',
        placeId: 'hotel',
        tags: ['Day 2 본편 종료', '21:00 호텔 목표'],
      },
      {
        time: '21:00–21:30',
        title: '호텔 복귀 · 샤워와 컨디션 체크',
        description: 'Day 2 공식 일정은 여기서 끝입니다. 샤워하고 쉬면서 부모님과 민성의 컨디션을 확인합니다.',
        placeId: 'hotel',
        tags: ['공식 일정 종료'],
      },
      {
        time: '21:30–23:00 · 선택',
        title: '은하동 한식포차 3차 · 히든 스테이지',
        localName: '銀河洞 韓式pocha',
        description: '아직 기분과 체력이 남아 있을 때만 발동합니다. 호텔에서 걸어서 약 8–12분 거리의 한국식 포차에서 어묵탕·전류 같은 가벼운 안주와 소주로 마무리하고 다시 걸어서 숙소로 돌아옵니다. 피곤하면 미련 없이 삭제합니다.',
        transport: '도보 왕복',
        mapQuery: '銀河洞 韓式pocha 台北',
        optional: true,
        tags: ['3차', '완전 선택', '한식', '소주', '도보'],
      },
    )
  }
}

const day2Meal = mealPlan.find((meal) => meal.day === 'DAY 2')
if (day2Meal) {
  day2Meal.lunch = '龜吼漁夫市集 · 제철 사시미·니기리·해산물 현장 선택'
  day2Meal.lunchPlaceId = 'guihou'
  day2Meal.dinner = '阿理廚坊 · 대만요리 + 고량주'
  day2Meal.dinnerPlaceId = 'jiufen'
  day2Meal.extra = 'Golden Bar 크래프트 맥주 · 은하동 한식포차 3차는 optional'
  day2Meal.extraPlaceId = 'jiufen'
}

const ensureDriverPlace = (korean: string, local: string, query: string) => {
  if (!driverPlaces.some((place) => place.local === local)) driverPlaces.push({ korean, local, query })
}

if (!driverPlaces.some((place) => place.local === '龜吼漁夫市集')) {
  const yehliuIndex = driverPlaces.findIndex((place) => place.local === '野柳地質公園')
  const guihou = {
    korean: '귀후어항 어시장',
    local: '龜吼漁夫市集',
    query: '龜吼漁夫市集',
    placeId: 'guihou' as const,
  }
  if (yehliuIndex >= 0) driverPlaces.splice(yehliuIndex + 1, 0, guihou)
  else driverPlaces.push(guihou)
}

ensureDriverPlace('아리주방', '阿理廚坊', '阿理廚坊 九份')
ensureDriverPlace('Golden Bar', '逸茶酒室 Golden Bar', '逸茶酒室 Golden Bar 九份')
ensureDriverPlace('은하동 한식포차', '銀河洞 韓式pocha', '銀河洞 韓式pocha 台北')
