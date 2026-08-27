export type GuideId =
  | 'yehliu'
  | 'guihou'
  | 'shifen-waterfall'
  | 'shifen-old-street'
  | 'huashan'
  | 'beihai-order'

export type GuideCategory = 'navigation' | 'order' | 'explanation' | 'curation'

export interface GuideDefinition {
  id: GuideId
  dayId: 'day-2'
  placeId: string
  title: string
  description: string
  kind: 'spa' | 'static-html'
  href: string
  offlineCapable: boolean
  priority: 'core' | 'optional'
  category: GuideCategory
}

export const guides: GuideDefinition[] = [
  {
    id: 'yehliu', dayId: 'day-2', placeId: 'yehliu', title: '예류 GPS·해설 가이드',
    description: '실제 위치와 관찰 순서를 보며 바위 지형을 놓치지 않게 돕습니다.',
    kind: 'spa', href: '#guide/yehliu', offlineCapable: true, priority: 'core', category: 'navigation',
  },
  {
    id: 'guihou', dayId: 'day-2', placeId: 'guihou', title: '귀후어항 현장 가이드',
    description: '1층 한 바퀴부터 가격·조리비 확인, 2층 식사까지 순서대로 안내합니다.',
    kind: 'spa', href: '#guide/guihou', offlineCapable: true, priority: 'core', category: 'order',
  },
  {
    id: 'shifen-waterfall', dayId: 'day-2', placeId: 'shifen-waterfall', title: '스펀폭포 짧은 해설',
    description: '폭포의 지형과 핵심 관람 포인트를 현장에서 간단히 읽습니다.',
    kind: 'static-html', href: 'shifen-waterfall.html', offlineCapable: true, priority: 'optional', category: 'explanation',
  },
  {
    id: 'shifen-old-street', dayId: 'day-2', placeId: 'shifen-old-street', title: '스펀 풍등·간식 가이드',
    description: '풍등 선택, 간식과 짧은 카페 휴식 기준을 한 화면에 모았습니다.',
    kind: 'static-html', href: 'shifen-old-street.html', offlineCapable: true, priority: 'optional', category: 'explanation',
  },
  {
    id: 'huashan', dayId: 'day-2', placeId: 'huashan-1914', title: '화산1914 큐레이션',
    description: 'Vinyl Decision을 중심으로 디자인 소품과 당일 팝업을 고르는 순서입니다.',
    kind: 'spa', href: '#guide/huashan', offlineCapable: true, priority: 'core', category: 'curation',
  },
  {
    id: 'beihai-order', dayId: 'day-2', placeId: 'beihai-hangzhou', title: '北海漁村 3인 주문 가이드',
    description: '직원에게 보여줄 주문 문장과 제철 게 업그레이드 원칙을 담았습니다.',
    kind: 'static-html', href: 'beihai-order-guide.html', offlineCapable: true, priority: 'core', category: 'order',
  },
]

export const guideById = Object.fromEntries(guides.map((guide) => [guide.id, guide])) as Record<GuideId, GuideDefinition>

export const resolveGuideHref = (guide: GuideDefinition) => (
  guide.kind === 'static-html' ? `${import.meta.env.BASE_URL}${guide.href}` : guide.href
)
