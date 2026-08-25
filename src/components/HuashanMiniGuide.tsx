import { Clock3, ExternalLink, Headphones, Store } from 'lucide-react'
import { huashanGuideStops, huashanOfficialScheduleUrl } from '../data/huashanGuide'

export function HuashanMiniGuide() {
  return (
    <details className="huashan-mini-guide">
      <summary>
        <span><Headphones size={19} aria-hidden="true" /></span>
        <span>
          <small>16:30–18:15 · FIELD PICKS</small>
          <strong>화산1914 현장 가이드 열기</strong>
        </span>
        <em>LP부터</em>
      </summary>

      <div className="huashan-mini-guide__body">
        <p className="huashan-mini-guide__lead">전부 도는 체크리스트가 아닙니다. Vinyl Decision을 먼저 보고, 남는 시간과 부모님 컨디션에 맞춰 두세 곳만 고릅니다.</p>
        <ol>
          {huashanGuideStops.map((stop, index) => (
            <li className={`${stop.priority ? 'is-priority' : ''} ${stop.backup ? 'is-backup' : ''}`} key={stop.name}>
              <span className="huashan-mini-guide__number">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <small lang="zh-Hant">{stop.localName}</small>
                <h4>{stop.name}</h4>
                <span className="huashan-mini-guide__duration"><Clock3 size={14} aria-hidden="true" /> {stop.duration}</span>
                <p>{stop.description}</p>
                <span className="huashan-mini-guide__status">{stop.status}</span>
                <a href={stop.href} target="_blank" rel="noreferrer">
                  {stop.backup ? <Store size={15} aria-hidden="true" /> : <ExternalLink size={15} aria-hidden="true" />}
                  장소 정보
                </a>
              </div>
            </li>
          ))}
        </ol>
        <aside>
          <div>
            <small>TODAY AT HUASHAN</small>
            <strong>오늘의 팝업·전시·마켓·거리공연</strong>
            <p>2026년 행사를 고정하지 않고, 여행 직전에 공식 일정에서 그날 가장 재미있는 한 가지를 고릅니다.</p>
          </div>
          <a href={huashanOfficialScheduleUrl} target="_blank" rel="noreferrer">
            공식 화산1914 일정 열기 <ExternalLink size={16} aria-hidden="true" />
          </a>
        </aside>
      </div>
    </details>
  )
}
