import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  ExternalLink,
  Eye,
  Footprints,
  Glasses,
  ListChecks,
  MapPinned,
  Printer,
  RotateCcw,
  Search,
  ShieldAlert,
  Sparkles,
  TimerReset,
  Toilet,
} from 'lucide-react'
import {
  yehliuChecklist,
  yehliuGlossary,
  yehliuQuiz,
  yehliuRouteModes,
  yehliuSafety,
  yehliuSources,
  yehliuStops,
  yehliuTimeline,
  type YehliuRouteId,
} from '../data/yehliuGuide'
import { YehliuOfflineStatus } from './YehliuOfflineStatus'
import { YehliuSchematicMap } from './YehliuSchematicMap'
import { imagePath } from '../lib/paths'

type GuideTab = 'route' | 'family' | 'science' | 'map' | 'safety'

const tabs: Array<{ id: GuideTab; label: string }> = [
  { id: 'route', label: '길 따라보기' },
  { id: 'family', label: '민성 해설' },
  { id: 'science', label: '과학 깊게' },
  { id: 'map', label: '지도·화장실' },
  { id: 'safety', label: '안전·출처' },
]

const visitedKey = 'minsung-yehliu-visited-v1'
const routeKey = 'minsung-yehliu-route-v1'

interface WakeLockLike {
  release: () => Promise<void>
}

interface NavigatorWithWakeLock {
  wakeLock?: { request: (type: 'screen') => Promise<WakeLockLike> }
}

export function YehliuGuideView({ initialSection }: { initialSection?: string }) {
  const [tab, setTab] = useState<GuideTab>('route')
  const [routeId, setRouteId] = useState<YehliuRouteId>(() => {
    const saved = window.localStorage.getItem(routeKey)
    return yehliuRouteModes.some((route) => route.id === saved) ? saved as YehliuRouteId : 'standard'
  })
  const [selectedStop, setSelectedStop] = useState(0)
  const [visited, setVisited] = useState<number[]>(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(visitedKey) ?? '[]')
      return Array.isArray(saved) ? saved.filter((value) => Number.isInteger(value)) : []
    } catch {
      return []
    }
  })
  const [glossaryQuery, setGlossaryQuery] = useState('')
  const [externalNotice, setExternalNotice] = useState('')
  const [wakeLockActive, setWakeLockActive] = useState(false)
  const wakeLockRef = useRef<WakeLockLike | null>(null)

  const route = yehliuRouteModes.find((item) => item.id === routeId) ?? yehliuRouteModes[1]
  const activeStops = route.stopIds.map((stopId) => yehliuStops.find((stop) => stop.id === stopId)!).filter(Boolean)
  const selected = yehliuStops.find((stop) => stop.id === selectedStop) ?? yehliuStops[0]
  const visitedInRoute = route.stopIds.filter((stopId) => visited.includes(stopId)).length
  const currentIndex = route.stopIds.indexOf(selectedStop)
  const progress = Math.round((visitedInRoute / route.stopIds.length) * 100)

  const filteredGlossary = useMemo(() => {
    const query = glossaryQuery.trim().toLocaleLowerCase()
    if (!query) return yehliuGlossary
    return yehliuGlossary.filter((term) => [term.ko, term.zh, term.en, term.description].some((value) => value.toLocaleLowerCase().includes(query)))
  }, [glossaryQuery])

  useEffect(() => {
    window.localStorage.setItem(visitedKey, JSON.stringify(visited))
  }, [visited])

  useEffect(() => {
    window.localStorage.setItem(routeKey, routeId)
    if (!route.stopIds.includes(selectedStop)) setSelectedStop(route.stopIds[0])
  }, [route, routeId, selectedStop])

  useEffect(() => {
    if (initialSection !== 'offline') return
    window.requestAnimationFrame(() => document.getElementById('yehliu-offline')?.scrollIntoView({ block: 'start' }))
  }, [initialSection])

  useEffect(() => () => {
    void wakeLockRef.current?.release()
  }, [])

  const chooseStop = (stopId: number) => {
    setTab('route')
    setSelectedStop(stopId)
    window.requestAnimationFrame(() => document.getElementById('yehliu-stop-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  const moveStop = (direction: -1 | 1) => {
    const nextIndex = Math.min(route.stopIds.length - 1, Math.max(0, currentIndex + direction))
    chooseStop(route.stopIds[nextIndex])
  }

  const toggleVisited = (stopId: number) => {
    setVisited((current) => current.includes(stopId) ? current.filter((id) => id !== stopId) : [...current, stopId])
  }

  const resetProgress = () => {
    if (!window.confirm('예류 가이드의 방문 체크를 모두 지울까요?')) return
    setVisited([])
    setSelectedStop(route.stopIds[0])
  }

  const toggleWakeLock = async () => {
    if (wakeLockRef.current) {
      await wakeLockRef.current.release()
      wakeLockRef.current = null
      setWakeLockActive(false)
      return
    }
    try {
      const wakeLock = (navigator as unknown as NavigatorWithWakeLock).wakeLock
      if (!wakeLock) throw new Error('이 브라우저에서는 지원하지 않습니다.')
      wakeLockRef.current = await wakeLock.request('screen')
      setWakeLockActive(true)
    } catch (error) {
      setExternalNotice(error instanceof Error ? `화면 켜짐 유지: ${error.message}` : '화면 켜짐 유지를 사용할 수 없습니다.')
    }
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
          <p className="yehliu-hero__lead">부모님께는 20초로 쉽게, 민성에게는 한 단계 깊게. 제1·2구역을 우리 속도로 걷는 오프라인 셀프 가이드입니다.</p>
          <div className="yehliu-hero__facts" aria-label="가이드 핵심 정보">
            <span><Clock3 aria-hidden="true" /> 09:20–10:50</span>
            <span><Footprints aria-hidden="true" /> 표준 70–80분</span>
            <span><Toilet aria-hidden="true" /> 화장실 3곳</span>
            <span><ShieldAlert aria-hidden="true" /> 제1·2구역만</span>
          </div>
          <div className="yehliu-hero__actions">
            <button type="button" onClick={() => document.getElementById('yehliu-route-start')?.scrollIntoView({ behavior: 'smooth' })}>
              <MapPinned size={19} aria-hidden="true" /> 가이드 시작
            </button>
            <button className="is-secondary" type="button" onClick={toggleWakeLock} aria-pressed={wakeLockActive}>
              <Eye size={19} aria-hidden="true" /> {wakeLockActive ? '화면 켜짐 유지 중' : '화면 켜짐 유지'}
            </button>
          </div>
        </div>
      </header>

      <div className="yehliu-guide-tabs-wrap">
        <nav className="yehliu-guide-tabs page-shell" aria-label="예류 가이드 메뉴">
          {tabs.map((item) => (
            <button className={tab === item.id ? 'is-active' : ''} type="button" aria-current={tab === item.id ? 'page' : undefined} onClick={() => setTab(item.id)} key={item.id}>
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="page-shell yehliu-guide__body">
        <p className="sr-only" aria-live="polite">{externalNotice}</p>
        {externalNotice && <div className="yehliu-inline-notice"><AlertTriangle size={18} aria-hidden="true" />{externalNotice}<button type="button" onClick={() => setExternalNotice('')}>닫기</button></div>}

        {tab === 'route' && (
          <>
            <YehliuOfflineStatus focusOnMount={initialSection === 'offline'} />

            <section className="yehliu-precheck" aria-labelledby="yehliu-precheck-title">
              <div>
                <span className="yehliu-section-kicker">BEFORE WE WALK</span>
                <h2 id="yehliu-precheck-title">출발 전 30초 체크</h2>
                <p>방문자센터 화장실부터 다녀오고, 바람과 부모님 컨디션에 맞춰 코스를 고릅니다.</p>
              </div>
              <ul>
                {yehliuChecklist.map((item) => <li key={item}><Check size={17} aria-hidden="true" />{item}</li>)}
              </ul>
            </section>

            <section className="yehliu-route-picker" id="yehliu-route-start" aria-labelledby="yehliu-route-title">
              <div className="yehliu-section-heading">
                <span className="yehliu-section-kicker">CHOOSE OUR PACE</span>
                <h2 id="yehliu-route-title">오늘의 걷는 속도</h2>
                <p>표준 코스가 기본입니다. 날씨와 체력이 바뀌면 현장에서 바로 줄여도 됩니다.</p>
              </div>
              <div className="yehliu-route-options">
                {yehliuRouteModes.map((mode) => (
                  <button className={routeId === mode.id ? 'is-active' : ''} type="button" aria-pressed={routeId === mode.id} onClick={() => setRouteId(mode.id)} key={mode.id}>
                    <span>{mode.label}</span>
                    <strong>{mode.time}</strong>
                    <small>{mode.description}</small>
                  </button>
                ))}
              </div>
            </section>

            <section className="yehliu-progress" aria-label="예류 가이드 진행률">
              <div>
                <span>우리의 진행</span>
                <strong>{visitedInRoute}/{route.stopIds.length}곳 · {progress}%</strong>
              </div>
              <div className="yehliu-progress__bar" role="progressbar" aria-valuemin={0} aria-valuemax={route.stopIds.length} aria-valuenow={visitedInRoute} aria-label={`${route.stopIds.length}곳 중 ${visitedInRoute}곳 완료`}>
                <span style={{ width: `${progress}%` }} />
              </div>
              <button type="button" onClick={resetProgress}><RotateCcw size={16} aria-hidden="true" /> 초기화</button>
            </section>

            <YehliuSchematicMap routeId={routeId} selectedStop={selectedStop} visited={visited} onSelectStop={chooseStop} />

            <article className="yehliu-stop-card" id="yehliu-stop-card" tabIndex={-1} aria-labelledby="yehliu-selected-stop-title">
              <header className="yehliu-stop-card__header">
                <div className={`yehliu-stop-number ${visited.includes(selected.id) ? 'is-visited' : ''}`}>{visited.includes(selected.id) ? <Check aria-hidden="true" /> : selected.id + 1}</div>
                <div>
                  <span>{selected.zone} · {selected.minutes}</span>
                  <h2 id="yehliu-selected-stop-title">{selected.title}</h2>
                  <p><span lang="zh-Hant">{selected.localName}</span> · {selected.englishName}</p>
                </div>
              </header>

              <section className="yehliu-parent-summary" aria-label="부모님 20초 해설">
                <span><Sparkles size={18} aria-hidden="true" /> 부모님께 20초</span>
                <p>{selected.familySummary}</p>
              </section>

              <div className="yehliu-observe">
                <h3><Glasses size={20} aria-hidden="true" /> 여기서 같이 볼 것</h3>
                <ul>{selected.observe.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>

              <details className="yehliu-science-note" open={routeId === 'deep'}>
                <summary><BookOpen size={19} aria-hidden="true" /> 민성의 깊은 해설</summary>
                <p>{selected.science}</p>
                {selected.misconception && <p className="yehliu-misconception"><CircleHelp size={18} aria-hidden="true" /><span><strong>오해하지 않기</strong>{selected.misconception}</span></p>}
                {selected.safety && <p className="yehliu-stop-safety"><ShieldAlert size={18} aria-hidden="true" /><span><strong>이 지점 안전</strong>{selected.safety}</span></p>}
                <small>근거: {selected.sourceIds.join(' · ')}</small>
              </details>

              <label className="yehliu-visited-toggle">
                <input type="checkbox" checked={visited.includes(selected.id)} onChange={() => toggleVisited(selected.id)} />
                <span><Check aria-hidden="true" /></span>
                이 지점 함께 봤어요
              </label>

              <div className="yehliu-stop-nav">
                <button type="button" onClick={() => moveStop(-1)} disabled={currentIndex <= 0}><ChevronLeft aria-hidden="true" /> 이전</button>
                <span>{currentIndex + 1} / {route.stopIds.length}</span>
                <button type="button" onClick={() => moveStop(1)} disabled={currentIndex >= route.stopIds.length - 1}>다음 <ChevronRight aria-hidden="true" /></button>
              </div>
            </article>

            <div className="yehliu-stop-jump" aria-label="해설 바로가기">
              {activeStops.map((stop) => (
                <button className={selectedStop === stop.id ? 'is-active' : ''} type="button" onClick={() => chooseStop(stop.id)} key={stop.id}>
                  <span>{visited.includes(stop.id) ? <Check size={15} aria-hidden="true" /> : stop.id + 1}</span>{stop.title}
                </button>
              ))}
            </div>
          </>
        )}

        {tab === 'family' && (
          <section className="yehliu-tab-section" aria-labelledby="family-guide-title">
            <div className="yehliu-section-heading">
              <span className="yehliu-section-kicker">20-SECOND STORIES</span>
              <h2 id="family-guide-title">부모님께 이렇게 설명하면 돼</h2>
              <p>각 지점에서 한 문단만 읽어도 흐름이 이어집니다. 어려운 용어는 과학 깊게 탭에서 찾을 수 있어요.</p>
            </div>
            <div className="yehliu-family-list">
              {yehliuStops.map((stop) => (
                <article key={stop.id}>
                  <span>{stop.id + 1}</span>
                  <div><small>{stop.zone} · <span lang="zh-Hant">{stop.localName}</span></small><h3>{stop.title}</h3><p>{stop.familySummary}</p></div>
                  <button type="button" onClick={() => chooseStop(stop.id)}>지도에서 보기</button>
                </article>
              ))}
            </div>
          </section>
        )}

        {tab === 'science' && (
          <section className="yehliu-tab-section" aria-labelledby="science-guide-title">
            <div className="yehliu-section-heading">
              <span className="yehliu-section-kicker">GEOLOGY IN FIVE MINUTES</span>
              <h2 id="science-guide-title">2천만 년을 5분에 이해하기</h2>
              <p>예류는 하나의 힘이 만든 조각상이 아니라 퇴적·굳음·융기·풍화·침식이 이어진 현재진행형 풍경입니다.</p>
            </div>
            <ol className="yehliu-big-timeline">
              {yehliuTimeline.map((item, index) => <li key={item.time}><span>{index + 1}</span><div><small>{item.time}</small><h3>{item.title}</h3><p>{item.description}</p></div></li>)}
            </ol>

            <div className="yehliu-glossary">
              <div className="yehliu-section-heading">
                <span className="yehliu-section-kicker">OFFLINE GLOSSARY</span>
                <h2>한·중·영 지질 용어</h2>
              </div>
              <label className="yehliu-search"><Search aria-hidden="true" /><span className="sr-only">용어 검색</span><input value={glossaryQuery} onChange={(event) => setGlossaryQuery(event.target.value)} placeholder="해식대, 結核, sandstone…" /></label>
              <div className="yehliu-glossary__list">
                {filteredGlossary.map((term) => <article key={term.ko}><h3>{term.ko}</h3><p><span lang="zh-Hant">{term.zh}</span> · {term.en}</p><small>{term.description}</small></article>)}
                {filteredGlossary.length === 0 && <p>일치하는 용어가 없습니다.</p>}
              </div>
            </div>

            <div className="yehliu-quiz">
              <div className="yehliu-section-heading"><span className="yehliu-section-kicker">FAMILY QUIZ</span><h2>답을 열기 전 같이 맞혀보기</h2></div>
              {yehliuQuiz.map((item, index) => <details key={item.question}><summary><span>Q{index + 1}</span>{item.question}</summary><p><strong>정답</strong>{item.answer}</p></details>)}
            </div>
          </section>
        )}

        {tab === 'map' && (
          <section className="yehliu-tab-section" aria-labelledby="map-guide-title">
            <div className="yehliu-section-heading"><span className="yehliu-section-kicker">MAP & RESTROOMS</span><h2 id="map-guide-title">길과 화장실만 빠르게 보기</h2><p>지도 번호를 누르면 해당 해설 카드로 이동합니다.</p></div>
            <YehliuSchematicMap routeId={routeId} selectedStop={selectedStop} visited={visited} onSelectStop={chooseStop} />
            <div className="yehliu-toilets">
              <article><Toilet aria-hidden="true" /><div><small>입장 전</small><h3>매표소 옆</h3><p>주차장 쪽에서 먼저 이용할 수 있는 화장실.</p></div></article>
              <article><Toilet aria-hidden="true" /><div><small>출발점</small><h3>방문자센터 1층</h3><p>우리 일정에서 입장 직후 반드시 들르는 곳.</p></div></article>
              <article><Toilet aria-hidden="true" /><div><small>제2구역</small><h3>Queen’s Bookstore 옆</h3><p>여왕머리 관람 뒤 쉬고 돌아가기 좋은 지점.</p></div></article>
            </div>
            <button className="yehliu-print-button" type="button" onClick={() => window.print()}><Printer aria-hidden="true" /> 2쪽 현장 요약 인쇄</button>
          </section>
        )}

        {tab === 'safety' && (
          <section className="yehliu-tab-section" aria-labelledby="safety-guide-title">
            <div className="yehliu-section-heading"><span className="yehliu-section-kicker">SAFETY FIRST</span><h2 id="safety-guide-title">현장 안내가 언제나 우선</h2><p>2027년 2월의 날씨·파도·통제 상황은 지금 확정할 수 없습니다. 출발 일주일 전과 방문 당일 다시 확인합니다.</p></div>
            <ul className="yehliu-safety-list">{yehliuSafety.map((item) => <li key={item}><ShieldAlert aria-hidden="true" />{item}</li>)}</ul>
            <div className="yehliu-sources">
              <h2>설명 근거와 최종 확인처</h2>
              {yehliuSources.map((source) => (
                <article key={source.id}>
                  <span>{source.id}</span>
                  <div><h3>{source.title}</h3><p>{source.organization}</p><small>{source.scope} · 확인 {source.checked}</small></div>
                  <button type="button" onClick={() => openSource(source.url)}>공식 페이지 <ExternalLink size={16} aria-hidden="true" /></button>
                </article>
              ))}
            </div>
            <aside className="yehliu-recheck"><TimerReset aria-hidden="true" /><div><h2>2027년 2월 재확인</h2><p>운영시간, 입장 동선, 제1·2구역 통제, 강풍·파도, 화장실 운영, 차량 합류 지점을 출발 전 공식 사이트와 기사에게 다시 확인합니다.</p></div></aside>
          </section>
        )}
      </div>

      <section className="yehliu-print-guide" aria-hidden="true">
        <header><h1>민성의 예류 지질 가이드</h1><p>09:20 도착 · 제1·2구역 · 10:45~10:50 차량 복귀 목표</p></header>
        <div className="yehliu-print-route"><YehliuSchematicMap routeId="standard" selectedStop={0} visited={[]} onSelectStop={() => undefined} /></div>
        <h2>표준 70–80분 · 한 줄 해설</h2>
        <ol>{yehliuStops.map((stop) => <li key={stop.id}><strong>{stop.id + 1}. {stop.title}</strong><span>{stop.familySummary}</span></li>)}</ol>
        <div className="yehliu-print-page-two">
          <h2>화장실</h2><p>매표소 옆 · 방문자센터 1층 · 제2구역 Queen’s Bookstore 옆</p>
          <h2>안전</h2><ul>{yehliuSafety.map((item) => <li key={item}>{item}</li>)}</ul>
          <h2>차량 복귀</h2><p>10:45~10:50 목표. 출구 → 방문자센터 → 주차장 합류 지점. 가족 세 명이 함께 움직이고 기사에게 도착 메시지.</p>
          <p>이 자료는 자체 제작 개략 가이드입니다. 정밀 지도·운영·안전 판단은 현장 공식 안내가 우선입니다.</p>
        </div>
      </section>
    </div>
  )
}
