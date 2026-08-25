export interface HuashanGuideStop {
  localName: string
  name: string
  duration: string
  description: string
  status: string
  href: string
  priority?: boolean
  backup?: boolean
}

export const huashanGuideStops: HuashanGuideStop[] = [
  {
    localName: '黑膠咖啡',
    name: 'Vinyl Decision',
    duration: '30–45분',
    description: '수천 장의 중고 LP를 둘러보고 마음에 드는 음반을 직접 들어보는 화산의 핵심 정거장. 분위기가 좋으면 여기서 가장 오래 머뭅니다.',
    status: '일요일 DJ·라이브 · 2027년 2월 직전 재확인',
    href: 'https://www.huashan1914.com/w/huashan1914_en/CustomShops_18032109513914402',
    priority: true,
  },
  {
    localName: '未来市',
    name: 'The Gala Asia',
    duration: '20–30분',
    description: '대만과 일본을 중심으로 문구·패브릭·유리·생활소품과 디자인 오브제를 골라 보는 아시아 디자인 셀렉트숍입니다.',
    status: '입점 여부 · 2027년 2월 직전 재확인',
    href: 'https://www.huashan1914.com/w/huashan1914_en/CustomShops_19021411455586240',
  },
  {
    localName: '知音文創',
    name: 'Wooderful Life',
    duration: '15–20분',
    description: '따뜻한 목재 오르골과 생활소품, 가족 선물을 짧게 봅니다. 어린이 체험을 모두 하는 일정은 아닙니다.',
    status: '입점 여부 · 2027년 2월 직전 재확인',
    href: 'https://www.huashan1914.com/w/huashan1914_en/CustomShops_23020815501237917',
  },
  {
    localName: '小確幸紅茶牛奶合作社',
    name: 'Small Happiness Black Tea Milk Canteen',
    duration: '테이크아웃',
    description: '화산을 걸으며 마실 홍차우유 한 잔. 자오시에서 이미 차를 마셨으니 별도 카페 체류보다 가벼운 테이크아웃으로 둡니다.',
    status: '영업 여부 · 2027년 2월 직전 재확인',
    href: 'https://www.huashan1914.com/w/huashan1914_en/CustomShops_18032112125883725',
  },
  {
    localName: 'CHLIV',
    name: 'CHLIV Huashan',
    duration: '짧은 휴식',
    description: '부모님이 잠깐 앉아야 할 때만 쓰는 커피 백업입니다. 코어 네 곳과 카페를 연속으로 돌지 않습니다.',
    status: '백업 · 현장 확인',
    href: 'https://www.google.com/maps/search/?api=1&query=CHLIV%20Huashan%20Taipei',
    backup: true,
  },
  {
    localName: '青鳥書店',
    name: 'Bleu & Book',
    duration: '조용한 백업',
    description: '비가 더 오거나 LP숍이 붐빌 때 조용히 책과 문화상품을 보는 실내 대안입니다.',
    status: '백업 · 현장 확인',
    href: 'https://www.google.com/maps/search/?api=1&query=Bleu%20%26%20Book%20Huashan%20Taipei',
    backup: true,
  },
]

export const huashanOfficialScheduleUrl = 'https://www.huashan1914.com/w/huashan1914/index'
