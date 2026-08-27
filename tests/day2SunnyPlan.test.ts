import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { day2 } from '../src/data/itinerary/day2.ts'

test('Day 2 sunny Plan A keeps the finalized order and official 21:00 ending', async () => {
  const weather = await readFile(new URL('../src/data/weatherPlans.ts', import.meta.url), 'utf8')

  const markers = [
    '06:30–07:30', '08:15 로비 · 08:30 출발', '09:20–10:45', '10:55–12:10', '12:10–13:00', '13:00–14:00',
    '14:10–15:20', '15:20 이후', '16:15 전후', '16:15–17:20', '17:30–18:45', '18:45–19:05', '19:05–20:15',
    '20:15–21:00', '21:00–21:30', '21:30–23:00 · 선택',
  ]
  assert.deepEqual(day2.schedule.map((item) => item.time), markers)
  assert.ok(day2.schedule.some((item) => item.tags?.includes('Day 2 본편 종료')))
  assert.ok(day2.schedule.some((item) => item.description.includes('Day 2 공식 본편은 끝')))
  assert.ok(day2.schedule.some((item) => item.optional && item.tags?.includes('HIDDEN STAGE')))
  assert.match(weather, /21:00 호텔 복귀로 끝나는 맑은 날 확정안/)
  assert.match(weather, /'day-2':[\s\S]*status: 'draft'/)
})

test('public Day 2 sources do not contain protected budget totals', async () => {
  const publicSources = await Promise.all([
    '../src/data/itinerary/day2.ts',
    '../src/data/trip.ts',
    '../src/data/weatherPlans.ts',
    '../src/components/DaySection.tsx',
    '../src/components/Day2WeatherDecisionCard.tsx',
    '../src/components/WeatherProvider.tsx',
    '../src/lib/day2Weather.ts',
  ].map((path) => readFile(new URL(path, import.meta.url), 'utf8')))

  const combined = publicSources.join('\n')
  assert.doesNotMatch(combined, /23,?660|23,?500|26,?000|Day 2 맑음 플랜 예비비/)
})

test('budget migration is idempotent and never rewrites the LUMI reservation', async () => {
  const migration = await readFile(new URL('../supabase/migrations/20260823141544_finalize_day2_sunny_budget.sql', import.meta.url), 'utf8')
  assert.match(migration, /on conflict \(trip_id, trip_day, item_name\) do update/)
  assert.match(migration, /day2_total is distinct from 26000/)
  assert.match(migration, /lumi_total is distinct from 15000/)
  assert.doesNotMatch(migration, /update\s+public\.reservations/i)
  assert.doesNotMatch(migration, /insert\s+into\s+public\.reservations/i)
})
