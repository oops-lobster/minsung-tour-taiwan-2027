import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('Day 2 sunny Plan A keeps the finalized order and official 21:00 ending', async () => {
  const base = await readFile(new URL('../src/data/trip.ts', import.meta.url), 'utf8')
  const update = await readFile(new URL('../src/data/day2GuihouUpdate.ts', import.meta.url), 'utf8')
  const weather = await readFile(new URL('../src/data/weatherPlans.ts', import.meta.url), 'utf8')

  const markers = [
    "time: '06:30–07:30'",
    "time: '08:15 로비 · 08:30 출발'",
    "time: '09:20–10:45'",
    "time: '10:55–12:10'",
    "time: '12:10–13:00'",
    "time: '13:00–14:00'",
    "time: '14:10–15:20'",
    "time: '15:20 이후'",
    "time: '16:15 전후'",
    "time: '16:15–17:20'",
    "time: '17:30–18:45'",
    "time: '18:45–19:05'",
    "time: '19:05–20:15'",
    "time: '20:15–21:00'",
    "time: '21:00–21:30'",
    "time: '21:30–23:00 · 선택'",
  ]
  const baseMarkers = markers.slice(0, 3).concat(markers.slice(5, 9))
  const updateMarkers = markers.slice(3, 5).concat(markers.slice(9))

  for (const marker of baseMarkers) assert.match(base, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
  let previous = -1
  for (const marker of updateMarkers) {
    const current = update.indexOf(marker)
    assert.ok(current > previous, `${marker} must appear after the previous finalized stop`)
    previous = current
  }

  assert.match(update, /tags: \['Day 2 본편 종료', '21:00 호텔 목표'\]/)
  assert.match(update, /21:00 호텔 도착과 함께 Day 2 공식 본편은 끝/)
  assert.match(update, /optional: true,[\s\S]*'HIDDEN STAGE'/)
  assert.match(weather, /21:00 호텔 복귀로 끝나는 맑은 날 확정안/)
  assert.match(weather, /'day-2':[\s\S]*status: 'draft'/)
})

test('public Day 2 sources do not contain protected budget totals', async () => {
  const publicSources = await Promise.all([
    '../src/data/day2GuihouUpdate.ts',
    '../src/data/trip.ts',
    '../src/data/weatherPlans.ts',
    '../src/components/DaySection.tsx',
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
