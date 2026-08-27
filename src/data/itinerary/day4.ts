import type { TripDay } from '../trip'

export const day4 = {
  "id": "day-4",
  "day": "DAY 4",
  "date": "02.23",
  "weekday": "TUE",
  "title": "식물원 · 장어덮밥 · 귀국",
  "theme": "마지막까지 편안하게",
  "lead": "관광 욕심을 내려놓고 호텔 주변의 초록을 걷고, 따뜻한 장어덮밥으로 여행을 마무리합니다.",
  "intensity": "낮음",
  "walking": "약 3–5천 보 예상",
  "transport": "LUMI DRIVE · Toyota New Alphard 40系",
  "keyPlaces": "식물원 · 비전옥 · 공항",
  "keyMeal": "비전옥 장어덮밥",
  "keyMealPlaceIds": [
    "hizenya"
  ],
  "cover": "botanical.webp",
  "schedule": [
    {
      "time": "08:00",
      "title": "느긋하게 기상",
      "description": "마지막 날은 관광 욕심을 내지 않고 천천히 하루를 시작합니다."
    },
    {
      "time": "08:30 전후",
      "title": "가벼운 아침",
      "description": "현지식을 가볍게 먹거나 컨디션에 따라 생략합니다.",
      "tags": [
        "현지식 또는 패스 가능"
      ]
    },
    {
      "time": "09:00–10:20",
      "title": "타이베이 식물원",
      "localName": "臺北植物園",
      "description": "호텔에서 가까운 초록길을 컨디션에 따라 40–80분 산책합니다.",
      "image": "botanical.webp",
      "mapQuery": "Taipei Botanical Garden",
      "placeId": "botanical"
    },
    {
      "time": "10:30–11:20",
      "title": "호텔 복귀 · 체크아웃",
      "description": "짐을 정리하고 체크아웃한 뒤 11:20 전후의 잠정 픽업 시간에 맞춰 로비에서 차량을 만납니다.",
      "placeId": "hotel"
    },
    {
      "time": "11:20 전후 · 잠정",
      "title": "LUMI DRIVE Alphard 이용",
      "description": "LUMI DRIVE의 Toyota New Alphard 40系로 호텔 → 비전옥 → 타오위안공항 T2를 이동합니다. 비전옥에서 식사하는 동안 차량이 대기하며 캐리어는 차량에 보관합니다.",
      "transport": "LUMI DRIVE · Toyota New Alphard 40系",
      "tags": [
        "첫 예약금 송금 완료",
        "약 4시간 이용"
      ]
    },
    {
      "time": "점심",
      "title": "肥前屋 비전옥",
      "description": "여행의 마지막 식사는 일본식 장어덮밥입니다. 식사하는 약 2시간 동안 차량이 대기하고 캐리어는 차량에 보관합니다.",
      "image": "unadon.webp",
      "mapQuery": "肥前屋 Taipei",
      "placeId": "hizenya",
      "tags": [
        "짐은 차량 보관"
      ]
    },
    {
      "time": "공항",
      "title": "타오위안공항 T2",
      "localName": "桃園國際機場 第二航廈",
      "description": "비즈니스 체크인과 라운지를 이용하며 여유 있게 쉬다가 탑승합니다.",
      "transport": "전용차",
      "mapQuery": "Taoyuan International Airport Terminal 2",
      "placeId": "taoyuan-t2"
    },
    {
      "time": "17:10–20:35",
      "title": "타이베이 → 인천",
      "description": "아시아나항공 비즈니스로 돌아옵니다. 세 사람이 즐겁게 귀국하면 민성투어의 목표 달성입니다.",
      "transport": "아시아나항공",
      "tags": [
        "예약 완료"
      ]
    },
    {
      "time": "입국 후",
      "title": "택시로 집까지",
      "description": "인천공항에서 집까지, 여행의 마지막 이동은 가장 단순하고 편안하게 마무리합니다.",
      "transport": "Taxi",
      "tags": [
        "현장 호출"
      ]
    }
  ]
} satisfies TripDay
