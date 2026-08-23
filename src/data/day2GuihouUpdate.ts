import { days, driverPlaces, mealPlan } from './trip'

const day2 = days.find((day) => day.id === 'day-2')

if (day2) {
  day2.keyMeal = '귀후어항 해산물 · 지우펀 현지식'
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
      description: '날씨가 괜찮다면 폭포 전망 구간을 보고 사진을 찍습니다. 관람을 마치고 스펀 옛거리로 이동하기 전에 十分遊客中心(스펀 Visitor Center) 화장실을 부모님까지 함께 이용하는 것을 기본 동선으로 둡니다. 옛거리 안쪽 화장실보다 이곳을 우선합니다.',
      tags: Array.from(new Set([...(waterfall.tags ?? []), '폭포 후 Visitor Center 화장실', '옛거리 가기 전 WC'])),
    }
  }

  const oldStreetIndex = day2.schedule.findIndex((item) => item.placeId === 'shifen-old-street')
  if (oldStreetIndex >= 0) {
    const oldStreet = day2.schedule[oldStreetIndex]
    day2.schedule[oldStreetIndex] = {
      ...oldStreet,
      description: '철길 마을을 천천히 보고 세 사람이 풍등 한 개를 함께 띄웁니다. 2026 현장 참고가는 단색 약 NT$200, 인기 있는 4색 풍등은 약 NT$250–300입니다. 귀후어항에서 식사를 충분히 했으므로 간식은 맛보기만: 땅콩 아이스크림롤 약 NT$50, 닭날개 볶음밥 약 NT$75 수준을 참고합니다. 커피가 당기면 Tag Cafe 또는 十分柑ma店에서 15–20분 쉬거나 테이크아웃합니다. 기념품은 十分街 84號의 Shifen Tourist Gift Shop, 풍등 체험과 사진 서비스는 十分街 80號 YANGS를 현장 후보로 둡니다. 가격과 영업은 2027 방문 당일 다시 확인합니다.',
      tags: Array.from(new Set([...(oldStreet.tags ?? []), '4색 풍등 1개 추천', '간식은 맛보기', '커피 15–20분 가능', '기념품 구경'])),
    }
  }
}

const day2Meal = mealPlan.find((meal) => meal.day === 'DAY 2')
if (day2Meal) {
  day2Meal.lunch = '龜吼漁夫市集 · 제철 사시미·니기리·해산물 현장 선택'
  day2Meal.lunchPlaceId = 'guihou'
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
