import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import test from 'node:test'
import { days } from '../src/data/itinerary/index.ts'
import { guides, guideById } from '../src/data/guides.ts'
import { placeCatalog } from '../src/data/localTools.ts'
import { dayRoutes } from '../src/data/dayRoutes.ts'
import { getDayPlans } from '../src/data/weatherPlans.ts'

test('canonical itinerary, route and guide references resolve', async () => {
  for (const day of days) {
    for (const plan of getDayPlans(day)) {
      for (const item of plan.schedule) {
        if (item.placeId) assert.ok(item.placeId in placeCatalog, `${day.id} timeline place ${item.placeId}`)
        if (item.guideId) assert.ok(guideById[item.guideId], `${day.id} guide ${item.guideId}`)
      }
    }
    for (const stop of dayRoutes[day.id].stops) assert.ok(stop.placeId in placeCatalog, `${day.id} route place ${stop.placeId}`)
  }
  for (const guide of guides) {
    assert.ok(guide.placeId in placeCatalog, `guide place ${guide.placeId}`)
    if (guide.kind === 'static-html') await access(new URL(`../public/${guide.href}`, import.meta.url))
  }
})

test('application boot has no side-effect data updates and local tools derive from registries', async () => {
  const [main, tools] = await Promise.all([
    readFile(new URL('../src/main.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/components/LocalToolsView.tsx', import.meta.url), 'utf8'),
  ])
  assert.doesNotMatch(main, /data\/.*Update/)
  assert.doesNotMatch(tools, /rainPlans/)
  assert.match(tools, /conditionPolicySummaries/)
  assert.match(tools, /GuideHub/)
})
