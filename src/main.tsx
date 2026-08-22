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
