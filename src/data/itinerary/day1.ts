import type { TripDay } from '../trip'

export const day1 = {
  "id": "day-1",
  "day": "DAY 1",
  "date": "02.20",
  "weekday": "SAT",
  "title": "타이베이의 첫인상",
  "theme": "전통가옥 · 산 위의 일몰 · 완화의 밤",
  "lead": "좋은 점심과 오래된 대만 가옥으로 도시에 들어가, 백석호와 벽산암의 일몰을 보고 완화의 밤으로 하루를 마무리합니다.",
  "intensity": "보통",
  "walking": "약 7–9천 보 예상",
  "transport": "G90 LWB 출국 · 宇航富豪 Mercedes 항공의자 공항 픽업 · 택시 · 도보",
  "keyPlaces": "린안타이 고택 · 백석호 · 벽산암 · 용산사",
  "keyMeal": "My灶 · 小統一牛排",
  "keyMealPlaceIds": [
    "my-zao",
    "xiao-tong-yi"
  ],
  "cover": "longshan.webp",
  "schedule": [
    {
      "time": "04:10–04:20",
      "title": "목동 출발 · G90 LWB 4인승",
      "description": "글로벌25시콜리무진의 Genesis G90 Long Wheel Base 4인승으로 인천공항 제2터미널까지 이동하는 예약이 확정되었습니다. 성인 3명과 캐리어 2개 기준이며, 업체가 제공한 실제 4인승 VIP 후석 사진도 확인했습니다. 예약금은 없습니다.",
      "transport": "글로벌25시콜리무진 · Genesis G90 LWB 4인승",
      "tags": [
        "예약 확정",
        "G90 LWB 4인승 지정",
        "4인승 VIP 후석 확인",
        "예약금 없음"
      ],
      "image": "g90-lwb-4seat-rear.webp"
    },
    {
      "time": "05:10–05:30",
      "title": "인천공항 T2 도착",
      "description": "출발층에서 짐을 내리고 비즈니스 체크인 카운터로 이동합니다.",
      "transport": "인천공항 제2터미널"
    },
    {
      "time": "도착 후",
      "title": "비즈니스 체크인 → 보안검색",
      "description": "체크인을 마친 뒤 보안검색을 통과해 출국장으로 이동합니다.",
      "tags": [
        "비즈니스"
      ]
    },
    {
      "time": "06:00 전후",
      "title": "라운지에서 아침과 휴식",
      "description": "아침 식사와 휴식을 하며 여유 있게 탑승을 준비합니다.",
      "tags": [
        "라운지"
      ]
    },
    {
      "time": "07:10–07:20",
      "title": "라운지에서 나와 게이트 이동",
      "description": "혼잡을 감안해 여유 있게 탑승 게이트로 이동합니다."
    },
    {
      "time": "08:00",
      "title": "인천 출발",
      "description": "아시아나항공 비즈니스로 편안하게 여행을 시작합니다.",
      "transport": "아시아나항공",
      "tags": [
        "예약 완료"
      ]
    },
    {
      "time": "09:50",
      "title": "타오위안공항 도착",
      "localName": "桃園國際機場 第二航廈",
      "description": "아시아나항공 OZ711으로 타오위안공항 T2에 도착합니다. 입국과 수하물 수령을 마친 뒤 피켓을 든 기사님을 만납니다.",
      "transport": "아시아나항공 OZ711",
      "mapQuery": "Taoyuan International Airport Terminal 2",
      "placeId": "taoyuan-t2"
    },
    {
      "time": "약 10:35–10:55 예상",
      "title": "Mercedes 항공의자 차량 · 호텔 이동",
      "localName": "宇航富豪 · 賓士航空椅",
      "description": "2027-02-20 09:50 OZ711편으로 타오위안공항 제2터미널에 도착한 뒤 피켓을 든 기사님을 만납니다. 성인 3명, 중형 캐리어 1개와 기내용 캐리어 1개 조건으로 사진 속 Mercedes-Benz 항공의자 차량을 예약했습니다. 기사님이 수하물을 도와주며 공항 도착 후 85분까지 대기한 뒤 Taipei Garden Hotel로 이동합니다.",
      "transport": "宇航富豪 · Mercedes-Benz 항공의자 차량",
      "tags": [
        "예약 확정",
        "사진 속 차량 지정",
        "피켓 미팅",
        "85분 대기",
        "수하물 도움"
      ],
      "image": "airport-pickup-mercedes-cabin.jpg",
      "mapQuery": "Taoyuan International Airport Terminal 2 to Taipei Garden Hotel",
      "placeId": "taoyuan-t2"
    },
    {
      "time": "차량 정보",
      "title": "Mercedes 항공의자 · VIP 실내",
      "localName": "賓士航空椅",
      "description": "업체가 실제 배차 차량으로 확인한 실내입니다. 독립형 항공의자에 전동 리클라이닝·레그레스트·통풍·열선·마사지 기능이 있다고 확인받았습니다. 첫날 공항에서 호텔까지 부모님이 편하게 이동하는 데 초점을 둔 선택입니다.",
      "tags": [
        "독립형 항공의자",
        "전동 리클라이닝",
        "레그레스트",
        "통풍",
        "열선",
        "마사지"
      ],
      "image": "airport-pickup-mercedes-vip-seats.jpg",
      "optional": true
    },
    {
      "time": "약 11:20–11:40",
      "title": "Taipei Garden Hotel · 짐 맡기기",
      "localName": "台北花園大酒店",
      "description": "체크인 전이면 짐만 맡기고 첫 일정을 시작합니다. 실제 도착 시각은 입국과 도로 상황에 따라 달라질 수 있습니다.",
      "mapQuery": "Taipei Garden Hotel",
      "placeId": "hotel"
    },
    {
      "time": "11:50 전후",
      "title": "택시로 My灶 이동",
      "description": "첫날은 대중교통 체험보다 12:10 점심 예약 시간을 안정적으로 맞추는 것을 우선합니다.",
      "transport": "택시"
    },
    {
      "time": "12:10–13:15",
      "title": "My灶 점심",
      "localName": "My灶",
      "description": "예약 메뉴인 과일닭과 참기름 닭밥을 중심으로 먹고, 새우·공심채 등 추가 메뉴는 현장에서 배 상태를 보고 정합니다.",
      "tags": [
        "12:10 예약",
        "대만 가정식"
      ],
      "mapQuery": "My灶 Taipei",
      "placeId": "my-zao"
    },
    {
      "time": "13:30–14:10",
      "title": "弄宅咖啡",
      "localName": "弄宅咖啡 · Alleyhouse Coffee",
      "description": "13:30 성인 3명 예약이 확정된 골목 주택 카페입니다. Plan A와 Plan B 모두 유지하고, 다음 일정에 맞춰 약 40분 쉬어 갑니다.",
      "tags": [
        "13:30 예약 확정",
        "3인",
        "Plan A/B 공통"
      ],
      "mapQuery": "弄宅咖啡 Alleyhouse Coffee Taipei",
      "placeId": "alleyhouse"
    },
    {
      "time": "14:10–14:25",
      "title": "택시로 린안타이 고택 이동",
      "description": "카페에서 린안타이 고택까지 택시로 바로 이동합니다.",
      "transport": "택시"
    },
    {
      "time": "14:25–15:20",
      "title": "린안타이 고택",
      "localName": "林安泰古厝民俗文物館",
      "description": "청대 민남식 전통가옥과 정원을 약 55분 동안 천천히 둘러봅니다. 맑은 날 Plan A의 메인 문화 방문지입니다.",
      "tags": [
        "전통가옥",
        "정원",
        "Plan A"
      ],
      "mapQuery": "Lin An Tai Historical House and Museum",
      "placeId": "lin-an-tai"
    },
    {
      "time": "15:20–15:50",
      "title": "택시로 백석호 이동",
      "description": "린안타이 고택에서 네이후 산 위의 백석호까지 여유를 두고 이동합니다.",
      "transport": "택시"
    },
    {
      "time": "15:50–16:50",
      "title": "백석호 출렁다리·하트연못",
      "localName": "白石湖吊橋 · 同心池",
      "description": "출렁다리와 하트연못을 묶어 약 한 시간 산책합니다. 부모님 컨디션에 따라 10분 정도 줄여도 좋습니다.",
      "tags": [
        "산책",
        "시간 조절 가능"
      ],
      "mapQuery": "Baishihu Suspension Bridge Taipei",
      "placeId": "baishihu"
    },
    {
      "time": "16:50–17:00",
      "title": "벽산암으로 이동",
      "description": "백석호 산책을 마치고 벽산암 전망 구역으로 짧게 이동합니다.",
      "transport": "택시 · 현장 이동"
    },
    {
      "time": "17:00–18:15",
      "title": "벽산암 · 일몰과 블루아워",
      "localName": "碧山巖開漳聖王廟",
      "description": "사원과 타이베이 전망을 천천히 보고 17:50 전후 일몰과 18:15 전후 블루아워를 즐깁니다. 18:05 전후에는 내려갈 택시를 미리 호출합니다.",
      "tags": [
        "17:50 일몰",
        "18:05 택시 미리 호출",
        "18:15 탑승 목표"
      ],
      "mapQuery": "Bishanyan Kaizhang Shengwang Temple Taipei",
      "placeId": "bishanyan"
    },
    {
      "time": "18:05 호출 · 18:15 탑승 목표",
      "title": "미리 부른 택시로 小統一牛排 이동",
      "description": "산에서 내려온 뒤 택시를 찾기 시작하지 않도록 18:05 전후 미리 호출합니다. 19:00 예약에 늦지 않게 여유를 둡니다.",
      "transport": "택시 · 사전 호출",
      "tags": [
        "운영 메모"
      ]
    },
    {
      "time": "19:00–20:15",
      "title": "小統一牛排 저녁",
      "localName": "小統一牛排館",
      "description": "2027년 2월 20일 토요일 19:00, 성인 3명 예약이 확정된 저녁입니다. 대만식 클래식 스테이크와 소고기 코스를 즐깁니다.",
      "tags": [
        "19:00 고정",
        "3인 예약 확정"
      ],
      "mapQuery": "小統一牛排 Taipei",
      "placeId": "xiao-tong-yi"
    },
    {
      "time": "20:15–20:45",
      "title": "택시로 용산사 이동",
      "description": "저녁을 마치고 완화의 오래된 밤거리로 이동합니다.",
      "transport": "택시"
    },
    {
      "time": "20:45–21:15",
      "title": "용산사 야간 관람",
      "localName": "艋舺龍山寺",
      "description": "조명이 켜진 사찰을 천천히 보고 완화의 밤 산책을 시작합니다.",
      "image": "longshan.webp",
      "mapQuery": "Longshan Temple Taipei",
      "placeId": "longshan"
    },
    {
      "time": "21:15 이후",
      "title": "화시제·광저우제 야시장",
      "localName": "華西街觀光夜市 · 廣州街夜市",
      "description": "배를 다시 채우기보다 오래된 시장 골목의 밤 분위기를 짧게 즐깁니다. 피곤하면 바로 줄입니다.",
      "image": "huaxi.webp",
      "mapQuery": "Huaxi Street Night Market",
      "placeId": "huaxi",
      "tags": [
        "야시장",
        "밤 골목 산책"
      ]
    },
    {
      "time": "마무리",
      "title": "까르푸 구이린점 → 호텔",
      "localName": "家樂福桂林店 → 台北花園大酒店",
      "description": "호텔 맞은편 24시간 까르푸에서 과일과 간식을 조금 사고 걸어서 숙소로 돌아갑니다.",
      "mapQuery": "Carrefour Guilin Store Taipei",
      "placeId": "carrefour-guilin",
      "tags": [
        "24시간",
        "간식·과일"
      ]
    }
  ]
} satisfies TripDay
