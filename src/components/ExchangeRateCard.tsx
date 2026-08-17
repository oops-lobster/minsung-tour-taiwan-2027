import { useEffect, useMemo, useState } from 'react'
import { RefreshCw } from 'lucide-react'

interface RateState {
  rate: number
  updatedAt: string
  status: 'loading' | 'live' | 'fallback'
}

const FALLBACK_RATE = 44.3

export function useExchangeRate() {
  const [state, setState] = useState<RateState>({
    rate: FALLBACK_RATE,
    updatedAt: '오프라인 기준 환율',
    status: 'loading',
  })

  const refresh = async (signal?: AbortSignal) => {
    try {
      const response = await fetch('https://open.er-api.com/v6/latest/TWD', { signal })
      if (!response.ok) throw new Error('exchange-rate-request-failed')
      const data = await response.json() as {
        result: string
        time_last_update_utc: string
        rates: { KRW?: number }
      }
      if (data.result !== 'success' || !data.rates.KRW) throw new Error('exchange-rate-data-invalid')
      setState({
        rate: data.rates.KRW,
        updatedAt: new Intl.DateTimeFormat('ko-KR', {
          dateStyle: 'medium',
          timeStyle: 'short',
          timeZone: 'Asia/Seoul',
        }).format(new Date(data.time_last_update_utc)),
        status: 'live',
      })
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        setState({ rate: FALLBACK_RATE, updatedAt: '네트워크 연결 후 자동 갱신', status: 'fallback' })
      }
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    void refresh(controller.signal)
    return () => controller.abort()
  }, [])

  return { ...state, refresh: () => refresh() }
}

export function ExchangeRateCard({ rate, updatedAt, status, onRefresh }: RateState & { onRefresh: () => void }) {
  const [amount, setAmount] = useState('1000')
  const twd = Number(amount.replace(/,/g, '')) || 0
  const converted = useMemo(() => Math.round(twd * rate), [rate, twd])
  const quickAmounts = [100, 500, 1000, 2000, 5000]

  return (
    <article className="tool-card exchange-card" aria-labelledby="exchange-title">
      <div className="tool-card__heading">
        <div><small>LIVE CONVERTER</small><h2 id="exchange-title">TWD ↔ KRW 환율 계산기</h2></div>
        <button type="button" onClick={onRefresh} aria-label="환율 새로고침">
          <RefreshCw size={18} aria-hidden="true" />
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
          aria-describedby="exchange-result"
        />
      </div>
      <div className="currency-result" id="exchange-result" aria-live="polite">
        <span>원화 예상</span>
        <strong>약 {converted.toLocaleString('ko-KR')}원</strong>
      </div>
      <div className="quick-amounts" aria-label="빠른 금액 선택">
        {quickAmounts.map((value) => (
          <button type="button" onClick={() => setAmount(String(value))} key={value}>NT${value.toLocaleString()}</button>
        ))}
      </div>
      <p className={`data-status data-status--${status}`}>
        1 TWD ≈ {rate.toFixed(2)} KRW · {status === 'loading' ? '환율 불러오는 중' : updatedAt}
      </p>
    </article>
  )
}
