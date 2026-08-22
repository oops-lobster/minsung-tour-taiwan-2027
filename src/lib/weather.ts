export const RAIN_PLAN_THRESHOLD = 50
export const STRONG_RAIN_THRESHOLD = 70
export const STRONG_WIND_SPEED_THRESHOLD = 30
export const STRONG_WIND_GUST_THRESHOLD = 40
export const HEAVY_RAIN_AMOUNT_THRESHOLD = 5

const TAIPEI_TIME_ZONE = 'Asia/Taipei'
const WEATHER_CACHE_KEY = 'minsung-tour-taipei-weather-v1'
const WEATHER_CACHE_TTL = 30 * 60 * 1000

export type WeatherLoadStatus = 'loading' | 'ready' | 'error'
export type WeatherPlanId = 'plan-a' | 'plan-b' | 'plan-b2'
export type WeatherRecommendationMode = 'today-preview' | 'trip-forecast' | 'trip-day-live' | 'fallback'
export type WeatherRecommendationStrength = 'default' | 'recommended' | 'strong'
export type WeatherTestMode = 'sun' | 'rain' | 'error' | 'forecast'

export interface WeatherLocation {
  id: string
  name: string
  latitude: number
  longitude: number
}

export interface DayWeatherConfig {
  date: string
  representativeLocation: string
  locations?: WeatherLocation[]
  startHour: number
  endHour: number
  rainThreshold: number
}

export interface TaiwanWeatherDataset {
  latitude: number
  longitude: number
  timezone: string
  fetchedAt: number
  current: {
    time: string
    temperature: number
    precipitation: number
    weatherCode: number
    windSpeed: number
  }
  hourly: {
    time: string[]
    precipitationProbability: number[]
    precipitation: number[]
    windSpeed: number[]
    windGust: number[]
  }
  daily: {
    time: string[]
    precipitationProbabilityMax: number[]
    precipitationSum: number[]
    windSpeedMax: number[]
    windGustMax: number[]
  }
}

export interface WeatherPlanRecommendation {
  recommendedPlanId: WeatherPlanId
  mode: WeatherRecommendationMode
  strength: WeatherRecommendationStrength
  rainProbability?: number
  precipitation?: number
  windSpeed?: number
  windGust?: number
  sourceDate?: string
  reason: string
}

interface RecommendationOptions {
  dataset: TaiwanWeatherDataset | null
  status: WeatherLoadStatus
  config: DayWeatherConfig
  now?: Date
  testMode?: WeatherTestMode | null
}

interface WeatherWindowSummary {
  rainProbability?: number
  precipitation?: number
  windSpeed?: number
  windGust?: number
  currentPrecipitation?: number
}

interface OpenMeteoPayload {
  latitude: number
  longitude: number
  timezone: string
  current: {
    time: string
    temperature_2m: number
    precipitation: number
    weather_code: number
    wind_speed_10m: number
  }
  hourly: {
    time: string[]
    precipitation_probability: number[]
    precipitation: number[]
    wind_speed_10m: number[]
    wind_gusts_10m: number[]
  }
  daily: {
    time: string[]
    precipitation_probability_max: number[]
    precipitation_sum: number[]
    wind_speed_10m_max: number[]
    wind_gusts_10m_max: number[]
  }
}

const finiteValues = (values: Array<number | undefined>) => values.filter((value): value is number => Number.isFinite(value))

const maximum = (values: Array<number | undefined>) => {
  const valid = finiteValues(values)
  return valid.length > 0 ? Math.max(...valid) : undefined
}

const total = (values: Array<number | undefined>) => {
  const valid = finiteValues(values)
  return valid.length > 0 ? valid.reduce((sum, value) => sum + value, 0) : undefined
}

export const taipeiDateString = (date: Date) => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TAIPEI_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? ''
  return `${part('year')}-${part('month')}-${part('day')}`
}

export const readWeatherTestMode = (isDevelopment: boolean, search: string): WeatherTestMode | null => {
  if (!isDevelopment) return null
  const value = new URLSearchParams(search).get('weatherTest')
  return value === 'sun' || value === 'rain' || value === 'error' || value === 'forecast' ? value : null
}

const hasWeatherDate = (dataset: TaiwanWeatherDataset, date: string) => (
  dataset.hourly.time.some((time) => time.startsWith(date)) || dataset.daily.time.includes(date)
)

const getWeatherWindow = (
  dataset: TaiwanWeatherDataset,
  date: string,
  startHour: number,
  endHour: number,
): WeatherWindowSummary | null => {
  const hourlyIndexes: number[] = []
  const currentHour = Number(dataset.current.time.slice(11, 13))
  const currentPrecipitation = dataset.current.time.startsWith(date)
    && currentHour >= startHour
    && currentHour <= endHour
      ? dataset.current.precipitation
      : undefined
  dataset.hourly.time.forEach((time, index) => {
    if (!time.startsWith(date)) return
    const hour = Number(time.slice(11, 13))
    if (hour >= startHour && hour <= endHour) hourlyIndexes.push(index)
  })

  if (hourlyIndexes.length > 0) {
    return {
      rainProbability: maximum(hourlyIndexes.map((index) => dataset.hourly.precipitationProbability[index])),
      precipitation: total(hourlyIndexes.map((index) => dataset.hourly.precipitation[index])),
      windSpeed: maximum(hourlyIndexes.map((index) => dataset.hourly.windSpeed[index])),
      windGust: maximum(hourlyIndexes.map((index) => dataset.hourly.windGust[index])),
      currentPrecipitation,
    }
  }

  const dailyIndex = dataset.daily.time.indexOf(date)
  if (dailyIndex < 0) return null

  return {
    rainProbability: dataset.daily.precipitationProbabilityMax[dailyIndex],
    precipitation: dataset.daily.precipitationSum[dailyIndex],
    windSpeed: dataset.daily.windSpeedMax[dailyIndex],
    windGust: dataset.daily.windGustMax[dailyIndex],
    currentPrecipitation,
  }
}

const buildReason = (
  mode: WeatherRecommendationMode,
  summary: WeatherWindowSummary,
  recommendedPlanId: WeatherPlanId,
  strong: boolean,
) => {
  const subject = mode === 'trip-day-live'
    ? '오늘 주요 시간대'
    : mode === 'trip-forecast'
      ? '여행일 주요 시간대'
      : '오늘 현지 주요 시간대'

  const strongWind = (summary.windGust ?? 0) >= STRONG_WIND_GUST_THRESHOLD
    || (summary.windSpeed ?? 0) >= STRONG_WIND_SPEED_THRESHOLD

  if (strongWind) return `${subject}에 강한 바람 가능성이 있어 실내·축소 플랜을 강하게 추천해요.`
  if ((summary.currentPrecipitation ?? 0) >= 0.2) return `${subject}에 비가 내리고 있어 우천 플랜을 먼저 보여드려요.`
  if (summary.rainProbability !== undefined) {
    if (recommendedPlanId === 'plan-b') {
      return `${subject} 강수확률이 ${Math.round(summary.rainProbability)}%${strong ? '로 높아' : '여서'} 우천 플랜을 먼저 보여드려요.`
    }
    return `${subject} 강수확률이 ${Math.round(summary.rainProbability)}%로 낮아 기본 플랜을 먼저 보여드려요.`
  }
  if ((summary.precipitation ?? 0) > 0) return `${subject} 예상 강수량을 기준으로 우천 플랜을 먼저 보여드려요.`
  return `${subject} 날씨 기준으로 기본 플랜을 먼저 보여드려요.`
}

const recommendationFromWindow = (
  mode: Exclude<WeatherRecommendationMode, 'fallback'>,
  sourceDate: string,
  summary: WeatherWindowSummary,
  rainThreshold: number,
): WeatherPlanRecommendation => {
  const strongWind = (summary.windGust ?? 0) >= STRONG_WIND_GUST_THRESHOLD
    || (summary.windSpeed ?? 0) >= STRONG_WIND_SPEED_THRESHOLD
  const strongRain = (summary.rainProbability ?? 0) >= STRONG_RAIN_THRESHOLD
    || (summary.precipitation ?? 0) >= HEAVY_RAIN_AMOUNT_THRESHOLD
  const rainingNow = (summary.currentPrecipitation ?? 0) >= 0.2
  const recommendRain = strongWind || strongRain || rainingNow || (summary.rainProbability ?? 0) >= rainThreshold
  const strong = recommendRain && (strongWind || strongRain)
  const recommendedPlanId: WeatherPlanId = recommendRain ? 'plan-b' : 'plan-a'

  return {
    recommendedPlanId,
    mode,
    strength: strong ? 'strong' : 'recommended',
    rainProbability: summary.rainProbability,
    precipitation: summary.precipitation,
    windSpeed: summary.windSpeed,
    windGust: summary.windGust,
    sourceDate,
    reason: buildReason(mode, summary, recommendedPlanId, strong),
  }
}

export const getWeatherPlanRecommendation = ({
  dataset,
  status,
  config,
  now = new Date(),
  testMode = null,
}: RecommendationOptions): WeatherPlanRecommendation => {
  if (testMode === 'error') {
    return {
      recommendedPlanId: 'plan-a',
      mode: 'fallback',
      strength: 'default',
      reason: '날씨 정보를 불러오지 못해 기본 일정 순서로 보여드리고 있어요.',
    }
  }
  if (testMode === 'sun' || testMode === 'rain') {
    return recommendationFromWindow('today-preview', taipeiDateString(now), {
      rainProbability: testMode === 'rain' ? 70 : 20,
      precipitation: testMode === 'rain' ? 6 : 0,
      windSpeed: testMode === 'rain' ? 18 : 8,
      windGust: testMode === 'rain' ? 28 : 14,
    }, config.rainThreshold)
  }
  if (testMode === 'forecast') {
    return recommendationFromWindow('trip-forecast', config.date, {
      rainProbability: 20,
      precipitation: 0,
      windSpeed: 9,
      windGust: 16,
    }, config.rainThreshold)
  }

  if (status !== 'ready' || !dataset) {
    return {
      recommendedPlanId: 'plan-a',
      mode: 'fallback',
      strength: 'default',
      reason: status === 'loading'
        ? '날씨를 확인하는 동안 기본 일정 순서로 먼저 보여드리고 있어요.'
        : '날씨 정보를 불러오지 못해 기본 일정 순서로 보여드리고 있어요.',
    }
  }

  const today = taipeiDateString(now)
  const hasTripForecast = hasWeatherDate(dataset, config.date)
  const sourceDate = hasTripForecast ? config.date : today
  const mode: Exclude<WeatherRecommendationMode, 'fallback'> = hasTripForecast
    ? today === config.date ? 'trip-day-live' : 'trip-forecast'
    : 'today-preview'
  const summary = getWeatherWindow(dataset, sourceDate, config.startHour, config.endHour)

  if (!summary) {
    return {
      recommendedPlanId: 'plan-a',
      mode: 'fallback',
      strength: 'default',
      reason: '해당 시간대 날씨가 없어 기본 일정 순서로 보여드리고 있어요.',
    }
  }

  return recommendationFromWindow(mode, sourceDate, summary, config.rainThreshold)
}

const readCachedDataset = () => {
  try {
    const raw = window.localStorage.getItem(WEATHER_CACHE_KEY)
    if (!raw) return null
    const cached = JSON.parse(raw) as TaiwanWeatherDataset
    return Date.now() - cached.fetchedAt < WEATHER_CACHE_TTL ? cached : null
  } catch {
    return null
  }
}

const cacheDataset = (dataset: TaiwanWeatherDataset) => {
  try {
    window.localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify(dataset))
  } catch {
    // Weather still works when storage is unavailable.
  }
}

let weatherRequest: Promise<TaiwanWeatherDataset> | null = null

export const fetchTaipeiWeather = async (force = false): Promise<TaiwanWeatherDataset> => {
  if (!force) {
    const cached = readCachedDataset()
    if (cached) return cached
    if (weatherRequest) return weatherRequest
  }

  const params = new URLSearchParams({
    latitude: '25.033',
    longitude: '121.5654',
    current: 'temperature_2m,precipitation,weather_code,wind_speed_10m',
    hourly: 'precipitation_probability,precipitation,wind_speed_10m,wind_gusts_10m',
    daily: 'precipitation_probability_max,precipitation_sum,wind_speed_10m_max,wind_gusts_10m_max',
    forecast_days: '16',
    timezone: TAIPEI_TIME_ZONE,
  })

  const request = fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`)
    .then(async (response) => {
      if (!response.ok) throw new Error('weather-request-failed')
      const data = await response.json() as OpenMeteoPayload
      const dataset: TaiwanWeatherDataset = {
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone,
        fetchedAt: Date.now(),
        current: {
          time: data.current.time,
          temperature: data.current.temperature_2m,
          precipitation: data.current.precipitation,
          weatherCode: data.current.weather_code,
          windSpeed: data.current.wind_speed_10m,
        },
        hourly: {
          time: data.hourly.time,
          precipitationProbability: data.hourly.precipitation_probability,
          precipitation: data.hourly.precipitation,
          windSpeed: data.hourly.wind_speed_10m,
          windGust: data.hourly.wind_gusts_10m,
        },
        daily: {
          time: data.daily.time,
          precipitationProbabilityMax: data.daily.precipitation_probability_max,
          precipitationSum: data.daily.precipitation_sum,
          windSpeedMax: data.daily.wind_speed_10m_max,
          windGustMax: data.daily.wind_gusts_10m_max,
        },
      }
      cacheDataset(dataset)
      return dataset
    })
    .finally(() => {
      if (weatherRequest === request) weatherRequest = null
    })

  weatherRequest = request
  return request
}

export const getTodayWeatherSummary = (dataset: TaiwanWeatherDataset, now = new Date()) => {
  const today = taipeiDateString(now)
  const dailyIndex = dataset.daily.time.indexOf(today)
  return {
    temperature: dataset.current.temperature,
    precipitation: dataset.current.precipitation,
    precipitationProbability: dailyIndex >= 0 ? dataset.daily.precipitationProbabilityMax[dailyIndex] : undefined,
    windSpeed: dataset.current.windSpeed,
    windGust: dailyIndex >= 0 ? dataset.daily.windGustMax[dailyIndex] : undefined,
    weatherCode: dataset.current.weatherCode,
    updatedAt: new Intl.DateTimeFormat('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: TAIPEI_TIME_ZONE,
    }).format(new Date(dataset.fetchedAt)),
  }
}
