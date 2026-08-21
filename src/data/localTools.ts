export interface PlaceInfo {
  name: string
  localName: string
  address: string
  latitude: number
  longitude: number
}

export const placeCatalog = {
  'taoyuan-t2': {
    name: '타오위안공항 T2',
    localName: '桃園國際機場 第二航廈',
    address: '桃園市大園區航站南路9號',
    latitude: 25.07702,
    longitude: 121.23198,
  },
  hotel: {
    name: 'Taipei Garden Hotel',
    localName: '台北花園大酒店',
    address: '台北市中正區中華路二段1號',
    latitude: 25.035,
    longitude: 121.5061,
  },
  'chun-shui-tang': {
    name: '춘수당 중정기념당점',
    localName: '春水堂 中正店',
    address: '台北市中正區中山南路21-1號',
    latitude: 25.0361,
    longitude: 121.5187,
  },
  'chiang-kai-shek': {
    name: '중정기념당',
    localName: '中正紀念堂',
    address: '台北市中正區中山南路21號',
    latitude: 25.0347,
    longitude: 121.5219,
  },
  'tamsui-wharf': {
    name: '단수이 위런마터우',
    localName: '淡水漁人碼頭 · 情人橋',
    address: '新北市淡水區觀海路199號',
    latitude: 25.1838,
    longitude: 121.4106,
  },
  yuzang: {
    name: '魚藏餐廳',
    localName: '魚藏餐廳',
    address: '新北市淡水區中正路附近',
    latitude: 25.1678,
    longitude: 121.445,
  },
  longshan: {
    name: '용산사',
    localName: '艋舺龍山寺',
    address: '台北市萬華區廣州街211號',
    latitude: 25.0372,
    longitude: 121.4999,
  },
  huaxi: {
    name: '화시제·광저우제 야시장',
    localName: '華西街觀光夜市 · 廣州街夜市',
    address: '台北市萬華區華西街',
    latitude: 25.0388,
    longitude: 121.4982,
  },
  sanwei: {
    name: '삼미식당',
    localName: '三味食堂',
    address: '台北市萬華區貴陽街二段116號',
    latitude: 25.0399,
    longitude: 121.5027,
  },
  ximending: {
    name: '시먼딩',
    localName: '西門町',
    address: '台北市萬華區漢中街周邊',
    latitude: 25.0421,
    longitude: 121.5077,
  },
  yehliu: {
    name: '예류지질공원',
    localName: '野柳地質公園',
    address: '新北市萬里區港東路167-1號',
    latitude: 25.2053,
    longitude: 121.6905,
  },
  'qiao-yan': {
    name: 'Qiao Yan Seafood',
    localName: '俏宴',
    address: '新北市萬里區野柳里港東路附近',
    latitude: 25.203,
    longitude: 121.688,
  },
  'shifen-waterfall': {
    name: '스펀폭포',
    localName: '十分瀑布',
    address: '新北市平溪區乾坑10號',
    latitude: 25.0497,
    longitude: 121.7871,
  },
  'shifen-old-street': {
    name: '스펀 옛거리',
    localName: '十分老街',
    address: '新北市平溪區十分街',
    latitude: 25.0434,
    longitude: 121.775,
  },
  jiufen: {
    name: '지우펀 옛거리',
    localName: '九份老街',
    address: '新北市瑞芳區基山街',
    latitude: 25.1099,
    longitude: 121.8452,
  },
  palace: {
    name: '국립고궁박물원',
    localName: '國立故宮博物院',
    address: '台北市士林區至善路二段221號',
    latitude: 25.1024,
    longitude: 121.5485,
  },
  'taipei-fine-arts': {
    name: '타이베이 시립미술관',
    localName: '臺北市立美術館',
    address: '台北市中山區中山北路三段181號',
    latitude: 25.07203,
    longitude: 121.52466,
  },
  'xiaoyin-dongmen': {
    name: '샤오인차안 동먼점',
    localName: '小隱茶庵 東門店',
    address: '台北市中正區杭州南路一段143巷12-1號',
    latitude: 25.03592,
    longitude: 121.52578,
  },
  huiliu: {
    name: '후이리우',
    localName: '回留',
    address: '台北市大安區永康街31巷9號',
    latitude: 25.0314,
    longitude: 121.5297,
  },
  'din-tai-fung-xinsheng': {
    name: '딘타이펑 신생점',
    localName: '鼎泰豐 新生店',
    address: '台北市中正區信義路二段277號',
    latitude: 25.0331,
    longitude: 121.5317,
  },
  'yongkang-qingtian': {
    name: '용캉제·칭톈제',
    localName: '永康街 · 青田街',
    address: '台北市大安區永康街、青田街周邊',
    latitude: 25.0332,
    longitude: 121.5295,
  },
  'taipei-101': {
    name: 'Taipei 101',
    localName: '台北101',
    address: '台北市信義區市府路45號',
    latitude: 25.034,
    longitude: 121.5645,
  },
  '85td': {
    name: '85TD',
    localName: '捌伍添第',
    address: '台北市信義區信義路五段7號 台北101 85樓',
    latitude: 25.034,
    longitude: 121.5645,
  },
  botanical: {
    name: '타이베이 식물원',
    localName: '臺北植物園',
    address: '台北市中正區南海路53號',
    latitude: 25.0317,
    longitude: 121.51,
  },
  hizenya: {
    name: '비전옥',
    localName: '肥前屋',
    address: '台北市中山區中山北路一段121巷13-2號',
    latitude: 25.0518,
    longitude: 121.5233,
  },
} satisfies Record<string, PlaceInfo>

export type PlaceId = keyof typeof placeCatalog

export const rainPlans = [
  {
    day: 'DAY 1',
    title: '비 오는 타이베이 · 현대미술과 대만차',
    options: [
      { condition: '오후', action: 'My灶 뒤 타이베이 시립미술관과 小隱茶庵으로 이어갑니다.' },
      { condition: '찻집 만석', action: '小隱茶庵 대신 回留에서 대만차를 즐깁니다.' },
      { condition: '저녁 이후', action: '비가 약해지면 용산사·야시장, 계속 강하면 까르푸만 짧게 들릅니다.' },
    ],
  },
  {
    day: 'DAY 2',
    title: '강수량에 따라 야외 구간 조절',
    options: [
      { condition: '약한 비', action: '원안을 유지합니다.' },
      { condition: '강한 비', action: '스펀폭포를 우선 축소하거나 생략합니다.' },
      { condition: '폭우·강풍', action: '예류·스펀 변경을 기사님과 함께 검토합니다.' },
    ],
  },
  {
    day: 'DAY 3',
    title: '고궁은 유지, 골목은 카페로 대체',
    options: [
      { condition: '비', action: '국립고궁박물원과 딘타이펑 신생점은 그대로 진행합니다.' },
      { condition: '대안', action: '용캉제·칭톈제 산책은 줄이고 카페 체류 시간을 늘립니다.' },
    ],
  },
  {
    day: 'DAY 4',
    title: '출국일은 가장 단순하게',
    options: [
      { condition: '비', action: '타이베이 식물원은 미련 없이 생략할 수 있습니다.' },
      { condition: '대안', action: '호텔 체크아웃과 비전옥 점심 중심으로 단순화합니다.' },
    ],
  },
]

export const translationPhrases = [
  { category: '기사님', korean: '여기서 기다려주세요.', chinese: '請在這裡等我們。' },
  { category: '기사님', korean: '몇 시에 다시 만나나요?', chinese: '我們幾點再見面？' },
  { category: '기사님', korean: '다음 장소로 가주세요.', chinese: '請帶我們去下一個地點。' },
  { category: '기사님', korean: '비 때문에 일정을 변경하고 싶습니다.', chinese: '因為下雨，我們想更改行程。' },
  { category: '기사님', korean: '짐을 차 안에 두어도 될까요?', chinese: '行李可以放在車上嗎？' },
  { category: '기사님', korean: '잠시 화장실 다녀오겠습니다.', chinese: '我們去一下洗手間，馬上回來。' },
  { category: '식당', korean: '3명입니다.', chinese: '我們三位。' },
  { category: '식당', korean: '예약했습니다.', chinese: '我們有訂位。' },
  { category: '식당', korean: '포장해주세요.', chinese: '請幫我們外帶。' },
  { category: '식당', korean: '추천 메뉴가 무엇인가요?', chinese: '請問有什麼推薦的菜？' },
  { category: '식당', korean: '맵지 않게 해주세요.', chinese: '請做不辣的。' },
  { category: '식당', korean: '계산해주세요.', chinese: '麻煩買單，謝謝。' },
] as const

export const restaurantFallbacks = [
  { day: 'DAY 1 · 점심', planA: '춘수당 중정기념당점', planB: '호텔·중정기념당 인근의 가벼운 실내식', reason: '웨이팅 또는 도착 지연' },
  { day: 'DAY 1 · 저녁', planA: '魚藏餐廳', planB: '단수이 라오제의 깔끔한 대만식 식당', reason: '휴무 또는 부모님 컨디션' },
  { day: 'DAY 2 · 점심', planA: 'Qiao Yan Seafood / 俏宴', planB: '예류 인근 실내식 또는 기사님 추천 식당', reason: '현장 영업 상태' },
  { day: 'DAY 2 · 저녁', planA: '지우펀 현지식', planB: '지우펀 찻집의 간단한 식사', reason: '골목 혼잡 또는 피로' },
  { day: 'DAY 3 · 점심', planA: '딘타이펑 신생점', planB: '용캉제의 깔끔한 대만식 식당', reason: '대기시간 과다' },
  { day: 'DAY 3 · 저녁', planA: '85TD', planB: '신이구 호텔 다이닝', reason: '예약 불가 또는 일정 변경' },
  { day: 'DAY 4 · 점심', planA: '肥前屋 비전옥', planB: '중산역 인근 실내 일식', reason: '휴무 또는 웨이팅' },
] as const

export const streetSnacks = [
  { id: 'pepper-bun', name: '후추빵', localName: '胡椒餅', image: 'snack-pepper-bun.webp', where: '라오허제·야시장', situation: '갓 구운 빵을 발견했을 때 반씩 나눠 먹기' },
  { id: 'chicken-cutlet', name: '지파이', localName: '雞排', image: 'snack-chicken-cutlet.webp', where: '야시장', situation: '저녁 전이 아니라 가벼운 야식이 필요할 때' },
  { id: 'scallion-pancake', name: '총좌빙', localName: '蔥抓餅', image: 'snack-scallion-pancake.webp', where: '용캉제', situation: '카페 산책 중 세 사람이 한 장 나눠 먹기' },
  { id: 'aiyu', name: '아이위빙', localName: '愛玉冰', image: 'snack-aiyu.webp', where: '용캉제·야시장', situation: '많이 걸은 뒤 상큼하게 쉬고 싶을 때' },
  { id: 'taro-balls', name: '타로볼', localName: '芋圓', image: 'snack-taro-balls.webp', where: '지우펀', situation: '야경 보기 전 따뜻하거나 시원한 디저트로' },
  { id: 'peanut-roll', name: '땅콩 아이스크림 롤', localName: '花生捲冰淇淋', image: 'snack-peanut-roll.webp', where: '지우펀', situation: '줄이 짧을 때만 즉석 간식으로' },
  { id: 'douhua', name: '두화', localName: '豆花', image: 'snack-douhua.webp', where: '시먼딩·용캉제', situation: '부드럽고 부담 없는 디저트가 필요할 때' },
  { id: 'pineapple-cake', name: '펑리수', localName: '鳳梨酥', image: 'snack-pineapple-cake.webp', where: '백화점·공항', situation: '선물용은 마지막 날 여유 있게' },
  { id: 'salmon-sushi', name: '삼미식당 연어초밥', localName: '三味食堂 鮭魚壽司', image: 'snack-salmon-sushi.webp', where: '완화구', situation: '대기가 짧을 때 포장해 호텔 야식으로' },
] as const

export const travelApps = [
  { id: 'maps', name: 'Google Maps', use: '장소 확인과 현재 위치 길찾기', ios: 'https://apps.apple.com/app/google-maps/id585027354', android: 'https://play.google.com/store/apps/details?id=com.google.android.apps.maps' },
  { id: 'translate', name: 'Google Translate', use: '기사님·식당 직원과 번역', ios: 'https://apps.apple.com/app/google-translate/id414706506', android: 'https://play.google.com/store/apps/details?id=com.google.android.apps.translate' },
  { id: 'uber', name: 'Uber', use: '목적지가 입력된 택시 호출', ios: 'https://apps.apple.com/app/uber-request-a-ride/id368677368', android: 'https://play.google.com/store/apps/details?id=com.ubercab' },
  { id: '55688', name: '55688', use: '대만 현지 택시 호출 대안', ios: 'https://apps.apple.com/tw/search?term=55688', android: 'https://play.google.com/store/search?q=55688&c=apps' },
  { id: 'line-go', name: 'LINE GO', use: 'LINE 기반 택시 호출 대안', ios: 'https://apps.apple.com/tw/search?term=LINE%20GO', android: 'https://play.google.com/store/search?q=LINE%20GO&c=apps' },
  { id: 'weather', name: 'Taiwan Weather', use: '대만 중앙기상서 공식 특보 확인', ios: 'https://www.cwa.gov.tw/V8/C/', android: 'https://www.cwa.gov.tw/V8/C/' },
  { id: 'flighty', name: 'Flighty', use: '항공편 지연과 게이트 변경 확인', ios: 'https://apps.apple.com/app/flighty-live-flight-tracker/id1358823008', android: 'https://www.flighty.com/' },
] as const

export const todayTaiwanCards = [
  { image: 'jiufen.webp', eyebrow: '오늘의 대만 한 장', title: '붉은 등불이 켜지는 지우펀', copy: '둘째 날 늦은 오후, 가장 대만다운 골목을 천천히 걸어요.', href: '#schedule/day-2' },
  { image: 'yehliu.webp', eyebrow: '오늘의 대만 한 장', title: '바다가 만든 예류의 바위', copy: '바닷바람이 강하면 욕심내지 않고 핵심 구역만 봅니다.', href: '#schedule/day-2' },
  { image: 'taipei-night.webp', eyebrow: '오늘의 대만 한 장', title: '타이베이 101의 마지막 밤', copy: '세 사람의 여행을 85층 저녁으로 기념합니다.', href: '#schedule/day-3' },
  { image: 'longshan.webp', eyebrow: '오늘의 대만 한 장', title: '불이 켜진 용산사', copy: '첫날 밤, 오래된 타이베이의 분위기를 만납니다.', href: '#schedule/day-1' },
  { image: 'shifen-lantern.webp', eyebrow: '오늘의 대만 한 장', title: '세 사람의 소원을 담은 풍등', copy: '스펀 철길 위에서 여행의 마음을 하늘로 띄워요.', href: '#schedule/day-2' },
  { image: 'xiaolongbao.webp', eyebrow: '오늘의 대만 한 장', title: '신생점에서 만나는 딤섬', copy: '점심 뒤 용캉제와 칭톈제까지 바로 걸어갑니다.', href: '#schedule/day-3' },
] as const
