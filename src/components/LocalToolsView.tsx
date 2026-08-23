import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  AppWindow,
  CarTaxiFront,
  Check,
  ChevronDown,
  ChevronRight,
  CloudSun,
  Copy,
  ExternalLink,
  HeartHandshake,
  Languages,
  MapPinned,
  MessageCircle,
  Navigation,
  PhoneCall,
  Plane,
  Smartphone,
  UtensilsCrossed,
} from 'lucide-react'
import { imageSourceByFile } from '../data/imageSources'
import {
  getPlaceDisplayHint,
  placeCatalog,
  rainPlans,
  restaurantFallbacks,
  streetSnacks,
  translationPhrases,
  travelApps,
} from '../data/localTools'
import { googleTranslateUrl } from '../lib/paths'
import { imagePath } from '../lib/paths'
import { ExchangeRateCard, useExchangeRate } from './ExchangeRateCard'
import { PlaceActions } from './PlaceActions'
import { SectionHeader } from './SectionHeader'
import { WeatherCard } from './WeatherCard'

export type ToolsTab = 'quick' | 'language' | 'weather' | 'guide'

const toolTabs: Array<{ id: ToolsTab; label: string }> = [
  { id: 'quick', label: '빠른 도구' },
  { id: 'language', label: '번역' },
  { id: 'weather', label: '날씨' },
  { id: 'guide', label: '간식·설치' },
]

const quickPlaceIds = ['hotel', 'longshan', 'palace', 'din-tai-fung-xinsheng', 'taipei-101', 'hizenya'] as const

const appIcons: Record<string, LucideIcon> = {
  maps: MapPinned,
  translate: Languages,
  uber: CarTaxiFront,
  '55688': PhoneCall,
  'line-go': MessageCircle,
  weather: CloudSun,
  flighty: Plane,
}

function ToolsHero() {
  const source = imageSourceByFile['taipei-night.webp']
  return (
    <section className="view-hero tools-hero" aria-labelledby="tools-title">
      <img src={imagePath('taipei-night.webp')} alt={source.alt} width="1600" height="1067" loading="eager" />
      <div className="view-hero__scrim" />
      <div className="view-hero__copy page-shell tools-hero__copy">
        <div>
          <span>LOCAL TRAVEL OS</span>
          <h1 id="tools-title">현지 도구</h1>
          <p>지도, 택시, 번역, 환율, 날씨를 민성 폰 한 화면에서 바로 사용합니다.</p>
        </div>
      </div>
    </section>
  )
}

function QuickTools() {
  const exchange = useExchangeRate()

  return (
    <>
      <section className="yehliu-tool-entry" aria-label="예류 현장 가이드 바로가기">
        <div className="page-shell">
          <a href="#guide/yehliu/gps">
            <span className="yehliu-tool-entry__icon" aria-hidden="true"><Navigation size={24} /></span>
            <span className="yehliu-tool-entry__copy">
              <small>YEHLIU LIVE GUIDE</small>
              <strong>예류 현장 GPS 가이드</strong>
              <span>실제 지도와 현재 위치로 다음 관찰 지점을 찾아가요.</span>
            </span>
            <span className="yehliu-tool-entry__action">가이드 열기 <ChevronRight size={18} aria-hidden="true" /></span>
          </a>
        </div>
      </section>

      <section className="tools-section section-pad">
        <div className="page-shell">
          <SectionHeader eyebrow="DAILY EXCHANGE" title="오늘의 대만달러 계산" description="하루 한 번 갱신되는 참고 환율로 대만달러를 원화로 빠르게 가늠합니다." />
          <ExchangeRateCard
            rate={exchange.rate}
            updatedAt={exchange.updatedAt}
            status={exchange.status}
            isRefreshing={exchange.isRefreshing}
            onRefresh={exchange.refresh}
          />
        </div>
      </section>

      <section className="tools-section tools-section--dark section-pad">
        <div className="page-shell">
          <SectionHeader eyebrow="ONE TAP DESTINATIONS" title="빠른 목적지" description="자주 쓰는 여섯 곳만 먼저 꺼냈습니다. 중국어 주소는 기사님께 크게 보여줄 수 있어요." inverse />
          <div className="quick-place-grid">
            {quickPlaceIds.map((id) => {
              const place = placeCatalog[id]
              const placeHint = getPlaceDisplayHint(place)
              return (
                <article className="quick-place-card" key={id}>
                  <small>{place.name}</small>
                  <h3 lang="zh-Hant">{place.localName}</h3>
                  {placeHint && <strong className="quick-place-card__hint">{placeHint}</strong>}
                  <p lang="zh-Hant">{place.address}</p>
                  <PlaceActions place={place} compact />
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <AppHub />

      <section className="budget-shortcut section-pad">
        <div className="page-shell">
          <HeartHandshake size={31} aria-hidden="true" />
          <div><small>FAMILY VIEW</small><h2>우리 여행 원칙</h2><p>셋이 함께 확인하고 바꿔가는 민성투어의 기준을 확인하세요.</p></div>
          <a href="#principles">원칙 화면 열기</a>
        </div>
      </section>
    </>
  )
}

function LanguageTools() {
  const [activePhrase, setActivePhrase] = useState<(typeof translationPhrases)[number] | null>(translationPhrases[0])
  const categories = ['기사님', '식당'] as const

  return (
    <section className="tools-section section-pad">
      <div className="page-shell language-layout">
        <SectionHeader eyebrow="SAY IT IN TAIWAN" title="번체 중국어 한 장" description="필요한 문장을 누르면 부모님도 함께 보기 쉬운 큰 글자로 표시합니다." />
        <div className="phrase-display" aria-live="polite">
          <small>{activePhrase?.category ?? '문장을 선택하세요'}</small>
          <p>{activePhrase?.korean}</p>
          <strong lang="zh-Hant">{activePhrase?.chinese}</strong>
          <a href={googleTranslateUrl(activePhrase?.korean)} target="_blank" rel="noreferrer">
            Google Translate에서 열기 <ExternalLink size={15} aria-hidden="true" />
          </a>
        </div>
        <div className="phrase-groups">
          {categories.map((category) => (
            <section key={category}>
              <h2>{category}</h2>
              <div>
                {translationPhrases.filter((phrase) => phrase.category === category).map((phrase) => (
                  <button type="button" onClick={() => setActivePhrase(phrase)} className={activePhrase?.korean === phrase.korean ? 'is-active' : ''} key={phrase.korean}>
                    <span>{phrase.korean}</span>
                    <small lang="zh-Hant">{phrase.chinese}</small>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
        <a className="translate-launch" href={googleTranslateUrl()} target="_blank" rel="noreferrer">
          <Languages size={20} aria-hidden="true" /> 자유 문장 번역하기 <ExternalLink size={15} aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}

function WeatherTools() {
  return (
    <>
      <section className="tools-section section-pad">
        <div className="page-shell">
          <SectionHeader eyebrow="RAIN OR SHINE" title="오늘 날씨와 판단 기준" description="숫자는 참고하고, 태풍·강풍은 반드시 대만 중앙기상서 공식 특보까지 확인합니다." />
          <WeatherCard />
        </div>
      </section>
      <section className="rain-plan-section section-pad" id="tools-weather-plans">
        <div className="page-shell">
          <SectionHeader eyebrow="ALL-DAY PLAN B" title="비가 오면?" description="모든 날에 미리 정해둔 축소 기준입니다. 일정표보다 날씨와 부모님 컨디션이 먼저예요." inverse />
          <div className="rain-plan-grid">
            {rainPlans.map((plan) => (
              <article key={plan.day}>
                <small>{plan.day}</small><h3>{plan.title}</h3>
                {plan.options.map((option) => <p key={option.condition}><strong>{option.condition}</strong><span>{option.action}</span></p>)}
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function SnackAtlas() {
  const [checked, setChecked] = useState<string[]>(() => {
    try { return JSON.parse(window.localStorage.getItem('minsung-tour-snacks-v2') ?? '[]') as string[] } catch { return [] }
  })
  const [showAll, setShowAll] = useState(false)

  const toggle = (id: string) => {
    const next = checked.includes(id) ? checked.filter((item) => item !== id) : [...checked, id]
    setChecked(next)
    window.localStorage.setItem('minsung-tour-snacks-v2', JSON.stringify(next))
  }

  return (
    <section className="snack-atlas section-pad">
      <div className="page-shell">
        <SectionHeader eyebrow="TAIWAN BITE LIST" title="길거리 간식 도감" description="보이면 반갑고, 못 먹어도 아쉽지 않은 발견 목록입니다. 먹은 간식은 이 기기에서 체크해 둘 수 있어요." />
        <div id="snack-list" className={`snack-grid ${showAll ? 'snack-grid--expanded' : ''}`}>
          {streetSnacks.map((snack, index) => {
            const eaten = checked.includes(snack.id)
            return (
              <article className={`${eaten ? 'is-eaten ' : ''}${index >= 4 ? 'snack-grid__extra' : ''}`.trim()} key={snack.id}>
                <img src={imagePath(snack.image)} alt={`${snack.name} 실제 음식 사진`} width="960" height="720" loading="lazy" decoding="async" />
                <div>
                  <small>{snack.where}</small>
                  <h3>{snack.name}</h3>
                  <p lang="zh-Hant">{snack.localName}</p>
                  <span>{snack.situation}</span>
                  <button type="button" onClick={() => toggle(snack.id)} aria-pressed={eaten}>
                    <Check size={18} aria-hidden="true" /> {eaten ? '먹음' : '먹으면 체크'}
                  </button>
                </div>
              </article>
            )
          })}
        </div>
        <button
          className="snack-grid-toggle"
          type="button"
          aria-controls="snack-list"
          aria-expanded={showAll}
          onClick={() => setShowAll((current) => !current)}
        >
          {showAll ? '간식 목록 접기' : `간식 ${streetSnacks.length - 4}개 더 보기`}
          <ChevronDown size={18} aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}

function InstallGuide() {
  const [copied, setCopied] = useState(false)
  const userAgent = navigator.userAgent
  const isKakao = /KAKAOTALK/i.test(userAgent)
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent)
  const currentUrl = window.location.href
  const current = new URL(currentUrl)
  const chromeUrl = isIOS
    ? `googlechrome://${current.host}${current.pathname}${current.search}${current.hash}`
    : `intent://${current.host}${current.pathname}#Intent;scheme=${current.protocol.replace(':', '')};package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(currentUrl)};end`

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className="install-guide section-pad">
      <div className="page-shell">
        <SectionHeader eyebrow="KEEP IT ON HOME" title="홈 화면에 설치하기" description="앱스토어 없이 이 여행 가이드를 아이콘처럼 바로 열 수 있습니다." inverse />
        {isKakao && (
          <div className="kakao-notice" role="status">
            <strong>카카오톡 안에서 열렸어요.</strong>
            <p>{isIOS ? 'iPhone은 Safari로 옮긴 뒤 홈 화면에 추가해 주세요.' : 'Galaxy는 Chrome 또는 Samsung Internet으로 옮겨 주세요.'}</p>
            <div>
              <a href={currentUrl} target="_blank" rel="noreferrer">Safari로 열기</a>
              <a href={chromeUrl}>Chrome으로 열기</a>
              <button type="button" onClick={copyAddress}>{copied ? '주소 복사됨' : '주소 복사'}</button>
            </div>
          </div>
        )}
        <div className="install-grid">
          <article>
            <Smartphone size={28} aria-hidden="true" /><small>iPhone · Safari</small><h3>공유 → 홈 화면에 추가</h3>
            <ol><li>아래 공유 버튼을 누릅니다.</li><li>‘홈 화면에 추가’를 찾습니다.</li><li>오른쪽 위 ‘추가’를 누릅니다.</li></ol>
            <a href={currentUrl} target="_blank" rel="noreferrer">Safari로 열기</a>
          </article>
          <article>
            <AppWindow size={28} aria-hidden="true" /><small>Galaxy · Chrome</small><h3>더보기 → 홈 화면에 추가</h3>
            <ol><li>오른쪽 위 더보기(⋮)를 누릅니다.</li><li>‘홈 화면에 추가’를 선택합니다.</li><li>Samsung Internet은 메뉴의 ‘현재 페이지 추가’를 사용합니다.</li></ol>
            <a href={chromeUrl}>Chrome으로 열기</a>
          </article>
        </div>
        <button className="copy-site-address" type="button" onClick={copyAddress}><Copy size={18} aria-hidden="true" /> {copied ? '주소를 복사했어요' : '사이트 주소 복사'}</button>
        <p className="install-caveat">iPhone의 카카오톡 브라우저는 Safari 강제 전환을 막을 수 있습니다. 그때는 주소 복사 후 Safari 주소창에 붙여넣어 주세요.</p>
      </div>
    </section>
  )
}

export function RestaurantPlanB() {
  return (
    <section className="restaurant-plan section-pad">
      <div className="page-shell">
        <SectionHeader eyebrow="MEAL BACKUP" title="식당 Plan B" description="휴무, 긴 웨이팅, 부모님 컨디션에 대응하는 대체 원칙입니다." />
        <div className="restaurant-plan-grid">
          {restaurantFallbacks.map((meal) => (
            <article key={meal.day}>
              <header><small>{meal.day}</small><span>대체 가능</span></header>
              <div><b>A</b><p><small>PLAN A</small><strong>{meal.planA}</strong>{meal.planAPlaceId && <em>{getPlaceDisplayHint(placeCatalog[meal.planAPlaceId])}</em>}</p></div>
              <div><b>B</b><p><small>PLAN B</small><strong>{meal.planB}</strong></p></div>
              <footer>{meal.reason}</footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function AppHub() {
  return (
    <section className="app-hub section-pad">
      <div className="page-shell">
        <SectionHeader eyebrow="LOCAL APP HUB" title="현지 앱 허브" description="무엇을 언제 쓰는지와 설치 링크를 한곳에 모았습니다." />
        <div className="app-grid">
          {travelApps.map((app) => {
            const Icon = appIcons[app.id] ?? Smartphone
            return (
              <article key={app.id}>
                <Icon size={25} aria-hidden="true" />
                <div><h3>{app.name}</h3><p>{app.use}</p></div>
                <div><a href={app.ios} target="_blank" rel="noreferrer">iPhone</a><a href={app.android} target="_blank" rel="noreferrer">Galaxy</a></div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function GuideTools() {
  return <><SnackAtlas /><RestaurantPlanB /><InstallGuide /></>
}

export function LocalToolsView({ tab }: { tab: ToolsTab }) {
  return (
    <div className="portal-view portal-view--tools">
      <ToolsHero />
      <nav className="section-tabs section-tabs--tools" aria-label="현지 도구 세부 메뉴">
        <div className="page-shell">
          {toolTabs.map((item) => (
            <a className={tab === item.id ? 'is-active' : ''} href={`#tools/${item.id}`} aria-current={tab === item.id ? 'page' : undefined} key={item.id}>{item.label}</a>
          ))}
        </div>
      </nav>
      {tab === 'quick' && <QuickTools />}
      {tab === 'language' && <LanguageTools />}
      {tab === 'weather' && <WeatherTools />}
      {tab === 'guide' && <GuideTools />}
    </div>
  )
}
