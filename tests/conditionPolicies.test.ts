import assert from 'node:assert/strict'
import test from 'node:test'
import { evaluateRainOnly } from '../src/domain/conditions/policies.ts'
import { getWeatherPlanRecommendation, type TaiwanWeatherDataset } from '../src/lib/weather.ts'
import { dayWeatherConfigs } from '../src/data/weatherPlans.ts'

const windyDry: TaiwanWeatherDataset = {
  latitude: 25.033, longitude: 121.5654, timezone: 'Asia/Taipei', fetchedAt: Date.now(),
  current: { time: '2026-08-27T14:00', temperature: 25, precipitation: 0, weatherCode: 0, windSpeed: 38, windGust: 58 },
  hourly: { time: ['2026-08-27T14:00'], precipitationProbability: [10], precipitation: [0], windSpeed: [38], windGust: [58] },
  daily: { time: ['2026-08-27'], precipitationProbabilityMax: [10], precipitationSum: [0], windSpeedMax: [38], windGustMax: [58] },
}

test('rain-only threshold ignores probability without meaningful amount', () => {
  assert.equal(evaluateRainOnly({ rainProbability: 90, precipitation: 0 }), false)
  assert.equal(evaluateRainOnly({ rainProbability: 60, precipitation: .4 }), true)
  assert.equal(evaluateRainOnly({ currentPrecipitation: .2 }), true)
})

test('Day 1 and Day 3 stay Plan A in strong wind when dry', () => {
  for (const dayId of ['day-1', 'day-3']) {
    const result = getWeatherPlanRecommendation({ dataset: windyDry, status: 'ready', config: dayWeatherConfigs[dayId], now: new Date('2026-08-27T06:00:00Z') })
    assert.equal(result.recommendedPlanId, 'plan-a')
    assert.match(result.reason, /바람은 강하지만/)
  }
})
