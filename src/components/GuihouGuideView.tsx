import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowLeft,
  Calculator,
  Check,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Fish,
  Gauge,
  Languages,
  MapPinned,
  RotateCcw,
  Search,
  Shell,
  ShieldCheck,
  Sparkles,
  TimerReset,
  UtensilsCrossed,
  Waves,
} from 'lucide-react'
import {
  GUIHOU_MAP_QUERY,
  guihouOperationSteps,
  guihouRecheckItems,
  guihouSources,
  type GuihouFreshCategory,
} from '../data/guihouMarket'
import { googleMapsUrl } from '../lib/paths'
import { useGuihouFieldSession } from '../lib/useGuihouFieldSession'
import { GuihouFloorMap } from './GuihouFloorMap'
import { GuihouPhrasebook } from './GuihouPhrasebook'
import { GuihouPriceCalculator } from './GuihouPriceCalculator'
import { GuihouCookDirectory, GuihouFreshDirectory } from './GuihouStallDirectory'
import { YehliuOfflineStatus } from './YehliuOfflineStatus'

type GuihouTab = 'operation' | 'fresh' | 'cook' | 'coach' | 'price' | 'language' | 'sources'

const tabs: Array<{ id: GuihouTab; label: string; route?: string }> = [
  { id: 'operation', label: '작전 순서' },
  { id: 'fresh', label: '1층 고르기', route: 'buy' },
  { id: 'cook', label: '2층 먹기', route: 'map' },
  { id: 'coach', label: '생선 보는 법', route: 'fish' },
  { id: 'price', label: '가격 계산', route: 'price' },
  { id: 'language', label: '현장 중국어', route: 'language' },
  { id: 'sources', label: '출처·재확인', route: 'sources' },
]

const routeToTab: Record<string, GuihouTab> = { buy: 'fresh', map: 'cook', fish: 'coach', price: 'price', language: 'language', sources: 'sources', operation: 'operation' }
const mealPlan = ['제철 사시미', '가능하면 니기리 6–10피스', '오징어·소프트 또는 새우', '당일 좋은 생선 한 마리 · 찜 또는 구이', '채소', '국']

function MarketTimer({ startedAt, onStart }: { startedAt?: string; onStart: () => void }) {
  const [, force] = useState(0)
  useEffect(() => {
    if (!startedAt) return undefined
    const id = window.setInterval(() => force((value) => value + 1), 30_000)
    return () => window.clearInterval(id)
  }, [startedAt])
  const minutes = startedAt ? Math.max(0, Math.floor((Date.now() - new Date(startedAt).getTime()) / 60_000)) : 0

  return (
    <section className="guihou-timer" aria-labelledby="guihou-timer-title">
      <TimerReset aria-hidden="true" />
      <div><small>60–75 MINUTE FIELD WINDOW</small><h3 id="guihou-timer-title">시장 체류 타이머</h3>{startedAt ? <p aria-live="polite">시장 도착 후 <strong>{minutes}분</strong></p> : <p>시장에 들어갈 때 시작하세요.</p>}</div>
      <button type="button" onClick={onStart}>{startedAt ? '처음부터 다시' : '점심 작전 시작'}</button>
      <ol><li><strong>10분</strong> 한 바퀴</li><li><strong>10분</strong> 선택·가격 확인</li><li><strong>45–55분</strong> 조리·식사</li><li><strong>5분</strong> 화장실·출발</li></ol>
      {minutes >= 20 && <p className="guihou-timer__hint">점포 비교는 여기까지. 현재 후보 중 결정하고 2층으로 올라갈 시간입니다.</p>}
    </section>
  )
}

function OperationPanel({ field }: { field: ReturnType<typeof useGuihouFieldSession> }) {
  const { session, update, toggleStep, reset } = field
  const allDone = session.completedSteps.length === guihouOperationSteps.length
  const resetSession = () => { if (window.confirm('귀후어항의 찜·계산·체크 기록을 이 기기에서 모두 지울까요?')) reset() }

  return (
    <div className="guihou-operation-panel">
      <section className="guihou-rule-card"><ShieldCheck aria-hidden="true" /><div><small>TODAY'S RULE</small><h2>한 바퀴 보고 → 가격 확인 → 조리비 확인 → 결정</h2><strong>단가 → 무게 → 재료값 → 조리비 → 총액 → OK → 조리</strong></div></section>
      <div className="guihou-operation-grid">
        <section className="guihou-checklist" aria-labelledby="guihou-checklist-title">
          <header><div><small>LOCAL CHECKLIST</small><h2 id="guihou-checklist-title">현장 작전 순서</h2></div><button type="button" onClick={resetSession}><RotateCcw aria-hidden="true" /> 오늘 처음부터</button></header>
          <ol>
            {guihouOperationSteps.map(([label, description], index) => {
              const done = session.completedSteps.includes(index)
              const current = !allDone && session.currentStep === index
              return <li className={`${done ? 'is-done' : ''} ${current ? 'is-current' : ''}`} key={label}><label><input type="checkbox" checked={done} onChange={() => toggleStep(index)} /><span className="guihou-step-number">{done ? <Check aria-hidden="true" /> : index}</span><span><small>STEP {index}</small><strong>{label}</strong><em>{description}</em></span></label></li>
            })}
          </ol>
          {allDone && <p className="guihou-complete"><CheckCircle2 aria-hidden="true" /> 오늘 점심 작전 완료. 이제 스펀으로 이동해요.</p>}
        </section>
        <aside>
          <MarketTimer startedAt={session.timerStartedAt} onStart={() => update((current) => ({ ...current, timerStartedAt: new Date().toISOString() }))} />
          <section className="guihou-planning-target"><Clock3 aria-hidden="true" /><div><small>PLANNING TARGET · NOT A RESERVATION</small><h3>11시 전후 시장 진입 목표</h3><p>10:45 예류 차량 합류 목표 → 귀후어항 이동 → 60–75분 점심 → 화장실 → 스펀 출발</p></div></section>
        </aside>
      </div>

      <section className="guihou-hours-conflict" aria-labelledby="guihou-hours-title"><AlertTriangle aria-hidden="true" /><div><small>OFFICIAL SOURCES CONFLICT</small><h2 id="guihou-hours-title">공식 영업시간이 서로 달라요</h2><dl><div><dt>시장 공식 사이트</dt><dd>10:00–18:00 · 연중무휴, 점포별 휴무 상이</dd></div><div><dt>신베이시 어업처 FAQ</dt><dd>10:30–17:30 · 화·수 휴무, 어획에 따라 일부 영업</dd></div></dl><p>우리 방문은 2027-02-21 일요일. 출발 1주 전에 특별휴장과 실제 점포 영업을 다시 확인합니다.</p><div><a href="https://www.guihoufishermarket.tw/" target="_blank" rel="noreferrer">공식 시장 사이트 <ExternalLink aria-hidden="true" /></a><a href="https://fishery.ntpc.gov.tw/cht/index.php?code=list&ids=39" target="_blank" rel="noreferrer">어업처 FAQ <ExternalLink aria-hidden="true" /></a><a href="tel:+886926359278">시장 관리자 전화</a></div></div></section>

      <section className="guihou-meal-strategy" aria-labelledby="guihou-meal-title"><header><small>3 PEOPLE · NO SALMON SASHIMI</small><h2 id="guihou-meal-title">오늘 식사의 방향</h2><p>고가 갑각류보다 원물의 신선도와 항구 경험을 먼저 봅니다. 아래 구성은 주문 확정이 아니라 현장 가이드입니다.</p></header><div>{mealPlan.map((item, index) => <span key={item}><strong>{String.fromCharCode(65 + index)}</strong>{item}</span>)}</div><aside><Shell aria-hidden="true" /><div><h3>萬里蟹, 먹을까?</h3><p>2월은 9월–이듬해 1월의 피크 밖입니다. 먼저 오늘 좋은 생선을 보고, 花蟹가 활발하고 살이 차 있으며 가격도 합리적일 때 한 마리 찜을 고려해요.</p></div></aside></section>

      <section className="guihou-notes"><label htmlFor="guihou-notes"><span>현장 메모 · 이 기기에만 저장</span><textarea id="guihou-notes" rows={4} value={session.notes ?? ''} placeholder="후보 점포, 기사님과 합류 시간, 부모님 의견" onChange={(event) => update((current) => ({ ...current, notes: event.target.value }))} /></label></section>
      <YehliuOfflineStatus guideName="귀후어항" returnHref="#guide/guihou" />
    </div>
  )
}

function SeafoodCoach() {
  const guides = [
    ['통생선', '눈은 맑고 비교적 볼록한지, 아가미는 촉촉하고 붉거나 분홍빛인지, 살은 탄력이 있는지, 강한 암모니아·부패취가 없는지 봅니다.'],
    ['사시미', '얼음·냉장 관리, 표면 갈변과 과도한 물 고임을 보고 가능하면 주문 후 잘라주는 곳에서 “오늘 회로 좋은 생선”을 먼저 묻습니다.'],
    ['오징어·갑오징어', '표면 윤기, 눈과 몸통 상태, 지나치게 흐물거리지 않는지, 불쾌한 부패취가 없는지 확인합니다.'],
    ['활조개·게', '실제 움직임, 수조 상태, 무게 대비 속이 빈 느낌이 없는지 판매자와 함께 확인합니다.'],
  ]
  const questions = ['오늘 어떤 생선이 제일 신선해요?', '회로 먹는다면 어떤 게 좋아요?', '오늘 여기에서 들어온 건 뭐예요?', '이건 양식인가요, 자연산인가요?', '언제 들어온 생선이에요?']
  return <section className="guihou-coach" aria-labelledby="guihou-coach-title"><header className="guihou-section-heading"><span>SEAFOOD QUALITY COACH</span><h2 id="guihou-coach-title">아는 척보다 기본을 정확히</h2><p>외형은 선택 보조일 뿐, 생식 안전을 보장하지 않습니다.</p></header><div className="guihou-coach-grid">{guides.map(([title, copy]) => <article key={title}><Fish aria-hidden="true" /><h3>{title}</h3><p>{copy}</p></article>)}</div><aside className="guihou-raw-warning"><AlertTriangle aria-hidden="true" /><p><strong>외형만으로 raw-consumption safety를 보장할 수 없습니다.</strong> 회로 먹을 생선은 반드시 판매자에게 생식용인지 확인합니다.</p></aside><section className="guihou-good-fish"><div><Sparkles aria-hidden="true" /><h3>오늘 좋은 생선을 찾는 다섯 질문</h3></div><ol>{questions.map((question) => <li key={question}>{question}</li>)}</ol><a href="#guide/guihou/language">중국어 문장으로 열기 <Languages aria-hidden="true" /></a></section></section>
}

function SourcesPanel({ freshnessConfirmed, onConfirm }: { freshnessConfirmed: boolean; onConfirm: (checked: boolean) => void }) {
  const grouped = useMemo(() => {
    const groups = new Map<string, Array<(typeof guihouSources)[number]>>()
    guihouSources.forEach((source) => groups.set(source.group, [...(groups.get(source.group) ?? []), source]))
    return groups
  }, [])
  return <section className="guihou-sources" aria-labelledby="guihou-sources-title"><header className="guihou-section-heading"><span>SOURCE HIERARCHY · 2026-08-23</span><h2 id="guihou-sources-title">출처와 2027 재확인</h2><p>시장 공식 디렉터리 → 신베이시 정부 → 공식 브랜드 디렉터리 순으로 현재 사실을 판단했습니다.</p></header><section className="guihou-recheck"><AlertTriangle aria-hidden="true" /><div><h3>출발 1주 전 확인할 것</h3><ul>{guihouRecheckItems.map((item) => <li key={item}>{item}</li>)}</ul><label><input type="checkbox" checked={freshnessConfirmed} onChange={(event) => onConfirm(event.target.checked)} /><span>2027 최신 정보 확인 완료</span></label></div></section>{[...grouped.entries()].map(([group, sources]) => <section className="guihou-source-group" key={group}><h3>{group}</h3>{sources.map((source) => <a href={source.url} target="_blank" rel="noreferrer" key={source.id}><span><strong>{source.title}</strong><small>{source.note}</small></span><ExternalLink aria-hidden="true" /></a>)}</section>)}</section>
}

export function GuihouGuideView({ initialSection }: { initialSection?: string }) {
  const field = useGuihouFieldSession()
  const [tab, setTab] = useState<GuihouTab>(() => routeToTab[initialSection ?? ''] ?? 'operation')
  const [filter, setFilter] = useState<GuihouFreshCategory | 'all'>('all')
  const [query, setQuery] = useState('')
  const { session, update } = field
  const currentStep = guihouOperationSteps[session.currentStep] ?? guihouOperationSteps[10]

  const chooseTab = (next: GuihouTab) => {
    setTab(next)
    const route = tabs.find((item) => item.id === next)?.route
    window.history.replaceState(null, '', route ? `#guide/guihou/${route}` : '#guide/guihou')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <div className="guihou-guide">
      <header className="guihou-topbar"><a href="#schedule/day-2"><ArrowLeft aria-hidden="true" /> Day 2로</a><div><Fish aria-hidden="true" /><span><strong>민성투어</strong><small>GUIHOU FIELD GUIDE</small></span></div><a href={googleMapsUrl(GUIHOU_MAP_QUERY)} target="_blank" rel="noreferrer"><MapPinned aria-hidden="true" /> 지도</a></header>
      <main>
        <section className="guihou-hero" aria-labelledby="guihou-title"><div className="guihou-hero__waves" aria-hidden="true"><Waves /><Fish /><Shell /></div><div className="guihou-hero__copy"><span>MINSUNG'S FISH MARKET FIELD NOTES · 龜吼</span><h1 id="guihou-title">민성의 귀후어항<br />해산물 가이드</h1><p>고르고 · 확인하고 · 바다 보며 먹기</p><div className="guihou-hero__facts"><span><strong>1F</strong> 신선 수산물 32곳</span><span><strong>2F</strong> 조리점 12곳</span><span><Waves aria-hidden="true" /> 바다뷰 식사공간</span><span><Gauge aria-hidden="true" /> 엘리베이터 2대</span></div></div><aside><small>오늘의 원칙</small><strong>좋아 보인다고<br />바로 사지 않기</strong><p>한 바퀴 → 가격 → 조리비 → 결정</p></aside></section>

        <section className="guihou-current-step" aria-live="polite"><span>{session.completedSteps.length}/{guihouOperationSteps.length}</span><div><small>지금 할 일 · STEP {session.currentStep}</small><strong>{currentStep[0]}</strong><p>{currentStep[1]}</p></div><button type="button" onClick={() => chooseTab('operation')}>체크리스트</button></section>

        <nav className="guihou-tabs" aria-label="귀후어항 가이드 메뉴"><div>{tabs.map((item) => <button type="button" role="tab" className={tab === item.id ? 'is-active' : ''} aria-selected={tab === item.id} onClick={() => chooseTab(item.id)} key={item.id}>{item.label}</button>)}</div></nav>

        <div className="guihou-content" role="tabpanel">
          {tab === 'operation' && <OperationPanel field={field} />}
          {tab === 'fresh' && <GuihouFreshDirectory filter={filter} query={query} shortlist={session.shortlistedFreshStalls} selected={session.selectedFreshStalls} onFilter={setFilter} onQuery={setQuery} onToggleShortlist={field.toggleShortlist} onToggleSelected={field.toggleSelectedFresh} />}
          {tab === 'cook' && <><GuihouFloorMap /><section className="guihou-seat-strategy"><Waves aria-hidden="true" /><div><small>SEA-VIEW SEAT STRATEGY</small><h2>주문 전에 자리 안내 방식부터 확인</h2><ol><li>원하는 2층 조리점에 바다 보이는 자리가 가능한지 질문</li><li>자유석인지 점포 안내석인지 확인</li><li>자리와 조리비가 확인되면 주문</li></ol></div></section><GuihouCookDirectory selected={session.selectedCookStall} onSelect={(id) => update((current) => ({ ...current, selectedCookStall: current.selectedCookStall === id ? undefined : id }))} /></>}
          {tab === 'coach' && <SeafoodCoach />}
          {tab === 'price' && <GuihouPriceCalculator session={session} update={update} />}
          {tab === 'language' && <GuihouPhrasebook session={session} update={update} />}
          {tab === 'sources' && <SourcesPanel freshnessConfirmed={Boolean(session.freshnessConfirmed)} onConfirm={(checked) => update((current) => ({ ...current, freshnessConfirmed: checked }))} />}
        </div>
      </main>
      <div className="guihou-sticky-actions"><button type="button" className="is-primary" onClick={() => chooseTab('price')}><Calculator aria-hidden="true" /><span><small>단가·무게·조리비</small><strong>가격 계산</strong></span></button><button type="button" onClick={() => chooseTab('language')}><Languages aria-hidden="true" /><span><small>자르기 전에</small><strong>가격 확인 문장</strong></span></button></div>
    </div>
  )
}
