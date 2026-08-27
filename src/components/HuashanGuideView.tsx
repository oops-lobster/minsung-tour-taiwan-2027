import { ArrowLeft, Clock3, ExternalLink } from 'lucide-react'
import { huashanGuideStops, huashanOfficialScheduleUrl } from '../data/huashanGuide'

export function HuashanGuideView() {
  return (
    <div className="field-guide-view huashan-guide-view">
      <header className="field-guide-view__topbar"><a href="#schedule/day-2"><ArrowLeft size={19} aria-hidden="true" /> Day 2로</a><span>오프라인 사용 가능</span></header>
      <main className="page-shell">
        <header className="field-guide-view__hero"><small>DAY 2 · 16:30–18:15</small><h1>화산1914 큐레이션</h1><p>전부 도는 체크리스트가 아닙니다. Vinyl Decision을 먼저 보고, 부모님 컨디션에 맞춰 두세 곳만 고릅니다.</p></header>
        <ol className="huashan-guide-list">
          {huashanGuideStops.map((stop, index) => <li className={stop.priority ? 'is-priority' : stop.backup ? 'is-backup' : ''} key={stop.name}>
            <span>{String(index + 1).padStart(2, '0')}</span><div><small lang="zh-Hant">{stop.localName}</small><h2>{stop.name}</h2><p>{stop.description}</p><em><Clock3 size={14} aria-hidden="true" /> {stop.duration} · {stop.status}</em><a href={stop.href} target="_blank" rel="noreferrer">장소 정보 <ExternalLink size={15} aria-hidden="true" /></a></div>
          </li>)}
        </ol>
        <a className="field-guide-view__official" href={huashanOfficialScheduleUrl} target="_blank" rel="noreferrer">당일 팝업 공식 일정 열기 <ExternalLink size={16} aria-hidden="true" /></a>
      </main>
    </div>
  )
}
