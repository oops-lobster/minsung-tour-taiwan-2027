const mapSourceUrl = 'https://commons.wikimedia.org/wiki/File:Taiwan_mainland_curve.svg'
const mapImageUrl = 'https://upload.wikimedia.org/wikipedia/commons/7/7f/Taiwan_mainland_curve.svg'

const routeStops = [
  { no: '01', label: '타오위안공항', sub: 'TPE · 여행의 시작' },
  { no: '02', label: '타이베이', sub: 'Taipei Garden Hotel · 여행의 베이스' },
  { no: '03', label: '예류', sub: 'DAY 2 · 북해안' },
  { no: '04', label: '스펀', sub: '폭포 · 라오제' },
  { no: '05', label: '지우펀', sub: '산성 마을 · 저녁' },
]

const dayRoutes = [
  { day: 'DAY 1', title: '타이베이 도심', copy: '호텔 · My灶 · 용산사 · 시먼딩' },
  { day: 'DAY 2', title: '북해안 루트', copy: '예류 · 귀후어항 · 스펀 · 지우펀' },
  { day: 'DAY 3', title: '타이베이 동부', copy: '고궁 · 용캉제 · 신이 · 101' },
  { day: 'DAY 4', title: '마지막 반나절', copy: '식물원 · 비전옥 · 타오위안공항' },
]

export function TaiwanRouteMap() {
  return (
    <section className="taiwan-route section-pad" aria-labelledby="taiwan-route-title">
      <div className="page-shell">
        <div className="taiwan-route__heading">
          <div>
            <span className="section-header__eyebrow">OUR ROUTE IN TAIWAN</span>
            <h2 id="taiwan-route-title">대만 북부에서 보내는 네 날</h2>
          </div>
          <p>전체 위치 관계만 가볍게 보고, 실제 이동은 각 일정의 지도 버튼에서 확인합니다.</p>
        </div>

        <div className="taiwan-route__layout">
          <figure className="taiwan-route__map-card">
            <div className="taiwan-route__map-stage" aria-label="타오위안공항, 타이베이, 예류, 스펀, 지우펀의 대략적인 위치">
              <img src={mapImageUrl} alt="" loading="lazy" decoding="async" />
              <svg className="taiwan-route__route-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <path d="M38 13 C46 11, 54 10, 63 10 S72 8, 77 7 S78 11, 80 14 S83 15, 86 16" />
              </svg>

              <span className="taiwan-route__pin taiwan-route__pin--airport" aria-hidden="true">1</span>
              <span className="taiwan-route__pin taiwan-route__pin--taipei" aria-hidden="true">2</span>
              <span className="taiwan-route__pin taiwan-route__pin--yehliu" aria-hidden="true">3</span>
              <span className="taiwan-route__pin taiwan-route__pin--shifen" aria-hidden="true">4</span>
              <span className="taiwan-route__pin taiwan-route__pin--jiufen" aria-hidden="true">5</span>

              <span className="taiwan-route__north">N</span>
              <span className="taiwan-route__map-note">SCHEMATIC · NOT TO SCALE</span>
            </div>

            <figcaption>
              <span>TAIWAN · NORTH</span>
              <small>지도 윤곽: Wikimedia Commons · CC BY-SA 4.0</small>
              <a href={mapSourceUrl} target="_blank" rel="noreferrer">원본 보기</a>
            </figcaption>
          </figure>

          <div className="taiwan-route__story">
            <ol className="taiwan-route__stops">
              {routeStops.map((stop) => (
                <li key={stop.no}>
                  <span>{stop.no}</span>
                  <div>
                    <strong>{stop.label}</strong>
                    <small>{stop.sub}</small>
                  </div>
                </li>
              ))}
            </ol>

            <div className="taiwan-route__days" aria-label="날짜별 여행 지역">
              {dayRoutes.map((route) => (
                <a href={`#schedule/day-${Number(route.day.replace('DAY ', ''))}`} key={route.day}>
                  <span>{route.day}</span>
                  <strong>{route.title}</strong>
                  <small>{route.copy}</small>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
