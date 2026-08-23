import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

import { guihouCookStalls, guihouFreshStalls, guihouOperationSteps } from '../src/data/guihouMarket.ts'
import { guihouPhrases, guihouPriceConfirmationPhraseIds } from '../src/data/guihouPhrases.ts'
import { dayRoutes } from '../src/data/dayRoutes.ts'
import { calculateGuihouCart, calculateGuihouItem, getGuihouLimitState, taijinToGuihouGrams } from '../src/lib/guihouPrice.ts'
import { GUIHOU_SESSION_KEY, sanitizeGuihouSession } from '../src/lib/useGuihouFieldSession.ts'

test('official market snapshot keeps the current 1F and 2F stall numbering', () => {
  assert.deepEqual(guihouFreshStalls.map(({ id }) => id), [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20, 21, 22, 23, 25, 26, 27, 28, 29, 30, 31, 32, 33, 35, 36])
  assert.deepEqual(guihouCookStalls.map(({ id }) => id), [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13])
  assert.equal(guihouFreshStalls.length, 32)
  assert.equal(guihouCookStalls.length, 12)
  assert.equal(guihouOperationSteps.length, 11)
})

test('Day 2 route uses Guihou instead of the retired lunch placeholder', () => {
  assert.ok(dayRoutes['day-2'].stops.some(({ placeId }) => placeId === 'guihou'))
  assert.ok(!dayRoutes['day-2'].stops.some(({ placeId }) => placeId === 'qiao-yan'))
})

test('seafood calculator handles 台斤, kg, fixed prices, cooking fees and cart totals', () => {
  assert.equal(taijinToGuihouGrams(1.2), 720)

  const taijin = calculateGuihouItem({ id: 'a', nameKo: '도미', priceMode: 'per-taijin', unitPrice: 500, weightTaijin: 1.2, cookingFee: 100 })
  const kilogram = calculateGuihouItem({ id: 'b', nameKo: '새우', priceMode: 'per-kg', unitPrice: 900, weightGrams: 500, cookingFee: 50 })
  const fixed = calculateGuihouItem({ id: 'c', nameKo: '사시미', priceMode: 'fixed', fixedPrice: 380 })
  const cart = calculateGuihouCart([
    { id: 'a', nameKo: '도미', priceMode: 'per-taijin', unitPrice: 500, weightTaijin: 1.2, cookingFee: 100 },
    { id: 'b', nameKo: '새우', priceMode: 'per-kg', unitPrice: 900, weightGrams: 500, cookingFee: 50 },
    { id: 'c', nameKo: '사시미', priceMode: 'fixed', fixedPrice: 380 },
  ])

  assert.deepEqual(taijin, { ingredientCost: 600, cookingFee: 100, total: 700, grams: 720, valid: true })
  assert.deepEqual(kilogram, { ingredientCost: 450, cookingFee: 50, total: 500, grams: 500, valid: true })
  assert.deepEqual(fixed, { ingredientCost: 380, cookingFee: 0, total: 380, valid: true })
  assert.equal(cart.total, 1580)
  assert.equal(cart.valid, true)
})

test('calculator rejects incomplete inputs and emits 80/100 percent limit states', () => {
  const invalid = calculateGuihouItem({ id: 'x', nameKo: '생선', priceMode: 'per-taijin', unitPrice: 500 })
  assert.equal(invalid.valid, false)
  assert.match(invalid.issue ?? '', /무게/)
  assert.equal(getGuihouLimitState(0, undefined), 'none')
  assert.equal(getGuihouLimitState(799, 1000), 'safe')
  assert.equal(getGuihouLimitState(800, 1000), 'near')
  assert.equal(getGuihouLimitState(1000, 1000), 'over')
})

test('field session sanitizes untrusted local data and remains device-local', async () => {
  const session = sanitizeGuihouSession({
    currentStep: 99,
    completedSteps: [0, 0, 8, 99, '3'],
    shortlistedFreshStalls: [12, 12, -1],
    selectedFreshStalls: [17],
    languageFavorites: ['a', 'a', ''],
    customPhrases: [' 하나 ', '둘'],
    mealLimit: -10,
    notes: 'a'.repeat(2500),
    items: [{ id: 'ok', nameKo: '생선', priceMode: 'fixed', fixedPrice: 100 }, { id: 'bad' }],
  })
  assert.equal(session.currentStep, 10)
  assert.deepEqual(session.completedSteps, [0, 8])
  assert.deepEqual(session.shortlistedFreshStalls, [12])
  assert.deepEqual(session.languageFavorites, ['a'])
  assert.deepEqual(session.customPhrases, ['하나', '둘'])
  assert.equal(session.mealLimit, undefined)
  assert.equal(session.notes?.length, 2000)
  assert.equal(session.items.length, 1)
  assert.match(GUIHOU_SESSION_KEY, /guihou-field-session/)

  const source = await readFile(new URL('../src/lib/useGuihouFieldSession.ts', import.meta.url), 'utf8')
  assert.doesNotMatch(source, /supabase|fetch\(|XMLHttpRequest|navigator\.sendBeacon/i)
  assert.match(source, /localStorage/)
})

test('offline phrasebook keeps all required display and price-confirmation fields', () => {
  assert.ok(guihouPhrases.length >= 20)
  for (const phrase of guihouPhrases) {
    assert.ok(phrase.korean)
    assert.ok(phrase.traditionalChinese)
    assert.ok(phrase.pinyin)
    assert.ok(phrase.toneNumbers)
    assert.ok(phrase.koreanPronunciation)
  }
  assert.deepEqual(guihouPriceConfirmationPhraseIds, [
    'harbor-price-per-jin', 'harbor-weight', 'guihou-seafood-subtotal', 'harbor-cooking-fee', 'harbor-total', 'harbor-wait-before-cutting',
  ])
})

test('Guihou route and lazy entry are included in app routing and offline guide caching', async () => {
  const app = await readFile(new URL('../src/App.tsx', import.meta.url), 'utf8')
  const serviceWorker = await readFile(new URL('../scripts/generate-service-worker.mjs', import.meta.url), 'utf8')
  assert.match(app, /section === 'guihou'/)
  assert.match(app, /GuihouGuideView/)
  assert.match(serviceWorker, /#guide\/guihou/)
  assert.match(serviceWorker, /Yehliu\|Guihou/)
})

test('Day 2 keeps the Shifen mini guides alongside the Guihou field guide', async () => {
  const daySection = await readFile(new URL('../src/components/DaySection.tsx', import.meta.url), 'utf8')
  assert.match(daySection, /shifen-waterfall\.html/)
  assert.match(daySection, /shifen-old-street\.html/)
  assert.match(daySection, /#guide\/guihou/)
})
