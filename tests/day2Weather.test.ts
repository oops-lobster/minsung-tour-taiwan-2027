import assert from 'node:assert/strict'
import test from 'node:test'
import {
  classifyDay2Weather,
  createDay2WeatherTestBundle,
  getDay2ForecastMode,
  type Day2WeatherBundle,
} from '../src/lib/day2Weather.ts'

const config = {
  date: '2027-02-21',
  representativeLocation: 'Taipei · Northern Taiwan',
  locations: [
    { id: 'yehliu', name: 'Yehliu', latitude: 25.2053, longitude: 121.6905 },
    { id: 'shifen', name: 'Shifen', latitude: 25.0434, longitude: 121.775 },
    { id: 'jiufen', name: 'Jiufen', latitude: 25.1099, longitude: 121.8452 },
  ],
  startHour: 9,
  endHour: 20,
  rainThreshold: 50,
}

test('completely fair Day 2 weather selects Plan A', () => {
  const decision = classifyDay2Weather(createDay2WeatherTestBundle(config, 'day2-a'))
  assert.equal(decision.weatherClass, 'A')
  assert.equal(decision.safetyState, 'normal')
  assert.equal(decision.confidence, 'high')
})

test('one short weak shower stays Plan A below the conservative boundary', () => {
  const bundle = createDay2WeatherTestBundle(config, 'day2-a')
  const yehliu = bundle.weatherByLocation.yehliu!
  const showerIndex = yehliu.hourly.time.findIndex((time) => time.endsWith('10:00'))
  yehliu.hourly.precipitation[showerIndex] = 1.5
  yehliu.hourly.precipitationProbability[showerIndex] = 45

  const decision = classifyDay2Weather(bundle)
  assert.equal(decision.weatherClass, 'A')
})

test('ordinary low-intensity persistent rain selects Plan B', () => {
  const decision = classifyDay2Weather(createDay2WeatherTestBundle(config, 'day2-b'))
  assert.equal(decision.weatherClass, 'B')
  assert.equal(decision.safetyState, 'normal')
  assert.ok(decision.reasons.length > 0)
})

test('strong persistent rain selects Plan C without becoming a safety hold', () => {
  const decision = classifyDay2Weather(createDay2WeatherTestBundle(config, 'day2-c'))
  assert.equal(decision.weatherClass, 'C')
  assert.equal(decision.safetyState, 'normal')
})

test('Yehliu strong gusts and high waves select Plan C even with little rain', () => {
  const bundle = createDay2WeatherTestBundle(config, 'day2-a')
  bundle.weatherByLocation.yehliu!.hourly.windGust.fill(55)
  bundle.marine!.hourly.waveHeight.fill(2.7)

  const decision = classifyDay2Weather(bundle)
  assert.equal(decision.weatherClass, 'C')
  assert.equal(decision.locations.find((location) => location.locationId === 'yehliu')?.risk, 'poor')
})

test('light rain isolated to Jiufen does not escalate the whole day to Plan C', () => {
  const bundle = createDay2WeatherTestBundle(config, 'day2-a')
  const jiufen = bundle.weatherByLocation.jiufen!
  jiufen.hourly.time.forEach((time, index) => {
    if (time.endsWith('16:00') || time.endsWith('17:00')) {
      jiufen.hourly.precipitationProbability[index] = 75
      jiufen.hourly.precipitation[index] = 0.6
    }
  })

  const decision = classifyDay2Weather(bundle)
  assert.equal(decision.weatherClass, 'B')
  assert.notEqual(decision.weatherClass, 'C')
})

test('marine failure keeps weather fallback but lowers confidence', () => {
  const bundle = createDay2WeatherTestBundle(config, 'day2-a')
  bundle.marine = undefined
  bundle.marineStatus = 'failed'

  const decision = classifyDay2Weather(bundle)
  assert.equal(decision.weatherClass, 'A')
  assert.equal(decision.confidence, 'low')
  assert.equal(decision.degraded, true)
  assert.match(decision.reasons.join(' '), /파고 데이터/)
})

test('all weather API failures produce an unavailable decision', () => {
  const bundle: Day2WeatherBundle = {
    tripDate: config.date,
    mode: 'NEAR_TERM',
    weatherByLocation: {},
    failedLocationIds: ['yehliu', 'shifen', 'jiufen'],
    marineStatus: 'failed',
  }
  const decision = classifyDay2Weather(bundle)
  assert.equal(decision.weatherClass, null)
  assert.equal(decision.confidence, 'unavailable')
  assert.equal(decision.degraded, true)
})

test('before D-7, today weather is shown as a clearly labelled preview', () => {
  const decision = classifyDay2Weather(createDay2WeatherTestBundle(config, 'day2-out-of-range'))
  assert.equal(decision.mode, 'OUT_OF_RANGE')
  assert.equal(decision.weatherClass, 'A')
  assert.equal(decision.confidence, 'low')
  assert.match(decision.reasons.join(' '), /여행일 예보는 아닙니다/)
})

test('Day 2 switches from today preview to trip forecast exactly at D-7', () => {
  assert.equal(getDay2ForecastMode(config.date, new Date('2027-02-13T12:00:00+08:00')), 'OUT_OF_RANGE')
  assert.equal(getDay2ForecastMode(config.date, new Date('2027-02-14T12:00:00+08:00')), 'NEAR_TERM')
  assert.equal(getDay2ForecastMode(config.date, new Date('2027-02-21T12:00:00+08:00')), 'LIVE')
})

test('extreme hazards stop normal A/B/C classification with safety override', () => {
  const decision = classifyDay2Weather(createDay2WeatherTestBundle(config, 'day2-safety'))
  assert.equal(decision.weatherClass, null)
  assert.equal(decision.safetyState, 'safety-hold')
  assert.match(decision.reasons.join(' '), /극심|돌풍|파고|뇌우/)
})
