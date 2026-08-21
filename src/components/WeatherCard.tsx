import { CloudRain, ExternalLink, RefreshCw, Wind } from 'lucide-react'
import { getTodayWeatherSummary } from '../lib/weather'
import { useWeather } from './WeatherProvider'

const weatherLabel = (code: number) => {
  if (code === 0) return '맑음'
  if (code <= 3) return '구름 조금'
  if (code <= 48) return '안개'
  if (code <= 67) return '비'
  if (code <= 77) return '눈 또는 싸락눈'
  if (code <= 82) return '소나기'
  return '뇌우 가능'
}

export function WeatherCard() {
  const { dataset, status, refresh } = useWeather()
  const weather = dataset ? getTodayWeatherSummary(dataset) : null
  const strongWind = weather ? (weather.windGust ?? 0) >= 40 || weather.windSpeed >= 30 : false

  return (
    <article className="tool-card weather-card" aria-labelledby="weather-title">
      <div className="tool-card__heading">
        <div><small>TAIPEI NOW</small><h2 id="weather-title">Taiwan Weather</h2></div>
        <button type="button" onClick={() => void refresh()} aria-label="날씨 새로고침" disabled={status === 'loading'}>
          <RefreshCw className={status === 'loading' ? 'is-spinning' : ''} size={18} aria-hidden="true" />
        </button>
      </div>
      {status === 'loading' && !weather && <p className="tool-loading" aria-live="polite">타이베이 날씨를 불러오고 있어요.</p>}
      {status === 'error' && (
        <div className="tool-error" role="alert">
          <p>날씨를 불러오지 못했습니다. 네트워크를 확인해 주세요.</p>
          <button type="button" onClick={() => void refresh()}>다시 시도</button>
        </div>
      )}
      {weather && status !== 'error' && (
        <>
          <div className="weather-now">
            <div><span>현재</span><strong>{weather.temperature.toFixed(1)}°</strong><small>{weatherLabel(weather.weatherCode)}</small></div>
            <div><CloudRain size={21} aria-hidden="true" /><span>오늘 강수확률</span><strong>{weather.precipitationProbability === undefined ? '—' : `${weather.precipitationProbability}%`}</strong><small>현재 강수 {weather.precipitation}mm</small></div>
            <div><Wind size={21} aria-hidden="true" /><span>바람</span><strong>{weather.windSpeed.toFixed(0)}km/h</strong><small>최대 돌풍 {weather.windGust === undefined ? '—' : `${weather.windGust.toFixed(0)}km/h`}</small></div>
          </div>
          <div className={`weather-alert ${strongWind ? 'weather-alert--warning' : ''}`}>
            <strong>{strongWind ? '강풍 가능성 있음' : '현재 강풍 징후 낮음'}</strong>
            <p>태풍 여부는 지점 예보만으로 판단하지 않고 대만 중앙기상서 공식 특보를 확인합니다.</p>
          </div>
          <div className="weather-links">
            <a href="https://www.cwa.gov.tw/V8/C/P/Typhoon/TY_NEWS.html" target="_blank" rel="noreferrer">
              태풍·기상 특보 확인 <ExternalLink size={15} aria-hidden="true" />
            </a>
            <button type="button" onClick={() => document.getElementById('tools-weather-plans')?.scrollIntoView({ behavior: 'smooth' })}>Plan B 요약 보기</button>
          </div>
          <p className="data-status">타이베이 시간 {weather.updatedAt} · Open-Meteo</p>
        </>
      )}
    </article>
  )
}
