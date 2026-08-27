import { useState } from 'react'
import { CarTaxiFront, Check, ChevronDown, Copy, Hotel, MapPin, MessageSquareText, Navigation } from 'lucide-react'
import type { PlaceInfo } from '../data/localTools'
import { googleMapsDirectionsUrl, googleMapsPlaceUrl, uberDestinationUrl } from '../lib/paths'

interface PlaceActionsProps {
  place: PlaceInfo
  compact?: boolean
}

export function PlaceActions({ place, compact = false }: PlaceActionsProps) {
  const [copied, setCopied] = useState(false)

  const copyForDriver = async () => {
    const text = `${place.localName}\n${place.address}`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className={`place-actions ${compact ? 'place-actions--compact' : ''}`}>
      <div className="place-actions__buttons">
        <a href={googleMapsPlaceUrl(place.latitude, place.longitude, place.localName)} target="_blank" rel="noreferrer">
          <MapPin size={18} aria-hidden="true" />
          <span>지도 보기</span>
        </a>
        <a href={googleMapsDirectionsUrl(place.latitude, place.longitude)} target="_blank" rel="noreferrer">
          <Navigation size={18} aria-hidden="true" />
          <span>길찾기</span>
        </a>
        <a href={uberDestinationUrl(place.latitude, place.longitude, place.name, place.address)} target="_blank" rel="noreferrer">
          <CarTaxiFront size={18} aria-hidden="true" />
          <span>Uber 이동</span>
        </a>
      </div>
      <details className="driver-reveal">
        <summary>
          <span><MessageSquareText size={18} aria-hidden="true" /> 기사님께 보여주기</span>
          <ChevronDown size={18} aria-hidden="true" />
        </summary>
        <div className="driver-reveal__card">
          <small>{place.name}</small>
          <strong lang="zh-Hant">{place.localName}</strong>
          <p lang="zh-Hant">{place.address}</p>
          <button type="button" onClick={copyForDriver} aria-live="polite">
            {copied ? <Check size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />}
            {copied ? '복사했어요' : '중국어 주소 복사'}
          </button>
        </div>
      </details>
    </div>
  )
}

export function HotelReturnButton({ hotel }: { hotel: PlaceInfo }) {
  return (
    <a
      className="hotel-return-button"
      href={googleMapsDirectionsUrl(hotel.latitude, hotel.longitude)}
      target="_blank"
      rel="noreferrer"
      aria-label="현재 위치에서 Taipei Garden Hotel까지 길찾기"
    >
      <Hotel size={19} aria-hidden="true" />
      <span className="hotel-return-button__full">호텔로 돌아가기</span>
      <span className="hotel-return-button__short">호텔</span>
      <Navigation size={16} aria-hidden="true" />
    </a>
  )
}
