import { guides, type GuideCategory } from '../../data/guides'
import { GuideLauncher } from './GuideLauncher'

const groups: Array<{ id: GuideCategory; title: string; description: string }> = [
  { id: 'navigation', title: '현장에서 길 찾기', description: '현재 위치와 관찰 순서를 확인합니다.' },
  { id: 'order', title: '먹고 주문하기', description: '시장과 식당에서 바로 꺼내 쓰는 안내입니다.' },
  { id: 'explanation', title: '짧은 장소 해설', description: '부담 없이 읽는 핵심 포인트입니다.' },
  { id: 'curation', title: '문화공간 큐레이션', description: '취향과 체력에 맞춰 고르는 순서입니다.' },
]

export function GuideHub({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return <div className="guide-hub__compact">{guides.filter((guide) => guide.priority === 'core').map((guide) => <GuideLauncher guideId={guide.id} compact key={guide.id} />)}</div>
  }
  return (
    <section className="guide-hub section-pad" aria-labelledby="guide-hub-title">
      <div className="page-shell">
        <header className="guide-hub__heading"><small>FIELD GUIDES</small><h2 id="guide-hub-title">현장 가이드</h2><p>Day 2에서 필요한 해설과 주문 도구를 한곳에서 엽니다.</p></header>
        <div className="guide-hub__groups">
          {groups.map((group) => {
            const items = guides.filter((guide) => guide.category === group.id)
            return <section key={group.id}><header><h3>{group.title}</h3><p>{group.description}</p></header>{items.map((guide) => <GuideLauncher guideId={guide.id} key={guide.id} />)}</section>
          })}
        </div>
      </div>
    </section>
  )
}
