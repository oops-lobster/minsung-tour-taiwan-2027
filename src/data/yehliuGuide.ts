export type YehliuRouteId = 'compact' | 'standard' | 'deep'

export interface YehliuRouteMode {
  id: YehliuRouteId
  label: string
  time: string
  description: string
  stopIds: number[]
}

export interface YehliuStop {
  id: number
  title: string
  localName: string
  englishName: string
  zone: '시작' | '제1구역' | '제2구역' | '마무리'
  minutes: string
  familySummary: string
  science: string
  observe: string[]
  misconception?: string
  safety?: string
  sourceIds: string[]
}

export interface YehliuSource {
  id: string
  title: string
  organization: string
  scope: string
  url: string
  checked: string
}

export const yehliuRouteModes: YehliuRouteMode[] = [
  {
    id: 'compact',
    label: '핵심 50–55분',
    time: '50–55분',
    description: '바람이 세거나 부모님 체력을 아껴야 할 때 핵심 지형과 화장실만 봅니다.',
    stopIds: [0, 2, 3, 4, 6, 7, 8],
  },
  {
    id: 'standard',
    label: '표준 70–80분',
    time: '70–80분',
    description: '우리 가족 기본 코스. 제1·2구역을 무리 없이 연결하고 관찰 시간을 남깁니다.',
    stopIds: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  },
  {
    id: 'deep',
    label: '깊게 90분',
    time: '약 90분',
    description: '날씨와 체력이 좋을 때 각 지점의 심화 해설과 관찰 질문까지 천천히 봅니다.',
    stopIds: [0, 1, 2, 3, 4, 5, 6, 7, 8],
  },
]

export const yehliuStops: YehliuStop[] = [
  {
    id: 0,
    title: '방문자센터에서 출발',
    localName: '野柳遊客中心',
    englishName: 'Visitor Center',
    zone: '시작',
    minutes: '5분',
    familySummary: '화장실을 먼저 다녀오고, 오늘은 제1·2구역까지만 본다고 기억하면 됩니다.',
    science: '예류곶은 약 2천만 년 전 얕은 바다에서 쌓인 대료층 사암을 바람·비·파도·염분이 긴 시간 다듬어 만든 해안 지형입니다. 모양을 외우기보다 “단단함의 차이가 시간을 만나면 어떤 모양이 되는가”를 따라가 봅니다.',
    observe: ['바람 세기와 바닥의 젖은 정도 확인', '화장실·출구 방향 함께 확인', '70–80분 표준 코스 선택'],
    safety: '미끄럼 방지 신발, 모자 끈, 물을 확인하고 통제선 밖으로 나가지 않습니다.',
    sourceIds: ['S1', 'S2', 'S4'],
  },
  {
    id: 1,
    title: '바다가 깎은 평평한 바닥과 항아리 구멍',
    localName: '海蝕平台・壺穴',
    englishName: 'Marine abrasion platform · Potholes',
    zone: '제1구역',
    minutes: '7분',
    familySummary: '파도와 돌이 오랫동안 같은 곳을 문지르면 단단한 바위에도 평평한 바닥과 둥근 구멍이 생깁니다.',
    science: '파도에 실린 모래와 자갈이 해안 암반을 마모시키고, 틈이나 오목한 곳에 갇힌 자갈이 회전하며 구멍을 넓힙니다. 모든 둥근 구멍이 같은 방식으로 만들어진 것은 아니므로 현장 표지와 형태를 함께 봅니다.',
    observe: ['해수면 쪽으로 낮아지는 바닥', '구멍 속 자갈과 물의 흔적', '균열을 따라 침식이 깊어진 부분'],
    misconception: '“파도가 한 번 세게 쳐서 뚫린 구멍”이 아니라 반복된 마모와 풍화의 결과입니다.',
    safety: '파도 방향으로 가까이 가지 말고, 젖은 암반은 밟지 않습니다.',
    sourceIds: ['S3', 'S4'],
  },
  {
    id: 2,
    title: '촛대처럼 남은 단단한 중심',
    localName: '燭臺石',
    englishName: 'Candle Rock',
    zone: '제1구역',
    minutes: '7분',
    familySummary: '가운데 단단한 결핵이 촛불 심지처럼 남고, 주변의 부드러운 사암이 먼저 깎여 촛대 모양이 되었습니다.',
    science: '사암 속 탄산칼슘 성분이 더 단단하게 굳은 결핵과 그 주변의 풍화 속도 차이가 핵심입니다. 균열·염분 풍화·빗물·파도의 공동 작용이 받침 부분을 낮추고 중앙부를 돌출시킵니다.',
    observe: ['꼭대기의 둥글고 단단한 부분', '중앙에서 퍼지는 균열', '주변 바닥보다 솟은 높이'],
    misconception: '사람이 쌓아 올린 돌기둥이 아니라 암석 내부의 단단함 차이가 드러난 자연 지형입니다.',
    safety: '바위에 기대거나 올라서지 말고 관람선 안에서 봅니다.',
    sourceIds: ['S3', 'S4'],
  },
  {
    id: 3,
    title: '버섯바위의 한살이',
    localName: '蕈狀岩群・俏皮公主',
    englishName: 'Mushroom rocks · Cute Princess',
    zone: '제1구역',
    minutes: '10분',
    familySummary: '목이 없는 어린 바위가 굵은 목, 가는 목을 거쳐 언젠가 부러집니다. 귀여운 공주바위에서 그 시간을 읽어봅니다.',
    science: '상부의 단단한 결핵이 모자처럼 남는 동안 아래 사암은 차등침식으로 더 빨리 가늘어집니다. 공식 분류는 무경·조경·세경·단경 단계로 설명합니다. 한 바위가 하루아침에 변하는 것이 아니라 여러 바위가 서로 다른 단계를 보여줍니다.',
    observe: ['목이 거의 없는 바위와 가는 바위 비교', '상부 모자와 목의 재질·색 차이', '바람을 정면으로 받는 면의 풍화'],
    misconception: '“버섯 모양으로 자라난다”기보다 주변과 목 부분이 더 빨리 사라지며 모양이 드러납니다.',
    safety: '좁은 관람 구간에서는 사진 줄을 막지 말고, 암석에 손을 대지 않습니다.',
    sourceIds: ['S3', 'S4'],
  },
  {
    id: 4,
    title: '바위에 남은 옛 바다 생물의 흔적',
    localName: '海膽化石・生痕化石',
    englishName: 'Sea urchin fossils · Trace fossils',
    zone: '제1구역',
    minutes: '8분',
    familySummary: '예류가 옛날 바다 밑이었다는 증거를 바위 속 성게와 생물이 움직인 흔적에서 찾습니다.',
    science: '대료층이 얕은 바다에서 퇴적될 때 생물의 몸체나 굴·이동 흔적이 퇴적물에 남았습니다. 몸 자체가 남은 체화석과 행동 흔적인 생흔화석을 구분해 보면 과거 환경을 더 입체적으로 읽을 수 있습니다.',
    observe: ['별 모양에 가까운 성게 흔적', '구불구불하거나 관 모양인 생흔', '주변 사암의 층리'],
    misconception: '모든 무늬가 화석은 아닙니다. 균열·풍화 무늬와 생물 흔적은 현장 설명판과 비교합니다.',
    safety: '화석을 떼거나 긁지 않고 눈으로만 관찰합니다.',
    sourceIds: ['S3', 'S4'],
  },
  {
    id: 5,
    title: '모양을 닮아 이름 붙인 바위들',
    localName: '仙女鞋・地球石・臺灣石',
    englishName: 'Fairy’s Shoe · Earth Rock · Taiwan Rock',
    zone: '제2구역',
    minutes: '8분',
    familySummary: '요정의 신발, 지구, 대만 지도처럼 보이는 바위를 찾으며 자연이 만든 우연한 실루엣을 즐깁니다.',
    science: '이 이름들은 형성과정을 뜻하는 과학 용어가 아니라 보이는 모양에 붙인 경관 이름입니다. 같은 사암이라도 절리 방향, 결핵 위치, 물이 흐르는 길이 달라 서로 다른 윤곽이 나타납니다.',
    observe: ['보는 각도에 따라 바뀌는 실루엣', '균열이 윤곽을 만든 방향', '표면의 벌집 같은 염풍화 흔적'],
    misconception: '이름이 비슷하다고 같은 방식으로 만들어졌다는 뜻은 아닙니다.',
    safety: '사진을 위해 통제선이나 붉은 경계선을 넘지 않습니다.',
    sourceIds: ['S3', 'S4'],
  },
  {
    id: 6,
    title: '여왕머리에서 시간을 보다',
    localName: '女王頭',
    englishName: 'Queen’s Head',
    zone: '제2구역',
    minutes: '10분',
    familySummary: '위는 단단하고 목은 더 빨리 깎이는 버섯바위의 대표입니다. 유명한 모양보다 지금도 계속 변한다는 점이 핵심입니다.',
    science: '상부 결핵과 하부 사암의 차등풍화로 가는 목이 남았습니다. 1960년대에 꼭대기 일부가 절리를 따라 떨어진 뒤 특정 각도에서 여왕의 옆모습을 닮아 이름 붙었습니다. 침식과 풍화는 지금도 이어집니다.',
    observe: ['머리와 목의 굵기 차이', '가장 닮아 보이는 관찰 각도', '주변 다른 세경형 버섯바위'],
    misconception: '여왕머리만 특별한 재료로 만들어진 것이 아니라 버섯바위 발달 과정의 한 장면입니다.',
    safety: '대기 줄 안내를 따르고 바위를 만지거나 기대지 않습니다.',
    sourceIds: ['S3', 'S4'],
  },
  {
    id: 7,
    title: 'Queen’s Bookstore에서 쉬기',
    localName: '女王的書店',
    englishName: 'Queen’s Bookstore · Restroom',
    zone: '제2구역',
    minutes: '5–10분',
    familySummary: '제2구역의 화장실과 휴식 지점입니다. 바람이 세거나 피곤하면 여기서 바로 출구로 돌아갑니다.',
    science: '관찰도 휴식이 있어야 오래 남습니다. 오늘 본 바위 중 “단단한 부분이 남은 사례”와 “옛 바다의 증거”를 하나씩 말해보면 정리가 됩니다.',
    observe: ['화장실 위치 확인', '가족 컨디션 확인', '차량 복귀 시각 역산'],
    safety: '10:45~10:50 차량 복귀 목표를 기준으로 늦지 않게 이동을 시작합니다.',
    sourceIds: ['S1', 'S2'],
  },
  {
    id: 8,
    title: '출구로 돌아가 차량 합류',
    localName: '出口・停車場',
    englishName: 'Exit · Vehicle meeting point',
    zone: '마무리',
    minutes: '8–12분',
    familySummary: '마지막 사진보다 약속한 차량 복귀가 우선입니다. 출구와 방문자센터를 지나 주차장 합류 지점으로 갑니다.',
    science: '오늘의 한 문장: 단단함이 다른 사암을 파도·비·바람·염분이 오래 다르게 깎아 예류의 지형이 드러났습니다.',
    observe: ['가족 세 명 모두 함께 이동', '소지품 확인', '기사에게 도착 메시지'],
    safety: '공식 퇴장 동선과 직원 안내를 따릅니다. 현장 통제 시 이 가이드보다 안내가 우선입니다.',
    sourceIds: ['S1', 'S2'],
  },
]

export const yehliuTimeline = [
  { time: '약 2,200만 년 전', title: '얕은 바다에 모래가 쌓이다', description: '생물의 몸과 움직임이 퇴적물에 함께 기록됩니다.' },
  { time: '긴 매몰 시간', title: '모래가 사암으로 굳다', description: '일부에는 탄산칼슘이 모여 주변보다 단단한 결핵이 생깁니다.' },
  { time: '지층의 융기', title: '옛 해저가 바깥으로 드러나다', description: '기울어진 사암층이 바다와 바람을 직접 만나기 시작합니다.' },
  { time: '수천~수만 년의 반복', title: '파도·비·바람·염분이 다르게 깎다', description: '절리와 단단함의 차이를 따라 촛대바위와 버섯바위가 드러납니다.' },
  { time: '지금', title: '완성품이 아니라 변화 중', description: '여왕머리를 포함한 모든 지형은 오늘도 조금씩 변합니다.' },
]

export const yehliuGlossary = [
  { ko: '해식대', zh: '海蝕平台', en: 'marine abrasion platform', description: '파도가 해안 암반을 깎아 만든 비교적 평평한 바닥.' },
  { ko: '항아리구멍', zh: '壺穴', en: 'pothole', description: '자갈과 물의 반복 운동 등으로 암반에 생긴 둥근 구멍.' },
  { ko: '결핵', zh: '結核', en: 'concretion', description: '퇴적암 속 성분이 모여 주변보다 단단하게 굳은 덩어리.' },
  { ko: '차등침식', zh: '差異侵蝕', en: 'differential erosion', description: '단단함이나 환경 차이 때문에 암석이 서로 다른 속도로 깎이는 현상.' },
  { ko: '절리', zh: '節理', en: 'joint', description: '암석에 발달한 틈. 물과 염분이 들어가는 길이 되기도 함.' },
  { ko: '염풍화', zh: '鹽風化', en: 'salt weathering', description: '바닷물의 소금 결정이 암석 틈에서 자라 표면을 약하게 만드는 풍화.' },
  { ko: '사암', zh: '砂岩', en: 'sandstone', description: '모래 알갱이가 쌓이고 굳어 만들어진 퇴적암.' },
  { ko: '생흔화석', zh: '生痕化石', en: 'trace fossil', description: '굴, 발자국, 이동 자국처럼 생물의 행동이 남은 화석.' },
  { ko: '버섯바위', zh: '蕈狀岩', en: 'mushroom rock', description: '위쪽보다 목 부분이 더 빨리 깎여 버섯처럼 보이는 바위.' },
]

export const yehliuQuiz = [
  { question: '여왕머리의 목이 머리보다 빨리 가늘어지는 가장 큰 이유는?', answer: '상부 결핵과 하부 사암의 단단함 차이, 그리고 풍화·침식이 함께 작용하기 때문입니다.' },
  { question: '생흔화석은 생물의 몸 자체일까요?', answer: '아니요. 굴이나 이동 자국처럼 생물이 남긴 행동의 흔적입니다.' },
  { question: '예류의 모든 둥근 구멍은 같은 원리로 생겼을까요?', answer: '아닙니다. 마모·용식·풍화 등 현장 조건이 다를 수 있어 형태와 설명판을 함께 봐야 합니다.' },
  { question: '가장 중요한 안전 규칙 한 가지는?', answer: '현장 통제선과 직원 안내를 따르고 젖은 해안 암반이나 파도 가까이 가지 않는 것입니다.' },
]

export const yehliuChecklist = [
  '가이드 전체를 온라인에서 한 번 저장하기',
  '휴대폰 배터리와 보조배터리 확인',
  '미끄럼 방지 신발·바람에 날리지 않는 모자',
  '09:20 도착 후 방문자센터 화장실 먼저 이용',
  '10:45~10:50 차량 복귀 목표를 기사와 확인',
  '2027년 운영시간·통제구역·기상 최종 확인',
]

export const yehliuSafety = [
  '붉은 경계선·통제선·직원 안내가 이 가이드보다 항상 우선입니다.',
  '파도 방향의 젖은 암반, 가장자리, 물이 고인 홈에는 접근하지 않습니다.',
  '암석을 만지거나 올라서거나 화석·조개·돌을 채취하지 않습니다.',
  '강풍·큰 파도·호우·부모님 피로가 있으면 핵심 코스로 줄이고 즉시 돌아갑니다.',
  '제3구역은 이번 가족 셀프 가이드 범위에서 제외합니다.',
]

export const yehliuSources: YehliuSource[] = [
  {
    id: 'S1',
    title: '방문자센터·서비스 안내',
    organization: '野柳地質公園 공식 웹사이트',
    scope: '운영시간, 방문자센터, 무료 Wi-Fi, 편의시설',
    url: 'https://www.ylgeopark.org.tw/ServeAndShopView/VisitorCenter',
    checked: '2026-08-23',
  },
  {
    id: 'S2',
    title: '무장애 친화 서비스',
    organization: '野柳地質公園 공식 웹사이트',
    scope: '화장실 3곳과 제1·2구역 접근 동선',
    url: 'https://ylgeopark.org.tw/ServeAndShopView/Accessibility',
    checked: '2026-08-23',
  },
  {
    id: 'S3',
    title: '천만년 기암·2026 공원 안내',
    organization: '野柳地質公園 공식 웹사이트',
    scope: '구역별 바위 이름, 버섯바위 발달 단계, 여왕머리 설명',
    url: 'https://www.ylgeopark.org.tw/AboutYehliuView/CenturyOldRocks?language=TW',
    checked: '2026-08-23',
  },
  {
    id: 'S4',
    title: '신베이시 예류지질공원 자연경관 가치 평가보고서',
    organization: '농업부 임업 및 자연보전서',
    scope: '대료층 사암, 얕은 바다 퇴적, 결핵, 융기·풍화·차등침식의 복합 과정',
    url: 'https://conservation.forest.gov.tw/File.aspx?fno=76536',
    checked: '2026-08-23',
  },
  {
    id: 'S5',
    title: '방문 전 자주 묻는 질문',
    organization: '野柳地質公園 공식 웹사이트',
    scope: '제1·2구역 약 1시간, 화장실 위치, 물놀이·흡연 제한',
    url: 'https://ylgeopark.org.tw/VisitInformationView/CommonProblem',
    checked: '2026-08-23',
  },
]
