import { useCallback, useEffect, useRef, useState } from 'react'
import { geolocationErrorMessage } from './yehliuGps'

export type YehliuGpsStatus = 'idle' | 'starting' | 'active' | 'denied' | 'timeout' | 'unavailable' | 'error'

export interface YehliuGpsPosition {
  lat: number
  lng: number
  accuracy: number
  heading: number | null
  timestamp: number
}

const errorStatus = (code: number): YehliuGpsStatus => {
  if (code === 1) return 'denied'
  if (code === 2) return 'unavailable'
  if (code === 3) return 'timeout'
  return 'error'
}

export function useYehliuGeolocation(mockEnabled: boolean) {
  const [status, setStatus] = useState<YehliuGpsStatus>('idle')
  const [position, setPosition] = useState<YehliuGpsPosition | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [highAccuracy, setHighAccuracy] = useState(true)
  const watchIdRef = useRef<number | null>(null)
  const lastUpdateRef = useRef(0)

  const clearWatch = useCallback(() => {
    if (watchIdRef.current !== null && 'geolocation' in navigator) navigator.geolocation.clearWatch(watchIdRef.current)
    watchIdRef.current = null
  }, [])

  const startWatch = useCallback((accuracyMode: boolean) => {
    setErrorMessage('')
    setStatus('starting')

    if (mockEnabled) {
      setStatus('active')
      return
    }
    if (!('geolocation' in navigator)) {
      setStatus('unavailable')
      setErrorMessage('이 브라우저는 GPS 위치 기능을 지원하지 않습니다. 지도와 해설은 계속 사용할 수 있습니다.')
      return
    }

    clearWatch()
    watchIdRef.current = navigator.geolocation.watchPosition(
      ({ coords, timestamp }) => {
        const now = Date.now()
        if (now - lastUpdateRef.current < 1_000) return
        lastUpdateRef.current = now
        const nextPosition: YehliuGpsPosition = {
          lat: coords.latitude,
          lng: coords.longitude,
          accuracy: coords.accuracy,
          heading: Number.isFinite(coords.heading) ? coords.heading : null,
          timestamp,
        }
        window.requestAnimationFrame(() => {
          setPosition(nextPosition)
          setStatus('active')
        })
      },
      (error) => {
        setStatus(errorStatus(error.code))
        setErrorMessage(geolocationErrorMessage(error.code))
      },
      accuracyMode
        ? { enableHighAccuracy: true, maximumAge: 3_000, timeout: 10_000 }
        : { enableHighAccuracy: false, maximumAge: 10_000, timeout: 10_000 },
    )
  }, [clearWatch, mockEnabled])

  const start = useCallback(() => startWatch(highAccuracy), [highAccuracy, startWatch])
  const refresh = useCallback(() => startWatch(highAccuracy), [highAccuracy, startWatch])

  const stop = useCallback(() => {
    clearWatch()
    setStatus('idle')
    setPosition(null)
    setErrorMessage('')
  }, [clearWatch])

  const changeAccuracyMode = useCallback((enabled: boolean) => {
    setHighAccuracy(enabled)
    if (status === 'active') startWatch(enabled)
  }, [startWatch, status])

  const setMockPosition = useCallback((nextPosition: YehliuGpsPosition) => {
    if (!mockEnabled) return
    setPosition(nextPosition)
    setErrorMessage('')
    setStatus('active')
  }, [mockEnabled])

  const setMockError = useCallback((code: number) => {
    if (!mockEnabled) return
    setPosition(null)
    setStatus(errorStatus(code))
    setErrorMessage(geolocationErrorMessage(code))
  }, [mockEnabled])

  useEffect(() => () => clearWatch(), [clearWatch])

  return {
    status,
    position,
    errorMessage,
    highAccuracy,
    active: status === 'active',
    start,
    refresh,
    stop,
    changeAccuracyMode,
    setMockPosition,
    setMockError,
  }
}
