import { useEffect, useState } from 'react'

export function OpeningSequence() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    return window.sessionStorage.getItem('minsung-tour-opening-seen') !== 'true'
  })

  useEffect(() => {
    if (!visible) return
    document.documentElement.classList.add('opening-active')
    const timer = window.setTimeout(() => {
      setVisible(false)
      window.sessionStorage.setItem('minsung-tour-opening-seen', 'true')
      document.documentElement.classList.remove('opening-active')
    }, 2200)

    return () => {
      window.clearTimeout(timer)
      document.documentElement.classList.remove('opening-active')
    }
  }, [visible])

  const dismiss = () => {
    setVisible(false)
    window.sessionStorage.setItem('minsung-tour-opening-seen', 'true')
    document.documentElement.classList.remove('opening-active')
  }

  if (!visible) return null

  return (
    <div className="opening" role="presentation">
      <div className="opening__grain" />
      <div className="opening__content" aria-hidden="true">
        <span className="opening__eyebrow">A PRIVATE FAMILY JOURNEY</span>
        <div className="opening__title" aria-label="민성투어">
          {'민성투어'.split('').map((letter, index) => (
            <span key={letter} style={{ '--letter-index': index } as React.CSSProperties}>
              {letter}
            </span>
          ))}
        </div>
        <span className="opening__line" />
        <div className="opening__destination">
          <strong>TAIWAN</strong>
          <span>2027</span>
        </div>
        <p>02.20 — 02.23</p>
      </div>
      <button className="opening__skip" type="button" onClick={dismiss}>
        바로 보기
      </button>
    </div>
  )
}
