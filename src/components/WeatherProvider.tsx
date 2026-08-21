import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  fetchTaipeiWeather,
  type TaiwanWeatherDataset,
  type WeatherLoadStatus,
} from '../lib/weather'

interface WeatherContextValue {
  dataset: TaiwanWeatherDataset | null
  status: WeatherLoadStatus
  refresh: () => Promise<void>
}

const WeatherContext = createContext<WeatherContextValue | null>(null)

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [dataset, setDataset] = useState<TaiwanWeatherDataset | null>(null)
  const [status, setStatus] = useState<WeatherLoadStatus>('loading')

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

  const value = useMemo<WeatherContextValue>(() => ({
    dataset,
    status,
    refresh: () => loadWeather(true),
  }), [dataset, loadWeather, status])

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
}

export const useWeather = () => {
  const context = useContext(WeatherContext)
  if (!context) throw new Error('useWeather must be used inside WeatherProvider')
  return context
}
