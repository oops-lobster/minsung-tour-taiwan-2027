export type GuihouFreshCategory = 'sashimi' | 'live-fish' | 'squid' | 'crustacean' | 'shellfish' | 'crab' | 'dry'

export interface GuihouFreshStall {
  id: number
  name: string
  summary: string
  categories: GuihouFreshCategory[]
  closure: string
  phone?: string
  featured?: boolean
  caution?: string
  lastVerified: string
  source: string
}

export interface GuihouCookStall {
  id: number
  name: string
  summary: string
  closure: string
  partnerFreshStalls?: number[]
  needsRecheck?: boolean
  lastVerified: string
  source: string
}

export interface GuihouSource {
  id: string
  group: '시장 공식' | '신베이시 정부' | '시설·도면' | '계절·브랜드'
  title: string
  note: string
  url: string
}

export const GUIHOU_LAST_VERIFIED = '2026-08-23'
export const GUIHOU_VISIT_DATE = '2027-02-21'
export const GUIHOU_OFFICIAL_DIRECTORY = 'https://www.guihoufishermarket.tw/first-floor-guide/'
export const GUIHOU_OFFICIAL_SECOND_FLOOR = 'https://www.guihoufishermarket.tw/second-floor-guide/'
export const GUIHOU_MAP_QUERY = '龜吼漁夫市集 新北市萬里區漁澳16號前方'

const marketSource = 'https://www.guihoufishermarket.tw/first-floor-guide/'
const brandSource = 'https://wanlicrab.tw/buy-wanlicrab/turtle-roar-fishermen-market'

export const guihouFreshStalls: GuihouFreshStall[] = [
  { id: 1, name: '吾家海產', summary: '활게와 소라·조개류 중심', categories: ['shellfish', 'crab', 'crustacean'], closure: '월요일', lastVerified: GUIHOU_LAST_VERIFIED, source: marketSource },
  { id: 2, name: '小豬水產', summary: '성게·굴·조개와 갑각류', categories: ['shellfish', 'crustacean', 'crab'], closure: '표기상 없음', lastVerified: GUIHOU_LAST_VERIFIED, source: marketSource },
  { id: 3, name: '大發海鮮', summary: '현지 어선의 제철 생선과 해산물', categories: ['live-fish', 'squid', 'crab'], closure: '목·금요일 · 게철 변동', lastVerified: GUIHOU_LAST_VERIFIED, source: marketSource },
  { id: 5, name: '上漁海鮮', summary: '제철 생선·오징어·조개류', categories: ['live-fish', 'squid', 'shellfish', 'crab'], closure: '표기상 없음', lastVerified: GUIHOU_LAST_VERIFIED, source: marketSource },
  { id: 6, name: '阿英現撈活海鮮', summary: '손낚시 생선과 제철 활해산물', categories: ['live-fish', 'crab'], closure: '비정기', lastVerified: GUIHOU_LAST_VERIFIED, source: marketSource },
  { id: 7, name: '尋', summary: '해산물 건어물·간식·음료', categories: ['dry'], closure: '비정기', lastVerified: GUIHOU_LAST_VERIFIED, source: marketSource },
  { id: 8, name: '邱哥活海鮮', summary: '게·오징어·굴과 제철 생선', categories: ['live-fish', 'squid', 'shellfish', 'crab'], closure: '표기상 없음', lastVerified: GUIHOU_LAST_VERIFIED, source: marketSource },
  { id: 9, name: '富誠水產', summary: '활게 중심 수산점', categories: ['crab', 'crustacean'], closure: '비정기 · 어획에 따라', lastVerified: GUIHOU_LAST_VERIFIED, source: marketSource },
  { id: 10, name: '順吉萬里蟹 現釣活魚·活軟絲', summary: '활어·활소프트·새우와 게', categories: ['live-fish', 'squid', 'crustacean', 'crab'], closure: '표기상 없음', lastVerified: GUIHOU_LAST_VERIFIED, source: marketSource },
  { id: 11, name: '小惠海產', summary: '손낚시 활어와 제철 수산물', categories: ['live-fish', 'squid', 'crustacean', 'crab'], closure: '비정기', lastVerified: GUIHOU_LAST_VERIFIED, source: marketSource },
  { id: 12, name: '興生魚片鮮魚坊', summary: '20년 이상 경력의 사시미 전문점', categories: ['sashimi', 'live-fish'], closure: '비정기', phone: '0983-057-650', featured: true, caution: '공식 자료는 포장 전용으로 안내 · 2층 반입 가능 여부 재확인', lastVerified: GUIHOU_LAST_VERIFIED, source: brandSource },
  { id: 13, name: '阿姑ㄟ祝福', summary: '건어물·해산물 간식·음료', categories: ['dry'], closure: '표기상 없음', lastVerified: GUIHOU_LAST_VERIFIED, source: marketSource },
  { id: 15, name: '寬哥萬里蟹活海鮮', summary: '활게·성게·소라·새우류', categories: ['shellfish', 'crustacean', 'crab'], closure: '표기상 없음', lastVerified: GUIHOU_LAST_VERIFIED, source: marketSource },
  { id: 16, name: '均衡海鮮萬里蟹', summary: '활게·전복 등 제철 해산물', categories: ['shellfish', 'crustacean', 'crab'], closure: '표기상 없음', lastVerified: GUIHOU_LAST_VERIFIED, source: marketSource },
  { id: 17, name: '船釣生魚片', summary: '손낚시·제철 생선 사시미와 입식 바', categories: ['sashimi', 'live-fish', 'squid'], closure: '화·수요일', phone: '0963-338-689', featured: true, caution: '10:30–17:30 표기 · 연어 제외 요청을 먼저 하기', lastVerified: GUIHOU_LAST_VERIFIED, source: brandSource },
  { id: 18, name: '尚益漁產行 阿雪新鮮漁貨', summary: '손낚시 생선·오징어·소형 어종', categories: ['live-fish', 'squid', 'crab'], closure: '표기상 없음', lastVerified: GUIHOU_LAST_VERIFIED, source: marketSource },
  { id: 19, name: '錢春海鮮', summary: '생선·새우·굴·조개류', categories: ['live-fish', 'crustacean', 'shellfish', 'crab'], closure: '비정기', lastVerified: GUIHOU_LAST_VERIFIED, source: marketSource },
  { id: 20, name: '阿宏 萬里蟹 現釣活魚', summary: '손낚시 생선·오징어·조개류', categories: ['live-fish', 'squid', 'shellfish', 'crab'], closure: '표기상 없음', lastVerified: GUIHOU_LAST_VERIFIED, source: marketSource },
  { id: 21, name: '小翔海產 萬里蟹 海膽軟絲', summary: '성게·소프트·손낚시 생선', categories: ['live-fish', 'squid', 'shellfish', 'crab'], closure: '표기상 없음', lastVerified: GUIHOU_LAST_VERIFIED, source: marketSource },
  { id: 22, name: '練家班烤魷魚', summary: '구운 오징어와 해산물 간식', categories: ['squid', 'dry'], closure: '표기상 없음', lastVerified: GUIHOU_LAST_VERIFIED, source: marketSource },
  { id: 23, name: '阿標海產萬里蟹', summary: '생선·오징어·조개·활게', categories: ['live-fish', 'squid', 'shellfish', 'crab'], closure: '수요일 · 게철 변동', lastVerified: GUIHOU_LAST_VERIFIED, source: marketSource },
  { id: 25, name: '阿玉自產萬里蟹活海鮮', summary: '어선 직송 활어·연체류·게', categories: ['live-fish', 'squid', 'crab'], closure: '표기상 없음', lastVerified: GUIHOU_LAST_VERIFIED, source: marketSource },
  { id: 26, name: '石花嬤海鮮乾貨', summary: '석화 젤리 음료와 건어물', categories: ['dry'], closure: '비정기', lastVerified: GUIHOU_LAST_VERIFIED, source: marketSource },
  { id: 27, name: '小微活海鮮萬里蟹', summary: '활어·새우·조개·소프트와 게', categories: ['live-fish', 'squid', 'crustacean', 'shellfish', 'crab'], closure: '비정기', lastVerified: GUIHOU_LAST_VERIFIED, source: marketSource },
  { id: 28, name: '漁進萬里蟹專賣店', summary: '어선 직송 활게 전문', categories: ['crab', 'crustacean'], closure: '표기상 없음', lastVerified: GUIHOU_LAST_VERIFIED, source: marketSource },
  { id: 29, name: '阿達仔活海鮮', summary: '활어·새우·오징어·조개류', categories: ['live-fish', 'squid', 'crustacean', 'shellfish', 'crab'], closure: '목요일', lastVerified: GUIHOU_LAST_VERIFIED, source: marketSource },
  { id: 30, name: '海味小卷片魷魚絲', summary: '오징어·소형 오징어 건어물', categories: ['squid', 'dry'], closure: '표기상 없음', lastVerified: GUIHOU_LAST_VERIFIED, source: marketSource },
  { id: 31, name: '龍元水產行', summary: '활게·굴·조개류 · 2층 2번 연계', categories: ['crustacean', 'shellfish', 'crab'], closure: '비정기 · 게가 있을 때', phone: '0911-032-677', featured: true, caution: '2월에는 게보다 오늘 좋은 생선을 먼저 보기', lastVerified: GUIHOU_LAST_VERIFIED, source: brandSource },
  { id: 32, name: '協興168自產自銷萬里蟹', summary: '어선 직송 활게·소라·생선', categories: ['live-fish', 'shellfish', 'crab'], closure: '비정기', lastVerified: GUIHOU_LAST_VERIFIED, source: marketSource },
  { id: 33, name: '姐妹活海鮮', summary: '활어·오징어·새우·조개류', categories: ['live-fish', 'squid', 'crustacean', 'shellfish', 'crab'], closure: '비정기', lastVerified: GUIHOU_LAST_VERIFIED, source: marketSource },
  { id: 35, name: '黑仔魚市', summary: '손낚시 생선·성게·활새우', categories: ['live-fish', 'crustacean', 'shellfish', 'crab'], closure: '표기상 없음', lastVerified: GUIHOU_LAST_VERIFIED, source: marketSource },
  { id: 36, name: '阿鈴活海鮮', summary: '활어·오징어·새우·조개류', categories: ['live-fish', 'squid', 'crustacean', 'shellfish', 'crab'], closure: '비정기', lastVerified: GUIHOU_LAST_VERIFIED, source: marketSource },
]

const secondFloorSource = 'https://www.guihoufishermarket.tw/second-floor-guide/'

export const guihouCookStalls: GuihouCookStall[] = [
  { id: 1, name: '協昌本港海鮮料理', summary: '현지 어가 운영 · 오징어·소프트와 기본 해산물 조리', closure: '금요일', partnerFreshStalls: [15, 18], lastVerified: GUIHOU_LAST_VERIFIED, source: secondFloorSource },
  { id: 2, name: '99蟹老闆', summary: '현지 수산 경험을 바탕으로 한 해산물 조리점', closure: '표기상 없음', partnerFreshStalls: [31], lastVerified: GUIHOU_LAST_VERIFIED, source: secondFloorSource },
  { id: 3, name: '阿香海鮮.肉包子', summary: '해산물 조리 · 현장 메뉴와 조리 가능 품목 확인', closure: '화요일', needsRecheck: true, lastVerified: GUIHOU_LAST_VERIFIED, source: secondFloorSource },
  { id: 5, name: '合作海鮮料理', summary: '현지 어가 운영 · 소형 오징어와 생선 조리', closure: '화요일', needsRecheck: true, lastVerified: GUIHOU_LAST_VERIFIED, source: secondFloorSource },
  { id: 6, name: '烤魚達人', summary: '생선·오징어·조개류 구이와 찜', closure: '수요일', lastVerified: GUIHOU_LAST_VERIFIED, source: secondFloorSource },
  { id: 7, name: '麗鮮', summary: '생선·오징어 중심의 가족식 해산물 조리', closure: '수요일', lastVerified: GUIHOU_LAST_VERIFIED, source: secondFloorSource },
  { id: 8, name: '三十川', summary: '현장 사시미와 해산물 요리', closure: '목요일', needsRecheck: true, lastVerified: GUIHOU_LAST_VERIFIED, source: secondFloorSource },
  { id: 9, name: '揚洋海鮮', summary: '찜·볶음과 향이 강한 조리까지 현장 선택', closure: '표기상 없음', lastVerified: GUIHOU_LAST_VERIFIED, source: secondFloorSource },
  { id: 10, name: '海韻海鮮熱炒', summary: '현지 어가식 해산물 볶음과 조리', closure: '목요일', lastVerified: GUIHOU_LAST_VERIFIED, source: secondFloorSource },
  { id: 11, name: '阿標海產萬里蟹', summary: '기본 조리 중심 · 1층 23번과 연계', closure: '수요일', partnerFreshStalls: [23], lastVerified: GUIHOU_LAST_VERIFIED, source: secondFloorSource },
  { id: 12, name: '露露海鮮', summary: '오랜 조리 경력의 해산물·옛식 메뉴', closure: '금요일', lastVerified: GUIHOU_LAST_VERIFIED, source: secondFloorSource },
  { id: 13, name: '蟹滿客', summary: '해산물 조리 · 1층 8번과 연계', closure: '화요일', partnerFreshStalls: [8], lastVerified: GUIHOU_LAST_VERIFIED, source: secondFloorSource },
]

export const guihouOperationSteps = [
  ['도착', '화장실과 엘리베이터 위치부터 확인'],
  ['한 바퀴', '바로 사지 말고 1층을 먼저 둘러보기'],
  ['후보', '사시미 2곳과 생선·오징어·새우 후보 찜'],
  ['단가', '台斤 또는 kg 기준 단가 확인'],
  ['무게', '손질 전 실제 무게 확인'],
  ['재료값', '해산물 자체 가격 확인'],
  ['조리비', '2층 조리 방식과 비용 확인'],
  ['총액', '재료값·조리비를 모두 합쳐 확인'],
  ['OK', '합의한 뒤에만 손질·조리 시작'],
  ['2층', '조리점과 바다 보이는 자리 운영 확인'],
  ['출발', '식사 → 화장실 → 스펀 이동'],
] as const

export const guihouSources: GuihouSource[] = [
  { id: 'market', group: '시장 공식', title: '龜吼漁夫市集 공식 사이트', note: '시장 개요·주소·10:00–18:00 안내', url: 'https://www.guihoufishermarket.tw/' },
  { id: 'market-1f', group: '시장 공식', title: '1층 공식 점포 안내', note: '32개 공식 점포번호·상호 스냅샷', url: GUIHOU_OFFICIAL_DIRECTORY },
  { id: 'market-2f', group: '시장 공식', title: '2층 공식 점포 안내', note: '12개 공식 점포번호·상호 스냅샷', url: GUIHOU_OFFICIAL_SECOND_FLOOR },
  { id: 'opening-1', group: '신베이시 정부', title: '신시장 개장 전 안내', note: '1층 32곳·2층 12곳·바다 전망 구조', url: 'https://www.ntpc.gov.tw/ch/home.jsp?dataserno=202504240010&id=28' },
  { id: 'opening-2', group: '신베이시 정부', title: '2025-04-27 공식 개장', note: '전망 플랫폼과 새 시장 운영', url: 'https://www.ntpc.gov.tw/ch/home.jsp?dataserno=202504270007&id=28' },
  { id: 'faq', group: '신베이시 정부', title: '신베이시 어업처 FAQ', note: '10:30–17:30·화/수 휴무 표기 · 공식 사이트와 충돌', url: 'https://fishery.ntpc.gov.tw/cht/index.php?code=list&ids=39' },
  { id: 'facility-a', group: '시설·도면', title: '시장 시설 참고 자료', note: '시설 사실만 참고 · 원본 도면은 복제하지 않음', url: 'https://www.agriculture.ntpc.gov.tw/uploadfiles/annex/20250710080138_1.pdf' },
  { id: 'facility-b', group: '시설·도면', title: '어항·시장 계획 자료', note: '편의시설·구조 재확인용', url: 'https://fishery.ntpc.gov.tw/upload/cht/attachment/a451c416c2cc2ace724088d4eabe9798.pdf' },
  { id: 'brand', group: '계절·브랜드', title: '萬里蟹 공식 점포 디렉터리', note: '점포별 취급 품목과 연계 정보', url: brandSource },
  { id: 'february', group: '계절·브랜드', title: '2026년 2월 계절 참고', note: '花蟹·야생 새우·조개·그루퍼 소개 · 2027 보장 아님', url: 'https://fishery.ntpc.gov.tw/cht/index.php?article_id=2610&code=list&flag=detail&ids=20' },
  { id: 'crab-season', group: '계절·브랜드', title: '萬里蟹 공식 산기', note: '9월–이듬해 1월 · 2월은 피크 밖', url: 'https://www.agriculture.ntpc.gov.tw/information.php?p_id=44' },
]

export const guihouRecheckItems = [
  '2027-02-21 일요일 실제 영업 여부와 특별휴장',
  '1층 12·17번 사시미 점포의 현재 운영',
  '2층 조리점 명단과 대객조리 가능 여부',
  '조리비와 바다 보이는 좌석 안내 방식',
  '주차·승하차 위치와 시장 개장 시간',
  '당일 바람·비·어획 상황',
] as const
