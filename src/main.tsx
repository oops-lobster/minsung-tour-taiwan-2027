import './data/day2GuihouUpdate'
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
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`, { scope: import.meta.env.BASE_URL })
      .catch((error) => console.error('Service worker registration failed:', error))
  })
}
