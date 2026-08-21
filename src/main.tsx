import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './data/day1Update'
import './data/day1FlightUpdate'
import App from './App'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
