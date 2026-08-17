import { useEffect, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowDown,
  ArrowRight,
  BedDouble,
  CalendarDays,
  CarFront,
  Check,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Coffee,
  Compass,
  ExternalLink,
  HeartHandshake,
  Hotel,
  Info,
  Luggage,
  MapPinned,
  Plane,
  Route,
  ShieldCheck,
  Sparkles,
  Utensils,
  UtensilsCrossed,
  Users,
} from 'lucide-react'
import { Brand } from './components/Brand'
import { Countdown } from './components/Countdown'
import { DaySection } from './components/DaySection'
import { MapLinkButton } from './components/MapLinkButton'
import { OpeningSequence } from './components/OpeningSequence'
import { SectionHeader } from './components/SectionHeader'
import { StatusBadge } from './components/StatusBadge'
import { imageSourceByFile, imageSources } from './data/imageSources'
import {
  budget,
  days,
  driverPlaces,
  mealPlan,
  principles,
  tripMeta,
  tripStatuses,
} from './data/trip'
import { imagePath } from './lib/paths'

const statusIcons: Record<string, LucideIcon> = {
  plane: Plane,
  hotel: Hotel,
  car: CarFront,
  meal: Utensils,
  utensils: UtensilsCrossed,
}

const dayNavItems = [
  { id: 'overview', label: '전체' },
  ...days.map((day) => ({ id: day.id, label: day.day.replace('DAY ', 'DAY ') })),
]

function App() {
  const [activeSection, setActiveSection] = useState('overview')

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('[data-day-section]')
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target.id) setActiveSection(visible.target.id)
      },
      { rootMargin: '-32% 0px -55% 0px', threshold: [0.01, 0.15, 0.4] },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  const heroSource = imageSourceByFile['hero.webp']
  const hotelSource = imageSourceByFile['hotel.webp']

  return (
    <>
      <OpeningSequence />
      <a className="skip-link" href="#main">본문으로 바로가기</a>

      <header className="site-header">
        <div className="site-header__inner page-shell">
          <a className="site-header__brand" href="#top" aria-label="민성투어 홈으로">
            <Brand compact />
          </a>
          <nav className="desktop-nav" aria-label="주요 메뉴">
            <a href="#overview">여행 준비</a>
            <a href="#day-1">전체 일정</a>
            <a href="#travel-guide">숙소·교통</a>
            <a href="#maps">지도</a>
          </nav>
          <Countdown compact />
        </div>
      </header>

      <main id="main">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <img
            className="hero__image"
            src={imagePath('hero.webp')}
            alt={heroSource.alt}
            width="1600"
            height="1069"
            fetchPriority="high"
          />
          <div className="hero__overlay" />
          <div className="hero__content page-shell">
            <div className="hero__copy">
              <span className="hero__eyebrow">PRIVATE FAMILY JOURNEY · TAIPEI</span>
              <div className="hero__brand-line">
                <Brand light />
              </div>
              <p className="hero__date">{tripMeta.dateLabel}</p>
              <h1 id="hero-title">부모님과 함께,<br />타이베이 3박 4일</h1>
              <p className="hero__lead">준비하는 순간부터 돌아오는 날까지.<br />세 사람만을 위해 만든 단 하나의 여행입니다.</p>
              <div className="hero__actions">
                <a className="button button--primary" href="#day-1">
                  4일 일정 보기 <ArrowDown size={19} aria-hidden="true" />
                </a>
                <a className="button button--ghost" href="#overview">준비 현황 보기</a>
              </div>
            </div>

            <aside className="hero-ticket" aria-label="여행 핵심 정보">
              <div className="hero-ticket__top">
                <span>DEPARTURE</span>
                <Countdown />
              </div>
              <div className="hero-ticket__route">
                <div><strong>ICN</strong><small>10:00</small></div>
                <span><Plane size={20} aria-hidden="true" /><i /></span>
                <div><strong>TPE</strong><small>11:30</small></div>
              </div>
              <div className="hero-ticket__facts">
                <span><CalendarDays size={18} aria-hidden="true" /> 3박 4일</span>
                <span><Users size={18} aria-hidden="true" /> 성인 3명</span>
                <span><Sparkles size={18} aria-hidden="true" /> 비즈니스</span>
              </div>
              <p>Asiana Airlines · Taipei Garden Hotel</p>
            </aside>
          </div>
          <div className="hero__photo-credit">
            <span>{heroSource.place}</span>
            <a href={heroSource.sourceUrl} target="_blank" rel="noreferrer">Photo · {heroSource.author}</a>
          </div>
        </section>

        <nav className="mobile-day-nav" aria-label="날짜별 바로가기">
          <div className="mobile-day-nav__inner page-shell">
            {dayNavItems.map((item) => (
              <a
                key={item.id}
                className={activeSection === item.id ? 'is-active' : ''}
                href={`#${item.id}`}
                aria-current={activeSection === item.id ? 'location' : undefined}
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        <section className="overview section-pad" id="overview" data-day-section="overview">
          <div className="page-shell">
            <SectionHeader
              eyebrow="TRIP READINESS"
              title="여행 준비 현황"
              description="가족 모두가 지금 어디까지 준비됐는지 한눈에 볼 수 있어요. 예약번호나 개인정보는 담지 않았습니다."
            />
            <div className="status-summary" aria-label="예약 상태 요약">
              <div><strong>2</strong><span>예약 완료</span></div>
              <div><strong>2</strong><span>견적·협의</span></div>
              <div><strong>1</strong><span>예약 대기</span></div>
              <div><strong>1</strong><span>현장 결정 포함</span></div>
            </div>
            <div className="status-list">
              {tripStatuses.map((status) => {
                const Icon = statusIcons[status.icon]
                return (
                  <article className="status-item" key={status.label}>
                    <span className="status-item__icon"><Icon size={23} aria-hidden="true" /></span>
                    <div className="status-item__copy">
                      <h3>{status.label}</h3>
                      <p>{status.detail}</p>
                    </div>
                    <StatusBadge tone={status.tone}>{status.status}</StatusBadge>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="day-overview section-pad section-pad--topless">
          <div className="page-shell">
            <SectionHeader
              eyebrow="4 DAYS IN TAIWAN"
              title="우리의 4일"
              description="매일 다른 타이베이를 만나되, 일정의 속도는 언제나 부모님 컨디션에 맞춥니다."
            />
            <div className="day-card-grid">
              {days.map((day) => (
                <a className="day-card" href={`#${day.id}`} key={day.id}>
                  <img src={imagePath(day.cover)} alt="" width="800" height="534" loading="lazy" decoding="async" />
                  <span className="day-card__scrim" />
                  <div className="day-card__top"><strong>{day.day}</strong><span>{day.date} {day.weekday}</span></div>
                  <div className="day-card__body">
                    <span>{day.theme}</span>
                    <h3>{day.title}</h3>
                    <p>{day.keyPlaces}</p>
                    <span className="day-card__link">상세 일정 <ArrowRight size={18} aria-hidden="true" /></span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <div className="itinerary-divider" aria-hidden="true">
          <span>THE ITINERARY</span>
          <i />
        </div>

        {days.map((day, index) => <DaySection day={day} index={index} key={day.id} />)}

        <section className="travel-guide section-pad" id="travel-guide">
          <div className="page-shell">
            <SectionHeader
              eyebrow="STAY & MOVE"
              title="쉬는 곳과 이동하는 방법"
              description="복잡한 환승보다 편안한 이동을, 관광 욕심보다 충분한 휴식을 먼저 생각했습니다."
              inverse
            />

            <article className="hotel-feature">
              <figure>
                <img src={imagePath('hotel.webp')} alt={hotelSource.alt} width="1600" height="2408" loading="lazy" decoding="async" />
              </figure>
              <div className="hotel-feature__copy">
                <span className="eyebrow-light">OUR HOME IN TAIPEI</span>
                <h3>Taipei Garden Hotel</h3>
                <p className="hotel-feature__local">台北花園大酒店</p>
                <p>나흘 동안 여행의 중심이 되는 곳입니다. 식물원과 시먼딩 사이에 있어 첫날과 마지막 날 동선이 편하고, 일정 사이에 호텔로 돌아와 쉬기 좋습니다.</p>
                <div className="hotel-feature__facts">
                  <span><BedDouble size={19} aria-hidden="true" /> 3박</span>
                  <span><ShieldCheck size={19} aria-hidden="true" /> 예약 완료</span>
                  <span><Check size={19} aria-hidden="true" /> 무료취소</span>
                </div>
                <MapLinkButton query="Taipei Garden Hotel" label="호텔 지도 보기" />
              </div>
            </article>

            <div className="flight-card">
              <div className="flight-card__header">
                <span><Plane size={22} aria-hidden="true" /></span>
                <div><small>ASIANA AIRLINES · BUSINESS</small><h3>왕복 항공 일정</h3></div>
                <StatusBadge tone="confirmed">예약 완료</StatusBadge>
              </div>
              <div className="flight-grid">
                <div className="flight-leg">
                  <span>가는 날 · 02.20 SAT</span>
                  <div><strong>ICN</strong><i /><strong>TPE</strong></div>
                  <p><time>10:00</time><small>약 2시간 30분</small><time>11:30</time></p>
                </div>
                <div className="flight-leg">
                  <span>오는 날 · 02.23 TUE</span>
                  <div><strong>TPE</strong><i /><strong>ICN</strong></div>
                  <p><time>17:10</time><small>약 2시간 25분</small><time>20:35</time></p>
                </div>
              </div>
            </div>

            <div className="transport-grid">
              <article>
                <span className="transport-grid__icon"><Route size={26} aria-hidden="true" /></span>
                <small>DAY 1</small>
                <h3>공항 MRT 한 번</h3>
                <p>공항에서 타이베이역까지, 이번 여행에서 대중교통을 경험하는 구간입니다.</p>
              </article>
              <article>
                <span className="transport-grid__icon"><CarFront size={26} aria-hidden="true" /></span>
                <small>DAY 2</small>
                <h3>Lexus LM350h</h3>
                <p>예류·스펀을 거쳐 지우펀 드롭에서 종료. 차량 대체 없이 7인승 모델을 지정 요청합니다.</p>
                <StatusBadge tone="progress">견적 문의 중</StatusBadge>
              </article>
              <article>
                <span className="transport-grid__icon"><Luggage size={26} aria-hidden="true" /></span>
                <small>DAY 4</small>
                <h3>짐은 차량에</h3>
                <p>호텔에서 비전옥을 거쳐 공항까지. 식사 중 차량이 대기하며 짐을 안전하게 보관합니다.</p>
                <StatusBadge tone="progress">패키지 협의 예정</StatusBadge>
              </article>
            </div>
          </div>
        </section>

        <section className="meals section-pad" id="meals">
          <div className="page-shell">
            <SectionHeader
              eyebrow="TASTE OF TAIWAN"
              title="먹는 것도 여행"
              description="유명한 곳을 채우기보다 세 사람이 편안하게 앉아 천천히 즐길 수 있는 식사를 골랐습니다."
            />
            <div className="meal-editorial">
              <figure className="meal-editorial__main">
                <img src={imagePath('xiaolongbao.webp')} alt={imageSourceByFile['xiaolongbao.webp'].alt} width="1600" height="960" loading="lazy" decoding="async" />
                <figcaption><span>DAY 3 LUNCH</span><strong>딘타이펑의 딤섬</strong></figcaption>
              </figure>
              <figure className="meal-editorial__side">
                <img src={imagePath('unadon.webp')} alt={imageSourceByFile['unadon.webp'].alt} width="1600" height="1067" loading="lazy" decoding="async" />
                <figcaption><span>LAST LUNCH</span><strong>비전옥 장어덮밥</strong></figcaption>
              </figure>
            </div>
            <div className="meal-table" role="table" aria-label="날짜별 식사 계획">
              {mealPlan.map((meal) => (
                <div className="meal-row" role="row" key={meal.day}>
                  <strong role="rowheader">{meal.day}</strong>
                  <span role="cell"><small>아침</small>{meal.breakfast}</span>
                  <span role="cell"><small>점심</small>{meal.lunch}</span>
                  <span role="cell"><small>저녁</small>{meal.dinner}</span>
                  <span role="cell"><small>한 잔 / 휴식</small>{meal.extra}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="budget section-pad" id="budget">
          <div className="page-shell budget__layout">
            <SectionHeader
              eyebrow="BUDGET DRAFT"
              title="예산 초안"
              description="확정 금액과 예상 금액을 구분했습니다. 차량과 85TD 예약이 정해지면 한 파일에서 바로 수정할 수 있습니다."
            />
            <div className="budget-card">
              <div className="budget-card__confirmed">
                <span>확정 / 예약</span>
                {budget.confirmed.map((item) => (
                  <div key={item.label}>
                    <p><strong>{item.label}</strong><small>{item.note}</small></p>
                    <b>{item.amount}</b>
                  </div>
                ))}
              </div>
              <div className="budget-card__estimate">
                <span className="estimate-badge">예상 · 변동 가능</span>
                <p>현지비 예상</p>
                <strong>{budget.localEstimate}</strong>
                <i />
                <p>전체 여행 예상</p>
                <h3>{budget.totalEstimate}</h3>
                <small>LM 최종 견적, 85TD 예약, 식사 가격에 따라 달라질 수 있어요.</small>
              </div>
            </div>
          </div>
        </section>

        <section className="principles section-pad">
          <div className="page-shell principles__layout">
            <div className="principles__intro">
              <span className="section-header__eyebrow">OUR PROMISE</span>
              <h2>민성투어<br />운영 원칙</h2>
              <HeartHandshake size={54} strokeWidth={1.3} aria-hidden="true" />
            </div>
            <div className="principles__list">
              {principles.map((principle, index) => (
                <p key={principle}><span>{String(index + 1).padStart(2, '0')}</span>{principle}</p>
              ))}
              <blockquote>여행에서 가장 중요한 것은<br /><strong>많이 보는 것보다 세 사람이 즐겁게 돌아오는 것.</strong></blockquote>
            </div>
          </div>
        </section>

        <section className="maps section-pad" id="maps">
          <div className="page-shell">
            <SectionHeader
              eyebrow="SHOW THE DRIVER"
              title="기사님께 보여주기"
              description="중국어 장소명을 크게 보고 바로 지도를 열 수 있습니다. 이동 중 필요한 장소만 모아두었어요."
              inverse
            />
            <div className="driver-grid">
              {driverPlaces.map((place, index) => (
                <article className="driver-card" key={place.local}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <p>{place.korean}</p>
                  <h3 lang="zh-Hant">{place.local}</h3>
                  <MapLinkButton query={place.query} label="지도 열기" compact />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="finale" aria-label="여행 마무리 메시지">
          <img src={imagePath('tamsui.webp')} alt="" width="1600" height="1067" loading="lazy" decoding="async" />
          <div className="finale__overlay" />
          <div className="finale__copy">
            <Compass size={32} strokeWidth={1.5} aria-hidden="true" />
            <p>세 사람의 2027년 겨울</p>
            <h2>천천히 보고,<br />맛있게 먹고,<br />즐겁게 돌아오기.</h2>
            <span>민성투어가 준비하겠습니다.</span>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-shell">
          <div className="site-footer__top">
            <Brand light />
            <div><p>{tripMeta.description}</p><span>{tripMeta.dateLabel}</span></div>
          </div>
          <details className="photo-credits">
            <summary>
              <span><Info size={18} aria-hidden="true" /> 실제 사진 출처와 라이선스</span>
              <ChevronRight size={18} aria-hidden="true" />
            </summary>
            <div className="photo-credits__list">
              {imageSources.map((source) => (
                <a href={source.sourceUrl} target="_blank" rel="noreferrer" key={source.file}>
                  <span>{source.place}</span>
                  <small>{source.author} · {source.license}</small>
                  <ExternalLink size={15} aria-hidden="true" />
                </a>
              ))}
            </div>
          </details>
          <div className="site-footer__note">
            <p><ShieldCheck size={17} aria-hidden="true" /> 이 페이지에는 예약번호, 여권번호, 결제정보 등 민감정보를 저장하지 않습니다.</p>
            <span>MADE WITH CARE FOR OUR FAMILY · 2027</span>
          </div>
        </div>
      </footer>
    </>
  )
}

export default App
