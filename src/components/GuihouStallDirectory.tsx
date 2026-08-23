import { Check, ExternalLink, Heart, Search, UtensilsCrossed } from 'lucide-react'
import {
  GUIHOU_OFFICIAL_DIRECTORY,
  GUIHOU_OFFICIAL_SECOND_FLOOR,
  guihouCookStalls,
  guihouFreshStalls,
  type GuihouFreshCategory,
} from '../data/guihouMarket'

const categoryLabels: Record<GuihouFreshCategory | 'all', string> = {
  all: '전체', sashimi: '사시미', 'live-fish': '활어', squid: '오징어·소프트',
  crustacean: '새우·갑각류', shellfish: '조개', crab: '게', dry: '건어물',
}

interface FreshDirectoryProps {
  filter: GuihouFreshCategory | 'all'
  query: string
  shortlist: number[]
  selected: number[]
  onFilter: (value: GuihouFreshCategory | 'all') => void
  onQuery: (value: string) => void
  onToggleShortlist: (id: number) => void
  onToggleSelected: (id: number) => void
}

export function GuihouFreshDirectory({ filter, query, shortlist, selected, onFilter, onQuery, onToggleShortlist, onToggleSelected }: FreshDirectoryProps) {
  const normalized = query.trim().toLowerCase()
  const visible = guihouFreshStalls.filter((stall) => (filter === 'all' || stall.categories.includes(filter))
    && (!normalized || String(stall.id).includes(normalized) || stall.name.toLowerCase().includes(normalized) || stall.summary.toLowerCase().includes(normalized)))

  return (
    <section className="guihou-directory" aria-labelledby="guihou-fresh-directory-title">
      <header className="guihou-section-heading">
        <span>1F · VERIFIED DIRECTORY</span>
        <h2 id="guihou-fresh-directory-title">32곳을 번호 그대로 찾아보기</h2>
        <p>공식 번호는 연속되지 않습니다. 이 목록은 위치를 표현하지 않는 비공간형 디렉터리예요.</p>
      </header>
      <div className="guihou-directory-tools">
        <label className="guihou-search" htmlFor="guihou-stall-search"><Search aria-hidden="true" /><span>점포 검색</span><input id="guihou-stall-search" type="search" aria-label="점포 검색" value={query} placeholder="17, 船釣, 生魚片" onChange={(event) => onQuery(event.target.value)} /></label>
        <div className="guihou-filter-row" role="group" aria-label="1층 점포 종류 필터">
          {(Object.keys(categoryLabels) as Array<GuihouFreshCategory | 'all'>).map((category) => <button type="button" className={filter === category ? 'is-active' : ''} aria-pressed={filter === category} onClick={() => onFilter(category)} key={category}>{categoryLabels[category]}</button>)}
        </div>
      </div>
      <div className="guihou-directory-status" aria-live="polite"><strong>{visible.length}곳</strong><span>확인 2026-08-23 · 2027 재확인 필요</span><a href={GUIHOU_OFFICIAL_DIRECTORY} target="_blank" rel="noreferrer">공식 지도 열기 <ExternalLink aria-hidden="true" /></a></div>
      <div className="guihou-stall-grid">
        {visible.map((stall) => {
          const saved = shortlist.includes(stall.id)
          const chosen = selected.includes(stall.id)
          return (
            <article className={`guihou-stall-card ${stall.featured ? 'is-featured' : ''} ${chosen ? 'is-selected' : ''}`} key={stall.id}>
              <div className="guihou-stall-card__number" aria-label={`공식 ${stall.id}번 점포`}>{stall.id}</div>
              <div className="guihou-stall-card__copy">
                {stall.featured && <small>민성 1차 후보</small>}
                <h3 lang="zh-Hant">{stall.name}</h3>
                <p>{stall.summary}</p>
                <div className="guihou-stall-card__tags">{stall.categories.map((category) => <span key={category}>{categoryLabels[category]}</span>)}</div>
                <dl><div><dt>휴무</dt><dd>{stall.closure}</dd></div>{stall.phone && <div><dt>전화</dt><dd>{stall.phone}</dd></div>}</dl>
                {stall.caution && <p className="guihou-stall-card__caution">재확인 · {stall.caution}</p>}
              </div>
              <div className="guihou-stall-card__actions">
                <button type="button" className={saved ? 'is-saved' : ''} aria-pressed={saved} onClick={() => onToggleShortlist(stall.id)}><Heart aria-hidden="true" /> {saved ? '후보 저장됨' : '후보 찜'}</button>
                <button type="button" className={chosen ? 'is-selected' : ''} aria-pressed={chosen} onClick={() => onToggleSelected(stall.id)}><Check aria-hidden="true" /> {chosen ? '선택됨' : '여기서 고르기'}</button>
              </div>
            </article>
          )
        })}
      </div>
      {visible.length === 0 && <p className="guihou-empty">검색 결과가 없어요. 번호나 번체 상호를 다시 확인해 주세요.</p>}
    </section>
  )
}

export function GuihouCookDirectory({ selected, onSelect }: { selected?: number; onSelect: (id: number) => void }) {
  return (
    <section className="guihou-directory guihou-directory--cook" aria-labelledby="guihou-cook-directory-title">
      <header className="guihou-section-heading">
        <span>2F · OFFICIAL STALL NUMBERS</span>
        <h2 id="guihou-cook-directory-title">조리점 12곳</h2>
        <p>4번은 없습니다. 대객조리·조리비·좌석 안내는 주문 전에 현장에서 확인하세요.</p>
      </header>
      <div className="guihou-directory-status"><strong>12곳</strong><span>확인 2026-08-23 · 2027 재확인 필요</span><a href={GUIHOU_OFFICIAL_SECOND_FLOOR} target="_blank" rel="noreferrer">공식 안내 <ExternalLink aria-hidden="true" /></a></div>
      <div className="guihou-cook-grid">
        {guihouCookStalls.map((stall) => (
          <button type="button" className={selected === stall.id ? 'is-selected' : ''} aria-pressed={selected === stall.id} onClick={() => onSelect(stall.id)} key={stall.id}>
            <span>{stall.id}</span>
            <div><h3 lang="zh-Hant">{stall.name}</h3><p>{stall.summary}</p><small>휴무: {stall.closure}{stall.partnerFreshStalls?.length ? ` · 1층 ${stall.partnerFreshStalls.join('·')}번 연계` : ''}</small>{stall.needsRecheck && <em>현장 재확인</em>}</div>
            <UtensilsCrossed aria-hidden="true" />
          </button>
        ))}
      </div>
    </section>
  )
}
