export const imagePath = (file: string) => `${import.meta.env.BASE_URL}images/${file}`

export const googleMapsUrl = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`

export const googleMapsPlaceUrl = (latitude: number, longitude: number, label: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${latitude},${longitude} ${label}`)}`

export const googleMapsDirectionsUrl = (latitude: number, longitude: number) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${latitude},${longitude}`)}&travelmode=driving&dir_action=navigate`

export const uberDestinationUrl = (
  latitude: number,
  longitude: number,
  nickname: string,
  address: string,
) => {
  const params = new URLSearchParams({
    action: 'setPickup',
    pickup: 'my_location',
    'dropoff[latitude]': String(latitude),
    'dropoff[longitude]': String(longitude),
    'dropoff[nickname]': nickname,
    'dropoff[formatted_address]': address,
  })
  return `https://m.uber.com/ul/?${params.toString()}`
}

export const googleTranslateUrl = (text = '') => {
  const params = new URLSearchParams({ sl: 'ko', tl: 'zh-TW', text, op: 'translate' })
  return `https://translate.google.com/?${params.toString()}`
}
