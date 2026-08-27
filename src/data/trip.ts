import type { PlaceId } from './localTools'
import type { GuideId } from './guides'
export { days } from './itinerary/index.ts'

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
  guideId?: GuideId
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
    detail: '글로벌25시콜리무진 · Genesis G90 Long Wheel Base 4인승',
    status: '예약 확정',
    tone: 'confirmed',
    icon: 'car',
  },
  {
    label: 'Day 1 공항 픽업',
    detail: '宇航富豪 · Mercedes-Benz 항공의자 차량',
    status: '예약 확정',
    tone: 'confirmed',
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
    status: '첫 예약금 송금 완료',
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
  { korean: '귀후어항 어시장', local: '龜吼漁夫市集', query: '龜吼漁夫市集', placeId: 'guihou' },
  { korean: '스펀 옛거리', local: '十分老街', query: 'Shifen Old Street', placeId: 'shifen-old-street' },
  { korean: '지우펀 옛거리', local: '九份老街', query: 'Jiufen Old Street', placeId: 'jiufen' },
  { korean: '아리주방', local: '阿理廚坊', query: '阿理廚坊 九份' },
  { korean: 'Golden Bar', local: '逸茶酒室 Golden Bar', query: '逸茶酒室 Golden Bar 九份' },
  { korean: '은하동 한식포차', local: '銀河洞 韓式pocha', query: '銀河洞 韓式pocha 台北' },
  { korean: '이란 전통예술센터 · Plan B', local: '宜蘭傳藝園區', query: '宜蘭傳藝園區 宜蘭縣五結鄉五濱路二段201號', placeId: 'yilan-traditional-arts' },
  { korean: '拾松 이란 본점 · Plan B', local: '拾松 宜蘭總店', query: '拾松 宜蘭總店 宜蘭縣宜蘭市女中路一段303號', placeId: 'shisong-yilan-main' },
  { korean: '日光山茶屋 · Plan B', local: '日光山茶屋', query: '日光山茶屋 宜蘭縣礁溪鄉興農路322巷6號', placeId: 'nikko-hill' },
  { korean: '화산1914 · Plan B 차량 종료', local: '華山1914文化創意產業園區', query: '華山1914文化創意產業園區 台北市中正區八德路一段1號', placeId: 'huashan-1914' },
  { korean: '북해어촌 항저우점 · Plan B 저녁', local: '北海漁村海鮮餐廳 台北杭州店', query: '北海漁村海鮮餐廳 台北杭州店 台北市中正區杭州南路一段8號', placeId: 'beihai-hangzhou' },
  { korean: '臺虎西門 · Plan B 선택 2차', local: '臺虎西門 Taihu Driftwood', query: '臺虎西門 Taihu Driftwood 台北市萬華區昆明街46號', placeId: 'taihu-driftwood' },
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
  { day: 'DAY 2', breakfast: 'Taipei Garden Hotel 조식', lunch: '龜吼漁夫市集 · 제철 사시미·니기리·해산물 현장 선택', lunchPlaceId: 'guihou', dinner: '阿理廚坊 · 대만요리 + 고량주', dinnerPlaceId: 'jiufen', extra: 'Golden Bar 크래프트 맥주 · 은하동 한식포차 3차는 optional', extraPlaceId: 'jiufen' },
  { day: 'DAY 3', breakfast: '가벼운 맥모닝', lunch: '딘타이펑 신생점', lunchPlaceId: 'din-tai-fung-xinsheng', dinner: '85TD 메인 디너', dinnerPlaceId: '85td', extra: '시먼딩 또는 신이구 이자카야 · 현장 결정' },
  { day: 'DAY 4', breakfast: '현지식 또는 패스 가능', lunch: '肥前屋 / 비전옥 · 장어덮밥', lunchPlaceId: 'hizenya', dinner: '기내식', extra: '라운지에서 휴식' },
]
