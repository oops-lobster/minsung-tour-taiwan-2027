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
  assert.match(combined, /Plan A 축소판 아님/)
})
