import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('Korea departure vehicle is consistently the confirmed G90 LWB 4-seat', async () => {
  const sources = await Promise.all([
    '../src/App.tsx',
    '../src/data/trip.ts',
    '../src/data/koreaDepartureUpdate.ts',
  ].map((path) => readFile(new URL(path, import.meta.url), 'utf8')))
  const combined = sources.join('\n')

  assert.doesNotMatch(combined, /Chrysler|300C|Stretch Limousine|조건 재확인 예정/)
  assert.match(combined, /글로벌25시콜리무진/)
  assert.match(combined, /Genesis G90 Long Wheel Base 4인승/)
  assert.match(combined, /예약 확정/)
  assert.match(combined, /g90-lwb-4seat-rear\.webp/)
})

test('the G90 image metadata patch loads before the application renders', async () => {
  const source = await readFile(new URL('../src/main.tsx', import.meta.url), 'utf8')
  const imagePatch = source.indexOf("import './data/g90ImageSourceUpdate'")
  const appImport = source.indexOf("import App from './App'")

  assert.ok(imagePatch >= 0)
  assert.ok(appImport > imagePatch)
})

test('the confirmed Taiwan airport pickup patch loads before the application renders', async () => {
  const source = await readFile(new URL('../src/main.tsx', import.meta.url), 'utf8')
  const pickupPatch = source.indexOf("import './data/airportPickupUpdate'")
  const appImport = source.indexOf("import App from './App'")

  assert.ok(pickupPatch >= 0)
  assert.ok(appImport > pickupPatch)
})

test('Day 1 Taiwan airport pickup is consistently confirmed from TPE T2 to the hotel', async () => {
  const sources = await Promise.all([
    '../src/App.tsx',
    '../src/data/trip.ts',
    '../src/data/weatherPlans.ts',
    '../src/data/airportPickupUpdate.ts',
  ].map((path) => readFile(new URL(path, import.meta.url), 'utf8')))
  const combined = sources.join('\n')

  assert.match(combined, /타오위안공항 T2/)
  assert.match(combined, /Taipei Garden Hotel/)
  assert.match(combined, /Mercedes-Benz 항공의자 차량/)
  assert.match(combined, /예약 확정/)
  assert.match(combined, /airport-pickup-mercedes-cabin\.jpg/)
  assert.doesNotMatch(combined, /Mercedes 항공의자 차량 \?|우선 검토|최종 조건 확인 중|공항 픽업 후보/)
  assert.doesNotMatch(combined, /피켓 포함 NT\$1,700|최종 차량 요금은 NT\$1,700/)
})

test('public travel status no longer shows superseded pickup and rainy-day states', async () => {
  const sources = await Promise.all([
    '../src/App.tsx',
    '../src/data/trip.ts',
    '../src/data/weatherPlans.ts',
  ].map((path) => readFile(new URL(path, import.meta.url), 'utf8')))
  const combined = sources.join('\n')

  assert.doesNotMatch(combined, /예약금 송금 승인 대기|북해안 날씨 대응 버전|스펀폭포 우선 조절/)
  assert.match(combined, /宇航富豪/)
  assert.match(combined, /첫 예약금 송금 완료/)
  assert.match(combined, /이란 전통문화/)
  assert.match(combined, /16:30 hard stop/)
  assert.doesNotMatch(combined, /Plan B\/C 우천 대안 준비 중/)
})
