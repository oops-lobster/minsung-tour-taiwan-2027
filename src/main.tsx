import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './data/day1Update'
import './data/day1FlightUpdate'
import './data/day1LatestUpdate'
import App from './App'
import { WeatherProvider } from './components/WeatherProvider'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WeatherProvider>
      <App />
    </WeatherProvider>
  </StrictMode>,
)
