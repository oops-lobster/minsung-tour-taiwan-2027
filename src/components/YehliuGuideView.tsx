import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertTriangle, ArrowLeft, BookOpen, Check, ChevronLeft, ChevronRight, CircleHelp, Clock3,
  ExternalLink, Eye, Footprints, Glasses, MapPinned, Printer, RotateCcw, Search, ShieldAlert,
  Sparkles, TimerReset, Toilet,
} from 'lucide-react'
import {
  yehliuChecklist, yehliuGlossary, yehliuMilestones, yehliuQuiz, yehliuRouteModes, yehliuSafety,
  yehliuSources, yehliuStops, yehliuTimeline, type YehliuStopId,
} from '../data/yehliuGuide'
import { useYehliuFieldSession } from '../lib/useYehliuFieldSession'
import { imagePath } from '../lib/paths'
import { YehliuGpsNavigator } from './YehliuGpsNavigator'
import { YehliuOfflineStatus } from './YehliuOfflineStatus'
import { YehliuScienceDiagram } from './YehliuScienceDiagram'
import { YehliuSchematicMap } from './YehliuSchematicMap'

type GuideTab = 'route' | 'gps' | 'family' | 'science' | 'map' | 'safety'
const tabs: Array<{ id: GuideTab; label: string }> = [
  { id: 'route', label: '길 따라보기' }, { id: 'gps', label: 'GPS 내비' }, { id: 'family', label: '민성 해설' },
  { id: 'science', label: '과학 깊게' }, { id: 'map', label: '지도·화장실' }, { id: 'safety', label: '안전·출처' },
]

interface WakeLockLike {
  release: () => Promise<void>
  addEventListener?: (type: 'release', listener: () => void) => void
}
interface NavigatorWithWakeLock { wakeLock?: { request: (type: 'screen') => Promise<WakeLockLike> } }

export function YehliuGuideView({ initialSection }: { initialSection?: string }) {
  const field = useYehliuFieldSession()
  const { session } = field
  const [tab, setTab] = useState<GuideTab>(initialSection === 'gps' ? 'gps' : 'route')
  const [glossaryQuery, setGlossaryQuery] = useState('')
  const [externalNotice, setExternalNotice] = useState('')
  const [wakeLockActive, setWakeLockActive] = useState(false)
  const wakeLockRef = useRef<WakeLockLike | null>(null)
  const wakeLockWantedRef = useRef(false)
  const route = yehliuRouteModes.find((item) => item.id === session.routeId) ?? yehliuRouteModes[1]
  const activeStops = route.stopIds.map((stopId) => yehliuStops.find((stop) => stop.id === stopId)!).filter(Boolean)
  const selected = activeStops.find((stop) => stop.id === session.currentStopId) ?? activeStops[0]
  const currentIndex = Math.max(0, activeStops.findIndex((stop) => stop.id === selected.id))
  const observed = route.stopIds.filter((id) => session.visitedStopIds.includes(id)).length
  const handled = route.stopIds.filter((id) => session.visitedStopIds.includes(id) || session.skippedStopIds.includes(id)).length
  const observedProgress = Math.round(observed / route.stopIds.length * 100)
  const handledProgress = Math.round(handled / route.stopIds.length * 100)

  const filteredGlossary = useMemo(() => {
    const query = glossaryQuery.trim().toLocaleLowerCase()
    return query ? yehliuGlossary.filter((term) => [term.ko, term.zh, term.en, term.description].some((value) => value.toLocaleLowerCase().includes(query))) : yehliuGlossary
  }, [glossaryQuery])

  useEffect(() => {
    if (route.stopIds.includes(session.currentStopId)) return
    field.setCurrentStopId(route.stopIds[0])
  }, [field, route.stopIds, session.currentStopId])

  useEffect(() => {
    if (initialSection !== 'offline') return
    window.requestAnimationFrame(() => document.getElementById('yehliu-offline')?.scrollIntoView({ block: 'start' }))
  }, [initialSection])

  useEffect(() => {
    if (initialSection === 'gps') setTab('gps')
  }, [initialSection])

  const requestWakeLock = async () => {
    try {
      const api = (navigator as unknown as NavigatorWithWakeLock).wakeLock
      if (!api) throw new Error('이 브라우저에서는 지원하지 않습니다.')
      const sentinel = await api.request('screen')
      wakeLockRef.current = sentinel
      setWakeLockActive(true)
      sentinel.addEventListener?.('release', () => {
        wakeLockRef.current = null
        setWakeLockActive(false)
      })
    } catch (error) {
      setWakeLockActive(false)
      setExternalNotice(error instanceof Error ? `화면 켜짐 유지: ${error.message}` : '화면 켜짐 유지를 사용할 수 없습니다.')
    }
  }

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && wakeLockWantedRef.current && !wakeLockRef.current) void requestWakeLock()
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      void wakeLockRef.current?.release()
    }
  }, [])

  const toggleWakeLock = async () => {
    wakeLockWantedRef.current = !wakeLockWantedRef.current
    if (!wakeLockWantedRef.current) {
      await wakeLockRef.current?.release()
      wakeLockRef.current = null
      setWakeLockActive(false)
      return
    }
    await requestWakeLock()
  }

  const chooseTab = (nextTab: GuideTab) => {
    setTab(nextTab)
    const nextHash = nextTab === 'gps' ? '#guide/yehliu/gps' : '#guide/yehliu'
    if (window.location.hash !== nextHash) window.history.replaceState(null, '', nextHash)
    window.requestAnimationFrame(() => document.querySelector('.yehliu-guide__body')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  const chooseStop = (stopId: YehliuStopId) => {
    if (!route.stopIds.includes(stopId)) return
    setTab('route')
    field.setCurrentStopId(stopId)
    if (window.location.hash !== '#guide/yehliu') window.history.replaceState(null, '', '#guide/yehliu')
    window.requestAnimationFrame(() => {
      const card = document.getElementById('yehliu-stop-card')
      card?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      card?.focus({ preventScroll: true })
    })
  }

  const moveStop = (direction: -1 | 1) => chooseStop(activeStops[Math.min(activeStops.length - 1, Math.max(0, currentIndex + direction))].id)
  const resetProgress = () => {
    if (!window.confirm('예류 가이드의 관찰·건너뜀 기록을 모두 지울까요?')) return
    field.reset()
  }

  const showSource = (sourceId: string) => {
    setTab('safety')
    window.requestAnimationFrame(() => document.getElementById(`yehliu-source-${sourceId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }))
  }

  const openSource = (url: string) => {
    if (!navigator.onLine) {
      setExternalNotice('현재 오프라인이라 공식 외부 페이지는 열 수 없습니다. 저장된 가이드 내용은 그대로 사용할 수 있어요.')
      return
    }
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="yehliu-guide">
      <header className="yehliu-hero">
        <img className="yehliu-hero__image" src={imagePath('yehliu.webp')} alt="예류 해안의 기암과 푸른 바다" width="1600" height="1067" />
        <div className="yehliu-hero__wash" />
        <div className="page-shell yehliu-hero__content">
          <a className="yehliu-back" href="#schedule/day-2"><ArrowLeft size={18} aria-hidden="true" /> DAY 2 일정으로</a>
          <p className="yehliu-kicker">MINSUNG'S FIELD NOTES · 野柳</p>
          <h1>민성의 예류 지질 가이드</h1>
          <p className="yehliu-hero__lead">부모님께는 20초로 쉽게, 민성에게는 한 단계 깊게. 합류점 저장부터 10:45 복귀까지 이어지는 오프라인 현장 가이드입니다.</p>
          <div className="yehliu-hero__facts" aria-label="가이드 핵심 정보"><span><Clock3 aria-hidden="true" /> 09:20–10:45</span><span><Footprints aria-hidden="true" /> 표준 80–85분</span><span><Toilet aria-hidden="true" /> 화장실 3곳</span><span><ShieldAlert aria-hidden="true" /> 현장 안내 우선</span></div>
          <div className="yehliu-hero__actions"><button type="button" onClick={() => document.getElementById('yehliu-route-start')?.scrollIntoView({ behavior: 'smooth' })}><MapPinned size={19} aria-hidden="true" /> 가이드 시작</button><button className="is-secondary" type="button" onClick={toggleWakeLock} aria-pressed={wakeLockActive}><Eye size={19} aria-hidden="true" /> {wakeLockActive ? '화면 켜짐 유지 중' : '화면 켜짐 유지'}</button></div>
        </div>
      </header>

      <div className="yehliu-guide-tabs-wrap">
        <div className="yehliu-guide-tabs page-shell" role="tablist" aria-label="예류 가이드 메뉴">
          {tabs.map((item) => <button id={`yehliu-tab-${item.id}`} className={tab === item.id ? 'is-active' : ''} type="button" role="tab" aria-selected={tab === item.id} aria-controls={`yehliu-panel-${item.id}`} tabIndex={tab === item.id ? 0 : -1} onClick={() => chooseTab(item.id)} key={item.id}>{item.label}</button>)}
        </div>
      </div>

      <div className="page-shell yehliu-guide__body">
        <p className="sr-only" aria-live="polite">{externalNotice}</p>
        {externalNotice && <div className="yehliu-inline-notice"><AlertTriangle size={18} aria-hidden="true" />{externalNotice}<button type="button" onClick={() => setExternalNotice('')}>닫기</button></div>}

        <YehliuGpsNavigator field={field} display={tab === 'gps' ? 'full' : tab === 'route' ? 'launch' : 'hidden'} onOpenGps={() => chooseTab('gps')} onOpenGuide={chooseStop} />

        {tab === 'route' && <section id="yehliu-panel-route" role="tabpanel" aria-labelledby="yehliu-tab-route">
          <YehliuOfflineStatus focusOnMount={initialSection === 'offline'} />
          <section className="yehliu-precheck" aria-labelledby="yehliu-precheck-title"><div><span className="yehliu-section-kicker">BEFORE WE WALK</span><h2 id="yehliu-precheck-title">출발 전 30초 체크</h2><p>방문자센터 화장실부터 다녀오고, 바람과 부모님 컨디션에 맞춰 코스를 고릅니다.</p></div><ul>{yehliuChecklist.map((item) => <li key={item}><Check size={17} aria-hidden="true" />{item}</li>)}</ul></section>

          <section className="yehliu-route-picker" id="yehliu-route-start" aria-labelledby="yehliu-route-title"><div className="yehliu-section-heading"><span className="yehliu-section-kicker">CHOOSE OUR PACE</span><h2 id="yehliu-route-title">오늘의 걷는 속도</h2><p>표준 코스가 기본입니다. 이동·화장실·사진 대기와 차량 복귀까지 모두 포함한 시간입니다.</p></div><div className="yehliu-route-options">{yehliuRouteModes.map((mode) => <button className={session.routeId === mode.id ? 'is-active' : ''} type="button" aria-pressed={session.routeId === mode.id} onClick={() => field.setRouteId(mode.id)} key={mode.id}><span>{mode.label}</span><strong>{mode.time}</strong><small>{mode.description}</small>{mode.warning && <em>{mode.warning}</em>}</button>)}</div></section>

          <section className="yehliu-milestones" aria-labelledby="yehliu-milestones-title"><div><span className="yehliu-section-kicker">STANDARD FIELD CLOCK</span><h2 id="yehliu-milestones-title">10:20–10:25에는 구경보다 복귀</h2><p>여왕머리 정면 줄이 8–10분 이상이면 사진 줄은 생략하고 측면 관찰만 합니다.</p></div><ol>{yehliuMilestones.map(([time, label]) => <li key={time}><time>{time}</time><span>{label}</span></li>)}</ol></section>

          <section className="yehliu-progress" aria-label="예류 가이드 진행률"><div><span>관찰 완료</span><strong>{observed}/{route.stopIds.length}곳 · {observedProgress}%</strong><small>직접 함께 본 지점</small></div><div><span>코스 처리</span><strong>{handled}/{route.stopIds.length}곳 · {handledProgress}%</strong><small>관찰 + 건너뜀</small></div><div className="yehliu-progress__bar" role="progressbar" aria-valuemin={0} aria-valuemax={route.stopIds.length} aria-valuenow={handled} aria-label={`${route.stopIds.length}곳 중 ${handled}곳 처리`}><span style={{ width: `${handledProgress}%` }} /></div><button type="button" onClick={resetProgress}><RotateCcw size={16} aria-hidden="true" /> 초기화</button></section>

          <YehliuSchematicMap routeId={session.routeId} selectedStop={selected.id} visited={session.visitedStopIds} skipped={session.skippedStopIds} onSelectStop={chooseStop} />

          <article className="yehliu-stop-card" id="yehliu-stop-card" tabIndex={-1} aria-labelledby="yehliu-selected-stop-title">
            <header className="yehliu-stop-card__header"><div className={`yehliu-stop-number ${session.visitedStopIds.includes(selected.id) ? 'is-visited' : ''}`}>{session.visitedStopIds.includes(selected.id) ? <Check aria-hidden="true" /> : currentIndex + 1}</div><div><span>{selected.zone} · {selected.minutes}{!selected.autoArrival ? ' · 위치 근사' : ''}</span><h2 id="yehliu-selected-stop-title">{selected.title}</h2><p><span lang="zh-Hant">{selected.localName}</span> · {selected.englishName}</p></div></header>
            <section className="yehliu-parent-summary" aria-label="부모님 20초 해설"><span><Sparkles size={18} aria-hidden="true" /> 부모님께 20초</span><p>{selected.familySummary}</p></section>
            {selected.diagram && <YehliuScienceDiagram type={selected.diagram} />}
            <div className="yehliu-observe"><h3><Glasses size={20} aria-hidden="true" /> 여기서 같이 볼 것</h3><ul>{selected.observe.map((item) => <li key={item}>{item}</li>)}</ul></div>
            <section className="yehliu-science-note"><h3><BookOpen size={19} aria-hidden="true" /> 민성 해설 · 1분</h3><p>{selected.science}</p></section>
            <details className="yehliu-science-note" open={session.routeId === 'deep'}><summary><BookOpen size={19} aria-hidden="true" /> 더 깊게</summary><ul>{selected.deepDive.map((item) => <li key={item}>{item}</li>)}</ul>{selected.misconception && <p className="yehliu-misconception"><CircleHelp size={18} aria-hidden="true" /><span><strong>오해하지 않기</strong>{selected.misconception}</span></p>}{selected.safety && <p className="yehliu-stop-safety"><ShieldAlert size={18} aria-hidden="true" /><span><strong>이 지점 안전</strong>{selected.safety}</span></p>}<div className="yehliu-source-refs"><span>근거</span>{selected.sourceRefs.map((ref, index) => <button type="button" onClick={() => showSource(ref.sourceId)} key={`${ref.sourceId}-${index}`}>{ref.sourceId}{ref.pages ? ` · ${ref.pages}` : ref.section ? ` · ${ref.section}` : ''}</button>)}</div></details>
            <label className="yehliu-visited-toggle"><input type="checkbox" checked={session.visitedStopIds.includes(selected.id)} onChange={() => field.toggleVisited(selected.id)} /><span><Check aria-hidden="true" /></span>이 지점 함께 봤어요</label>
            <div className="yehliu-stop-nav"><button type="button" onClick={() => moveStop(-1)} disabled={currentIndex <= 0}><ChevronLeft aria-hidden="true" /> 이전</button><span>{currentIndex + 1} / {route.stopIds.length}</span><button type="button" onClick={() => moveStop(1)} disabled={currentIndex >= route.stopIds.length - 1}>다음 <ChevronRight aria-hidden="true" /></button></div>
          </article>
          <div className="yehliu-stop-jump" aria-label="해설 바로가기">{activeStops.map((stop, index) => <button className={selected.id === stop.id ? 'is-active' : ''} type="button" onClick={() => chooseStop(stop.id)} key={stop.id}><span>{session.visitedStopIds.includes(stop.id) ? <Check size={15} aria-hidden="true" /> : index + 1}</span>{stop.title}</button>)}</div>
        </section>}

        {tab === 'family' && <section className="yehliu-tab-section" id="yehliu-panel-family" role="tabpanel" aria-labelledby="yehliu-tab-family"><div className="yehliu-section-heading"><span className="yehliu-section-kicker">20-SECOND STORIES</span><h2>부모님께 이렇게 설명하면 돼</h2><p>선택한 코스에 포함된 지점만 순서대로 보여줍니다.</p></div><div className="yehliu-family-list">{activeStops.map((stop, index) => <article key={stop.id}><span>{index + 1}</span><div><small>{stop.zone} · <span lang="zh-Hant">{stop.localName}</span></small><h3>{stop.title}</h3><p>{stop.familySummary}</p></div><button type="button" onClick={() => chooseStop(stop.id)}>지도에서 보기</button></article>)}</div></section>}

        {tab === 'science' && <section className="yehliu-tab-section" id="yehliu-panel-science" role="tabpanel" aria-labelledby="yehliu-tab-science"><div className="yehliu-section-heading"><span className="yehliu-section-kicker">GEOLOGY IN FIVE MINUTES</span><h2>2천만 년을 5분에 이해하기</h2><p>퇴적·굳음·융기·풍화·침식이 이어진 현재진행형 풍경입니다.</p></div><ol className="yehliu-big-timeline">{yehliuTimeline.map((item, index) => <li key={item.time}><span>{index + 1}</span><div><small>{item.time}</small><h3>{item.title}</h3><p>{item.description}</p></div></li>)}</ol><div className="yehliu-glossary"><div className="yehliu-section-heading"><span className="yehliu-section-kicker">OFFLINE GLOSSARY</span><h2>한·중·영 지질 용어</h2></div><label className="yehliu-search"><Search aria-hidden="true" /><span className="sr-only">용어 검색</span><input value={glossaryQuery} onChange={(event) => setGlossaryQuery(event.target.value)} placeholder="해식대, 結核, sandstone…" /></label><div className="yehliu-glossary__list">{filteredGlossary.map((term) => <article key={term.ko}><h3>{term.ko}</h3><p><span lang="zh-Hant">{term.zh}</span> · {term.en}</p><small>{term.description}</small></article>)}{filteredGlossary.length === 0 && <p>일치하는 용어가 없습니다.</p>}</div></div><div className="yehliu-quiz"><div className="yehliu-section-heading"><span className="yehliu-section-kicker">FAMILY QUIZ</span><h2>답을 열기 전 같이 맞혀보기</h2></div>{yehliuQuiz.map((item, index) => <details key={item.question}><summary><span>Q{index + 1}</span>{item.question}</summary><p><strong>정답</strong>{item.answer}</p></details>)}</div></section>}

        {tab === 'map' && <section className="yehliu-tab-section" id="yehliu-panel-map" role="tabpanel" aria-labelledby="yehliu-tab-map"><div className="yehliu-section-heading"><span className="yehliu-section-kicker">MAP & RESTROOMS</span><h2>길과 화장실만 빠르게 보기</h2><p>선택 코스의 번호만 표시되며, 번호를 누르면 해설로 이동합니다.</p></div><YehliuSchematicMap routeId={session.routeId} selectedStop={selected.id} visited={session.visitedStopIds} skipped={session.skippedStopIds} onSelectStop={chooseStop} /><div className="yehliu-toilets"><article><Toilet aria-hidden="true" /><div><small>입장 전</small><h3>매표소 옆</h3><p>주차장 쪽에서 먼저 이용할 수 있는 화장실.</p></div></article><article><Toilet aria-hidden="true" /><div><small>출발점</small><h3>방문자센터 1층</h3><p>입장 직후 먼저 들르는 곳.</p></div></article><article><Toilet aria-hidden="true" /><div><small>제2구역</small><h3>Queen’s Bookstore 옆</h3><p>여왕머리 관람 뒤 복귀 전 이용.</p></div></article></div><button className="yehliu-print-button" type="button" onClick={() => window.print()}><Printer aria-hidden="true" /> 2쪽 현장 요약 인쇄</button></section>}

        {tab === 'safety' && <section className="yehliu-tab-section" id="yehliu-panel-safety" role="tabpanel" aria-labelledby="yehliu-tab-safety"><div className="yehliu-section-heading"><span className="yehliu-section-kicker">SAFETY FIRST</span><h2>현장 안내가 언제나 우선</h2><p>2027년 2월의 날씨·파도·통제 상황은 출발 일주일 전과 방문 당일 다시 확인합니다.</p></div><ul className="yehliu-safety-list">{yehliuSafety.map((item) => <li key={item}><ShieldAlert aria-hidden="true" />{item}</li>)}</ul><div className="yehliu-sources"><h2>설명 근거와 최종 확인처</h2>{yehliuSources.map((source) => <article id={`yehliu-source-${source.id}`} key={source.id}><span>{source.id}</span><div><h3>{source.title}</h3><p>{source.organization}</p><small>{source.scope} · 확인 {source.checked}</small></div><button type="button" onClick={() => openSource(source.url)}>공식 페이지 <ExternalLink size={16} aria-hidden="true" /></button></article>)}</div><aside className="yehliu-recheck"><TimerReset aria-hidden="true" /><div><h2>2027년 2월 재확인</h2><p>운영시간, 입장 동선, 제1·2구역 통제, 강풍·파도, 화장실 운영, 차량 합류 지점을 공식 사이트와 기사에게 다시 확인합니다.</p></div></aside></section>}
      </div>

      <section className="yehliu-print-guide" aria-hidden="true"><header><h1>민성의 예류 지질 가이드</h1><p>09:20 도착 · 10:20–10:25 복귀 시작 · 10:45 합류 · 10:50 절대 마지노선</p></header><div className="yehliu-print-route"><YehliuSchematicMap routeId="standard" selectedStop="visitor-center" visited={[]} onSelectStop={() => undefined} /></div><h2>Standard 80–85분 · 현장 순서</h2><ol>{yehliuRouteModes.find((item) => item.id === 'standard')!.stopIds.map((id, index) => { const stop = yehliuStops.find((item) => item.id === id)!; return <li key={id}><strong>{index + 1}. {stop.title}</strong><span>{stop.familySummary}</span></li> })}</ol><div className="yehliu-print-page-two"><h2>시간 milestone</h2><ol>{yehliuMilestones.map(([time, label]) => <li key={time}><strong>{time}</strong> {label}</li>)}</ol><h2>차량 합류점 메모</h2><p>차량번호/주차구역: __________________________________</p><h2>안전</h2><ul>{yehliuSafety.map((item) => <li key={item}>{item}</li>)}</ul><p>현장 공식 안내와 통제선이 우선입니다. 최신 가이드: https://oops-lobster.github.io/minsung-tour-taiwan-2027/#guide/yehliu</p></div></section>
    </div>
  )
}
