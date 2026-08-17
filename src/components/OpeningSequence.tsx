import { useEffect, useState } from 'react'
import { imagePath } from '../lib/paths'

const openingStorageKey = 'minsung-tour-opening-v2-seen'

export function OpeningSequence() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    return window.sessionStorage.getItem(openingStorageKey) !== 'true'
  })

  useEffect(() => {
    const replay = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      window.sessionStorage.removeItem(openingStorageKey)
      setVisible(true)
    }
    window.addEventListener('minsung-tour:replay-opening', replay)
    return () => window.removeEventListener('minsung-tour:replay-opening', replay)
  }, [])

  useEffect(() => {
    if (!visible) return
    document.documentElement.classList.add('opening-active')
    const timer = window.setTimeout(() => {
      setVisible(false)
      window.sessionStorage.setItem(openingStorageKey, 'true')
      document.documentElement.classList.remove('opening-active')
    }, 3200)

    return () => {
      window.clearTimeout(timer)
      document.documentElement.classList.remove('opening-active')
    }
  }, [visible])

  const dismiss = () => {
    setVisible(false)
    window.sessionStorage.setItem(openingStorageKey, 'true')
    document.documentElement.classList.remove('opening-active')
  }

  if (!visible) return null

  return (
    <div className="opening" role="dialog" aria-modal="true" aria-label="민성투어 오프닝">
      <img className="opening__backdrop" src={imagePath('hero.webp')} alt="" width="1600" height="1069" />
      <div className="opening__shade" />
      <div className="opening__curtain opening__curtain--left" />
      <div className="opening__curtain opening__curtain--right" />
      <div className="opening__grain" />
      <div className="opening__frame">
        <div className="opening__meta">
          <span>MIN SUNG TOUR</span>
          <span>PRIVATE JOURNEY · 001</span>
        </div>

        <div className="opening__content">
          <span className="opening__eyebrow">FOR OUR FAMILY, WITH CARE</span>
          <div className="opening__monogram" aria-hidden="true">
            <img src={imagePath('brand-logo.webp')} alt="" width="512" height="512" />
          </div>
          <div className="opening__title-mask">
            <h2>민성투어</h2>
          </div>
          <div className="opening__signature" aria-hidden="true"><i /><span>EST. 2027</span><i /></div>
          <p>부모님과 함께하는 타이베이 3박 4일</p>
        </div>

        <div className="opening__destination">
          <span>TAIPEI</span>
          <b>02.20 — 02.23</b>
          <span>TAIWAN</span>
        </div>
      </div>
      <button className="opening__skip" type="button" onClick={dismiss}>
        SKIP INTRO
      </button>
    </div>
  )
}
