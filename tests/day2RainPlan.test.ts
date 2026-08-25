import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('Day 2 rainy Plan B is a complete independent Yilan route with a 16:30 LUMI hard stop', async () => {
  const source = await readFile(new URL('../src/data/weatherPlans.ts', import.meta.url), 'utf8')
  const routeOrder = [
    "placeId: 'hotel', label: 'Taipei Garden Hotel'",
    "placeId: 'yilan-traditional-arts'",
    "placeId: 'shisong-yilan-main'",
    "placeId: 'nikko-hill'",
    "placeId: 'huashan-1914'",
    "placeId: 'beihai-hangzhou'",
    "placeId: 'taihu-driftwood'",
    "placeId: 'hotel', label: '호텔'",
  ]
  let previous = source.indexOf('const dayTwoRainRoute')
  for (const marker of routeOrder) {
    const current = source.indexOf(marker, previous + 1)
    assert.ok(current > previous, `${marker} must stay in the final route order`)
    previous = current
  }
  assert.match(source, /theme: '이란 전통문화 · 자오시 차 · 화산 LP · 펑후 해산물',[\s\S]*?status: 'ready'/)
  assert.match(source, /08:30–16:30.*hard stop/)
  assert.match(source, /화산1914 도착 · LUMI 종료[\s\S]*?이 지점부터는 LUMI가 아니라 택시와 도보/)
  assert.match(source, /localName: '北海漁村海鮮餐廳 台北杭州店'/)
  assert.match(source, /tags: \['B안 저녁 1순위', '예약 전'/)
  assert.doesNotMatch(source, /北海漁村[\s\S]{0,500}예약 확정/)
  assert.match(source, /href: 'beihai-order-guide\.html'/)
})

test('Day 2 C is a separate placeholder and D recommendation suspends normal routing', async () => {
  const [plans, weather, section] = await Promise.all([
    '../src/data/weatherPlans.ts',
    '../src/lib/day2Weather.ts',
    '../src/components/DaySection.tsx',
  ].map((path) => readFile(new URL(path, import.meta.url), 'utf8')))
  const planCStart = plans.indexOf('const dayTwoHeavyRainRoute')
  const planCEnd = plans.indexOf("const dayPlanMeta", planCStart)
  const planCSource = plans.slice(planCStart, planCEnd)
  assert.match(planCSource, /B안 재사용 아님/)
  assert.doesNotMatch(planCSource, /拾松|日光山茶屋|北海漁村|臺虎西門/)
  assert.match(plans, /planC:[\s\S]*?status: 'draft'/)
  assert.match(weather, /decision\.weatherClass === 'B' \? 'plan-b' : 'plan-c'/)
  assert.match(section, /day2SafetyHold \? \([\s\S]*?PLAN D · SAFETY FIRST[\s\S]*?정상 관광 동선을 표시하지 않습니다/)
})

test('Beihai field guide provides the complete offline-friendly 3-person order tool', async () => {
  const guide = await readFile(new URL('../public/beihai-order-guide.html', import.meta.url), 'utf8')
  assert.match(guide, /<html lang="ko">/)
  assert.match(guide, /lang="zh-Hant"/)
  assert.match(guide, /음식 2,500–2,700 \+ 맥주 300–400/)
  assert.match(guide, /상한 NT\$3,200/)
  assert.match(guide, /我們三位，包含飲料的總預算大約是三千元/)
  assert.match(guide, /今天有當季的澎湖螃蟹嗎？哪一種肉最飽滿？/)
  assert.match(guide, /如果螃蟹今天很好，我們可以不要蝦。/)
  assert.match(guide, /不要抱卵的母蟹，我們想吃肉飽滿的。/)
  assert.equal((guide.match(/class="phrase-card"/g) ?? []).length, 12)
  assert.match(guide, /data-copy="coreRequest"/)
  assert.match(guide, /navigator\.clipboard\.writeText/)
  assert.match(guide, /document\.execCommand\('copy'\)/)
  assert.equal((guide.match(/href="\.\/#schedule\/day-2"/g) ?? []).length, 2)
  assert.doesNotMatch(guide, /<img|@import|fonts\.googleapis/)
})

test('Day 2 Plan B source is free of retired placeholder language and uses the data-driven guide link', async () => {
  const sources = await Promise.all([
    '../src/data/weatherPlans.ts',
    '../src/components/Day2WeatherDecisionCard.tsx',
    '../src/components/DaySection.tsx',
  ].map((path) => readFile(new URL(path, import.meta.url), 'utf8')))
  const combined = sources.join('\n')
  assert.doesNotMatch(combined, /Plan B\/C 우천 대안 준비 중|목적지 미확정|온천·좋은 실내 공간|동구 드롭|Syntrend/)
  assert.match(combined, /\$\{import\.meta\.env\.BASE_URL\}\$\{item\.guide\.href\}/)
  assert.match(combined, /day2-weather-decision__details/)
  assert.match(combined, /day-plan-glance/)
  assert.match(combined, /day-plan-route-drawer/)
  assert.match(combined, /compact=\{day\.id === 'day-2'\}/)
})

test('service worker generator recursively includes static guides in the versioned full cache', async () => {
  const source = await readFile(new URL('../scripts/generate-service-worker.mjs', import.meta.url), 'utf8')
  assert.match(source, /const files = await walk\(distDir\)/)
  assert.match(source, /const FULL_ASSETS =/)
  assert.match(source, /event\.request\.mode === 'navigate'/)
  assert.match(source, /runtime\.put\(event\.request, response\.clone\(\)\)/)
})
