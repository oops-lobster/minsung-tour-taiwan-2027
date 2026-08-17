export const imagePath = (file: string) => `${import.meta.env.BASE_URL}images/${file}`

export const googleMapsUrl = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
