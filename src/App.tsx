import { useEffect, useRef, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowRight,
  BedDouble,
  CalendarDays,
  CarFront,
  Check,
  ChevronRight,
  ExternalLink,
  HeartHandshake,
  Home,
  Hotel,
  Info,
  Languages,
  LockKeyhole,
  Luggage,
  Plane,
  Route,
  ShieldCheck,
  Sparkles,
  Utensils,
  UtensilsCrossed,
  Users,
  WalletCards,
} from 'lucide-react'
import { Brand } from './components/Brand'
import { Countdown } from './components/Countdown'
import { DaySection } from './components/DaySection'
import { LocalToolsView, RestaurantPlanB } from './components/LocalToolsView'
import type { ToolsTab } from './components/LocalToolsView'
import { MapLinkButton } from './components/MapLinkButton'
import { OpeningSequence } from './components/OpeningSequence'
import { HotelReturnButton } from './components/PlaceActions'
import { SectionHeader } from './components/SectionHeader'
import { StatusBadge } from './components/StatusBadge'
import { imageSourceByFile, imageSources } from './data/imageSources'
import { placeCatalog, todayTaiwanCards } from './data/localTools'
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

type ViewId = 'home' | 'schedule' | 'bookings' | 'food' | 'budget' | 'tools'
type BookingTab = 'status' | 'stay' | 'mobility'

interface AppRoute {
  view: ViewId
  section?: string
}

const statusIcons: Record<string, LucideIcon> = {
  plane: Plane,
  hotel: Hotel,
  car: CarFront,
  meal: Utensils,
  utensils: UtensilsCrossed,
}

const primaryNav: Array<{ id: ViewId; label: string; shortLabel: string; icon: LucideIcon; href: string }> = [
  { id: 'home', label: '홈', shortLabel: '홈', icon: Home, href: '#home' },
  { id: 'schedule', label: '전체 일정', shortLabel: '일정', icon: CalendarDays, href: '#schedule/day-1' },
  { id: 'bookings', label: '예약·이동', shortLabel: '예약', icon: Plane, href: '#bookings/status' },
  { id: 'food', label: '식사', shortLabel: '식사', icon: Utensils, href: '#food' },
  { id: 'budget', label: '예산', shortLabel: '예산', icon: WalletCards, href: '#budget' },
  { id: 'tools', label: '현지 도구', shortLabel: '현지 도구', icon: Languages, href: '#tools/quick' },
]

const mobileNav = primaryNav.filter((item) => item.id !== 'budget')

const bookingTabs: Array<{ id: BookingTab; label: string }> = [
  { id: 'status', label: '예약 현황' },
  { id: 'stay', label: '숙소·항공' },
  { id: 'mobility', label: '차량·지도' },
]

const toolsTabs: ToolsTab[] = ['quick', 'language', 'weather', 'guide']
const kakaoGuideStorageKey = 'minsung-tour-kakao-guide-v2-seen'

function readRoute(): AppRoute {
  const raw = window.location.hash.replace(/^#/, '')

  if (days.some((day) => day.id === raw)) return { view: 'schedule', section: raw }
  if (raw === 'top' || raw === 'overview' || raw === '') return { view: 'home' }

  const [view, section] = raw.split('/')
  if (view === 'schedule') {
    return { view: 'schedule', section: days.some((day) => day.id === section) ? section : 'day-1' }
  }
  if (view === 'bookings') {
    return { view: 'bookings', section: bookingTabs.some((tab) => tab.id === section) ? section : 'status' }
  }
  if (view === 'tools') {
    return { view: 'tools', section: toolsTabs.includes(section as ToolsTab) ? section : 'quick' }
  }
  if (view === 'food' || view === 'budget' || view === 'home') return { view }

  return { view: 'home' }
}

function ViewHero({ image, eyebrow, title, description }: { image: string; eyebrow: string; title: string; description: string }) {
  const source = imageSourceByFile[image]
  const titleId = `view-title-${title.replace(/\s+/g, '-')}`

  return (
    <section className="view-hero" aria-labelledby={titleId}>
      <img src={imagePath(image)} alt={source.alt} width="1600" height="1067" loading="eager" />
      <div className="view-hero__scrim" />
      <div className="view-hero__copy page-shell">
        <span>{eyebrow}</span>
        <h1 id={titleId}>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  )
}

function StatusOverview({ compact = false }: { compact?: boolean }) {
  const statuses = compact ? tripStatuses.slice(0, 3) : tripStatuses

  return (
    <section className={`overview section-pad ${compact ? 'overview--compact' : ''}`}>
      <div className="page-shell">
        <SectionHeader
          eyebrow="TRIP READINESS"
          title={compact ? '지금, 여행은 여기까지' : '여행 준비 현황'}
          description={compact
            ? '예약된 것과 아직 비교하거나 기다리는 것을 짧게 확인하세요.'
            : '가족 모두가 지금 어디까지 준비됐는지 한눈에 볼 수 있어요. 예약번호나 개인정보는 담지 않았습니다.'}
        />
        <div className="status-summary" aria-label="예약 상태 요약">
          <div><strong>2</strong><span>예약 완료</span></div>
          <div><strong>2</strong><span>비교·검토</span></div>
          <div><strong>1</strong><span>예약 대기</span></div>
          <div><strong>1</strong><span>현장 결정</span></div>
        </div>
        <div className={`status-list ${compact ? 'status-list--compact' : ''}`}>
          {statuses.map((status) => {
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
        {compact && (
          <a className="section-link" href="#bookings/status">
            예약 현황 전체 보기 <ArrowRight size={18} aria-hidden="true" />
          </a>
        )}
      </div>
    </section>
  )
}

function HomeView() {
  const heroSource = imageSourceByFile['hero.webp']
  const today = new Date()
  const localDayIndex = Math.floor(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 86_400_000)
  const todayCard = todayTaiwanCards[localDayIndex % todayTaiwanCards.length]

  return (
    <div className="portal-view portal-view--home">
      <section className="hero hero--portal" aria-labelledby="hero-title">
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
            <div className="hero__brand-line"><Brand light /></div>
            <p className="hero__date">{tripMeta.dateLabel}</p>
            <h1 id="hero-title">부모님과 함께,<br />타이베이 3박 4일</h1>
            <p className="hero__lead">준비하는 순간부터 돌아오는 날까지.<br />세 사람만을 위해 만든 단 하나의 여행입니다.</p>
            <div className="hero__actions">
              <a className="button button--primary" href="#schedule/day-1">
                일정 열기 <ArrowRight size={19} aria-hidden="true" />
              </a>
              <a className="button button--ghost" href="#bookings/status">예약 현황</a>
            </div>
          </div>

          <aside className="hero-ticket" aria-label="여행 핵심 정보">
            <div className="hero-ticket__top"><span>DEPARTURE</span><Countdown /></div>
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

      <StatusOverview compact />

      <section className="today-taiwan section-pad" aria-labelledby="today-taiwan-title">
        <div className="page-shell">
          <a className="today-taiwan__card" href={todayCard.href}>
            <img
              src={imagePath(todayCard.image)}
              alt={imageSourceByFile[todayCard.image].alt}
              width="1600"
              height="1067"
              loading="lazy"
              decoding="async"
            />
            <span className="today-taiwan__scrim" />
            <div className="today-taiwan__copy">
              <span>{todayCard.eyebrow}</span>
              <h2 id="today-taiwan-title">{todayCard.title}</h2>
              <p>{todayCard.copy}</p>
              <strong>일정에서 보기 <ArrowRight size={18} aria-hidden="true" /></strong>
            </div>
          </a>
        </div>
      </section>

      <section className="day-overview section-pad">
        <div className="page-shell">
          <SectionHeader
            eyebrow="4 DAYS IN TAIWAN"
            title="하루씩 골라보기"
            description="네 날을 한꺼번에 펼치지 않았어요. 궁금한 날을 눌러 그날 일정만 확인하세요."
          />
          <div className="day-card-grid day-card-grid--portal">
            {days.map((day) => (
              <a className="day-card day-card--portal" href={`#schedule/${day.id}`} key={day.id}>
                <img src={imagePath(day.cover)} alt={imageSourceByFile[day.cover].alt} width="800" height="534" loading="lazy" decoding="async" />
                <span className="day-card__scrim" />
                <div className="day-card__top"><strong>{day.day}</strong><span>{day.date}</span></div>
                <div className="day-card__body">
                  <span>{day.weekday}</span>
                  <h3>{day.title}</h3>
                  <span className="day-card__link">열어보기 <ArrowRight size={17} aria-hidden="true" /></span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="home-promise" aria-label="민성투어 여행 원칙">
        <img src={imagePath('tamsui.webp')} alt="" width="1600" height="1067" loading="lazy" decoding="async" />
        <div className="home-promise__scrim" />
        <div className="home-promise__copy page-shell">
          <HeartHandshake size={34} strokeWidth={1.5} aria-hidden="true" />
          <p>민성투어의 약속</p>
          <h2>많이 보는 것보다,<br />세 사람이 즐겁게 돌아오는 여행.</h2>
          <a className="button button--ghost" href="#budget">예산과 원칙 보기</a>
        </div>
      </section>
    </div>
  )
}

function ScheduleView({ dayId }: { dayId: string }) {
  const activeDay = days.find((day) => day.id === dayId) ?? days[0]

  return (
    <div className="portal-view">
      <ViewHero
        image="jiufen.webp"
        eyebrow="THE ITINERARY"
        title="4일 일정"
        description="하루를 선택하면 그날 동선만 펼쳐집니다. 날짜를 바꿔도 화면 구조는 그대로 유지돼요."
      />
      <nav className="section-tabs section-tabs--days" aria-label="날짜 선택">
        <div className="page-shell">
          {days.map((day) => (
            <a
              className={activeDay.id === day.id ? 'is-active' : ''}
              href={`#schedule/${day.id}`}
              aria-current={activeDay.id === day.id ? 'page' : undefined}
              key={day.id}
            >
              <strong>{day.day}</strong>
              <span>{day.date} {day.weekday}</span>
            </a>
          ))}
        </div>
      </nav>
      <DaySection day={activeDay} index={days.indexOf(activeDay)} />
    </div>
  )
}

function StayView() {
  const hotelSource = imageSourceByFile['hotel.webp']

  return (
    <section className="travel-guide section-pad">
      <div className="page-shell">
        <SectionHeader
          eyebrow="STAY & FLIGHT"
          title="숙소와 항공"
          description="예약된 두 가지 핵심 정보만 한 화면에서 확인합니다."
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
            <p>식물원과 시먼딩 사이에 있어 첫날과 마지막 날 동선이 편하고, 일정 사이 호텔로 돌아와 쉬기 좋습니다.</p>
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
      </div>
    </section>
  )
}

function MobilityView() {
  return (
    <>
      <section className="travel-guide section-pad transport-view">
        <div className="page-shell">
          <SectionHeader
            eyebrow="PRIVATE TRANSFER"
            title="차량과 이동"
            description="대중교통은 꼭 필요한 한 번만, 장거리 구간은 편안한 전용차를 우선합니다."
            inverse
          />
          <div className="transport-grid">
            <article>
              <span className="transport-grid__icon"><Route size={26} aria-hidden="true" /></span>
              <small>DAY 1</small><h3>공항 MRT 한 번</h3>
              <p>공항에서 타이베이역까지, 이번 여행에서 대중교통을 경험하는 구간입니다.</p>
            </article>
            <article>
              <span className="transport-grid__icon"><CarFront size={26} aria-hidden="true" /></span>
              <small>DAY 2 · 후보 A</small><h3>Toyota Alphard 40系</h3>
              <p>2023년 이후 모델. 2열 리클라이너·오토만·통풍·열선·마사지 기능과 부모님 승하차 편의성을 비교합니다.</p>
              <StatusBadge tone="progress">확정 아님 · 최종 비교 중</StatusBadge>
            </article>
            <article>
              <span className="transport-grid__icon"><Sparkles size={26} aria-hidden="true" /></span>
              <small>DAY 2 · 후보 B</small><h3>Lexus LM350h</h3>
              <p>2023~2026년식 후보. 동일한 2열 리클라이너·오토만·통풍·열선·마사지 기능과 승차감을 비교합니다.</p>
              <StatusBadge tone="progress">확정 아님 · 최종 비교 중</StatusBadge>
            </article>
            <article>
              <span className="transport-grid__icon"><Luggage size={26} aria-hidden="true" /></span>
              <small>DAY 4</small><h3>같은 업체 재이용 검토</h3>
              <p>호텔에서 비전옥을 거쳐 공항까지. Day 2 선정 업체가 식사 중 대기하며 짐을 보관하는 방향입니다.</p>
              <StatusBadge tone="progress">예약 미정</StatusBadge>
            </article>
          </div>
        </div>
      </section>

      <section className="maps section-pad">
        <div className="page-shell">
          <SectionHeader
            eyebrow="SHOW THE DRIVER"
            title="기사님께 보여주기"
            description="중국어 장소명을 크게 보고 바로 지도를 열 수 있습니다."
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
    </>
  )
}

function BookingsView({ tab }: { tab: BookingTab }) {
  return (
    <div className="portal-view">
      <ViewHero
        image="hotel.webp"
        eyebrow="BOOKING DESK"
        title="예약과 이동"
        description="현황, 숙소·항공, 차량·지도를 세 화면으로 나눠 필요한 정보만 빠르게 찾습니다."
      />
      <nav className="section-tabs section-tabs--booking" aria-label="예약과 이동 세부 메뉴">
        <div className="page-shell">
          {bookingTabs.map((item) => (
            <a
              className={tab === item.id ? 'is-active' : ''}
              href={`#bookings/${item.id}`}
              aria-current={tab === item.id ? 'page' : undefined}
              key={item.id}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
      {tab === 'status' && <StatusOverview />}
      {tab === 'stay' && <StayView />}
      {tab === 'mobility' && <MobilityView />}
    </div>
  )
}

function FoodView() {
  return (
    <div className="portal-view">
      <ViewHero
        image="xiaolongbao.webp"
        eyebrow="TASTE OF TAIWAN"
        title="식사 계획"
        description="유명한 곳을 채우기보다 세 사람이 편안하게 앉아 천천히 즐길 수 있는 식사를 골랐습니다."
      />
      <section className="meals section-pad">
        <div className="page-shell">
          <SectionHeader
            eyebrow="MEAL HIGHLIGHTS"
            title="먹는 것도 여행"
            description="날짜별 아침, 점심, 저녁과 가벼운 한 잔까지 한 표로 확인하세요."
          />
          <div className="meal-editorial">
            <figure className="meal-editorial__main">
              <img src={imagePath('xiaolongbao.webp')} alt={imageSourceByFile['xiaolongbao.webp'].alt} width="1600" height="960" loading="lazy" decoding="async" />
              <figcaption><span>DAY 3 LUNCH</span><strong>딘타이펑 신생점의 딤섬</strong></figcaption>
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
      <RestaurantPlanB />
    </div>
  )
}

function BudgetView() {
  return (
    <div className="portal-view">
      <ViewHero
        image="taipei-night.webp"
        eyebrow="BUDGET & PROMISE"
        title="예산과 원칙"
        description="정산이 끝난 항공·숙소 금액은 숨기고, 앞으로 확인할 현지비와 우리 가족 여행의 기준만 적었습니다."
      />
      <section className="budget section-pad">
        <div className="page-shell budget__layout">
          <SectionHeader
            eyebrow="LOCAL BUDGET"
            title="현지비 준비 현황"
            description="이미 정산한 항공·숙소는 상태만 보여주고, 아직 필요한 비용은 확정되기 전까지 금액을 표시하지 않습니다."
          />
          <div className="budget-card">
            <div className="budget-card__confirmed">
              <span>예약·정산 완료</span>
              {budget.settled.map((item) => (
                <div key={item.label}>
                  <p><strong>{item.label}</strong><small>{item.note}</small></p>
                  <b>{item.status}</b>
                </div>
              ))}
            </div>
            <div className="budget-card__estimate">
              <span className="estimate-badge">예약 대기 · 현지비</span>
              <p>앞으로 확인할 항목</p>
              <h3>확정된 비용만<br />나중에 공유할게요</h3>
              <i />
              <div className="budget-card__pending-list">
                {budget.pending.map((item) => (
                  <div key={item.label}>
                    <p><strong>{item.label}</strong><small>{item.note}</small></p>
                    <b>{item.status}</b>
                  </div>
                ))}
              </div>
              <small>업체별 견적과 협상 과정은 가족용 사이트에 표시하지 않습니다.</small>
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
    </div>
  )
}

function SiteFooter() {
  return (
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
          <p><ShieldCheck size={17} aria-hidden="true" /> 예약번호, 여권번호, 결제정보 등 민감정보는 저장하지 않습니다.</p>
          <div>
            <a className="site-footer__private-link" href="#tools/quick" aria-label="민성 모드 위치">
              <LockKeyhole size={15} aria-hidden="true" /> 민성 모드
            </a>
            <button type="button" onClick={() => window.dispatchEvent(new Event('minsung-tour:replay-opening'))}>오프닝 다시 보기</button>
            <span>MADE WITH CARE FOR OUR FAMILY · 2027</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

function App() {
  const [route, setRoute] = useState<AppRoute>(readRoute)
  const firstRender = useRef(true)

  useEffect(() => {
    const isKakaoBrowser = /KAKAOTALK/i.test(window.navigator.userAgent)
    if (!isKakaoBrowser || window.sessionStorage.getItem(kakaoGuideStorageKey) === 'true') return

    window.sessionStorage.setItem(kakaoGuideStorageKey, 'true')
    if (window.location.hash !== '#tools/guide') window.location.hash = 'tools/guide'
  }, [])

  useEffect(() => {
    const handleHashChange = () => setRoute(readRoute())
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    const labels: Record<ViewId, string> = {
      home: '홈',
      schedule: '전체 일정',
      bookings: '예약과 이동',
      food: '식사 계획',
      budget: '예산과 원칙',
      tools: '현지 도구',
    }
    document.title = `${labels[route.view]} | 민성투어 대만 2027`

    if (firstRender.current) {
      firstRender.current = false
      return
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' })
    window.requestAnimationFrame(() => document.querySelector<HTMLElement>('.portal-main')?.focus())
  }, [route])

  const bookingTab = (route.section ?? 'status') as BookingTab
  const toolsTab = (route.section ?? 'quick') as ToolsTab

  return (
    <>
      <OpeningSequence />
      <a className="skip-link" href="#main">본문으로 바로가기</a>

      <header className="site-header">
        <div className="site-header__inner page-shell">
          <a className="site-header__brand" href="#home" aria-label="민성투어 홈으로">
            <Brand compact />
          </a>
          <nav className="desktop-nav" aria-label="주요 메뉴">
            {primaryNav.map((item) => (
              <a className={route.view === item.id ? 'is-active' : ''} href={item.href} aria-current={route.view === item.id ? 'page' : undefined} key={item.id}>
                {item.label}
              </a>
            ))}
          </nav>
          <Countdown compact />
        </div>
      </header>

      <main className="portal-main" id="main" tabIndex={-1}>
        {route.view === 'home' && <HomeView />}
        {route.view === 'schedule' && <ScheduleView dayId={route.section ?? 'day-1'} />}
        {route.view === 'bookings' && <BookingsView tab={bookingTab} />}
        {route.view === 'food' && <FoodView />}
        {route.view === 'budget' && <BudgetView />}
        {route.view === 'tools' && <LocalToolsView tab={toolsTab} />}
      </main>

      {(route.view === 'schedule' || route.view === 'tools') && <HotelReturnButton hotel={placeCatalog.hotel} />}

      <SiteFooter />

      <nav className="mobile-primary-nav" aria-label="모바일 주요 메뉴">
        {mobileNav.map((item) => {
          const Icon = item.icon
          const active = route.view === item.id
          return (
            <a className={active ? 'is-active' : ''} href={item.href} aria-current={active ? 'page' : undefined} key={item.id}>
              <Icon size={21} aria-hidden="true" />
              <span>{item.shortLabel}</span>
            </a>
          )
        })}
      </nav>
    </>
  )
}

export default App
