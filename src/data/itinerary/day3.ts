import type { TripDay } from '../trip'

export const day3 = {
  "id": "day-3",
  "day": "DAY 3",
  "date": "02.22",
  "weekday": "MON",
  "title": "고궁 · 용캉제 · 85TD",
  "theme": "여행의 마지막 밤",
  "lead": "오전에는 타이완의 보물을 만나고, 오후에 충분히 쉬었다가 여행의 메인 디너를 즐깁니다.",
  "intensity": "여유",
  "walking": "약 6–8천 보 예상",
  "transport": "택시 · 그때그때",
  "keyPlaces": "고궁 · 용캉제·칭톈제 · Taipei 101",
  "keyMeal": "딘타이펑 신생점 · 85TD",
  "keyMealPlaceIds": [
    "din-tai-fung-xinsheng",
    "85td"
  ],
  "cover": "taipei-night.webp",
  "schedule": [
    {
      "time": "08:00–08:30",
      "title": "호텔 인근 가벼운 아침",
      "description": "맥모닝 등 익숙하고 가벼운 메뉴로 시작합니다.",
      "placeId": "hotel",
      "tags": [
        "아침"
      ]
    },
    {
      "time": "09:00–09:30",
      "title": "국립고궁박물원 이동",
      "description": "호텔에서 국립고궁박물원까지 택시로 이동합니다.",
      "transport": "택시"
    },
    {
      "time": "09:30–11:00",
      "title": "국립고궁박물원",
      "localName": "國立故宮博物院",
      "description": "대표 소장품과 핵심 전시 중심으로 1시간 30분. 모든 전시를 보려 욕심내지 않습니다.",
      "image": "palace.webp",
      "mapQuery": "National Palace Museum Taipei",
      "placeId": "palace"
    },
    {
      "time": "11:00–11:30",
      "title": "딘타이펑 신생점 이동",
      "description": "고궁에서 원조 계보의 딘타이펑 신생점까지 택시로 이동합니다.",
      "transport": "택시"
    },
    {
      "time": "11:30–13:00",
      "title": "딘타이펑 신생점",
      "localName": "鼎泰豐 新生店",
      "description": "원조 계보의 신생점에서 샤오롱바오와 딤섬을 함께 나눠 먹는 점심입니다.",
      "image": "xiaolongbao.webp",
      "mapQuery": "Din Tai Fung Xinsheng Branch Taipei",
      "placeId": "din-tai-fung-xinsheng",
      "tags": [
        "점심"
      ]
    },
    {
      "time": "13:00–15:00",
      "title": "용캉제·칭톈제 산책과 카페",
      "localName": "永康街 · 青田街",
      "description": "식사 후 바로 걸어서 골목과 카페거리를 즐깁니다. 부모님 컨디션에 맞춰 카페에서 충분히 쉽니다.",
      "mapQuery": "Yongkang Street and Qingtian Street Taipei",
      "placeId": "yongkang-qingtian"
    },
    {
      "time": "15:00–15:30",
      "title": "호텔 복귀",
      "description": "용캉제·칭톈제에서 택시 한 번으로 호텔에 돌아갑니다.",
      "transport": "택시"
    },
    {
      "time": "15:30–17:00",
      "title": "호텔 휴식 · 옷 갈아입기",
      "description": "마지막 저녁을 즐길 체력을 회복하는 시간입니다. 기본적으로 삭제하지 않습니다.",
      "placeId": "hotel",
      "tags": [
        "꼭 쉬기"
      ]
    },
    {
      "time": "17:15–17:45",
      "title": "Taipei 101 이동",
      "description": "옷을 갈아입고 호텔에서 Taipei 101까지 택시로 이동합니다.",
      "transport": "택시"
    },
    {
      "time": "18:00–20:30",
      "title": "85TD 메인 기념 디너",
      "description": "타이베이 야경을 바라보며 세 사람의 여행을 기념하는 저녁입니다. 예약 오픈을 기다리는 중입니다.",
      "image": "taipei-night.webp",
      "mapQuery": "85TD Taipei",
      "placeId": "85td",
      "tags": [
        "예약 오픈 대기"
      ]
    },
    {
      "time": "식사 후",
      "title": "Taipei 101 주변 야경",
      "description": "메인 디너 뒤 건물 주변의 야경을 잠깐 감상합니다.",
      "placeId": "taipei-101",
      "tags": [
        "짧게 산책"
      ]
    },
    {
      "time": "2차",
      "title": "2차 — 현장 결정",
      "description": "A. 시먼딩의 야키토리·사케 이자카야 또는 B. 신이구·Taipei 101 인근 이자카야 중 당일 분위기와 컨디션에 맞춰 정합니다. 특정 가게나 지역은 아직 확정하지 않습니다.",
      "tags": [
        "현장 결정"
      ],
      "optional": true
    }
  ]
} satisfies TripDay
