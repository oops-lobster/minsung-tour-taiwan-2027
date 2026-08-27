import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  fetchTaipeiWeather,
  type TaiwanWeatherDataset,
  type WeatherLoadStatus,
} from '../lib/weather'
import {
  fetchDay2WeatherBundle,
  readDay2WeatherTestMode,
  type Day2WeatherBundle,
} from '../lib/day2Weather'
import { dayWeatherConfigs } from '../data/weatherPlans'
import { fetchYehliuOperation, type YehliuOperationSnapshot } from '../domain/conditions/yehliuOperation'

interface Day2WeatherContextValue {
  bundle: Day2WeatherBundle | null
  status: WeatherLoadStatus
  refresh: () => Promise<void>
  operation: YehliuOperationSnapshot | null
}

interface WeatherContextValue {
  dataset: TaiwanWeatherDataset | null
  status: WeatherLoadStatus
  refresh: () => Promise<void>
  day2: Day2WeatherContextValue
}

const WeatherContext = createContext<WeatherContextValue | null>(null)

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [dataset, setDataset] = useState<TaiwanWeatherDataset | null>(null)
  const [status, setStatus] = useState<WeatherLoadStatus>('loading')
  const [day2Bundle, setDay2Bundle] = useState<Day2WeatherBundle | null>(null)
  const [day2Status, setDay2Status] = useState<WeatherLoadStatus>('loading')
  const [operation, setOperation] = useState<YehliuOperationSnapshot | null>(null)
  const day2TestMode = readDay2WeatherTestMode(import.meta.env.DEV, window.location.search)

  const loadWeather = useCallback(async (force = false) => {
    setStatus('loading')
    try {
      const nextDataset = await fetchTaipeiWeather(force)
      setDataset(nextDataset)
      setStatus('ready')
    } catch {
      setStatus('error')
    }
  }, [])

  const loadDay2Weather = useCallback(async (force = false) => {
    setDay2Status('loading')
    try {
      const nextBundle = await fetchDay2WeatherBundle(dayWeatherConfigs['day-2'], { force, testMode: day2TestMode })
      setDay2Bundle(nextBundle)
      setDay2Status('ready')
    } catch {
      setDay2Status('error')
    }
  }, [day2TestMode])

  useEffect(() => {
    let active = true
    void fetchTaipeiWeather()
      .then((nextDataset) => {
        if (!active) return
        setDataset(nextDataset)
        setStatus('ready')
      })
      .catch(() => {
        if (active) setStatus('error')
      })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    let active = true
    void fetchDay2WeatherBundle(dayWeatherConfigs['day-2'], { testMode: day2TestMode })
      .then((nextBundle) => {
        if (!active) return
        setDay2Bundle(nextBundle)
        setDay2Status('ready')
      })
      .catch(() => {
        if (active) setDay2Status('error')
      })
    return () => {
      active = false
    }
  }, [day2TestMode])

  useEffect(() => { void fetchYehliuOperation().then(setOperation) }, [])

  const value = useMemo<WeatherContextValue>(() => ({
    dataset,
    status,
    refresh: () => loadWeather(true),
    day2: {
      bundle: day2Bundle,
      status: day2Status,
      refresh: () => loadDay2Weather(true),
      operation,
    },
  }), [dataset, day2Bundle, day2Status, loadDay2Weather, loadWeather, operation, status])

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
}

export const useWeather = () => {
  const context = useContext(WeatherContext)
  if (!context) throw new Error('useWeather must be used inside WeatherProvider')
  return context
}
