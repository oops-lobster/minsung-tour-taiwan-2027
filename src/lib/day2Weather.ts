import type {
  DayWeatherConfig,
  WeatherLocation,
  WeatherPlanRecommendation,
} from './weather'

const TAIPEI_TIME_ZONE = 'Asia/Taipei'

const taipeiDateString = (date: Date) => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TAIPEI_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? ''
  return `${part('year')}-${part('month')}-${part('day')}`
}

export type Day2WeatherClass = 'A' | 'B' | 'C'
export type Day2SafetyState = 'normal' | 'safety-hold'
export type LocationRisk = 'good' | 'caution' | 'poor'
export type Day2ForecastMode = 'OUT_OF_RANGE' | 'PREVIEW' | 'NEAR_TERM' | 'LIVE'
export type Day2Confidence = 'high' | 'medium' | 'low' | 'unavailable'
export type Day2WeatherTestMode =
  | 'day2-a'
  | 'day2-b'
  | 'day2-c'
  | 'day2-safety'
  | 'day2-partial-error'
  | 'day2-out-of-range'

export interface Day2WeatherWindow {
  locationId: 'yehliu' | 'shifen' | 'jiufen'
  koreanName: string
  localName: string
  startHour: number
  endHour: number
  displayEndMinute?: number
}

export const DAY2_WEATHER_WINDOWS: Day2WeatherWindow[] = [
  { locationId: 'yehliu', koreanName: '예류', localName: '野柳', startHour: 9, endHour: 11 },
  { locationId: 'shifen', koreanName: '스펀', localName: '十分', startHour: 13, endHour: 15, displayEndMinute: 30 },
  { locationId: 'jiufen', koreanName: '지우펀', localName: '九份', startHour: 16, endHour: 20, displayEndMinute: 30 },
]

const weatherWindowLabel = (window: Day2WeatherWindow) => (
  `${String(window.startHour).padStart(2, '0')}:00–${String(window.endHour).padStart(2, '0')}:${String(window.displayEndMinute ?? 0).padStart(2, '0')}`
)

// These are conservative family-trip schedule-selection thresholds, not official
// closure, road-control, maritime-safety, or government warning standards.
export const DAY2_WEATHER_THRESHOLDS = {
  planB: {
    precipitationProbability: 50,
    maxHourlyPrecipitation: 2,
    windGust: 40,
    waveHeight: 2,
  },
  planC: {
    maxHourlyPrecipitation: 5,
    persistentRainRate: 0.5,
    persistentRainHours: 3,
    highPrecipitationProbability: 75,
    meaningfulHourlyPrecipitation: 2,
    windGust: 50,
    waveHeight: 2.5,
  },
  safety: {
    extremeHourlyPrecipitation: 15,
    extremeWindGust: 75,
    extremeWaveHeight: 4,
    severeWeatherCodes: [95, 96, 99],
  },
  forecastHorizonDays: 16,
  nearTermDays: 7,
} as const

export interface LocationWeatherDataset {
  location: WeatherLocation
  timezone: string
  fetchedAt: number
  current?: {
    time: string
    precipitation: number
    weatherCode: number
    windSpeed: number
    windGust: number
  }
  hourly: {
    time: string[]
    precipitationProbability: number[]
    precipitation: number[]
    weatherCode: number[]
    windSpeed: number[]
    windGust: number[]
  }
}

export interface MarineWeatherDataset {
  location: WeatherLocation
  timezone: string
  fetchedAt: number
  hourly: {
    time: string[]
    waveHeight: Array<number | undefined>
    windWaveHeight: Array<number | undefined>
    wavePeriod: Array<number | undefined>
  }
}

export interface Day2WeatherBundle {
  tripDate: string
  analysisDate?: string
  mode: Day2ForecastMode
  fetchedAt?: number
  weatherByLocation: Partial<Record<Day2WeatherWindow['locationId'], LocationWeatherDataset>>
  marine?: MarineWeatherDataset
  failedLocationIds: Day2WeatherWindow['locationId'][]
  marineStatus: 'ready' | 'failed' | 'skipped'
  testMode?: Day2WeatherTestMode
}

export interface Day2LocationAssessment {
  locationId: Day2WeatherWindow['locationId']
  koreanName: string
  localName: string
  windowLabel: string
  available: boolean
  risk?: LocationRisk
  precipitationProbability?: number
  maxHourlyPrecipitation?: number
  precipitationTotal?: number
  windSpeed?: number
  windGust?: number
  weatherCodes: number[]
  persistentRainHours?: number
  waveHeight?: number
  windWaveHeight?: number
  wavePeriod?: number
  note: string
}

export interface Day2WeatherDecision {
  weatherClass: Day2WeatherClass | null
  safetyState: Day2SafetyState
  confidence: Day2Confidence
  mode: Day2ForecastMode
  degraded: boolean
  reasons: string[]
  locations: Day2LocationAssessment[]
  fetchedAt?: number
}

interface ForecastApiPayload {
  timezone: string
  current?: {
    time: string
    precipitation: number
    weather_code: number
    wind_speed_10m: number
    wind_gusts_10m: number
  }
  hourly: {
    time: string[]
    precipitation_probability: number[]
    precipitation: number[]
    weather_code: number[]
    wind_speed_10m: number[]
    wind_gusts_10m: number[]
  }
}

interface MarineApiPayload {
  timezone: string
  hourly: {
    time: string[]
    wave_height: Array<number | null>
    wind_wave_height?: Array<number | null>
    wave_period?: Array<number | null>
  }
}

const CACHE_TTL = 30 * 60 * 1000
const WEATHER_CACHE_PREFIX = 'minsung-tour-weather-location-v1'
const MARINE_CACHE_PREFIX = 'minsung-tour-marine-location-v1'
const weatherRequests = new Map<string, Promise<LocationWeatherDataset>>()
const marineRequests = new Map<string, Promise<MarineWeatherDataset>>()

const finiteValues = (values: Array<number | undefined>) => values.filter((value): value is number => Number.isFinite(value))
const maximum = (values: Array<number | undefined>) => {
  const valid = finiteValues(values)
  return valid.length > 0 ? Math.max(...valid) : undefined
}
const sum = (values: Array<number | undefined>) => {
  const valid = finiteValues(values)
  return valid.length > 0 ? valid.reduce((total, value) => total + value, 0) : undefined
}

const daysBetween = (from: string, to: string) => (
  Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000)
)

export const getDay2ForecastMode = (tripDate: string, now = new Date()): Day2ForecastMode => {
  const dayDistance = daysBetween(taipeiDateString(now), tripDate)
  if (dayDistance === 0) return 'LIVE'
  if (dayDistance > 0 && dayDistance <= DAY2_WEATHER_THRESHOLDS.nearTermDays) return 'NEAR_TERM'
  // Until seven days before departure, show today's comparable weather as a
  // clearly labelled preview. The actual trip-date forecast starts at D-7.
  return 'OUT_OF_RANGE'
}

export const readDay2WeatherTestMode = (isDevelopment: boolean, search: string): Day2WeatherTestMode | null => {
  if (!isDevelopment) return null
  const value = new URLSearchParams(search).get('weatherTest')
  const modes: Day2WeatherTestMode[] = [
    'day2-a',
    'day2-b',
    'day2-c',
    'day2-safety',
    'day2-partial-error',
    'day2-out-of-range',
  ]
  return modes.includes(value as Day2WeatherTestMode) ? value as Day2WeatherTestMode : null
}

const readCache = <T extends { fetchedAt: number }>(key: string): T | null => {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return null
    const value = JSON.parse(raw) as T
    return Date.now() - value.fetchedAt < CACHE_TTL ? value : null
  } catch {
    return null
  }
}

const writeCache = (key: string, value: unknown) => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Partial weather operation remains available when storage is unavailable.
  }
}

export const fetchWeatherForLocation = async (
  location: WeatherLocation,
  force = false,
): Promise<LocationWeatherDataset> => {
  const cacheKey = `${WEATHER_CACHE_PREFIX}:${location.id}`
  const inFlight = weatherRequests.get(cacheKey)
  if (inFlight) return inFlight
  if (!force) {
    const cached = readCache<LocationWeatherDataset>(cacheKey)
    if (cached) return cached
  }

  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current: 'precipitation,weather_code,wind_speed_10m,wind_gusts_10m',
    hourly: 'precipitation_probability,precipitation,weather_code,wind_speed_10m,wind_gusts_10m',
    forecast_days: String(DAY2_WEATHER_THRESHOLDS.forecastHorizonDays),
    timezone: TAIPEI_TIME_ZONE,
  })

  const request = fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`)
    .then(async (response) => {
      if (!response.ok) throw new Error(`weather-request-failed:${location.id}`)
      const data = await response.json() as ForecastApiPayload
      const dataset: LocationWeatherDataset = {
        location,
        timezone: data.timezone,
        fetchedAt: Date.now(),
        current: data.current ? {
          time: data.current.time,
          precipitation: data.current.precipitation,
          weatherCode: data.current.weather_code,
          windSpeed: data.current.wind_speed_10m,
          windGust: data.current.wind_gusts_10m,
        } : undefined,
        hourly: {
          time: data.hourly.time,
          precipitationProbability: data.hourly.precipitation_probability,
          precipitation: data.hourly.precipitation,
          weatherCode: data.hourly.weather_code,
          windSpeed: data.hourly.wind_speed_10m,
          windGust: data.hourly.wind_gusts_10m,
        },
      }
      writeCache(cacheKey, dataset)
      return dataset
    })
    .finally(() => weatherRequests.delete(cacheKey))

  weatherRequests.set(cacheKey, request)
  return request
}

export const fetchMarineWeatherForLocation = async (
  location: WeatherLocation,
  force = false,
): Promise<MarineWeatherDataset> => {
  const cacheKey = `${MARINE_CACHE_PREFIX}:${location.id}`
  const inFlight = marineRequests.get(cacheKey)
  if (inFlight) return inFlight
  if (!force) {
    const cached = readCache<MarineWeatherDataset>(cacheKey)
    if (cached) return cached
  }

  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    hourly: 'wave_height,wind_wave_height,wave_period',
    forecast_days: String(DAY2_WEATHER_THRESHOLDS.forecastHorizonDays),
    timezone: TAIPEI_TIME_ZONE,
  })

  const request = fetch(`https://marine-api.open-meteo.com/v1/marine?${params.toString()}`)
    .then(async (response) => {
      if (!response.ok) throw new Error(`marine-request-failed:${location.id}`)
      const data = await response.json() as MarineApiPayload
      const dataset: MarineWeatherDataset = {
        location,
        timezone: data.timezone,
        fetchedAt: Date.now(),
        hourly: {
          time: data.hourly.time,
          waveHeight: data.hourly.wave_height.map((value) => value ?? undefined),
          windWaveHeight: (data.hourly.wind_wave_height ?? []).map((value) => value ?? undefined),
          wavePeriod: (data.hourly.wave_period ?? []).map((value) => value ?? undefined),
        },
      }
      writeCache(cacheKey, dataset)
      return dataset
    })
    .finally(() => marineRequests.delete(cacheKey))

  marineRequests.set(cacheKey, request)
  return request
}

const createHourlyFixture = (
  location: WeatherLocation,
  tripDate: string,
  values: { probability: number; precipitation: number; code?: number; wind?: number; gust?: number },
): LocationWeatherDataset => {
  const hours = Array.from({ length: 12 }, (_, index) => index + 9)
  return {
    location,
    timezone: TAIPEI_TIME_ZONE,
    fetchedAt: Date.now(),
    hourly: {
      time: hours.map((hour) => `${tripDate}T${String(hour).padStart(2, '0')}:00`),
      precipitationProbability: hours.map(() => values.probability),
      precipitation: hours.map(() => values.precipitation),
      weatherCode: hours.map(() => values.code ?? 1),
      windSpeed: hours.map(() => values.wind ?? 12),
      windGust: hours.map(() => values.gust ?? 22),
    },
  }
}

const createMarineFixture = (
  location: WeatherLocation,
  tripDate: string,
  waveHeight: number,
): MarineWeatherDataset => {
  const hours = Array.from({ length: 3 }, (_, index) => index + 9)
  return {
    location,
    timezone: TAIPEI_TIME_ZONE,
    fetchedAt: Date.now(),
    hourly: {
      time: hours.map((hour) => `${tripDate}T${String(hour).padStart(2, '0')}:00`),
      waveHeight: hours.map(() => waveHeight),
      windWaveHeight: hours.map(() => Math.max(0, waveHeight - 0.3)),
      wavePeriod: hours.map(() => 6.5),
    },
  }
}

export const createDay2WeatherTestBundle = (
  config: DayWeatherConfig,
  testMode: Day2WeatherTestMode,
): Day2WeatherBundle => {
  const locations = Object.fromEntries((config.locations ?? []).map((location) => [location.id, location]))
  const todayPreview = testMode === 'day2-out-of-range'
  const analysisDate = todayPreview ? '2026-08-24' : config.date
  const preset = testMode === 'day2-a' || todayPreview
    ? { probability: 25, precipitation: 0.1, gust: 24, wave: 1.1 }
    : testMode === 'day2-b' || testMode === 'day2-partial-error'
      ? { probability: 65, precipitation: 0.4, gust: 42, wave: 1.7 }
      : testMode === 'day2-c'
        ? { probability: 88, precipitation: 5.5, gust: 55, wave: 2.7 }
        : { probability: 98, precipitation: 18, gust: 82, wave: 4.4, code: 95 }
  const weatherByLocation: Day2WeatherBundle['weatherByLocation'] = {}

  for (const window of DAY2_WEATHER_WINDOWS) {
    const location = locations[window.locationId]
    if (!location || (testMode === 'day2-partial-error' && window.locationId === 'shifen')) continue
    weatherByLocation[window.locationId] = createHourlyFixture(location, analysisDate, preset)
  }

  const yehliu = locations.yehliu
  const marineFailed = testMode === 'day2-partial-error' || !yehliu
  return {
    tripDate: config.date,
    analysisDate,
    mode: todayPreview ? 'OUT_OF_RANGE' : 'NEAR_TERM',
    fetchedAt: Date.now(),
    weatherByLocation,
    marine: marineFailed ? undefined : createMarineFixture(yehliu, analysisDate, preset.wave),
    failedLocationIds: testMode === 'day2-partial-error' ? ['shifen'] : [],
    marineStatus: marineFailed ? 'failed' : 'ready',
    testMode,
  }
}

export const fetchDay2WeatherBundle = async (
  config: DayWeatherConfig,
  options: { force?: boolean; now?: Date; testMode?: Day2WeatherTestMode | null } = {},
): Promise<Day2WeatherBundle> => {
  if (options.testMode) return createDay2WeatherTestBundle(config, options.testMode)
  const now = options.now ?? new Date()
  const mode = getDay2ForecastMode(config.date, now)
  const analysisDate = mode === 'OUT_OF_RANGE' ? taipeiDateString(now) : config.date

  const locations = (config.locations ?? []).filter((location) => (
    DAY2_WEATHER_WINDOWS.some((window) => window.locationId === location.id)
  ))
  const yehliu = locations.find((location) => location.id === 'yehliu')
  const requests: Array<Promise<LocationWeatherDataset | MarineWeatherDataset>> = [
    ...locations.map((location) => fetchWeatherForLocation(location, options.force)),
    ...(yehliu ? [fetchMarineWeatherForLocation(yehliu, options.force)] : []),
  ]
  const results = await Promise.allSettled(requests)
  const weatherByLocation: Day2WeatherBundle['weatherByLocation'] = {}
  const failedLocationIds: Day2WeatherBundle['failedLocationIds'] = []

  locations.forEach((location, index) => {
    const result = results[index]
    if (result?.status === 'fulfilled') {
      weatherByLocation[location.id as Day2WeatherWindow['locationId']] = result.value as LocationWeatherDataset
    } else {
      failedLocationIds.push(location.id as Day2WeatherWindow['locationId'])
    }
  })

  const marineResult = yehliu ? results[locations.length] : undefined
  const marine = marineResult?.status === 'fulfilled' ? marineResult.value as MarineWeatherDataset : undefined
  const fetchedTimes = [
    ...Object.values(weatherByLocation).map((dataset) => dataset?.fetchedAt),
    marine?.fetchedAt,
  ].filter((value): value is number => Number.isFinite(value))

  return {
    tripDate: config.date,
    analysisDate,
    mode,
    fetchedAt: fetchedTimes.length > 0 ? Math.max(...fetchedTimes) : undefined,
    weatherByLocation,
    marine,
    failedLocationIds,
    marineStatus: marine ? 'ready' : 'failed',
  }
}

const indexesForWindow = (times: string[], tripDate: string, startHour: number, endHour: number) => {
  const indexes: number[] = []
  times.forEach((time, index) => {
    if (!time.startsWith(tripDate)) return
    const hour = Number(time.slice(11, 13))
    if (hour >= startHour && hour <= endHour) indexes.push(index)
  })
  return indexes
}

const maximumConsecutiveAtLeast = (values: number[], threshold: number) => {
  let longest = 0
  let current = 0
  values.forEach((value) => {
    current = value >= threshold ? current + 1 : 0
    longest = Math.max(longest, current)
  })
  return longest
}

const assessLocation = (
  bundle: Day2WeatherBundle,
  window: Day2WeatherWindow,
): Day2LocationAssessment => {
  const dataset = bundle.weatherByLocation[window.locationId]
  const analysisDate = bundle.analysisDate ?? bundle.tripDate
  const windowLabel = weatherWindowLabel(window)
  if (!dataset) {
    return {
      ...window,
      windowLabel,
      available: false,
      weatherCodes: [],
      note: '이 구간의 기상 데이터를 불러오지 못했습니다.',
    }
  }

  const indexes = indexesForWindow(dataset.hourly.time, analysisDate, window.startHour, window.endHour)
  if (indexes.length === 0) {
    return {
      ...window,
      windowLabel,
      available: false,
      weatherCodes: [],
      note: bundle.mode === 'OUT_OF_RANGE' ? '오늘 시간대별 데이터가 없습니다.' : '여행일 시간별 데이터가 아직 없습니다.',
    }
  }

  const precipitation = indexes.map((index) => dataset.hourly.precipitation[index])
  const assessment: Day2LocationAssessment = {
    ...window,
    windowLabel,
    available: true,
    precipitationProbability: maximum(indexes.map((index) => dataset.hourly.precipitationProbability[index])),
    maxHourlyPrecipitation: maximum(precipitation),
    precipitationTotal: sum(precipitation),
    windSpeed: maximum(indexes.map((index) => dataset.hourly.windSpeed[index])),
    windGust: maximum(indexes.map((index) => dataset.hourly.windGust[index])),
    weatherCodes: Array.from(new Set(indexes.map((index) => dataset.hourly.weatherCode[index]).filter(Number.isFinite))),
    persistentRainHours: maximumConsecutiveAtLeast(precipitation, DAY2_WEATHER_THRESHOLDS.planC.persistentRainRate),
    note: '',
  }

  const currentHour = dataset.current ? Number(dataset.current.time.slice(11, 13)) : -1
  if (bundle.mode === 'LIVE'
    && dataset.current?.time.startsWith(analysisDate)
    && currentHour >= window.startHour
    && currentHour <= window.endHour) {
    assessment.maxHourlyPrecipitation = maximum([assessment.maxHourlyPrecipitation, dataset.current.precipitation])
    assessment.windSpeed = maximum([assessment.windSpeed, dataset.current.windSpeed])
    assessment.windGust = maximum([assessment.windGust, dataset.current.windGust])
    assessment.weatherCodes = Array.from(new Set([...assessment.weatherCodes, dataset.current.weatherCode]))
  }

  if (window.locationId === 'yehliu' && bundle.marine) {
    const marineIndexes = indexesForWindow(bundle.marine.hourly.time, analysisDate, window.startHour, window.endHour)
    assessment.waveHeight = maximum(marineIndexes.map((index) => bundle.marine?.hourly.waveHeight[index]))
    assessment.windWaveHeight = maximum(marineIndexes.map((index) => bundle.marine?.hourly.windWaveHeight[index]))
    assessment.wavePeriod = maximum(marineIndexes.map((index) => bundle.marine?.hourly.wavePeriod[index]))
  }

  const isPoor = (assessment.maxHourlyPrecipitation ?? 0) >= DAY2_WEATHER_THRESHOLDS.planC.maxHourlyPrecipitation
    || (assessment.persistentRainHours ?? 0) >= DAY2_WEATHER_THRESHOLDS.planC.persistentRainHours
    || ((assessment.precipitationProbability ?? 0) >= DAY2_WEATHER_THRESHOLDS.planC.highPrecipitationProbability
      && (assessment.maxHourlyPrecipitation ?? 0) >= DAY2_WEATHER_THRESHOLDS.planC.meaningfulHourlyPrecipitation)
    || (assessment.windGust ?? 0) >= DAY2_WEATHER_THRESHOLDS.planC.windGust
    || (assessment.waveHeight ?? 0) >= DAY2_WEATHER_THRESHOLDS.planC.waveHeight
  const isCaution = (assessment.precipitationProbability ?? 0) >= DAY2_WEATHER_THRESHOLDS.planB.precipitationProbability
    || (assessment.maxHourlyPrecipitation ?? 0) >= DAY2_WEATHER_THRESHOLDS.planB.maxHourlyPrecipitation
    || (assessment.windGust ?? 0) >= DAY2_WEATHER_THRESHOLDS.planB.windGust
    || (assessment.waveHeight ?? 0) >= DAY2_WEATHER_THRESHOLDS.planB.waveHeight

  assessment.risk = isPoor ? 'poor' : isCaution ? 'caution' : 'good'
  assessment.note = assessment.risk === 'poor'
    ? window.locationId === 'jiufen' ? '야간 산책 강도를 현장에서 다시 판단합니다.' : '야외 구간을 적극 조정할 가능성이 큽니다.'
    : assessment.risk === 'caution'
      ? window.locationId === 'jiufen' ? '우비를 준비하면 진행 가능한 우천 범위입니다.' : '우비와 미끄럼 대비가 필요한 구간입니다.'
      : '현재 기준으로 기존 동선을 유지할 수 있습니다.'
  return assessment
}

const safetyReasonsFor = (location: Day2LocationAssessment) => {
  if (!location.available) return []
  const reasons: string[] = []
  if ((location.maxHourlyPrecipitation ?? 0) >= DAY2_WEATHER_THRESHOLDS.safety.extremeHourlyPrecipitation) {
    reasons.push(`${location.koreanName} 극심한 시간당 강수 ${location.maxHourlyPrecipitation?.toFixed(1)}mm/h`)
  }
  if ((location.windGust ?? 0) >= DAY2_WEATHER_THRESHOLDS.safety.extremeWindGust) {
    reasons.push(`${location.koreanName} 매우 강한 돌풍 ${Math.round(location.windGust ?? 0)}km/h`)
  }
  if ((location.waveHeight ?? 0) >= DAY2_WEATHER_THRESHOLDS.safety.extremeWaveHeight) {
    reasons.push(`예류 매우 높은 파고 ${location.waveHeight?.toFixed(1)}m`)
  }
  if (location.weatherCodes.some((code) => DAY2_WEATHER_THRESHOLDS.safety.severeWeatherCodes.includes(code as 95 | 96 | 99))) {
    reasons.push(`${location.koreanName} 뇌우성 위험 기상 신호`)
  }
  return reasons
}

const classificationReasonsFor = (locations: Day2LocationAssessment[], weatherClass: Day2WeatherClass) => {
  if (weatherClass === 'A') {
    const yehliu = locations.find((location) => location.locationId === 'yehliu')
    return [
      '세 구간의 강수와 돌풍이 가족 야외 일정용 보수 기준 아래입니다.',
      yehliu?.waveHeight !== undefined
        ? `예류 예상 파고도 ${yehliu.waveHeight.toFixed(1)}m로 주의 기준보다 낮습니다.`
        : '예류 파고는 확인되지 않아 현장 해안 상태를 함께 봅니다.',
    ]
  }

  const reasons: string[] = []
  locations.filter((location) => location.available).forEach((location) => {
    if ((location.maxHourlyPrecipitation ?? 0) >= DAY2_WEATHER_THRESHOLDS.planC.maxHourlyPrecipitation) {
      reasons.push(`${location.koreanName} 최대 강수 ${location.maxHourlyPrecipitation?.toFixed(1)}mm/h`)
    } else if ((location.persistentRainHours ?? 0) >= DAY2_WEATHER_THRESHOLDS.planC.persistentRainHours) {
      reasons.push(`${location.koreanName}에 ${location.persistentRainHours}시간 이상 이어지는 비`)
    } else if ((location.precipitationProbability ?? 0) >= DAY2_WEATHER_THRESHOLDS.planB.precipitationProbability) {
      reasons.push(`${location.koreanName} 최대 강수확률 ${Math.round(location.precipitationProbability ?? 0)}%`)
    }
    if ((location.windGust ?? 0) >= DAY2_WEATHER_THRESHOLDS.planB.windGust) {
      reasons.push(`${location.koreanName} 돌풍 ${Math.round(location.windGust ?? 0)}km/h`)
    }
    if ((location.waveHeight ?? 0) >= DAY2_WEATHER_THRESHOLDS.planB.waveHeight) {
      reasons.push(`예류 예상 파고 ${location.waveHeight?.toFixed(1)}m`)
    }
  })
  return reasons.length > 0
    ? reasons.slice(0, 3)
    : [weatherClass === 'C' ? '야외 구간을 적극 조정할 기상 신호가 있습니다.' : '일부 구간에 우천 대비가 필요합니다.']
}

export const classifyDay2Weather = (bundle: Day2WeatherBundle): Day2WeatherDecision => {
  const locations = DAY2_WEATHER_WINDOWS.map((window) => assessLocation(bundle, window))
  const availableCount = locations.filter((location) => location.available).length
  const degraded = availableCount < DAY2_WEATHER_WINDOWS.length || bundle.marineStatus !== 'ready'
  if (availableCount === 0) {
    return {
      weatherClass: null,
      safetyState: 'normal',
      confidence: 'unavailable',
      mode: bundle.mode,
      degraded: true,
      reasons: ['모든 지역의 시간별 기상 데이터를 불러오지 못해 판정할 수 없습니다.'],
      locations,
      fetchedAt: bundle.fetchedAt,
    }
  }

  const safetyReasons = locations.flatMap(safetyReasonsFor)
  if (safetyReasons.length > 0) {
    return {
      weatherClass: null,
      safetyState: 'safety-hold',
      confidence: degraded ? 'low' : 'high',
      mode: bundle.mode,
      degraded,
      reasons: safetyReasons.slice(0, 3),
      locations,
      fetchedAt: bundle.fetchedAt,
    }
  }

  const weatherClass: Day2WeatherClass = locations.some((location) => location.risk === 'poor')
    ? 'C'
    : locations.some((location) => location.risk === 'caution') ? 'B' : 'A'
  const reasons = classificationReasonsFor(locations, weatherClass)
  if (bundle.mode === 'OUT_OF_RANGE') {
    reasons.unshift('오늘 북부 대만의 같은 시간대 자료로 미리 보는 화면이며, 2027-02-21 여행일 예보는 아닙니다.')
  }
  if (bundle.marineStatus === 'failed') reasons.push('예류 파고 데이터가 없어 기상·바람 기준으로만 판정했습니다.')
  if (bundle.failedLocationIds.length > 0) reasons.push('일부 지역 데이터가 없어 확인된 구간만으로 판정했습니다.')

  return {
    weatherClass,
    safetyState: 'normal',
    confidence: degraded || bundle.mode === 'OUT_OF_RANGE' ? 'low' : bundle.mode === 'PREVIEW' ? 'medium' : 'high',
    mode: bundle.mode,
    degraded,
    reasons: reasons.slice(0, 3),
    locations,
    fetchedAt: bundle.fetchedAt,
  }
}

export const day2DecisionToPlanRecommendation = (
  decision: Day2WeatherDecision,
  tripDate: string,
): WeatherPlanRecommendation => {
  if (decision.safetyState === 'safety-hold') {
    return {
      recommendedPlanId: 'plan-a',
      mode: 'fallback',
      strength: 'strong',
      reason: '안전 확인이 끝날 때까지 자동 일정 추천을 중지합니다.',
      suspended: true,
    }
  }
  if (!decision.weatherClass) {
    return {
      recommendedPlanId: 'plan-a',
      mode: 'fallback',
      strength: 'default',
      reason: decision.reasons[0] ?? '여행일 예보가 없어 자동 판정을 보류합니다.',
      suspended: true,
    }
  }
  return {
    recommendedPlanId: decision.weatherClass === 'A' ? 'plan-a' : 'plan-b',
    mode: decision.mode === 'OUT_OF_RANGE' ? 'today-preview' : decision.mode === 'LIVE' ? 'trip-day-live' : 'trip-forecast',
    strength: decision.weatherClass === 'C' ? 'strong' : 'recommended',
    sourceDate: tripDate,
    reason: decision.reasons.join(' '),
  }
}
