import { lazy, Suspense, useEffect, useRef, useState } from 'react'
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
import { getPlaceDisplayHint, placeCatalog, todayTaiwanCards, type PlaceId } from './data/localTools'
import {
  days,
  driverPlaces,
  mealPlan,
  principles,
  tripMeta,
  tripStatuses,
} from './data/trip'
import { imagePath } from './lib/paths'

const BudgetDashboard = lazy(() => import('./components/BudgetDashboard').then((module) => ({ default: module.BudgetDashboard })))
const YehliuGuideView = lazy(() => import('./components/YehliuGuideView').then((module) => ({ default: module.YehliuGuideView })))
const GuihouGuideView = lazy(() => import('./components/GuihouGuideView').then((module) => ({ default: module.GuihouGuideView })))

type ViewId = 'home' | 'schedule' | 'bookings' | 'food' | 'budget' | 'minsung' | 'principles' | 'tools' | 'guide'
type BookingTab = 'status' | 'stay' | 'mobility'

interface AppRoute {
  view: ViewId
  section?: string
  guide?: 'yehliu' | 'guihou'
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

const mobileNav = primaryNav.filter((item) => item.id !== 'food')

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

  const [view, section, detail] = raw.split('/')
  if (view === 'schedule') {
    return { view: 'schedule', section: days.some((day) => day.id === section) ? section : 'day-1' }
  }
  if (view === 'bookings') {
    return { view: 'bookings', section: bookingTabs.some((tab) => tab.id === section) ? section : 'status' }
  }
  if (view === 'tools') {
    return { view: 'tools', section: toolsTabs.includes(section as ToolsTab) ? section : 'quick' }
  }
  if (view === 'guide' && section === 'yehliu') {
    return { view: 'guide', guide: 'yehliu', section: detail === 'offline' ? 'offline' : detail === 'gps' ? 'gps' : 'yehliu' }
  }
  if (view === 'guide' && section === 'guihou') {
    return { view: 'guide', guide: 'guihou', section: detail ?? 'operation' }
  }
  if (view === 'food' || view === 'budget' || view === 'minsung' || view === 'principles' || view === 'home') return { view }

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
        <div className={`status-list ${compact ? 'status-list--compact' : ''}`}>
          {statuses.map((status) => {
            const Icon = statusIcons[status.icon]
            const placeHint = status.placeId ? getPlaceDisplayHint(placeCatalog[status.placeId]) : undefined
            return (
              <article className="status-item" key={status.label}>
                <span className="status-item__icon"><Icon size={23} aria-hidden="true" /></span>
                <div className="status-item__copy">
                  <h3>{status.label}</h3>
                  <p>{status.detail}</p>
                  {placeHint && <small className="status-item__hint">{placeHint}</small>}
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
  const today = new Date()
  const localDayIndex = Math.floor(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 86_400_000)
  const todayCard = todayTaiwanCards[localDayIndex % todayTaiwanCards.length]

  return (
    <div className="portal-view portal-view--home">
      <section className="hero hero--portal" aria-labelledby="hero-title">
        <img
          className="hero__image"
          src={imagePath('day1-route-background.png')}
          alt="타이베이 도심과 산, 다리와 사원이 어우러진 따뜻한 수채화 풍경"
          width="1774"
          height="887"
          fetchPriority="high"
        />
        <div className="hero__overlay" />
        <div className="hero__content page-shell">
          <div className="hero__copy">
            <span className="hero__eyebrow">PRIVATE FAMILY JOURNEY · TAIPEI</span>
            <div className="hero__brand-line"><Brand /></div>
            <p className="hero__date">{tripMeta.dateLabel}</p>
            <h1 id="hero-title">
              <span className="hero__slogan-line">가치 있는 사치.</span>
              <span className="hero__slogan-line">같이 있는 우리.</span>
            </h1>
            <p className="hero__lead">세 사람이 함께 고르고 준비하는 타이베이 3박 4일.</p>
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
              <div><strong>ICN</strong><small>08:00</small></div>
              <span><Plane size={20} aria-hidden="true" /><i /></span>
              <div><strong>TPE</strong><small>09:50</small></div>
            </div>
            <div className="hero-ticket__facts">
              <span><CalendarDays size={18} aria-hidden="true" /> 3박 4일</span>
              <span><Users size={18} aria-hidden="true" /> 성인 3명</span>
              <span><Sparkles size={18} aria-hidden="true" /> 비즈니스</span>
            </div>
            <p>Asiana Airlines · Taipei Garden Hotel</p>
          </aside>
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
          <p>여행 전부터 같이</p>
          <h2>궁금한 곳은 미리 찾아보고,<br />바꾸고 싶은 일정은 함께 이야기해요.</h2>
          <a className="button button--ghost" href="#principles">우리 여행 원칙 보기</a>
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
      <DaySection day={activeDay} index={days.indexOf(activeDay)} key={activeDay.id} />
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
              <p><time>08:00</time><small>OZ711 · T2</small><time>09:50</time></p>
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
            title="여행의 이동"
            description="차급을 비교하는 목록이 아니라, 여행의 시작부터 귀가까지 서로 다른 네 장면입니다."
            inverse
          />
          <div className="transport-grid">
            <article className="transport-card--featured">
              <figure className="transport-card__media">
                <img
                  src={imagePath('g90-lwb-4seat-rear.webp')}
                  alt={imageSourceByFile['g90-lwb-4seat-rear.webp'].alt}
                  width="1200"
                  height="800"
                  loading="lazy"
                  decoding="async"
                />
                <figcaption><strong>G90 LWB 4인승 실제 후석</strong><span>업체 제공 사진으로 VIP 독립 후석 확인</span></figcaption>
              </figure>
              <span className="transport-grid__icon"><Route size={26} aria-hidden="true" /></span>
              <small>한국 출발 · 여행의 오프닝</small><h3>Genesis G90 LWB 4인승</h3>
              <p>글로벌25시콜리무진의 기사 포함 G90 롱휠베이스 4인승으로 목동에서 인천공항 T2까지 이동하는 예약이 확정되었습니다.</p>
              <ul className="transport-facts" aria-label="G90 공항 이동 핵심 조건">
                <li>04:10–04:20</li><li>성인 3명</li><li>캐리어 2개</li><li>VIP 독립 후석</li>
              </ul>
              <StatusBadge tone="confirmed">예약 확정</StatusBadge>
              <details className="mobility-detail">
                <summary>예약 조건 보기 <ChevronRight size={17} aria-hidden="true" /></summary>
                <ul>
                  <li>글로벌25시콜리무진 · Genesis G90 Long Wheel Base 4인승 지정</li>
                  <li>2027년 2월 20일 · 목동 → 인천공항 제2터미널</li>
                  <li>04:10–04:20 픽업 · 성인 3명 · 캐리어 2개</li>
                  <li>독립형 VIP 후석과 고정식 중앙 콘솔을 실제 사진으로 확인</li>
                  <li>예약금 없음 · 은행 송금 결제 예정</li>
                </ul>
              </details>
            </article>
            <article>
              <span className="transport-grid__icon"><CarFront size={26} aria-hidden="true" /></span>
              <small>DAY 1 · AIRPORT ARRIVAL</small><h3>Mercedes 항공의자 차량 ?</h3>
              <p>현재 1순위는 宇航富豪의 독립형 항공의자 차량입니다. 사진 속 Mercedes 차량 지정과 부모님 좌석 사양은 확인했고, 나머지 픽업 조건과 최종 예약은 확인 중입니다.</p>
              <ul className="transport-facts" aria-label="Mercedes 항공의자 공항 픽업 검토 조건">
                <li>사진 차량 지정 확인</li><li>독립형 VIP 시트</li><li>성인 3명</li><li>최종 확인 중</li>
              </ul>
              <StatusBadge tone="waiting">최종 조건 확인 중</StatusBadge>
              <details className="mobility-detail">
                <summary>후보와 확인사항 보기 <ChevronRight size={17} aria-hidden="true" /></summary>
                <ul>
                  <li>宇航富豪 · 타오위안공항 T2 → Taipei Garden Hotel</li>
                  <li>성인 3명 · 중형 캐리어 1개 · 기내용 캐리어 1개</li>
                  <li>사진 속 Mercedes 항공의자 차량 지정 가능 확인</li>
                  <li>전동 리클라이닝 · 레그레스트 · 통풍 · 열선 · 마사지 확인</li>
                  <li>피켓 미팅 · 수하물 도움 · 무료 대기 · 결제 조건은 추가 확인 중</li>
                  <li>Heycar S-Class와 奇立 ES300h는 확정 전까지 백업 후보</li>
                </ul>
              </details>
            </article>
            <article>
              <span className="transport-grid__icon"><Sparkles size={26} aria-hidden="true" /></span>
              <small>DAY 2 · DAY 4 · 편안한 근교 이동</small><h3>Toyota New Alphard 40系</h3>
              <p>LUMI DRIVE 璐米租車의 합법 R 번호판 차량으로 Day 2·4 계약을 진행했고, 첫 예약금 해외송금도 완료했습니다.</p>
              <StatusBadge tone="progress">첫 예약금 송금 완료</StatusBadge>
              <details className="mobility-detail">
                <summary>차량 조건 보기 <ChevronRight size={17} aria-hidden="true" /></summary>
                <ul>
                  <li>Day 2 8시간 · Day 4 약 4시간</li>
                  <li>첫 예약금 해외송금 완료 · 중복 송금 금지</li>
                  <li>2024–2026년식 차량 풀 · 신형 연식 우선 배차, 2026년식 지정 보장은 아님</li>
                  <li>합법 R 번호판 · 승객보험 1인당 NT$5,000,000</li>
                  <li>무연 차량 · 출차 전 내·외부 차량 정리</li>
                  <li>2열 독립 좌석 · 전동 리클라이닝 · 전동 레그레스트</li>
                  <li>통풍 · 열선 · 마사지</li>
                  <li>실제 기사·차량 정보는 늦어도 운행 24시간 전 제공</li>
                  <li>초과시간 발생 시 추가요금 별도</li>
                </ul>
              </details>
            </article>
            <article>
              <span className="transport-grid__icon"><Luggage size={26} aria-hidden="true" /></span>
              <small>귀국 · 여행의 마무리</small><h3>Taxi</h3>
              <p>인천공항에 도착한 뒤에는 시간을 정하지 않고 현장에서 택시를 불러 편하게 집으로 돌아갑니다.</p>
              <StatusBadge tone="flexible">현장 호출</StatusBadge>
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
                {place.placeId && getPlaceDisplayHint(placeCatalog[place.placeId]) && <small className="driver-card__hint">{getPlaceDisplayHint(placeCatalog[place.placeId])}</small>}
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

function MealPlanCell({ label, value, placeId }: { label: string; value: string; placeId?: PlaceId }) {
  const hint = placeId ? getPlaceDisplayHint(placeCatalog[placeId]) : undefined

  return (
    <span role="cell" className="meal-row__cell">
      <small>{label}</small>
      <span className="meal-row__copy">{value}{hint && <em>{hint}</em>}</span>
    </span>
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
                <MealPlanCell label="아침" value={meal.breakfast} placeId={meal.breakfastPlaceId} />
                <MealPlanCell label="점심" value={meal.lunch} placeId={meal.lunchPlaceId} />
                <MealPlanCell label="저녁" value={meal.dinner} placeId={meal.dinnerPlaceId} />
                <MealPlanCell label="한 잔 / 휴식" value={meal.extra} placeId={meal.extraPlaceId} />
              </div>
            ))}
          </div>
        </div>
      </section>
      <RestaurantPlanB />
    </div>
  )
}

function PrinciplesView() {
  return (
    <div className="portal-view">
      <ViewHero
        image="taipei-night.webp"
        eyebrow="OUR FAMILY PLAN"
        title="여행 원칙"
        description="모든 일정을 미리 열어두고, 셋이 함께 보고 이야기하며 완성해 갑니다."
      />
      <section className="principles section-pad">
        <div className="page-shell principles__layout">
          <div className="principles__intro">
            <span className="section-header__eyebrow">OUR PROMISE</span>
            <h2>같이 고르고<br />같이 바꾸는 여행</h2>
            <HeartHandshake size={54} strokeWidth={1.3} aria-hidden="true" />
          </div>
          <div className="principles__list">
            {principles.map((principle, index) => (
              <p key={principle}><span>{String(index + 1).padStart(2, '0')}</span>{principle}</p>
            ))}
            <blockquote>가치 있는 사치.<br /><strong>같이 있는 우리.</strong></blockquote>
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
          <p><ShieldCheck size={17} aria-hidden="true" /> 예약번호와 여권번호 등 민감정보는 저장하지 않습니다.</p>
          <div>
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
      budget: '가족여행 예산',
      minsung: '민성이 챙길 것',
      principles: '여행 원칙',
      tools: '현지 도구',
      guide: route.guide === 'guihou' ? '민성의 귀후어항 해산물 가이드' : '민성의 예류 지질 가이드',
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
      {route.view !== 'guide' && <OpeningSequence />}
      <a className="skip-link" href="#main">본문으로 바로가기</a>

      <header className="site-header">
        <div className="site-header__inner page-shell">
          <a className="site-header__brand" href="#home" aria-label="민성투어 홈으로">
            <Brand compact />
          </a>
          <nav className="desktop-nav" aria-label="주요 메뉴">
            {primaryNav.map((item) => (
              <a className={route.view === item.id || (route.view === 'minsung' && item.id === 'budget') ? 'is-active' : ''} href={item.href} aria-current={route.view === item.id || (route.view === 'minsung' && item.id === 'budget') ? 'page' : undefined} key={item.id}>
                {item.label}
              </a>
            ))}
          </nav>
          <Countdown compact />
        </div>
      </header>

      <main className={`portal-main ${route.view === 'guide' ? 'portal-main--guide' : ''}`} id="main" tabIndex={-1}>
        {route.view === 'home' && <HomeView />}
        {route.view === 'schedule' && <ScheduleView dayId={route.section ?? 'day-1'} />}
        {route.view === 'bookings' && <BookingsView tab={bookingTab} />}
        {route.view === 'food' && <FoodView />}
        {route.view === 'budget' && <Suspense fallback={<div className="budget-loading">개인 예산 화면을 준비하는 중…</div>}><BudgetDashboard /></Suspense>}
        {route.view === 'minsung' && <Suspense fallback={<div className="budget-loading">민성의 할 일을 준비하는 중…</div>}><BudgetDashboard mode="minsung" /></Suspense>}
        {route.view === 'principles' && <PrinciplesView />}
        {route.view === 'tools' && <LocalToolsView tab={toolsTab} />}
        {route.view === 'guide' && route.guide === 'guihou' && <Suspense fallback={<div className="yehliu-guide-loading">귀후어항 현장 가이드를 펼치는 중…</div>}><GuihouGuideView initialSection={route.section} /></Suspense>}
        {route.view === 'guide' && route.guide !== 'guihou' && <Suspense fallback={<div className="yehliu-guide-loading">예류 오프라인 가이드를 펼치는 중…</div>}><YehliuGuideView initialSection={route.section} /></Suspense>}
      </main>

      {(route.view === 'schedule' || route.view === 'tools') && <HotelReturnButton hotel={placeCatalog.hotel} />}

      {route.view !== 'guide' && <SiteFooter />}

      {route.view !== 'guide' && <nav className="mobile-primary-nav" aria-label="모바일 주요 메뉴">
        {mobileNav.map((item) => {
          const Icon = item.icon
          const active = route.view === item.id || (route.view === 'minsung' && item.id === 'budget')
          return (
            <a className={active ? 'is-active' : ''} href={item.href} aria-current={active ? 'page' : undefined} key={item.id}>
              <Icon size={21} aria-hidden="true" />
              <span>{item.shortLabel}</span>
            </a>
          )
        })}
      </nav>}
    </>
  )
}

export default App
