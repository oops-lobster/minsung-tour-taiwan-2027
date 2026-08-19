import { useCallback, useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'

type RateStatus = 'loading' | 'live' | 'cached' | 'fallback'

interface RateState {
  rate: number
  updatedAt: string
  status: RateStatus
}

interface RateCache {
  rate: number
  lastUpdatedAt: number
  nextUpdateAt: number
}

interface RateResponse {
  result: string
  time_last_update_unix: number
  time_next_update_unix: number
  rates: { KRW?: number }
}

const FALLBACK_RATE = 44.3
const RATE_CACHE_KEY = 'minsung-tour-exchange-v2'
const MAX_TIMER_DELAY = 2_147_000_000
const QUICK_AMOUNTS = [100, 500, 1000, 2000, 5000]

function formatRateDate(timestamp: number) {
  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Seoul',
  }).format(new Date(timestamp))
}

function readRateCache(): RateCache | null {
  try {
    const cached = JSON.parse(window.localStorage.getItem(RATE_CACHE_KEY) ?? 'null') as Partial<RateCache> | null
    if (
      cached
      && Number.isFinite(cached.rate)
      && Number.isFinite(cached.lastUpdatedAt)
      && Number.isFinite(cached.nextUpdateAt)
    ) {
      return cached as RateCache
    }
  } catch {
    // A fresh request below will replace an unreadable cache.
  }
  return null
}

function stateFromCache(cache: RateCache): RateState {
  return {
    rate: cache.rate,
    updatedAt: formatRateDate(cache.lastUpdatedAt),
    status: 'cached',
  }
}

export function useExchangeRate() {
  const [state, setState] = useState<RateState>(() => {
    const cached = readRateCache()
    return cached
      ? stateFromCache(cached)
      : { rate: FALLBACK_RATE, updatedAt: '네트워크 연결 후 자동 갱신', status: 'loading' }
  })
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchLatestRate = useCallback(async (signal?: AbortSignal) => {
    if (!signal?.aborted) setIsRefreshing(true)
    try {
      const response = await fetch('https://open.er-api.com/v6/latest/TWD', { signal })
      if (!response.ok) throw new Error('exchange-rate-request-failed')
      const data = await response.json() as RateResponse
      const rate = data.rates.KRW
      if (
        data.result !== 'success'
        || !Number.isFinite(rate)
        || !Number.isFinite(data.time_last_update_unix)
        || !Number.isFinite(data.time_next_update_unix)
      ) {
        throw new Error('exchange-rate-data-invalid')
      }

      const cache: RateCache = {
        rate: rate as number,
        lastUpdatedAt: data.time_last_update_unix * 1000,
        nextUpdateAt: data.time_next_update_unix * 1000,
      }
      try {
        window.localStorage.setItem(RATE_CACHE_KEY, JSON.stringify(cache))
      } catch {
        // The live rate still works when browser storage is unavailable.
      }
      if (!signal?.aborted) {
        setState({ rate: cache.rate, updatedAt: formatRateDate(cache.lastUpdatedAt), status: 'live' })
      }
      return cache.nextUpdateAt
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        setState((current) => ({
          rate: current.rate,
          updatedAt: current.status === 'loading'
            ? '네트워크 연결 후 자동 갱신'
            : `${current.updatedAt} 기준 · 저장된 환율`,
          status: 'fallback',
        }))
      }
      return null
    } finally {
      if (!signal?.aborted) setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    let timer: number | undefined

    const scheduleNextUpdate = (nextUpdateAt: number) => {
      const delay = Math.min(Math.max(nextUpdateAt - Date.now() + 60_000, 60_000), MAX_TIMER_DELAY)
      timer = window.setTimeout(async () => {
        const next = await fetchLatestRate(controller.signal)
        if (next && !controller.signal.aborted) scheduleNextUpdate(next)
      }, delay)
    }

    const cached = readRateCache()
    if (cached && cached.nextUpdateAt > Date.now()) {
      setState(stateFromCache(cached))
      scheduleNextUpdate(cached.nextUpdateAt)
    } else {
      void fetchLatestRate(controller.signal).then((next) => {
        if (next && !controller.signal.aborted) scheduleNextUpdate(next)
      })
    }

    return () => {
      controller.abort()
      if (timer !== undefined) window.clearTimeout(timer)
    }
  }, [fetchLatestRate])

  const refresh = useCallback(() => {
    void fetchLatestRate()
  }, [fetchLatestRate])

  return { ...state, isRefreshing, refresh }
}

export function ExchangeRateCard({
  rate,
  updatedAt,
  status,
  isRefreshing,
  onRefresh,
}: RateState & { isRefreshing: boolean; onRefresh: () => void }) {
  const [amount, setAmount] = useState('1000')
  const twd = Number(amount.replace(/,/g, '')) || 0
  const converted = Math.round(twd * rate)
  const statusText = status === 'loading'
    ? '환율 불러오는 중'
    : status === 'fallback'
      ? updatedAt
      : `${updatedAt} 기준 · 매일 자동 갱신`

  return (
    <article className="tool-card exchange-card" aria-labelledby="exchange-title" aria-busy={isRefreshing}>
      <div className="tool-card__heading">
        <div><small>DAILY EXCHANGE</small><h2 id="exchange-title">TWD → KRW 환율 계산기</h2></div>
        <button type="button" onClick={onRefresh} disabled={isRefreshing} aria-label={isRefreshing ? '환율 갱신 중' : '환율 지금 새로고침'}>
          <RefreshCw className={isRefreshing ? 'is-spinning' : undefined} size={18} aria-hidden="true" />
        </button>
      </div>
      <label htmlFor="twd-amount">대만달러</label>
      <div className="currency-input">
        <span>NT$</span>
        <input
          id="twd-amount"
          value={amount}
          onChange={(event) => setAmount(event.target.value.replace(/[^0-9]/g, ''))}
          inputMode="numeric"
          pattern="[0-9]*"
          aria-describedby="exchange-result exchange-status"
        />
      </div>
      <div className="currency-result" id="exchange-result" aria-live="polite">
        <span>원화 예상</span>
        <strong>약 {converted.toLocaleString('ko-KR')}원</strong>
      </div>
      <div className="quick-amounts" aria-label="빠른 금액 선택">
        {QUICK_AMOUNTS.map((value) => (
          <button type="button" onClick={() => setAmount(String(value))} key={value}>NT${value.toLocaleString()}</button>
        ))}
      </div>
      <p className={`data-status data-status--${status}`} id="exchange-status" aria-live="polite">
        1 TWD ≈ {rate.toFixed(2)} KRW · {statusText}
      </p>
      <p className="exchange-provider">
        참고 환율이며 실제 환전·카드 적용 환율과 다를 수 있습니다.{' '}
        <a href="https://www.exchangerate-api.com" target="_blank" rel="noreferrer">Rates by ExchangeRate-API</a>
      </p>
    </article>
  )
}
