import './data/day2GuihouUpdate'
import './data/g90ImageSourceUpdate'
import './data/koreaDepartureUpdate'
import './data/airportPickupUpdate'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
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

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    const hadController = Boolean(navigator.serviceWorker.controller)
    if (hadController) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload()
      }, { once: true })
    }
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`, { scope: import.meta.env.BASE_URL })
      .then((registration) => registration.update())
      .catch((error) => console.error('Service worker registration failed:', error))
  })
}
